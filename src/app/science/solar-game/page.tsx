"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Import translation files
import enTranslations from "../../../../locales/solar-en.json";
import hiTranslations from "../../../../locales/solar-hi.json";
import orTranslations from "../../../../locales/solar-or.json";

// Planet data with colors and sizes - optimized for mobile
const planetsData = [
  {
    name: "Mercury",
    color: "#8C7853",
    size: 24,
    distance: 65,
    hint: "Smallest planet, closest to Sun",
    facts: [
      "Mercury is the smallest planet in our solar system",
      "A day on Mercury lasts 59 Earth days",
      "Mercury has no atmosphere to retain heat",
      "Temperatures range from 800°F to -300°F",
    ],
    funFact:
      "Mercury is named after the Roman messenger god because it moves so fast around the Sun!",
    relatedTopics: [
      "Orbital mechanics",
      "Temperature extremes",
      "Planetary composition",
    ],
  },
  {
    name: "Venus",
    color: "#FFC649",
    size: 28,
    distance: 85,
    hint: "Hottest planet with thick clouds",
    facts: [
      "Venus is the hottest planet in our solar system",
      "It rotates backwards compared to most planets",
      "Venus has a thick, toxic atmosphere",
      "A day on Venus is longer than its year",
    ],
    funFact:
      "Venus is sometimes called Earth's twin, but it's more like Earth's evil twin with its hellish conditions!",
    relatedTopics: [
      "Greenhouse effect",
      "Atmospheric pressure",
      "Retrograde rotation",
    ],
  },
  {
    name: "Earth",
    color: "#6B93D6",
    size: 30,
    distance: 105,
    hint: "Our blue home planet",
    facts: [
      "Earth is the only known planet with life",
      "71% of Earth is covered by water",
      "Earth has one natural satellite - the Moon",
      "It takes 365.25 days to orbit the Sun",
    ],
    funFact:
      'Earth is the only planet not named after a Roman or Greek god - it comes from Old English meaning "ground"!',
    relatedTopics: ["Biodiversity", "Water cycle", "Magnetic field"],
  },
  {
    name: "Mars",
    color: "#CD5C5C",
    size: 26,
    distance: 125,
    hint: "The Red Planet",
    facts: [
      "Mars appears red due to iron oxide (rust)",
      "Mars has the largest volcano in the solar system",
      "It has two small moons: Phobos and Deimos",
      "Mars has seasons similar to Earth",
    ],
    funFact:
      "Mars has dust storms that can cover the entire planet and last for months!",
    relatedTopics: ["Space exploration", "Terraforming", "Polar ice caps"],
  },
  {
    name: "Jupiter",
    color: "#D8CA9D",
    size: 50,
    distance: 150,
    hint: "Largest planet, gas giant",
    facts: [
      "Jupiter is larger than all other planets combined",
      "It has over 80 known moons",
      "Jupiter's Great Red Spot is a giant storm",
      'It acts as a "cosmic vacuum cleaner"',
    ],
    funFact:
      "Jupiter is like a failed star - if it were 80 times more massive, it could have become a second sun!",
    relatedTopics: ["Gas giants", "Galilean moons", "Planetary protection"],
  },
  {
    name: "Saturn",
    color: "#FAD5A5",
    size: 35,
    distance: 175,
    hint: "Planet with beautiful rings",
    facts: [
      "Saturn has the most spectacular ring system",
      "It's less dense than water",
      "Saturn has 83 confirmed moons",
      "Its moon Titan has lakes of liquid methane",
    ],
    funFact:
      "Saturn would float in water if you could find a bathtub big enough!",
    relatedTopics: ["Ring systems", "Moon systems", "Density and composition"],
  },
  {
    name: "Uranus",
    color: "#4FD0E7",
    size: 35,
    distance: 200,
    hint: "Ice giant tilted sideways",
    facts: [
      "Uranus rotates on its side",
      "It's made mostly of water, methane, and ammonia",
      "Uranus has faint rings",
      "It's the coldest planetary atmosphere",
    ],
    funFact:
      "Uranus spins like a rolling ball instead of a spinning top - probably due to an ancient collision!",
    relatedTopics: ["Axial tilt", "Ice giants", "Magnetic fields"],
  },
  {
    name: "Neptune",
    color: "#4B70DD",
    size: 35,
    distance: 225,
    hint: "Windiest planet, deep blue",
    facts: [
      "Neptune has the fastest winds in the solar system",
      "It takes 165 Earth years to orbit the Sun",
      "Neptune was discovered through mathematics",
      "It has 14 known moons",
    ],
    funFact:
      "Neptune's winds can reach 1,200 mph - faster than the speed of sound on Earth!",
    relatedTopics: [
      "Mathematical prediction",
      "Extreme weather",
      "Discovery methods",
    ],
  },
];

type Planet = (typeof planetsData)[0];

// Shuffle function for randomizing planet order
const shuffleArray = (array: Planet[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Planet component
function Planet({
  planetData,
  isInOrbit,
  angle = 0,
  onClick,
  isClickable = true,
  centerX,
  centerY,
  getPlanetImageKey,
}: {
  planetData: Planet;
  isInOrbit: boolean;
  angle?: number;
  onClick?: () => void;
  isClickable?: boolean;
  centerX: number;
  centerY: number;
  getPlanetImageKey: (name: string) => string;
}) {
  // Calculate position based on orbit with proper circular motion
  const x = isInOrbit ? centerX + Math.cos(angle) * planetData.distance : 0;
  const y = isInOrbit ? centerY + Math.sin(angle) * planetData.distance : 0;

  const imageKey = getPlanetImageKey(planetData.name);

  return (
    <div
      className={`absolute ${
        isClickable ? "cursor-pointer hover:scale-110" : ""
      } transition-all duration-300 flex items-center justify-center`}
      style={{
        left: x - planetData.size / 2,
        top: y - planetData.size / 2,
        width: planetData.size,
        height: planetData.size,
        zIndex: isInOrbit ? 10 : 20,
      }}
      onClick={onClick}
      data-planet={planetData.name}
    >
      <span className="text-white text-xs font-bold">
        {imageKey === "Mercury" && (
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmV3cDRtamtubXE2b2dnaG51Nno5dnBleTNmaXI0NWQxcjYzNTA1cSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/108bNXja5KRrkA/giphy.gif"
            alt="Mercury"
            className="w-full h-full rounded-full object-cover"
          />
        )}
        {imageKey === "Venus" && (
          <img
            src="/venus.webp"
            alt="Venus"
            className="w-full h-full rounded-full object-cover"
          />
        )}
        {imageKey === "Earth" && (
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajVzbGhmZDh4aGx4Nmc4ZjhnZjVpeHRqc290bjA4b3NsaTF6YmhzeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/41SIOpeqCfIru/giphy.gif"
            alt="Earth"
            className="w-full h-full rounded-full object-cover"
          />
        )}
        {imageKey === "Mars" && (
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXE1ejZpNWN2eXdxcWgxcWpqaG5vZ2Y5dDFvNDI3MnNza2F3eWJ5aCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/JRZwMhzk7WolG/giphy.gif"
            alt="Mars"
            className="w-full h-full rounded-full object-cover"
          />
        )}
        {imageKey === "Jupiter" && (
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnZkdTllZnQzd2Izc201MzUxNzd5aXE5bWhjYjJ4OTczd3BseXkxOCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/e6l0YRVArTH8I/giphy.gif"
            alt="Jupiter"
            className="w-full h-full rounded-full object-cover"
          />
        )}
        {imageKey === "Neptune" && (
          <img
            src="/ezgif.com-gif-maker.gif"
            alt="Neptune"
            className="w-full h-full rounded-full object-cover"
          />
        )}
        {imageKey === "Saturn" && (
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWx4Zm92dTZqZGdqZnE1dmdjZ3dvd20wOWJmemxibHlvdXh6ejJ3cyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/IqC4IsUmtbpqn2on8W/giphy.gif"
            alt="Saturn"
            className="w-[42px] h-[42px] rounded-full object-cover"
          />
        )}
        {imageKey === "Uranus" && (
          <img
            src="/uranus.gif"
            alt="Uranus"
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </span>
    </div>
  );
}

// Orbit ring component
function OrbitRing({
  radius,
  isHighlighted,
  centerX,
  centerY,
}: {
  radius: number;
  isHighlighted: boolean;
  centerX: number;
  centerY: number;
}) {
  return (
    <div
      className="absolute rounded-full border border-dashed pointer-events-none"
      style={{
        left: centerX - radius,
        top: centerY - radius,
        width: radius * 2,
        height: radius * 2,
        borderColor: isHighlighted ? "#FFD700" : "rgba(255, 255, 255, 0.15)",
        borderWidth: isHighlighted ? "2px" : "1px",
        zIndex: 1,
      }}
    />
  );
}

export default function SolarSystemExplorer() {
  // Translation system
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi" | "or">(
    "en"
  );
  const [holoMode, setHoloMode] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const translations = {
    en: enTranslations,
    hi: hiTranslations,
    or: orTranslations,
  };
  const t = (translations as any)[currentLanguage];

  // Map planet names to their English equivalents for image matching
  const getPlanetImageKey = (name: string) => {
    const planetImages = {
      Mercury: "Mercury",
      बुध: "Mercury",
      ବୁଧ: "Mercury",
      Venus: "Venus",
      शुक्र: "Venus",
      ଶୁକ୍ର: "Venus",
      Earth: "Earth",
      पृथ्वी: "Earth",
      ପୃଥିବୀ: "Earth",
      Mars: "Mars",
      मंगल: "Mars",
      ମଙ୍ଗଳ: "Mars",
      Jupiter: "Jupiter",
      बृहस्पति: "Jupiter",
      ବୃହସ୍ପତି: "Jupiter",
      Saturn: "Saturn",
      शनि: "Saturn",
      ଶନି: "Saturn",
      Uranus: "Uranus",
      अरुण: "Uranus",
      ଅରୁଣ: "Uranus",
      Neptune: "Neptune",
      वरुण: "Neptune",
      ବରୁଣ: "Neptune",
    };
    return planetImages[name as keyof typeof planetImages] || name;
  };

  // Generate dynamic planet data from translations
  const getTranslatedPlanetsData = () => {
    const planetKeys = [
      "mercury",
      "venus",
      "earth",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
    ];
    const staticData = [
      { color: "#8C7853", size: 24, distance: 65 },
      { color: "#FFC649", size: 28, distance: 85 },
      { color: "#6B93D6", size: 30, distance: 105 },
      { color: "#CD5C5C", size: 26, distance: 125 },
      { color: "#D8CA9D", size: 50, distance: 150 },
      { color: "#FAD5A5", size: 35, distance: 175 },
      { color: "#4FD0E7", size: 35, distance: 200 },
      { color: "#4B70DD", size: 35, distance: 225 },
    ];

    return planetKeys.map((key, index) => ({
      name: t.planets[key]?.name || planetKeys[index],
      hint: t.planets[key]?.hint || "",
      facts: t.planets[key]?.facts || [],
      funFact: t.planets[key]?.funFact || "",
      relatedTopics: t.planets[key]?.relatedTopics || [],
      ...staticData[index],
    }));
  };

  const [availablePlanets, setAvailablePlanets] = useState<Planet[]>(() =>
    shuffleArray(getTranslatedPlanetsData())
  );
  const [placedPlanets, setPlacedPlanets] = useState<Planet[]>([]);

  // Update planet data when language changes
  useEffect(() => {
    const translatedData = getTranslatedPlanetsData();
    setAvailablePlanets(
      shuffleArray(
        translatedData.filter(
          (planet) =>
            !placedPlanets.some((placed) => placed.name === planet.name)
        )
      )
    );
    setPlacedPlanets((prev) =>
      prev.map((placed) => {
        const updated = translatedData.find(
          (p) =>
            planetsData.findIndex((orig) => orig.name === placed.name) ===
            translatedData.findIndex((trans) => trans.name === p.name)
        );
        return updated || placed;
      })
    );
  }, [currentLanguage]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState("");
  const [highlightedOrbit, setHighlightedOrbit] = useState(-1);
  const [orbitAngles, setOrbitAngles] = useState<{ [key: string]: number }>({});
  const [screenSize, setScreenSize] = useState({ width: 400, height: 600 });
  const [showPlanetInfo, setShowPlanetInfo] = useState(false);
  const [selectedPlanetInfo, setSelectedPlanetInfo] = useState<Planet | null>(
    null
  );
  const [showAIsuggestions, setShowAIsuggestions] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [showFacts, setShowFacts] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Responsive design setup
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    // Show welcome modal after game has rendered
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 100);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
      clearTimeout(timer);
    };
  }, []);

  // Calculate responsive center points
  const centerX =
    screenSize.width > 768 ? screenSize.width / 2 : screenSize.width / 2;
  const centerY =
    screenSize.height > 600
      ? (screenSize.height - 800) / 2 + 260
      : (screenSize.height - 700) / 2 + 240;

  // Animation for orbiting planets - improved orbit mechanics
  useEffect(() => {
    if (placedPlanets.length === 0) return;

    const interval = setInterval(() => {
      setOrbitAngles((prev) => {
        const newAngles = { ...prev };
        placedPlanets.forEach((planet) => {
          // Different orbital speeds - closer planets orbit faster (Kepler's laws)
          const baseSpeed = 0.02;
          const speed = baseSpeed * (100 / planet.distance); // Inverse relationship to distance
          newAngles[planet.name] =
            ((prev[planet.name] || 0) + speed) % (Math.PI * 2);
        });
        return newAngles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [placedPlanets]);

  useEffect(() => {
    if (placedPlanets.length === 8) {
      // Add 8 second delay before showing completion popup
      setTimeout(() => {
        setGameComplete(true);
      }, 8000); // 8 seconds
    }
  }, [placedPlanets]);

  const handlePlanetClick = (planetData: Planet) => {
    // Check if this is the correct next planet
    const translatedData = getTranslatedPlanetsData();
    const correctOrbitIndex = translatedData.findIndex(
      (p) => p.name === planetData.name
    );
    const isCorrectNext = placedPlanets.length === correctOrbitIndex;

    if (isCorrectNext) {
      // Correct placement
      setPlacedPlanets((prev) => [...prev, planetData]);
      setAvailablePlanets((prev) =>
        prev.filter((p) => p.name !== planetData.name)
      );
      setOrbitAngles((prev) => ({ ...prev, [planetData.name]: 0 }));
      playCorrectSound();
    } else {
      // Incorrect placement - shake animation
      const element = document.querySelector(
        `[data-planet="${planetData.name}"]`
      ) as HTMLElement;
      if (element) {
        element.style.animation = "shake 0.5s";
        setTimeout(() => {
          element.style.animation = "";
        }, 500);
      }
      playIncorrectSound();
    }
  };

  const handleOrbitingPlanetClick = (planetData: Planet) => {
    // Show detailed info when clicking on orbiting planets
    setSelectedPlanetInfo(planetData);
    setShowPlanetInfo(true);
    setShowFacts(true);
  };

  const addUserInterest = (topic: string) => {
    if (!userInterests.includes(topic)) {
      setUserInterests((prev) => [...prev, topic]);
    }
  };

  const getAISuggestions = (planet: Planet) => {
    const suggestions = [];

    if (planet.name === "Mars") {
      suggestions.push(
        "🚀 Would you like to learn about Mars rovers and space exploration?"
      );
      suggestions.push("🏠 Interested in how humans might live on Mars?");
    }
    if (planet.name === "Jupiter") {
      suggestions.push(
        "🌙 Want to explore Jupiter's fascinating moons like Europa?"
      );
      suggestions.push("🌊 Curious about the possibility of oceans under ice?");
    }
    if (planet.name === "Saturn") {
      suggestions.push("💍 Would you like to learn how Saturn's rings formed?");
      suggestions.push("🛰️ Interested in the Cassini mission to Saturn?");
    }
    if (planet.name === "Earth") {
      suggestions.push(
        "🌍 Want to learn about climate change and Earth's atmosphere?"
      );
      suggestions.push("🌙 Curious about how the Moon affects Earth?");
    }

    return suggestions;
  };

  const playCorrectSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (
          window as Window &
            typeof globalThis & { webkitAudioContext: typeof AudioContext }
        ).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(
        659.25,
        audioContext.currentTime + 0.1
      );
      oscillator.frequency.setValueAtTime(
        783.99,
        audioContext.currentTime + 0.2
      );

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      console.log("Audio not available");
    }
  };

  const playIncorrectSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (
          window as Window &
            typeof globalThis & { webkitAudioContext: typeof AudioContext }
        ).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      console.log("Audio not available");
    }
  };

  const getHint = () => {
    if (availablePlanets.length > 0) {
      // Find the next planet that should be placed
      const nextCorrectIndex = placedPlanets.length;
      const translatedData = getTranslatedPlanetsData();
      const nextPlanet = translatedData[nextCorrectIndex];

      if (nextPlanet) {
        setCurrentHint(nextPlanet.hint);
        setShowHint(true);
        setHighlightedOrbit(nextCorrectIndex);
        setTimeout(() => {
          setShowHint(false);
          setHighlightedOrbit(-1);
        }, 4000);
      }
    }
  };

  const resetGame = () => {
    const translatedData = getTranslatedPlanetsData();
    setAvailablePlanets(shuffleArray(translatedData));
    setPlacedPlanets([]);
    setGameComplete(false);
    setShowHint(false);
    setCurrentHint("");
    setHighlightedOrbit(-1);
    setOrbitAngles({});
    setShowPlanetInfo(false);
    setSelectedPlanetInfo(null);
    setShowAIsuggestions(false);
    setShowFacts(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden">
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-3px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(3px);
          }
        }
      `}</style>

      {/* Stars background - reduced for mobile performance */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Mobile-optimized Header */}
      <div className="absolute top-2 left-2 right-2 z-10">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="https://eklavyaa.vercel.app/chapters/science-world"
            className="text-white hover:text-yellow-300 transition-colors text-sm"
          >
            {t.header?.backButton || "← Back"}
          </Link>
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <select
              value={currentLanguage}
              onChange={(e) =>
                setCurrentLanguage(e.target.value as "en" | "hi" | "or")
              }
              className="bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="en">EN</option>
              <option value="hi">हिं</option>
              <option value="or">ଓଡ଼ି</option>
            </select>
            <button
              onClick={resetGame}
              className="text-white hover:text-red-400 transition-all duration-300 text-sm font-medium border border-white/30 hover:border-red-400/50 px-3 py-1 rounded-md hover:shadow-lg hover:shadow-red-500/25 backdrop-blur-sm"
            >
              {t.header?.resetButton || "↻ Reset"}
            </button>
          </div>
        </div>
        <h1 className="text-white text-xl md:text-3xl font-bold text-center drop-shadow-lg">
          {t.header?.title || "Solar System"}
        </h1>
        <p className="text-yellow-200 text-center text-sm md:text-lg"></p>
      </div>

      {/* Hint Display */}
      {showHint && (
        <div className="absolute top-36 left-2 right-2 z-20 bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium shadow-xl text-center text-sm">
          💭 {currentHint}
        </div>
      )}

      {/* Game Complete Message */}
      {gameComplete && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 p-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 md:p-10 rounded-xl text-center shadow-2xl max-w-sm">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {t.modals?.completion?.title || "Amazing!"}
            </h2>
            <p className="text-sm md:text-xl mb-6">
              {t.modals?.completion?.message ||
                "You completed the Solar System!"}
            </p>
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
              >
                {t.modals?.completion?.playAgain || "Play Again"}
              </button>
              <button
                onClick={() => {
                  setShowFacts(true);
                  const translatedData = getTranslatedPlanetsData();
                  setSelectedPlanetInfo(
                    translatedData[
                      Math.floor(Math.random() * translatedData.length)
                    ]
                  );
                  setShowPlanetInfo(true);
                }}
                className="w-full bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-all shadow-lg"
              >
                {t.modals?.completion?.learnMore || "Learn More Facts"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-40 p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <div
            className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8 rounded-2xl text-center shadow-2xl max-w-md border border-purple-500 relative"
            style={{ backgroundColor: "rgba(30, 27, 75, 0.95)" }}
          >
            <div className="mb-6">
              <div className="text-6xl mb-4"></div>
              <h1 className="text-3xl font-bold mb-2 text-yellow-300">
                {t.modals?.welcome?.title || "Solar System Explorer"}
              </h1>
              <p className="text-blue-200 text-lg">
                {t.modals?.welcome?.subtitle || "Educational Planet Game"}
              </p>
            </div>

            <div className="mb-6 text-left">
              <h2 className="text-xl font-bold mb-3 text-yellow-300">
                {t.modals?.welcome?.howToPlay || "🎮 How to Play:"}
              </h2>
              <ul className="text-sm space-y-2 text-gray-200">
                {(
                  t.modals?.welcome?.instructions || [
                    "Tap planets in order from closest to Sun",
                    "Watch them orbit around the Sun",
                    "Click orbiting planets to learn facts",
                    "Complete all 8 planets to win!",
                  ]
                ).map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-sm text-blue-200 mb-2"></p>
            </div>

            <button
              onClick={() => setShowWelcomeModal(false)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t.modals?.welcome?.startButton || "Start the game"}
            </button>
          </div>
        </div>
      )}

      {/* Planet Information Modal */}
      {showPlanetInfo && selectedPlanetInfo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl ring-1 ring-gray-300">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-2xl">
                  {selectedPlanetInfo.name === "Mercury" && (
                    <img
                      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmV3cDRtamtubXE2b2dnaG51Nno5dnBleTNmaXI0NWQxcjYzNTA1cSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/108bNXja5KRrkA/giphy.gif"
                      alt="Mercury"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                  {selectedPlanetInfo.name === "Venus" && (
                    <img
                      src="/venus.webp"
                      alt="Venus"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                  {selectedPlanetInfo.name === "Earth" && (
                    <img
                      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajVzbGhmZDh4aGx4Nmc4ZjhnZjVpeHRqc290bjA4b3NsaTF6YmhzeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/41SIOpeqCfIru/giphy.gif"
                      alt="Earth"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                  {selectedPlanetInfo.name === "Mars" && (
                    <img
                      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXE1ejZpNWN2eXdxcWgxcWpqaG5vZ2Y5dDFvNDI3MnNza2F3eWJ5aCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/JRZwMhzk7WolG/giphy.gif"
                      alt="Mars"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                  {selectedPlanetInfo.name === "Jupiter" && (
                    <img
                      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnZkdTllZnQzd2Izc201MzUxNzd5aXE5bWhjYjJ4OTczd3BseXkxOCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/e6l0YRVArTH8I/giphy.gif"
                      alt="Jupiter"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                  {selectedPlanetInfo.name === "Neptune" && (
                    <img
                      src="/ezgif.com-gif-maker.gif"
                      alt="Neptune"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                  {selectedPlanetInfo.name === "Saturn" && (
                    <img
                      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWx4Zm92dTZqZGdqZnE1dmdjZ3dvd20wOWJmemxibHlvdXh6ejJ3cyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/IqC4IsUmtbpqn2on8W/giphy.gif"
                      alt="Saturn"
                      className="w-[52px] h-[52px] rounded-full object-cover"
                    />
                  )}
                  {selectedPlanetInfo.name === "Uranus" && (
                    <img
                      src="/uranus.gif"
                      alt="Uranus"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedPlanetInfo.name}
              </h3>
              <p className="text-blue-600 font-medium">
                {selectedPlanetInfo.hint}
              </p>
            </div>

            {showFacts && (
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-2">
                  {t.modals?.planetInfo?.factsTitle || "Amazing Facts:"}
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {selectedPlanetInfo.facts.map(
                    (fact: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{fact}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2">
                {t.modals?.planetInfo?.funFactTitle || "Fun Fact:"}
              </h4>
              <p className="text-gray-700 text-sm">
                {selectedPlanetInfo.funFact}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFacts(!showFacts)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                {showFacts
                  ? t.modals?.planetInfo?.hideFacts || "Hide Facts"
                  : t.modals?.planetInfo?.showFacts || "Show Facts"}
              </button>
              <button
                onClick={() => {
                  setShowPlanetInfo(false);
                  setShowAIsuggestions(false);
                  setShowFacts(false);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                {t.modals?.planetInfo?.close || "Close"}
              </button>
              <button
        onClick={() => {
          setShowPlanetInfo(false);
          setShowAIsuggestions(false);
          setShowFacts(false);
           setHoloMode(true)
        }}
        className=" flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/40"
      >
        HoloMode
      </button>
            </div>
          </div>
        </div>
      )}
        {/* 📺 Hologram Overlay */}
{holoMode && (
  <div
    className="fixed inset-0 z-50 bg-black backdrop-blur-sm p-2"
    onClick={() => setHoloMode(false)}
  >
    <div
      className="w-full h-full flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {loadingVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-cyan-400 font-semibold">Loading Hologram...</span>
        </div>
      )}

      <div className="relative w-full h-full max-w-[calc(100vw-20px)] max-h-[calc(100vh-20px)]">
        <video
          src="/hologram_earth.mp4"
          autoPlay
          controls
          onLoadStart={() => setLoadingVideo(false)}
          onEnded={() => setHoloMode(false)}
          className="w-full h-full object-contain"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            margin: '10px auto',
            display: 'block'
          }}
        />

        <button
          onClick={() => setHoloMode(false)}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold z-10"
        >
          Close ✖
        </button>
      </div>
    </div>
  </div>
)}

      {/* Solar System View - Mobile centered */}
      <div className="absolute inset-0 flex items-center justify-center pt-20 pb-32">
        {/* Orbit rings */}
        {planetsData.map((planet, index) => (
          <OrbitRing
            key={`orbit-${index}`}
            radius={planet.distance}
            isHighlighted={highlightedOrbit === index}
            centerX={centerX}
            centerY={centerY}
          />
        ))}

        {/* Sun - mobile optimized */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: centerX - 35,
            top: centerY - 35,
            width: 70,
            height: 70,
            zIndex: 5,
          }}
        >
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGpueWhzaGhuOHZ3czN1a2kxM2FkOG5icTdwenlldW5ndDBzMWdreCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/YqL7wobl36TXvw4SxO/giphy.gif"
            alt="Sun"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Placed planets (orbiting) */}
        {placedPlanets.map((planet) => (
          <Planet
            key={`placed-${planet.name}`}
            planetData={planet}
            isInOrbit={true}
            angle={orbitAngles[planet.name] || 0}
            onClick={() => handleOrbitingPlanetClick(planet)}
            isClickable={true}
            centerX={centerX}
            centerY={centerY}
            getPlanetImageKey={getPlanetImageKey}
          />
        ))}
      </div>

      {/* Planet Bank - Mobile optimized */}
      <div className="absolute bottom-2 left-2 right-2 z-10">
        <div className="bg-gray-900 bg-opacity-95 rounded-xl p-3 border border-gray-600 shadow-2xl">
          {/* Progress and Hint Controls at top */}
          <div className="flex items-center justify-between mb-3">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <div className="text-white text-xs font-medium">
                {t.ui?.progress || "Progress:"}
              </div>
              <div className="flex gap-1">
                {getTranslatedPlanetsData().map((planet, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index < placedPlanets.length
                        ? "bg-green-500 shadow-lg"
                        : index === placedPlanets.length
                        ? "bg-yellow-500"
                        : "bg-gray-600"
                    }`}
                    title={getTranslatedPlanetsData()[index].name}
                  />
                ))}
              </div>
              <div className="text-gray-300 text-xs">
                {placedPlanets.length}/8
              </div>
            </div>

            {/* Cool Hint Button */}
            <button
              onClick={getHint}
              className="text-yellow-400 hover:text-yellow-300 transition-all duration-300 text-xs font-medium border border-yellow-400/30 hover:border-yellow-300/50 px-2 py-1 rounded-md hover:shadow-lg hover:shadow-yellow-400/25 backdrop-blur-sm hover:scale-105"
              disabled={gameComplete}
            >
              {t.ui?.hintButton || "? Hint"}
            </button>
          </div>

          <h3 className="text-white text-lg font-bold mb-3 text-center">
            {t.ui?.planetsLeft?.replace(
              "{count}",
              availablePlanets.length.toString()
            ) || `Planets (${availablePlanets.length} left)`}
          </h3>
          <div className="grid grid-cols-4 gap-3 justify-items-center">
            {availablePlanets.map((planet) => (
              <div
                key={planet.name}
                className="text-center cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-200 p-2 rounded-lg hover:bg-gray-800"
                onClick={() => handlePlanetClick(planet)}
              >
                <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">
                    {(() => {
                      const imageKey = getPlanetImageKey(planet.name);
                      switch (imageKey) {
                        case "Mercury":
                          return (
                            <img
                              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmV3cDRtamtubXE2b2dnaG51Nno5dnBleTNmaXI0NWQxcjYzNTA1cSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/108bNXja5KRrkA/giphy.gif"
                              alt="Mercury"
                              className="w-full h-full rounded-full object-cover"
                            />
                          );
                        case "Venus":
                          return (
                            <img
                              src="/venus.webp"
                              alt="Venus"
                              className="w-full h-full rounded-full object-cover"
                            />
                          );
                        case "Earth":
                          return (
                            <img
                              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajVzbGhmZDh4aGx4Nmc4ZjhnZjVpeHRqc290bjA4b3NsaTF6YmhzeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/41SIOpeqCfIru/giphy.gif"
                              alt="Earth"
                              className="w-full h-full rounded-full object-cover"
                            />
                          );
                        case "Mars":
                          return (
                            <img
                              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXE1ejZpNWN2eXdxcWgxcWpqaG5vZ2Y5dDFvNDI3MnNza2F3eWJ5aCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/JRZwMhzk7WolG/giphy.gif"
                              alt="Mars"
                              className="w-full h-full rounded-full object-cover"
                            />
                          );
                        case "Jupiter":
                          return (
                            <img
                              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnZkdTllZnQzd2Izc201MzUxNzd5aXE5bWhjYjJ4OTczd3BseXkxOCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/e6l0YRVArTH8I/giphy.gif"
                              alt="Jupiter"
                              className="w-full h-full rounded-full object-cover"
                            />
                          );
                        case "Neptune":
                          return (
                            <img
                              src="/ezgif.com-gif-maker.gif"
                              alt="Neptune"
                              className="w-full h-full rounded-full object-cover"
                            />
                          );
                        case "Saturn":
                          return (
                            <img
                              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWx4Zm92dTZqZGdqZnE1dmdjZ3dvd20wOWJmemxibHlvdXh6ejJ3cyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/IqC4IsUmtbpqn2on8W/giphy.gif"
                              alt="Saturn"
                              className="w-[44px] h-[44px] rounded-full object-cover"
                            />
                          );
                        case "Uranus":
                          return (
                            <img
                              src="/uranus.gif"
                              alt="Uranus"
                              className="w-full h-full rounded-full object-cover"
                            />
                          );
                        default:
                          return (
                            <div className="w-full h-full rounded-full bg-gray-500"></div>
                          );
                      }
                    })()}
                  </span>
                </div>
                <span className="text-white text-xs font-semibold">
                  {planet.name}
                </span>
              </div>
            ))}
          </div>
          {availablePlanets.length > 0 && (
            <div className="text-center mt-3 p-2 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-400">
              <p className="text-blue-200 text-xs font-medium">
                {t.ui?.tapInOrder ||
                  "Tap planets in order from closest to Sun!"}
              </p>
              <p className="text-yellow-200 text-xs mt-1">
                {t.ui?.clickToLearn || "Click orbiting planets to learn more!"}
              </p>
            </div>
          )}
        </div>
        <div className="absolute bottom-4 right-4 flex flex-col items-center opacity-20 pointer-events-none">
          <img src="/logo.png" alt="Eklavya Logo" className="w-10 mb-1" />
          <span className="text-xs font-bold text-black">Eklavya</span>
        </div>
      </div>
    </div>
  );
}
