'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// Enhanced Types
interface NumberCell {
  id: string;
  number: number;
  x: number;
  y: number;
  isSelected: boolean;
  isCorrect: boolean;
  isHighlighted: boolean;
  isWrong: boolean;
  animationDelay: number;
}

interface Challenge {
  id: string;
  type: 'factors' | 'multiples' | 'primes' | 'composites' | 'perfect-squares' | 'even-odd';
  targetNumber: number;
  description: string;
  hint: string;
  detailedHint: string;
  points: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  educationalTips: string[];
}

interface GameStats {
  totalScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageTime: number;
  bestStreak: number;
  hintsUsed: number;
  perfectChallenges: number;
}

// Comprehensive Educational Database
const numberFacts = {
  factors: {
    definition: "Factors are numbers that divide evenly into another number with no remainder. They come in pairs!",
    examples: "For 12: 1×12=12, 2×6=12, 3×4=12. So factors are 1, 2, 3, 4, 6, 12.",
    trick: "Find factors in pairs! Start with 1 and the number itself, then work inward: 1×n, 2×(n/2), etc.",
    visualTip: "Think of factors as ways to arrange objects in rectangles!",
    commonMistakes: "Don't forget 1 and the number itself - they're always factors!"
  },
  multiples: {
    definition: "Multiples are the result of multiplying a number by positive integers (1, 2, 3, 4...).",
    examples: "Multiples of 5: 5×1=5, 5×2=10, 5×3=15, 5×4=20... Pattern: 5, 10, 15, 20, 25...",
    trick: "Multiples follow skip-counting patterns! Look for the rhythm.",
    visualTip: "Multiples of 2 are even, multiples of 5 end in 0 or 5, multiples of 10 end in 0!",
    commonMistakes: "Remember: the number itself is always its first multiple!"
  },
  primes: {
    definition: "Prime numbers have exactly two factors: 1 and themselves. They're the building blocks of all numbers!",
    examples: "First primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37...",
    trick: "2 is the only even prime! All other primes are odd. Test divisibility by primes up to √n.",
    visualTip: "Primes can't be arranged in neat rectangles (except 1×n)!",
    commonMistakes: "1 is NOT prime (it only has one factor). 2 IS prime (the only even one)!"
  },
  composites: {
    definition: "Composite numbers have more than two factors. They can be 'composed' from smaller numbers.",
    examples: "9 is composite: factors are 1, 3, 9. Can be written as 3×3.",
    trick: "If it's not prime and not 1, it's composite! Look for patterns in divisibility.",
    visualTip: "Composites can be arranged in multiple rectangle shapes!",
    commonMistakes: "1 is neither prime nor composite - it's unique!"
  },
  'perfect-squares': {
    definition: "Perfect squares are numbers that result from multiplying an integer by itself.",
    examples: "1×1=1, 2×2=4, 3×3=9, 4×4=16, 5×5=25, 6×6=36...",
    trick: "Perfect squares always have an odd number of factors!",
    visualTip: "They form perfect square grids when arranged as objects!",
    commonMistakes: "Don't forget that 1 is a perfect square (1×1)!"
  },
  'even-odd': {
    definition: "Even numbers are divisible by 2, odd numbers leave a remainder of 1 when divided by 2.",
    examples: "Even: 2, 4, 6, 8, 10... Odd: 1, 3, 5, 7, 9...",
    trick: "Even numbers end in 0, 2, 4, 6, 8. Odd numbers end in 1, 3, 5, 7, 9.",
    visualTip: "Even numbers can be paired up perfectly, odd numbers have one left over!",
    commonMistakes: "Zero is even! Any number ending in 0, 2, 4, 6, 8 is even."
  }
};

// Enhanced Challenges with Progressive Difficulty
const CHALLENGES: Challenge[] = [
  {
    id: 'factors-6',
    type: 'factors',
    targetNumber: 6,
    description: 'Find all factors of 6',
    hint: 'Numbers that divide evenly into 6',
    detailedHint: 'Think: What numbers can multiply together to make 6? Try 1×6, 2×3...',
    points: 100,
    timeLimit: 60,
    difficulty: 'easy',
    educationalTips: ['Start with 1 and 6', 'Try 2: does 6÷2 = 3? Yes!', 'Try 3: does 6÷3 = 2? Yes!']
  },
  {
    id: 'even-odd-20',
    type: 'even-odd',
    targetNumber: 20,
    description: 'Find all even numbers up to 20',
    hint: 'Numbers divisible by 2',
    detailedHint: 'Even numbers end in 0, 2, 4, 6, or 8. They can be divided by 2 with no remainder.',
    points: 120,
    timeLimit: 45,
    difficulty: 'easy',
    educationalTips: ['Look at the last digit', 'Even numbers: 0, 2, 4, 6, 8', 'Test: 8÷2 = 4 (no remainder)']
  },
  {
    id: 'perfect-squares-25',
    type: 'perfect-squares',
    targetNumber: 25,
    description: 'Find all perfect squares up to 25',
    hint: 'Numbers that equal n×n for some integer n',
    detailedHint: 'Perfect squares: 1×1=1, 2×2=4, 3×3=9, 4×4=16, 5×5=25...',
    points: 140,
    timeLimit: 50,
    difficulty: 'medium',
    educationalTips: ['1×1=1', '2×2=4', '3×3=9', '4×4=16', '5×5=25']
  },
  {
    id: 'primes-20',
    type: 'primes',
    targetNumber: 20,
    description: 'Find all prime numbers up to 20',
    hint: 'Numbers with exactly two factors: 1 and themselves',
    detailedHint: 'Check each number: Can it only be divided by 1 and itself? 2, 3, 5, 7, 11, 13, 17, 19...',
    points: 160,
    timeLimit: 55,
    difficulty: 'medium',
    educationalTips: ['2 is the only even prime', 'Test divisibility by smaller primes', '1 is not prime']
  },
  {
    id: 'multiples-4',
    type: 'multiples',
    targetNumber: 4,
    description: 'Find all multiples of 4 up to 32',
    hint: 'Numbers you get by multiplying 4 with 1, 2, 3, 4...',
    detailedHint: '4×1=4, 4×2=8, 4×3=12, 4×4=16, 4×5=20, 4×6=24, 4×7=28, 4×8=32...',
    points: 150,
    timeLimit: 50,
    difficulty: 'medium',
    educationalTips: ['Skip count by 4s', 'All multiples of 4 are even', 'Pattern: +4 each time']
  },
  {
    id: 'factors-24',
    type: 'factors',
    targetNumber: 24,
    description: 'Find all factors of 24',
    hint: 'All numbers that divide 24 evenly',
    detailedHint: 'Think of factor pairs: 1×24, 2×12, 3×8, 4×6. Each pair gives two factors!',
    points: 180,
    timeLimit: 60,
    difficulty: 'hard',
    educationalTips: ['24 has many factors!', 'Find pairs: 1×24, 2×12, 3×8, 4×6', 'Total: 1,2,3,4,6,8,12,24']
  },
  {
    id: 'composites-30',
    type: 'composites',
    targetNumber: 30,
    description: 'Find all composite numbers up to 30',
    hint: 'Numbers with more than 2 factors (not prime, not 1)',
    detailedHint: 'Composites have 3+ factors. Not prime, not 1. Examples: 4, 6, 8, 9, 10, 12...',
    points: 200,
    timeLimit: 70,
    difficulty: 'hard',
    educationalTips: ['Skip primes: 2,3,5,7,11,13,17,19,23,29', 'Skip 1 (special case)', 'Everything else is composite!']
  }
];

// Helper Functions (non-hook versions)
const getFactors = (n: number): number[] => {
  const factors: number[] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) { // Avoid duplicates for perfect squares
        factors.push(n / i);
      }
    }
  }
  return factors.sort((a, b) => a - b);
};

const getMultiples = (n: number, limit: number): number[] => {
  const multiples: number[] = [];
  for (let i = 1; i * n <= limit; i++) {
    multiples.push(i * n);
  }
  return multiples;
};

const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

const getPrimes = (limit: number): number[] => {
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
};

const getComposites = (limit: number): number[] => {
  const composites: number[] = [];
  for (let i = 4; i <= limit; i++) {
    if (!isPrime(i)) composites.push(i);
  }
  return composites;
};

const getPerfectSquares = (limit: number): number[] => {
  const squares: number[] = [];
  for (let i = 1; i * i <= limit; i++) {
    squares.push(i * i);
  }
  return squares;
};

const getEvenNumbers = (limit: number): number[] => {
  const evens: number[] = [];
  for (let i = 2; i <= limit; i += 2) {
    evens.push(i);
  }
  return evens;
};

// Enhanced Grid Generation with Better Distribution
const generateGrid = (challenge: Challenge): NumberCell[] => {
  const cells: NumberCell[] = [];
  let correctNumbers: number[] = [];
  let distractorNumbers: number[] = [];
  
  // Get correct numbers based on challenge type
  switch (challenge.type) {
    case 'factors':
      correctNumbers = getFactors(challenge.targetNumber);
      break;
    case 'multiples':
      correctNumbers = getMultiples(challenge.targetNumber, challenge.targetNumber === 4 ? 32 : 30);
      break;
    case 'primes':
      correctNumbers = getPrimes(challenge.targetNumber);
      break;
    case 'composites':
      correctNumbers = getComposites(challenge.targetNumber);
      break;
    case 'perfect-squares':
      correctNumbers = getPerfectSquares(challenge.targetNumber);
      break;
    case 'even-odd':
      correctNumbers = getEvenNumbers(challenge.targetNumber);
      break;
  }
  
  // Generate strategic distractors
  const maxRange = Math.max(challenge.targetNumber, 30);
  const allNumbers = Array.from({length: maxRange}, (_, i) => i + 1);
  distractorNumbers = allNumbers.filter(n => !correctNumbers.includes(n));
  
  // Smart distractor selection based on challenge type
  let smartDistractors: number[] = [];
  if (challenge.type === 'primes') {
    // Include composites that might be confused with primes
    smartDistractors = distractorNumbers.filter(n => n <= challenge.targetNumber);
  } else if (challenge.type === 'factors') {
    // Include numbers close to factors
    smartDistractors = distractorNumbers.filter(n => {
      if (n > challenge.targetNumber) return false;
      const nearestFactor = correctNumbers.find(f => Math.abs(f - n) < 3);
      return nearestFactor ? Math.abs(n - nearestFactor) < 3 : false;
    });
  } else {
    smartDistractors = distractorNumbers.filter(n => n <= challenge.targetNumber);
  }
  
  // Ensure we have enough distractors
  const remainingDistractors = distractorNumbers.filter(n => 
    !smartDistractors.includes(n) && n <= maxRange
  );
  
  const neededDistractors = 16 - correctNumbers.length;
  const finalDistractors = [
    ...smartDistractors.slice(0, Math.min(neededDistractors, smartDistractors.length)),
    ...remainingDistractors.slice(0, Math.max(0, neededDistractors - smartDistractors.length))
  ];
  
  // Combine and shuffle
  const allGridNumbers = [...correctNumbers, ...finalDistractors].slice(0, 16);
  const shuffled = allGridNumbers.sort(() => Math.random() - 0.5);
  
  // Create enhanced grid cells with animation delays
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    cells.push({
      id: `cell-${i}`,
      number: shuffled[i] || 0,
      x: col,
      y: row,
      isSelected: false,
      isCorrect: false,
      isHighlighted: false,
      isWrong: false,
      animationDelay: (row + col) * 100 // Staggered animation
    });
  }
  
  return cells;
};

export default function NumberMysticsGame() {
  // Enhanced Game State
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [grid, setGrid] = useState<NumberCell[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  // Enhanced Modal States
  const [showHint, setShowHint] = useState(false);
  const [showDetailedHint, setShowDetailedHint] = useState(false);
  const [showFacts, setShowFacts] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  
  // Enhanced AI & Tutorial States
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  // Performance & Animation States
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [challengeStartTime, setChallengeStartTime] = useState(0);
  
  // Enhanced Game Stats
  const [gameStats, setGameStats] = useState<GameStats>({
    totalScore: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    averageTime: 0,
    bestStreak: 0,
    hintsUsed: 0,
    perfectChallenges: 0
  });
  
  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enhanced Grid Generation with Better Distribution
  const generateGridCallback = useCallback((challenge: Challenge): NumberCell[] => {
    return generateGrid(challenge);
  }, []);
  
  // Current challenge
  const challenge = CHALLENGES[currentChallenge];
  
  // Get correct answers for current challenge
  const getCorrectAnswers = useCallback((): number[] => {
    if (!challenge) return [];
    
    switch (challenge.type) {
      case 'factors':
        return getFactors(challenge.targetNumber);
      case 'multiples':
        return getMultiples(challenge.targetNumber, challenge.targetNumber === 4 ? 32 : 30);
      case 'primes':
        return getPrimes(challenge.targetNumber);
      case 'composites':
        return getComposites(challenge.targetNumber);
      case 'perfect-squares':
        return getPerfectSquares(challenge.targetNumber);
      case 'even-odd':
        return getEvenNumbers(challenge.targetNumber);
      default:
        return [];
    }
  }, [challenge]);
  
  // Initialize game with enhanced setup
  useEffect(() => {
    if (gameStarted && challenge) {
      setIsAnimating(true);
      const newGrid = generateGridCallback(challenge);
      setGrid(newGrid);
      setTimeLeft(challenge.timeLimit);
      setSelectedNumbers([]);
      setChallengeStartTime(Date.now());
      setHintsUsed(0);
      
      // Staggered grid animation
      animationRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [currentChallenge, gameStarted, challenge, generateGridCallback]);
  
  // Enhanced timer with warning states
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted && !showResult) {
      handleTimeUp();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameStarted, showResult]);
  
  // Enhanced game start
  const startGame = useCallback(() => {
    setGameStarted(true);
    setCurrentChallenge(0);
    setScore(0);
    setCurrentStreak(0);
    setGameComplete(false);
    setGameStats({
      totalScore: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      averageTime: 0,
      bestStreak: 0,
      hintsUsed: 0,
      perfectChallenges: 0
    });
  }, []);
  
  // Enhanced cell click with animations
  const handleCellClick = useCallback((cellId: string) => {
    const cell = grid.find(c => c.id === cellId);
    if (!cell || !gameStarted || showResult || isAnimating) return;
    
    setGrid(prev => prev.map(c => 
      c.id === cellId 
        ? { ...c, isSelected: !c.isSelected }
        : c
    ));
    
    if (cell.isSelected) {
      setSelectedNumbers(prev => prev.filter(n => n !== cell.number));
    } else {
      setSelectedNumbers(prev => [...prev, cell.number].sort((a, b) => a - b));
    }
  }, [grid, gameStarted, showResult, isAnimating]);
  
  // Enhanced answer checking with detailed feedback
  const checkAnswer = useCallback(() => {
    const correctNumbers = getCorrectAnswers();
    const isCorrect = selectedNumbers.length === correctNumbers.length &&
                     selectedNumbers.every(n => correctNumbers.includes(n));
    
    setIsCorrectAnswer(isCorrect);
    
    // Calculate performance metrics
    const timeTaken = Math.round((Date.now() - challengeStartTime) / 1000);
    const perfectTime = challenge.timeLimit * 0.7; // 70% of time limit
    const isPerfect = isCorrect && timeTaken <= perfectTime && hintsUsed === 0;
    
    if (isCorrect) {
      // Calculate enhanced scoring
      const basePoints = challenge.points;
      const timeBonus = Math.max(0, Math.floor((timeLeft / challenge.timeLimit) * 50));
      const difficultyMultiplier = challenge.difficulty === 'hard' ? 1.5 : 
                                  challenge.difficulty === 'medium' ? 1.2 : 1;
      const hintPenalty = hintsUsed * 10;
      const streakBonus = currentStreak * 25;
      const perfectBonus = isPerfect ? 100 : 0;
      
      const totalPoints = Math.round((basePoints + timeBonus + streakBonus + perfectBonus - hintPenalty) * difficultyMultiplier);
      
      setScore(prev => prev + totalPoints);
      setCurrentStreak(prev => prev + 1);
      
      // Update stats
      setGameStats(prev => ({
        ...prev,
        totalScore: prev.totalScore + totalPoints,
        correctAnswers: prev.correctAnswers + 1,
        averageTime: ((prev.averageTime * prev.correctAnswers) + timeTaken) / (prev.correctAnswers + 1),
        bestStreak: Math.max(prev.bestStreak, currentStreak + 1),
        hintsUsed: prev.hintsUsed + hintsUsed,
        perfectChallenges: prev.perfectChallenges + (isPerfect ? 1 : 0)
      }));
      
      setResultMessage(`🎉 Mystical Success! ${isPerfect ? '✨ PERFECT! ✨' : ''}
      Found all ${correctNumbers.length} numbers correctly!
      ${isPerfect ? `Perfect Challenge Bonus: +100 points!` : ''}
      Base Points: ${basePoints}
      Time Bonus: +${timeBonus}
      Streak Bonus: +${streakBonus}
      ${hintPenalty > 0 ? `Hint Penalty: -${hintPenalty}` : ''}
      Total Earned: ${totalPoints} points
      Time: ${timeTaken}s`);
      
      // Show celebration for perfect or high-streak
      if (isPerfect || currentStreak >= 2) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
    } else {
      setCurrentStreak(0);
      const missed = correctNumbers.filter(n => !selectedNumbers.includes(n));
      const wrong = selectedNumbers.filter(n => !correctNumbers.includes(n));
      
      // Update stats
      setGameStats(prev => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
        hintsUsed: prev.hintsUsed + hintsUsed
      }));
      
      setResultMessage(`🔮 Not quite right, young mystic...
      
      ✅ Correct Answer: ${correctNumbers.join(', ')}
      ${missed.length > 0 ? `❌ You missed: ${missed.join(', ')}` : ''}
      ${wrong.length > 0 ? `⚠️ Wrong selections: ${wrong.join(', ')}` : ''}
      
      Time taken: ${timeTaken}s
      Don't worry - every mystic learns from practice!`);
    }
    
    // Mark correct and wrong cells with enhanced visual feedback
    setGrid(prev => prev.map(c => ({
      ...c,
      isCorrect: correctNumbers.includes(c.number),
      isHighlighted: correctNumbers.includes(c.number),
      isWrong: selectedNumbers.includes(c.number) && !correctNumbers.includes(c.number)
    })));
    
    setShowResult(true);
    
    // Generate enhanced AI suggestions
    generateEnhancedAISuggestions(isCorrect, correctNumbers, timeTaken, isPerfect);
  }, [selectedNumbers, getCorrectAnswers, challenge, timeLeft, challengeStartTime, hintsUsed, currentStreak]);
  
  // Enhanced AI suggestion generation
  const generateEnhancedAISuggestions = useCallback((
    wasCorrect: boolean, 
    correctNumbers: number[], 
    timeTaken: number,
    isPerfect: boolean
  ) => {
    const suggestions: string[] = [];
    
    if (wasCorrect) {
      if (isPerfect) {
        suggestions.push(`� OUTSTANDING! Perfect challenge completion!`);
        suggestions.push(`⚡ You're mastering ${challenge.type} like a true number mystic!`);
      } else {
        suggestions.push(`🎯 Excellent work! You found all ${correctNumbers.length} correct numbers!`);
      }
      
      if (currentStreak >= 3) {
        suggestions.push(`🔥 INCREDIBLE! ${currentStreak + 1} challenge winning streak!`);
        suggestions.push(`🏆 You're becoming a legendary number mystic!`);
      }
      
      // Encourage speed improvement
      if (timeTaken > challenge.timeLimit * 0.8) {
        suggestions.push(`⏰ Try to solve faster next time for bigger time bonuses!`);
      }
      
    } else {
      suggestions.push(`📍 The correct ${challenge.type} were: ${correctNumbers.join(', ')}`);
      
      // Type-specific learning suggestions
      if (challenge.type === 'factors') {
        suggestions.push(`💡 Tip: Find factor pairs! For ${challenge.targetNumber}: ${getFactors(challenge.targetNumber).map((f) => {
          const pair = challenge.targetNumber / f;
          return f <= pair ? `${f}×${pair}` : null;
        }).filter(Boolean).join(', ')}`);
        suggestions.push(`🔢 Method: Start with 1×${challenge.targetNumber}, then try 2×${challenge.targetNumber/2}, etc.`);
      } else if (challenge.type === 'multiples') {
        suggestions.push(`💡 Tip: Count by ${challenge.targetNumber}s: ${getMultiples(challenge.targetNumber, 5 * challenge.targetNumber).slice(0, 6).join(', ')}...`);
        suggestions.push(`🔢 Pattern: Add ${challenge.targetNumber} each time!`);
      } else if (challenge.type === 'primes') {
        suggestions.push(`💡 Tip: Primes have exactly 2 factors. Test: Can only 1 and the number itself divide it?`);
        suggestions.push(`🔢 Remember: 2 is the only even prime number!`);
      }
      
      // Encourage using hints
      if (hintsUsed === 0) {
        suggestions.push(`� Don't forget: You can use hints to learn the concepts better!`);
      }
    }
    
    // Add learning resources
    suggestions.push(`� Want to master ${challenge.type}? Check out the educational facts!`);
    
    setAiSuggestions(suggestions);
  }, [challenge, currentStreak, hintsUsed]);
  
  // Enhanced time up handling
  const handleTimeUp = useCallback(() => {
    const correctNumbers = getCorrectAnswers();
    setGameStats(prev => ({
      ...prev,
      wrongAnswers: prev.wrongAnswers + 1
    }));
    
    setResultMessage(`⏰ Time's up, mystic! 
    
    The mystical portal closed before you could complete the spell.
    ✅ The correct ${challenge.type} were: ${correctNumbers.join(', ')}
    
    🎯 Practice tip: Try using hints to learn faster!`);
    setIsCorrectAnswer(false);
    setShowResult(true);
    setCurrentStreak(0);
    generateEnhancedAISuggestions(false, correctNumbers, challenge.timeLimit, false);
  }, [getCorrectAnswers, challenge]);
  
  // Enhanced next challenge transition
  const nextChallenge = useCallback(() => {
    setShowResult(false);
    setShowCelebration(false);
    
    if (currentChallenge < CHALLENGES.length - 1) {
      setCurrentChallenge(prev => prev + 1);
    } else {
      // Game complete with final stats
      setGameComplete(true);
      setGameStats(prev => ({
        ...prev,
        totalScore: score
      }));
    }
    
    // Clear grid highlights with animation
    setGrid(prev => prev.map(c => ({
      ...c,
      isSelected: false,
      isCorrect: false,
      isHighlighted: false,
      isWrong: false
    })));
  }, [currentChallenge, score]);
  
  // Enhanced educational facts display
  const showEducationalFacts = useCallback((type: string) => {
    const facts = numberFacts[type as keyof typeof numberFacts];
    if (facts) {
      setCurrentFact(`${facts.definition}\n\n📝 Example: ${facts.examples}\n\n💡 Pro Tip: ${facts.trick}\n\n🎯 Visual: ${facts.visualTip}\n\n⚠️ Common Mistake: ${facts.commonMistakes}`);
      setShowFacts(true);
    }
  }, []);
  
  // Enhanced hint system
  const showHintWithPenalty = useCallback(() => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
  }, []);
  
  const showDetailedHintWithPenalty = useCallback(() => {
    setHintsUsed(prev => prev + 2); // Higher penalty for detailed hints
    setShowDetailedHint(true);
  }, []);
  
  // Reset game with confirmation
  const resetGame = useCallback(() => {
    setGameStarted(false);
    setGameComplete(false);
    setCurrentChallenge(0);
    setScore(0);
    setCurrentStreak(0);
    setSelectedNumbers([]);
    setGrid([]);
    setShowResult(false);
    setShowCelebration(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 font-sans relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}
      
      {/* Blur background when modal is open */}
      <div className={`${showHint || showDetailedHint || showFacts || showResult || showAISuggestions ? 'filter blur-sm' : ''}`}>
        
        {/* Enhanced Header */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-3">
            <Link href="https://eklavyaa.vercel.app/chapters/maths-world" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl">
              ←
            </Link>
            <div className="text-center">
              <h1 className="text-base font-semibold text-gray-800">The Number Mystics 🔮</h1>
              {challenge && (
                <div className="text-xs text-gray-500">
                  Challenge {currentChallenge + 1}/7 • {challenge.difficulty.toUpperCase()}
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowAISuggestions(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg relative"
            >
              🤖
              {aiSuggestions.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </button>
          </div>
          
          {/* Enhanced Game Stats */}
          {gameStarted && (
            <div className="px-3 pb-2 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-purple-600">🏆</span>
                  <span className="font-medium">{score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-indigo-600'}`}>⏰</span>
                  <span className={`font-medium ${timeLeft <= 10 ? 'text-red-600' : ''}`}>{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-pink-600">🔥</span>
                  <span className="font-medium">{currentStreak}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600">💡</span>
                  <span className="font-medium">{hintsUsed}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Game Complete Screen */}
        {gameComplete && (
          <div className="p-3 text-center">
            <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
              <div className="text-4xl mb-3">�</div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Master Number Mystic!</h2>
              <p className="text-sm text-gray-600 mb-3">You&apos;ve conquered all mystical challenges!</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <div className="text-purple-600 font-bold text-lg">{gameStats.totalScore}</div>
                  <div className="text-purple-600">Total Score</div>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="text-green-600 font-bold text-lg">{gameStats.correctAnswers}</div>
                  <div className="text-green-600">Correct</div>
                </div>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <div className="text-orange-600 font-bold text-lg">{gameStats.bestStreak}</div>
                  <div className="text-orange-600">Best Streak</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-blue-600 font-bold text-lg">{gameStats.perfectChallenges}</div>
                  <div className="text-blue-600">Perfect</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                Accuracy: {Math.round((gameStats.correctAnswers / (gameStats.correctAnswers + gameStats.wrongAnswers)) * 100)}%
              </div>
              
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-colors text-sm"
              >
                🔄 Master Again
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Start Screen */}
        {!gameStarted && !gameComplete && (
          <div className="p-3 text-center">
            <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
              <div className="text-4xl mb-3">🔮</div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Welcome, Future Number Mystic!</h2>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Discover the hidden relationships between numbers! Master factors, multiples, 
                primes, perfect squares, and more through 7 progressively challenging quests.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg text-xs text-left">
                  <span className="font-semibold text-purple-700">🎯 Your Quest:</span>
                  <p className="text-purple-600 mt-1">Complete 7 mystical challenges with increasing difficulty!</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-3 rounded-lg text-xs text-left">
                  <span className="font-semibold text-indigo-700">⚡ Special Features:</span>
                  <ul className="text-indigo-600 mt-1 space-y-1">
                    <li>• Smart hints with detailed explanations</li>
                    <li>• AI-powered learning suggestions</li>
                    <li>• Performance tracking & streak bonuses</li>
                    <li>• Interactive educational facts</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg text-xs text-left">
                  <span className="font-semibold text-pink-700">🏆 Scoring System:</span>
                  <p className="text-pink-600 mt-1">Earn points for speed, accuracy, and streaks. Perfect challenges give bonus points!</p>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-colors text-sm shadow-lg"
              >
                🌟 Begin Your Mystical Journey
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Game Area */}
        {gameStarted && !gameComplete && challenge && (
          <div className="p-3">
            {/* Enhanced Challenge Info */}
            <div className="bg-white rounded-xl p-3 mb-3 shadow-sm">
              <div className="text-center mb-3">
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-2 ${
                  challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {challenge.difficulty.toUpperCase()}
                </div>
                <h3 className="text-sm font-bold text-gray-800">{challenge.description}</h3>
                <p className="text-xs text-purple-600 mt-1">{challenge.hint}</p>
              </div>
              
              <div className="flex justify-center gap-2 text-xs">
                <button
                  onClick={showHintWithPenalty}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg font-medium hover:bg-yellow-200 transition-colors relative"
                >
                  💡 Quick Hint
                  {hintsUsed > 0 && <span className="ml-1 text-xs">(-10pts)</span>}
                </button>
                <button
                  onClick={showDetailedHintWithPenalty}
                  className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg font-medium hover:bg-orange-200 transition-colors"
                >
                  🎯 Detailed Hint
                  <span className="ml-1 text-xs">(-20pts)</span>
                </button>
                <button
                  onClick={() => showEducationalFacts(challenge.type)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                >
                  📚 Learn More
                </button>
              </div>
            </div>

            {/* Enhanced Number Grid */}
            <div className="bg-white rounded-xl p-3 mb-3 shadow-sm">
              <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                {grid.map((cell) => (
                  <button
                    key={cell.id}
                    onClick={() => handleCellClick(cell.id)}
                    disabled={showResult || isAnimating}
                    style={{ animationDelay: `${cell.animationDelay}ms` }}
                    className={`
                      aspect-square rounded-lg font-bold text-sm transition-all duration-300 border-2 
                      ${isAnimating ? 'animate-fadeIn' : ''}
                      ${cell.isSelected 
                        ? 'bg-purple-500 text-white border-purple-600 scale-105 shadow-lg transform' 
                        : cell.isCorrect && showResult
                          ? 'bg-green-500 text-white border-green-600 animate-pulse shadow-lg'
                          : cell.isWrong && showResult
                            ? 'bg-red-500 text-white border-red-600 animate-shake'
                            : cell.isHighlighted
                              ? 'bg-blue-400 text-white border-blue-500'
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-200 hover:from-purple-50 hover:to-purple-100 hover:border-purple-300'
                      }
                      ${showResult ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
                    `}
                  >
                    {cell.number}
                  </button>
                ))}
              </div>
              
              {/* Enhanced Selection Display */}
              {selectedNumbers.length > 0 && (
                <div className="mt-3 text-center">
                  <div className="mb-2">
                    <span className="text-xs text-gray-600">Selected: </span>
                    <span className="text-xs font-mono bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {selectedNumbers.join(', ')}
                    </span>
                  </div>
                  <button
                    onClick={checkAnswer}
                    disabled={showResult || isAnimating}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-colors text-sm disabled:opacity-50 shadow-lg"
                  >
                    🔮 Cast Number Spell
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Progress Bar */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-2">Mystical Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 h-3 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${((currentChallenge + 1) / CHALLENGES.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex justify-between">
                  <span>Challenge {currentChallenge + 1} of {CHALLENGES.length}</span>
                  <span>{Math.round(((currentChallenge + 1) / CHALLENGES.length) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Hint Modal */}
      {showHint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg w-full max-w-sm mx-auto p-3 shadow-2xl animate-slideIn">
            <div className="text-center mb-3">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="text-sm font-bold text-gray-800">Quick Mystic Hint</h3>
            </div>
            
            <div className="mb-3">
              <p className="text-xs text-gray-700 leading-relaxed bg-yellow-50 p-2 rounded-lg border-l-4 border-yellow-400">
                {challenge?.hint}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowHint(false);
                  showDetailedHintWithPenalty();
                }}
                className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-orange-600 transition-colors text-xs"
              >
                🎯 Need More Help?
              </button>
              <button
                onClick={() => setShowHint(false)}
                className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-xs"
              >
                Got it! ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Detailed Hint Modal */}
      {showDetailedHint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg w-full max-w-sm mx-auto p-3 shadow-2xl animate-slideIn max-h-[85vh] overflow-y-auto">
            <div className="text-center mb-3">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-sm font-bold text-gray-800">Detailed Mystic Guide</h3>
            </div>
            
            <div className="mb-3 space-y-2">
              <div className="bg-orange-50 p-2 rounded-lg border-l-4 border-orange-400">
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {challenge?.detailedHint}
                </p>
              </div>
              
              {challenge?.educationalTips.map((tip, index) => (
                <div key={index} className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Step {index + 1}:</span> {tip}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDetailedHint(false);
                  showEducationalFacts(challenge.type);
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs"
              >
                📚 Learn More
              </button>
              <button
                onClick={() => setShowDetailedHint(false)}
                className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-orange-600 transition-colors text-xs"
              >
                Ready to Try! 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Educational Facts Modal */}
      {showFacts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg w-full max-w-sm mx-auto p-3 shadow-2xl max-h-[85vh] overflow-y-auto animate-slideIn">
            <div className="text-center mb-3">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-sm font-bold text-gray-800">Number Magic Encyclopedia</h3>
            </div>
            
            <div className="mb-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                  {currentFact}
                </pre>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="text-center text-xs text-gray-600">Explore other concepts:</div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(numberFacts).map(([key]) => (
                  <button
                    key={key}
                    onClick={() => showEducationalFacts(key)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      key === challenge.type 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                  >
                    {key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowFacts(false);
                  setShowAISuggestions(true);
                }}
                className="w-full bg-purple-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-purple-600 transition-colors text-xs"
              >
                🤖 Get AI Learning Tips
              </button>
              <button
                onClick={() => setShowFacts(false)}
                className="w-full bg-gray-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-gray-600 transition-colors text-xs"
              >
                Continue Quest ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced AI Suggestions Modal */}
      {showAISuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg w-full max-w-sm mx-auto p-3 shadow-2xl max-h-[85vh] overflow-y-auto animate-slideIn">
            <div className="text-center mb-3">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="text-sm font-bold text-gray-800">AI Mystic Learning Guide</h3>
            </div>
            
            <div className="space-y-2 mb-3">
              {aiSuggestions.length > 0 ? (
                aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <span className="text-xs text-gray-700">{suggestion}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <span className="text-xs text-gray-500">Complete a challenge to get personalized AI insights!</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="text-center text-xs text-gray-600">Want to explore more?</div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => {
                    setShowAISuggestions(false);
                    showEducationalFacts('factors');
                  }}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                >
                  🔢 Factors
                </button>
                <button
                  onClick={() => {
                    setShowAISuggestions(false);
                    showEducationalFacts('primes');
                  }}
                  className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                >
                  🌟 Primes
                </button>
                <button
                  onClick={() => {
                    setShowAISuggestions(false);
                    showEducationalFacts('multiples');
                  }}
                  className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-xs font-medium hover:bg-yellow-200 transition-colors"
                >
                  ✖️ Multiples
                </button>
                <button
                  onClick={() => {
                    setShowAISuggestions(false);
                    showEducationalFacts('perfect-squares');
                  }}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors"
                >
                  ⬜ Squares
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowAISuggestions(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors text-xs"
            >
              Continue Adventure ⚡
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className={`bg-white rounded-lg p-4 w-full max-w-sm mx-auto text-center shadow-2xl animate-slideIn ${
            isCorrectAnswer ? 'border-4 border-green-500' : 'border-4 border-orange-500'
          }`}>
            <div className={`text-3xl mb-3 ${isCorrectAnswer ? 'animate-bounce' : 'animate-pulse'}`}>
              {isCorrectAnswer ? '🌟' : '🔮'}
            </div>
            
            <h3 className={`text-base font-bold mb-3 ${
              isCorrectAnswer ? 'text-green-600' : 'text-orange-600'
            }`}>
              {isCorrectAnswer ? 'Mystical Success!' : 'Keep Learning!'}
            </h3>
            
            <div className="mb-3 bg-gray-50 p-2 rounded-lg">
              <pre className="text-gray-700 text-xs whitespace-pre-wrap font-sans">
                {resultMessage}
              </pre>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowResult(false);
                  setShowAISuggestions(true);
                }}
                className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs"
              >
                🤖 Get AI Learning Insights
              </button>
              <button
                onClick={nextChallenge}
                className={`w-full py-2 px-3 rounded-lg font-bold text-white shadow-lg text-xs ${
                  isCorrectAnswer 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                }`}
              >
                {currentChallenge < CHALLENGES.length - 1 ? 'Next Challenge 🚀' : 'See Final Results 🏆'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}