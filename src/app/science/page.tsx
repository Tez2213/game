import Link from 'next/link';

export default function Science() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-lg mx-4">
        <div className="text-6xl mb-4">🔬</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Science Games</h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose a science game to start learning
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/science/chef-game"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            🧑‍🍳 Chef Game
          </Link>
          
          <Link 
            href="/science/solar-game"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            ☀️ Solar Game
          </Link>
        </div>
        
        <Link 
          href="/"
          className="inline-block mt-6 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
