'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// Types
interface Point {
  x: number;
  y: number;
  color: string;
}

interface QuestionOption {
  id: string;
  points: Point[];
  isCorrect: boolean;
}

interface SymmetryQuestion {
  id: string;
  name: string;
  emoji: string;
  originalPoints: Point[];
  axis: 'vertical' | 'horizontal' | 'diagonal';
  difficulty: number;
  description: string;
  question: string;
  options: QuestionOption[];
}

// Educational facts database
const symmetryFacts = {
  basics: {
    definition: "Symmetry means one half is exactly like the other half, like a mirror image! Every point on one side has a matching point on the other side.",
    realLife: "Look around you! Butterfly wings, your face, flowers, snowflakes - nature loves symmetry because it's balanced and beautiful!",
    math: "In math, we use coordinates (x, y) to describe where points are. When we reflect across a line, we change one coordinate but keep the other!"
  },
  types: {
    vertical: "Vertical symmetry is like folding a paper top to bottom. If you reflect across the y-axis, point (3, 4) becomes (-3, 4)!",
    horizontal: "Horizontal symmetry is like folding left to right. If you reflect across the x-axis, point (3, 4) becomes (3, -4)!",
    diagonal: "Diagonal symmetry is trickier! We swap x and y coordinates. Point (3, 4) becomes (4, 3) across the line y = x!"
  },
  applications: {
    art: "Artists use symmetry to create beautiful patterns! Rangoli, mandalas, and Islamic geometric art all use mathematical symmetry rules.",
    nature: "Nature uses symmetry for balance and efficiency. Flowers are symmetric to attract pollinators equally from all sides!",
    technology: "Computer graphics, architecture, and even your phone's design use symmetry principles for beauty and function!"
  }
};

// Game patterns - mathematical nature objects with multiple choice questions
const SYMMETRY_QUESTIONS: SymmetryQuestion[] = [
  {
    id: 'butterfly1',
    name: 'Simple Butterfly',
    emoji: '🦋',
    axis: 'vertical',
    difficulty: 1,
    description: 'A butterfly with vertical symmetry',
    question: 'If the left wing has these points, where should the right wing points be?',
    originalPoints: [
      { x: 2, y: 3, color: '#FF6B9D' },
      { x: 3, y: 4, color: '#4ECDC4' }
    ],
    options: [
      {
        id: 'a',
        points: [
          { x: 8, y: 3, color: '#FF6B9D' },
          { x: 7, y: 4, color: '#4ECDC4' }
        ],
        isCorrect: true
      },
      {
        id: 'b', 
        points: [
          { x: 6, y: 3, color: '#FF6B9D' },
          { x: 5, y: 4, color: '#4ECDC4' }
        ],
        isCorrect: false
      },
      {
        id: 'c',
        points: [
          { x: 8, y: 4, color: '#FF6B9D' },
          { x: 7, y: 3, color: '#4ECDC4' }
        ],
        isCorrect: false
      },
      {
        id: 'd',
        points: [
          { x: 9, y: 3, color: '#FF6B9D' },
          { x: 8, y: 4, color: '#4ECDC4' }
        ],
        isCorrect: false
      }
    ]
  },
  {
    id: 'leaf1',
    name: 'Heart Leaf',
    emoji: '💚',
    axis: 'vertical',
    difficulty: 2,
    description: 'A heart-shaped leaf with vertical symmetry',
    question: 'Complete the heart shape by choosing the correct right side:',
    originalPoints: [
      { x: 1, y: 2, color: '#2ECC71' },
      { x: 2, y: 1, color: '#27AE60' },
      { x: 3, y: 2, color: '#2ECC71' },
      { x: 2, y: 4, color: '#27AE60' }
    ],
    options: [
      {
        id: 'a',
        points: [
          { x: 9, y: 2, color: '#2ECC71' },
          { x: 8, y: 1, color: '#27AE60' },
          { x: 7, y: 2, color: '#2ECC71' },
          { x: 8, y: 4, color: '#27AE60' }
        ],
        isCorrect: true
      },
      {
        id: 'b',
        points: [
          { x: 8, y: 2, color: '#2ECC71' },
          { x: 7, y: 1, color: '#27AE60' },
          { x: 6, y: 2, color: '#2ECC71' },
          { x: 7, y: 4, color: '#27AE60' }
        ],
        isCorrect: false
      },
      {
        id: 'c',
        points: [
          { x: 9, y: 1, color: '#2ECC71' },
          { x: 8, y: 2, color: '#27AE60' },
          { x: 7, y: 1, color: '#2ECC71' },
          { x: 8, y: 3, color: '#27AE60' }
        ],
        isCorrect: false
      },
      {
        id: 'd',
        points: [
          { x: 10, y: 2, color: '#2ECC71' },
          { x: 9, y: 1, color: '#27AE60' },
          { x: 8, y: 2, color: '#2ECC71' },
          { x: 9, y: 4, color: '#27AE60' }
        ],
        isCorrect: false
      }
    ]
  },
  {
    id: 'flower1',
    name: 'Simple Flower',
    emoji: '🌸',
    axis: 'horizontal',
    difficulty: 2,
    description: 'A flower with horizontal symmetry',
    question: 'If the top petals look like this, how should the bottom petals look?',
    originalPoints: [
      { x: 4, y: 1, color: '#E91E63' },
      { x: 6, y: 2, color: '#E91E63' },
      { x: 5, y: 3, color: '#FFC107' }
    ],
    options: [
      {
        id: 'a',
        points: [
          { x: 4, y: 7, color: '#E91E63' },
          { x: 6, y: 6, color: '#E91E63' },
          { x: 5, y: 5, color: '#FFC107' }
        ],
        isCorrect: true
      },
      {
        id: 'b',
        points: [
          { x: 4, y: 6, color: '#E91E63' },
          { x: 6, y: 5, color: '#E91E63' },
          { x: 5, y: 4, color: '#FFC107' }
        ],
        isCorrect: false
      },
      {
        id: 'c',
        points: [
          { x: 5, y: 7, color: '#E91E63' },
          { x: 7, y: 6, color: '#E91E63' },
          { x: 6, y: 5, color: '#FFC107' }
        ],
        isCorrect: false
      },
      {
        id: 'd',
        points: [
          { x: 3, y: 7, color: '#E91E63' },
          { x: 5, y: 6, color: '#E91E63' },
          { x: 4, y: 5, color: '#FFC107' }
        ],
        isCorrect: false
      }
    ]
  },
  {
    id: 'star1',
    name: 'Star Pattern',
    emoji: '⭐',
    axis: 'diagonal',
    difficulty: 3,
    description: 'A star with diagonal symmetry',
    question: 'If these points are on one side of the diagonal, where should the reflected points be?',
    originalPoints: [
      { x: 2, y: 1, color: '#FFD700' },
      { x: 3, y: 2, color: '#FFA500' },
      { x: 1, y: 3, color: '#FFD700' }
    ],
    options: [
      {
        id: 'a',
        points: [
          { x: 1, y: 2, color: '#FFD700' },
          { x: 2, y: 3, color: '#FFA500' },
          { x: 3, y: 1, color: '#FFD700' }
        ],
        isCorrect: true
      },
      {
        id: 'b',
        points: [
          { x: 2, y: 1, color: '#FFD700' },
          { x: 3, y: 2, color: '#FFA500' },
          { x: 1, y: 3, color: '#FFD700' }
        ],
        isCorrect: false
      },
      {
        id: 'c',
        points: [
          { x: 3, y: 2, color: '#FFD700' },
          { x: 4, y: 3, color: '#FFA500' },
          { x: 2, y: 4, color: '#FFD700' }
        ],
        isCorrect: false
      },
      {
        id: 'd',
        points: [
          { x: 1, y: 1, color: '#FFD700' },
          { x: 2, y: 2, color: '#FFA500' },
          { x: 3, y: 3, color: '#FFD700' }
        ],
        isCorrect: false
      }
    ]
  },
  {
    id: 'tree1',
    name: 'Christmas Tree',
    emoji: '🎄',
    axis: 'vertical',
    difficulty: 3,
    description: 'A Christmas tree with vertical symmetry',
    question: 'Complete this Christmas tree by choosing the correct right side:',
    originalPoints: [
      { x: 1, y: 1, color: '#228B22' },
      { x: 2, y: 2, color: '#228B22' },
      { x: 3, y: 3, color: '#228B22' },
      { x: 2, y: 4, color: '#8B4513' }
    ],
    options: [
      {
        id: 'a',
        points: [
          { x: 7, y: 1, color: '#228B22' },
          { x: 6, y: 2, color: '#228B22' },
          { x: 5, y: 3, color: '#228B22' },
          { x: 6, y: 4, color: '#8B4513' }
        ],
        isCorrect: true
      },
      {
        id: 'b',
        points: [
          { x: 6, y: 1, color: '#228B22' },
          { x: 5, y: 2, color: '#228B22' },
          { x: 4, y: 3, color: '#228B22' },
          { x: 5, y: 4, color: '#8B4513' }
        ],
        isCorrect: false
      },
      {
        id: 'c',
        points: [
          { x: 8, y: 1, color: '#228B22' },
          { x: 7, y: 2, color: '#228B22' },
          { x: 6, y: 3, color: '#228B22' },
          { x: 7, y: 4, color: '#8B4513' }
        ],
        isCorrect: false
      },
      {
        id: 'd',
        points: [
          { x: 7, y: 2, color: '#228B22' },
          { x: 6, y: 3, color: '#228B22' },
          { x: 5, y: 4, color: '#228B22' },
          { x: 6, y: 5, color: '#8B4513' }
        ],
        isCorrect: false
      }
    ]
  }
];

export default function NaturesMirrorGame() {
  // Game state
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<SymmetryQuestion | null>(null);
  
  // Question state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  
  // Educational states
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [showFactModal, setShowFactModal] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsmessage] = useState('');
  
  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Grid settings
  const GRID_SIZE = 40;
  const CANVAS_WIDTH = 320;
  const CANVAS_HEIGHT = 240;

  // Initialize level
  useEffect(() => {
    if (currentLevel < SYMMETRY_QUESTIONS.length) {
      setCurrentQuestion(SYMMETRY_QUESTIONS[currentLevel]);
      setSelectedOption(null);
      setShowAnswer(false);
      setLevelComplete(false);
    } else {
      setGameComplete(true);
    }
  }, [currentLevel]);

  // Draw on canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }
    
    // Draw symmetry axis
    if (currentQuestion) {
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      
      switch (currentQuestion.axis) {
        case 'vertical':
          ctx.beginPath();
          ctx.moveTo(CANVAS_WIDTH / 2, 0);
          ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
          ctx.stroke();
          break;
        case 'horizontal':
          ctx.beginPath();
          ctx.moveTo(0, CANVAS_HEIGHT / 2);
          ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
          ctx.stroke();
          break;
        case 'diagonal':
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.stroke();
          break;
      }
      ctx.setLineDash([]);
    }
    
    // Draw original pattern points
    if (currentQuestion) {
      currentQuestion.originalPoints.forEach(point => {
        drawPoint(ctx, point.x * GRID_SIZE, point.y * GRID_SIZE, point.color, 15);
      });
    }
    
    // Draw selected option points
    if (selectedOption && currentQuestion) {
      const option = currentQuestion.options.find(opt => opt.id === selectedOption);
      if (option) {
        option.points.forEach(point => {
          drawPoint(ctx, point.x * GRID_SIZE, point.y * GRID_SIZE, point.color, 12, showAnswer && !option.isCorrect);
        });
      }
    }
  }, [currentQuestion, selectedOption, showAnswer]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const drawPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number, isWrong = false) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = isWrong ? 0.5 : 1;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = isWrong ? '#EF4444' : '#FFFFFF';
    ctx.lineWidth = isWrong ? 3 : 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const handleOptionSelect = (optionId: string) => {
    if (showAnswer) return; // Don't allow selection after answer is shown
    setSelectedOption(optionId);
  };

  const checkAnswer = () => {
    if (!selectedOption || !currentQuestion) return;

    const option = currentQuestion.options.find(opt => opt.id === selectedOption);
    if (!option) return;

    setShowAnswer(true);
    setIsCorrect(option.isCorrect);

    if (option.isCorrect) {
      // Correct answer!
      const points = 20 + (currentQuestion.difficulty * 10);
      setScore(prev => prev + points);
      setLevelComplete(true);
      setCongratsmessage(`🎉 Excellent! You understand ${currentQuestion.axis} symmetry! You earned ${points} points!`);
      setShowCongrats(true);
    } else {
      // Wrong answer
      setCongratsmessage(`🤔 Not quite right! In ${currentQuestion.axis} symmetry, points reflect differently. Try to understand the pattern!`);
      setShowCongrats(true);
    }
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setShowCongrats(false);
  };

  const resetLevel = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setLevelComplete(false);
  };

  const getAIHelp = () => {
    if (!currentQuestion) return [];
    
    const hints = [];
    const axis = currentQuestion.axis;
    
    hints.push(`🎯 This ${currentQuestion.name} has ${axis} symmetry!`);
    
    switch (axis) {
      case 'vertical':
        hints.push("🪞 Imagine folding the paper down the middle vertically. The left and right sides should match!");
        hints.push("📐 If a point is 2 steps from the center line, its reflection is also 2 steps from the center, but on the other side!");
        break;
      case 'horizontal':
        hints.push("🪞 Imagine folding the paper across the middle horizontally. The top and bottom should match!");
        hints.push("📐 Points above the line have matching points below the line at the same distance!");
        break;
      case 'diagonal':
        hints.push("🪞 This is like folding along a diagonal line from corner to corner!");
        hints.push("📐 The x and y coordinates switch places in diagonal symmetry!");
        break;
    }
    
    hints.push("🎨 Remember: the colors should match too!");
    hints.push("🔍 Look at the distances carefully - symmetry is all about equal distances!");
    
    return hints.slice(0, 3);
  };

  const showFact = (category: string, key: string) => {
    const fact = (symmetryFacts as Record<string, Record<string, string>>)[category][key];
    setCurrentFact(fact);
    setShowFactModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 font-sans">
      {/* Main Game Content */}
      <div className={`${showAIHelp || showFactModal || showCongrats ? 'filter blur-sm' : ''}`}>
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-3">
            <Link href="https://eklavyaa.vercel.app/chapters/maths-world" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl">
              ←
            </Link>
            <h1 className="text-base font-semibold text-gray-800">Nature&apos;s Mirror 🪞</h1>
            <button 
              onClick={() => setShowAIHelp(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              🤖
            </button>
          </div>
          
          {/* Game Stats - Mobile Grid */}
          <div className="px-3 pb-2 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-purple-600">🎯</span>
                <span className="font-medium">{score}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-pink-600">🌸</span>
                <span className="font-medium">{currentLevel + 1}/{SYMMETRY_QUESTIONS.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-600">📏</span>
                <span className="font-medium">{currentQuestion?.axis || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Complete Screen */}
        {gameComplete && (
          <div className="p-3 text-center">
            <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
              <div className="text-4xl mb-3">🏆</div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Symmetry Master!</h2>
              <p className="text-sm text-gray-600 mb-3">You&apos;ve mastered mathematical symmetry!</p>
              <div className="text-lg font-semibold text-purple-600 mb-6">Final Score: {score}</div>
              <p className="text-sm text-gray-600 mb-6">
                You&apos;ve learned about reflections, coordinates, and the beautiful mathematics behind nature&apos;s patterns!
              </p>
              <button
                onClick={() => {
                  setCurrentLevel(0);
                  setScore(0);
                  setGameComplete(false);
                }}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        {!gameComplete && currentQuestion && (
          <div className="p-6">
            {/* Question Info */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentQuestion.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{currentQuestion.name}</h3>
                    <p className="text-sm text-gray-600">{currentQuestion.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Difficulty</div>
                  <div className="flex">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < currentQuestion.difficulty ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-purple-800">
                  🤔 <strong>Question:</strong> {currentQuestion.question}
                </p>
              </div>
            </div>

            {/* Canvas */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-800">Pattern Preview</h4>
                <p className="text-sm text-gray-600">Look at the original pattern and choose the correct symmetry!</p>
              </div>
              
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="border-2 border-purple-200 rounded-lg bg-white"
                />
              </div>
              
              <div className="flex justify-center mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-1 bg-purple-500"></div>
                    <span>Symmetry Line</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span>Original Pattern</span>
                  </div>
                  {selectedOption && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Your Choice</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4 text-center">Choose the Correct Reflection:</h4>
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={showAnswer}
                    className={`p-4 rounded-xl border-2 transition-all relative ${
                      selectedOption === option.id
                        ? showAnswer
                          ? option.isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-purple-500 bg-purple-50'
                        : showAnswer && option.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                    } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800 mb-2">Option {option.id.toUpperCase()}</div>
                      <div className="text-sm text-gray-600 mb-3">
                        {option.points.length} point{option.points.length !== 1 ? 's' : ''}
                      </div>
                      
                      {/* Visual representation of points */}
                      <div className="grid grid-cols-4 gap-1 max-w-24 mx-auto">
                        {option.points.map((point, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: point.color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Result indicators */}
                    {showAnswer && selectedOption === option.id && (
                      <div className="absolute top-2 right-2">
                        {option.isCorrect ? (
                          <span className="text-green-600 text-xl">✅</span>
                        ) : (
                          <span className="text-red-600 text-xl">❌</span>
                        )}
                      </div>
                    )}
                    
                    {showAnswer && option.isCorrect && selectedOption !== option.id && (
                      <div className="absolute top-2 right-2">
                        <span className="text-green-600 text-xl">✅</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={checkAnswer}
                disabled={!selectedOption || showAnswer}
                className={`py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all ${
                  selectedOption && !showAnswer
                    ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                🔍 Check Answer
              </button>
              
              <button
                onClick={resetLevel}
                disabled={showAnswer && isCorrect}
                className={`py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all ${
                  showAnswer && isCorrect
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-105'
                }`}
              >
                🔄 Try Again
              </button>
            </div>

            {/* Next Level Button */}
            {levelComplete && (
              <div className="text-center mb-6">
                <button
                  onClick={nextLevel}
                  className="py-4 px-8 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:scale-105 transition-all"
                >
                  🚀 Next Question
                </button>
              </div>
            )}

            {/* Helper Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setShowAIHelp(true)}
                className="py-3 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium shadow-md transition-all"
              >
                🤖 Get Hint
              </button>
              
              <button
                onClick={() => showFact('basics', 'definition')}
                className="py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-md transition-all"
              >
                💡 Learn More
              </button>
            </div>

            {/* Educational Tip */}
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">
                <span className="font-medium">🧮 Math Tip:</span> In {currentQuestion.axis} symmetry, 
                {currentQuestion.axis === 'vertical' && ' points on the left and right are equal distances from the center line.'}
                {currentQuestion.axis === 'horizontal' && ' points above and below are equal distances from the center line.'}
                {currentQuestion.axis === 'diagonal' && ' x and y coordinates swap places across the diagonal line.'}
                Look for patterns in the distances!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Help Modal */}
      {showAIHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg max-w-sm w-full p-3 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="text-center mb-3">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="text-sm font-bold text-gray-800">AI Helper</h3>
              <p className="text-xs text-gray-600">Let me guide you!</p>
            </div>
            
            <div className="space-y-2 mb-4">
              {getAIHelp().map((hint, index) => (
                <div
                  key={index}
                  className="p-2 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <span className="text-xs text-gray-700">{hint}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => showFact('types', currentQuestion?.axis || 'vertical')}
                className="py-2 px-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs"
              >
                📚 Learn
              </button>
              <button
                onClick={() => showFact('applications', 'nature')}
                className="py-2 px-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-xs"
              >
                🌿 Nature
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Show correct answer hint
                  if (currentQuestion) {
                    const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
                    if (correctOption) {
                      setCongratsmessage(`💡 Hint: Look at option ${correctOption.id.toUpperCase()}! Think about how ${currentQuestion.axis} symmetry works.`);
                      setShowCongrats(true);
                    }
                  }
                  setShowAIHelp(false);
                }}
                className="w-full bg-yellow-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-xs"
              >
                👁️ Show Hint
              </button>
              <button
                onClick={() => setShowAIHelp(false)}
                className="w-full bg-gray-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-gray-600 transition-colors text-xs mt-2"
              >
                Got it! 👍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Educational Fact Modal */}
      {showFactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg max-w-sm w-full p-3 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="text-center mb-3">
              <div className="text-2xl mb-2">🔬</div>
              <h3 className="text-sm font-bold text-gray-800">Symmetry Science</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-gray-700 leading-relaxed">{currentFact}</p>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="text-center text-xs text-gray-600">Explore more:</div>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: '🔄 Basic', category: 'basics', key: 'definition' },
                  { label: '🌍 Real Life', category: 'basics', key: 'realLife' },
                  { label: '🎨 Art', category: 'applications', key: 'art' },
                  { label: '💻 Tech', category: 'applications', key: 'technology' }
                ].map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => showFact(topic.category, topic.key)}
                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowFactModal(false);
                  setShowAIHelp(true);
                }}
                className="w-full bg-purple-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-purple-600 transition-colors text-xs"
              >
                🤖 Get Help
              </button>
              <button
                onClick={() => setShowFactModal(false)}
                className="w-full bg-gray-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-gray-600 transition-colors text-xs"
              >
                Continue Playing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg max-w-sm w-full p-3 shadow-2xl text-center max-h-[85vh] overflow-y-auto">
            <div className="text-5xl mb-4">
              {levelComplete ? '🎉' : '🎯'}
            </div>
            
            <h3 className={`text-xl font-bold mb-4 ${
              levelComplete ? 'text-green-600' : 'text-blue-600'
            }`}>
              {levelComplete ? 'Level Complete!' : 'Keep Going!'}
            </h3>
            
            <p className="text-gray-700 mb-6 text-sm leading-relaxed">
              {congratsMessage}
            </p>
            
              {levelComplete && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-semibold text-sm">
                    🌟 Great job understanding {currentQuestion?.axis} symmetry!
                  </p>
                  <p className="text-green-700 text-xs mt-1">
                    Ready for the next challenge?
                  </p>
                </div>
              )}            <button
              onClick={() => setShowCongrats(false)}
              className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all ${
                levelComplete 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {levelComplete ? 'Awesome! 🚀' : 'Keep Trying! 💪'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
