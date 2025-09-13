'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Mission {
  id: number;
  description: string;
  targetDepth: number;
  reward: string;
  completed: boolean;
}

interface Treasure {
  depth: number;
  name: string;
  discovered: boolean;
}

export default function DeepSeaDiver() {
  const [currentDepth, setCurrentDepth] = useState(0);
  const [score, setScore] = useState(0);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [oxygenLevel, setOxygenLevel] = useState(100);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [gameLevel, setGameLevel] = useState(1);
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState(false);
  const [levelStats, setLevelStats] = useState({ treasuresFound: 0, totalScore: 0 });

  // Generate missions for the current level
  const generateMissions = useCallback((level: number): Mission[] => {
    const missionSets = [
      // Level 1: Basic negative numbers
      [
        { id: 1, description: "Descend to -10 meters to collect coral samples", targetDepth: -10, reward: "Coral Collection (+50 points)" },
        { id: 2, description: "Dive to -25 meters to photograph colorful fish", targetDepth: -25, reward: "Fish Photo (+75 points)" },
        { id: 3, description: "Return to surface (0 meters) to deliver samples", targetDepth: 0, reward: "Safe Return (+100 points)" },
      ],
      // Level 2: Deeper exploration
      [
        { id: 4, description: "Explore the kelp forest at -40 meters", targetDepth: -40, reward: "Kelp Discovery (+100 points)" },
        { id: 5, description: "Investigate the rocky ledge at -60 meters", targetDepth: -60, reward: "Rock Sample (+125 points)" },
        { id: 6, description: "Ascend to -30 meters to avoid strong currents", targetDepth: -30, reward: "Safe Navigation (+150 points)" },
      ],
      // Level 3: Deep sea exploration
      [
        { id: 7, description: "Descend to the sunken ship at -85 meters", targetDepth: -85, reward: "Shipwreck Discovery (+200 points)" },
        { id: 8, description: "Rise to -50 meters to photograph giant squid", targetDepth: -50, reward: "Squid Photo (+175 points)" },
        { id: 9, description: "Return to -20 meters for decompression stop", targetDepth: -20, reward: "Safe Decompression (+225 points)" },
      ]
    ];

    return missionSets[level - 1]?.map(mission => ({ ...mission, completed: false })) || [];
  }, []);

  // Generate treasures at various depths
  const generateTreasures = useCallback((): Treasure[] => {
    return [
      { depth: -15, name: "Pearl Oyster", discovered: false },
      { depth: -35, name: "Golden Coin", discovered: false },
      { depth: -55, name: "Ancient Vase", discovered: false },
      { depth: -75, name: "Pirate Chest", discovered: false },
      { depth: -95, name: "Lost Crown", discovered: false },
    ];
  }, []);

  // Initialize game
  useEffect(() => {
    if (gameStarted) {
      setMissions(generateMissions(gameLevel));
      setTreasures(generateTreasures());
      setCurrentMissionIndex(0);
      setCurrentDepth(0);
      setOxygenLevel(100);
      setFeedback('Welcome to the Deep Sea! Your submarine is at sea level (0 meters).');
    }
  }, [gameStarted, gameLevel, generateMissions, generateTreasures]);

  // Oxygen management
  useEffect(() => {
    if (!gameStarted) return;

    const oxygenTimer = setInterval(() => {
      setOxygenLevel(prev => {
        const newLevel = Math.max(0, prev - (Math.abs(currentDepth) > 50 ? 2 : 1));
        if (newLevel === 0) {
          setFeedback('⚠️ Oxygen depleted! Returning to surface for safety.');
          setCurrentDepth(0);
          return 100;
        }
        return newLevel;
      });
    }, 1000);

    return () => clearInterval(oxygenTimer);
  }, [gameStarted, currentDepth]);

  // Check for mission completion and treasure discovery
  useEffect(() => {
    if (!gameStarted || missions.length === 0) return;

    const currentMission = missions[currentMissionIndex];
    if (currentMission && !currentMission.completed && currentDepth === currentMission.targetDepth) {
      const updatedMissions = [...missions];
      updatedMissions[currentMissionIndex].completed = true;
      setMissions(updatedMissions);
      
      const points = parseInt(currentMission.reward.match(/\d+/)?.[0] || '0');
      setScore(prev => prev + points);
      setFeedback(`🎉 Mission completed! ${currentMission.reward}`);
      
      if (currentMissionIndex < missions.length - 1) {
        setTimeout(() => setCurrentMissionIndex(prev => prev + 1), 2000);
      } else {
        setTimeout(() => {
          // Calculate level stats
          const treasuresFoundCount = treasures.filter(t => t.discovered).length;
          setLevelStats({
            treasuresFound: treasuresFoundCount,
            totalScore: score + points
          });
          setShowLevelCompleteModal(true);
        }, 2000);
      }
    }

    // Check for treasure discovery
    const treasureAtDepth = treasures.find(t => t.depth === currentDepth && !t.discovered);
    if (treasureAtDepth) {
      const updatedTreasures = treasures.map(t => 
        t.depth === currentDepth ? { ...t, discovered: true } : t
      );
      setTreasures(updatedTreasures);
      setScore(prev => prev + 50);
      setFeedback(`💎 Treasure found! You discovered a ${treasureAtDepth.name} (+50 points)`);
    }
  }, [currentDepth, missions, currentMissionIndex, treasures, gameStarted, score]);

  const moveSubmarine = (direction: 'up' | 'down', distance: number = 5) => {
    if (!gameStarted) return;

    setCurrentDepth(prev => {
      const newDepth = direction === 'down' ? prev - distance : prev + distance;
      const clampedDepth = Math.max(-100, Math.min(10, newDepth));
      
      if (clampedDepth > 0) {
        setFeedback('🌊 You cannot go above sea level! Stay between 0 and -100 meters.');
        return 0;
      }
      
      if (clampedDepth < -100) {
        setFeedback('🔒 Maximum diving depth reached! Cannot go below -100 meters.');
        return -100;
      }
      
      return clampedDepth;
    });
  };

  const jumpToDepth = (depth: number) => {
    if (!gameStarted) return;
    if (depth > 0 || depth < -100) return;
    setCurrentDepth(depth);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentDepth(0);
    setScore(0);
    setMissions([]);
    setCurrentMissionIndex(0);
    setFeedback('');
    setOxygenLevel(100);
    setTreasures([]);
    setGameLevel(1);
    setShowLevelCompleteModal(false);
  };

  const startNextLevel = () => {
    setShowLevelCompleteModal(false);
    setGameLevel(prev => prev + 1);
    setCurrentMissionIndex(0);
    setCurrentDepth(0);
    setOxygenLevel(100);
    setFeedback(`Welcome to Level ${gameLevel + 1}! New challenges await below the surface.`);
  };

  const getDepthColor = (depth: number) => {
    if (depth >= 0) return 'bg-blue-100 text-blue-900';
    if (depth >= -20) return 'bg-blue-200 text-blue-900';
    if (depth >= -40) return 'bg-blue-400 text-white';
    if (depth >= -60) return 'bg-blue-600 text-white';
    if (depth >= -80) return 'bg-blue-800 text-white';
    return 'bg-gray-900 text-white';
  };

  const renderNumberLine = () => {
    const numbers = [];
    for (let i = 10; i >= -100; i -= 10) {
      const isCurrentDepth = i === currentDepth;
      const hasMission = missions.some(m => m.targetDepth === i && !m.completed);
      const hasTreasure = treasures.some(t => t.depth === i && !t.discovered);
      
      numbers.push(
        <div
          key={i}
          className={`relative p-2 m-1 rounded border cursor-pointer transition-all duration-300 ${
            isCurrentDepth 
              ? 'bg-yellow-400 text-black font-bold border-yellow-600 scale-110' 
              : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
          }`}
          onClick={() => jumpToDepth(i)}
        >
          <div className="text-center font-mono">{i}</div>
          {hasMission && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
          {hasTreasure && (
            <div className="absolute -bottom-1 -left-1 text-yellow-500">💎</div>
          )}
          {isCurrentDepth && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl">🚢</div>
          )}
        </div>
      );
    }
    return numbers;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-4xl flex justify-center items-center gap-4 font-bold text-center mb-6 text-blue-900">
            <span>Deep Sea Diver</span>  
            <span>< img src={'/icons8-ship.gif'} /></span>
          </h1>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Chapter 10: The Other Side of Zero (Integers)
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Explore the ocean depths with your submarine! Navigate using positive and negative numbers on the number line. 
              Complete missions, discover treasures, and learn about integers as you dive below sea level.
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-gray-800">How to Play:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li> Sea level = 0 meters (neutral point)</li>
              <li>⬇️ Negative numbers = Below sea level (deeper)</li>
              <li>⬆️ Positive numbers = Above sea level (not allowed!)</li>
              <li>🎯 Complete missions by reaching target depths</li>
              <li>💎 Discover treasures hidden at various depths</li>
              <li>🫁 Watch your oxygen - deeper dives use more oxygen!</li>
            </ul>
          </div>

          <button
            onClick={() => setGameStarted(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-xl"
          >
            🚢 Start Diving Adventure!
          </button>
          
          <div className="mt-6 text-center">
            <Link 
              href="https://eklavyaa.vercel.app/chapters/maths-world"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Maths World
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentMission = missions[currentMissionIndex];

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getDepthColor(currentDepth)} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-blue-900">🌊 Deep Sea Diver</h1>
            <Link 
              href="https://eklavyaa.vercel.app/chapters/maths-world"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              ← Back to Maths World
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-3 rounded">
              <div className="text-sm text-blue-600">Current Depth</div>
              <div className="text-2xl font-bold text-blue-900">{currentDepth}m</div>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <div className="text-sm text-green-600">Score</div>
              <div className="text-2xl font-bold text-green-900">{score}</div>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <div className="text-sm text-red-600">Oxygen Level</div>
              <div className="text-2xl font-bold text-red-900">{oxygenLevel}%</div>
            </div>
            <div className="bg-purple-100 p-3 rounded">
              <div className="text-sm text-purple-600">Level</div>
              <div className="text-2xl font-bold text-purple-900">{gameLevel}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls and Mission */}
          <div className="space-y-6">
            {/* Current Mission */}
            {currentMission && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Current Mission</h2>
                <div className={`p-4 rounded ${currentMission.completed ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <p className="text-gray-800 mb-2">{currentMission.description}</p>
                  <p className="text-sm text-gray-600">Target: {currentMission.targetDepth} meters</p>
                  <p className="text-sm font-semibold">{currentMission.reward}</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎮 Controls</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => moveSubmarine('up', 5)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded font-semibold"
                >
                  ⬆️ Surface (+5m)
                </button>
                <button
                  onClick={() => moveSubmarine('down', 5)}
                  className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded font-semibold"
                >
                  ⬇️ Dive (-5m)
                </button>
                <button
                  onClick={() => moveSubmarine('up', 10)}
                  className="bg-blue-400 hover:bg-blue-500 text-white py-3 px-4 rounded font-semibold"
                >
                  ⬆️⬆️ Fast Up (+10m)
                </button>
                <button
                  onClick={() => moveSubmarine('down', 10)}
                  className="bg-blue-800 hover:bg-blue-900 text-white py-3 px-4 rounded font-semibold"
                >
                  ⬇️⬇️ Fast Dive (-10m)
                </button>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => setCurrentDepth(0)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-semibold"
                >
                  🆘 Emergency Surface
                </button>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📢 Status</h2>
                <p className="text-gray-700">{feedback}</p>
              </div>
            )}
          </div>

          {/* Center Panel - Number Line */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📏 Depth Number Line</h2>
            <div className="max-h-96 overflow-y-auto">
              <div className="flex flex-col items-center space-y-1">
                {renderNumberLine()}
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>🚢 = Your submarine</p>
              <p>🔴 = Mission target</p>
              <p>💎 = Hidden treasure</p>
              <p>Click on any depth to jump there!</p>
            </div>
          </div>

          {/* Right Panel - Progress */}
          <div className="space-y-6">
            {/* Mission Progress */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Mission Progress</h2>
              <div className="space-y-2">
                {missions.map((mission, index) => (
                  <div
                    key={mission.id}
                    className={`p-3 rounded text-sm ${
                      mission.completed 
                        ? 'bg-green-100 text-green-800' 
                        : index === currentMissionIndex
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{mission.completed ? '✅' : index === currentMissionIndex ? '🎯' : '⏳'}</span>
                      <span className="font-mono">{mission.targetDepth}m</span>
                    </div>
                    <p className="mt-1">{mission.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Treasure Collection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">💎 Treasure Collection</h2>
              <div className="space-y-2">
                {treasures.map((treasure) => (
                  <div
                    key={treasure.depth}
                    className={`p-2 rounded text-sm flex justify-between items-center ${
                      treasure.discovered ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span>{treasure.discovered ? '💎' : '🔒'} {treasure.name}</span>
                    <span className="font-mono">{treasure.depth}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetGame}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded font-semibold"
            >
              🔄 Reset Game
            </button>
          </div>
        </div>
      </div>

      {/* Level Complete Modal */}
      {showLevelCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-pulse">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Level {gameLevel} Complete!
              </h2>
              <div className="text-gray-700 mb-6">
                <p className="text-xl mb-4">🎉 Congratulations, Deep Sea Explorer! 🎉</p>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Final Score:</span>
                    <span className="font-bold text-blue-900">{levelStats.totalScore} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Treasures Found:</span>
                    <span className="font-bold text-yellow-600">{levelStats.treasuresFound}/5 💎</span>
                  </div>
                  <div className="flex justify-between">
                    <span>All Missions:</span>
                    <span className="font-bold text-green-600">✅ Completed</span>
                  </div>
                </div>
              </div>
              
              {gameLevel < 3 ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Ready for deeper waters and greater challenges?
                  </p>
                  <button
                    onClick={startNextLevel}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-xl"
                  >
                    🌊 Dive to Level {gameLevel + 1}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    🎊 Amazing! You&apos;ve mastered all the depths and become a true Deep Sea Explorer!
                  </p>
                  <button
                    onClick={resetGame}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-xl"
                  >
                    🏅 Play Again
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setShowLevelCompleteModal(false)}
                className="mt-4 text-gray-500 hover:text-gray-700 underline"
              >
                Continue Current Level
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
