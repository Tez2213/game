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
  showVideoModal: boolean;
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
    showVideoModal: false,
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
        popupMessage: ` You Defended Successfully!\nCorrect! ${correctFactors.join(' × ')} = ${gameState.currentEnemy?.number}\nMoving to Wave ${gameState.wave + 1}`,
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
      showVideoModal: false,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12 gap-6">
          <div className="flex items-center justify-between w-full">
            <Link
              href="https://eklavyaa.vercel.app/chapters/maths-world"
              className="flex items-center space-x-2 sm:space-x-3 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 text-sm sm:text-base text-white hover:bg-white/20"
            >
              <span>←</span>
              <span className="hidden sm:inline">Back to Maths World</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex-1"></div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-white/20">
            <h1 className="text-4xl sm:text-6xl font-bold text-white"> Prime Guardians</h1>
          </div>
        </div>

        {/* How to Play Button */}
        <div className="text-center mb-10 sm:mb-16">
          <button
            onClick={() => setGameState(prev => ({ ...prev, showVideoModal: true }))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transform hover:scale-105 active:scale-95 transition-all touch-manipulation border border-white/20"
          >
             See How to Play
          </button>
        </div>

        {/* Game Stats During Battle */}
        {gameState.currentEnemy && (
          <div className="flex items-center justify-center space-x-8 sm:space-x-12 text-white mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">Wave {gameState.wave}</div>
              <div className="text-sm sm:text-base opacity-75 mt-1">Current</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-400">❤️ {gameState.lives}</div>
              <div className="text-sm sm:text-base opacity-75 mt-1">Lives</div>
            </div>
          </div>
        )}

        {/* Timer Display */}
        {gameState.currentEnemy && (
          <div className="text-center mb-10 sm:mb-12">
            <div className={`text-4xl sm:text-6xl font-bold ${getTimerColor()} flex items-center justify-center gap-3 sm:gap-4`}>
              <svg className="w-10 h-10 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                <path d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
              </svg>
              {gameState.timeLeft}
            </div>
            <div className="text-white opacity-75 text-base sm:text-lg mt-2">seconds remaining</div>
          </div>
        )}

        {/* Game Arena */}
        <div className="relative bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-3xl p-2 mb-10 sm:mb-16">
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center min-h-[280px] sm:min-h-[350px]">
            
            {/* Enemy Zone */}
            <div className="w-full sm:flex-1 bg-red-500/20 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-0 sm:mr-6 border-2 border-red-500">
              <h3 className="text-red-400 font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-center"> ENEMY ZONE</h3>
              <div className="flex items-center justify-center h-20 sm:h-32">
                {gameState.currentEnemy ? (
                  <div className="text-center">
                    <div className="text-3xl sm:text-6xl font-bold text-red-400 mb-1 sm:mb-2">
                      {gameState.currentEnemy.number}
                    </div>
                    <div className="text-red-300 text-xs sm:text-base">Composite Number</div>
                  </div>
                ) : (
                  <div className="text-red-300 text-sm sm:text-xl opacity-50 text-center px-2">
                    Enemy will appear here
                  </div>
                )}
              </div>
            </div>

            {/* VS Separator */}
            <div className="flex flex-row sm:flex-col items-center px-4 sm:px-6 my-4 sm:my-0">
              <div className="h-2 w-12 sm:w-2 sm:h-20 bg-yellow-400 mr-3 sm:mr-0 sm:mb-3 rounded-full"></div>
              <div className="text-3xl sm:text-5xl font-bold text-yellow-400 animate-pulse">VS</div>
              <div className="h-2 w-12 sm:w-2 sm:h-20 bg-yellow-400 ml-3 sm:ml-0 sm:mt-3 rounded-full"></div>
            </div>

            {/* Defense Zone */}
            <div className="w-full sm:flex-1 bg-green-500/20 rounded-2xl p-6 sm:p-8 sm:ml-6 border-2 border-green-500">
              <h3 className="text-green-400 font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-center"> DEFENSE ZONE</h3>
              <div className="flex items-center justify-center h-20 sm:h-32">
                {gameState.placedFactors.length > 0 ? (
                  <div className="text-center w-full">
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mb-1 sm:mb-2">
                      {gameState.placedFactors.map((factor, index) => (
                        <button
                          key={index}
                          onClick={() => removeFactor(index)}
                          className="bg-green-600 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg font-bold transition-colors text-sm sm:text-base min-w-[32px] sm:min-w-[40px]"
                          title="Tap to remove"
                        >
                          {factor}
                        </button>
                      ))}
                    </div>
                    <div className="text-green-300 text-xs sm:text-sm">
                      {gameState.placedFactors.join(' × ')} = {gameState.placedFactors.reduce((a, b) => a * b, 1)}
                    </div>
                  </div>
                ) : (
                  <div className="text-green-300 text-sm sm:text-xl opacity-50 text-center px-2">
                    Place prime factors here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Prime Number Buttons */}
        {gameState.currentEnemy && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12">
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-6 sm:mb-8 text-center">🔢 Prime Numbers</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
              {PRIME_NUMBERS.slice(0, 15).map((prime) => (
                <button
                  key={prime}
                  onClick={() => placeFactor(prime)}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 sm:px-5 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl transition-colors touch-manipulation min-h-[50px] sm:min-h-[60px]"
                >
                  {prime}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Defend Button */}
        {gameState.currentEnemy && gameState.placedFactors.length > 0 && (
          <div className="text-center mb-8 sm:mb-12">
            <button
              onClick={defendAttack}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-12 sm:px-20 py-5 sm:py-6 rounded-2xl font-bold text-xl sm:text-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all touch-manipulation"
            >
               DEFEND!
            </button>
          </div>
        )}

        {/* Game Stats */}
        {!gameState.currentEnemy && !gameState.gameOver && !gameState.showPopup && (
          <div className="flex items-center justify-center space-x-8 sm:space-x-12 text-white mb-8 sm:mb-12">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">Wave {gameState.wave}</div>
              <div className="text-base sm:text-lg opacity-75 mt-1">Current</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-red-400">❤️ {gameState.lives}</div>
              <div className="text-base sm:text-lg opacity-75 mt-1">Lives</div>
            </div>
          </div>
        )}

        {/* Start Wave Button */}
        {!gameState.currentEnemy && !gameState.gameOver && !gameState.showPopup && (
          <div className="text-center mb-8 sm:mb-12">
            <button
              onClick={spawnWave}
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 sm:px-16 py-5 sm:py-6 rounded-2xl font-bold text-xl sm:text-2xl transform hover:scale-105 active:scale-95 transition-all touch-manipulation border border-white/20"
            >
              ⚔️ Start Wave {gameState.wave}
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState.gameOver && (
          <div className="text-center">
            <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 sm:p-8 mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-4xl font-bold text-red-400 mb-3 sm:mb-4">💀 Game Over!</h2>
              <p className="text-white text-lg sm:text-xl mb-4 sm:mb-6">
                You reached Wave {gameState.wave} before running out of lives.
              </p>
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl touch-manipulation"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}

        {/* Popup Modal */}
        {gameState.showPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-sm mx-auto rounded-xl p-4 sm:p-8 text-center ${
              gameState.popupType === 'victory' 
                ? 'bg-green-500/20 border-2 border-green-500' 
                : 'bg-red-500/20 border-2 border-red-500'
            }`}>
              <div className="text-white mb-4 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                {gameState.popupMessage}
              </div>
              <button
                onClick={closePopup}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-white text-sm sm:text-base touch-manipulation min-h-[44px] ${
                  gameState.popupType === 'victory'
                    ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                }`}
              >
                {gameState.gameOver ? ' Play Again' : ' Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Video Tutorial Modal */}
        {gameState.showVideoModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm sm:max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-sm sm:text-lg"> How to Play</h3>
                <button
                  onClick={() => setGameState(prev => ({ ...prev, showVideoModal: false }))}
                  className="text-white hover:text-red-300 transition-colors text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="bg-black">
                <div className="aspect-[9/16] max-h-[70vh]">
                  <video 
                    controls 
                    className="w-full h-full object-contain"
                  >
                    <source src="/primeguardian_tutorial.mp4" type="video/mp4" />
                    <p className="text-white text-center p-8">
                      Your browser does not support video playback. 
                      <br />
                      Please try a different browser.
                    </p>
                  </video>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, showVideoModal: false }))}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                  Got it! Lets Play 
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
