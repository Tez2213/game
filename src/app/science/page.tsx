import Link from 'next/link';

export default function Science() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-lg mx-4">
        <div className="text-6xl flex justify-center items-center mb-4">
          <img className='h-20' src={'/lens.gif'} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Science Games</h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose a science game to start learning
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/science/chef-game"
            className="flex justify-center items-center w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span> <img className='h-10' src={'/chef.gif'} /> </span><span>Chef Game</span>
          </Link>
          
          <Link 
            href="/science/solar-game"
            className="w-full flex justify-center items-center  bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span> <img className='h-10' src={'/hotsummer.gif'} /> </span><span>Solar Game</span>
          </Link>

          <Link 
            href="/science/temperature-game"
            className="flex justify-center items-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span> <img className='h-9' src={'/temp.gif'} /> </span><span>Temperature Master</span>
          </Link>

          <Link 
            href="/science/material-game"
            className="flex justify-center items-center w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span> <img className='h-10' src={'/lens.gif'} /> </span><span>Material Mix Up</span>
          </Link>

          <Link 
            href="/science/water-cycle-game"
            className="flex justify-center items-center w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-1 rounded-lg transition-colors duration-200"
          >
            <span> <img className='h-10' src={'/drop.gif'} /> </span><span>Water Cycle Adventure</span>
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
