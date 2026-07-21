"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export default function MockTestClient({ round, questions: allQuestions }: { round: string, questions: Question[] }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Fisher-Yates shuffle on client to ensure different questions every time
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuestions(shuffled.slice(0, 20));
  }, [allQuestions]);

  const handleSelect = (qIdx: number, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers({ ...userAnswers, [qIdx]: optionIdx + 1 });
  };

  const handleSubmit = () => {
    if (Object.keys(userAnswers).length < questions.length) {
      if (!confirm("아직 풀지 않은 문제가 있습니다. 제출하시겠습니까?")) return;
    }

    try {
      const existingNotes = JSON.parse(localStorage.getItem('gctest_wrong_notes') || '[]');
      const newWrongNotes = questions
        .filter((q, idx) => userAnswers[idx] !== q.answer)
        .map(q => ({ ...q, round }));
      
      const merged = [...existingNotes];
      newWrongNotes.forEach(note => {
        if (!merged.find(m => m.round === note.round && m.id === note.id)) {
          merged.push(note);
        }
      });
      localStorage.setItem('gctest_wrong_notes', JSON.stringify(merged));
    } catch (e) {
      console.error("Failed to save wrong notes", e);
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (isSubmitted) {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) score++;
    });

    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 py-6 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-5 sm:p-8 border border-slate-700 shadow-xl text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">시험 결과</h1>
            <p className="text-lg sm:text-xl mb-6">총 {questions.length}문제 중 <span className="text-emerald-400 font-bold">{score}</span>문제를 맞혔습니다.</p>
            <div className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-8">
              {Math.round((score / questions.length) * 100)}점
            </div>
            <Link href="/" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors inline-block font-medium">
              메인으로 돌아가기
            </Link>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">문항별 상세 복습</h2>
          <div className="space-y-6 sm:space-y-8">
            {questions.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.answer;
              return (
                <div key={q.id} className={`bg-slate-800 rounded-2xl p-4 sm:p-6 border shadow-lg ${isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {isCorrect ? 'O' : 'X'}
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-white pt-1 whitespace-pre-wrap">{idx + 1}. {q.question}</h3>
                  </div>

                  <div className="space-y-2 mb-6 mt-4 sm:mt-0 pl-0 sm:pl-12">
                    {q.options.map((opt, oIdx) => {
                      const isUserChoice = userAnswers[idx] === oIdx + 1;
                      const isRealAnswer = q.answer === oIdx + 1;
                      let bgClass = "bg-slate-900/50 border-slate-800 text-slate-400";
                      
                      if (isRealAnswer) {
                        bgClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-medium";
                      } else if (isUserChoice) {
                        bgClass = "bg-rose-500/10 border-rose-500/50 text-rose-300 line-through";
                      }

                      return (
                        <div key={oIdx} className={`p-3 rounded-xl border text-sm sm:text-base ${bgClass}`}>
                          {oIdx + 1}. {opt} {isUserChoice && !isRealAnswer && '(내 선택)'} {isRealAnswer && '(정답)'}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 sm:mt-0 ml-0 sm:ml-12 bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-700">
                    <h4 className="text-blue-400 font-bold mb-2">상세 해설</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-white truncate mr-2">{round}차 모의고사</h1>
          <div className="text-emerald-400 font-medium text-sm sm:text-base whitespace-nowrap">
            진행도: {Object.keys(userAnswers).length} / {questions.length}
          </div>
        </div>
        <div className="h-1 bg-slate-800 w-full">
          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300" style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`flex-shrink-0 w-10 h-10 rounded-full font-medium transition-colors ${
                currentIdx === i 
                  ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' 
                  : userAnswers[i]
                    ? 'bg-slate-700 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 sm:p-8 border border-slate-700 shadow-xl min-h-[400px]">
          <h2 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 leading-relaxed whitespace-pre-wrap">
            <span className="text-blue-400 font-bold mr-2">Q{currentIdx + 1}.</span> 
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt, oIdx) => (
              <button
                key={oIdx}
                onClick={() => handleSelect(currentIdx, oIdx)}
                className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all text-sm sm:text-base ${
                  userAnswers[currentIdx] === oIdx + 1
                    ? 'bg-blue-500/20 border-blue-500 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-sm font-bold ${
                  userAnswers[currentIdx] === oIdx + 1 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {oIdx + 1}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            이전 문제
          </button>
          
          {currentIdx === questions.length - 1 ? (
            <button 
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:opacity-90 shadow-lg transition-all hover:-translate-y-0.5 font-bold"
            >
              제출하기
            </button>
          ) : (
            <button 
              onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors font-medium shadow-md"
            >
              다음 문제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
