'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const PythagorasProof: React.FC = () => {
  // State management for triangle sides
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(4);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Canvas reference
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Derived values
  const c = Math.sqrt(a * a + b * b);
  const aSquared = a * a;
  const bSquared = b * b;
  const cSquared = c * c;
  
  // Drawing logic using useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Canvas dimensions - larger for mobile app format
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Scale factor to fit everything nicely in canvas - increased for bigger display
    const maxSide = Math.max(a, b, c);
    const scale = Math.min(canvasWidth, canvasHeight) / (maxSide * 2.8); // Reduced divisor for larger display
    const scaledA = a * scale;
    const scaledB = b * scale;
    // scaledC is calculated but not used directly in positioning, keeping for potential future use
    // const scaledC = c * scale;
    
    // Center position for the triangle
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Triangle vertices (positioned in center with right angle at bottom-left)
    const rightAngle = { x: centerX - scaledB / 2, y: centerY + scaledA / 2 };
    const topVertex = { x: rightAngle.x, y: rightAngle.y - scaledA };
    const rightVertex = { x: rightAngle.x + scaledB, y: rightAngle.y };
    
    // Function to draw a square extending outward from a side
    const drawSquare = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      color: string,
      label: string,
      area: number
    ) => {
      // Calculate the side vector and its perpendicular
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      
      // For the perpendicular, we want squares to extend outward from the triangle
      let perpX = -dy;
      let perpY = dx;
      
      // Adjust direction based on which side this is
      if (p1 === rightAngle && p2 === topVertex) {
        // Side 'a' - extend to the left
        perpX = -perpX;
        perpY = -perpY;
      } else if (p1 === rightAngle && p2 === rightVertex) {
        // Side 'b' - extend downward (already correct)
      } else {
        // Side 'c' (hypotenuse) - ensure it extends away from the right angle
        // Calculate the center of the hypotenuse
        const centerOfHypotenuse = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        
        // Vector from center of hypotenuse to right angle
        const toRightAngle = { 
          x: rightAngle.x - centerOfHypotenuse.x, 
          y: rightAngle.y - centerOfHypotenuse.y 
        };
        
        // Use cross product to determine which side the right angle is on
        const cross = perpX * toRightAngle.x + perpY * toRightAngle.y;
        
        // If the perpendicular vector points toward the right angle, flip it
        if (cross > 0) {
          perpX = -perpX;
          perpY = -perpY;
        }
      }
      
      // Square vertices extending outward from the triangle
      const vertices = [
        p1,
        p2,
        { x: p2.x + perpX, y: p2.y + perpY },
        { x: p1.x + perpX, y: p1.y + perpY }
      ];
      
      // Draw square with semi-transparent fill
      ctx.fillStyle = color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      vertices.forEach(vertex => ctx.lineTo(vertex.x, vertex.y));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw label and area in center of square
      const centerX = (vertices[0].x + vertices[2].x) / 2;
      const centerY = (vertices[0].y + vertices[2].y) / 2;
      
      // Background circle for better readability - larger for mobile
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw label - larger font for mobile
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, centerX, centerY - 10);
      
      // Draw area value - larger font for mobile
      ctx.font = '16px Arial';
      ctx.fillText(area.toFixed(1), centerX, centerY + 12);
    };
    
    // Draw squares on each side (extending outward from triangle)
    drawSquare(rightAngle, topVertex, 'rgba(252, 165, 165, 0.8)', 'a²', aSquared); // Light red for a²
    drawSquare(rightAngle, rightVertex, 'rgba(147, 197, 253, 0.8)', 'b²', bSquared); // Light blue for b²
    drawSquare(topVertex, rightVertex, 'rgba(134, 239, 172, 0.8)', 'c²', cSquared); // Light green for c²
    
    // Draw triangle on top of squares with thicker outline
    ctx.strokeStyle = '#374151';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(rightAngle.x, rightAngle.y);
    ctx.lineTo(topVertex.x, topVertex.y);
    ctx.lineTo(rightVertex.x, rightVertex.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw right angle indicator - larger for mobile
    const rightAngleSize = 25;
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(rightAngle.x + rightAngleSize, rightAngle.y);
    ctx.lineTo(rightAngle.x + rightAngleSize, rightAngle.y - rightAngleSize);
    ctx.lineTo(rightAngle.x, rightAngle.y - rightAngleSize);
    ctx.stroke();
    
    // Draw side labels on triangle with background - larger for mobile
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Helper function to draw text with background - larger for mobile
    const drawLabelWithBackground = (text: string, x: number, y: number, color: string) => {
      // Background circle - larger for mobile
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, x, y);
    };
    
    // Label for side a (vertical left side) - adjusted positioning for larger display
    drawLabelWithBackground('a', rightAngle.x - 25, (rightAngle.y + topVertex.y) / 2, '#dc2626');
    
    // Label for side b (horizontal bottom side) - adjusted positioning for larger display
    drawLabelWithBackground('b', (rightAngle.x + rightVertex.x) / 2, rightAngle.y + 25, '#2563eb');
    
    // Label for side c (hypotenuse) - adjusted positioning for larger display
    drawLabelWithBackground('c', (topVertex.x + rightVertex.x) / 2 + 20, (topVertex.y + rightVertex.y) / 2 - 20, '#059669');
    
  }, [a, b, c, aSquared, bSquared, cSquared]);

  // Animation function
  const animateProof = () => {
    setIsAnimating(true);
    // Simple animation state - you can expand this with actual tile animation later
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 font-sans">
      {/* Mobile App Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/science" className="text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-2 text-sm">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-gray-800">Pythagoras&apos; Playhouse 📐</h1>
          <div className="w-12"></div>
        </div>
      </div>
      
      {/* Main Content - Mobile App Layout */}
      <div className="max-w-md mx-auto p-4 pb-8">
        <div className="flex flex-col items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          
          {/* Large Canvas for Mobile */}
          <div className="w-full flex justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] border-2 border-amber-200 rounded-2xl bg-gradient-to-br from-orange-25 to-amber-25 shadow-inner"
            />
          </div>
          
          {/* Animate Button */}
          <button
            onClick={animateProof}
            disabled={isAnimating}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
              isAnimating 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl active:scale-95'
            }`}
          >
            {isAnimating ? '✨ Animating Magic...' : '✨ Animate Proof!'}
          </button>
          
          {/* Controls Section */}
          <div className="w-full flex flex-col gap-6">
            <h3 className="text-xl font-bold text-gray-800 text-center">Adjust Triangle Sides</h3>
            
            {/* Side A Control */}
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <label className="block font-bold text-lg text-red-700 mb-3 text-center">
                Side a: <span className="text-2xl font-mono">{a}</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.1"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer slider-red"
              />
            </div>
            
            {/* Side B Control */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <label className="block font-bold text-lg text-blue-700 mb-3 text-center">
                Side b: <span className="text-2xl font-mono">{b}</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.1"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-blue"
              />
            </div>
          </div>
          
          {/* Formula Display - Mobile Optimized */}
          <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <div className="text-center mb-4">
              <div className="text-2xl font-mono font-bold mb-2">
                <span className="text-red-600">{a}</span>² + 
                <span className="text-blue-600"> {b}</span>² = 
                <span className="text-green-600"> {c.toFixed(2)}</span>²
              </div>
              <div className="text-lg text-gray-600 font-mono">
                <span className="text-red-600 font-bold">{aSquared.toFixed(1)}</span> + 
                <span className="text-blue-600 font-bold"> {bSquared.toFixed(1)}</span> = 
                <span className="text-green-600 font-bold"> {cSquared.toFixed(1)}</span>
              </div>
            </div>
            
            {/* Verification */}
            <div className="text-center">
              {Math.abs(aSquared + bSquared - cSquared) < 0.01 ? (
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg font-bold text-lg">
                  ✅ Perfect! The theorem is verified!
                </div>
              ) : (
                <div className="bg-amber-100 text-amber-800 px-4 py-3 rounded-lg font-bold">
                  📏 Explore different triangles
                </div>
              )}
            </div>
          </div>
          
          {/* Educational Information - Compact for Mobile */}
          <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2 text-center">📐 The Magic Formula</h4>
            <p className="text-blue-700 text-sm text-center leading-relaxed">
              In any right triangle, the square of the longest side equals the sum of squares of the other two sides. 
              <br /><strong>Move the sliders to discover this magical relationship!</strong>
            </p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Mobile Slider Styling */}
      <style jsx>{`
        .slider-red::-webkit-slider-thumb {
          appearance: none;
          height: 28px;
          width: 28px;
          background: #dc2626;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4);
        }
        
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          height: 28px;
          width: 28px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
        }
        
        .slider-red::-moz-range-thumb,
        .slider-blue::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .slider-red::-moz-range-thumb {
          background: #dc2626;
        }
        
        .slider-blue::-moz-range-thumb {
          background: #2563eb;
        }
        
        .slider-red::-webkit-slider-track,
        .slider-blue::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default PythagorasProof;