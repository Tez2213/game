import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
      <div className="text-center p-8 bg-[#E8DDD4] rounded-2xl shadow-lg max-w-md mx-4">
        <div className="text-6xl mb-4">🧑‍🍳</div>
        <h1 className="text-3xl font-bold text-[#B8A082] mb-2">Energy Chef</h1>
        <p className="text-lg text-[#8B7355] mb-6">
          A mindful eating game for young learners
        </p>
        <Link 
          href="/game"
          className="inline-block bg-[#A8D5A8] hover:bg-[#96C796] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Start Cooking! 🍳
        </Link>
      </div>
    </div>
  );
}