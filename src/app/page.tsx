import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4">
        <div className="text-6xl flex justify-center items-center mb-4">
          <img className='h-20' src={'/gaming.gif'} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Games</h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose your subject to start learning
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/maths"
            className="flex justify-center items-center w-full bg-sky-400 hover:bg-sky-500 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span> <img className='h-10' src={'/math.gif'} /> </span><span>Maths</span>
          </Link>
          
          <Link 
            href="/science"
            className="flex justify-center items-center w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span> <img className='h-10' src={'/lens.gif'} /> </span><span>Science</span>
          </Link>
        </div>
      </div>
    </div>
  );
}