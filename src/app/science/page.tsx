import Link from 'next/link';

export default function Science() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
      <div className="text-center p-8 bg-[#E8DDD4] rounded-2xl shadow-lg max-w-lg mx-4">
        <div className="text-6xl mb-4">🔬</div>
        <h1 className="text-3xl font-bold text-[#B8A082] mb-2">Science Games</h1>
        <p className="text-lg text-[#8B7355] mb-8">
          Choose a science game to start learning
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/science/chef-game"
            className="block w-full bg-[#A8D5A8] hover:bg-[#96C796] text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            🧑‍🍳 Chef Game
          </Link>
          
          <Link 
            href="/science/solar-game"
            className="block w-full bg-[#F4C2A1] hover:bg-[#E4B291] text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            ☀️ Solar Game
          </Link>
          
          <Link 
            href="/science/pythagorean-game"
            className="block w-full bg-[#E8B4CB] hover:bg-[#D8A4BB] text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            📐 Pythagorean Game
          </Link>
        </div>
        
        <Link 
          href="/"
          className="inline-block mt-6 text-[#B8A082] hover:text-[#A89072] font-medium transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
