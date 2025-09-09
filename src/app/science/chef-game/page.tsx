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
  fact: string;
  habitat: string;
}

interface Animal {
  id: string;
  name: string;
  emoji: string;
  dietType: 'Carnivorous' | 'Herbivorous' | 'Omnivorous';
  need: string;
  preferredTypes: string[];
  color: string;
  fact: string;
  habitat: string;
  relatedAnimals: string[];
  digestiveSystem: string;
}

// Game data
const INGREDIENTS: Ingredient[] = [
  { 
    id: 'meat', 
    name: 'Meat', 
    type: 'meat', 
    emoji: '🥩', 
    color: '#E8B4B8',
    fact: 'Red meat is rich in protein and iron, essential for muscle development and energy!',
    habitat: 'Processed from livestock like cattle and sheep'
  },
  { 
    id: 'fish', 
    name: 'Fish', 
    type: 'meat', 
    emoji: '🐟', 
    color: '#E8B4B8',
    fact: 'Fish is an excellent source of omega-3 fatty acids, great for brain health!',
    habitat: 'Found in oceans, rivers, and lakes worldwide'
  },
  { 
    id: 'chicken', 
    name: 'Chicken', 
    type: 'meat', 
    emoji: '🍗', 
    color: '#E8B4B8',
    fact: 'Chicken is lean protein that helps build strong muscles and bones!',
    habitat: 'Domesticated birds raised on farms globally'
  },
  { 
    id: 'worms', 
    name: 'Worms', 
    type: 'insects', 
    emoji: '🪱', 
    color: '#D4A8E8',
    fact: 'Earthworms are 82% protein and help improve soil quality as they move!',
    habitat: 'Found in moist soil and decomposing organic matter'
  },
  { 
    id: 'insects', 
    name: 'Insects', 
    type: 'insects', 
    emoji: '🐛', 
    color: '#D4A8E8',
    fact: 'Insects are eaten by 2 billion people worldwide and are very nutritious!',
    habitat: 'Found everywhere on Earth except deep oceans'
  },
  { 
    id: 'grass', 
    name: 'Grass', 
    type: 'plants', 
    emoji: '🌱', 
    color: '#A8D5A8',
    fact: 'Grass contains cellulose which only herbivores can properly digest!',
    habitat: 'Grows in meadows, lawns, and grasslands globally'
  },
  { 
    id: 'leaves', 
    name: 'Leaves', 
    type: 'plants', 
    emoji: '🍃', 
    color: '#A8D5A8',
    fact: 'Leaves contain chlorophyll and provide vitamins and minerals!',
    habitat: 'Found on trees and plants in forests and gardens'
  },
  { 
    id: 'fruits', 
    name: 'Fruits', 
    type: 'plants', 
    emoji: '🍎', 
    color: '#A8D5A8',
    fact: 'Fruits are packed with vitamins, especially vitamin C for immunity!',
    habitat: 'Grow on trees and bushes in orchards and wild areas'
  },
  { 
    id: 'seeds', 
    name: 'Seeds', 
    type: 'plants', 
    emoji: '🌰', 
    color: '#A8D5A8',
    fact: 'Seeds contain all nutrients needed to grow into new plants!',
    habitat: 'Found inside fruits or produced by flowering plants'
  },
  { 
    id: 'carrots', 
    name: 'Carrots', 
    type: 'plants', 
    emoji: '🥕', 
    color: '#A8D5A8',
    fact: 'Carrots are rich in beta-carotene which helps improve eyesight!',
    habitat: 'Root vegetables grown underground in gardens and farms'
  },
  { 
    id: 'corn', 
    name: 'Corn', 
    type: 'plants', 
    emoji: '🌽', 
    color: '#A8D5A8',
    fact: 'Corn provides energy through carbohydrates and is grown worldwide!',
    habitat: 'Tall grass plant cultivated in fields across the globe'
  },
  { 
    id: 'berries', 
    name: 'Berries', 
    type: 'plants', 
    emoji: '🫐', 
    color: '#A8D5A8',
    fact: 'Berries are antioxidant powerhouses that fight harmful free radicals!',
    habitat: 'Grow on bushes in forests, gardens, and wild areas'
  },
];

const ANIMALS: Animal[] = [
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    dietType: 'Carnivorous',
    need: 'I only eat meat to stay strong!',
    preferredTypes: ['meat'],
    color: '#F4D03F',
    fact: 'Lions can eat up to 40kg of meat in one meal and are known as the "King of the Jungle"!',
    habitat: 'African savannas and grasslands',
    relatedAnimals: ['Tigers', 'Leopards', 'Cheetahs'],
    digestiveSystem: 'Short digestive tract optimized for processing meat quickly'
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    emoji: '🐇',
    dietType: 'Herbivorous',
    need: 'I only eat plants and vegetables!',
    preferredTypes: ['plants'],
    color: '#E8B4CB',
    fact: 'Rabbits have special bacteria in their gut that help them digest tough plant fibers!',
    habitat: 'Fields, meadows, and forest edges worldwide',
    relatedAnimals: ['Hares', 'Guinea pigs', 'Hamsters'],
    digestiveSystem: 'Long intestines and special cecum for fermenting plant matter'
  },
  {
    id: 'bear',
    name: 'Bear',
    emoji: '🐻',
    dietType: 'Omnivorous',
    need: 'I eat both plants and meat!',
    preferredTypes: ['meat', 'plants'],
    color: '#D2B48C',
    fact: 'Bears can gain up to 200kg before hibernation by eating both berries and salmon!',
    habitat: 'Forests, mountains, and tundra regions',
    relatedAnimals: ['Pandas', 'Raccoons', 'Wolverines'],
    digestiveSystem: 'Flexible digestive system that can process both plants and meat'
  },
  {
    id: 'eagle',
    name: 'Eagle',
    emoji: '🦅',
    dietType: 'Carnivorous',
    need: 'I hunt for meat and fish!',
    preferredTypes: ['meat'],
    color: '#8B4513',
    fact: 'Eagles have incredible eyesight - 8 times sharper than humans for spotting prey!',
    habitat: 'Mountains, coasts, and near large bodies of water',
    relatedAnimals: ['Hawks', 'Falcons', 'Owls'],
    digestiveSystem: 'Strong stomach acids to digest bones and tough meat'
  },
  {
    id: 'cow',
    name: 'Cow',
    emoji: '🐄',
    dietType: 'Herbivorous',
    need: 'I love eating grass and plants!',
    preferredTypes: ['plants'],
    color: '#FFB6C1',
    fact: 'Cows have 4 stomach chambers and chew their food twice to digest grass properly!',
    habitat: 'Grasslands, pastures, and farms worldwide',
    relatedAnimals: ['Buffalo', 'Bison', 'Goats'],
    digestiveSystem: 'Four-chambered stomach system for breaking down cellulose'
  },
  {
    id: 'pig',
    name: 'Pig',
    emoji: '🐷',
    dietType: 'Omnivorous',
    need: 'I enjoy both plants and other foods!',
    preferredTypes: ['meat', 'plants'],
    color: '#F0A0A0',
    fact: 'Pigs are incredibly smart - they can learn their names and solve puzzles!',
    habitat: 'Farms, forests, and grasslands',
    relatedAnimals: ['Boars', 'Hippos', 'Warthogs'],
    digestiveSystem: 'Single-chambered stomach similar to humans, processing varied diet'
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

// AI Suggestions Modal component
const AISuggestionsModal: React.FC<{ 
  show: boolean; 
  onClose: () => void; 
  topics: string[];
  animal: Animal;
  onAskQuestion: (question: string) => void;
}> = ({ show, onClose, topics, animal, onAskQuestion }) => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null);

  if (!show) return null;

  const getSuggestionsForTopic = (topic: string) => {
    const suggestions: Record<string, string[]> = {
      'Digestive System': [
        `How long does digestion take in ${animal.name}?`,
        `What enzymes help ${animal.name} digest food?`,
        `How does ${animal.name}'s stomach work?`,
        `What happens if ${animal.name} eats the wrong food?`
      ],
      'Habitat': [
        `What temperature does ${animal.name} prefer?`,
        `How does ${animal.name} find shelter?`,
        `What other animals live with ${animal.name}?`,
        `How is ${animal.name}'s habitat changing?`
      ],
      'Related Animals': [
        `What's the difference between ${animal.name} and its relatives?`,
        `How did ${animal.name} evolve?`,
        `Which animal is most similar to ${animal.name}?`,
        `What family does ${animal.name} belong to?`
      ],
      'General': [
        `What's the most interesting thing about ${animal.name}?`,
        `How smart is ${animal.name}?`,
        `How does ${animal.name} communicate?`,
        `What are ${animal.name}'s natural enemies?`
      ]
    };
    return suggestions[topic] || [];
  };

  const allSuggestions = topics.length > 0 
    ? topics.flatMap(topic => getSuggestionsForTopic(topic))
    : getSuggestionsForTopic('General');

  const filteredSuggestions = selectedTopicFilter 
    ? getSuggestionsForTopic(selectedTopicFilter)
    : allSuggestions;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl animate-scale-in border border-gray-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold"> AI Learning Suggestions</h3>
              <p className="text-purple-100 text-sm">Explore more about {animal.name}!</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Topic Filters */}
        {topics.length > 1 && (
          <div className="p-4 bg-gray-50 border-b">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Filter by topic:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTopicFilter(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTopicFilter === null
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Topics
              </button>
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopicFilter(topic)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTopicFilter === topic
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 mb-3">
              💡 Suggested Questions:
            </h4>
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  onAskQuestion(suggestion);
                  onClose();
                }}
                className="block w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 group-hover:text-purple-600 mt-0.5">💭</span>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {suggestion}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filteredSuggestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🤔</div>
              <p className="text-sm">No suggestions available for this topic.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">
              🌟 Click any question to learn more!
            </p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Question Tracking Modal component
const QuestionTrackingModal: React.FC<{ 
  show: boolean; 
  onClose: () => void; 
  question: string;
  animal: Animal;
  onMarkComplete: () => void;
}> = ({ show, onClose, question, animal, onMarkComplete }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!show) return null;

  // Generate contextual answer based on question
  const generateAnswer = (q: string, animalData: Animal) => {
    const questionLower = q.toLowerCase();
    
    if (questionLower.includes('digest') || questionLower.includes('food')) {
      return `${animalData.name} has a ${animalData.digestiveSystem}. This means they process food in a specific way that matches their ${animalData.dietType.toLowerCase()} diet. ${animalData.fact}`;
    }
    
    if (questionLower.includes('habitat') || questionLower.includes('live') || questionLower.includes('environment')) {
      return `${animalData.name} lives in ${animalData.habitat}. This environment provides everything they need including food sources like ${animalData.preferredTypes.join(' and ')}. ${animalData.fact}`;
    }
    
    if (questionLower.includes('related') || questionLower.includes('family') || questionLower.includes('similar')) {
      return `${animalData.name} is related to ${animalData.relatedAnimals?.join(', ') || 'various animals in their family'}. They share similar characteristics but have evolved differently. ${animalData.fact}`;
    }
    
    if (questionLower.includes('size') || questionLower.includes('big') || questionLower.includes('large')) {
      return `${animalData.name} varies in size depending on their species and habitat. Living in ${animalData.habitat} influences their physical development. ${animalData.fact}`;
    }
    
    if (questionLower.includes('special') || questionLower.includes('unique') || questionLower.includes('interesting')) {
      return `What makes ${animalData.name} special is their adaptation to ${animalData.habitat} and their ${animalData.digestiveSystem}. ${animalData.fact}`;
    }
    
    // Default educational response
    return `Great question about ${animalData.name}! ${animalData.fact} They live in ${animalData.habitat} and have adapted perfectly to their environment with their ${animalData.digestiveSystem}.`;
  };

  const answer = generateAnswer(question, animal);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl animate-scale-in border border-gray-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold"> Learning Time!</h3>
              <p className="text-green-100 text-sm">You asked about {animal.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="p-4 bg-blue-50">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 text-lg">❓</span>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-1">Your Question:</h4>
              <p className="text-gray-700 text-sm italic">&quot;{question}&quot;</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {!showAnswer ? (
            <div className="text-center space-y-4">
              <div className="text-4xl"></div>
              <p className="text-gray-600 text-sm">
                Ready to learn something amazing about {animal.name}?
              </p>
              <button
                onClick={() => setShowAnswer(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-colors"
              >
                Show Answer! 
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-green-500 text-lg">💡</span>
                <div>
                  <h4 className="font-semibold text-green-800 text-sm mb-2">Answer:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{answer}</p>
                </div>
              </div>

              {/* Learning Actions */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                <h4 className="font-semibold text-gray-800 text-sm"> Great job learning!</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onMarkComplete();
                      onClose();
                    }}
                    className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                     I Learned This!
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                     Ask More
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Fact Modal component
const EnhancedFactModal: React.FC<{ 
  show: boolean; 
  onClose: () => void; 
  animal: Animal;
  onAskQuestion: (question: string) => void;
}> = ({ show, onClose, animal, onAskQuestion }) => {
  const [selectedTab, setSelectedTab] = useState('general');
  const [customQuestion, setCustomQuestion] = useState('');

  if (!show) return null;

  const tabs = [
    { id: 'general', label: ' General', icon: '📖' },
    { id: 'habitat', label: '🏠 Habitat', icon: '🌍' },
    { id: 'digestion', label: ' Digestion', icon: '⚡' },
    { id: 'related', label: '👨‍👩‍👧 Family', icon: '🦴' }
  ];

  const handleQuestionClick = (question: string) => {
    onAskQuestion(question);
    setCustomQuestion('');
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'general':
        return (
          <div className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Fun Fact:</strong> {animal.fact}
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2"> Quick Questions:</h4>
              <div className="space-y-2">
                {[
                  `Why does ${animal.name} eat ${animal.preferredTypes[0]}?`,
                  `How big is a ${animal.name}?`,
                  `What makes ${animal.name} special?`
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(q)}
                    className="block w-full text-left text-xs bg-white p-2 rounded border hover:bg-blue-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'habitat':
        return (
          <div className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Habitat:</strong> {animal.habitat}
            </p>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🌍 Learn More:</h4>
              <div className="space-y-2">
                {[
                  `Where exactly do ${animal.name}s live?`,
                  `What threats do they face?`,
                  `How do they adapt to their environment?`
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(q)}
                    className="block w-full text-left text-xs bg-white p-2 rounded border hover:bg-green-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'digestion':
        return (
          <div className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Digestive System:</strong> {animal.digestiveSystem}
            </p>
            <div className="bg-orange-50 p-3 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2"> Digestion Questions:</h4>
              <div className="space-y-2">
                {[
                  `How does ${animal.name} digest food?`,
                  `What happens to the food after eating?`,
                  `Why can't ${animal.name} eat everything?`
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(q)}
                    className="block w-full text-left text-xs bg-white p-2 rounded border hover:bg-orange-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'related':
        return (
          <div className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Related Animals:</strong> {animal.relatedAnimals?.join(', ') || 'None specified'}
            </p>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2"> Family Questions:</h4>
              <div className="space-y-2">
                {[
                  `What animals are related to ${animal.name}?`,
                  `How are they similar?`,
                  `What makes them different?`
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(q)}
                    className="block w-full text-left text-xs bg-white p-2 rounded border hover:bg-purple-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl animate-scale-in border border-gray-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold"> Learn About {animal.name}</h3>
              <p className="text-sky-100 text-sm">Explore different topics!</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 min-w-0 p-3 text-xs font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{tab.icon}</div>
                <div className="truncate">{tab.label.split(' ')[1]}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {renderTabContent()}
        </div>

        {/* Custom Question Input */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ask your own question..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && customQuestion.trim()) {
                  handleQuestionClick(customQuestion);
                }
              }}
            />
            <button
              onClick={() => customQuestion.trim() && handleQuestionClick(customQuestion)}
              disabled={!customQuestion.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const SuccessModal: React.FC<{ 
  show: boolean; 
  onNext: () => void; 
  isCorrect: boolean; 
  animal: Animal;
  onShowFact: () => void;
  onTopicSelect: (topic: string) => void;
}> = ({ show, onNext, isCorrect, onShowFact, onTopicSelect }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 text-center shadow-2xl transform success-modal max-w-sm w-full max-h-[80vh] overflow-y-auto animate-scale-in border border-gray-300">
        <div className="text-6xl mb-4 animate-bounce-gentle">
          {isCorrect ? '👍' : '😅'}
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isCorrect ? 'Congratulations!' : 'Good try!'}
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          {isCorrect ? 'You fed the animal correctly!' : 'Try again with different food!'}
        </p>

        {isCorrect && (
          <div className="space-y-4 mb-6">
            {/* Quick Topics */}
            {/* <div>
              <h4 className="font-semibold text-gray-700 mb-2">🧠 Want to learn more about:</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Digestive System', 'Habitat', 'Related Animals'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => onTopicSelect(topic)}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onShowFact}
                className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-200 transition-colors"
              >
                 Fun Facts
              </button>
              <button
                onClick={onNext}
                className="flex-1 bg-gradient-to-r from-sky-400 to-blue-500 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-sky-500 hover:to-blue-600 transition-colors"
              >
                {isCorrect ? 'Next Animal' : 'Try Again'}
              </button>
            </div>
          </div>
        )}

        {!isCorrect && (
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-sky-500 hover:to-blue-600 transition-colors"
          >
            Try Again
          </button>
        )}
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
  
  // Enhanced interaction states
  const [showAnimalFact, setShowAnimalFact] = useState(false);
  const [showIngredientFact, setShowIngredientFact] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [completedAnimals, setCompletedAnimals] = useState<string[]>([]);
  const [userQuestions, setUserQuestions] = useState<string[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');

  // Handle question asking
  const handleAskQuestion = (question: string) => {
    setCurrentQuestion(question);
    setUserQuestions(prev => [...prev, question]);
    setShowQuestionModal(true);
    setShowAnimalFact(false);
    setShowAISuggestions(false);
  };

  // Mark question as completed
  const markQuestionComplete = () => {
    // Add any tracking logic here if needed
    setShowQuestionModal(false);
  };

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
      // Add to completed animals list
      if (!completedAnimals.includes(currentAnimal.id)) {
        setCompletedAnimals([...completedAnimals, currentAnimal.id]);
      }
      
      // Move to next animal only if the answer was correct
      const nextIndex = (animalIndex + 1) % ANIMALS.length;
      setAnimalIndex(nextIndex);
      setCurrentAnimal(ANIMALS[nextIndex]);
      
      // Removed: setShowAISuggestions(true); - AI suggestions no longer show automatically
    }
    
    // Reset interaction states
    setShowAnimalFact(false);
    setShowIngredientFact(null);
    setSelectedTopics([]);
    // If incorrect, stay with the same animal for retry
  };

  // Enhanced interaction functions
  
  const resetPot = () => {
    setCookingPot([]);
    playSound('reset');
  };

  const isAnyModalOpen = showSuccess || showAnimalFact || showAISuggestions || showQuestionModal || showIngredientFact;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 font-sans">
      {/* Main Game Content - This gets blurred when modal is open */}
      <div className={`transition-all duration-500 ${isAnyModalOpen ? 'filter blur-md brightness-75' : ''}`}>
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <Link href="https://eklavyaa.vercel.app/chapters/science-world" className="p-2 rounded-lg hover:bg-beige transition-colors text-2xl">
              ←
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Energy Chef 🧑‍🍳</h1>
            <div className="w-10"></div>
          </div>
        
          {/* Progress Bar */}
          <div className="px-4 pb-3 bg-gradient-to-r from-sky-50 to-blue-50">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">🎯 Progress:</span>
                <div className="bg-white rounded-full px-2 py-1 text-blue-600 font-medium">
                  {completedAnimals.length}/{ANIMALS.length} animals
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">❓ Questions:</span>
                <div className="bg-white rounded-full px-2 py-1 text-purple-600 font-medium">
                  {userQuestions.length}
                </div>
              </div>
            </div>
            
            {/* Progress Visual */}
            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${(completedAnimals.length / ANIMALS.length) * 100}%` }}
              />
            </div>
          </div>
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
            <div className="text-4xl mb-4"></div>
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
              <div key={ingredient.id} className="relative">
                <button
                  onClick={() => addToPot(ingredient.id)}
                  className="ingredient-button w-full aspect-square rounded-xl border-3 border-white shadow-soft text-3xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  style={{ backgroundColor: ingredient.color }}
                  disabled={cookingPot.includes(ingredient.id) || cookingPot.length >= 2}
                >
                  <div className="text-2xl mb-1">{ingredient.emoji}</div>
                  <div className="text-xs text-gray-700 font-medium">{ingredient.name}</div>
                </button>
                {/* Fact Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowIngredientFact(ingredient.name);
                  }}
                  className="absolute -top-1 -right-1 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-500 transition-colors shadow-sm"
                  title="Learn about this ingredient"
                >
                  i
                </button>
              </div>
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
              {isAnimating ? 'Feeding...' : 'Feed Animal '}
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
      </div>

      {/* MODALS - These appear OVER the blurred background */}
      
      {/* Success Modal */}
      <SuccessModal 
        show={showSuccess} 
        onNext={nextAnimal} 
        isCorrect={feedbackCorrect} 
        animal={currentAnimal}
        onShowFact={() => setShowAnimalFact(true)}
        onTopicSelect={(topic) => {
          setSelectedTopics([topic]);
          setShowAISuggestions(true);
        }}
      />

      {/* Enhanced Fact Modal */}
      <EnhancedFactModal
        show={showAnimalFact}
        onClose={() => setShowAnimalFact(false)}
        animal={currentAnimal}
        onAskQuestion={handleAskQuestion}
      />

      {/* AI Suggestions Modal */}
      <AISuggestionsModal
        show={showAISuggestions}
        onClose={() => setShowAISuggestions(false)}
        topics={selectedTopics}
        animal={currentAnimal}
        onAskQuestion={handleAskQuestion}
      />

      {/* Question Tracking Modal */}
      <QuestionTrackingModal
        show={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        question={currentQuestion}
        animal={currentAnimal}
        onMarkComplete={markQuestionComplete}
      />

      {/* Ingredient Fact Modal */}
      {showIngredientFact && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-scale-in border border-gray-300">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
               {INGREDIENTS.find(i => i.name === showIngredientFact)?.name} Facts
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {INGREDIENTS.find(i => i.name === showIngredientFact)?.fact}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <strong>Found in:</strong> {INGREDIENTS.find(i => i.name === showIngredientFact)?.habitat}
            </p>
            <button
              onClick={() => setShowIngredientFact(null)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Got it! 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
