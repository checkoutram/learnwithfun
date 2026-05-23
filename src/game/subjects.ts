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
        name: 'Cambridge Maths Milestone 5',
        worlds: [
          { id: 1, name: 'Number Kingdom', topic: 'Place Value', color: '#4CAF50', icon: '/assets/world1.png' },
          { id: 2, name: 'Multiplication Forest', topic: 'Multiplication', color: '#2E7D32', icon: '/assets/world2.png' },
          { id: 3, name: 'Division Desert', topic: 'Division', color: '#FF8F00', icon: '/assets/world3.png' },
          { id: 4, name: 'Factor Farm', topic: 'Factors & Multiples', color: '#8BC34A', icon: '/assets/world4.png' },
          { id: 5, name: 'Lake Fraction', topic: 'Fractions', color: '#00ACC1', icon: '/assets/world5.png' },
          { id: 6, name: 'Decimal City', topic: 'Decimals', color: '#7B1FA2', icon: '/assets/world6.png' },
          { id: 7, name: 'Percentage Park', topic: 'Percentages', color: '#E91E63', icon: '/assets/world7.png' },
          { id: 8, name: 'Geometry Mountain', topic: 'Geometry', color: '#5D4037', icon: '/assets/world8.png' },
          { id: 9, name: 'Measurement Meadows', topic: 'Measurement', color: '#F9A825', icon: '/assets/world9.png' },
          { id: 10, name: 'Data Castle', topic: 'Data Handling', color: '#3F51B5', icon: '/assets/world10.png' },
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
        name: 'Textbook',
        worlds: [
          { id: 1, name: 'Comprehension Cove', topic: 'Reading Comprehension', color: '#2196F3', icon: '/assets/eng_word.png' },
          { id: 2, name: 'Vocabulary Valley', topic: 'Vocabulary', color: '#9C27B0', icon: '/assets/eng_adj.png' },
          { id: 3, name: 'Literature Lane', topic: 'Literature', color: '#FF5722', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'Writing Woods', topic: 'Creative Writing', color: '#009688', icon: '/assets/eng_prep.png' },
          { id: 5, name: 'Spelling Springs', topic: 'Spelling & Phonics', color: '#FF9800', icon: '/assets/eng_noun.png' },
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
        name: 'Splendid Science with Cambridge',
        worlds: [
          { id: 1, name: 'Plant Paradise', topic: 'Plants & Reproduction', color: '#4CAF50', icon: '/assets/sci_plants.png' },
          { id: 2, name: 'Animal Ark', topic: 'Animals & Adaptations', color: '#FF8F00', icon: '/assets/sci_animals.png' },
          { id: 3, name: 'Human Hub', topic: 'Human Body & Health', color: '#E91E63', icon: '/assets/sci_human.png' },
          { id: 4, name: 'Matter Lab', topic: 'Matter & Its States', color: '#2196F3', icon: '/assets/sci_matter.png' },
          { id: 5, name: 'Force Field', topic: 'Force & Motion', color: '#9C27B0', icon: '/assets/sci_force.png' },
          { id: 6, name: 'Energy Station', topic: 'Electricity, Light & Sound', color: '#FFEB3B', icon: '/assets/sci_energy.png' },
          { id: 7, name: 'Earth Explorer', topic: 'Rocks, Minerals & Fossils', color: '#795548', icon: '/assets/sci_earth.png' },
          { id: 8, name: 'Weather Watch', topic: 'Weather, Seasons & Environment', color: '#00BCD4', icon: '/assets/sci_weather.png' },
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
        name: 'The World Around Us with Cambridge',
        worlds: [
          { id: 1, name: 'History Hills', topic: 'Ancient Civilizations', color: '#795548', icon: '/assets/soc_history.png' },
          { id: 2, name: 'Freedom Fort', topic: 'Freedom Movement', color: '#F44336', icon: '/assets/soc_civic.png' },
          { id: 3, name: 'Map Meadows', topic: 'Maps & Geography', color: '#2196F3', icon: '/assets/soc_map.png' },
          { id: 4, name: 'Continent Cove', topic: 'Continents, Oceans & Climate', color: '#009688', icon: '/assets/soc_globe.png' },
          { id: 5, name: 'Civic City', topic: 'Government & Citizenship', color: '#673AB7', icon: '/assets/soc_civic.png' },
          { id: 6, name: 'Trade Town', topic: 'Economics & Trade', color: '#FF9800', icon: '/assets/soc_globe.png' },
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
        name: 'Grammar (My Tamil Grammar Ver 3)',
        worlds: [
          { id: 1, name: 'ezhuthu Elango', topic: 'Tamil Alphabets', color: '#FF5722', icon: '/assets/eng_noun.png' },
          { id: 2, name: 'sol Sevai', topic: 'Word Formation', color: '#2196F3', icon: '/assets/eng_word.png' },
          { id: 3, name: 'vakkiyam Vilasam', topic: 'Sentence Types', color: '#4CAF50', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'peyarp佩奇pu', topic: 'Nouns & Pronouns', color: '#9C27B0', icon: '/assets/eng_pronoun.png' },
          { id: 5, name: 'vinaavi Veedhi', topic: 'Verbs & Tenses', color: '#E91E63', icon: '/assets/eng_verb.png' },
          { id: 6, name: 'vilakkam Valaiyam', topic: 'Grammar Rules', color: '#FF9800', icon: '/assets/eng_prep.png' },
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
        name: 'Finding Text-Cum-Work Book 3 (Madhubun)',
        worlds: [
          { id: 1, name: 'Shabd Sadan', topic: 'Vocabulary & Word Meanings', color: '#FF5722', icon: '/assets/eng_word.png' },
          { id: 2, name: 'Vyakaran Vihar', topic: 'Grammar (Ling, Vachan, Kaal)', color: '#4CAF50', icon: '/assets/eng_adj.png' },
          { id: 3, name: 'Vakya Vijay', topic: 'Sentence Formation', color: '#2196F3', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'Gadya Gyan', topic: 'Comprehension', color: '#FF9800', icon: '/assets/eng_noun.png' },
        ],
      },
    ],
  },
];
