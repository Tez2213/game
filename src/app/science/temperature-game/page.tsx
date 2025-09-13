'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Types
interface Scenario {
  id: string;
  title: string;
  description: string;
  correctTemp: number;
  unit: 'C' | 'F';
  emoji: string;
  tolerance: number;
  fact: string;
  relatedTopics: string[];
}

// Game data
const SCENARIOS: Scenario[] = [
  {
    id: 'boiling-water',
    title: 'Boiling Water',
    description: 'Water is bubbling and turning into steam',
    correctTemp: 100,
    unit: 'C',
    emoji: "/drop.gif",
    tolerance: 2,
    fact: 'Water boils at 100°C (212°F) at sea level. At higher altitudes, water boils at lower temperatures due to reduced atmospheric pressure!',
    relatedTopics: ['States of matter', 'Atmospheric pressure', 'Evaporation']
  },
  {
    id: 'human-fever',
    title: 'Person with Fever',
    description: 'Someone is feeling sick and has a high temperature',
    correctTemp: 38,
    unit: 'C',
    emoji: '/fever.gif',
    tolerance: 1,
    fact: 'Normal human body temperature is around 37°C (98.6°F). A fever usually starts at 38°C (100.4°F) and helps fight infections!',
    relatedTopics: ['Human body', 'Immune system', 'Medical thermometers']
  },
  {
    id: 'ice-melting',
    title: 'Ice Melting',
    description: 'Ice cubes are turning into liquid water',
    correctTemp: 0,
    unit: 'C',
    emoji: '/icecube.gif',
    tolerance: 1,
    fact: 'Ice melts at 0°C (32°F). This is called the melting point of water. Adding salt can lower this temperature!',
    relatedTopics: ['Phase transitions', 'Freezing point', 'Solutions']
  },
  {
    id: 'room-temperature',
    title: 'Comfortable Room',
    description: 'A pleasant indoor environment for studying',
    correctTemp: 22,
    unit: 'C',
    emoji: '/roomtemp.gif',
    tolerance: 3,
    fact: 'Most people find temperatures between 20-24°C (68-75°F) comfortable. This varies by humidity and personal preference!',
    relatedTopics: ['Thermal comfort', 'HVAC systems', 'Energy efficiency']
  },
  {
    id: 'hot-summer',
    title: 'Hot Summer Day',
    description: 'A very warm day with bright sunshine',
    correctTemp: 35,
    unit: 'C',
    emoji: '/hotsummer.gif',
    tolerance: 3,
    fact: 'Hot summer days can reach 35°C (95°F) or higher. Our bodies cool down through sweating and evaporation!',
    relatedTopics: ['Weather patterns', 'Heat regulation', 'Climate']
  },
  {
    id: 'cold-winter',
    title: 'Cold Winter Day',
    description: 'A chilly day with frost on the ground',
    correctTemp: -5,
    unit: 'C',
    emoji: '/coldwinter',
    tolerance: 3,
    fact: 'Winter temperatures can drop below 0°C (32°F). Frost forms when surfaces cool below the dew point!',
    relatedTopics: ['Weather', 'Frost formation', 'Seasonal changes']
  }
];

const TemperatureMaster: React.FC = () => {
  // Game state
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [userTemp, setUserTemp] = useState<number>(25);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showFact, setShowFact] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Canvas reference for thermometer
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw thermometer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Thermometer dimensions - optimized for mobile
    const thermometerWidth = 50;
    const thermometerHeight = canvasHeight - 100;
    const bulbRadius = 30;
    const centerX = canvasWidth / 2;
    const startY = 50;

    // Temperature range (-20 to 120°C)
    const minTemp = -20;
    const maxTemp = 120;
    const tempRange = maxTemp - minTemp;
    
    // Calculate liquid height based on current temperature
    const tempRatio = (userTemp - minTemp) / tempRange;
    const liquidHeight = Math.max(0, Math.min(thermometerHeight, tempRatio * thermometerHeight));

    // Draw thermometer outline
    ctx.strokeStyle = '#374151';
    ctx.fillStyle = '#f3f4f6';
    ctx.lineWidth = 3;

    // Main tube
    ctx.beginPath();
    ctx.roundRect(centerX - thermometerWidth/2, startY, thermometerWidth, thermometerHeight, 25);
    ctx.fill();
    ctx.stroke();

    // Bulb at bottom
    ctx.beginPath();
    ctx.arc(centerX, startY + thermometerHeight + bulbRadius, bulbRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw temperature liquid
    const liquidColor = userTemp < 0 ? '#3b82f6' : userTemp < 30 ? '#10b981' : userTemp < 60 ? '#f59e0b' : '#ef4444';
    ctx.fillStyle = liquidColor;

    // Liquid in bulb
    ctx.beginPath();
    ctx.arc(centerX, startY + thermometerHeight + bulbRadius, bulbRadius - 5, 0, Math.PI * 2);
    ctx.fill();

    // Liquid in tube (from bottom up)
    if (liquidHeight > 0) {
      ctx.beginPath();
      ctx.roundRect(
        centerX - (thermometerWidth/2 - 8), 
        startY + thermometerHeight - liquidHeight, 
        thermometerWidth - 16, 
        liquidHeight, 
        15
      );
      ctx.fill();
    }

    // Draw temperature scale marks and labels
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';

    const scaleTemps = [-20, 0, 25, 50, 75, 100, 120];
    scaleTemps.forEach(temp => {
      const y = startY + thermometerHeight - ((temp - minTemp) / tempRange) * thermometerHeight;
      
      // Scale mark
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX + thermometerWidth/2, y);
      ctx.lineTo(centerX + thermometerWidth/2 + 12, y);
      ctx.stroke();
      
      // Temperature label
      ctx.fillStyle = '#374151';
      ctx.fillText(`${temp}°C`, centerX + thermometerWidth/2 + 15, y + 3);
    });

    // Draw current temperature indicator line to show exact position
    if (!showResult) {
      const currentTempY = startY + thermometerHeight - ((userTemp - minTemp) / tempRange) * thermometerHeight;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      
      ctx.beginPath();
      ctx.moveTo(centerX - thermometerWidth/2 - 10, currentTempY);
      ctx.lineTo(centerX + thermometerWidth/2 + 10, currentTempY);
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Current temperature label
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${userTemp}°C`, centerX - thermometerWidth/2 - 12, currentTempY + 3);
    }

    // Draw current temperature display - larger for mobile
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${userTemp}°C`, centerX, startY - 25);

    // Draw target indicator if result is shown
    if (showResult) {
      const targetY = startY + thermometerHeight - ((currentScenario.correctTemp - minTemp) / tempRange) * thermometerHeight;
      ctx.strokeStyle = isCorrect ? '#10b981' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.moveTo(centerX - thermometerWidth/2 - 15, targetY);
      ctx.lineTo(centerX + thermometerWidth/2 + 15, targetY);
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Target temperature label
      ctx.fillStyle = isCorrect ? '#10b981' : '#ef4444';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`Target: ${currentScenario.correctTemp}°C`, centerX, targetY - 20);
    }

  }, [userTemp, currentScenario, showResult, isCorrect]);

  // Check answer
  const checkAnswer = () => {
    const difference = Math.abs(userTemp - currentScenario.correctTemp);
    const correct = difference <= currentScenario.tolerance;
    
    setIsCorrect(correct);
    setShowResult(true);
    setAttempts(attempts + 1);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  // Next scenario
  const nextScenario = () => {
    const currentIndex = SCENARIOS.findIndex(s => s.id === currentScenario.id);
    const nextIndex = (currentIndex + 1) % SCENARIOS.length;
    setCurrentScenario(SCENARIOS[nextIndex]);
    setShowResult(false);
    setShowFact(false);
    setUserTemp(25); // Reset to a neutral temperature
    setSelectedTopics([]);
  };

  // Reset game
  const resetGame = () => {
    setCurrentScenario(SCENARIOS[0]);
    setUserTemp(25); // Reset to a neutral temperature
    setShowResult(false);
    setShowFact(false);
    setScore(0);
    setAttempts(0);
    setSelectedTopics([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 font-sans">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="https://eklavyaa.vercel.app/chapters/science-world" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 text-sm">
            ← Back
          </Link>
          <h1 className="text-lg font-bold flex gap-2 text-gray-800">
            <span>
              <img className='h-7' src={'/temp.gif'} />
            </span> 
            <span>Temperature Master</span>
          </h1>
          <div className="text-sm text-gray-600">
            {score}/{attempts}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4 pb-8">
        <div className="space-y-6">
          
          {/* Thermometer Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="text-center mb-4">
              <div className="text-4xl flex justify-center items-center mb-2"><img className='h-22' src={currentScenario.emoji} /></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{currentScenario.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{currentScenario.description}</p>
            </div>

            {/* Thermometer Canvas */}
            <div className="flex justify-center mb-6">
              <canvas
                ref={canvasRef}
                width={250}
                height={350}
                className="w-[250px] h-[350px] border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-sky-25 to-blue-25 shadow-inner"
              />
            </div>

            {/* Temperature Slider */}
            <div className="mb-6">
              <label className="block font-bold text-lg text-blue-700 mb-3 text-center">
                Set Temperature: <span className="text-2xl font-mono text-gray-800">{userTemp}°C</span>
              </label>
              <input
                type="range"
                min="-20"
                max="120"
                step="1"
                value={userTemp}
                onChange={(e) => setUserTemp(parseInt(e.target.value))}
                className="w-full h-4 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-temp"
                disabled={showResult}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>-20°C</span>
                <span>0°C</span>
                <span>50°C</span>
                <span>100°C</span>
                <span>120°C</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!showResult ? (
                <button
                  onClick={checkAnswer}
                  className="flex p-8 gap-4 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                >
                  <span>
              <img className='h-7' src={'/temp.gif'} />
            </span> 
            <span>Check Temperature</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowFact(!showFact)}
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                  >
                    {showFact ? 'Hide Fact' : 'Learn More'} 📚
                  </button>
                  <button
                    onClick={nextScenario}
                    className="flex justify-center items-center p-1 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <span>Next Challenge</span>
                    <span><img className='h-8' src={'/rocket.gif'} /></span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Results and Info Section */}
          <div className="space-y-4">
            
            {/* Result Display */}
            {showResult && (
              <div className={`p-4 rounded-2xl shadow-xl border border-white/20 ${
                isCorrect 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100'
              }`}>
                <div className="text-center">
                  <div className=" flex justify-center items-center mb-2">
                    {isCorrect ? <img className='h-15' src={'/correct.gif'} /> : <img className='h-15' src={'/incorrect.gif' } />}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isCorrect ? 'Excellent!' : 'Not quite right!'}
                  </h3>
                  <p className={`text-sm ${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isCorrect 
                      ? `Perfect! You were within ${currentScenario.tolerance}°C of the correct temperature.`
                      : `The correct temperature is ${currentScenario.correctTemp}°C. You were ${Math.abs(userTemp - currentScenario.correctTemp)}°C off.`
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Fun Fact */}
            {showFact && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-3 text-center">🧠 Did You Know?</h4>
                <p className="text-blue-700 text-sm leading-relaxed mb-4">
                  {currentScenario.fact}
                </p>
                
                {/* Related Topics */}
                <div className="mt-4">
                  <h5 className="font-semibold text-blue-800 mb-2">🔗 Related Topics:</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentScenario.relatedTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!selectedTopics.includes(topic)) {
                            setSelectedTopics([...selectedTopics, topic]);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedTopics.includes(topic)
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions */}
                {selectedTopics.length > 0 && (
                  <div className="mt-4 p-3 bg-white/50 rounded-lg border border-blue-200">
                    <h6 className="font-semibold text-blue-800 mb-2">🤖 Want to explore more?</h6>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {selectedTopics.includes('States of matter') && (
                        <li>• Try our Phase Change Simulator to see how matter changes with temperature!</li>
                      )}
                      {selectedTopics.includes('Human body') && (
                        <li>• Learn about how our body regulates temperature through sweating and shivering!</li>
                      )}
                      {selectedTopics.includes('Weather patterns') && (
                        <li>• Explore how temperature affects weather in our Climate Explorer game!</li>
                      )}
                      {selectedTopics.includes('Thermal comfort') && (
                        <li>• Discover how humidity and air movement affect how temperature feels!</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Game Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h4 className="font-bold flex justify-center items-center gap-2 text-gray-800 mb-3 text-center"><span><img className='h-8' src={'/progress.gif'} /></span><span>Your Progress</span></h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-xs text-blue-800">Correct</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{attempts}</div>
                  <div className="text-xs text-purple-800">Total Attempts</div>
                </div>
              </div>
              
              {attempts > 0 && (
                <div className="mt-4 text-center">
                  <div className="text-lg font-semibold text-gray-700">
                    Accuracy: {Math.round((score / attempts) * 100)}%
                  </div>
                  <button
                    onClick={resetGame}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    🔄 Reset Game
                  </button>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-xl border border-yellow-100">
              <h4 className="font-bold text-yellow-800 mb-3 text-center">💡 Quick Tips</h4>
              <ul className="text-yellow-700 text-sm space-y-2">
                <li>• 0°C = Water freezes/ice melts</li>
                <li>• 37°C = Normal body temperature</li>
                <li>• 100°C = Water boils (at sea level)</li>
                <li>• Room temperature ≈ 20-22°C</li>
                <li>• Hot summer day ≈ 30-35°C</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Styling */}
      <style>{`
        .slider-temp {
          -webkit-appearance: none;
          appearance: none;
          height: 16px;
          border-radius: 8px;
          background: #bfdbfe;
          outline: none;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .slider-temp:hover {
          opacity: 1;
        }

        .slider-temp::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
          border: 2px solid #ffffff;
        }
        
        .slider-temp::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider-temp::-webkit-slider-track {
          height: 16px;
          border-radius: 8px;
          background: #bfdbfe;
        }

        .slider-temp::-moz-range-track {
          height: 16px;
          border-radius: 8px;
          background: #bfdbfe;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default TemperatureMaster;
