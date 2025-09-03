'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Types
interface Ingredient {
  id: string;
  name: string;
  type: 'meat' | 'plants' | 'insects';
  emoji: string;
  color: string;
}

interface Animal {
  id: string;
  name: string;
  emoji: string;
  dietType: 'Carnivorous' | 'Herbivorous' | 'Omnivorous';
  need: string;
  preferredTypes: string[];
  color: string;
}

// Game data
const INGREDIENTS: Ingredient[] = [
  { id: 'meat', name: 'Meat', type: 'meat', emoji: '🥩', color: '#E8B4B8' },
  { id: 'fish', name: 'Fish', type: 'meat', emoji: '🐟', color: '#E8B4B8' },
  { id: 'chicken', name: 'Chicken', type: 'meat', emoji: '🍗', color: '#E8B4B8' },
  { id: 'worms', name: 'Worms', type: 'insects', emoji: '�', color: '#D4A8E8' },
  { id: 'insects', name: 'Insects', type: 'insects', emoji: '🐛', color: '#D4A8E8' },
  { id: 'grass', name: 'Grass', type: 'plants', emoji: '�', color: '#A8D5A8' },
  { id: 'leaves', name: 'Leaves', type: 'plants', emoji: '🍃', color: '#A8D5A8' },
  { id: 'fruits', name: 'Fruits', type: 'plants', emoji: '🍎', color: '#A8D5A8' },
  { id: 'seeds', name: 'Seeds', type: 'plants', emoji: '🌰', color: '#A8D5A8' },
  { id: 'carrots', name: 'Carrots', type: 'plants', emoji: '🥕', color: '#A8D5A8' },
  { id: 'corn', name: 'Corn', type: 'plants', emoji: '🌽', color: '#A8D5A8' },
  { id: 'berries', name: 'Berries', type: 'plants', emoji: '🫐', color: '#A8D5A8' },
];

const ANIMALS: Animal[] = [
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    dietType: 'Carnivorous',
    need: 'I only eat meat to stay strong!',
    preferredTypes: ['meat'],
    color: '#F4D03F'
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    emoji: '🐇',
    dietType: 'Herbivorous',
    need: 'I only eat plants and vegetables!',
    preferredTypes: ['plants'],
    color: '#E8B4CB'
  },
  {
    id: 'bear',
    name: 'Bear',
    emoji: '🐻',
    dietType: 'Omnivorous',
    need: 'I eat both plants and meat!',
    preferredTypes: ['meat', 'plants'],
    color: '#D2B48C'
  },
  {
    id: 'eagle',
    name: 'Eagle',
    emoji: '🦅',
    dietType: 'Carnivorous',
    need: 'I hunt for meat and fish!',
    preferredTypes: ['meat'],
    color: '#8B4513'
  },
  {
    id: 'cow',
    name: 'Cow',
    emoji: '🐄',
    dietType: 'Herbivorous',
    need: 'I love eating grass and plants!',
    preferredTypes: ['plants'],
    color: '#FFB6C1'
  },
  {
    id: 'pig',
    name: 'Pig',
    emoji: '🐷',
    dietType: 'Omnivorous',
    need: 'I enjoy both plants and other foods!',
    preferredTypes: ['meat', 'plants'],
    color: '#F0A0A0'
  }
];

// Confetti component
const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  const confettiColors = ['#A8D5A8', '#F4C2A1', '#E8B4B8', '#D4A8E8', '#B8D4E3'];
  const pieces = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-sm confetti-piece"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

// Success Modal component
const SuccessModal: React.FC<{ show: boolean; onNext: () => void; isCorrect: boolean }> = ({ show, onNext, isCorrect }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <div className="bg-white rounded-xl p-8 text-center shadow-soft transform success-modal">
        <div className="text-6xl mb-4 animate-bounce-gentle">
          {isCorrect ? '😊' : '😅'}
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {isCorrect ? 'Congratulations!' : 'Good try!'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isCorrect ? 'You fed the animal correctly!' : 'But try again with different food!'}
        </p>
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-peach to-gold text-gray-800 px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform shadow-soft"
        >
          {isCorrect ? 'Next Animal' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};

// Main game component
export default function EnergyChefGame() {
  const [currentAnimal, setCurrentAnimal] = useState<Animal>(ANIMALS[0]);
  const [cookingPot, setCookingPot] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animalIndex, setAnimalIndex] = useState(0);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);

  const playSound = (type: string) => {
    // Simple sound feedback - you can implement Web Audio API later
    console.log(`🎵 Playing ${type} sound`);
  };

  const addToPot = (ingredientId: string) => {
    if (!cookingPot.includes(ingredientId) && cookingPot.length < 2) {
      setCookingPot([...cookingPot, ingredientId]);
      playSound('drop');
    }
  };

  const removeFromPot = (ingredientId: string) => {
    setCookingPot(cookingPot.filter(id => id !== ingredientId));
    playSound('remove');
  };

  const checkFoodCorrectness = (selectedFoods: string[]): boolean => {
    if (selectedFoods.length === 0) return false;
    
    const selectedIngredients = selectedFoods.map(id => 
      INGREDIENTS.find(ingredient => ingredient.id === id)
    ).filter(Boolean);

    // Check if all selected foods match the animal's diet
    return selectedIngredients.every(ingredient => {
      if (!ingredient) return false;
      return currentAnimal.preferredTypes.includes(ingredient.type);
    });
  };

  const cookMeal = () => {
    if (cookingPot.length === 0) return;

    setIsAnimating(true);
    playSound('cooking');

    // Simulate cooking time
    setTimeout(() => {
      setIsAnimating(false);
      const isCorrect = checkFoodCorrectness(cookingPot);
      setFeedbackCorrect(isCorrect);
      
      if (isCorrect) {
        setShowConfetti(true);
        playSound('success');
        // Auto-hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        playSound('error');
      }
      
      setShowSuccess(true);
    }, 2000);
  };

  const nextAnimal = () => {
    setShowSuccess(false);
    setCookingPot([]);
    
    if (feedbackCorrect) {
      // Move to next animal only if the answer was correct
      const nextIndex = (animalIndex + 1) % ANIMALS.length;
      setAnimalIndex(nextIndex);
      setCurrentAnimal(ANIMALS[nextIndex]);
    }
    // If incorrect, stay with the same animal for retry
  };

  const resetPot = () => {
    setCookingPot([]);
    playSound('reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/science" className="p-2 rounded-lg hover:bg-beige transition-colors text-2xl">
          ←
        </Link>
        <h1 className="text-xl font-semibold text-gray-800">Energy Chef 🧑‍🍳</h1>
        <button className="p-2 rounded-lg hover:bg-beige transition-colors text-xl">
          ⚙️
        </button>
      </div>

      {/* Animal Section */}
      <div className="p-6 text-center">
        <div 
          className="inline-block p-6 rounded-2xl shadow-soft mb-4 transition-all hover:scale-105"
          style={{ backgroundColor: currentAnimal.color }}
        >
          <div className="text-6xl mb-2">{currentAnimal.emoji}</div>
          <div className="bg-white rounded-lg p-4 shadow-sm max-w-xs">
            <div className="text-sm font-bold text-gray-700 mb-2">
              {currentAnimal.name} - {currentAnimal.dietType}
            </div>
            <p className="text-gray-800 font-medium text-sm">&ldquo;{currentAnimal.need}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Cooking Pot */}
      <div className="px-6 mb-8">
        <div className={`bg-white rounded-2xl p-8 text-center shadow-lift min-h-32 border-4 border-dashed border-taupe transition-all cooking-pot ${isAnimating ? 'cooking' : ''}`}>
          <div className="text-4xl mb-4">🍲</div>
          {isAnimating && (
            <div className="text-sm text-gray-600 mb-2 animate-pulse">Preparing the food...</div>
          )}
          {cookingPot.length === 0 ? (
            <p className="text-gray-500">Tap food items to feed the animal (max 2 items)</p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {cookingPot.map((ingredientId) => {
                const ingredient = INGREDIENTS.find(i => i.id === ingredientId);
                return (
                  <button
                    key={ingredientId}
                    onClick={() => removeFromPot(ingredientId)}
                    className="text-2xl p-2 rounded-lg hover:scale-110 transition-transform border-2 border-white shadow-sm"
                    style={{ backgroundColor: ingredient?.color }}
                    title={`Remove ${ingredient?.name}`}
                  >
                    {ingredient?.emoji}
                  </button>
                );
              })}
            </div>
          )}
          {cookingPot.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {cookingPot.length}/2 items selected
            </p>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div className="px-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Choose Food Items</h3>
        <div className="grid grid-cols-4 gap-3">
          {INGREDIENTS.map((ingredient) => (
            <button
              key={ingredient.id}
              onClick={() => addToPot(ingredient.id)}
              className="ingredient-button w-full aspect-square rounded-xl border-3 border-white shadow-soft text-3xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all"
              style={{ backgroundColor: ingredient.color }}
              disabled={cookingPot.includes(ingredient.id) || cookingPot.length >= 2}
            >
              <div className="text-2xl mb-1">{ingredient.emoji}</div>
              <div className="text-xs text-gray-700 font-medium">{ingredient.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8">
        <div className="flex gap-4">
          <button
            onClick={resetPot}
            className="flex-1 bg-taupe text-gray-700 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-soft"
            disabled={isAnimating}
          >
            Reset
          </button>
          <button
            onClick={cookMeal}
            disabled={cookingPot.length === 0 || isAnimating}
            className="flex-1 bg-gradient-to-r from-mint to-green-300 text-gray-800 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isAnimating ? 'Feeding...' : 'Feed Animal �️'}
          </button>
        </div>
      </div>

      {/* Educational Hint */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-gold">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Tip:</span> The {currentAnimal.name.toLowerCase()} is {currentAnimal.dietType.toLowerCase()}! 
            {currentAnimal.dietType === 'Carnivorous' && ' It only eats meat.'}
            {currentAnimal.dietType === 'Herbivorous' && ' It only eats plants.'}
            {currentAnimal.dietType === 'Omnivorous' && ' It eats both plants and meat.'}
          </p>
        </div>
      </div>

      {/* Confetti */}
      <Confetti show={showConfetti} />

      {/* Success Modal */}
      <SuccessModal show={showSuccess} onNext={nextAnimal} isCorrect={feedbackCorrect} />
    </div>
  );
}
