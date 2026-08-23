import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/mockScams';
import { HelpCircle, CheckCircle2, XCircle, RefreshCw, Trophy, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export const ScamSpotterQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<Array<{ id: number; isCorrect: boolean }>>([]);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectAnswer = (isScamGuess: boolean) => {
    if (selectedAnswer !== null) return; // already answered

    setSelectedAnswer(isScamGuess);
    const isCorrect = isScamGuess === currentQ.isScam;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnswersHistory((prev) => [...prev, { id: currentQ.id, isCorrect }]);
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
    setAnswersHistory([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Scam Spotter Interactive Challenge</h2>
              <p className="text-xs text-slate-500">
                Sharpen your intuition by analyzing real-world recruitment messages received by students.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase text-slate-500">Score:</span>
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-sm rounded-full">
              {score} / {QUIZ_QUESTIONS.length}
            </span>
          </div>
        </div>

        {!completed ? (
          <div className="mt-6 space-y-5">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
                <span>
                  Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span>{Math.round(((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Scenario Header */}
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                {currentQ.channel} • Claimed: {currentQ.claimedCompany}
              </span>
              <h3 className="text-base font-bold text-slate-900">{currentQ.scenario}</h3>
            </div>

            {/* Message Chat Bubble Mockup */}
            <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-inner font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
              {currentQ.messageSnippet}
            </div>

            {/* Answer Action Buttons */}
            {selectedAnswer === null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-quiz-scam"
                  onClick={() => handleSelectAnswer(true)}
                  className="p-4 rounded-xl border-2 border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 hover:border-rose-400 text-rose-900 font-bold text-sm flex items-center justify-center space-x-2 transition-all transform active:scale-98"
                >
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>🚨 It's a SCAM / Suspicious Trap</span>
                </button>

                <button
                  id="btn-quiz-legit"
                  onClick={() => handleSelectAnswer(false)}
                  className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 hover:border-emerald-400 text-emerald-900 font-bold text-sm flex items-center justify-center space-x-2 transition-all transform active:scale-98"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>✅ It's a LEGITIMATE Opportunity</span>
                </button>
              </div>
            ) : (
              /* Answer Feedback Card */
              <div className="space-y-4 pt-1">
                <div
                  className={`p-5 rounded-2xl border ${
                    selectedAnswer === currentQ.isScam
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {selectedAnswer === currentQ.isScam ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold">
                        {selectedAnswer === currentQ.isScam
                          ? '🎉 Spot On! Correct Evaluation'
                          : '❌ Incorrect Assessment! Be Careful'}
                      </h4>

                      <p className="text-xs sm:text-sm font-medium leading-relaxed">
                        {currentQ.correctAnswerReason}
                      </p>

                      <div className="pt-2 text-xs">
                        <span className="font-bold uppercase text-slate-600 block">Critical Takeaway:</span>
                        <span className="font-semibold text-indigo-700">{currentQ.keyRedFlag}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    id="btn-quiz-next"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center space-x-2 shadow-xs transition-colors"
                  >
                    <span>{currentIdx + 1 === QUIZ_QUESTIONS.length ? 'View Final Results' : 'Next Scenario'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Final Quiz Results Screen */
          <div className="mt-8 text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-indigo-50 border-2 border-indigo-200 rounded-full flex items-center justify-center mx-auto text-indigo-600">
              <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                You Scored {score} out of {QUIZ_QUESTIONS.length}!
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                {score === QUIZ_QUESTIONS.length
                  ? '🛡️ Elite Fraud Detector! You have sharp intuition and can easily protect yourself and peers from campus recruitment scams.'
                  : score >= 3
                  ? '⚡ Great Instincts! You caught most red flags. Keep practicing with our verification engine before replying to unsolicited offers.'
                  : '⚠️ Caution! You missed several subtle phishing and advance-fee markers. Always use ScamCheck to verify offers before engaging.'}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                id="btn-quiz-retry"
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center space-x-2 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Challenge</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
