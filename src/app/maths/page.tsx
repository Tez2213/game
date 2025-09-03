import Link from 'next/link';

export default function Maths() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
      <div className="text-center p-8 bg-[#E8DDD4] rounded-2xl shadow-lg max-w-lg mx-4">
        <div className="text-6xl mb-4">📐</div>
        <h1 className="text-3xl font-bold text-[#B8A082] mb-2">Maths Games</h1>
        <p className="text-lg text-[#8B7355] mb-8">
          Mathematics games coming soon!
        </p>
        
        <div className="bg-[#F4C2A1] text-white p-6 rounded-lg mb-6">
          <p className="text-lg font-medium">🚧 Under Construction</p>
          <p className="text-sm mt-2">Math games will be available soon</p>
        </div>
        
        <Link 
          href="/"
          className="inline-block text-[#B8A082] hover:text-[#A89072] font-medium transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
