# Design Brief: Energy Chef 🧑‍🍳
*A Mindful Eating Game for Class 6 Students*

## 1. Game Overview

**Target Audience:** Class 6 students (ages 11-12)  
**Platform:** Mobile (iOS/Android)  
**Genre:** Educational Puzzle/Role-Playing  
**Core Theme:** Mindful eating and nutrition awareness through magical cooking  

### Game Concept
Players assume the role of a chef in a magical restaurant serving animal customers with specific nutritional needs. Each animal visitor presents a unique energy requirement, and players must create balanced meals by combining ingredients thoughtfully.

---

## 2. Visual Style Guide (Non-Negotiable)

### 2.1 Overall Aesthetic
- **Style:** Minimalist, clean, flat 2D design
- **Inspiration:** Math Mahjong Relax visual language
- **Principle:** Less is more - avoid visual clutter
- **Mood:** Calming, friendly, approachable

### 2.2 Color Palette

#### Primary Colors
```
Background: #F7F5F3 (Warm cream)
Primary UI: #E8DDD4 (Soft beige)
Secondary: #D4C4B0 (Light taupe)
Accent: #B8A082 (Muted gold)
```

#### Accent Colors (for highlights and feedback)
```
Success Green: #A8D5A8 (Soft mint)
Warning Orange: #F4C2A1 (Peach)
Info Blue: #B8D4E3 (Powder blue)
Error Red: #E8B4B8 (Dusty rose)
```

#### Animal Character Colors
```
Lion: #F4D03F (Warm yellow)
Turtle: #82C09A (Sage green)
Rabbit: #E8B4CB (Soft pink)
Bear: #C8A882 (Warm brown)
Owl: #A8B8D4 (Lavender blue)
```

#### Ingredient Colors
```
Proteins: #E8B4B8 (Dusty rose)
Carbohydrates: #F4C2A1 (Peach)
Healthy Fats: #A8D5A8 (Soft mint)
Vitamins: #D4A8E8 (Light purple)
```

### 2.3 Typography

#### Primary Font
**Nunito Sans** (Google Font)
- Friendly, readable sans-serif
- Rounded edges for approachability
- Excellent readability on mobile

#### Font Hierarchy
```
Game Title: Nunito Sans Bold, 32px
Level Headers: Nunito Sans SemiBold, 24px
Body Text: Nunito Sans Regular, 16px
Button Text: Nunito Sans Medium, 18px
Small Text: Nunito Sans Regular, 14px
```

---

## 3. User Interface Design

### 3.1 Main Menu Layout
```
┌─────────────────────────┐
│     Energy Chef 🧑‍🍳      │
│                         │
│    [  Play Game  ]      │
│    [  Cookbook   ]      │
│    [  Settings   ]      │
│    [    Help     ]      │
│                         │
└─────────────────────────┘
```

### 3.2 Button Styles

#### Primary Buttons
- **Shape:** Rounded rectangles (12px border radius)
- **Size:** 280px × 56px
- **Background:** Gradient from #E8DDD4 to #D4C4B0
- **Text:** Nunito Sans Medium, 18px, #5A4A3A
- **Shadow:** Soft drop shadow (0px 4px 8px rgba(0,0,0,0.1))
- **Hover State:** Slight scale (1.05x) with gentle glow

#### Secondary Buttons
- **Shape:** Circular (56px diameter)
- **Background:** #F7F5F3 with #D4C4B0 border (2px)
- **Icons:** Simple, monochromatic in #5A4A3A
- **Shadow:** Subtle (0px 2px 4px rgba(0,0,0,0.1))

#### Ingredient Buttons (Drag Items)
- **Shape:** Rounded squares (8px border radius)
- **Size:** 80px × 80px
- **Background:** Ingredient-specific colors (see color palette)
- **Border:** 3px solid white
- **Shadow:** Prominent for draggability (0px 6px 12px rgba(0,0,0,0.15))

### 3.3 Game Screen Layout
```
┌─────────────────────────┐
│ [Back] Energy Chef [⚙️] │
│                         │
│    🦁 "I need muscle!"   │
│                         │
│  ┌─────────────────┐    │
│  │   Cooking Pot   │    │
│  │      🍲         │    │
│  └─────────────────┘    │
│                         │
│ 🥩 🍞 🥑 🥕 🍎 🥛      │
│                         │
│    [  Cook Meal  ]      │
└─────────────────────────┘
```

---

## 4. Character Design

### 4.1 Animal Customers

#### Design Principles
- **Style:** Simple, geometric shapes with minimal details
- **Eyes:** Large, friendly, expressive
- **Colors:** Single primary color per animal (see palette)
- **Size:** Consistent 120px × 120px icons
- **Expression:** Always positive and encouraging

#### Character Specifications

**Lion 🦁**
- Color: #F4D03F (Warm yellow)
- Need: "I need to build muscle for a big roar!"
- Preferred: Protein-rich meals
- Personality: Confident, energetic

**Turtle 🐢**
- Color: #82C09A (Sage green)
- Need: "I need long-lasting energy for my journey!"
- Preferred: Balanced carbs and healthy fats
- Personality: Wise, patient

**Rabbit 🐰**
- Color: #E8B4CB (Soft pink)
- Need: "I need quick energy to hop around!"
- Preferred: Natural sugars and vitamins
- Personality: Playful, energetic

### 4.2 Chef Avatar
- Simple, gender-neutral design
- Chef hat in #F7F5F3
- Apron in #E8DDD4
- Friendly, welcoming expression

---

## 5. Animation Guidelines

### 5.1 Core Animation Principles
- **Duration:** All animations between 200-800ms
- **Easing:** CSS ease-out for natural feel
- **Subtlety:** Gentle, never jarring or distracting

### 5.2 Specific Animations

#### Ingredient Drag & Drop
```
Initial State: Static ingredient button
On Touch: Scale to 1.1x, lift shadow increases
During Drag: Follow finger with slight lag (100ms)
Valid Drop Zone: Gentle pulse of cooking pot
Invalid Drop: Shake animation (3 quick left-right movements)
Successful Drop: Ingredient scales down to 0.8x, fades to 50% opacity
```

#### Cooking Process
```
1. Pot bubbles gently (2-second loop)
2. Steam particles rise (simple white circles, fade out)
3. Stirring animation (spoon rotates 360° in 1.5s)
4. Completion sparkle (small stars appear and fade)
```

#### Level Completion (NON-NEGOTIABLE)
```
1. Full-screen confetti burst
   - Colors: All accent colors from palette
   - Duration: 3 seconds
   - Pattern: Falling from top, gentle physics
   
2. Happy emoji display
   - Large 😊 emoji (80px)
   - Gentle bounce animation
   - Appears 1 second after confetti starts
   
3. Success message fade-in
   - "Well done, Chef!" text
   - Gentle slide up from bottom
```

#### UI Feedback
```
Button Press: Quick scale to 0.95x, return to 1x
Page Transitions: Slide left/right (300ms)
Modal Appearance: Fade in background, scale modal from 0.8x to 1x
Loading: Gentle pulse of main UI elements
```

---

## 6. Sound Design

### 6.1 Sound Philosophy
- **Volume:** Always subtle, never overwhelming
- **Style:** Organic, warm, comforting
- **Frequency:** Avoid high-pitched or sharp sounds

### 6.2 Sound Effects Library

#### UI Interactions
```
Button Tap: Soft "pop" (like a bubble)
Ingredient Pickup: Gentle "click"
Ingredient Drop: Soft "plop"
Invalid Action: Warm "boop" (not harsh)
Page Transition: Subtle "whoosh"
```

#### Cooking Sounds
```
Pot Bubbling: Gentle, continuous bubbling
Stirring: Soft swishing sound
Ingredient Added: Light "plop" with slight echo
Cooking Complete: Satisfied "ding" (like a meditation bell)
```

#### Success Sounds
```
Level Complete: Harmonious chime sequence (3 ascending notes)
Perfect Meal: Special "magical sparkle" sound
Customer Happy: Gentle animal sound (soft roar, chirp, etc.)
```

### 6.3 Background Music
- **Genre:** Ambient/Atmospheric
- **Tempo:** Slow (60-80 BPM)
- **Instruments:** Soft piano, light strings, nature sounds
- **Loop:** Seamless 2-3 minute track
- **Volume:** 30% of sound effects volume
- **Mood:** Meditation-like, spa ambiance

---

## 7. User Experience Flow

### 7.1 Core Gameplay Loop
```
1. Animal customer appears with need
2. Player reads nutritional requirement
3. Player selects appropriate ingredients
4. Drag ingredients to cooking pot
5. Cooking animation plays
6. Meal is evaluated
7. Customer feedback (happy/suggestions)
8. Level completion or retry
9. Next customer appears
```

### 7.2 Educational Integration
- **Subtle Learning:** No explicit "lesson" moments
- **Discovery:** Players learn through experimentation
- **Positive Reinforcement:** Every attempt provides encouraging feedback
- **Progress Tracking:** Visual cookbook fills with successful recipes

### 7.3 Stress-Free Design
- **No Timers:** Players can take as long as needed
- **No Failure States:** Only "good" and "better" outcomes
- **Encouraging Messages:** "Great start!" "Even better!" "Perfect!"
- **Unlimited Attempts:** Players can retry any combination

---

## 8. Technical Specifications

### 8.1 Screen Adaptations
- **Portrait Orientation:** Primary design focus
- **Responsive Design:** Scales from 375px to 414px width
- **Safe Areas:** Account for notches and home indicators
- **Touch Targets:** Minimum 44px × 44px for accessibility

### 8.2 Performance Requirements
- **Frame Rate:** Consistent 60fps
- **Load Times:** Under 3 seconds for level transitions
- **Memory Usage:** Optimize for older devices (2GB RAM minimum)
- **Battery Impact:** Minimal - avoid complex 3D or particle effects

### 8.3 Accessibility
- **Font Size:** Scalable text (minimum 14px)
- **Color Contrast:** WCAG AA compliance
- **Audio:** Visual cues accompany all audio feedback
- **Motor:** Large touch targets, drag tolerance

---

## 9. Content Structure

### 9.1 Level Progression
```
Beginner (Levels 1-5): Single nutrient focus
- Level 1: Protein needs (Lion)
- Level 2: Carbohydrate needs (Turtle)
- Level 3: Vitamin needs (Rabbit)
- Level 4: Healthy fats (Bear)
- Level 5: Review mixed needs

Intermediate (Levels 6-10): Combination meals
Advanced (Levels 11-15): Complex nutritional balancing
```

### 9.2 Ingredient Library
```
Proteins: 🥩🐟🥚🫘 (Meat, Fish, Eggs, Beans)
Carbohydrates: 🍞🍚🥔🍝 (Bread, Rice, Potato, Pasta)
Healthy Fats: 🥑🥜🫒🐟 (Avocado, Nuts, Olive Oil, Fish)
Vitamins: 🍎🥕🍊🥬 (Apple, Carrot, Orange, Lettuce)
Dairy: 🥛🧀🥨 (Milk, Cheese, Yogurt)
```

---

## 10. Development Priorities

### 10.1 Phase 1 (MVP)
- Core cooking mechanics
- 5 animal customers
- 15 basic ingredients
- Level completion system
- Basic sound effects

### 10.2 Phase 2 (Polish)
- Full animation suite
- Background music
- Advanced customer dialogue
- Cookbook feature
- Settings menu

### 10.3 Phase 3 (Enhancement)
- Additional animals
- Seasonal ingredients
- Recipe sharing
- Progress analytics

---

## 11. Success Metrics

### 11.1 Educational Goals
- Players can identify protein sources
- Players understand balanced meal concepts
- Players develop mindful eating awareness

### 11.2 Engagement Metrics
- Session duration: 10-15 minutes
- Return rate: 70% within 7 days
- Level completion rate: 85%+

### 11.3 User Satisfaction
- Calm, relaxed feeling post-play
- Positive association with healthy eating
- Desire to share knowledge with others

---

**Final Note:** This design brief prioritizes the calming, educational experience over competitive elements. Every design decision should ask: "Does this contribute to a peaceful, learning-focused environment?" The Math Mahjong Relax aesthetic must be maintained throughout development - no exceptions to the visual style guide are permitted.
