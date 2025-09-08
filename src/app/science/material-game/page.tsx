'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

// Types
interface Material {
  id: string;
  name: string;
  emoji: string;
  properties: string[];
  realWorldFact: string;
  scientificFact: string;
  usageFact: string;
  color: string;
}

interface PropertyBin {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

// Game data
const MATERIALS: Material[] = [
  {
    id: 'glass-window',
    name: 'Glass Window',
    emoji: '🪟',
    properties: ['transparent', 'hard', 'lustrous'],
    realWorldFact: 'Glass is made by melting sand at extremely high temperatures (around 1700°C)! Ancient Egyptians made the first glass beads over 4000 years ago.',
    scientificFact: 'Glass is actually a liquid that flows very slowly! Old cathedral windows are thicker at the bottom because glass flows downward over centuries.',
    usageFact: 'Modern skyscrapers use special glass that can reflect heat while letting light through, helping save energy for air conditioning.',
    color: '#E6F3FF'
  },
  {
    id: 'wooden-door',
    name: 'Wooden Door',
    emoji: '🚪',
    properties: ['opaque', 'hard'],
    realWorldFact: 'Wood is one of the oldest building materials! The oldest wooden buildings in Japan are over 1300 years old and still standing strong.',
    scientificFact: 'Wood is actually made of tiny tubes that carried water when the tree was alive. That\'s why wood grain goes in one direction!',
    usageFact: 'Different woods have different strengths - bamboo is stronger than steel in some directions, while balsa wood is so light it floats on water.',
    color: '#D4A574'
  },
  {
    id: 'steel-spoon',
    name: 'Steel Spoon',
    emoji: '🥄',
    properties: ['opaque', 'lustrous', 'hard'],
    realWorldFact: 'Steel is made by adding carbon to iron. Just 1% carbon can make iron 10 times stronger! That\'s why steel is used in buildings and bridges.',
    scientificFact: 'Steel can be recycled infinitely without losing its properties. A steel can might become a car part, then a building beam, then a spoon!',
    usageFact: 'Stainless steel doesn\'t rust because it contains chromium, which forms an invisible protective layer when exposed to oxygen.',
    color: '#C0C0C0'
  },
  {
    id: 'plastic-bottle',
    name: 'Plastic Bottle',
    emoji: '🍼',
    properties: ['transparent', 'flexible'],
    realWorldFact: 'Plastic was invented by accident in 1907! A scientist was trying to make a substitute for shellac and created the first synthetic plastic instead.',
    scientificFact: 'Plastics are made of long chains of molecules called polymers. The word "polymer" means "many parts" in Greek.',
    usageFact: 'One plastic bottle can be recycled into 10 new bottles, or turned into clothing, carpets, or even park benches!',
    color: '#E8F5E8'
  },
  {
    id: 'rubber-ball',
    name: 'Rubber Ball',
    emoji: '⚽',
    properties: ['opaque', 'flexible'],
    realWorldFact: 'Natural rubber comes from rubber trees! Indigenous people in South America have been using rubber for over 3000 years.',
    scientificFact: 'Rubber molecules are like tiny springs that can stretch and bounce back. That\'s why rubber balls bounce so well!',
    usageFact: 'Car tires are made of rubber mixed with carbon black (soot) to make them stronger and last longer on roads.',
    color: '#2D2D2D'
  },
  {
    id: 'aluminum-foil',
    name: 'Aluminum Foil',
    emoji: '📄',
    properties: ['opaque', 'lustrous', 'flexible'],
    realWorldFact: 'Aluminum was once more valuable than gold! Napoleon III served his most honored guests with aluminum cutlery while others got gold!',
    scientificFact: 'Aluminum is the most abundant metal in Earth\'s crust, but it\'s always combined with other elements and needs lots of electricity to extract.',
    usageFact: 'Aluminum foil reflects heat and light, which is why it\'s used in space suits and keeps food warm or cool.',
    color: '#E8E8E8'
  }
];

const PROPERTY_BINS: PropertyBin[] = [
  {
    id: 'transparent',
    name: 'Transparent',
    emoji: '👀',
    description: 'You can see through it clearly',
    color: '#DBEAFE'
  },
  {
    id: 'opaque',
    name: 'Opaque',
    emoji: '🚫',
    description: 'You cannot see through it',
    color: '#FEE2E2'
  },
  {
    id: 'lustrous',
    name: 'Lustrous',
    emoji: '✨',
    description: 'Shiny and reflective',
    color: '#FEF3C7'
  },
  {
    id: 'hard',
    name: 'Hard',
    emoji: '🔨',
    description: 'Difficult to scratch or dent',
    color: '#F3E8FF'
  },
  {
    id: 'flexible',
    name: 'Flexible',
    emoji: '🤸',
    description: 'Can bend without breaking',
    color: '#ECFDF5'
  }
];

// Educational facts database
const educationalFacts = {
  properties: {
    transparent: "Transparency happens when light passes through a material without being absorbed or scattered. Glass, water, and clear plastics are transparent.",
    opaque: "Opaque materials absorb or reflect light instead of letting it pass through. Wood, metal, and most rocks are opaque.",
    lustrous: "Luster is the way light reflects off a surface. Metals are lustrous because their electrons can move freely and reflect light.",
    hard: "Hardness is measured on the Mohs scale from 1-10. Diamond is the hardest natural material at 10, while talc is the softest at 1.",
    flexible: "Flexibility comes from the molecular structure. Materials with long, chain-like molecules (like rubber) tend to be more flexible."
  },
  science: {
    atoms: "All materials are made of tiny particles called atoms. Different arrangements of atoms give materials their unique properties.",
    molecules: "When atoms join together, they form molecules. The shape and size of molecules determine how the material behaves.",
    crystals: "Some materials form crystals where atoms are arranged in perfect, repeating patterns. This makes them strong and sometimes shiny.",
    polymers: "Many modern materials are polymers - long chains of repeating molecules. Plastics, rubber, and even DNA are polymers!"
  },
  realWorld: {
    construction: "Engineers choose materials based on their properties. Steel for strength, concrete for foundations, glass for windows.",
    recycling: "Understanding material properties helps us recycle better. Metals can be melted and reused, while some plastics can be reformed.",
    innovation: "Scientists create new materials by changing atomic structures. Carbon fiber is stronger than steel but lighter than aluminum!",
    nature: "Nature created amazing materials first - spider silk is stronger than steel, and bird bones are hollow but incredibly strong."
  }
};

export default function MaterialMixUpGame() {
  // Game state
  const [currentMaterial, setCurrentMaterial] = useState<Material>(MATERIALS[0]);
  const [materialIndex, setMaterialIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedBin, setSelectedBin] = useState<string>('');
  const [clickedBins, setClickedBins] = useState<{[key: string]: 'correct' | 'incorrect'}>({});
  const [completedMaterials, setCompletedMaterials] = useState<string[]>([]);
  
  // Enhanced interaction states
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showFactModal, setShowFactModal] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [factCategory, setFactCategory] = useState('');
  const [userActions, setUserActions] = useState(0);
  const [correctStreaks, setCorrectStreaks] = useState(0);
  
  // Drag and drop refs
  const dragRef = useRef<HTMLDivElement>(null);

  // Handle property bin selection
  const handleBinClick = (binId: string) => {
    // Don't allow clicking if this bin has already been clicked
    if (clickedBins[binId]) return;
    
    setSelectedBin(binId);
    setUserActions(prev => prev + 1);
    
    const correct = currentMaterial.properties.includes(binId);
    
    // Mark this bin as clicked with its result
    setClickedBins(prev => ({
      ...prev,
      [binId]: correct ? 'correct' : 'incorrect'
    }));
    
    if (correct) {
      setScore(prev => prev + 10);
      setCorrectStreaks(prev => prev + 1);
      setShowSuccess(true);
      
      // Add to completed if all properties found
      if (!completedMaterials.includes(currentMaterial.id)) {
        setCompletedMaterials(prev => [...prev, currentMaterial.id]);
      }
    } else {
      setCorrectStreaks(0);
      setShowError(true);
    }
    
    // Auto-hide feedback after 2 seconds but keep the bin marked
    setTimeout(() => {
      setShowSuccess(false);
      setShowError(false);
    }, 2000);
  };

  // Get AI suggestions based on current context
  const getAISuggestions = () => {
    const suggestions = [];
    const material = currentMaterial;
    
    // Context-based suggestions
    if (material.properties.includes('transparent')) {
      suggestions.push(`🔍 Try: Look through the ${material.name} - what do you see?`);
      suggestions.push('🌟 Explore: Find other transparent objects around you!');
    }
    
    if (material.properties.includes('lustrous')) {
      suggestions.push(`✨ Try: Shine a light on the ${material.name} and see the reflection!`);
      suggestions.push('🪞 Explore: Compare how different metals reflect light differently!');
    }
    
    if (material.properties.includes('flexible')) {
      suggestions.push(`🤸 Try: Gently bend the ${material.name} (if safe) to test flexibility!`);
      suggestions.push('🔄 Explore: What happens when you stretch different materials?');
    }
    
    // Progress-based suggestions
    if (correctStreaks >= 3) {
      suggestions.push('🏆 Challenge: Can you guess ALL properties before checking?');
      suggestions.push('🧪 Experiment: Test materials at home with parent supervision!');
    }
    
    if (userActions > 5) {
      suggestions.push('📚 Learn: Discover how these materials are made!');
      suggestions.push('♻️ Think: How can we recycle these materials?');
    }
    
    // Default suggestions
    suggestions.push('🔬 Investigate: What makes this material special?');
    suggestions.push('🏗️ Discover: Where else do we use this material?');
    
    return suggestions.slice(0, 4);
  };

  // Next material function
  const nextMaterial = () => {
    const nextIndex = (materialIndex + 1) % MATERIALS.length;
    setMaterialIndex(nextIndex);
    setCurrentMaterial(MATERIALS[nextIndex]);
    setSelectedBin('');
    setClickedBins({}); // Reset clicked bins for new material
    
    // Don't show AI suggestions when user clicks next material
    // Just move to the next material without suggestions
  };

  // Show fact modal with specific content
  const showFact = (category: string, content: string) => {
    setFactCategory(category);
    setCurrentFact(content);
    setShowFactModal(true);
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
            <p className="text-sm text-gray-600">Ready to explore materials further?</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {getAISuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setShowAISuggestions(false);
                  // Auto-trigger fact based on suggestion
                  if (suggestion.includes('made')) {
                    showFact('science', currentMaterial.scientificFact);
                  } else if (suggestion.includes('recycle')) {
                    showFact('realWorld', educationalFacts.realWorld.recycling);
                  } else if (suggestion.includes('special')) {
                    showFact('material', currentMaterial.realWorldFact);
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
              onClick={() => showFact('material', currentMaterial.realWorldFact)}
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm shadow-md"
            >
              📚 Material Facts
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
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-scale-in border border-gray-200 ring-1 ring-gray-300">
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
                { label: '🔬 Science', content: currentMaterial.scientificFact },
                { label: '🏗️ Usage', content: currentMaterial.usageFact },
                { label: '🌍 Real World', content: currentMaterial.realWorldFact },
                { label: '⚛️ Atoms', content: educationalFacts.science.atoms }
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 font-sans">
        {/* Main Game Content */}
        <div className={`${showAISuggestions || showFactModal ? 'filter blur-sm' : ''}`}>
          {/* Header */}
          <div className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <Link href="https://eklavyaa.vercel.app/chapters/science-world" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-2xl">
              ←
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Material Mix-Up 🔬</h1>
            <div className="p-2"></div>
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
                <span className="text-gray-600">🔥 Streak:</span>
                <div className="bg-white rounded-full px-2 py-1 text-orange-600 font-medium">
                  {correctStreaks}
                </div>
              </div>
            </div>
            
            {/* Progress Visual */}
            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${(completedMaterials.length / MATERIALS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Material Display */}
        <div className="p-6 text-center">
          <div 
            ref={dragRef}
            className="inline-block p-8 rounded-2xl shadow-soft mb-4 transition-all hover:scale-105 cursor-pointer"
            style={{ backgroundColor: currentMaterial.color }}
          >
            <div className="text-8xl mb-4">{currentMaterial.emoji}</div>
            <div className="bg-white rounded-lg p-4 shadow-sm max-w-xs">
              <div className="text-lg font-bold text-gray-700 mb-2">
                {currentMaterial.name}
              </div>
              <p className="text-gray-600 text-sm">Click on the correct property!</p>
            </div>
          </div>
        </div>

        {/* Property Bins */}
        <div className="px-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Material Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            {PROPERTY_BINS.map((bin) => {
              const isClicked = clickedBins[bin.id];
              const isDisabled = !!isClicked;
              
              return (
                <button
                  key={bin.id}
                  onClick={() => handleBinClick(bin.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl border-3 shadow-soft transition-all ${
                    !isDisabled ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-90'
                  } ${
                    isClicked === 'correct'
                      ? 'border-green-400 bg-green-50'
                      : isClicked === 'incorrect'
                      ? 'border-red-400 bg-red-50'
                      : 'border-white'
                  }`}
                  style={{ backgroundColor: bin.color }}
                >
                  <div className="text-4xl mb-2">{bin.emoji}</div>
                  <div className="text-lg font-bold text-gray-700 mb-1">{bin.name}</div>
                  <div className="text-sm text-gray-600">{bin.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Messages */}
        {showSuccess && (
          <div className="fixed bottom-4 left-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-30">
            <div className="text-center">
              <div className="text-2xl mb-1">🎉</div>
              <div className="font-bold">Correct! +10 points</div>
              <div className="text-sm">Great job identifying the property!</div>
            </div>
          </div>
        )}

        {showError && (
          <div className="fixed bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-30">
            <div className="text-center">
              <div className="text-2xl mb-1">🤔</div>
              <div className="font-bold">Not quite right!</div>
              <div className="text-sm">Try another property - you can do it!</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 pb-8">
          <div className="flex gap-4">
            <button
              onClick={() => showFact('material', currentMaterial.realWorldFact)}
              className="flex-1 bg-yellow-500 text-white py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-soft"
            >
              💡 Fun Fact
            </button>
            <button
              onClick={nextMaterial}
              className="flex-1 bg-gradient-to-r from-mint to-green-300 text-gray-800 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-soft"
            >
              Next Material ➡️
            </button>
          </div>
        </div>

        {/* Educational Hint */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">
              <span className="font-medium">💡 Tip:</span> Think about how you use this material in real life. 
              Can you see through it? Is it shiny? Can you bend it? These clues help identify properties!
            </p>
            
            {/* Progress indicator */}
            <div className="mt-2 text-xs text-gray-500">
              🎯 Actions: {userActions} | Materials completed: {completedMaterials.length}/{MATERIALS.length}
            </div>
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
      `}</style>
    </>
  );
}
