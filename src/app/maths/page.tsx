import Link from 'next/link';

export default function Maths() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-lg mx-4">
        <div className="text-6xl flex justify-center items-center mb-4">
          <img className='h-20' src={'/puzzle.gif'} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maths Games</h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose a maths game to start learning
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/maths/pythagorean-game"
            className="flex gap-2 justify-center items-center w-full bg-sky-400 hover:bg-sky-500 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span><img className='h-10' src={'/pytha.gif'} /></span> <span>Pythagorean Theorem</span>
          </Link>
          
          <Link 
            href="/maths/prime-guardians"
            className="flex gap-2 justify-center items-center w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span><img className='h-10' src={'/shield.gif'} /></span> <span>Prime Guardians</span> 
          </Link>
          
          <Link 
            href="/maths/natures-mirror"
            className="flex justify-center items-center gap-2 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span><img className='h-10' src={'/mirror.gif'} /></span> <span>Nature&apos;s Mirror</span> 
          </Link>
          
          <Link 
            href="/maths/number-mystics"
            className="flex justify-center items-center gap-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span><img className='h-10' src={'/idea.gif'} /></span> <span>The Number Mystics</span> 
          </Link>
          
          <Link 
            href="/maths/deep-sea-diver"
            className="flex justify-center items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span><img className='h-10' src={'/wave.gif'} /></span> <span>Deep Sea Diver</span> 
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