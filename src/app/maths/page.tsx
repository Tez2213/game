import Link from 'next/link';

export default function Maths() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-lg mx-4">
        <div className="text-6xl mb-4">📐</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maths Games</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore mathematical concepts through interactive games
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/maths/pythagorean-game"
            className="block w-full bg-sky-400 hover:bg-sky-500 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
          >
            � Pythagorean Theorem
          </Link>
          
          {/* Future math games can be added here */}
          <div className="text-gray-400 text-sm mt-4">
            More math games coming soon!
          </div>
        </div>
        
        <div className="mt-6">
          <Link 
            href="/"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
