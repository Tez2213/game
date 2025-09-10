'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Import translation files
import primeEn from '../../../../locales/prime-en.json';
import primeHi from '../../../../locales/prime-hi.json';
import primeOr from '../../../../locales/prime-or.json';

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

// Translation system
const translations = {
  en: primeEn,
  hi: primeHi,
  or: primeOr,
};

type Language = keyof typeof translations;

export default function PrimeGuardians() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Language state
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  // Translation getter function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  // Helper function for dynamic messages with variables
  const tm = (key: string, variables: Record<string, string | number> = {}): string => {
    let message = t(key);
    Object.entries(variables).forEach(([varKey, varValue]) => {
      message = message.replace(`{${varKey}}`, String(varValue));
    });
    return message;
  };
  
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
            popupMessage: `${t('messages.timeUp')}\n${t('messages.correctFactors')} ${prev.currentEnemy?.primeFactors.join(' × ')}\n${t('messages.restartingWave')}`,
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
        popupMessage: `${t('messages.defendedSuccessfully')}\n${t('messages.correct')} ${correctFactors.join(' × ')} = ${gameState.currentEnemy?.number}\n${t('messages.movingToWave')} ${gameState.wave + 1}`,
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
        popupMessage: `${t('messages.enemyWon')}\n${t('messages.incorrect')} ${correctFactors.join(' × ')}\n${t('messages.youPlaced')} ${playerFactors.join(' × ')}\n${t('messages.restartingWave')}`,
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
      timerRef.current = null;
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

  const getTimerColorLight = () => {
    if (gameState.timeLeft > 10) return 'text-green-600';
    if (gameState.timeLeft > 5) return 'text-orange-500';
    return 'text-red-500';
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-purple-500/20">
          <div className="flex items-center justify-between p-4">
            <Link
              href="https://eklavyaa.vercel.app/chapters/maths-world"
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 backdrop-blur-sm transition-all duration-300 text-2xl text-white hover:text-purple-200 hover:scale-110 border border-purple-500/30"
              title={t('header.backButton')}
            >
              ←
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                {t('header.title')}
              </h1>
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as Language)}
                className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-purple-400/50 hover:bg-black/40 transition-all duration-300"
              >
                <option value="en" className="bg-gray-900 text-white">English</option>
                <option value="hi" className="bg-gray-900 text-white">हिंदी</option>
                <option value="or" className="bg-gray-900 text-white">ଓଡ଼ିଆ</option>
              </select>
            </div>
          </div>  
        </div>

        {/* Game Content */}
        <div className="p-4 sm:p-6">
          
          {/* Welcome Message - Only show when no enemy and not game over */}
          {!gameState.currentEnemy && !gameState.gameOver && !gameState.showPopup && (
            <div className="text-center mb-8">
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 shadow-purple-500/20">
                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 tracking-wider">
                  {t('welcome.title')}
                </h2>
                <p className="text-purple-100 text-xl mb-3 leading-relaxed font-medium">
                  {t('welcome.description1')}
                </p>
                <p className="text-purple-200 text-xl mb-8 leading-relaxed font-medium">
                  {t('welcome.description2')}
                </p>
              </div>

              {/* Preview Battle Area */}
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 shadow-purple-500/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
                  
                  {/* Enemy Zone Preview */}
                  <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-500/40 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300">
                    <h3 className="text-red-300 font-black text-xl mb-6 text-center tracking-wider">
                      {t('battleArena.enemyZone')}
                    </h3>
                    <div className="flex items-center justify-center h-28">
                      <div className="text-red-400/60 text-center text-base bg-black/30 rounded-xl p-4 border border-red-500/30 font-bold tracking-wide">
                        {t('battleArena.enemyWillAppear')}
                      </div>
                    </div>
                  </div>

                  {/* VS Separator */}
                  <div className="flex items-center justify-center">
                    <div className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse tracking-widest">
                      {t('battleArena.vs')}
                    </div>
                  </div>

                  {/* Defense Zone Preview */}
                  <div className="bg-gradient-to-br from-green-900/50 to-emerald-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/40 shadow-xl shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300">
                    <h3 className="text-green-300 font-black text-xl mb-6 text-center tracking-wider">
                      {t('battleArena.defenseZone')}
                    </h3>
                    <div className="flex items-center justify-center h-28">
                      <div className="text-green-400/60 text-center text-base bg-black/30 rounded-xl p-4 border border-green-500/30 font-bold tracking-wide">
                        {t('battleArena.placePrimeFactors')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Below Battle Area */}
              <div className="flex gap-6 w-full">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, showVideoModal: true }))}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-8 py-5 rounded-2xl font-black text-xl transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 flex-1 border border-purple-400/30 hover:border-purple-300/50 hover:scale-105 active:scale-95 tracking-wide"
                >
                  {t('welcome.howToPlay')}
                </button>
                <button
                  onClick={spawnWave}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex-1 border border-blue-400/30 hover:border-blue-300/50 hover:scale-105 active:scale-95 tracking-wide"
                >
                  {t('welcome.startWave')} {gameState.wave}
                </button>
              </div>
            </div>
          )}

          {/* Game Stats During Battle */}
          {gameState.currentEnemy && (
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 shadow-purple-500/20">
              <div className="flex items-center justify-center space-x-12 text-white">
                <div className="text-center bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-blue-500/20 border border-blue-500/30">
                  <div className="text-3xl font-black text-blue-300 mb-2 tracking-wider">
                    {t('gameStats.wave')} {gameState.wave}
                  </div>
                  <div className="text-sm text-blue-400 font-bold uppercase tracking-widest">{t('gameStats.currentMission')}</div>
                </div>
                <div className="text-center bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-red-500/20 border border-red-500/30">
                  <div className="text-3xl font-black text-red-300 mb-2 flex items-center justify-center gap-2">
                    {Array.from({ length: gameState.lives }, (_, i) => (
                      <div key={i} className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg animate-pulse"></div>
                    ))}
                  </div>
                  <div className="text-sm text-red-400 font-bold uppercase tracking-widest">{t('gameStats.livesRemaining')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Timer Display */}
          {gameState.currentEnemy && (
            <div className="text-center mb-8">
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 shadow-purple-500/20">
                <div className={`text-7xl font-black ${getTimerColorLight()} flex items-center justify-center gap-6 mb-4`}>
                  <div className="relative">
                    <svg className="w-16 h-16 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                      <path d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                    </svg>
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-pulse"></div>
                  </div>
                  <span className="tabular-nums tracking-wider">{gameState.timeLeft}</span>
                </div>
                <div className="text-purple-200 text-2xl font-bold mb-6 tracking-wider">{t('timer.secondsRemaining')}</div>
                <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden border border-purple-500/30">
                  <div 
                    className={`h-full transition-all duration-1000 ease-linear shadow-lg ${
                      gameState.timeLeft > 10 ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-green-500/50' : 
                      gameState.timeLeft > 5 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-yellow-500/50' : 'bg-gradient-to-r from-red-500 to-red-700 shadow-red-500/50'
                    }`}
                    style={{ width: `${(gameState.timeLeft / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Battle Arena - During Active Game */}
          {gameState.currentEnemy && (
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 shadow-purple-500/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
                
                {/* Enemy Zone */}
                <div className="bg-gradient-to-br from-red-900/60 to-red-800/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-500/50 shadow-2xl shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105">
                  <h3 className="text-red-300 font-black text-2xl mb-8 text-center tracking-wider">
                    {t('battleArena.enemyZone')}
                  </h3>
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center bg-black/40 rounded-2xl p-6 shadow-xl border border-red-400/30">
                      <div className="text-6xl font-black text-red-400 mb-3 animate-pulse tracking-wider">
                        {gameState.currentEnemy.number}
                      </div>
                      <div className="text-red-300 text-lg font-bold uppercase tracking-widest">{t('battleArena.compositeNumber')}</div>
                    </div>
                  </div>
                </div>

                {/* VS Separator */}
                <div className="flex items-center justify-center">
                  <div className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse tracking-widest">
                    {t('battleArena.vs')}
                  </div>
                </div>

                {/* Defense Zone */}
                <div className="bg-gradient-to-br from-green-900/60 to-emerald-800/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-green-500/50 shadow-2xl shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105">
                  <h3 className="text-green-300 font-black text-2xl mb-8 text-center tracking-wider">
                    {t('battleArena.defenseZone')}
                  </h3>
                  <div className="flex items-center justify-center h-32">
                    {gameState.placedFactors.length > 0 ? (
                      <div className="text-center w-full">
                        <div className="flex flex-wrap gap-3 justify-center mb-4">
                          {gameState.placedFactors.map((factor, index) => (
                            <button
                              key={index}
                              onClick={() => removeFactor(index)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-xl font-black transition-all duration-300 text-xl min-w-[56px] shadow-xl hover:shadow-2xl hover:scale-110 border border-green-400/30 hover:border-red-400/30"
                              title={t('messages.tapToRemove')}
                            >
                              {factor}
                            </button>
                          ))}
                        </div>
                        <div className="text-green-300 text-base font-bold bg-black/40 rounded-xl p-3 border border-green-400/30 tracking-wide">
                          {gameState.placedFactors.join(' × ')} = {gameState.placedFactors.reduce((a, b) => a * b, 1)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-green-400/60 text-center text-lg bg-black/40 rounded-2xl p-6 border border-green-500/30 font-bold tracking-wide">
                        {t('battleArena.placePrimeFactors')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prime Number Buttons */}
          {gameState.currentEnemy && (
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 shadow-purple-500/20">
              <h3 className="text-purple-100 font-black text-2xl mb-8 text-center tracking-wider">{t('arsenal.title')}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {PRIME_NUMBERS.slice(0, 15).map((prime) => (
                  <button
                    key={prime}
                    onClick={() => placeFactor(prime)}
                    className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-4 rounded-xl font-black text-xl transition-all duration-300 min-h-[60px] shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 border border-purple-500/30 hover:border-purple-400/50"
                  >
                    {prime}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Defend Button */}
          {gameState.currentEnemy && gameState.placedFactors.length > 0 && (
            <div className="text-center mb-8">
              <button
                onClick={defendAttack}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-16 py-6 rounded-3xl font-black text-3xl shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 hover:scale-110 active:scale-95 border border-emerald-400/30 hover:border-emerald-300/50 tracking-widest animate-pulse"
              >
                {t('actions.defend')}
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState.gameOver && (
            <div className="text-center">
              <div className="bg-black/40 backdrop-blur-xl border-2 border-red-500/50 rounded-3xl p-10 mb-6 shadow-2xl shadow-red-500/30">
                <h2 className="text-4xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-6 tracking-wider">
                  {t('messages.missionFailed')}
                </h2>
                <p className="text-red-200 text-xl mb-8 font-medium tracking-wide">
                  {tm('messages.reachedWave', { wave: gameState.wave })}
                </p>
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-10 py-5 rounded-2xl font-black text-2xl transition-all duration-300 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 border border-purple-400/30 hover:border-purple-300/50 hover:scale-105 active:scale-95 tracking-wider"
                >
                  {t('actions.playAgain')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {gameState.showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm mx-auto rounded-3xl p-8 text-center bg-black/40 backdrop-blur-xl shadow-2xl border-2 ${
            gameState.popupType === 'victory' 
              ? 'border-green-500/50 shadow-green-500/30' 
              : 'border-red-500/50 shadow-red-500/30'
          }`}>
            <div className="text-white mb-6 whitespace-pre-line text-lg leading-relaxed font-medium">
              {gameState.popupMessage}
            </div>
            <button
              onClick={closePopup}
              className={`px-8 py-4 rounded-2xl font-black text-white text-xl min-h-[60px] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 tracking-wide border ${
                gameState.popupType === 'victory'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-green-500/30 hover:border-green-400/50'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-red-500/30 hover:border-red-400/50'
              }`}
            >
              {gameState.gameOver ? t('actions.playAgain') : t('actions.continue')}
            </button>
          </div>
        </div>
      )}

      {/* Video Tutorial Modal */}
      {gameState.showVideoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-xl border border-purple-500/30">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 flex items-center justify-between">
              <h3 className="text-white font-black text-xl tracking-wide">{t('tutorial.title')}</h3>
              <button
                onClick={() => setGameState(prev => ({ ...prev, showVideoModal: false }))}
                className="text-white hover:text-red-300 transition-all duration-300 text-2xl font-bold hover:scale-110"
              >
                {t('tutorial.close')}
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
                    {t('tutorial.videoNotSupported')}
                  </p>
                </video>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-center">
              <button
                onClick={() => setGameState(prev => ({ ...prev, showVideoModal: false }))}
                className="bg-black/30 hover:bg-black/50 text-white px-8 py-3 rounded-2xl font-black transition-all duration-300 hover:scale-105 active:scale-95 border border-purple-400/30 hover:border-purple-300/50 tracking-wide"
              >
                {t('actions.gotIt')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
