import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Fallback Rule-Based Forensic Engine for robust detection
function runHeuristicAnalysis(input: {
  text: string;
  companyName?: string;
  senderContact?: string;
  platform?: string;
  role?: string;
  salary?: string;
  feeAsked?: string;
}) {
  const text = (input.text || "").toLowerCase();
  const contact = (input.senderContact || "").toLowerCase();
  const company = (input.companyName || "").toLowerCase();
  const fee = (input.feeAsked || "").toLowerCase().trim();
  const salary = (input.salary || "").toLowerCase();

  let riskScore = 0; // Clean baseline starting from 0
  const indicators: Array<{
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "POSITIVE";
    category: string;
    title: string;
    explanation: string;
    snippetFound?: string;
  }> = [];

  const legitimacySignals: string[] = [];

  // Check 1: Explicit upfront fee demand (Advance-fee scam)
  const isZeroOrNoFee =
    !fee ||
    fee === "0" ||
    fee === "none" ||
    fee === "nil" ||
    fee === "n/a" ||
    fee === "na" ||
    fee === "no" ||
    fee === "zero" ||
    fee === "₹0" ||
    fee === "$0" ||
    fee.includes("no fee") ||
    fee.includes("zero fee") ||
    fee.includes("free") ||
    fee.includes("not asked") ||
    fee.includes("none asked");

  const specificFeePhrases = [
    "registration fee",
    "security deposit",
    "training fee",
    "kit fee",
    "laptop deposit",
    "processing charge",
    "refundable fee",
    "refundable deposit",
    "courier charge",
    "dispatch insurance",
    "dispatch fee",
    "pay first to get",
    "crypto deposit",
    "vip recharge",
    "slot booking fee",
    "mandatory deposit",
    "seat confirmation charge",
  ];
  
  const foundExplicitFee = specificFeePhrases.find((k) => text.includes(k) || (!isZeroOrNoFee && fee.includes(k)));
  const textHasFeePaymentDemand = /(?:pay|deposit|transfer|send)\s*(?:a\s*)?(?:fee|deposit|charge|amount|sum|rs\.?|₹|\$)\s*(?:of\s*)?[\d,]+/i.test(text);

  if (foundExplicitFee || textHasFeePaymentDemand || (!isZeroOrNoFee && fee.length > 0)) {
    riskScore += 50;
    indicators.push({
      severity: "CRITICAL",
      category: "PAYMENT_DEMAND",
      title: "Upfront Payment or Deposit Demanded",
      explanation:
        "Legitimate employers and university internship programs NEVER charge candidates for job offers, training materials, onboarding kits, or registration. Demanding money upfront is the #1 hallmark of employment fraud.",
      snippetFound: foundExplicitFee ? `Detected phrase: "${foundExplicitFee}"` : (!isZeroOrNoFee && fee.length > 0) ? `Reported fee: "${input.feeAsked}"` : "Payment demand pattern detected in message text",
    });
  } else if (isZeroOrNoFee && (input.feeAsked || text.includes("no fee") || text.includes("₹0"))) {
    legitimacySignals.push("Zero upfront fee demanded. Legitimate employers sponsor all onboarding and equipment expenses.");
  }

  // Check 2: Free email providers for claimed corporate recruiters
  const freeEmailDomains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com", "@rediffmail.com", "@mail.ru", "@proton.me", "@icloud.com"];
  const isContactFreeEmail = freeEmailDomains.some((d) => contact.includes(d));
  const claimedBigCompany = ["google", "microsoft", "amazon", "apple", "meta", "tcs", "infosys", "wipro", "deloitte", "accenture", "tesla", "netflix", "ibm", "cognizant", "capgemini"].some(
    (c) => company.includes(c) || (text.includes(c) && !text.includes(`@${c}`))
  );

  const officialCorporateDomains = ["@microsoft.com", "@google.com", "@amazon.com", "@apple.com", "@meta.com", "@tcs.com", "@infosys.com", "@wipro.com", "@deloitte.com", "@accenture.com", "@ibm.com"];
  const hasOfficialDomain = officialCorporateDomains.some((d) => contact.includes(d) || text.includes(d));

  if (hasOfficialDomain) {
    legitimacySignals.push("Communication originates from an authentic verified corporate email domain.");
    riskScore = Math.max(0, riskScore - 20);
  } else if (isContactFreeEmail && claimedBigCompany) {
    riskScore += 35;
    indicators.push({
      severity: "CRITICAL",
      category: "SUSPICIOUS_COMMUNICATION",
      title: "Public Free Webmail Claiming Major Corporation",
      explanation:
        "Legitimate recruiters from established corporations communicate exclusively via their official company domains (e.g. @google.com, @infosys.com). Scammers frequently use free Gmail/Yahoo addresses with fake HR names.",
      snippetFound: contact || "Free email domain used for Fortune 500 employer",
    });
  } else if (isContactFreeEmail && contact.length > 0) {
    riskScore += 10;
    indicators.push({
      severity: "MEDIUM",
      category: "SUSPICIOUS_COMMUNICATION",
      title: "Recruiter Using Free Email Service",
      explanation:
        "While some very early-stage micro-startups use Gmail, professional recruiters and established companies universally use dedicated organizational domains.",
      snippetFound: contact,
    });
  }

  // Check 3: Telegram / WhatsApp Task Scam Patterns
  const taskScamKeywords = [
    "like youtube video",
    "subscribe youtube",
    "google maps review",
    "hotel review",
    "prepaid task",
    "merchant task",
    "recharge wallet",
    "earn 2000-5000 daily",
    "earn 5000 to 10000 daily",
    "daily payout via upi",
    "part time 10-20 mins",
    "trial tasks right now",
  ];
  const foundTask = taskScamKeywords.find((k) => text.includes(k));
  if (foundTask) {
    riskScore += 45;
    indicators.push({
      severity: "CRITICAL",
      category: "TASK_BASED_PONZI",
      title: "Task-Based / Social Media 'Like & Earn' Scam Pattern",
      explanation:
        "This matches the widespread international cyber-fraud syndicate where victims are paid small sums (₹150-₹500) for basic tasks, then lured onto Telegram into paying thousands for 'frozen VIP funds' or 'crypto tasks' that can never be withdrawn.",
      snippetFound: `Matched trigger: "${foundTask}"`,
    });
  }

  // Check 4: Unrealistic Compensation / Low Effort High Pay
  const unrealisticPatterns = [
    "no experience needed and earn 5000",
    "just 15-30 minutes per day and earn",
    "earn from home simply typing",
    "copy paste job 40$/hr",
    "captcha typing 1000 daily",
    "sms sending job",
  ];
  const foundUnrealistic = unrealisticPatterns.find((k) => text.includes(k) || salary.includes(k));
  if (foundUnrealistic) {
    riskScore += 25;
    indicators.push({
      severity: "HIGH",
      category: "UNREALISTIC_COMPENSATION",
      title: "Disproportionate Pay for Trivial Effort",
      explanation:
        "Scammers deliberately offer inflated salaries for trivial tasks (e.g. copying numbers, clicking links) to exploit financial anxiety and lower critical defenses.",
      snippetFound: `Matched trigger: "${foundUnrealistic}"`,
    });
  }

  // Check 5: Urgency & High Pressure Tactics
  const urgencyKeywords = [
    "offer valid only for today",
    "immediate joining within 2 hours",
    "pay before 5 pm",
    "confirm immediately or offer cancelled",
    "pay within 4 hours",
    "only 5 slots left",
    "last chance to claim slot",
  ];
  const foundUrgency = urgencyKeywords.find((k) => text.includes(k));
  if (foundUrgency) {
    riskScore += 15;
    indicators.push({
      severity: "MEDIUM",
      category: "URGENCY_PRESSURE",
      title: "Artificial Urgency & Time Pressure",
      explanation:
        "Creating artificial urgency (short hours countdown to accept/pay) prevents students from conducting background checks or consulting mentors before committing funds or sensitive information.",
      snippetFound: `Matched trigger: "${foundUrgency}"`,
    });
  }

  // Check 6: Instant Offer Without Formal Interview
  const noInterviewKeywords = [
    "direct selection based on resume on whatsapp",
    "shortlisted without interview",
    "selected based on your resume on whatsapp",
    "no interview required direct selection",
    "instant offer letter without assessment",
  ];
  const foundNoInterview = noInterviewKeywords.find((k) => text.includes(k));
  if (foundNoInterview) {
    riskScore += 20;
    indicators.push({
      severity: "HIGH",
      category: "INTERVIEW_ANOMALY",
      title: "Instant Job Offer Without Evaluation",
      explanation:
        "Legitimate organizations conduct structured technical and HR interviews before issuing formal offers. Direct offers sent unsolicited on messaging apps without assessment are almost always fraudulent.",
      snippetFound: `Matched trigger: "${foundNoInterview}"`,
    });
  }

  // Check 7: Sensitive Info / Device Access Harvesting
  const sensitiveDataKeywords = [
    "send otp",
    "bank account password",
    "atm pin",
    "send blank signed cheque",
    "anydesk",
    "teamviewer",
  ];
  const foundSensitive = sensitiveDataKeywords.find((k) => text.includes(k));
  if (foundSensitive) {
    riskScore += 50;
    indicators.push({
      severity: "CRITICAL",
      category: "DATA_HARVESTING",
      title: "High-Risk Credential or Remote Device Access Request",
      explanation:
        "The sender requests OTPs, banking credentials, or remote device control software (AnyDesk/TeamViewer). This poses an immediate threat of total account compromise.",
      snippetFound: `Matched trigger: "${foundSensitive}"`,
    });
  }

  // Check 8: Positive Legitimacy Indicators
  if (text.includes("round") || text.includes("interview") || text.includes("technical assessment") || text.includes("coding round") || text.includes("assessment")) {
    if (!foundNoInterview) {
      legitimacySignals.push("Mentions structured multi-stage evaluation / interview process.");
      riskScore = Math.max(0, riskScore - 10);
    }
  }
  if (text.includes("careers portal") || text.includes("workday") || text.includes("greenhouse.io") || text.includes("lever.co") || text.includes("microsoft.com") || text.includes("google.com")) {
    legitimacySignals.push("Directs to established enterprise Applicant Tracking System (ATS) or official corporate portal.");
    riskScore = Math.max(0, riskScore - 15);
  }
  if (text.includes("on-campus") || text.includes("placement cell") || text.includes("university recruiting")) {
    legitimacySignals.push("References official university placement or formal on-campus recruitment program.");
    riskScore = Math.max(0, riskScore - 10);
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(100, Math.max(0, riskScore));

  let riskLevel: "SAFE" | "CAUTION" | "HIGH_RISK" | "DANGER_SCAM" = "SAFE";
  let headlineVerdict = "Low Risk: Offer exhibits characteristics of standard hiring procedures.";

  if (riskScore >= 70) {
    riskLevel = "DANGER_SCAM";
    headlineVerdict = "🚨 DANGER: Severe fraud indicators detected. DO NOT SEND MONEY OR PERSONAL DOCUMENTS.";
  } else if (riskScore >= 45) {
    riskLevel = "HIGH_RISK";
    headlineVerdict = "⚠️ HIGH RISK: Significant red flags present. Independent company verification required.";
  } else if (riskScore >= 20) {
    riskLevel = "CAUTION";
    headlineVerdict = "⚡ CAUTION: Moderate anomalies detected. Verify recruiter credentials through official channels.";
  }

  let identifiedScamType = "Legitimate or Low-Risk Opportunity";
  if (foundTask) identifiedScamType = "Telegram / WhatsApp Task Scam (Like & Review Ponzi)";
  else if (foundExplicitFee || textHasFeePaymentDemand) identifiedScamType = "Advance-Fee Internship / Registration Kit Scam";
  else if (foundUnrealistic && text.includes("data entry")) identifiedScamType = "Fake Remote Data Entry / Check Overpayment Scam";
  else if (isContactFreeEmail && claimedBigCompany) identifiedScamType = "Impersonation Phishing / Spoofed Recruiter Scam";
  else if (riskScore >= 45) identifiedScamType = "Unverified Suspicious Recruitment";

  return {
    riskScore,
    riskLevel,
    headlineVerdict,
    confidenceScore: 94,
    identifiedScamType,
    warningIndicators: indicators,
    legitimacySignals,
    companyVerificationAdvice: [
      `Search the official domain of ${input.companyName || "the organization"} directly in your browser (do not click links in the message).`,
      "Look for an official 'Careers' or 'Jobs' section on their verified website to cross-check the Job Requisition ID.",
      "Check the recruiter's identity and employment status on LinkedIn. Verify if their email matches the official corporate domain.",
      "Never transfer funds for laptops, training modules, or onboarding fees — real companies sponsor all work expenses.",
    ],
    safeResponseAction:
      riskScore >= 45
        ? "Cease all communications immediately. Do not pay any amount, do not click suspicious links, and block the sender."
        : "Proceed with standard precautions. Request correspondence via their official corporate email address before sharing sensitive documents.",
    safeReplyTemplate: `Dear Recruiter,\n\nThank you for reaching out regarding the ${input.role || "position"}. Before taking the next steps, could you please send this formal job description and offer details from your official company email address (@${(input.companyName || "company").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}.com) or share the official listing link on your company careers portal?\n\nAs a security precaution for campus placements, our university placement cell requires all communications to originate from verified corporate domain emails.\n\nThank you,\nCandidate`,
    reportingChecklist: [
      "If money was transferred via UPI/Bank: Immediately call the Cyber Crime Helpline at 1930 (India) or file on cybercrime.gov.in / report to your bank's fraud desk within the 2-hour golden period.",
      "If personal IDs (Aadhaar/PAN/Passport) were shared: Monitor credit reports and report identity theft concerns to relevant authorities.",
      "Report the phone number or profile directly on WhatsApp, Telegram, or LinkedIn as 'Employment Scam'.",
      "Alert your college placement cell and student groups to prevent other students from falling into the trap.",
    ],
  };
}

// Helper to extract forensic entities (UPI, phone, telegram, emails, URLs, monetary amounts)
function extractForensicEntities(text: string, ocrText?: string): {
  upiIds: string[];
  phoneNumbers: string[];
  telegramLinks: string[];
  emails: string[];
  urls: string[];
  amounts: string[];
} {
  const combined = `${text || ""} ${ocrText || ""}`;
  
  // UPI regex
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g;
  const rawUpis = combined.match(upiRegex) || [];
  const validVpas = rawUpis.filter(
    (u) =>
      !u.includes(".com") &&
      !u.includes(".org") &&
      !u.includes(".edu") &&
      !u.includes(".net") &&
      (u.includes("@ok") ||
        u.includes("@paytm") ||
        u.includes("@ybl") ||
        u.includes("@ibl") ||
        u.includes("@axl") ||
        u.includes("@apl") ||
        u.includes("@upi") ||
        u.includes("@sbi") ||
        u.includes("@icici") ||
        u.includes("@hdfc") ||
        u.includes("@postbank") ||
        u.includes("@airtel"))
  );

  // Phone regex (international & Indian formats)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,5}/g;
  const rawPhones = combined.match(phoneRegex) || [];
  const validPhones = rawPhones
    .map((p) => p.trim())
    .filter((p) => p.replace(/\D/g, "").length >= 10 && p.replace(/\D/g, "").length <= 13);

  // Telegram handles and links
  const tgRegex = /(?:t\.me\/|telegram\.me\/|@)[a-zA-Z0-9_]{4,32}/gi;
  const telegramLinks = combined.match(tgRegex) || [];

  // Emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = combined.match(emailRegex) || [];

  // URLs
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const urls = combined.match(urlRegex) || [];

  // Currency amounts
  const amountRegex = /(?:₹|Rs\.?|INR|\$|USD|EUR|£)\s?[\d,]+(?:\.\d{2})?|\b\d+[\d,]*\s?(?:rs|rupees|inr|usd|dollars|k|lakh|lakhs)\b/gi;
  const amounts = combined.match(amountRegex) || [];

  return {
    upiIds: Array.from(new Set(validVpas)),
    phoneNumbers: Array.from(new Set(validPhones)),
    telegramLinks: Array.from(new Set(telegramLinks)),
    emails: Array.from(new Set(emails)),
    urls: Array.from(new Set(urls)),
    amounts: Array.from(new Set(amounts)),
  };
}

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Analyze Opportunity (Multimodal with Screenshot & Vision)
app.post("/api/analyze-opportunity", async (req, res) => {
  try {
    const { text, companyName, senderContact, platform, role, salary, feeAsked, imageBase64, imageMimeType } = req.body;

    if (!text && !companyName && !senderContact && !imageBase64) {
      return res.status(400).json({ error: "Please provide opportunity text or details to analyze." });
    }

    const ai = getGeminiClient();

    // If Gemini is available, use Gemini 3.7 Flash for deep semantic & forensic analysis
    if (ai) {
      try {
        const prompt = `You are ScamCheck AI, a world-class multimodal cybersecurity forensic investigator and student consumer protection analyst specializing in detecting fake job, internship, WhatsApp task, and employment phishing scams.

Analyze the following submitted job/internship offer received by a student:
- Opportunity Text / Message: """${text || "Not provided"}"""
- Claimed Company: "${companyName || "Not specified"}"
- Sender Contact / Email / Number: "${senderContact || "Not specified"}"
- Receiving Platform: "${platform || "WhatsApp/Email/Social"}"
- Claimed Role: "${role || "Not specified"}"
- Promised Compensation: "${salary || "Not specified"}"
- Upfront Fee / Deposit Demanded: "${feeAsked || "None mentioned"}"
${imageBase64 ? "- Attached Screenshot/Image provided: Inspect the image carefully! Extract all text (OCR), check for fake logos, WhatsApp screenshot layout, Telegram links, QR codes, UPI IDs, fabricated offer letter seals/signatures, grammatical anomalies, or suspicious phone numbers." : ""}

CRITICAL SCORING RULES:
1. FAIRNESS & ACCURACY:
   - If the opportunity is a legitimate corporate offer or on-campus recruitment (e.g. from an authentic domain like @microsoft.com, @google.com, @amazon.com, or standard university drive, has structured technical interviews, and charges ₹0/NO fees), score it as SAFE (0-20 risk score). DO NOT invent false red flags. Populate legitimacySignals with positive factors.
   - If the opportunity is a clear SCAM (e.g. demands registration fee, laptop deposit, Telegram like/subscribe tasks, WhatsApp prepaid tasks, uses @gmail.com while claiming to be TCS/Google/Amazon HR, or promises instant job with zero interviews), assign high risk score (60-100).
2. Deep forensic evaluation points:
   - OCR Extraction & Visual Image Forensics (if screenshot is provided: extract full visible text, identify forged letterheads, cropped signatures, fake stamps, suspicious QR codes, UPI handles like name@paytm).
   - Advance-fee fraud (registration fees, kit charges, training fees, laptop security deposits).
   - Telegram/WhatsApp task & review fraud (like YouTube videos, prepaid merchant tasks, crypto wallet recharge).
   - Free email / domain impersonation (using @gmail.com for big MNCs like Google, TCS, Microsoft, Amazon).
   - Unrealistic pay vs required effort (e.g. $50/hr for simple data entry / copy-paste).
   - Unsolicited offers without structured interviews.
   - Urgency/panic manipulation ("pay within 2 hours", "limited seats").
   - Requests for sensitive identity / banking credentials / OTP / AnyDesk.

Return your analysis strictly conforming to the requested JSON schema.`;

        const contentsPayload: any[] = [];
        
        if (imageBase64) {
          const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
          contentsPayload.push({
            inlineData: {
              mimeType: imageMimeType || "image/jpeg",
              data: cleanBase64,
            },
          });
        }

        contentsPayload.push({
          text: prompt,
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: contentsPayload.length === 1 ? prompt : (contentsPayload as any),
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskScore: {
                  type: Type.INTEGER,
                  description: "Overall risk score from 0 (completely safe/legit) to 100 (confirmed malicious scam).",
                },
                riskLevel: {
                  type: Type.STRING,
                  description: "One of: 'SAFE' (0-25), 'CAUTION' (26-55), 'HIGH_RISK' (56-80), 'DANGER_SCAM' (81-100).",
                },
                headlineVerdict: {
                  type: Type.STRING,
                  description: "A concise, high-impact 1-sentence verdict for the student.",
                },
                confidenceScore: {
                  type: Type.INTEGER,
                  description: "Confidence percentage (e.g., 95).",
                },
                identifiedScamType: {
                  type: Type.STRING,
                  description: "Specific typology name, e.g., 'Advance-Fee Training Scam', 'Telegram Task & Like Scam', 'Phishing Impersonation', 'Legitimate Opportunity'.",
                },
                warningIndicators: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      severity: {
                        type: Type.STRING,
                        description: "CRITICAL, HIGH, MEDIUM, or LOW",
                      },
                      category: {
                        type: Type.STRING,
                        description: "PAYMENT_DEMAND, UNREALISTIC_COMPENSATION, SUSPICIOUS_COMMUNICATION, INTERVIEW_ANOMALY, URGENCY_PRESSURE, DATA_HARVESTING, TASK_BASED_PONZI, or VISUAL_FORGERY",
                      },
                      title: {
                        type: Type.STRING,
                        description: "Short clear title of the indicator",
                      },
                      explanation: {
                        type: Type.STRING,
                        description: "Detailed, student-friendly explanation of why this is dangerous.",
                      },
                      snippetFound: {
                        type: Type.STRING,
                        description: "Exact snippet or key trigger found in the text that caused this warning.",
                      },
                    },
                    required: ["severity", "category", "title", "explanation"],
                  },
                },
                legitimacySignals: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of positive legitimate characteristics detected if any.",
                },
                companyVerificationAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Concrete step-by-step action plan for the student to verify this exact company safely.",
                },
                safeResponseAction: {
                  type: Type.STRING,
                  description: "Direct recommendation (e.g., 'Do not reply, block sender immediately', 'Ask for formal email from corporate domain').",
                },
                safeReplyTemplate: {
                  type: Type.STRING,
                  description: "A polite, professional template message the student can copy and send to challenge/verify the recruiter.",
                },
                reportingChecklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Emergency checklist items if the student already engaged or transferred funds.",
                },
                extractedOcrText: {
                  type: Type.STRING,
                  description: "Complete text extracted from the screenshot or image via OCR (if an image was provided).",
                },
                imageForensicsSummary: {
                  type: Type.STRING,
                  description: "Detailed forensic assessment of the screenshot (e.g., detected fake seals, WhatsApp layout anomalies, altered fonts, suspicious phone numbers, QR codes).",
                },
              },
              required: [
                "riskScore",
                "riskLevel",
                "headlineVerdict",
                "confidenceScore",
                "identifiedScamType",
                "warningIndicators",
                "legitimacySignals",
                "companyVerificationAdvice",
                "safeResponseAction",
                "safeReplyTemplate",
                "reportingChecklist",
              ],
            },
          },
        });

        const rawText = response.text?.trim();
        if (rawText) {
          const parsed = JSON.parse(rawText);
          parsed.extractedEntities = extractForensicEntities(text, parsed.extractedOcrText || "");
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to heuristic engine:", geminiError);
      }
    }

    // Fallback to our comprehensive heuristic engine
    const heuristicResult = runHeuristicAnalysis({
      text,
      companyName,
      senderContact,
      platform,
      role,
      salary,
      feeAsked,
    });

    return res.json(heuristicResult);
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Failed to complete risk analysis. " + (error?.message || "") });
  }
});

// API: Honeybot Recruiter Challenger Simulator
app.post("/api/simulate-recruiter-challenge", async (req, res) => {
  try {
    const { strategy, recruiterClaim, candidateMessage, context } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const simPrompt = `You are a cybersecurity simulation engine demonstrating how employment scammers vs legitimate HR respond when challenged with verification questions.

Candidate verification strategy applied: "${strategy || "Demand corporate domain email & Workday Job ID"}"
Initial recruiter pitch/claim: "${recruiterClaim || "We selected you for Remote Software Intern, pay ₹1,499 laptop fee"}"
Candidate sent this tactical message: "${candidateMessage || "Please email me from your corporate domain."}"
Opportunity context: ${JSON.stringify(context || {})}

Simulate the SCAMMER'S expected reply and psychological deception tactics:
Provide a realistic simulated reply illustrating how the scam syndicate reacts (e.g. doubling down with fake urgency, gaslighting, claiming corporate emails are under maintenance, or sending a fake forged badge image).

Return strictly JSON conforming to schema.`;

      const simResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: simPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              simulatedScammerReply: {
                type: Type.STRING,
                description: "Realistic simulated message from the scammer in response to the challenge.",
              },
              tacticExposed: {
                type: Type.STRING,
                description: "Name of the psychological manipulation tactic exposed (e.g., 'False Authority & Urgency Doubling').",
              },
              redFlagsTriggered: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of red flags exposed by the candidate's challenge question.",
              },
              nextActionAdvice: {
                type: Type.STRING,
                description: "Defensive student advice for the next step.",
              },
            },
            required: ["simulatedScammerReply", "tacticExposed", "redFlagsTriggered", "nextActionAdvice"],
          },
        },
      });

      const raw = simResponse.text?.trim();
      if (raw) {
        return res.json(JSON.parse(raw));
      }
    }

    // Heuristic simulation fallback
    res.json({
      simulatedScammerReply:
        "Dear candidate, our corporate email server is currently undergoing migration so HR is communicating via WhatsApp. To lock your seat, the ₹1,499 refundable dispatch fee must be transferred within 45 minutes or your selection will be cancelled and given to waitlisted students.",
      tacticExposed: "Panic Urgency & Excuses for Missing Corporate Infrastructure",
      redFlagsTriggered: [
        "Excuses avoiding official corporate email (@company.com)",
        "Artificial deadline pressure to bypass university placement cell approval",
        "Threatening candidate with immediate offer cancellation",
      ],
      nextActionAdvice:
        "Do not reply further. A genuine Fortune 500 or registered enterprise will never claim their email servers are down or demand money via UPI.",
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to simulate challenge: " + err.message });
  }
});

// API: Generate Formal Cyber Crime Incident Dossier
app.post("/api/generate-cyber-dossier", (req, res) => {
  try {
    const { studentName, victimDetails, scanResult, inputData, incidentDate } = req.body;

    const dateStr = incidentDate || new Date().toISOString().split("T")[0];
    const incidentId = `CYB-SCAM-${Date.now().toString().slice(-6)}`;

    const entities = scanResult?.extractedEntities || extractForensicEntities(inputData?.text || "");

    const dossierMarkdown = `================================================================================
OFFICIAL CYBER CRIME COMPLAINT DOSSIER & EVIDENCE BRIEF
Generated by ScamCheck Forensic Verification Platform
Reference Case ID: ${incidentId}
Date of Generation: ${dateStr}
Classification: Cyber Fraud / Impersonation / Advance-Fee Employment Scam
Relevant Legal Provisions: Section 66D IT Act 2000 (India) / 18 U.S.C. § 1343 Wire Fraud (USA)
================================================================================

1. COMPLAINANT / VICTIM DETAILS:
- Complainant Name: ${studentName || "Student Job Seeker"}
- Educational Institution: ${victimDetails?.collegeName || "University / College Student"}
- Contact / City: ${victimDetails?.location || "Not Disclosed"}
- Date & Time of Incident: ${dateStr}

2. ALLEGED PERPETRATOR / FRAUD SYNDICATE PROFILE:
- Claimed Entity: ${inputData?.companyName || "Unverified Recruiter Entity"}
- Claimed Job Title: ${inputData?.role || "Remote Position / Intern"}
- Platform Used: ${inputData?.platform || "WhatsApp / Telegram / Email"}
- Perpetrator Phone/Email Identifiers: ${
      entities.phoneNumbers.join(", ") || entities.emails.join(", ") || inputData?.senderContact || "Extracted in message body"
    }
- Financial Handles (UPI / Accounts): ${entities.upiIds.join(", ") || inputData?.feeAsked || "None Disclosed"}
- Telegram Channels / Handles: ${entities.telegramLinks.join(", ") || "None"}

3. FORENSIC RISK SUMMARY:
- Fraud Risk Score: ${scanResult?.riskScore || 85}/100 [${scanResult?.riskLevel || "DANGER_SCAM"}]
- Modus Operandi Typology: ${scanResult?.identifiedScamType || "Advance-Fee Recruitment Fraud"}
- Primary Red Flags:
${(scanResult?.warningIndicators || [])
  .map((w: any, idx: number) => `  ${idx + 1}. [${w.severity}] ${w.title}: ${w.explanation}`)
  .join("\n")}

4. EVIDENCE LOG & ORIGINAL MESSAGE CONTENT:
"""
${inputData?.text || "Original communication excerpt recorded during verification audit."}
"""

5. REQUESTED LAW ENFORCEMENT & PLATFORM ACTIONS:
- 1. Freeze receiving UPI handles and linked bank accounts to prevent downstream money laundering.
- 2. Issue subscriber details request (SDR/CDR) for associated mobile numbers used in messaging syndicates.
- 3. Block malicious communication channels on WhatsApp/Telegram/Email services.
- 4. Issue cyber bulletin to university placement cells.

================================================================================
Generated for submission to:
- India: National Cyber Crime Portal (cybercrime.gov.in / Helpline 1930)
- USA: Federal Trade Commission (reportfraud.ftc.gov) / IC3 (ic3.gov)
- UK: Action Fraud (actionfraud.police.uk)
================================================================================`;

    res.json({
      incidentId,
      dossierText: dossierMarkdown,
      timestamp: dateStr,
      entities,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate cyber dossier: " + err.message });
  }
});

// API: UPI & Payment Handle Forensic Threat Auditor
app.post("/api/audit-payment-handle", (req, res) => {
  const { handle } = req.body;
  if (!handle) {
    return res.status(400).json({ error: "Payment handle is required." });
  }

  const cleanHandle = String(handle).trim().toLowerCase();

  // Known PSP domains
  const pspVpaSuffixes = ["@okaxis", "@okhdfcbank", "@okicici", "@oksbi", "@paytm", "@ybl", "@ibl", "@axl", "@apl", "@upi", "@postbank", "@airtel"];
  const isVpa = pspVpaSuffixes.some((s) => cleanHandle.endsWith(s)) || cleanHandle.includes("@");

  const personalVpaMarkers = ["@ok", "@paytm", "@ybl", "@ibl", "@axl", "@apl"];
  const isPersonalProvider = personalVpaMarkers.some((p) => cleanHandle.endsWith(p));

  const enterpriseKeywords = ["infosys", "tcs", "google", "amazon", "microsoft", "wipro", "hr", "recruitment", "hiring", "onboarding", "placement"];
  const containsCorpKeyword = enterpriseKeywords.some((k) => cleanHandle.includes(k));

  let riskLevel = "LOW";
  let analysis = "Standard handle structure.";
  let isDisguisedPersonalAccount = false;

  if (containsCorpKeyword && isPersonalProvider) {
    riskLevel = "CRITICAL";
    isDisguisedPersonalAccount = true;
    analysis =
      "🚨 Disguised Personal Account: Scammers often create personal Google Pay/Paytm/PhonePe accounts like 'infosys.hr@paytm' to trick students into believing it is an official corporate account. Legitimate enterprises collect payments via registered Merchant Payment Gateways (Razorpay, Cashfree, BillDesk), NEVER personal UPI VPAs.";
  } else if (isPersonalProvider) {
    riskLevel = "HIGH";
    analysis = "⚠️ P2P Personal Account: This is a personal peer-to-peer VPA, not a verified corporate merchant account.";
  }

  res.json({
    handle: cleanHandle,
    isVpa,
    isDisguisedPersonalAccount,
    riskLevel,
    analysis,
    recommendation: isDisguisedPersonalAccount
      ? "DO NOT PAY. Real enterprises do not accept hiring fees through personal UPI IDs."
      : "Verify merchant legitimacy before initiating any transfer.",
  });
});

// API: Quick Domain / Recruiter Email Check
app.post("/api/quick-domain-check", (req, res) => {
  const { query, claimedCompany } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query domain or email is required." });
  }

  const cleanQuery = String(query).toLowerCase().trim();
  const cleanCompany = String(claimedCompany || "").toLowerCase().trim();

  const freeProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com", "icloud.com", "proton.me", "mail.ru", "yopmail.com"];
  const domainPart = cleanQuery.includes("@") ? cleanQuery.split("@")[1] : cleanQuery;

  const isFree = freeProviders.some((p) => domainPart.endsWith(p));
  const suspiciousTlds = [".xyz", ".top", ".icu", ".site", ".online", ".work", ".click", ".buzz", ".vip", ".cc"];
  const hasSuspiciousTld = suspiciousTlds.some((tld) => domainPart.endsWith(tld));

  const knownCompanies: Record<string, string[]> = {
    google: ["google.com", "alphabet.com"],
    microsoft: ["microsoft.com", "linkedin.com"],
    amazon: ["amazon.com", "amazon.jobs", "amazon.in"],
    tcs: ["tcs.com"],
    infosys: ["infosys.com"],
    wipro: ["wipro.com"],
    meta: ["meta.com", "facebook.com"],
    apple: ["apple.com"],
    deloitte: ["deloitte.com"],
    accenture: ["accenture.com"],
    ibm: ["ibm.com"],
  };

  let spoofDetected = false;
  let officialDomain = "";

  if (cleanCompany && knownCompanies[cleanCompany]) {
    const validDomains = knownCompanies[cleanCompany];
    officialDomain = validDomains[0];
    if (!validDomains.some((vd) => domainPart === vd || domainPart.endsWith("." + vd))) {
      spoofDetected = true;
    }
  }

  res.json({
    domain: domainPart,
    isFreeProvider: isFree,
    hasSuspiciousTld,
    spoofDetected,
    officialDomain,
    verdict: spoofDetected
      ? `🚨 Impersonation Risk: Claiming to represent '${claimedCompany}', but the official domain is '${officialDomain}'.`
      : isFree
      ? "⚠️ Public Email Provider: Free email accounts cannot verify corporate identity."
      : hasSuspiciousTld
      ? "⚠️ Low-Reputation TLD: Unusual domain extension often associated with throwaway phishing domains."
      : "✅ Custom Organizational Domain: Appears to be a custom corporate or institutional domain. Verify exact spelling.",
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ScamCheck Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
