'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Planet data with colors and sizes - optimized for mobile
const planetsData = [
  { 
    name: 'Mercury', 
    color: '#8C7853', 
    size: 20, 
    distance: 60, 
    hint: 'Smallest planet, closest to Sun',
    facts: [
      'Mercury is the smallest planet in our solar system',
      'A day on Mercury lasts 59 Earth days',
      'Mercury has no atmosphere to retain heat',
      'Temperatures range from 800°F to -300°F'
    ],
    funFact: 'Mercury is named after the Roman messenger god because it moves so fast around the Sun!',
    relatedTopics: ['Orbital mechanics', 'Temperature extremes', 'Planetary composition']
  },
  { 
    name: 'Venus', 
    color: '#FFC649', 
    size: 25, 
    distance: 80, 
    hint: 'Hottest planet with thick clouds',
    facts: [
      'Venus is the hottest planet in our solar system',
      'It rotates backwards compared to most planets',
      'Venus has a thick, toxic atmosphere',
      'A day on Venus is longer than its year'
    ],
    funFact: 'Venus is sometimes called Earth\'s twin, but it\'s more like Earth\'s evil twin with its hellish conditions!',
    relatedTopics: ['Greenhouse effect', 'Atmospheric pressure', 'Retrograde rotation']
  },
  { 
    name: 'Earth', 
    color: '#6B93D6', 
    size: 28, 
    distance: 100, 
    hint: 'Our blue home planet',
    facts: [
      'Earth is the only known planet with life',
      '71% of Earth is covered by water',
      'Earth has one natural satellite - the Moon',
      'It takes 365.25 days to orbit the Sun'
    ],
    funFact: 'Earth is the only planet not named after a Roman or Greek god - it comes from Old English meaning "ground"!',
    relatedTopics: ['Biodiversity', 'Water cycle', 'Magnetic field']
  },
  { 
    name: 'Mars', 
    color: '#CD5C5C', 
    size: 22, 
    distance: 120, 
    hint: 'The Red Planet',
    facts: [
      'Mars appears red due to iron oxide (rust)',
      'Mars has the largest volcano in the solar system',
      'It has two small moons: Phobos and Deimos',
      'Mars has seasons similar to Earth'
    ],
    funFact: 'Mars has dust storms that can cover the entire planet and last for months!',
    relatedTopics: ['Space exploration', 'Terraforming', 'Polar ice caps']
  },
  { 
    name: 'Jupiter', 
    color: '#D8CA9D', 
    size: 45, 
    distance: 150, 
    hint: 'Largest planet, gas giant',
    facts: [
      'Jupiter is larger than all other planets combined',
      'It has over 80 known moons',
      'Jupiter\'s Great Red Spot is a giant storm',
      'It acts as a "cosmic vacuum cleaner"'
    ],
    funFact: 'Jupiter is like a failed star - if it were 80 times more massive, it could have become a second sun!',
    relatedTopics: ['Gas giants', 'Galilean moons', 'Planetary protection']
  },
  { 
    name: 'Saturn', 
    color: '#FAD5A5', 
    size: 40, 
    distance: 180, 
    hint: 'Planet with beautiful rings',
    facts: [
      'Saturn has the most spectacular ring system',
      'It\'s less dense than water',
      'Saturn has 83 confirmed moons',
      'Its moon Titan has lakes of liquid methane'
    ],
    funFact: 'Saturn would float in water if you could find a bathtub big enough!',
    relatedTopics: ['Ring systems', 'Moon systems', 'Density and composition']
  },
  { 
    name: 'Uranus', 
    color: '#4FD0E7', 
    size: 30, 
    distance: 210, 
    hint: 'Ice giant tilted sideways',
    facts: [
      'Uranus rotates on its side',
      'It\'s made mostly of water, methane, and ammonia',
      'Uranus has faint rings',
      'It\'s the coldest planetary atmosphere'
    ],
    funFact: 'Uranus spins like a rolling ball instead of a spinning top - probably due to an ancient collision!',
    relatedTopics: ['Axial tilt', 'Ice giants', 'Magnetic fields']
  },
  { 
    name: 'Neptune', 
    color: '#4B70DD', 
    size: 30, 
    distance: 240, 
    hint: 'Windiest planet, deep blue',
    facts: [
      'Neptune has the fastest winds in the solar system',
      'It takes 165 Earth years to orbit the Sun',
      'Neptune was discovered through mathematics',
      'It has 14 known moons'
    ],
    funFact: 'Neptune\'s winds can reach 1,200 mph - faster than the speed of sound on Earth!',
    relatedTopics: ['Mathematical prediction', 'Extreme weather', 'Discovery methods']
  }
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
        {planetData.name === 'Jupiter' && '♃'}
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
  const [showPlanetInfo, setShowPlanetInfo] = useState(false);
  const [selectedPlanetInfo, setSelectedPlanetInfo] = useState<Planet | null>(null);
  const [showAIsuggestions, setShowAIsuggestions] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [showFacts, setShowFacts] = useState(false);

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
      
      // Show planet info and AI suggestions after correct placement
      setSelectedPlanetInfo(planetData);
      setShowPlanetInfo(true);
      setShowAIsuggestions(true);
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

  const handleOrbitingPlanetClick = (planetData: Planet) => {
    // Show detailed info when clicking on orbiting planets
    setSelectedPlanetInfo(planetData);
    setShowPlanetInfo(true);
    setShowFacts(true);
  };

  const addUserInterest = (topic: string) => {
    if (!userInterests.includes(topic)) {
      setUserInterests(prev => [...prev, topic]);
    }
  };

  const getAISuggestions = (planet: Planet) => {
    const suggestions = [];
    
    if (planet.name === 'Mars') {
      suggestions.push('🚀 Would you like to learn about Mars rovers and space exploration?');
      suggestions.push('🏠 Interested in how humans might live on Mars?');
    }
    if (planet.name === 'Jupiter') {
      suggestions.push('🌙 Want to explore Jupiter\'s fascinating moons like Europa?');
      suggestions.push('🌊 Curious about the possibility of oceans under ice?');
    }
    if (planet.name === 'Saturn') {
      suggestions.push('💍 Would you like to learn how Saturn\'s rings formed?');
      suggestions.push('🛰️ Interested in the Cassini mission to Saturn?');
    }
    if (planet.name === 'Earth') {
      suggestions.push('🌍 Want to learn about climate change and Earth\'s atmosphere?');
      suggestions.push('🌙 Curious about how the Moon affects Earth?');
    }
    
    return suggestions;
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
    setShowPlanetInfo(false);
    setSelectedPlanetInfo(null);
    setShowAIsuggestions(false);
    setShowFacts(false);
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
          <Link href="https://eklavyaa.vercel.app/chapters/science-world" className="text-white hover:text-yellow-300 transition-colors text-sm">
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
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
              >
                🚀 Play Again
              </button>
              <button
                onClick={() => {
                  setShowFacts(true);
                  setSelectedPlanetInfo(planetsData[Math.floor(Math.random() * planetsData.length)]);
                  setShowPlanetInfo(true);
                }}
                className="w-full bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-all shadow-lg"
              >
                🧠 Learn More Facts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Planet Information Modal */}
      {showPlanetInfo && selectedPlanetInfo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl ring-1 ring-gray-300">
            <div className="text-center mb-4">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-gray-300"
                style={{ backgroundColor: selectedPlanetInfo.color }}
              >
                <span className="text-white text-2xl">
                  {selectedPlanetInfo.name === 'Earth' && '🌍'}
                  {selectedPlanetInfo.name === 'Mars' && '🔴'}
                  {selectedPlanetInfo.name === 'Jupiter' && '♃'}
                  {selectedPlanetInfo.name === 'Saturn' && '🪐'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedPlanetInfo.name}</h3>
              <p className="text-blue-600 font-medium">{selectedPlanetInfo.hint}</p>
            </div>

            {showFacts && (
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-2">🔬 Amazing Facts:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {selectedPlanetInfo.facts.map((fact: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-orange-800 mb-2">💡 Fun Fact:</h4>
              <p className="text-orange-700 text-sm">{selectedPlanetInfo.funFact}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-bold text-gray-800 mb-2">🔗 Related Topics:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPlanetInfo.relatedTopics.map((topic: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => addUserInterest(topic)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      userInterests.includes(topic)
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {userInterests.length > 0 && (
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">🎯 Your Learning Interests:</h4>
                <div className="text-sm text-green-700 space-y-1">
                  {userInterests.slice(-3).map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowFacts(!showFacts)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                {showFacts ? 'Hide Facts' : 'Show Facts'}
              </button>
              <button
                onClick={() => {
                  setShowPlanetInfo(false);
                  setShowAIsuggestions(false);
                  setShowFacts(false);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
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
            onClick={() => handleOrbitingPlanetClick(planet)}
            isClickable={true}
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
                    {planet.name === 'Jupiter' && '♃'}
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
              <p className="text-yellow-200 text-xs mt-1">
                💡 Click orbiting planets to learn more!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress indicator - Mobile optimized */}
      <div className="absolute top-24 left-2 z-10">
        <div className="bg-gray-900 bg-opacity-95 rounded-lg p-2 border border-gray-600 shadow-xl">
          <div className="text-white text-xs font-bold mb-1 flex items-center gap-1">
            📊 Progress
          </div>
          <div className="flex gap-1 mb-1">
            {planetsData.map((planet, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
