'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Enemy {
  number: number;
  primeFactors: number[];
}

interface GameState {
  wave: number;
  lives: number;
  currentEnemy: Enemy | null;
  placedFactors: number[];
  timeLeft: number;
  gameOver: boolean;
  showPopup: boolean;
  popupMessage: string;
  popupType: 'victory' | 'defeat';
}

const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

export default function PrimeGuardians() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [gameState, setGameState] = useState<GameState>({
    wave: 1,
    lives: 3,
    currentEnemy: null,
    placedFactors: [],
    timeLeft: 15,
    gameOver: false,
    showPopup: false,
    popupMessage: '',
    popupType: 'victory',
  });

  const isPrime = (num: number): boolean => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const getPrimeFactors = (num: number): number[] => {
    const factors: number[] = [];
    let n = num;
    
    for (let i = 2; i <= n; i++) {
      while (n % i === 0) {
        factors.push(i);
        n = n / i;
      }
    }
    
    return factors;
  };

  const generateCompositeNumber = (wave: number): number => {
    const minNumber = Math.max(4, wave * 2);
    const maxNumber = minNumber + (wave * 3);
    
    let number;
    do {
      number = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    } while (isPrime(number));
    
    return number;
  };

  const spawnWave = () => {
    const compositeNumber = generateCompositeNumber(gameState.wave);
    const primeFactors = getPrimeFactors(compositeNumber);
    
    setGameState(prev => ({
      ...prev,
      currentEnemy: {
        number: compositeNumber,
        primeFactors: primeFactors
      },
      placedFactors: [],
      timeLeft: 15,
    }));

    // Start 15 second timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up - enemy wins
          return {
            ...prev,
            timeLeft: 0,
            lives: prev.lives - 1,
            wave: 1, // Reset to wave 1
            currentEnemy: null,
            showPopup: true,
            popupMessage: `⏰ Time's Up! Enemy Won!\nCorrect factors: ${prev.currentEnemy?.primeFactors.join(' × ')}\nRestarting from Wave 1`,
            popupType: 'defeat',
            gameOver: prev.lives <= 1
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        };
      });
    }, 1000);
  };

  const placeFactor = (prime: number) => {
    if (!gameState.currentEnemy) return;
    
    setGameState(prev => ({
      ...prev,
      placedFactors: [...prev.placedFactors, prime]
    }));
  };

  const removeFactor = (index: number) => {
    setGameState(prev => ({
      ...prev,
      placedFactors: prev.placedFactors.filter((_, i) => i !== index)
    }));
  };

  const defendAttack = () => {
    if (!gameState.currentEnemy || gameState.placedFactors.length === 0) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const correctFactors = [...gameState.currentEnemy.primeFactors].sort((a, b) => a - b);
    const playerFactors = [...gameState.placedFactors].sort((a, b) => a - b);
    
    const isCorrect = correctFactors.length === playerFactors.length && 
                     correctFactors.every((factor, index) => factor === playerFactors[index]);

    if (isCorrect) {
      // Victory!
      setGameState(prev => ({
        ...prev,
        wave: prev.wave + 1,
        currentEnemy: null,
        placedFactors: [],
        showPopup: true,
        popupMessage: `🎉 You Defended Successfully!\nCorrect! ${correctFactors.join(' × ')} = ${gameState.currentEnemy?.number}\nMoving to Wave ${gameState.wave + 1}`,
        popupType: 'victory'
      }));
    } else {
      // Defeat!
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        wave: 1, // Reset to wave 1
        currentEnemy: null,
        placedFactors: [],
        showPopup: true,
        popupMessage: `💥 Enemy Won!\nIncorrect! Correct factors: ${correctFactors.join(' × ')}\nYou placed: ${playerFactors.join(' × ')}\nRestarting from Wave 1`,
        popupType: 'defeat',
        gameOver: prev.lives <= 1
      }));
    }
  };

  const closePopup = () => {
    setGameState(prev => ({
      ...prev,
      showPopup: false
    }));
    
    if (!gameState.gameOver) {
      // Start next wave after popup
      setTimeout(spawnWave, 500);
    }
  };

  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setGameState({
      wave: 1,
      lives: 3,
      currentEnemy: null,
      placedFactors: [],
      timeLeft: 15,
      gameOver: false,
      showPopup: false,
      popupMessage: '',
      popupType: 'victory',
    });
  };

  const getTimerColor = () => {
    if (gameState.timeLeft > 10) return 'text-green-500';
    if (gameState.timeLeft > 5) return 'text-yellow-500';
    return 'text-red-500 animate-pulse';
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/chapters/maths-world"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <span>←</span>
              <span>Back to Maths World</span>
            </Link>
            <h1 className="text-4xl font-bold text-white">🛡️ Prime Guardians</h1>
          </div>
          
          {/* Game Stats */}
          <div className="flex items-center space-x-6 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">Wave {gameState.wave}</div>
              <div className="text-sm opacity-75">Current</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">❤️ {gameState.lives}</div>
              <div className="text-sm opacity-75">Lives</div>
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">🎯 How to Play:</h2>
          <p className="opacity-90">
            1. An enemy composite number appears in the red zone
            2. Click prime number buttons to place factors in the green defense zone
            3. Click &quot;DEFEND!&quot; when you&apos;re ready to check your answer
            4. Get it right to advance to the next wave, wrong answers restart from Wave 1!
          </p>
        </div>

        {/* Timer Display */}
        {gameState.currentEnemy && (
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold ${getTimerColor()}`}>
              ⏱️ {gameState.timeLeft}
            </div>
            <div className="text-white opacity-75">seconds remaining</div>
          </div>
        )}

        {/* Game Arena */}
        <div className="relative bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-2xl p-1 mb-6">
          <div className="bg-gray-900 rounded-2xl p-6 flex items-center justify-center min-h-[300px]">
            
            {/* Enemy Zone (Left) */}
            <div className="flex-1 bg-red-500/20 rounded-xl p-6 mr-4 border-2 border-red-500">
              <h3 className="text-red-400 font-bold text-xl mb-4 text-center">🔥 ENEMY ZONE</h3>
              <div className="flex items-center justify-center h-32">
                {gameState.currentEnemy ? (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-red-400 mb-2">
                      {gameState.currentEnemy.number}
                    </div>
                    <div className="text-red-300">Composite Number</div>
                  </div>
                ) : (
                  <div className="text-red-300 text-xl opacity-50">
                    Enemy will appear here
                  </div>
                )}
              </div>
            </div>

            {/* VS Separator */}
            <div className="flex flex-col items-center px-4">
              <div className="w-1 h-16 bg-yellow-400 mb-2"></div>
              <div className="text-4xl font-bold text-yellow-400 animate-pulse">VS</div>
              <div className="w-1 h-16 bg-yellow-400 mt-2"></div>
            </div>

            {/* Defense Zone (Right) */}
            <div className="flex-1 bg-green-500/20 rounded-xl p-6 ml-4 border-2 border-green-500">
              <h3 className="text-green-400 font-bold text-xl mb-4 text-center">🛡️ DEFENSE ZONE</h3>
              <div className="flex items-center justify-center h-32">
                {gameState.placedFactors.length > 0 ? (
                  <div className="text-center">
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                      {gameState.placedFactors.map((factor, index) => (
                        <button
                          key={index}
                          onClick={() => removeFactor(index)}
                          className="bg-green-600 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-bold transition-colors"
                          title="Click to remove"
                        >
                          {factor}
                        </button>
                      ))}
                    </div>
                    <div className="text-green-300 text-sm">
                      {gameState.placedFactors.join(' × ')} = {gameState.placedFactors.reduce((a, b) => a * b, 1)}
                    </div>
                  </div>
                ) : (
                  <div className="text-green-300 text-xl opacity-50">
                    Place prime factors here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Prime Number Buttons */}
        {gameState.currentEnemy && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-white font-bold text-xl mb-4 text-center">🔢 Prime Numbers</h3>
            <div className="grid grid-cols-5 gap-3">
              {PRIME_NUMBERS.slice(0, 15).map((prime) => (
                <button
                  key={prime}
                  onClick={() => placeFactor(prime)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold text-lg transition-colors"
                >
                  {prime}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Defend Button */}
        {gameState.currentEnemy && gameState.placedFactors.length > 0 && (
          <div className="text-center mb-6">
            <button
              onClick={defendAttack}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-xl font-bold text-2xl shadow-lg transform hover:scale-105 transition-all"
            >
              🛡️ DEFEND!
            </button>
          </div>
        )}

        {/* Start Wave Button */}
        {!gameState.currentEnemy && !gameState.gameOver && !gameState.showPopup && (
          <div className="text-center mb-6">
            <button
              onClick={spawnWave}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              ⚔️ Start Wave {gameState.wave}
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState.gameOver && (
          <div className="text-center">
            <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-8 mb-6">
              <h2 className="text-4xl font-bold text-red-400 mb-4">💀 Game Over!</h2>
              <p className="text-white text-xl mb-6">
                You reached Wave {gameState.wave} before running out of lives.
              </p>
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-xl"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}

        {/* Popup Modal */}
        {gameState.showPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`max-w-md mx-4 rounded-xl p-8 text-center ${
              gameState.popupType === 'victory' 
                ? 'bg-green-500/20 border-2 border-green-500' 
                : 'bg-red-500/20 border-2 border-red-500'
            }`}>
              <div className="text-white mb-4 whitespace-pre-line">
                {gameState.popupMessage}
              </div>
              <button
                onClick={closePopup}
                className={`px-6 py-3 rounded-lg font-bold text-white ${
                  gameState.popupType === 'victory'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {gameState.gameOver ? '🔄 Play Again' : '➡️ Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
