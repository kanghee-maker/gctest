
import Link from 'next/link';
import MockTestClient from './MockTestClient';

// We will shuffle on the client side to keep the page fully static while ensuring randomness per visit

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

export default async function TestPage({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params;
  const allQuestions = await getQuestions(round);

  if (!allQuestions) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center flex-col">
        <h1 className="text-2xl mb-4">해당 회차의 데이터를 찾을 수 없습니다.</h1>
        <Link href="/" className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">홈으로 돌아가기</Link>
      </div>
    );
  }

  return <MockTestClient round={round} questions={allQuestions} />;
}
