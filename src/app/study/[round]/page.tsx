
import Link from 'next/link';

async function getQuestions(round: string) {
  try {
    switch (round) {
      case '1': return (await import('@/data/quiz1.json')).default;
      case '2': return (await import('@/data/quiz2.json')).default;
      case '3': return (await import('@/data/quiz3.json')).default;
      default: return null;
    }
  } catch (e) {
    return null;
  }
}

export default async function StudyPage({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params;
  const questions = await getQuestions(round);

  if (!questions) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center flex-col">
        <h1 className="text-2xl mb-4">해당 회차의 데이터를 찾을 수 없습니다.</h1>
        <Link href="/" className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold text-white truncate mr-2">{round}차 예상문제 - Study 모드</h1>
          <Link href="/" className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs sm:text-sm transition-colors border border-slate-700 whitespace-nowrap">
            &larr; 홈으로
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {questions.map((q: {id: number, question: string, options: string[], answer: number, explanation: string}, index: number) => (
          <div key={q.id} className="bg-slate-800 rounded-2xl p-5 sm:p-8 border border-slate-700 shadow-lg">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold text-base sm:text-lg">
                {index + 1}
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
      </div>
      <div className="pb-20 text-center">
        <Link href="/" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
          학습 완료! 메인으로 이동
        </Link>
      </div>
    </div>
  );
}
