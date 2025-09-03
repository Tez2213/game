import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
      <div className="text-center p-8 bg-[#E8DDD4] rounded-2xl shadow-lg max-w-md mx-4">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-3xl font-bold text-[#B8A082] mb-2">Learning Games</h1>
        <p className="text-lg text-[#8B7355] mb-8">
          Choose your subject to start learning
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/maths"
            className="block w-full bg-[#B8D4E3] hover:bg-[#A8C4D3] text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            📐 Maths
          </Link>
          
          <Link 
            href="/science"
            className="block w-full bg-[#A8D5A8] hover:bg-[#96C796] text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            🔬 Science
          </Link>
        </div>
      </div>
    </div>
  );
}