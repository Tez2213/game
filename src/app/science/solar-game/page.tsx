'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Planet data with colors and sizes - optimized for mobile
const planetsData = [
  { name: 'Mercury', color: '#8C7853', size: 20, distance: 60, hint: 'Smallest planet, closest to Sun' },
  { name: 'Venus', color: '#FFC649', size: 25, distance: 80, hint: 'Hottest planet with thick clouds' },
  { name: 'Earth', color: '#6B93D6', size: 28, distance: 100, hint: 'Our blue home planet' },
  { name: 'Mars', color: '#CD5C5C', size: 22, distance: 120, hint: 'The Red Planet' },
  { name: 'Jupiter', color: '#D8CA9D', size: 45, distance: 150, hint: 'Largest planet, gas giant' },
  { name: 'Saturn', color: '#FAD5A5', size: 40, distance: 180, hint: 'Planet with beautiful rings' },
  { name: 'Uranus', color: '#4FD0E7', size: 30, distance: 210, hint: 'Ice giant tilted sideways' },
  { name: 'Neptune', color: '#4B70DD', size: 30, distance: 240, hint: 'Windiest planet, deep blue' }
];

type Planet = typeof planetsData[0];

// Shuffle function for randomizing planet order
const shuffleArray = (array: Planet[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Planet component
function Planet({ planetData, isInOrbit, angle = 0, onClick, isClickable = true, centerX, centerY }: {
  planetData: Planet;
  isInOrbit: boolean;
  angle?: number;
  onClick?: () => void;
  isClickable?: boolean;
  centerX: number;
  centerY: number;
}) {
  // Calculate position based on orbit with proper circular motion
  const x = isInOrbit ? centerX + Math.cos(angle) * planetData.distance : 0;
  const y = isInOrbit ? centerY + Math.sin(angle) * planetData.distance : 0;

  return (
    <div
      className={`absolute ${isClickable ? 'cursor-pointer hover:scale-110' : ''} transition-all duration-300 flex items-center justify-center`}
      style={{
        left: x - planetData.size / 2,
        top: y - planetData.size / 2,
        width: planetData.size,
        height: planetData.size,
        backgroundColor: planetData.color,
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: isInOrbit ? `0 0 15px ${planetData.color}` : '0 0 8px rgba(0, 0, 0, 0.5)',
        zIndex: isInOrbit ? 10 : 20
      }}
      onClick={onClick}
      data-planet={planetData.name}
    >
      <span className="text-white text-xs font-bold">
        {planetData.name === 'Earth' && '🌍'}
        {planetData.name === 'Mars' && '🔴'}
        {planetData.name === 'Jupiter' && '🪐'}
        {planetData.name === 'Saturn' && '🪐'}
      </span>
    </div>
  );
}

// Orbit ring component
function OrbitRing({ radius, isHighlighted, centerX, centerY }: { 
  radius: number; 
  isHighlighted: boolean; 
  centerX: number; 
  centerY: number; 
}) {
  return (
    <div
      className="absolute rounded-full border border-dashed pointer-events-none"
      style={{
        left: centerX - radius,
        top: centerY - radius,
        width: radius * 2,
        height: radius * 2,
        borderColor: isHighlighted ? '#FFD700' : 'rgba(255, 255, 255, 0.15)',
        borderWidth: isHighlighted ? '2px' : '1px',
        zIndex: 1
      }}
    />
  );
}

export default function SolarSystemExplorer() {
  const [availablePlanets, setAvailablePlanets] = useState<Planet[]>(() => shuffleArray(planetsData));
  const [placedPlanets, setPlacedPlanets] = useState<Planet[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [highlightedOrbit, setHighlightedOrbit] = useState(-1);
  const [orbitAngles, setOrbitAngles] = useState<{[key: string]: number}>({});
  const [screenSize, setScreenSize] = useState({ width: 400, height: 600 });

  // Responsive design setup
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Calculate responsive center points
  const centerX = screenSize.width > 768 ? 300 : 200;
  const centerY = screenSize.height > 600 ? 250 : 200;

  // Animation for orbiting planets - improved orbit mechanics
  useEffect(() => {
    if (placedPlanets.length === 0) return;

    const interval = setInterval(() => {
      setOrbitAngles(prev => {
        const newAngles = { ...prev };
        placedPlanets.forEach(planet => {
          // Different orbital speeds - closer planets orbit faster (Kepler's laws)
          const baseSpeed = 0.02;
          const speed = baseSpeed * (100 / planet.distance); // Inverse relationship to distance
          newAngles[planet.name] = ((prev[planet.name] || 0) + speed) % (Math.PI * 2);
        });
        return newAngles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [placedPlanets]);

  useEffect(() => {
    if (placedPlanets.length === 8) {
      setGameComplete(true);
    }
  }, [placedPlanets]);

  const handlePlanetClick = (planetData: Planet) => {
    // Check if this is the correct next planet
    const correctOrbitIndex = planetsData.findIndex(p => p.name === planetData.name);
    const isCorrectNext = placedPlanets.length === correctOrbitIndex;
    
    if (isCorrectNext) {
      // Correct placement
      setPlacedPlanets(prev => [...prev, planetData]);
      setAvailablePlanets(prev => prev.filter(p => p.name !== planetData.name));
      setOrbitAngles(prev => ({ ...prev, [planetData.name]: 0 }));
      playCorrectSound();
    } else {
      // Incorrect placement - shake animation
      const element = document.querySelector(`[data-planet="${planetData.name}"]`) as HTMLElement;
      if (element) {
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
          element.style.animation = '';
        }, 500);
      }
      playIncorrectSound();
    }
  };

  const playCorrectSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      console.log('Audio not available');
    }
  };

  const playIncorrectSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      console.log('Audio not available');
    }
  };

  const getHint = () => {
    if (availablePlanets.length > 0) {
      // Find the next planet that should be placed
      const nextCorrectIndex = placedPlanets.length;
      const nextPlanet = planetsData[nextCorrectIndex];
      
      if (nextPlanet) {
        setCurrentHint(nextPlanet.hint);
        setShowHint(true);
        setHighlightedOrbit(nextCorrectIndex);
        setTimeout(() => {
          setShowHint(false);
          setHighlightedOrbit(-1);
        }, 4000);
      }
    }
  };

  const resetGame = () => {
    setAvailablePlanets(shuffleArray(planetsData));
    setPlacedPlanets([]);
    setGameComplete(false);
    setShowHint(false);
    setCurrentHint('');
    setHighlightedOrbit(-1);
    setOrbitAngles({});
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden">
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
      `}</style>
      
      {/* Stars background - reduced for mobile performance */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Mobile-optimized Header */}
      <div className="absolute top-2 left-2 right-2 z-10">
        <div className="flex items-center justify-between mb-2">
          <Link href="/science" className="text-white hover:text-yellow-300 transition-colors text-sm">
            ← Back
          </Link>
          <button
            onClick={resetGame}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg"
          >
            🔄 Reset
          </button>
        </div>
        <h1 className="text-white text-xl md:text-3xl font-bold text-center drop-shadow-lg">
          🚀 Solar System 🪐
        </h1>
        <p className="text-yellow-200 text-center text-sm md:text-lg">
          Place planets in correct order from the Sun!
        </p>
      </div>

      {/* Mobile-optimized Hint Button */}
      <div className="absolute top-28 right-2 z-10">
        <button
          onClick={getHint}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
          disabled={gameComplete}
        >
          💡 Hint
        </button>
      </div>

      {/* Hint Display */}
      {showHint && (
        <div className="absolute top-36 left-2 right-2 z-20 bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium shadow-xl text-center text-sm">
          💭 {currentHint}
        </div>
      )}

      {/* Game Complete Message */}
      {gameComplete && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 p-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 md:p-10 rounded-xl text-center shadow-2xl max-w-sm">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">🎉 Amazing! 🎉</h2>
            <p className="text-sm md:text-xl mb-6">You completed the Solar System!</p>
            <button
              onClick={resetGame}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              🚀 Play Again
            </button>
          </div>
        </div>
      )}

      {/* Solar System View - Mobile centered */}
      <div className="absolute inset-0 flex items-center justify-center pt-20 pb-32">
        {/* Orbit rings */}
        {planetsData.map((planet, index) => (
          <OrbitRing 
            key={`orbit-${index}`} 
            radius={planet.distance} 
            isHighlighted={highlightedOrbit === index}
            centerX={centerX}
            centerY={centerY}
          />
        ))}
        
        {/* Sun - mobile optimized */}
        <div
          className="absolute rounded-full"
          style={{
            left: centerX - 25,
            top: centerY - 25,
            width: 50,
            height: 50,
            backgroundColor: '#FDB813',
            boxShadow: '0 0 30px #FDB813, 0 0 60px rgba(253, 184, 19, 0.5)',
            zIndex: 5
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-200 to-orange-600" />
          <div className="absolute inset-1 rounded-full bg-gradient-radial from-yellow-100 to-transparent opacity-60" />
        </div>
        
        {/* Placed planets (orbiting) */}
        {placedPlanets.map((planet) => (
          <Planet
            key={`placed-${planet.name}`}
            planetData={planet}
            isInOrbit={true}
            angle={orbitAngles[planet.name] || 0}
            isClickable={false}
            centerX={centerX}
            centerY={centerY}
          />
        ))}
      </div>

      {/* Planet Bank - Mobile optimized */}
      <div className="absolute bottom-2 left-2 right-2 z-10">
        <div className="bg-gray-900 bg-opacity-95 rounded-xl p-3 border border-gray-600 shadow-2xl">
          <h3 className="text-white text-lg font-bold mb-3 text-center">
            🪐 Planets ({availablePlanets.length} left)
          </h3>
          <div className="grid grid-cols-4 gap-3 justify-items-center">
            {availablePlanets.map((planet) => (
              <div
                key={planet.name}
                className="text-center cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-200 p-2 rounded-lg hover:bg-gray-800"
                onClick={() => handlePlanetClick(planet)}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center border-2 border-white hover:border-yellow-400 transition-colors shadow-lg"
                  style={{ 
                    backgroundColor: planet.color,
                    boxShadow: `0 0 10px ${planet.color}`
                  }}
                >
                  <span className="text-white text-sm">
                    {planet.name === 'Earth' && '🌍'}
                    {planet.name === 'Mars' && '🔴'}
                    {planet.name === 'Jupiter' && '🪐'}
                    {planet.name === 'Saturn' && '🪐'}
                  </span>
                </div>
                <span className="text-white text-xs font-semibold">{planet.name}</span>
              </div>
            ))}
          </div>
          {availablePlanets.length > 0 && (
            <div className="text-center mt-3 p-2 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-400">
              <p className="text-blue-200 text-xs font-medium">
                🎯 Tap planets in order from closest to Sun!
              </p>
              <p className="text-blue-300 text-xs mt-1">
                Next: <strong>{planetsData[placedPlanets.length]?.name || 'Complete!'}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress indicator - Mobile optimized */}
      <div className="absolute top-24 left-2 z-10">
        <div className="bg-gray-900 bg-opacity-95 rounded-xl p-3 border border-gray-600 shadow-xl">
          <div className="text-white text-xs font-bold mb-2 flex items-center gap-1">
            📊 Progress
          </div>
          <div className="flex gap-1 mb-1">
            {planetsData.map((planet, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index < placedPlanets.length 
                    ? 'bg-green-500 shadow-lg' 
                    : index === placedPlanets.length 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-600'
                }`}
                title={planetsData[index].name}
              />
            ))}
          </div>
          <div className="text-gray-300 text-xs">
            {placedPlanets.length}/8 planets
          </div>
          {placedPlanets.length > 0 && (
            <div className="text-green-400 text-xs mt-1">
              ✅ {placedPlanets[placedPlanets.length - 1].name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
