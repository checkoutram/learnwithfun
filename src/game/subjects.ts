// Subject → Book → World hierarchy for the multi-subject learning platform

export interface WorldData {
  id: number;
  name: string;
  topic: string;
  color: string;
  icon: string;
}

export interface BookData {
  id: number;
  name: string;
  disabled?: boolean;
  worlds: WorldData[];
}

export interface SubjectData {
  id: string;
  name: string;
  color: string;
  icon: string;
  books: BookData[];
}

export const SUBJECTS: SubjectData[] = [
  {
    id: 'math',
    name: 'Mathematics',
    color: '#3F51B5',
    icon: '/assets/subject_math.png',
    books: [
      {
        id: 1,
        name: 'Math',
        worlds: [
          { id: 1, name: 'Number Kingdom', topic: 'Place Value & Large Numbers', color: '#4CAF50', icon: '/assets/world1.png' },
          { id: 2, name: 'Add & Subtract Valley', topic: 'Addition & Subtraction', color: '#66BB6A', icon: '/assets/world2.png' },
          { id: 3, name: 'Multiplication Forest', topic: 'Multiplication', color: '#2E7D32', icon: '/assets/world3.png' },
          { id: 4, name: 'Division Desert', topic: 'Division', color: '#FF8F00', icon: '/assets/world4.png' },
          { id: 5, name: 'Factor Farm', topic: 'Factors & Multiples', color: '#8BC34A', icon: '/assets/world4.png' },
          { id: 6, name: 'Lake Fraction', topic: 'Fractions', color: '#00ACC1', icon: '/assets/world5.png' },
          { id: 7, name: 'Decimal City', topic: 'Decimals', color: '#7B1FA2', icon: '/assets/world6.png' },
          { id: 8, name: 'Geometry Mountain', topic: 'Geometry & Shapes', color: '#5D4037', icon: '/assets/world8.png' },
          { id: 9, name: 'Measurement Meadows', topic: 'Measurement', color: '#F9A825', icon: '/assets/world9.png' },
          { id: 10, name: 'Data Castle', topic: 'Data Handling', color: '#3F51B5', icon: '/assets/world10.png' },
          { id: 11, name: 'Percentage Park', topic: 'Percentages', color: '#E91E63', icon: '/assets/world7.png' },
          { id: 12, name: 'Money Market', topic: 'Money', color: '#F57C00', icon: '/assets/world3.png' },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'English',
    color: '#E91E63',
    icon: '/assets/subject_english.png',
    books: [
      {
        id: 1,
        name: 'Reading (Communicate with Cambridge)',
        worlds: [
          { id: 1, name: 'Chuskit Goes to School', topic: 'Courage & Inclusion', color: '#4CAF50', icon: '/assets/eng_word.png' },
          { id: 2, name: 'Thunder Cake', topic: 'Family & Overcoming Fear', color: '#FF8F00', icon: '/assets/eng_adj.png' },
          { id: 3, name: 'Peter Pan', topic: 'Imagination & Adventure', color: '#2196F3', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'The Coral Reef', topic: 'Ocean & Environment', color: '#00BCD4', icon: '/assets/eng_prep.png' },
          { id: 5, name: 'Inspiring Women', topic: 'Biographies of Great Women', color: '#E91E63', icon: '/assets/eng_noun.png' },
          { id: 6, name: 'Go Green!', topic: 'Environment & Conservation', color: '#4CAF50', icon: '/assets/eng_verb.png' },
          { id: 7, name: "A Midsummer Night's Dream", topic: 'Classic Literature', color: '#7B1FA2', icon: '/assets/eng_voice.png' },
          { id: 8, name: 'The Immigrant Experience', topic: 'Journeys & Homes', color: '#009688', icon: '/assets/eng_pronoun.png' },
          { id: 9, name: 'The Umbrella', topic: 'Kindness & Giving', color: '#3F51B5', icon: '/assets/eng_word.png' },
          { id: 10, name: 'Explorers', topic: 'Discovery & Exploration', color: '#795548', icon: '/assets/eng_sentence.png' },
        ],
      },
      {
        id: 2,
        name: 'Grammar (Communicate with Cambridge)',
        worlds: [
          { id: 1, name: 'Noun Nook', topic: 'Nouns', color: '#4CAF50', icon: '/assets/eng_noun.png' },
          { id: 2, name: 'Verb Village', topic: 'Verbs & Tenses', color: '#F44336', icon: '/assets/eng_verb.png' },
          { id: 3, name: 'Adjective Avenue', topic: 'Adjectives & Adverbs', color: '#FF9800', icon: '/assets/eng_adj.png' },
          { id: 4, name: 'Pronoun Park', topic: 'Pronouns & Articles', color: '#00BCD4', icon: '/assets/eng_pronoun.png' },
          { id: 5, name: 'Sentence Square', topic: 'Sentence Types', color: '#673AB7', icon: '/assets/eng_sentence.png' },
          { id: 6, name: 'Preposition Place', topic: 'Prepositions & Conjunctions', color: '#795548', icon: '/assets/eng_prep.png' },
          { id: 7, name: 'Voice Valley', topic: 'Active & Passive Voice', color: '#E91E63', icon: '/assets/eng_voice.png' },
          { id: 8, name: 'Word Wizard', topic: 'Synonyms, Antonyms & Prefixes', color: '#3F51B5', icon: '/assets/eng_word.png' },
        ],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    color: '#4CAF50',
    icon: '/assets/subject_science.png',
    books: [
      {
        id: 1,
        name: 'Splendid Science Level 5',
        worlds: [
          { id: 1, name: 'Unit 1A: Living Things', topic: 'Characteristics of Living Things & Vertebrates', color: '#4CAF50', icon: '/assets/sci_plants.png' },
          { id: 2, name: 'Unit 1B: Invertebrates', topic: 'Invertebrates & Classification Keys', color: '#66BB6A', icon: '/assets/sci_animals.png' },
          { id: 3, name: 'Unit 2A: Parts of a Plant', topic: 'Plant Parts & Plant Growth', color: '#FF8F00', icon: '/assets/sci_energy.png' },
          { id: 4, name: 'Unit 2B: Seed Dispersal', topic: 'How Seeds Travel', color: '#FFB300', icon: '/assets/sci_earth.png' },
          { id: 5, name: 'Unit 3: Ecosystems', topic: 'Food Chains & Human Impact', color: '#E91E63', icon: '/assets/sci_human.png' },
          { id: 6, name: 'Unit 4A: Materials', topic: 'Properties of Materials & Changing States', color: '#F06292', icon: '/assets/sci_force.png' },
          { id: 7, name: 'Unit 4B: The Water Cycle', topic: 'Evaporation, Condensation & Precipitation', color: '#795548', icon: '/assets/sci_matter.png' },
          { id: 8, name: 'Unit 5: Forces', topic: 'Types of Forces, Gravity & Friction', color: '#00BCD4', icon: '/assets/sci_weather.png' },
        ],
      },
    ],
  },
  {
    id: 'social',
    name: 'Social Science',
    color: '#FF9800',
    icon: '/assets/subject_social.png',
    books: [
      {
        id: 1,
        name: 'The World Around Us',
        worlds: [
          { id: 1, name: 'Unit 1: Early Humans', topic: 'Stone Age, Bronze Age & Iron Age', color: '#795548', icon: '/assets/soc_history.png' },
          { id: 2, name: 'Unit 2: Ancient Civilizations', topic: 'Mesopotamia, Egypt & Indus Valley', color: '#F44336', icon: '/assets/soc_globe.png' },
          { id: 3, name: 'Unit 3: The Medieval World', topic: 'Byzantine Empire, Islamic Golden Age & Crusades', color: '#2196F3', icon: '/assets/soc_map.png' },
          { id: 4, name: 'Unit 4: Renaissance & Exploration', topic: 'Renaissance & Age of Exploration', color: '#009688', icon: '/assets/soc_civic.png' },
          { id: 5, name: 'Unit 5: Government & Citizenship', topic: 'Types of Government, Citizenship & UN', color: '#673AB7', icon: '/assets/soc_civic.png' },
          { id: 6, name: 'Unit 6: Trade & Economics', topic: 'Trade Routes, Economic Systems & Globalization', color: '#4CAF50', icon: '/assets/soc_globe.png' },
        ],
      },
    ],
  },
  {
    id: 'tamil',
    name: 'Tamil',
    color: '#009688',
    icon: '/assets/subject_tamil.png',
    books: [
      {
        id: 1,
        name: 'Main Book (Coming Soon)',
        disabled: true,
        worlds: [],
      },
      {
        id: 2,
        name: 'My Tamil Grammar Ver 3',
        worlds: [
          { id: 1, name: 'பெயர்ச்சொல் & வினைச்சொல்', topic: 'Nouns, Verbs & Phrases', color: '#FF5722', icon: '/assets/eng_noun.png' },
          { id: 2, name: 'மூவிடப்பெயர்கள்', topic: 'Pronouns, Conjunctions & Compound Sentences', color: '#2196F3', icon: '/assets/eng_word.png' },
          { id: 3, name: 'இணைச்சொற்கள்', topic: 'Compound Words, Sounds & Idioms', color: '#4CAF50', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'வேற்றுமை & இடைச்சொல்', topic: 'Case Suffixes, Adverbs & Antonyms', color: '#9C27B0', icon: '/assets/eng_adj.png' },
          { id: 5, name: 'வினாச்சொற்கள் & காலம்', topic: 'Question Words, Tenses & Interrogatives', color: '#FF9800', icon: '/assets/eng_verb.png' },
          { id: 6, name: 'தொடர் வகைகள்', topic: 'Exclamatory, Imperative & Proverbs', color: '#00BCD4', icon: '/assets/eng_prep.png' },
        ],
      },
    ],
  },
  {
    id: 'hindi',
    name: 'Hindi (3rd Language)',
    color: '#FF5722',
    icon: '/assets/subject_hindi.png',
    books: [
      {
        id: 1,
        name: 'Finding Text-Cum Work Book 3',
        worlds: [
          { id: 1, name: 'मेहनत', topic: 'Hard Work & Perseverance', color: '#FF5722', icon: '/assets/eng_word.png' },
          { id: 2, name: 'पंछी (Poem)', topic: 'Birds & Nature', color: '#FFB300', icon: '/assets/eng_adj.png' },
          { id: 3, name: 'चाँदनी रात (Poem)', topic: 'Moonlit Night', color: '#4CAF50', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'दोस्ती', topic: 'Friendship', color: '#E91E63', icon: '/assets/eng_noun.png' },
          { id: 5, name: 'ईमानदारी', topic: 'Honesty & Truth', color: '#2196F3', icon: '/assets/eng_verb.png' },
          { id: 6, name: 'बहादुर', topic: 'Bravery & Courage', color: '#00BCD4', icon: '/assets/eng_voice.png' },
          { id: 7, name: 'बचपन (Poem)', topic: 'Childhood Memories', color: '#F44336', icon: '/assets/eng_prep.png' },
          { id: 8, name: 'अक्ल बड़ी या भैंस', topic: 'Wisdom & Clever Solutions', color: '#9C27B0', icon: '/assets/eng_pronoun.png' },
          { id: 9, name: 'हमारा भारत (Poem)', topic: 'Our India - Patriotism', color: '#FF9800', icon: '/assets/eng_word.png' },
          { id: 10, name: 'प्रकृति (Poem)', topic: 'Nature & Environment', color: '#3F51B5', icon: '/assets/eng_sentence.png' },
        ],
      },
    ],
  },
];
