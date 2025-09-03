# Design Brief: Pythagoras' Playhouse 📐
*An Interactive Pythagorean Theorem Explorer for Class 6 Students*

## 1. Game Overview

**Target Audience:** Class 6 students (ages 11-12)  
**Platform:** Mobile (iOS/Android) / Web  
**Genre:** Educational Interactive Puzzle  
**Core Theme:** Visual exploration of the Pythagorean theorem through magical architecture  

### Game Concept
Players assume the role of an architect in a magical playhouse where they can build and test right-angled triangles. The screen shows a right-angled triangle with squares attached to each side. Players can drag the corners to change the lengths of the two shorter sides (a and b), watching the squares resize instantly. The magic happens when pressing "Animate!" - the two smaller squares break into shimmering tiles that flow like liquid to perfectly fill the largest square, visually proving that a²+b²=c².

---

## 2. Visual Style Guide (Non-Negotiable)

### 2.1 Overall Aesthetic
- **Style:** Minimalist, clean, flat 2D design
- **Inspiration:** Math Mahjong Relax visual language
- **Principle:** Less is more - avoid visual clutter
- **Mood:** Calming, magical, approachable

### 2.2 Color Palette

#### Primary Colors
```
Background: #F7F5F3 (Warm cream)
Primary UI: #E8DDD4 (Soft beige)
Secondary: #D4C4B0 (Light taupe)
Accent: #B8A082 (Muted gold)
```

#### Triangle and Squares
```
Triangle Outline: #8B7355 (Warm brown)
Side A Square: #E8B4CB (Soft pink)
Side B Square: #B8D4E3 (Powder blue)
Side C Square: #A8D5A8 (Soft mint)
Drag Handles: #F4C2A1 (Peach)
```

#### Animation Effects
```
Shimmer Effect: #FFE4B5 (Moccasin)
Flow Particles: #E6E6FA (Lavender)
Success Glow: #98FB98 (Pale green)
Magic Sparkles: #F0E68C (Khaki)
```

### 2.3 Typography
- **Primary Font:** Nunito Sans (friendly, readable sans-serif)
- **Weights:** 400 (regular), 600 (semi-bold), 700 (bold)
- **Hierarchy:**
  - Title: 32px, Bold
  - Instructions: 18px, Semi-bold
  - Labels: 14px, Regular
  - Values: 16px, Semi-bold

---

## 3. User Interface Design

### 3.1 Layout Structure
```
┌─────────────────────────────────────┐
│ Header: "Pythagoras' Playhouse 📐"  │
├─────────────────────────────────────┤
│                                     │
│        Interactive Triangle         │
│        with Squares Area            │
│                                     │
├─────────────────────────────────────┤
│ Values Display: a² + b² = c²        │
├─────────────────────────────────────┤
│     [Animate!] [Reset] [Hint]       │
└─────────────────────────────────────┘
```

### 3.2 Interactive Elements

#### Triangle
- **Style:** Clean outline, 3px stroke
- **Corners:** Draggable circular handles (20px diameter)
- **Constraint:** Always maintains right angle at one corner
- **Color:** Warm brown outline with subtle drop shadow

#### Squares
- **Style:** Filled rectangles with soft borders
- **Borders:** 2px solid white with subtle inner shadow
- **Labels:** Side length displayed in center
- **Animation:** Smooth resize with ease-in-out transition

#### Buttons
```css
Primary Button (Animate!):
- Background: Linear gradient (mint to soft green)
- Padding: 16px 32px
- Border-radius: 12px
- Font: 18px semi-bold
- Shadow: 0 4px 12px rgba(168, 213, 168, 0.3)

Secondary Buttons (Reset/Hint):
- Background: Soft beige
- Padding: 12px 24px
- Border-radius: 8px
- Font: 16px regular
- Shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
```

---

## 4. Animation Design

### 4.1 Core Animations

#### Tile Breaking Animation
1. **Phase 1:** Squares divide into grid tiles (0.5s)
2. **Phase 2:** Tiles shimmer and lift slightly (0.3s)
3. **Phase 3:** Tiles flow in curved paths to target square (1.2s)
4. **Phase 4:** Tiles settle and merge (0.4s)

#### Visual Effects
- **Shimmer:** Gentle opacity pulsing (0.8s loop)
- **Flow Path:** Bezier curves with trailing particles
- **Merge Effect:** Tiles fade into solid color with glow
- **Success Burst:** Full-screen gentle confetti (2s)

### 4.2 Interaction Feedback
- **Drag Response:** Handle scales to 1.2x when touched
- **Value Updates:** Numbers count up/down smoothly
- **Button Press:** Scale down to 0.95x then bounce back

### 4.3 Success Celebration
```
Confetti Elements:
- Colors: All palette colors in soft transparency
- Shapes: Small squares and triangles
- Motion: Gentle fall with slight rotation
- Duration: 3 seconds with fade-out
- Emoji: 🎉 or 😊 (large, bouncing)
```

---

## 5. Sound Design

### 5.1 Sound Effects Library
```
Drag Start: Soft "pop" (150ms)
Drag Move: Subtle "whoosh" (100ms)
Value Change: Gentle "tick" (80ms)
Button Press: Warm "click" (120ms)
Animation Start: Magical "chime" (300ms)
Tile Break: Soft "crack" sequence (400ms)
Flow Motion: Gentle "swish" (per tile)
Merge Complete: Satisfying "ding" (250ms)
Success: Harmonious chord progression (1.5s)
```

### 5.2 Background Audio
- **Style:** Calm, ambient instrumental
- **Tempo:** 60-70 BPM
- **Instruments:** Soft piano, light strings, gentle bells
- **Volume:** 20% of UI sounds
- **Loop:** Seamless 2-minute track

---

## 6. User Experience Flow

### 6.1 Learning Progression
1. **Introduction:** Simple tutorial showing drag interaction
2. **Exploration:** Free play with guided hints
3. **Discovery:** Player notices square area relationships
4. **Revelation:** Animation demonstrates theorem visually
5. **Mastery:** Player experiments with different triangles

### 6.2 Feedback Mechanisms
- **Visual:** Real-time area calculations
- **Textual:** "a² + b² = c²" equation updates live
- **Emotional:** Celebration animations for discoveries
- **Educational:** Gentle hints about mathematical relationships

---

## 7. Technical Specifications

### 7.1 Interactive Features
- **Drag Constraints:** Maintain right angle, minimum/maximum side lengths
- **Real-time Calculation:** Live updates of areas and equation
- **Smooth Animations:** 60fps target with CSS transitions
- **Responsive Design:** Adapts to mobile and tablet screens

### 7.2 Accessibility
- **Touch Targets:** Minimum 44px for mobile interaction
- **Visual Contrast:** WCAG AA compliant color combinations
- **Text Scaling:** Supports device accessibility settings
- **Alternative Input:** Keyboard navigation support

---

## 8. Educational Value

### 8.1 Learning Objectives
- **Visual Understanding:** See geometric relationships in action
- **Mathematical Discovery:** Self-guided exploration of Pythagorean theorem
- **Spatial Reasoning:** Understand area conservation and transformation
- **Interactive Engagement:** Learn through play and experimentation

### 8.2 Curriculum Alignment
- **Grade Level:** Class 6 mathematics
- **Topics:** Right triangles, areas, square numbers
- **Skills:** Problem-solving, pattern recognition, mathematical reasoning

---

## 9. Implementation Notes

### 9.1 Development Priority
1. **Core Triangle Interaction** (Week 1)
2. **Real-time Calculations** (Week 1)
3. **Basic Animation System** (Week 2)
4. **Tile Flow Animation** (Week 3)
5. **Sound Integration** (Week 4)
6. **Polish and Testing** (Week 5)

### 9.2 Platform Considerations
- **Web:** Canvas or SVG for smooth animations
- **Mobile:** Touch optimization and performance
- **Cross-platform:** Consistent experience across devices

---

*This design brief ensures a calming, educational experience that makes the Pythagorean theorem tangible and magical for young learners.*
