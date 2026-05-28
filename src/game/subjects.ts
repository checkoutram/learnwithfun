// Subject → Book → World hierarchy matching ACTUAL textbooks from uploaded photos

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
        name: 'Mathematics',
        worlds: [
          { id: 1, name: 'Large Numbers', topic: 'Place Value & Large Numbers', color: '#4CAF50', icon: '/assets/world1.png' },
          { id: 2, name: 'Four Operations', topic: 'Addition, Subtraction, Multiplication, Division', color: '#66BB6A', icon: '/assets/world2.png' },
          { id: 3, name: 'Playing with Numbers', topic: 'Factors, Multiples, Divisibility', color: '#2E7D32', icon: '/assets/world3.png' },
          { id: 4, name: 'Fractions', topic: 'Types, Equivalent, Like/Unlike Fractions', color: '#FF8F00', icon: '/assets/world4.png' },
          { id: 5, name: 'Decimals', topic: 'Decimal Operations & Conversion', color: '#8BC34A', icon: '/assets/world5.png' },
          { id: 6, name: 'Geometry', topic: 'Lines, Angles, Shapes, Construction', color: '#00ACC1', icon: '/assets/world6.png' },
          { id: 7, name: 'Patterns and Symmetry', topic: 'Number Patterns & Symmetry', color: '#7B1FA2', icon: '/assets/world7.png' },
          { id: 8, name: 'Measurements', topic: 'Length, Weight, Capacity, Perimeter', color: '#5D4037', icon: '/assets/world8.png' },
          { id: 9, name: 'Time and Temperature', topic: 'Time, Calendar, Temperature', color: '#F9A825', icon: '/assets/world9.png' },
          { id: 10, name: 'Mathematics in Daily Life', topic: 'Profit/Loss, Percentage, Money', color: '#3F51B5', icon: '/assets/world10.png' },
          { id: 11, name: 'Mensuration', topic: 'Area, Volume, Perimeter', color: '#E91E63', icon: '/assets/world3.png' },
          { id: 12, name: 'Data Handling', topic: 'Pictographs, Bar Graphs, Tables', color: '#F57C00', icon: '/assets/world7.png' },
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
        name: 'Reader (Communicate with Cambridge)',
        worlds: [
          { id: 1, name: 'Chuskit Goes to School', topic: 'Courage & Inclusion', color: '#4CAF50', icon: '/assets/eng_word.png' },
          { id: 2, name: 'Thunder Cake', topic: 'Family & Overcoming Fear', color: '#FF8F00', icon: '/assets/eng_adj.png' },
          { id: 3, name: 'Who Is Peter Pan?', topic: 'Imagination & Adventure', color: '#2196F3', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'What Lucy Found', topic: 'The Ant and the Grasshopper', color: '#00BCD4', icon: '/assets/eng_prep.png' },
          { id: 5, name: "Nagendra's Journey by Boat", topic: 'The Rani of Jhansi', color: '#E91E63', icon: '/assets/eng_noun.png' },
          { id: 6, name: 'Heidi Learns to Read', topic: 'The Magic Key', color: '#4CAF50', icon: '/assets/eng_verb.png' },
          { id: 7, name: 'Gulliver Arrives in Lilliput', topic: 'Size, Perspective & Adventure', color: '#7B1FA2', icon: '/assets/eng_voice.png' },
          { id: 8, name: 'Owls in the Family', topic: 'Nature & Responsibility', color: '#009688', icon: '/assets/eng_pronoun.png' },
          { id: 9, name: 'In Anticipation of Friendship', topic: 'Trust & New Beginnings', color: '#3F51B5', icon: '/assets/eng_word.png' },
          { id: 10, name: 'The Thirteenth Cookie', topic: 'Generosity & Kindness', color: '#795548', icon: '/assets/eng_sentence.png' },
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
        name: 'Science (5 Units, 14 Chapters)',
        worlds: [
          { id: 1, name: 'Reproduction in Plants', topic: 'Unit 1: Plant Life', color: '#4CAF50', icon: '/assets/sci_plants.png' },
          { id: 2, name: 'Types of Animals', topic: 'Unit 2: Animal Life', color: '#66BB6A', icon: '/assets/sci_animals.png' },
          { id: 3, name: 'Health and Diseases', topic: 'Unit 3: Human Body', color: '#E91E63', icon: '/assets/sci_human.png' },
          { id: 4, name: 'Skeletal System and Muscles', topic: 'Unit 3: Human Body', color: '#F06292', icon: '/assets/sci_human.png' },
          { id: 5, name: 'Nervous and Respiratory System', topic: 'Unit 3: Human Body', color: '#FF8F00', icon: '/assets/sci_human.png' },
          { id: 6, name: 'Safety and First Aid', topic: 'Unit 3: Human Body', color: '#FFB300', icon: '/assets/img_safety.png' },
          { id: 7, name: 'Solids, Liquids and Gases', topic: 'Unit 4: Materials & Matter', color: '#795548', icon: '/assets/sci_matter.png' },
          { id: 8, name: 'Rocks and Minerals', topic: 'Unit 4: Materials & Matter', color: '#00BCD4', icon: '/assets/img_rocks.png' },
          { id: 9, name: 'Light, Shadows and Eclipses', topic: 'Unit 4: Materials & Matter', color: '#9C27B0', icon: '/assets/sci_energy.png' },
          { id: 10, name: 'Force and Energy', topic: 'Unit 4: Materials & Matter', color: '#3F51B5', icon: '/assets/sci_force.png' },
          { id: 11, name: 'Simple Machines', topic: 'Unit 4: Materials & Matter', color: '#009688', icon: '/assets/sci_force.png' },
          { id: 12, name: 'Air and Water', topic: 'Unit 5: Nature, Space & Environment', color: '#2196F3', icon: '/assets/img_water_cycle.png' },
          { id: 13, name: 'Earth and Natural Disasters', topic: 'Unit 5: Nature, Space & Environment', color: '#FF5722', icon: '/assets/sci_earth.png' },
          { id: 14, name: 'Conservation and Waste Management', topic: 'Unit 5: Nature, Space & Environment', color: '#607D8B', icon: '/assets/sci_weather.png' },
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
        name: 'Social Science (6 Units, 19 Chapters)',
        worlds: [
          { id: 1, name: 'Our Earth', topic: 'Globes, Maps, Latitudes, Continents', color: '#795548', icon: '/assets/soc_globe.png' },
          { id: 2, name: 'Climate on Earth', topic: 'Climate Zones, Equatorial, Desert, Temperate', color: '#2196F3', icon: '/assets/soc_map.png' },
          { id: 3, name: 'Our Environment', topic: 'Pollution, Conservation, Natural Disasters', color: '#4CAF50', icon: '/assets/soc_civic.png' },
          { id: 4, name: 'Global Village', topic: 'World Heritage Sites, United Nations', color: '#E91E63', icon: '/assets/soc_history.png' },
          { id: 5, name: 'Story of Our Independence', topic: 'First War of Independence, Freedom Struggle', color: '#FF9800', icon: '/assets/img_indian_flag.png' },
          { id: 6, name: 'Government', topic: 'Our Government, Important Acts by Parliament', color: '#673AB7', icon: '/assets/img_parliament.png' },
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
        name: 'Tamil Grammar (36 Topics)',
        worlds: [
          { id: 1, name: 'எழுத்துக்கள்', topic: 'Letter Types, uyir, mei, combinations', color: '#FF5722', icon: '/assets/eng_noun.png' },
          { id: 2, name: 'பெயர்ச்சொல்', topic: 'Nouns, plurals, genders, cases', color: '#2196F3', icon: '/assets/eng_word.png' },
          { id: 3, name: 'வினைச்சொல்', topic: 'Verbs, tenses, voice, mood', color: '#4CAF50', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'இடைச்சொல் & வேற்றுமை', topic: 'Adverbs, prepositions, case suffixes', color: '#9C27B0', icon: '/assets/eng_adj.png' },
          { id: 5, name: 'சொல் விளையாட்டு', topic: 'Compound words, proverbs, idioms', color: '#FF9800', icon: '/assets/eng_verb.png' },
          { id: 6, name: 'தமிழ் இலக்கணம்', topic: 'Sentence types, essay, letter, numbers', color: '#00BCD4', icon: '/assets/eng_prep.png' },
        ],
      },
    ],
  },
  {
    id: 'hindi',
    name: 'Hindi',
    color: '#FF5722',
    icon: '/assets/subject_hindi.png',
    books: [
      {
        id: 1,
        name: 'Finding Text-Cum Work Book 3',
        worlds: [
          { id: 1, name: 'हिम्मती बच्चे', topic: 'दुर्वचन व्यंजन - Brave Children', color: '#FF5722', icon: '/assets/eng_word.png' },
          { id: 2, name: 'डॉक्टर का कहना', topic: 'संयुक्त व्यंजन - The Doctor Says', color: '#FFB300', icon: '/assets/eng_adj.png' },
          { id: 3, name: 'सूर्य से चंद्रमा की यात्रा', topic: 'व्यंजन वर्गीकरण - Journey to the Moon', color: '#4CAF50', icon: '/assets/eng_sentence.png' },
          { id: 4, name: 'मुझ पहली मेरी', topic: 'एक-अनेक - Reading for Pleasure', color: '#E91E63', icon: '/assets/eng_noun.png' },
          { id: 5, name: 'आप, तुम और मैं', topic: 'सर्वनाम - Pronouns', color: '#2196F3', icon: '/assets/eng_verb.png' },
          { id: 6, name: 'आया-गया', topic: 'क्रिया - Verbs', color: '#00BCD4', icon: '/assets/eng_voice.png' },
          { id: 7, name: 'कौन करे क्या', topic: 'विशेषण - Adjectives', color: '#F44336', icon: '/assets/eng_prep.png' },
          { id: 8, name: 'नव प्रभात', topic: 'वाचक-संदेश - New Dawn', color: '#9C27B0', icon: '/assets/eng_pronoun.png' },
          { id: 9, name: 'कृष्णा की बटर बॉल', topic: 'कहानी - Krishna\'s Butter Ball', color: '#FF9800', icon: '/assets/eng_word.png' },
          { id: 10, name: 'वसंत ऋतु', topic: 'प्रकृति - Spring Season', color: '#3F51B5', icon: '/assets/eng_sentence.png' },
        ],
      },
    ],
  },
];
