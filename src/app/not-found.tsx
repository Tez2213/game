'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-[#ffce3b]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto text-center">
        {/* Error Image */}
        <div className="mb-6">
          <div className="relative w-48 h-36 mx-auto rounded-xl overflow-hidden shadow-md">
            <Image
              src="/err.webp"
              alt="404 Error"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Error Text */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            The page you are looking for does not exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Back to Dashboard Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-[#ffce3b] hover:bg-[#ffde00] text-white py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13z"/>
            </svg>
            Back to Dashboard
          </button>

          {/* Go Back Button */}
          <button
            onClick={() => router.back()}
            className="w-full py-2 rounded-xl border border-[#ffce3b]/30 hover:bg-[#ffce3b]/10 text-[#ffce3b] hover:text-[#ffde00] transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"/>
            </svg>
            Go Back
          </button>
        </div>

        {/* Fun Message */}
        <div className="mt-6 p-3 bg-[#ffce3b]/10 rounded-xl border border-[#ffce3b]/20">
          <p className="text-[#ffce3b] text-sm font-medium">
            🌟 Keep learning with Eklavyaa!
          </p>
        </div>
      </div>
    </div>
  );
}
