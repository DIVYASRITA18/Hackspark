import { ScamExample, QuizQuestion } from '../types';

export const REAL_WORLD_EXAMPLES: ScamExample[] = [
  {
    id: 'whatsapp-youtube-task',
    title: 'WhatsApp YouTube Like / Review Scam',
    category: 'Task-Based Ponzi / Prepaid Scam',
    channel: 'WhatsApp / Telegram',
    riskBadge: 'DANGER: 95/100',
    riskScore: 95,
    description: 'Promises ₹2,000-₹5,000 daily for simply liking 3 YouTube videos. Pays small trial amount then demands ₹5,000 VIP deposit on Telegram.',
    sampleInput: {
      platform: 'WhatsApp',
      companyName: 'Digital Media Growth Ltd',
      senderContact: '+91 98451 23412 (WhatsApp business account)',
      role: 'Part-Time Media Rating Specialist',
      salary: '₹2,500 - ₹6,000 / day',
      feeAsked: '₹3,000 VIP merchant deposit (after initial trial)',
      text: `Hello! I am Sarah, HR manager at Digital Media Global. We saw your resume on Shine.com. 

We have an urgent part-time remote opening for college students. You only need to like YouTube videos & subscribe to channels. Work 15-20 minutes daily from your mobile and earn ₹2,000 - ₹5,000 daily instant payout via UPI!

No experience or technical skills needed. Complete 3 trial tasks right now to get ₹150 instant bonus in your GPay account.

Click here to message our Receptionist on Telegram: https://t.me/VIP_Job_Manager_Task99 to claim your slot today. Only 5 slots left!`,
    },
  },
  {
    id: 'internship-kit-fee',
    title: 'Fake MNC Internship with ₹1,999 Kit Fee',
    category: 'Advance-Fee Training Kit Scam',
    channel: 'Email / WhatsApp',
    riskBadge: 'DANGER: 90/100',
    riskScore: 90,
    description: 'Offers a 3-month Software Intern role with ₹35,000 stipend, but asks for ₹1,999 "refundable ID & onboarding kit fee" before sending laptop.',
    sampleInput: {
      platform: 'Email',
      companyName: 'Infosys Technologies (Claimed)',
      senderContact: 'hr.infosys.hiring.team@gmail.com',
      role: 'Remote Full Stack Web Developer Intern',
      salary: '₹35,000 / month + Free MacBook',
      feeAsked: '₹1,999 (Claimed refundable laptop dispatch insurance)',
      text: `Dear Candidate,

Congratulations! We are pleased to inform you that you have been directly selected for the 3-Month Remote Software Engineering Internship at Infosys Technologies based on your GitHub profile and LinkedIn resume.

Stipend: ₹35,000 per month.
Perks: Free Apple MacBook Pro & Wi-Fi reimbursement allowance.

To confirm your acceptance and initiate your laptop courier dispatch from our Bangalore campus, you are required to pay a mandatory refundable courier security deposit of ₹1,999/- via UPI to accounts.infosys@upi within 4 hours.

This fee will be 100% refunded in your first week's stipend. Failure to pay will result in immediate disqualification.`,
    },
  },
  {
    id: 'remote-data-entry-check',
    title: 'High-Paying Remote Typing / Data Entry ($45/hr)',
    category: 'Overpayment & Equipment Purchase Scam',
    channel: 'SMS / Job Board',
    riskBadge: 'HIGH RISK: 85/100',
    riskScore: 85,
    description: 'Unrealistic $45/hour for copy-pasting numbers. Asks you to deposit a fake check and wire money to their "certified vendor" for software.',
    sampleInput: {
      platform: 'SMS',
      companyName: 'Apex Health Logistics Inc.',
      senderContact: 'recruitment@apex-health-portal.site',
      role: 'Remote Data Entry Clerk / Document Typer',
      salary: '$45.00 / hour ($1,800 weekly)',
      feeAsked: 'Deposit company check & wire $250 for proprietary typing software',
      text: `APEX HEALTH LOGISTICS: You have been selected for our Home-Based Data Entry / PDF Typing Assistant position. 

Working hours: Flexible 2-3 hours/day. Pay: $45.00/hour, paid weekly via direct check or Wire.

Duties: Convert handwritten medical logs into Word docs. 
We will send you a certified company check for $2,500 to purchase your home office workstation and time-tracking software from our approved vendor. You must deposit the check and Zelle/CashApp the vendor $250 today to start setup.`,
    },
  },
  {
    id: 'legit-corporate-placement',
    title: 'Legitimate Microsoft Campus Internship Offer',
    category: 'Verified Legitimate Recruiter',
    channel: 'Email',
    riskBadge: 'SAFE: 5/100',
    riskScore: 5,
    description: 'Official corporate domain, formal multi-stage interviews, links to official careers portal, zero fee requirements.',
    sampleInput: {
      platform: 'Email',
      companyName: 'Microsoft Corporation',
      senderContact: 'university-recruiting@microsoft.com',
      role: 'Software Engineering Intern (Summer 2026)',
      salary: 'Standard competitive intern stipend + housing benefits',
      feeAsked: '₹0 (No fees ever charged)',
      text: `Hello Student,

Thank you for participating in our on-campus technical assessment and coding round last week for the Microsoft Summer 2026 Internship Program.

We are delighted to invite you to the final round of virtual interviews with our Azure Core Engineering Team. 

Date: Wednesday, 10:00 AM - 1:00 PM IST
Format: 2 Technical Problem-Solving rounds on Microsoft Teams + 1 Culture & Values discussion.

Please log in to your candidate dashboard on our official portal (https://careers.microsoft.com/students/dashboard) using your registered university email to review your interview schedule and preparation materials.

Microsoft does not charge any application, processing, or training fees at any stage of the recruitment process.

Best regards,
Microsoft University Relations Team`,
    },
  },
  {
    id: 'instagram-crypto-ambassador',
    title: 'Instagram "Student Crypto Ambassador" Scam',
    category: 'Affiliate MLM / Unpaid Pyramid',
    channel: 'Instagram',
    riskBadge: 'HIGH RISK: 78/100',
    riskScore: 78,
    description: 'Instagram DM offering $500/week to promote crypto trading bots. Requires student to buy $50 starter package or deposit in unregulated platform.',
    sampleInput: {
      platform: 'Instagram',
      companyName: 'NovaTrade Crypto Global',
      senderContact: '@novatrade_official_hr on Instagram',
      role: 'Campus Crypto Growth Ambassador',
      salary: '$300 - $800 weekly commission',
      feeAsked: '$50 activation fee or 0.002 BTC deposit',
      text: `Hey! Love your profile aesthetic. We are looking for energetic campus ambassadors at your college to represent NovaTrade. 

You'll earn $500+ every week just posting our reels, sharing discount codes in college group chats, and showing students how to multiply their pocket money.

To get your Ambassador verified badge, custom promo kit, and start receiving your weekly crypto payout, you just need to activate your trader account with a minimum $50 deposit using code AMBASSADOR2026. 

DM us "READY" to get your onboard link before spots fill up!`,
    },
  },
];

export const SCAM_PATTERNS_GUIDE = [
  {
    id: 'task-scam',
    title: '1. YouTube Like & Review "Task" Scams',
    shortDescription: 'The fastest growing cyber scam targeting students on WhatsApp and Telegram.',
    mechanism: 'Scammers offer ₹150-₹300 for liking 3 videos to build false trust and establish UPI proof. Then they add you to a Telegram VIP group with fake testimonials, demanding prepaid deposits (₹2,000 -> ₹10,000) for "high-yield merchant tasks". Your money is frozen permanently.',
    redFlags: [
      'Recruitment initiates via unsolicited WhatsApp message from international numbers (+234, +62, +84, etc.).',
      'Requires switching communication to Telegram channels with "Advisors" or "Mentors".',
      'Pay promised is ₹2,000-₹8,000/day for 15 minutes of zero-skill clicks.',
      'Terms like "prepaid tasks", "VIP frozen balance", or "tax clearance fee" to withdraw.',
    ],
    defenseAction: 'Never send money to unlock earnings. Block the sender immediately and report on Cybercrime Portal 1930.',
  },
  {
    id: 'kit-fee-scam',
    title: '2. Fake Internship Registration / Kit Fee Scams',
    shortDescription: 'Exploits college students desperation for semester internship credits.',
    mechanism: 'Scammers forge official-looking offer letters with logos of TCS, Google, Infosys, or Amazon. They claim you are selected, but demand ₹1,000-₹3,000 for "document verification", "training LMS portal login", or "laptop courier insurance".',
    redFlags: [
      'Email sent from @gmail.com, @yahoo.com, or fake typosquatted domains (e.g. @tcs-careers-india.com).',
      'Offer granted without an interview, technical test, or coding challenge.',
      'Explicit demand for money via personal UPI ID (GPay/PhonePe) or QR code.',
      'Urgency timer: "Confirm within 2 hours or offer will be transferred to next candidate".',
    ],
    defenseAction: 'Genuine MNCs have millions in recruiting budgets. They NEVER charge students a single rupee for training, kits, or offers.',
  },
  {
    id: 'remote-typing-scam',
    title: '3. Remote PDF Typing / Captcha Entry Scams',
    shortDescription: 'Targets students looking for flexible work-from-home gigs.',
    mechanism: 'Promises $30-$50/hour for typing 50 pages of scanned text or filling captchas. When you submit work, they claim errors were made, penalize you, and demand ₹5,000 "server penalty charges" under threat of fake legal notices.',
    redFlags: [
      'Absurdly high compensation for standard OCR/typing tasks that AI does in 2 seconds.',
      'Demands payment for "software license key" or "accuracy security deposit".',
      'Sends fake "Legal Court Notices" or police complaint threats via WhatsApp if you refuse to pay.',
    ],
    defenseAction: 'Fake legal notices sent over WhatsApp are 100% intimidation hoaxes. Do not pay. Block and report.',
  },
  {
    id: 'cheque-overpayment',
    title: '4. Fake Check / Overpayment Equipment Scam',
    shortDescription: 'Common on LinkedIn, Upwork, and Craigslist targeting freelance student developers.',
    mechanism: 'The "client" sends you an electronic check for $3,000 to buy office equipment. They ask you to deposit it and immediately wire $500 to their "approved computer vendor". 4 days later, the check bounces (fake check), and your bank holds you liable for the $500 you wired.',
    redFlags: [
      'Client insists on sending an email check or mobile deposit image.',
      'Directs you to pay a third-party vendor via Zelle, CashApp, Wire, or Crypto.',
      'Refuses to purchase equipment directly and ship it to you.',
    ],
    defenseAction: 'Never wire money derived from a freshly deposited check until your bank physically confirms funds are cleared (usually 5-7 business days).',
  },
  {
    id: 'credential-harvesting',
    title: '5. Phishing & KYC Document Harvesting',
    shortDescription: 'Stealing Aadhaar, PAN, SSN, and bank credentials to create mule accounts.',
    mechanism: 'A fake employer asks you to fill a "Google Form" or fake onboarding portal requesting high-resolution front/back scans of your government ID, bank passbook, and selfie with ID. They use your identity to open mule bank accounts for laundering cyber-crime proceeds.',
    redFlags: [
      'Unsecured Google Forms or unverified Google Drive links asking for sensitive identity documents before any official interview or offer.',
      'Asking for NetBanking passwords, Debit card PINs, or UPI MPINs.',
      'Asking to install remote management tools like AnyDesk, TeamViewer, or RustDesk.',
    ],
    defenseAction: 'Only share masked Aadhaar or official documents on verified corporate portals after receiving an authenticated offer letter with verifiable HR contact.',
  },
];

export const COMMUNITY_THREAT_REPORTS: import('../types').ThreatReport[] = [
  {
    id: 'tr-01',
    title: 'Telegram "YouTube Merchant 88" Like & Subscribe Syndicate',
    scamType: 'Telegram Task Ponzi Scam',
    claimedCompany: 'Omnicom Media Group (Spoofed)',
    platform: 'WhatsApp -> Telegram',
    reportCount: 342,
    upvotes: 189,
    dateReported: 'Today, 2 hours ago',
    severity: 'CRITICAL',
    identifiers: {
      handles: ['@Omni_Task_Manager_Rita', '@VIP_Merchant_Group_88', 't.me/omni_daily_tasks'],
      upiOrPayment: 'merchant.paytm892@paytm, vip.taskdeposit@ybl',
      phoneOrEmail: '+91 91238 88910, +62 838 9011 2341',
    },
    modusOperandi:
      'Approaches engineering students via international WhatsApp numbers. Sends ₹150 for liking 3 YouTube videos, then requires ₹3,000 - ₹25,000 deposits in Telegram VIP groups under the pretext of high-yield crypto merchant tasks.',
    targetedCampuses: ['Anna University', 'IIT Madras', 'VTU Colleges', 'Delhi University', 'SRM University'],
    isVerifiedByAnalysts: true,
  },
  {
    id: 'tr-02',
    title: 'Spoofed "Infosys Springboard" ₹1,499 Laptop Dispatch Kit',
    scamType: 'Advance-Fee Internship Scam',
    claimedCompany: 'Infosys Limited',
    platform: 'Email & WhatsApp',
    reportCount: 218,
    upvotes: 145,
    dateReported: 'Yesterday',
    severity: 'CRITICAL',
    identifiers: {
      handles: ['@infosys_campus_desk'],
      upiOrPayment: 'infosys.dispatch.fee@okaxis, infy.onboarding99@upi',
      phoneOrEmail: 'hr.infosys.selection.portal@gmail.com',
    },
    modusOperandi:
      'Emails fake offer letters with Infosys logos claiming direct selection without interview for 6-month Remote Developer Internship. Demands ₹1,499 refundable courier deposit to dispatch company laptop.',
    targetedCampuses: ['JNTU Hyderabad', 'Pune University', 'AKTU Lucknow', 'Amity University', 'VIT Vellore'],
    isVerifiedByAnalysts: true,
  },
  {
    id: 'tr-03',
    title: 'Fake Google Maps 5-Star Hotel Rating Network',
    scamType: 'Prepaid Review Scheme',
    claimedCompany: 'TripAdvisor Global Partner (Spoofed)',
    platform: 'Telegram / Instagram',
    reportCount: 164,
    upvotes: 98,
    dateReported: '2 days ago',
    severity: 'HIGH',
    identifiers: {
      handles: ['@hotel_ranking_agent_eva', 't.me/global_hotel_boost'],
      upiOrPayment: 'reviewpay.fast@ibl',
      phoneOrEmail: '+91 88720 11982',
    },
    modusOperandi:
      'Pays ₹50 per review on Google Maps to build trust, then freezes candidate balance in fake web portal demanding ₹10,000 tax clearance penalty.',
    targetedCampuses: ['Mumbai University', 'Christ University Bangalore', 'Manipal University'],
    isVerifiedByAnalysts: true,
  },
  {
    id: 'tr-04',
    title: 'Remote Medical PDF Typing & Captcha Legal Threat Ring',
    scamType: 'Intimidation & Extortion Scam',
    claimedCompany: 'Apex Health Transcription',
    platform: 'SMS / Job Board',
    reportCount: 129,
    upvotes: 82,
    dateReported: '3 days ago',
    severity: 'HIGH',
    identifiers: {
      handles: ['@apex_data_desk'],
      upiOrPayment: 'legalpenalty.desk@axl',
      phoneOrEmail: '+91 70119 44321',
    },
    modusOperandi:
      'Assigns impossible OCR typing assignments with 99% accuracy clauses. Fabricates errors and sends fake Supreme Court / Police WhatsApp legal notices demanding ₹4,500 penalty.',
    targetedCampuses: ['Calcutta University', 'Burdwan University', 'Osmania University'],
    isVerifiedByAnalysts: true,
  },
  {
    id: 'tr-05',
    title: 'Instagram Campus Brand Ambassador Starter Kit Fraud',
    scamType: 'Affiliate MLM Ponzi',
    claimedCompany: 'LuxeTrend Fashion / CryptoClub',
    platform: 'Instagram DMs',
    reportCount: 95,
    upvotes: 61,
    dateReported: '4 days ago',
    severity: 'MEDIUM',
    identifiers: {
      handles: ['@luxetrend_ambassador_scout', '@crypto_campus_hustle'],
      upiOrPayment: 'luxekit.promo@paytm',
      phoneOrEmail: 'ambassadors@luxetrend-style.shop',
    },
    modusOperandi:
      'DMs college students praising their aesthetic and promising $400/week ambassador commission. Demands $35-$50 upfront purchase of "sample starter clothing/token kit" that never arrives.',
    targetedCampuses: ['Symbiosis Pune', 'NIFT Delhi', 'NMIMS Mumbai'],
    isVerifiedByAnalysts: true,
  },
];

export const COUNTER_CHALLENGE_STRATEGIES: import('../types').CounterChallengeStrategy[] = [
  {
    id: 'strat-corporate-domain',
    title: 'The Official Corporate Email Test',
    strategyName: 'Domain Origin Challenge',
    badge: 'Universal First Line Defense',
    description: 'Forces the recruiter to send the offer directly from an authenticated @company.com email address.',
    tacticalPrompt:
      'Could you please send this official offer letter and job description from your verified corporate domain email (@[company].com)? Our university placement cell requires all placement records to originate from verified organizational domains.',
    expectedScammerTrap:
      'Scammers will make excuses like "Our server is under maintenance", "We use Gmail for remote contractors", or become aggressive with urgency.',
  },
  {
    id: 'strat-workday-req',
    title: 'Enterprise ATS Job Requisition ID Test',
    strategyName: 'ATS Job ID Verification',
    badge: 'MNC & Corporate Filter',
    description: 'Asks for the official Workday/Greenhouse/Taleo Job Requisition ID searchable on the company careers portal.',
    tacticalPrompt:
      'Could you share the official Job Requisition ID for this role on your careers portal (e.g. careers.[company].com)? I would like to submit my application through the official candidate dashboard.',
    expectedScammerTrap:
      'Scammers cannot provide a real Job ID on the official company website and will claim this is a "special direct recruitment batch" not posted online.',
  },
  {
    id: 'strat-placement-cell',
    title: 'Campus Placement Cell Verification Letter',
    strategyName: 'Institutional Placement Validation',
    badge: 'Highest Protection for Students',
    description: 'Informs the recruiter that college placement guidelines mandate prior verification before any fee or document exchange.',
    tacticalPrompt:
      'Under our college Placement & Training Cell (T&P) regulations, I cannot transfer any deposits or share unmasked identity documents without an official MoU or company verification letter sent to placement@[college].edu.',
    expectedScammerTrap:
      'Scammers will immediately panic, threaten to cancel the offer within 30 minutes, or urge you not to inform your college.',
  },
  {
    id: 'strat-mca-cin',
    title: 'Corporate Registry & CIN/GSTIN Audit',
    strategyName: 'Legal Entity Registry Check',
    badge: 'Indian & International Startup Verification',
    description: 'Requests the Corporate Identification Number (CIN) or LLPIN to cross-reference against Ministry of Corporate Affairs (MCA).',
    tacticalPrompt:
      'Could you please provide your 21-digit Corporate Identification Number (CIN) or registered GSTIN so I can verify the registered legal entity details on the Ministry of Corporate Affairs (MCA) portal?',
    expectedScammerTrap:
      'Fraudulent operators either provide fake CINs or refuse, claiming corporate legal confidentiality.',
  },
  {
    id: 'strat-zero-fee-policy',
    title: 'Corporate Expense Sponsorship Clause',
    strategyName: 'Zero-Fee Direct Rebuff',
    badge: 'Instant Advance-Fee Buster',
    description: 'Politely clarifies that corporate policy should deduct any onboarding fees from first month stipend rather than upfront UPI.',
    tacticalPrompt:
      'If there is an onboarding security deposit or laptop insurance fee, please deduct it directly from my first month stipend as per standard corporate accounting practice. I cannot make upfront personal UPI transfers.',
    expectedScammerTrap:
      'Scammers will refuse this outright because their entire objective is extracting the upfront deposit immediately.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'You receive an unsolicited WhatsApp message offering an internship:',
    channel: 'WhatsApp',
    claimedCompany: 'Amazon India',
    messageSnippet:
      'Hi! Amazon HR Team here. You are selected for Summer Web Development Intern (Stipend ₹40,000/mo). To dispatch your company laptop, kindly pay ₹1,499 refundable courier insurance to amazon.hr@upi within 2 hours.',
    isScam: true,
    keyRedFlag: 'Upfront payment demanded for laptop dispatch + WhatsApp recruitment',
    correctAnswerReason:
      'Amazon and all legitimate companies provide equipment completely free of charge. Any request for a refundable deposit or UPI payment is guaranteed fraud.',
  },
  {
    id: 2,
    scenario: 'You receive an email regarding an application you submitted on LinkedIn:',
    channel: 'Email',
    claimedCompany: 'Google',
    messageSnippet:
      'From: google-campus-recruitment@gmail.com\nSubject: Direct Selection - Google SWE Intern\nCongratulations! Based on your resume, Google has directly shortlisted you. Please reply with your Aadhaar Card, Bank Account Details, and OTP for direct salary onboarding.',
    isScam: true,
    keyRedFlag: 'Gmail address used for Google HR + Direct selection without technical interview',
    correctAnswerReason:
      'Google recruiters only email from @google.com domain and never use free @gmail.com addresses for hiring. Furthermore, Google conducts multiple technical coding interviews.',
  },
  {
    id: 3,
    scenario: 'You receive an email from a startup you applied to on Wellfound / AngelList:',
    channel: 'Email',
    claimedCompany: 'PostHog',
    messageSnippet:
      'From: talent@posthog.com\nSubject: Interview Invitation: Frontend Intern Role\nHi Alex, thanks for applying. We reviewed your portfolio and would like to invite you to a 45-min pair-programming session on Zoom with our lead engineer. You can select your slot on our Calendly link.',
    isScam: false,
    keyRedFlag: 'No red flags: Official company domain, structured technical interview, zero fees',
    correctAnswerReason:
      'This email originates from the official corporate domain (@posthog.com), requests a technical evaluation, and charges zero fees. This is standard legitimate hiring.',
  },
  {
    id: 4,
    scenario: 'You receive a Telegram notification from a job group:',
    channel: 'Telegram',
    claimedCompany: 'Global Media Partners',
    messageSnippet:
      'Earn ₹3,000 daily from home! Simply like 5 hotel pages on Google Maps. We will send you ₹200 trial bonus right now on Paytm. Then join our VIP channel for daily high-income prepaid tasks.',
    isScam: true,
    keyRedFlag: 'Task scam: Paying small trial sum to bait student into prepaid Telegram investment traps',
    correctAnswerReason:
      'This is the signature Telegram Review / Like Task Scam. They pay a tiny trial sum to gain your trust, then scam you out of thousands in "prepaid tasks".',
  },
  {
    id: 5,
    scenario: 'You receive an SMS alert:',
    channel: 'SMS',
    claimedCompany: 'TCS iON Recruitment',
    messageSnippet:
      'TCS Urgent Notice: Complete your TCS NQT Registration at https://tcs.com/careers/nqt. Exam fee is ₹0 for students applying through university placement cell. Hall tickets available on portal.',
    isScam: false,
    keyRedFlag: 'Official company domain link (tcs.com), transparent placement information',
    correctAnswerReason:
      'The link points directly to the official root domain (tcs.com) and does not ask for UPI transfers to personal numbers.',
  },
];


