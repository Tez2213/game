'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Types
interface WaterCycleStage {
  id: string;
  name: string;
  emoji: string;
  description: string;
  fact: string;
  scientificFact: string;
  realWorldFact: string;
  completed: boolean;
}

interface DragItem {
  id: string;
  name: string;
  emoji: string;
  type: 'sun' | 'vapor' | 'cloud';
}

// Game data
const WATER_CYCLE_STAGES: WaterCycleStage[] = [
  {
    id: 'evaporation',
    name: 'Evaporation',
    emoji: '☀️',
    description: 'The Sun heats water in lakes, rivers, and oceans, turning it into invisible water vapor that rises into the air.',
    fact: 'The Sun provides the energy needed to change liquid water into water vapor. This happens every day all around the world!',
    scientificFact: 'Evaporation occurs when water molecules gain enough energy from heat to break free from the liquid and become gas molecules.',
    realWorldFact: 'Every day, the Sun evaporates about 1.4 billion tons of water from Earth\'s oceans - that\'s like emptying 560 million swimming pools!',
    completed: false
  },
  {
    id: 'condensation',
    name: 'Condensation',
    emoji: '☁️',
    description: 'Water vapor rises high into the sky where it cools down and forms tiny droplets that create clouds.',
    fact: 'Clouds are made of billions of tiny water droplets floating in the air, so small you could fit thousands on your fingertip!',
    scientificFact: 'As water vapor rises, it cools and condenses around tiny particles of dust or pollen in the atmosphere, forming cloud droplets.',
    realWorldFact: 'A typical cloud weighs about 1.1 million pounds - as much as 100 elephants - but floats because the droplets are so tiny!',
    completed: false
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    emoji: '🌧️',
    description: 'When cloud droplets become too heavy, they fall as rain, snow, or hail back to Earth.',
    fact: 'Precipitation can be rain, snow, sleet, or hail depending on the temperature as water falls through the air!',
    scientificFact: 'Precipitation occurs when cloud droplets collide and merge until they become too heavy to stay suspended in the air.',
    realWorldFact: 'The Amazon rainforest receives over 2 meters (6.5 feet) of rain each year, helping create the most biodiverse ecosystem on Earth!',
    completed: false
  }
];

const DRAG_ITEMS: DragItem[] = [
  { id: 'sun', name: 'Sun', emoji: '☀️', type: 'sun' },
  { id: 'vapor', name: 'Water Vapor', emoji: '💨', type: 'vapor' },
  { id: 'cloud', name: 'Rain Cloud', emoji: '🌧️', type: 'cloud' }
];

// Educational facts database
const educationalFacts = {
  waterCycle: {
    importance: "The water cycle is essential for all life on Earth. It distributes water around the planet and purifies it naturally.",
    energy: "The Sun is the main driver of the water cycle, providing the energy needed for evaporation and weather patterns.",
    balance: "The amount of water on Earth stays the same - it just moves between oceans, atmosphere, and land in an endless cycle.",
    weather: "The water cycle creates weather patterns, from gentle rain to powerful hurricanes and blizzards."
  },
  science: {
    states: "Water exists in three states: liquid (water), gas (water vapor), and solid (ice). The water cycle involves all three!",
    energy: "Heat energy from the Sun causes water molecules to move faster and change from liquid to gas during evaporation.",
    cooling: "As water vapor rises higher in the atmosphere, it cools down because temperature decreases with altitude.",
    precipitation: "Different types of precipitation form based on temperature: rain (warm), snow (cold), hail (very cold with strong winds)."
  },
  environment: {
    plants: "Plants also participate in the water cycle through transpiration - releasing water vapor from their leaves.",
    oceans: "Oceans contain 97% of Earth's water and are the main source of evaporation that drives the water cycle.",
    mountains: "Mountains affect precipitation patterns by forcing air upward, where it cools and creates rain or snow.",
    pollution: "Human activities can affect the water cycle through pollution, deforestation, and climate change."
  }
};

export default function WaterCycleGame() {
  // Game state
  const [currentStage, setCurrentStage] = useState(0);
  const [stages, setStages] = useState<WaterCycleStage[]>(WATER_CYCLE_STAGES);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Enhanced interaction states
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showFactModal, setShowFactModal] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [factCategory, setFactCategory] = useState('');
  const [userActions, setUserActions] = useState(0);
  const [correctSequence, setCorrectSequence] = useState(0);
  
  // Visual effect states
  const [showSunRays, setShowSunRays] = useState(false);
  const [showVaporRising, setShowVaporRising] = useState(false);
  const [showRainFalling, setShowRainFalling] = useState(false);
  const [showEvaporationEffect, setShowEvaporationEffect] = useState(false);
  
  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dropZoneActive] = useState<string>('');
  
  // Handle drag start
  const handleDragStart = (item: DragItem) => {
    setDraggedItem(item);
    setUserActions(prev => prev + 1);
  };

  // Handle drop zone interaction
  const handleDropZoneClick = (zoneType: string) => {
    if (!draggedItem) return;
    
    const currentStageData = stages[currentStage];
    let correct = false;
    
    // Check if correct action for current stage
    if (currentStageData.id === 'evaporation' && draggedItem.type === 'sun' && zoneType === 'lake') {
      correct = true;
    } else if (currentStageData.id === 'condensation' && draggedItem.type === 'vapor' && zoneType === 'sky') {
      correct = true;
    } else if (currentStageData.id === 'precipitation' && draggedItem.type === 'cloud' && zoneType === 'mountain') {
      correct = true;
    }
    
    if (correct) {
      setScore(prev => prev + 100);
      setCorrectSequence(prev => prev + 1);
      setShowSuccess(true);
      
      // Trigger visual effects based on stage
      if (currentStageData.id === 'evaporation') {
        setShowSunRays(true);
        setShowEvaporationEffect(true);
        setTimeout(() => {
          setShowSunRays(false);
          setShowEvaporationEffect(false);
        }, 3000);
      } else if (currentStageData.id === 'condensation') {
        setShowVaporRising(true);
        setTimeout(() => {
          setShowVaporRising(false);
        }, 3000);
      } else if (currentStageData.id === 'precipitation') {
        setShowRainFalling(true);
        setTimeout(() => {
          setShowRainFalling(false);
        }, 3000);
      }
      
      // Mark stage as completed
      const updatedStages = [...stages];
      updatedStages[currentStage].completed = true;
      setStages(updatedStages);
      
      // Move to next stage or complete game
      if (currentStage < stages.length - 1) {
        setTimeout(() => {
          setCurrentStage(prev => prev + 1);
        }, 2000);
      } else {
        // For precipitation (last stage), wait for rain animation to complete
        if (currentStageData.id === 'precipitation') {
          setTimeout(() => {
            setGameCompleted(true);
          }, 3500); // Wait for rain animation (3000ms) + extra buffer
        } else {
          setGameCompleted(true);
        }
      }
    } else {
      setShowError(true);
    }
    
    setDraggedItem(null);
    
    // Auto-hide feedback after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setShowError(false);
    }, 2000);
  };

  // Get AI suggestions based on current context
  const getAISuggestions = () => {
    const suggestions = [];
    const stage = stages[currentStage];
    
    // Stage-specific suggestions
    if (stage.id === 'evaporation') {
      suggestions.push('🔍 Try: Put a glass of water in the sun and watch it slowly disappear!');
      suggestions.push('🌡️ Explore: Feel how the Sun makes puddles dry up after rain!');
      suggestions.push('🏊 Investigate: Why do you feel cooler when you get out of a swimming pool?');
    } else if (stage.id === 'condensation') {
      suggestions.push('❄️ Try: Breathe on a cold window and see water droplets form!');
      suggestions.push('🥤 Explore: Watch water droplets form on a cold glass on a hot day!');
      suggestions.push('☁️ Investigate: Look at different cloud shapes and guess their height!');
    } else if (stage.id === 'precipitation') {
      suggestions.push('🌧️ Try: Collect rainwater and measure how much falls in your area!');
      suggestions.push('❄️ Explore: Catch snowflakes on dark paper and look at their shapes!');
      suggestions.push('🌈 Investigate: Look for rainbows after rain storms!');
    }
    
    // Progress-based suggestions
    if (correctSequence >= 2) {
      suggestions.push('🌍 Challenge: Think about how the water cycle affects different climates!');
      suggestions.push('🌱 Discover: How do plants help the water cycle through their leaves?');
    }
    
    // General suggestions
    suggestions.push('💧 Learn: Discover how the same water has been cycling for millions of years!');
    suggestions.push('🔄 Explore: Find out why the water cycle never stops!');
    
    return suggestions.slice(0, 4);
  };

  // Show fact modal with specific content
  const showFact = (category: string, content: string) => {
    setFactCategory(category);
    setCurrentFact(content);
    setShowFactModal(true);
  };

  // Reset game
  const resetGame = () => {
    setCurrentStage(0);
    setStages(WATER_CYCLE_STAGES.map(stage => ({ ...stage, completed: false })));
    setScore(0);
    setGameCompleted(false);
    setCorrectSequence(0);
    setDraggedItem(null);
  };

  // AI Suggestions Modal
  const AISuggestionsModal = () => {
    if (!showAISuggestions) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-scale-in border border-gray-200">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="text-lg font-bold text-gray-800">AI Learning Suggestions</h3>
            <p className="text-sm text-gray-600">Ready to explore the water cycle further?</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {getAISuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setShowAISuggestions(false);
                  // Auto-trigger fact based on suggestion
                  if (suggestion.includes('plants')) {
                    showFact('environment', educationalFacts.environment.plants);
                  } else if (suggestion.includes('climate')) {
                    showFact('environment', educationalFacts.environment.mountains);
                  } else if (suggestion.includes('energy')) {
                    showFact('science', educationalFacts.science.energy);
                  } else if (suggestion.includes('never stops')) {
                    showFact('waterCycle', educationalFacts.waterCycle.energy);
                  }
                }}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors shadow-sm"
              >
                <span className="text-sm text-gray-700">{suggestion}</span>
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => showFact('waterCycle', stages[currentStage]?.fact || educationalFacts.waterCycle.importance)}
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm shadow-md"
            >
              💧 Water Facts
            </button>
            <button
              onClick={() => setShowAISuggestions(false)}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm shadow-md"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Educational Fact Modal
  const FactModal = () => {
    if (!showFactModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-scale-in border border-gray-200">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">💡</div>
            <h3 className="text-lg font-bold text-gray-800">Did You Know?</h3>
            <p className="text-xs text-gray-600">{factCategory} facts</p>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{currentFact}</p>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="text-center text-xs text-gray-600">Explore more about:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: '💧 Water Cycle', content: educationalFacts.waterCycle.importance },
                { label: '🔬 Science', content: educationalFacts.science.states },
                { label: '🌍 Environment', content: educationalFacts.environment.oceans },
                { label: '☀️ Energy', content: educationalFacts.science.energy }
              ].map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => {
                    setCurrentFact(topic.content);
                    setFactCategory(topic.label);
                  }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors shadow-sm"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowFactModal(false);
                setShowAISuggestions(true);
              }}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm shadow-md"
            >
              🤖 More Ideas
            </button>
            <button
              onClick={() => setShowFactModal(false)}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm shadow-md"
            >
              Got it! 👍
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 font-sans">
      {/* Main Game Content */}
      <div className={`${showAISuggestions || showFactModal ? 'filter blur-sm' : ''}`}>
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Link href="https://eklavyaa.vercel.app/chapters/science-world" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-2xl">
              ←
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Water Cycle Adventure</h1>
            <div className="w-10"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="px-4 pb-3 bg-gradient-to-r from-sky-50 to-blue-50">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">🎯 Score:</span>
                <div className="bg-white rounded-full px-2 py-1 text-green-600 font-medium">
                  {score} points
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">🔄 Stage:</span>
                <div className="bg-white rounded-full px-2 py-1 text-blue-600 font-medium">
                  {currentStage + 1}/3
                </div>
              </div>
            </div>
            
            {/* Progress Visual */}
            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full transition-all duration-300"
                style={{ width: `${((currentStage + (stages[currentStage]?.completed ? 1 : 0)) / stages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Game Completed Screen */}
        {gameCompleted && (
          <div className="p-6 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6 animate-celebration-entry">
              <div className="text-6xl mb-4 animate-celebration-burst">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-title-pop">Cycle Complete!</h2>
              <p className="text-gray-600 mb-4 animate-fade-in-delayed">You&apos;ve mastered the water cycle!</p>
              <div className="text-4xl mb-4 animate-cycle-flow">💧☀️☁️🌧️</div>
              <p className="text-sm text-gray-600 mb-6 animate-fade-in-slow">
                The water cycle continues forever, moving water around our planet and supporting all life on Earth!
              </p>
              <button
                onClick={resetGame}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all duration-300 hover:scale-105 active:scale-95 animate-button-bounce"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}

        {/* Current Stage Instructions */}
        {!gameCompleted && (
          <div className="p-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 animate-slide-in">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2 animate-stage-icon">{stages[currentStage]?.emoji}</div>
                <h2 className="text-xl font-bold text-gray-800 animate-title-appear">{stages[currentStage]?.name}</h2>
                <p className="text-sm text-gray-600 mt-2 animate-description-fade">{stages[currentStage]?.description}</p>
              </div>
              
              {/* Stage Progress */}
              <div className="flex justify-center space-x-4 mt-4">
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                      index < currentStage ? 'bg-green-500 text-white animate-completed-bounce' :
                      index === currentStage ? 'bg-blue-500 text-white animate-current-pulse' :
                      'bg-gray-200 text-gray-500'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {index < currentStage ? '✓' : index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Game Scene */}
        {!gameCompleted && (
          <div className="px-6 mb-8">
            <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl p-6 min-h-64 relative overflow-hidden shadow-lg">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Floating Clouds */}
                <div className="absolute top-2 left-10 text-2xl animate-float-slow">☁️</div>
                <div className="absolute top-6 right-16 text-xl animate-float-slower opacity-70">☁️</div>
                <div className="absolute top-4 left-1/3 text-lg animate-float-fast opacity-60">☁️</div>
                
                {/* Flying Birds */}
                <div className="absolute top-8 left-1/4 text-sm animate-fly-across">🕊️</div>
                <div className="absolute top-12 right-1/4 text-sm animate-fly-across-reverse">🕊️</div>
                
                {/* Static Water Droplets */}
                <div className="absolute bottom-8 left-8 text-lg animate-pulse">💧</div>
                <div className="absolute bottom-10 right-12 text-sm animate-bounce-slow">💧</div>
              </div>

              {/* Sun Rays Effect (Evaporation) */}
              {showSunRays && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Central Sun */}
                  <div className="absolute top-4 left-4 text-6xl animate-sun-glow">☀️</div>
                  
                  {/* Sun Rays */}
                  <div className="absolute top-6 left-12 w-16 h-1 bg-yellow-300 animate-ray-1 origin-left"></div>
                  <div className="absolute top-10 left-8 w-20 h-1 bg-yellow-400 animate-ray-2 origin-left"></div>
                  <div className="absolute top-14 left-16 w-12 h-1 bg-yellow-300 animate-ray-3 origin-left"></div>
                  <div className="absolute top-8 left-20 w-18 h-1 bg-yellow-400 animate-ray-4 origin-left"></div>
                  
                  {/* Heat Shimmer Lines */}
                  <div className="absolute top-16 left-8 w-1 h-8 bg-gradient-to-t from-yellow-200 to-transparent animate-shimmer-1"></div>
                  <div className="absolute top-18 left-12 w-1 h-10 bg-gradient-to-t from-yellow-300 to-transparent animate-shimmer-2"></div>
                  <div className="absolute top-14 left-16 w-1 h-6 bg-gradient-to-t from-yellow-200 to-transparent animate-shimmer-3"></div>
                </div>
              )}

              {/* Evaporation Effect */}
              {showEvaporationEffect && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Water Vapor Rising from Lake */}
                  <div className="absolute bottom-16 left-8 text-blue-300 animate-evapor-rise-1">💨</div>
                  <div className="absolute bottom-18 left-16 text-blue-200 animate-evapor-rise-2">💨</div>
                  <div className="absolute bottom-20 left-24 text-blue-300 animate-evapor-rise-3">💨</div>
                  <div className="absolute bottom-16 left-32 text-blue-200 animate-evapor-rise-4">💨</div>
                  <div className="absolute bottom-22 left-12 text-blue-300 animate-evapor-rise-5">💨</div>
                  
                  {/* Invisible Vapor Streams */}
                  <div className="absolute bottom-16 left-10 w-1 h-16 bg-gradient-to-t from-blue-200 to-transparent opacity-60 animate-vapor-stream-1"></div>
                  <div className="absolute bottom-18 left-18 w-1 h-20 bg-gradient-to-t from-blue-300 to-transparent opacity-40 animate-vapor-stream-2"></div>
                  <div className="absolute bottom-20 left-26 w-1 h-14 bg-gradient-to-t from-blue-200 to-transparent opacity-50 animate-vapor-stream-3"></div>
                </div>
              )}

              {/* Vapor Rising Effect (Condensation) */}
              {showVaporRising && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Large Vapor Clouds Rising */}
                  <div className="absolute bottom-20 left-1/4 text-3xl text-blue-300 animate-condense-rise-1">💨</div>
                  <div className="absolute bottom-24 left-1/2 text-2xl text-blue-200 animate-condense-rise-2">💨</div>
                  <div className="absolute bottom-18 right-1/3 text-3xl text-blue-300 animate-condense-rise-3">💨</div>
                  
                  {/* Cloud Formation */}
                  <div className="absolute top-8 left-1/3 text-4xl animate-cloud-form">☁️</div>
                  <div className="absolute top-12 left-1/2 text-3xl animate-cloud-form-delayed">☁️</div>
                  
                  {/* Condensation Droplets */}
                  <div className="absolute top-16 left-1/4 text-sm text-blue-500 animate-condense-drops">💧</div>
                  <div className="absolute top-18 left-1/2 text-sm text-blue-500 animate-condense-drops-delayed">💧</div>
                  <div className="absolute top-20 right-1/3 text-sm text-blue-500 animate-condense-drops">💧</div>
                </div>
              )}

              {/* Rain Falling Effect (Precipitation) */}
              {showRainFalling && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Heavy Rain Drops */}
                  <div className="absolute top-8 left-1/6 text-blue-600 animate-heavy-rain-1">💧</div>
                  <div className="absolute top-6 left-1/4 text-blue-500 animate-heavy-rain-2">💧</div>
                  <div className="absolute top-10 left-1/3 text-blue-600 animate-heavy-rain-3">💧</div>
                  <div className="absolute top-4 left-1/2 text-blue-500 animate-heavy-rain-4">💧</div>
                  <div className="absolute top-8 left-2/3 text-blue-600 animate-heavy-rain-5">💧</div>
                  <div className="absolute top-6 right-1/4 text-blue-500 animate-heavy-rain-6">💧</div>
                  <div className="absolute top-12 right-1/6 text-blue-600 animate-heavy-rain-7">💧</div>
                  
                  {/* Rain Lines */}
                  <div className="absolute top-0 left-1/5 w-0.5 h-full bg-gradient-to-b from-blue-400 to-blue-600 animate-rain-line-1 opacity-70"></div>
                  <div className="absolute top-0 left-1/3 w-0.5 h-full bg-gradient-to-b from-blue-300 to-blue-500 animate-rain-line-2 opacity-60"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-blue-400 to-blue-600 animate-rain-line-3 opacity-70"></div>
                  <div className="absolute top-0 left-2/3 w-0.5 h-full bg-gradient-to-b from-blue-300 to-blue-500 animate-rain-line-4 opacity-60"></div>
                  <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-blue-400 to-blue-600 animate-rain-line-5 opacity-70"></div>
                  
                  {/* Dark Rain Cloud */}
                  <div className="absolute top-2 left-1/3 text-5xl text-gray-600 animate-rain-cloud">☁️</div>
                  
                  {/* Water Splashes on Lake */}
                  <div className="absolute bottom-4 left-8 w-4 h-4 bg-blue-400 rounded-full animate-splash-1 opacity-80"></div>
                  <div className="absolute bottom-6 left-16 w-3 h-3 bg-blue-500 rounded-full animate-splash-2 opacity-70"></div>
                  <div className="absolute bottom-4 left-24 w-4 h-4 bg-blue-400 rounded-full animate-splash-3 opacity-80"></div>
                  <div className="absolute bottom-8 left-32 w-3 h-3 bg-blue-500 rounded-full animate-splash-4 opacity-70"></div>
                </div>
              )}

              {/* Sky Zone */}
              <div 
                className={`absolute top-0 left-0 right-0 h-32 rounded-t-2xl cursor-pointer transition-all duration-500 transform ${
                  dropZoneActive === 'sky' ? 'bg-sky-300 scale-105' : 'bg-gradient-to-b from-sky-300 to-sky-200'
                } ${draggedItem && stages[currentStage]?.id === 'condensation' ? 'animate-glow-blue' : ''}`}
                onClick={() => handleDropZoneClick('sky')}
              >
                <div className="flex justify-center items-center h-full">
                  <span className="text-2xl transition-transform duration-300 hover:scale-110">☁️ Sky</span>
                  {stages[1]?.completed && (
                    <span className="ml-2 text-2xl animate-bounce-in">✅</span>
                  )}
                </div>
              </div>

              {/* Mountain Zone */}
              <div 
                className={`absolute bottom-16 right-4 w-24 h-20 cursor-pointer transition-all duration-500 transform ${
                  dropZoneActive === 'mountain' ? 'scale-110' : 'hover:scale-105'
                } ${draggedItem && stages[currentStage]?.id === 'precipitation' ? 'animate-glow-gray' : ''}`}
                onClick={() => handleDropZoneClick('mountain')}
                style={{ 
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  backgroundColor: dropZoneActive === 'mountain' ? '#9CA3AF' : '#D1D5DB'
                }}
              >
                <div className="flex justify-center items-end h-full pb-2">
                  <span className="text-xs animate-sway">🏔️</span>
                  {stages[2]?.completed && (
                    <span className="text-xs animate-bounce-in">✅</span>
                  )}
                </div>
              </div>

              {/* Lake Zone */}
              <div 
                className={`absolute bottom-0 left-4 right-4 h-16 rounded-b-2xl cursor-pointer transition-all duration-500 transform ${
                  dropZoneActive === 'lake' ? 'bg-blue-400 scale-105' : 'bg-blue-300'
                } ${draggedItem && stages[currentStage]?.id === 'evaporation' ? 'animate-glow-blue' : ''}`}
                onClick={() => handleDropZoneClick('lake')}
              >
                <div className="flex justify-center items-center h-full">
                  <span className="text-xl transition-transform duration-300 hover:scale-110 animate-water-wave">🏊 Lake</span>
                  {stages[0]?.completed && (
                    <span className="ml-2 text-xl animate-bounce-in">✅</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drag Items */}
        {!gameCompleted && (
          <div className="px-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center animate-fade-in">Click on the Correct Zone</h3>
            <div className="flex justify-center space-x-4">
              {DRAG_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleDragStart(item)}
                  className={`p-4 rounded-xl border-3 shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-3 ${
                    draggedItem?.id === item.id 
                      ? 'border-blue-400 bg-blue-50 scale-110 animate-selected-glow' 
                      : 'border-white bg-white hover:shadow-xl animate-float-gentle'
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    transform: draggedItem?.id === item.id ? 'scale(1.1) rotate(5deg)' : ''
                  }}
                >
                  <div className={`text-4xl mb-2 transition-all duration-300 ${
                    draggedItem?.id === item.id ? 'animate-bounce' : 'hover:animate-wiggle'
                  }`}>
                    {item.emoji}
                  </div>
                  <div className="text-sm font-medium text-gray-700">{item.name}</div>
                </button>
              ))}
            </div>
            
            {draggedItem && (
              <div className="text-center mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg animate-slide-down">
                <p className="text-sm text-yellow-800 animate-pulse">
                  💡 Now tap on the correct zone to complete the {stages[currentStage]?.name.toLowerCase()} step!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Feedback Messages */}
        {showSuccess && (
          <div className="fixed bottom-4 left-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-30 animate-success-slide">
            <div className="text-center">
              <div className="text-2xl mb-1 animate-success-icon">🎉</div>
              <div className="font-bold animate-success-text">Perfect! +100 points</div>
              <div className="text-sm animate-success-detail">You completed {stages[currentStage]?.name}!</div>
            </div>
          </div>
        )}

        {showError && (
          <div className="fixed bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-30 animate-error-shake">
            <div className="text-center">
              <div className="text-2xl mb-1 animate-error-icon">🤔</div>
              <div className="font-bold">Not quite right!</div>
              <div className="text-sm">Try a different zone for this step!</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!gameCompleted && (
          <div className="px-6 pb-8">
            <div className="flex gap-4">
              <button
                onClick={() => showFact('waterCycle', stages[currentStage]?.fact || educationalFacts.waterCycle.importance)}
                className="flex-1 bg-yellow-500 text-white py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
              >
                💡 Fun Fact
              </button>
              <button
                onClick={resetGame}
                className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        )}

        {/* Educational Hint */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">
              <span className="font-medium">💡 Tip:</span> The water cycle happens in order: 
              First the Sun heats water (Evaporation), then vapor rises and cools (Condensation), 
              finally water falls back down (Precipitation)!
            </p>
            
            {/* Progress indicator */}
            <div className="mt-2 text-xs text-gray-500">
              🎯 Actions: {userActions} | Current Stage: {stages[currentStage]?.name}
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      <AISuggestionsModal />
      
      {/* Educational Fact Modal */}
      <FactModal />

      {/* CSS Animations */}
      <style>{`
        /* Basic animations */
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

        /* Floating animations for background elements */
        .animate-float-slow {
          animation: floatSlow 4s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: floatSlow 6s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: floatSlow 3s ease-in-out infinite;
        }
        
        .animate-float-gentle {
          animation: floatGentle 2s ease-in-out infinite;
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-8px) translateX(4px); }
          50% { transform: translateY(-4px) translateX(-2px); }
          75% { transform: translateY(-12px) translateX(6px); }
        }
        
        @keyframes floatGentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        /* Flying animations */
        .animate-fly-across {
          animation: flyAcross 8s linear infinite;
        }
        
        .animate-fly-across-reverse {
          animation: flyAcrossReverse 10s linear infinite;
        }
        
        @keyframes flyAcross {
          0% { transform: translateX(-100px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(400px); opacity: 0; }
        }
        
        @keyframes flyAcrossReverse {
          0% { transform: translateX(400px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-100px); opacity: 0; }
        }

        /* Pulse variations */
        .animate-pulse-slow {
          animation: pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-fast {
          animation: pulseFast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes pulseFast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Bounce variations */
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out;
        }
        
        @keyframes bounceSlow {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0, -15px, 0); }
          70% { transform: translate3d(0, -7px, 0); }
          90% { transform: translate3d(0, -2px, 0); }
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Stage-specific animations */
        .animate-rise-up {
          animation: riseUp 3s ease-out infinite;
        }
        
        .animate-rise-up-slow {
          animation: riseUp 4s ease-out infinite;
        }
        
        .animate-rise-up-fast {
          animation: riseUp 2s ease-out infinite;
        }
        
        @keyframes riseUp {
          0% { transform: translateY(0px); opacity: 0.8; }
          50% { opacity: 1; }
          100% { transform: translateY(-60px); opacity: 0; }
        }

        .animate-fall-down {
          animation: fallDown 2s ease-in infinite;
        }
        
        .animate-fall-down-slow {
          animation: fallDown 3s ease-in infinite;
        }
        
        .animate-fall-down-fast {
          animation: fallDown 1.5s ease-in infinite;
        }
        
        @keyframes fallDown {
          0% { transform: translateY(-20px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(80px); opacity: 0.3; }
        }

        /* Zone glow effects */
        .animate-glow-blue {
          animation: glowBlue 2s ease-in-out infinite;
        }
        
        .animate-glow-gray {
          animation: glowGray 2s ease-in-out infinite;
        }
        
        @keyframes glowBlue {
          0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes glowGray {
          0%, 100% { box-shadow: 0 0 10px rgba(156, 163, 175, 0.5); }
          50% { box-shadow: 0 0 20px rgba(156, 163, 175, 0.8), 0 0 30px rgba(156, 163, 175, 0.6); }
        }

        /* Selected item animations */
        .animate-selected-glow {
          animation: selectedGlow 1.5s ease-in-out infinite;
        }
        
        @keyframes selectedGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
          50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.9), 0 0 35px rgba(59, 130, 246, 0.7); }
        }

        /* Wiggle animation */
        .animate-wiggle {
          animation: wiggle 0.8s ease-in-out;
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg) scale(1.05); }
          75% { transform: rotate(3deg) scale(1.05); }
        }

        /* Water wave animation */
        .animate-water-wave {
          animation: waterWave 2s ease-in-out infinite;
        }
        
        @keyframes waterWave {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(1deg); }
          75% { transform: scale(1.05) rotate(-1deg); }
        }

        /* Sway animation for mountain */
        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }

        /* Stage completion animations */
        .animate-celebration-burst {
          animation: celebrationBurst 1s ease-out;
        }
        
        @keyframes celebrationBurst {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }

        /* Completion screen animations */
        .animate-celebration-entry {
          animation: celebrationEntry 0.8s ease-out;
        }
        
        .animate-title-pop {
          animation: titlePop 0.6s ease-out 0.2s both;
        }
        
        .animate-fade-in-delayed {
          animation: fadeIn 0.8s ease-out 0.4s both;
        }
        
        .animate-cycle-flow {
          animation: cycleFlow 2s ease-in-out 0.6s both;
        }
        
        .animate-fade-in-slow {
          animation: fadeIn 1s ease-out 0.8s both;
        }
        
        .animate-button-bounce {
          animation: buttonBounce 0.6s ease-out 1s both;
        }
        
        @keyframes celebrationEntry {
          0% { transform: scale(0.5) translateY(50px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        @keyframes titlePop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes cycleFlow {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes buttonBounce {
          0% { transform: scale(0.9) translateY(10px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* Stage instruction animations */
        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
        
        .animate-stage-icon {
          animation: stageIcon 0.8s ease-out 0.1s both;
        }
        
        .animate-title-appear {
          animation: titleAppear 0.6s ease-out 0.3s both;
        }
        
        .animate-description-fade {
          animation: fadeIn 0.8s ease-out 0.5s both;
        }
        
        @keyframes slideIn {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes stageIcon {
          0% { transform: scale(0.5) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes titleAppear {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* Progress indicator animations */
        .animate-completed-bounce {
          animation: completedBounce 0.6s ease-out;
        }
        
        .animate-current-pulse {
          animation: currentPulse 2s ease-in-out infinite;
        }
        
        @keyframes completedBounce {
          0% { transform: scale(0.8); background-color: #6B7280; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); background-color: #10B981; }
        }
        
        @keyframes currentPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }

        /* Feedback message animations */
        .animate-success-slide {
          animation: successSlide 0.5s ease-out;
        }
        
        .animate-success-icon {
          animation: successIcon 0.8s ease-out 0.1s both;
        }
        
        .animate-success-text {
          animation: fadeIn 0.6s ease-out 0.3s both;
        }
        
        .animate-success-detail {
          animation: fadeIn 0.8s ease-out 0.5s both;
        }
        
        .animate-error-shake {
          animation: errorShake 0.6s ease-out;
        }
        
        .animate-error-icon {
          animation: errorIcon 0.5s ease-out;
        }
        
        @keyframes successSlide {
          0% { transform: translateY(100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes successIcon {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.3) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes errorIcon {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }

        /* Instruction animations */
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slide-down {
          animation: slideDown 0.5s ease-out;
        }
        
        @keyframes slideDown {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* Realistic Water Cycle Effect Animations */
        
        /* Sun and Evaporation Effects */
        .animate-sun-glow {
          animation: sunGlow 2s ease-in-out infinite;
        }
        
        @keyframes sunGlow {
          0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
          50% { transform: scale(1.1) rotate(180deg); filter: brightness(1.3) drop-shadow(0 0 20px #FCD34D); }
        }
        
        .animate-ray-1 { animation: sunRay 1.5s ease-out; }
        .animate-ray-2 { animation: sunRay 1.8s ease-out 0.2s; }
        .animate-ray-3 { animation: sunRay 1.6s ease-out 0.4s; }
        .animate-ray-4 { animation: sunRay 1.7s ease-out 0.6s; }
        
        @keyframes sunRay {
          0% { transform: scaleX(0) rotate(0deg); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: scaleX(1) rotate(15deg); opacity: 0.8; }
        }
        
        .animate-shimmer-1 { animation: heatShimmer 1s ease-in-out infinite; }
        .animate-shimmer-2 { animation: heatShimmer 1.2s ease-in-out infinite 0.3s; }
        .animate-shimmer-3 { animation: heatShimmer 0.8s ease-in-out infinite 0.6s; }
        
        @keyframes heatShimmer {
          0%, 100% { transform: scaleY(1) translateX(0px); opacity: 0.6; }
          25% { transform: scaleY(1.3) translateX(2px); opacity: 0.8; }
          75% { transform: scaleY(0.7) translateX(-2px); opacity: 0.4; }
        }
        
        .animate-evapor-rise-1 { animation: evaporRise 3s ease-out; }
        .animate-evapor-rise-2 { animation: evaporRise 3.2s ease-out 0.3s; }
        .animate-evapor-rise-3 { animation: evaporRise 2.8s ease-out 0.6s; }
        .animate-evapor-rise-4 { animation: evaporRise 3.1s ease-out 0.9s; }
        .animate-evapor-rise-5 { animation: evaporRise 2.9s ease-out 1.2s; }
        
        @keyframes evaporRise {
          0% { transform: translateY(0px) scale(0.8); opacity: 0; }
          20% { opacity: 0.8; }
          60% { transform: translateY(-40px) scale(1.2); opacity: 0.6; }
          100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
        }
        
        .animate-vapor-stream-1 { animation: vaporStream 3s ease-out; }
        .animate-vapor-stream-2 { animation: vaporStream 3.5s ease-out 0.5s; }
        .animate-vapor-stream-3 { animation: vaporStream 2.8s ease-out 1s; }
        
        @keyframes vaporStream {
          0% { transform: scaleY(0); opacity: 0; }
          30% { transform: scaleY(0.5); opacity: 0.6; }
          70% { transform: scaleY(1); opacity: 0.4; }
          100% { transform: scaleY(0.3); opacity: 0; }
        }
        
        /* Condensation Effects */
        .animate-condense-rise-1 { animation: condenseRise 2.5s ease-out; }
        .animate-condense-rise-2 { animation: condenseRise 2.8s ease-out 0.4s; }
        .animate-condense-rise-3 { animation: condenseRise 2.3s ease-out 0.8s; }
        
        @keyframes condenseRise {
          0% { transform: translateY(0px) scale(1); opacity: 0.8; }
          50% { transform: translateY(-60px) scale(1.3); opacity: 0.6; }
          100% { transform: translateY(-120px) scale(0.5); opacity: 0; }
        }
        
        .animate-cloud-form { animation: cloudForm 2s ease-out 1s both; }
        .animate-cloud-form-delayed { animation: cloudForm 2s ease-out 1.5s both; }
        
        @keyframes cloudForm {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-condense-drops { animation: condenseDrop 1.5s ease-in infinite; }
        .animate-condense-drops-delayed { animation: condenseDrop 1.5s ease-in infinite 0.5s; }
        
        @keyframes condenseDrop {
          0% { transform: translateY(-10px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        
        /* Precipitation Effects */
        .animate-heavy-rain-1 { animation: heavyRain 1s ease-in infinite; }
        .animate-heavy-rain-2 { animation: heavyRain 0.8s ease-in infinite 0.1s; }
        .animate-heavy-rain-3 { animation: heavyRain 1.2s ease-in infinite 0.2s; }
        .animate-heavy-rain-4 { animation: heavyRain 0.9s ease-in infinite 0.3s; }
        .animate-heavy-rain-5 { animation: heavyRain 1.1s ease-in infinite 0.4s; }
        .animate-heavy-rain-6 { animation: heavyRain 0.7s ease-in infinite 0.5s; }
        .animate-heavy-rain-7 { animation: heavyRain 1.3s ease-in infinite 0.6s; }
        
        @keyframes heavyRain {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0.8; }
        }
        
        .animate-rain-line-1 { animation: rainLine 1.5s ease-in infinite; }
        .animate-rain-line-2 { animation: rainLine 1.3s ease-in infinite 0.2s; }
        .animate-rain-line-3 { animation: rainLine 1.7s ease-in infinite 0.4s; }
        .animate-rain-line-4 { animation: rainLine 1.4s ease-in infinite 0.6s; }
        .animate-rain-line-5 { animation: rainLine 1.6s ease-in infinite 0.8s; }
        
        @keyframes rainLine {
          0% { transform: translateY(-100%) scaleY(0); opacity: 0; }
          20% { transform: translateY(-50%) scaleY(0.5); opacity: 0.7; }
          60% { transform: translateY(0%) scaleY(1); opacity: 1; }
          100% { transform: translateY(50%) scaleY(0.8); opacity: 0; }
        }
        
        .animate-rain-cloud { animation: rainCloud 2s ease-in-out infinite; }
        
        @keyframes rainCloud {
          0%, 100% { transform: scale(1); filter: brightness(0.7); }
          50% { transform: scale(1.05); filter: brightness(0.5) drop-shadow(0 0 10px #374151); }
        }
        
        .animate-splash-1 { animation: splash 0.8s ease-out infinite; }
        .animate-splash-2 { animation: splash 0.6s ease-out infinite 0.2s; }
        .animate-splash-3 { animation: splash 0.9s ease-out infinite 0.4s; }
        .animate-splash-4 { animation: splash 0.7s ease-out infinite 0.6s; }
        
        @keyframes splash {
          0% { transform: scale(0); opacity: 0; }
          30% { transform: scale(1.2); opacity: 1; }
          60% { transform: scale(1.5); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
