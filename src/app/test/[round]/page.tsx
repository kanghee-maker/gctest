
import Link from 'next/link';
import MockTestClient from './MockTestClient';

// Fisher-Yates shuffle
function shuffleArray(array: any[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

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

export default async function TestPage({ params }: { params: { round: string } }) {
  const round = params.round;
  const allQuestions = await getQuestions(round);

  if (!allQuestions) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center flex-col">
        <h1 className="text-2xl mb-4">해당 회차의 데이터를 찾을 수 없습니다.</h1>
        <Link href="/" className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">홈으로 돌아가기</Link>
      </div>
    );
  }

  // 무작위로 20문제 추출 (전체 문제가 20개 미만일 경우 전체 사용)
  const shuffled = shuffleArray(allQuestions);
  const selectedQuestions = shuffled.slice(0, 20);

  return <MockTestClient round={round} questions={selectedQuestions} />;
}
