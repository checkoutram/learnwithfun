# Math Quest: Grade 5 Adventure

An interactive educational math game for Grade 5 students, covering the complete **Cambridge Primary Mathematics Stage 5** and **NCERT Class 5** curriculum.

## Play Online

**[Play Now](https://rcrxuwv6fx2na.kimi.page)** — Works in any browser on desktop, tablet, and mobile!

## Download APK

Download the Android APK file to install directly on your Android phone or tablet:
- **[MathQuest-Grade5-Adventure.apk](./MathQuest-Grade5-Adventure.apk)** (33 MB)

> To install: Download the APK, open it on your Android device, and tap "Install". You may need to enable "Install from Unknown Sources" in Settings.

## 10 Math Worlds

| World | Topic | Description |
|-------|-------|-------------|
| 1. Number Kingdom | Place Value | 5-6 digit numbers, expanded form |
| 2. Multiplication Forest | Multiplication | 3-digit by 1-digit, multiplying by 10/100 |
| 3. Division Desert | Division | Division with remainders |
| 4. Factor Farm | Factors & Multiples | Factors, multiples, prime numbers, HCF/LCM |
| 5. Lake Fraction | Fractions | Addition, subtraction, comparison |
| 6. Decimal City | Decimals | Decimal operations, fraction conversion |
| 7. Percentage Park | Percentages | Percentage calculations, conversions |
| 8. Geometry Mountain | Geometry | Angles, shapes, 3D figures |
| 9. Measurement Meadows | Measurement | Length, mass conversions, area, perimeter |
| 10. Data Castle | Data Handling | Bar charts, probability, data interpretation |

## Features

- **No-fail learning** — Wrong answers let you try again with helpful explanations
- **Dynamically generated questions** — 50+ question patterns for endless variety
- **Star collection system** — Earn up to 5 stars per world
- **Progressive unlocking** — Complete worlds to unlock new math topics
- **Persistent progress** — Saves locally so students can continue anytime
- **Beautiful themed worlds** — 10 unique environments with gorgeous artwork
- **Works offline** — Once loaded, no internet connection needed

## Screenshots

### Menu Screen
Beautiful magical landscape with floating math symbols and a cute math wizard mascot.

### World Select
Grid of 10 themed world cards showing lock/unlock status and star ratings.

### Question Screen
Card-based questions with large, touch-friendly answer buttons and immediate visual feedback.

### World Complete
Celebration screen with confetti, bouncing trophy, and star rating.

## Tech Stack

- **React + TypeScript + Vite** — Fast, modern web development
- **Tailwind CSS** — Utility-first styling
- **Capacitor** — Native Android/iOS app wrapper
- **Custom Game Engine** — State management, question generation, progress tracking

## Curriculum Alignment

This game covers all topics from:
- **Cambridge Primary Mathematics Stage 5** (Checkpoints, Numbers, Geometry, Measure, Handling Data)
- **NCERT Class 5 Mathematics** (The Fish Tale, Shapes and Angles, How Many Squares, Parts and Wholes, etc.)

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Build Android APK
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`

## License

This project is open source and free to use for educational purposes.
