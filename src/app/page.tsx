import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm leading-tight sm:leading-tight">
            2026 과천도시공사
            <br />
            직원능력 검정시험 Study Portal
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-2">
            제공된 예상문제(1차, 2차, 3차)를 스마트하게 학습하고, 무작위 20문항 모의고사를 통해 실전 감각을 키워보세요. 
            AI로 생성한 상세한 맞춤 해설이 제공 됩니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { id: 1, title: '1차 예상문제', count: 168, color: 'from-blue-500 to-cyan-500' },
            { id: 2, title: '2차 예상문제', count: 66, color: 'from-indigo-500 to-blue-500' },
            { id: 3, title: '3차 예상문제', count: 111, color: 'from-emerald-500 to-teal-500' },
            { id: 4, title: '알기쉬운법령정비기준', count: 30, color: 'from-amber-500 to-orange-500' },
          ].map((exam) => (
            <div key={exam.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className={`h-2 w-16 bg-gradient-to-r ${exam.color} rounded-full mb-6`}></div>
              <h2 className="text-xl xl:text-2xl font-bold mb-2 tracking-tight break-keep">{exam.title}</h2>
              <p className="text-slate-400 mb-6 flex-grow text-sm sm:text-base">총 {exam.count}문항 (상세 맞춤 해설 포함)</p>
              
              <div className="flex flex-col gap-3 mt-auto">
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
