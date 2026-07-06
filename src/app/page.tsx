import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm">
            2026 과천도시공사
            <br />
            직원능력 검정시험 Study Portal
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            제공된 예상문제(1차, 2차, 3차)를 스마트하게 학습하고, 무작위 20문항 모의고사를 통해 실전 감각을 키워보세요. 
            AI 기반 맞춤 해설이 제공됩니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: 1, title: '1차 예상문제', count: 168, color: 'from-blue-500 to-cyan-500' },
            { id: 2, title: '2차 예상문제', count: 66, color: 'from-indigo-500 to-blue-500' },
            { id: 3, title: '3차 예상문제', count: 111, color: 'from-emerald-500 to-teal-500' },
          ].map((exam) => (
            <div key={exam.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className={`h-2 w-16 bg-gradient-to-r ${exam.color} rounded-full mb-6`}></div>
              <h2 className="text-2xl font-bold mb-2">{exam.title}</h2>
              <p className="text-slate-400 mb-8">총 {exam.count}문항 (핵심 요약 해설 포함)</p>
              
              <div className="flex flex-col gap-3">
                <Link href={`/study/${exam.id}`} className="bg-slate-700 hover:bg-slate-600 text-white text-center py-3 rounded-xl font-medium transition-colors">
                  📚 Study 모드
                </Link>
                <Link href={`/test/${exam.id}`} className={`bg-gradient-to-r ${exam.color} text-white text-center py-3 rounded-xl font-medium transition-opacity hover:opacity-90 shadow-lg`}>
                  📝 모의고사 (20제)
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="mt-20 text-slate-500 text-sm">
        &copy; 2026 우세림. 과천도시공사 직원능력 검정시험 대비
      </footer>
    </div>
  );
}
