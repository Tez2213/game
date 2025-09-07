import Link from 'next/link';

export default function PrimeGuardians() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <div className="text-6xl mb-6">🛡️</div>
        <h1 className="text-4xl font-bold text-purple-900 mb-4">
          Prime Guardians
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Coming Soon! This game is under development.
        </p>
        <p className="text-gray-500 mb-8">
          Get ready to defend the kingdom using the power of prime numbers!
        </p>
        
        <Link 
          href="https://eklavyaa.vercel.app/chapters/maths-world"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200"
        >
          ← Back to Maths World
        </Link>
      </div>
    </div>
  );
}