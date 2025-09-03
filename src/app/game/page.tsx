'use client';

import React, { useState } from 'react';

// Types
interface Ingredient {
  id: string;
  name: string;
  type: 'protein' | 'carbs' | 'fats' | 'vitamins';
  emoji: string;
  color: string;
}

interface Customer {
  id: string;
  name: string;
  emoji: string;
  need: string;
  preferredTypes: string[];
  color: string;
}

// Game data
const INGREDIENTS: Ingredient[] = [
  { id: 'meat', name: 'Meat', type: 'protein', emoji: '🥩', color: '#E8B4B8' },
  { id: 'fish', name: 'Fish', type: 'protein', emoji: '🐟', color: '#E8B4B8' },
  { id: 'eggs', name: 'Eggs', type: 'protein', emoji: '🥚', color: '#E8B4B8' },
  { id: 'beans', name: 'Beans', type: 'protein', emoji: '🫘', color: '#E8B4B8' },
  { id: 'bread', name: 'Bread', type: 'carbs', emoji: '🍞', color: '#F4C2A1' },
  { id: 'rice', name: 'Rice', type: 'carbs', emoji: '🍚', color: '#F4C2A1' },
  { id: 'potato', name: 'Potato', type: 'carbs', emoji: '🥔', color: '#F4C2A1' },
  { id: 'avocado', name: 'Avocado', type: 'fats', emoji: '🥑', color: '#A8D5A8' },
  { id: 'nuts', name: 'Nuts', type: 'fats', emoji: '🥜', color: '#A8D5A8' },
  { id: 'apple', name: 'Apple', type: 'vitamins', emoji: '🍎', color: '#D4A8E8' },
  { id: 'carrot', name: 'Carrot', type: 'vitamins', emoji: '🥕', color: '#D4A8E8' },
  { id: 'orange', name: 'Orange', type: 'vitamins', emoji: '🍊', color: '#D4A8E8' },
];

const CUSTOMERS: Customer[] = [
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    need: 'I need to build muscle for a big roar!',
    preferredTypes: ['protein'],
    color: '#F4D03F'
  },
  {
    id: 'turtle',
    name: 'Turtle',
    emoji: '🐢',
    need: 'I need long-lasting energy for my journey!',
    preferredTypes: ['carbs', 'fats'],
    color: '#82C09A'
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    emoji: '🐰',
    need: 'I need quick energy to hop around!',
    preferredTypes: ['vitamins', 'carbs'],
    color: '#E8B4CB'
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
const SuccessModal: React.FC<{ show: boolean; onNext: () => void }> = ({ show, onNext }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <div className="bg-white rounded-xl p-8 text-center shadow-soft transform success-modal">
        <div className="text-6xl mb-4 animate-bounce-gentle">😊</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Well done, Chef!</h2>
        <p className="text-gray-600 mb-6">Your customer is very happy!</p>
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-peach to-gold text-gray-800 px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform shadow-soft"
        >
          Next Customer
        </button>
      </div>
    </div>
  );
};

// Main game component
export default function EnergyChefGame() {
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(CUSTOMERS[0]);
  const [cookingPot, setCookingPot] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [customerIndex, setCustomerIndex] = useState(0);

  const playSound = (type: string) => {
    // Simple sound feedback - you can implement Web Audio API later
    console.log(`🎵 Playing ${type} sound`);
  };

  const addToPot = (ingredientId: string) => {
    if (!cookingPot.includes(ingredientId)) {
      setCookingPot([...cookingPot, ingredientId]);
      playSound('drop');
    }
  };

  const removeFromPot = (ingredientId: string) => {
    setCookingPot(cookingPot.filter(id => id !== ingredientId));
    playSound('remove');
  };

  const cookMeal = () => {
    if (cookingPot.length === 0) return;

    setIsAnimating(true);
    playSound('cooking');

    // Simulate cooking time
    setTimeout(() => {
      setIsAnimating(false);
      setShowConfetti(true);
      setShowSuccess(true);
      playSound('success');
      
      // Auto-hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }, 2000);
  };

  const nextCustomer = () => {
    setShowSuccess(false);
    setCookingPot([]);
    
    const nextIndex = (customerIndex + 1) % CUSTOMERS.length;
    setCustomerIndex(nextIndex);
    setCurrentCustomer(CUSTOMERS[nextIndex]);
  };

  const resetPot = () => {
    setCookingPot([]);
    playSound('reset');
  };

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <button className="p-2 rounded-lg hover:bg-beige transition-colors text-2xl">
          ←
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Energy Chef 🧑‍🍳</h1>
        <button className="p-2 rounded-lg hover:bg-beige transition-colors text-xl">
          ⚙️
        </button>
      </div>

      {/* Customer Section */}
      <div className="p-6 text-center">
        <div 
          className="inline-block p-6 rounded-2xl shadow-soft mb-4 transition-all hover:scale-105"
          style={{ backgroundColor: currentCustomer.color }}
        >
          <div className="text-6xl mb-2">{currentCustomer.emoji}</div>
          <div className="bg-white rounded-lg p-4 shadow-sm max-w-xs">
            <p className="text-gray-800 font-medium text-sm">&ldquo;{currentCustomer.need}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Cooking Pot */}
      <div className="px-6 mb-8">
        <div className={`bg-white rounded-2xl p-8 text-center shadow-lift min-h-32 border-4 border-dashed border-taupe transition-all cooking-pot ${isAnimating ? 'cooking' : ''}`}>
          <div className="text-4xl mb-4">🍲</div>
          {isAnimating && (
            <div className="text-sm text-gray-600 mb-2 animate-pulse">Cooking your meal...</div>
          )}
          {cookingPot.length === 0 ? (
            <p className="text-gray-500">Tap ingredients to add them</p>
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
        </div>
      </div>

      {/* Ingredients */}
      <div className="px-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Choose Your Ingredients</h3>
        <div className="grid grid-cols-4 gap-3">
          {INGREDIENTS.map((ingredient) => (
            <button
              key={ingredient.id}
              onClick={() => addToPot(ingredient.id)}
              className="ingredient-button w-full aspect-square rounded-xl border-3 border-white shadow-soft text-3xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all"
              style={{ backgroundColor: ingredient.color }}
              disabled={cookingPot.includes(ingredient.id)}
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
            Reset Pot
          </button>
          <button
            onClick={cookMeal}
            disabled={cookingPot.length === 0 || isAnimating}
            className="flex-1 bg-gradient-to-r from-mint to-green-300 text-gray-800 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isAnimating ? 'Cooking...' : 'Cook Meal 🍳'}
          </button>
        </div>
      </div>

      {/* Educational Hint */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-gold">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Tip:</span> Try adding ingredients that match what your customer needs! 
            The {currentCustomer.name.toLowerCase()} loves{' '}
            {currentCustomer.preferredTypes.map((type, i) => (
              <span key={type} className="font-medium">
                {type}{i < currentCustomer.preferredTypes.length - 1 ? ' and ' : ''}
              </span>
            )).slice(0, -1)} foods.
          </p>
        </div>
      </div>

      {/* Confetti */}
      <Confetti show={showConfetti} />

      {/* Success Modal */}
      <SuccessModal show={showSuccess} onNext={nextCustomer} />
    </div>
  );
}