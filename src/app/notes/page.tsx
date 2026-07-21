"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NoteQuestion {
  round: string;
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteQuestion[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const data = localStorage.getItem('gctest_wrong_notes');
      if (data) {
        setNotes(JSON.parse(data));
      }
    } catch (e) {
      console.error("Failed to load notes", e);
    }
  }, []);

  const handleDelete = (round: string, id: number) => {
    if (!confirm("이 문제를 오답노트에서 삭제하시겠습니까?")) return;
    
    const updated = notes.filter(n => !(n.round === round && n.id === id));
    setNotes(updated);
    localStorage.setItem('gctest_wrong_notes', JSON.stringify(updated));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold text-white truncate mr-2">내 오답노트 복습하기</h1>
          <Link href="/" className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs sm:text-sm transition-colors border border-slate-700 whitespace-nowrap">
            &larr; 홈으로
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {notes.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-white mb-2">저장된 오답이 없습니다!</h2>
            <p className="text-slate-400">모의고사를 풀고 오답노트에 추가해 보세요.</p>
          </div>
        ) : (
          <>
            <div className="text-slate-400 text-right font-medium">
              총 <span className="text-emerald-400">{notes.length}</span>개의 오답이 저장되어 있습니다.
            </div>
            
            {notes.map((q, index) => (
              <div key={`${q.round}-${q.id}`} className="bg-slate-800 rounded-2xl p-5 sm:p-8 border border-slate-700 shadow-lg relative">
                
                <button 
                  onClick={() => handleDelete(q.round, q.id)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm transition-colors border border-rose-500/30 flex items-center gap-1 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  삭제
                </button>

                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pr-20">
                  <div className="flex-shrink-0 px-3 h-8 sm:h-10 bg-rose-500/20 text-rose-400 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base border border-rose-500/30">
                    {q.round}차
                  </div>
                  <h2 className="text-lg sm:text-xl font-medium text-white pt-1 leading-relaxed whitespace-pre-wrap">{q.question}</h2>
                </div>

                <div className="space-y-3 mb-6 sm:mb-8 mt-4 sm:mt-0 pl-0 sm:pl-14">
                  {q.options.map((opt: string, optIdx: number) => (
                    <div 
                      key={optIdx} 
                      className={`p-4 rounded-xl border transition-colors ${
                        q.answer === optIdx + 1 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100' 
                          : 'bg-slate-900/50 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="font-medium mr-2">{optIdx + 1}.</span> {opt}
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-0 ml-0 sm:ml-14 bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    상세 해설 (정답: {q.answer}번)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
