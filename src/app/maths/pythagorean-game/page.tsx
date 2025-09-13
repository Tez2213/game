'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const PythagorasProof: React.FC = () => {
  // State management for triangle sides
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(4);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // New states for enhanced interactions
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showFact, setShowFact] = useState<boolean>(false);
  const [currentFact, setCurrentFact] = useState<string>('');
  const [userActions, setUserActions] = useState<number>(0);
  const [lastSuggestionTime, setLastSuggestionTime] = useState<number>(0);
  
  // Canvas reference
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Derived values
  const c = Math.sqrt(a * a + b * b);
  const aSquared = a * a;
  const bSquared = b * b;
  const cSquared = c * c;
  
  // Educational facts database
  const facts = {
    basic: "Pythagoras was a Greek mathematician who lived around 570-495 BC. His theorem is one of the most famous in mathematics!",
    realWorld: "Pythagorean theorem is used everywhere! Construction workers use it to build square corners, GPS systems use it to calculate distances, and even video game graphics rely on it!",
    perfectTriangles: "The triangle 3-4-5 is called a 'Pythagorean triple' - where all sides are whole numbers. Other examples include 5-12-13 and 8-15-17!",
    squares: "The squares you see represent the actual area! If you built real squares on each side of a right triangle, the areas would perfectly balance according to the theorem.",
    history: "Ancient Egyptians used the 3-4-5 triangle to build the pyramids thousands of years before Pythagoras! They called it the 'sacred triangle'.",
    isosceles: "When both legs (a and b) are equal, you get an isosceles right triangle - it appears in square diagonals and has special properties!",
    golden: "Try making a=3, b=4 to see the famous 3-4-5 triangle that ancient builders loved!"
  };
  
  // Get triangle characteristics
  const getTriangleType = () => {
    if (Math.abs(a - b) < 0.1) return 'isosceles';
    if (a === 3 && b === 4) return 'golden';
    if (Math.abs(a - Math.round(a)) < 0.1 && Math.abs(b - Math.round(b)) < 0.1 && Math.abs(c - Math.round(c)) < 0.1) return 'perfectTriangles';
    return 'basic';
  };
  
  // AI Suggestions based on user actions
  const getSuggestions = () => {
    const triangleType = getTriangleType();
    const suggestions = [];
    
    if (triangleType === 'isosceles') {
      suggestions.push("🔍 Try: Set one side to 1 and see what happens to the other!");
      suggestions.push("📐 Explore: What happens when you make a square's diagonal?");
    } else if (triangleType === 'golden') {
      suggestions.push("🏛️ Try: This 3-4-5 triangle built the pyramids!");
      suggestions.push("🔢 Explore: Can you find other whole number triangles?");
    } else if (triangleType === 'perfectTriangles') {
      suggestions.push("⭐ Try: Look for other Pythagorean triples like 5-12-13!");
      suggestions.push("🎯 Challenge: Can you make both legs the same length?");
    } else {
      suggestions.push("🔄 Try: Make both sides equal and see the magic!");
      suggestions.push("📏 Explore: Set exact whole numbers like 6 and 8!");
    }
    
    suggestions.push("🎨 Create: Draw your triangle on paper and verify!");
    suggestions.push("🧮 Calculate: Use a calculator to double-check the math!");
    
    return suggestions;
  };
  
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

  // AI Suggestions Modal Component
  const SuggestionsModal = () => {
    if (!showSuggestions) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl animate-scale-in border border-gray-200">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="text-lg font-bold text-gray-800">AI Learning Suggestions</h3>
            <p className="text-sm text-gray-600">Ready to explore more?</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {getSuggestions().slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setShowSuggestions(false);
                  // Auto-apply suggestion if it involves specific values
                  if (suggestion.includes('3-4-5')) {
                    setA(3);
                    setB(4);
                  } else if (suggestion.includes('equal')) {
                    setB(a);
                  } else if (suggestion.includes('6 and 8')) {
                    setA(6);
                    setB(8);
                  }
                }}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <span className="text-sm text-gray-700">{suggestion}</span>
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFact(true)}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
            >
              📚 Show Fact
            </button>
            <button
              onClick={() => setShowSuggestions(false)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Educational Fact Modal Component
  const FactModal = () => {
    if (!showFact) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl animate-scale-in border border-gray-200">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">💡</div>
            <h3 className="text-lg font-bold text-gray-800">Did You Know?</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{currentFact}</p>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="text-center text-xs text-gray-600">Want to learn more about:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['🏛️ History', '🔢 Numbers', '🏗️ Real World', '📐 Geometry'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    const topicFacts = {
                      '🏛️ History': facts.history,
                      '🔢 Numbers': facts.perfectTriangles,
                      '🏗️ Real World': facts.realWorld,
                      '📐 Geometry': facts.squares
                    };
                    setCurrentFact(topicFacts[topic as keyof typeof topicFacts]);
                  }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowFact(false);
                setShowSuggestions(true);
              }}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
            >
              🤖 More Ideas
            </button>
            <button
              onClick={() => setShowFact(false)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
            >
              Got it! 👍
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Animation function
  const animateProof = () => {
    setIsAnimating(true);
    setUserActions(prev => prev + 1);
    
    // Show suggestions immediately without delay
    setIsAnimating(false);
    setShowSuggestions(true);
    
    // Show relevant fact based on triangle type
    const triangleType = getTriangleType();
    setCurrentFact(facts[triangleType as keyof typeof facts]);
    setShowFact(true);
  };
  
  // Handle slider changes
  const handleSliderChange = (value: number, side: 'a' | 'b') => {
    if (side === 'a') setA(value);
    else setB(value);
    
    setUserActions(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 font-sans">
      {/* Main Game Content */}
      <div className={`${showSuggestions || showFact ? 'filter blur-sm' : ''}`}>
        {/* Mobile App Header */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="https://eklavyaa.vercel.app/chapters/maths-world" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 text-sm">
              ← Back
            </Link>
            <h1 className="text-lg flex justify-center items-center font-bold text-gray-800">
              <span>Pythagoras&apos; house</span>
               <span><img className='h-10' src={'/math.gif'} /></span>
               </h1>
            <div className="w-12"></div>
          </div>
        </div>
        
        {/* Main Content - Mobile App Layout */}
        <div className="max-w-md mx-auto p-4 pb-8">
          <div className="flex flex-col items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          
          {/* Canvas */}
          <div className="w-full flex justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-sky-25 to-blue-25 shadow-inner"
            />
          </div>
          
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
                onChange={(e) => handleSliderChange(parseFloat(e.target.value), 'a')}
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
                onChange={(e) => handleSliderChange(parseFloat(e.target.value), 'b')}
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
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg font-bold text-lg mb-3">
                  ✅ Perfect! The theorem is verified!
                </div>
              ) : (
                <div className="bg-amber-100 text-amber-800 px-4 py-3 rounded-lg font-bold mb-3">
                  📏 Explore different triangles
                </div>
              )}
              
              {/* Progress indicator */}
              <div className="text-xs text-gray-600 mb-2">
                🎯 Interactions: {userActions} | Triangle Type: {getTriangleType()}
              </div>
            </div>
            
            {/* Facts Button */}
            <button
              onClick={() => {
                setUserActions(prev => prev + 1);
                setShowSuggestions(true);
                const triangleType = getTriangleType();
                setCurrentFact(facts[triangleType as keyof typeof facts]);
                setShowFact(true);
              }}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl active:scale-95"
            >
              📚 Facts
            </button>
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
      
      {/* AI Suggestions Modal */}
      <SuggestionsModal />
      
      {/* Educational Fact Modal */}
      <FactModal />
      
      {/* Enhanced Mobile Slider Styling */}
      <style>{`
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
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
      
      {/* AI Suggestions Modal */}
      <SuggestionsModal />
      
      {/* Educational Fact Modal */}
      <FactModal />
    </div>
  );
};

export default PythagorasProof;
