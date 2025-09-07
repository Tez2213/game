import Link from 'next/link';

export default function Maths() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-lg mx-4">
        <div className="text-6xl mb-4">🧮</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maths Games</h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose a maths game to start learning
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/maths/pythagorean-game"
            className="block w-full bg-sky-400 hover:bg-sky-500 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            📐 Pythagorean Theorem
          </Link>
          
          <Link 
            href="/maths/prime-guardians"
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            🛡️ Prime Guardians
          </Link>
          
          <Link 
            href="/maths/natures-mirror"
            className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            🪞 Nature&apos;s Mirror
          </Link>
          
          <Link 
            href="/maths/number-mystics"
            className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            🔮 The Number Mystics
          </Link>
          
          <Link 
            href="/maths/deep-sea-diver"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            🌊 Deep Sea Diver
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