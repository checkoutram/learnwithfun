# EduQuest - Multi-Subject Learning Platform

An interactive educational game platform for Grade 5 students covering **Mathematics, English, Science, Social Science, Tamil, and Hindi** — aligned with the Cambridge and NCERT curricula.

## Play Online

**[Play Now](https://rcrxuwv6fx2na.kimi.page)** — Works on desktop, tablet, and mobile!

## Subjects & Curriculum

### Mathematics
- **Book:** Cambridge Maths Milestone 5 / NCERT Class 5
- **Worlds:** Number Kingdom (Place Value), Multiplication Forest, Division Desert, Factor Farm, Lake Fraction, Decimal City, Percentage Park, Geometry Mountain, Measurement Meadows, Data Castle

### English
- **Book 1 - Textbook:** Comprehension Cove, Vocabulary Valley, Literature Lane, Writing Woods, Spelling Springs
- **Book 2 - Grammar (Communicate with Cambridge):** Noun Nook, Verb Village, Adjective Avenue, Pronoun Park, Sentence Square, Preposition Place, Voice Valley, Word Wizard

### Science
- **Book:** Splendid Science with Cambridge
- **Worlds:** Plant Paradise, Animal Ark, Human Hub, Matter Lab, Force Field, Energy Station, Earth Explorer, Weather Watch

### Social Science
- **Book:** The World Around Us with Cambridge
- **Worlds:** History Hills, Freedom Fort, Map Meadows, Continent Cove, Civic City, Trade Town

### Tamil
- **Book 1 - Main Book:** Coming Soon (disabled)
- **Book 2 - Grammar (My Tamil Grammar Ver 3):** ezhuthu Elango, sol Sevai, vakkiyam Vilasam, peyarpu, vinaavi Veedhi, vilakkam Valaiyam

### Hindi (3rd Language)
- **Book:** Finding Text-Cum-Work Book 3 (Madhubun)
- **Worlds:** Shabd Sadan, Vyakaran Vihar, Vakya Vijay, Gadya Gyan

## Features

- **Kid's name personalization** with encouraging messages after every answer
- **6 Subjects** with multiple books and worlds
- **Dynamically generated questions** — no two playthroughs are the same
- **No-fail learning** — wrong answers show the correct answer with gentle encouragement
- **Star collection** — earn up to 5 stars per world
- **Progress tracking** — saves across all subjects via localStorage
- **Portrait mobile design** — works like a native Android app
- **100% unique answer options** — guaranteed no duplicate choices

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + custom CSS animations
- Playwright for end-to-end testing
- GitHub Actions CI/CD pipeline

## Development

```bash
npm install
npm run dev       # Development server
npm run build     # Production build
npx playwright test  # Run test suite
```

## GitHub Actions

Every push to `main` triggers:
- Install dependencies
- Install Playwright browsers
- Run full test suite on Mobile Chrome
- Upload test report as artifact

## Test Coverage

30+ Playwright tests covering:
- Menu, Name Input, Subject Select, Book Select, World Select screens
- Question answer flow (correct, wrong, double-click prevention)
- Back button confirmation dialog
- Personalized appreciation messages
- Progress persistence across subjects
- Edge cases (rapid clicking, localStorage, page refresh)
- Cross-subject navigation
- Tamil disabled book handling
