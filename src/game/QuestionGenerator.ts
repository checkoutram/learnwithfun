// Math Question Generator for Grade 5 (Cambridge Stage 5 / NCERT Class 5)

export interface MathQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export class QuestionGenerator {
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // WORLD 1: Place Value (5-6 digit numbers)
  static generatePlaceValueQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const templates = [
      (num: number, digit: number, place: string, value: number) => ({
        question: `What is the place value of digit ${digit} in ${num.toLocaleString()}?`,
        options: [value.toString(), (value * 10).toString(), (value / 10).toString(), (value * 2).toString()],
        correctIndex: 0,
        explanation: `In ${num.toLocaleString()}, the digit ${digit} is in the ${place} place, so its value is ${value}.`
      }),
      (num: number, digit: number, place: string, value: number) => ({
        question: `In the number ${num.toLocaleString()}, what does the digit ${digit} represent?`,
        options: [`${place} place`, `${value * 10}`.startsWith('1') ? 'Thousands' : 'Hundreds', 'Tens', 'Ones'],
        correctIndex: 0,
        explanation: `The digit ${digit} in ${num.toLocaleString()} is in the ${place} place.`
      }),
      (num: number) => {
        const expanded = num.toString().split('').map((d, i) => {
          const place = num.toString().length - 1 - i;
          return `${d} × ${Math.pow(10, place)}`;
        }).join(' + ');
        return {
          question: `What is the expanded form of ${num.toLocaleString()}?`,
          options: [
            expanded,
            num.toString().split('').reverse().join(' + '),
            `${num} + 0`,
            `${num} × 1`
          ],
          correctIndex: 0,
          explanation: `The expanded form is: ${expanded}`
        };
      }
    ];

    for (let i = 0; i < count; i++) {
      const num = this.getRandomInt(10000, 999999);
      const numStr = num.toString();
      const randomPos = this.getRandomInt(0, numStr.length - 1);
      const digit = parseInt(numStr[randomPos]);
      const places = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'lakhs'];
      const place = places[numStr.length - 1 - randomPos];
      const value = digit * Math.pow(10, numStr.length - 1 - randomPos);

      const templateIndex = i % templates.length;
      if (templateIndex === 2) {
        // Expanded form template - takes just the number
        const q = (templates[2] as (n: number) => MathQuestion)(num);
        questions.push(q);
      } else {
        // Other templates take 4 params
        const q = (templates[templateIndex] as (n: number, d: number, p: string, v: number) => MathQuestion)(num, digit, place, value);
        const shuffled = this.shuffleArray(q.options.map((opt, idx) => ({ opt, idx: idx === 0 ? q.correctIndex : idx })));
        const correctIdx = shuffled.findIndex(s => s.idx === q.correctIndex);
        q.options = shuffled.map(s => s.opt);
        q.correctIndex = correctIdx;
        questions.push(q);
      }
    }
    return questions;
  }

  // WORLD 2: Multiplication (3-digit by 1-digit)
  static generateMultiplicationQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const a = this.getRandomInt(100, 999);
      const b = this.getRandomInt(2, 9);
      const answer = a * b;
      const wrong1 = answer + this.getRandomInt(1, 20);
      const wrong2 = answer - this.getRandomInt(1, 20);
      const wrong3 = (a + 1) * b;

      const options = this.shuffleArray([answer.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()]);
      const correctIndex = options.indexOf(answer.toString());

      questions.push({
        question: `What is ${a} × ${b}?`,
        options,
        correctIndex,
        explanation: `${a} × ${b} = ${answer}. Think of it as ${a} × ${b} = ${answer}.`
      });
    }
    return questions;
  }

  // WORLD 3: Division (with remainders)
  static generateDivisionQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const divisor = this.getRandomInt(2, 9);
      const quotient = this.getRandomInt(10, 99);
      const remainder = this.getRandomInt(1, divisor - 1);
      const dividend = divisor * quotient + remainder;

      const options = this.shuffleArray([
        `${quotient} remainder ${remainder}`,
        `${quotient + 1} remainder ${remainder}`,
        `${quotient} remainder ${remainder + 1}`,
        `${quotient - 1} remainder ${remainder}`
      ]);
      const correctIndex = options.indexOf(`${quotient} remainder ${remainder}`);

      questions.push({
        question: `What is ${dividend} ÷ ${divisor}?`,
        options,
        correctIndex,
        explanation: `${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}, because ${divisor} × ${quotient} = ${divisor * quotient}, and ${dividend} - ${divisor * quotient} = ${remainder}.`
      });
    }
    return questions;
  }

  // WORLD 4: Factors and Multiples
  static generateFactorQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const templates = [
      () => {
        const num = this.getRandomInt(12, 100);
        const factors = this.getFactors(num);
        const nonFactors = [num + this.getRandomInt(1, 10), num - 1, num + 2].filter(f => !factors.includes(f));
        const correctFactor = factors[factors.length > 2 ? this.getRandomInt(1, factors.length - 2) : 0];
        const options = this.shuffleArray([correctFactor.toString(), ...nonFactors.slice(0, 3).map(String)]);
        return {
          question: `Which of these is a factor of ${num}?`,
          options,
          correctIndex: options.indexOf(correctFactor.toString()),
          explanation: `Factors of ${num} are: ${factors.join(', ')}. So ${correctFactor} is a factor.`
        };
      },
      () => {
        const num = this.getRandomInt(2, 12);
        const multiples = [num * 2, num * 3, num * 4, num * 5, num * 6];
        const correct = multiples[this.getRandomInt(0, multiples.length - 1)];
        const wrong = [correct + 1, correct - num, correct + num * 2, num + 1];
        const options = this.shuffleArray([correct.toString(), ...wrong.slice(0, 3).map(String)]);
        return {
          question: `Which of these is a multiple of ${num}?`,
          options,
          correctIndex: options.indexOf(correct.toString()),
          explanation: `Multiples of ${num} are: ${multiples.join(', ')}, etc. So ${correct} is a multiple.`
        };
      },
      () => {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        const nonPrimes = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
        const correct = primes[this.getRandomInt(0, primes.length - 1)];
        const wrong = [nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)], nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)], nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)]];
        const options = this.shuffleArray([correct.toString(), ...wrong.map(String)]);
        return {
          question: `Which of these is a prime number?`,
          options,
          correctIndex: options.indexOf(correct.toString()),
          explanation: `${correct} is prime because it has only two factors: 1 and ${correct}.`
        };
      }
    ];

    for (let i = 0; i < count; i++) {
      questions.push(templates[i % templates.length]());
    }
    return questions;
  }

  private static getFactors(n: number): number[] {
    const factors: number[] = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) factors.push(n / i);
      }
    }
    return factors.sort((a, b) => a - b);
  }

  // WORLD 5: Fractions
  static generateFractionQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const templates = [
      () => {
        const a = { n: this.getRandomInt(1, 5), d: this.getRandomInt(2, 8) };
        const b = { n: this.getRandomInt(1, 5), d: a.d };
        const sum = { n: a.n + b.n, d: a.d };
        const simplified = this.simplifyFraction(sum.n, sum.d);
        const options = this.shuffleArray([
          `${simplified.n}/${simplified.d}`,
          `${sum.n + 1}/${sum.d}`,
          `${sum.n}/${sum.d + 1}`,
          `${a.n}/${b.d + a.n}`
        ]);
        return {
          question: `What is ${a.n}/${a.d} + ${b.n}/${b.d}?`,
          options,
          correctIndex: options.indexOf(`${simplified.n}/${simplified.d}`),
          explanation: `When denominators are the same, add the numerators: ${a.n}/${a.d} + ${b.n}/${b.d} = ${sum.n}/${sum.d}${simplified.n !== sum.n ? ` = ${simplified.n}/${simplified.d}` : ''}.`
        };
      },
      () => {
        const a = { n: this.getRandomInt(2, 8), d: this.getRandomInt(3, 10) };
        const b = { n: this.getRandomInt(1, a.n - 1), d: a.d };
        const diff = { n: a.n - b.n, d: a.d };
        const simplified = this.simplifyFraction(diff.n, diff.d);
        const options = this.shuffleArray([
          `${simplified.n}/${simplified.d}`,
          `${diff.n + 1}/${diff.d}`,
          `${a.n}/${b.d + 1}`,
          `${b.n}/${a.d}`
        ]);
        return {
          question: `What is ${a.n}/${a.d} - ${b.n}/${b.d}?`,
          options,
          correctIndex: options.indexOf(`${simplified.n}/${simplified.d}`),
          explanation: `${a.n}/${a.d} - ${b.n}/${b.d} = ${diff.n}/${diff.d}${simplified.n !== diff.n ? ` = ${simplified.n}/${simplified.d}` : ''}.`
        };
      },
      () => {
        const fractions = [
          { n: 1, d: 2 }, { n: 1, d: 3 }, { n: 2, d: 3 }, { n: 1, d: 4 },
          { n: 3, d: 4 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 1, d: 6 }, { n: 5, d: 6 }
        ];
        const a = fractions[this.getRandomInt(0, fractions.length - 1)];
        const b = fractions[this.getRandomInt(0, fractions.length - 1)];
        const valA = a.n / a.d;
        const valB = b.n / b.d;
        const correct = valA > valB ? `${a.n}/${a.d}` : `${b.n}/${b.d}`;
        const options = this.shuffleArray([
          correct,
          valA > valB ? `${b.n}/${b.d}` : `${a.n}/${a.d}`,
          `${a.n}/${b.d}`,
          `${b.n}/${a.d}`
        ]);
        return {
          question: `Which fraction is larger: ${a.n}/${a.d} or ${b.n}/${b.d}?`,
          options,
          correctIndex: options.indexOf(correct),
          explanation: `${a.n}/${a.d} = ${valA.toFixed(3)} and ${b.n}/${b.d} = ${valB.toFixed(3)}, so ${correct} is larger.`
        };
      }
    ];

    for (let i = 0; i < count; i++) {
      questions.push(templates[i % templates.length]());
    }
    return questions;
  }

  private static simplifyFraction(n: number, d: number): { n: number; d: number } {
    const gcd = this.getGCD(n, d);
    return { n: n / gcd, d: d / gcd };
  }

  private static getGCD(a: number, b: number): number {
    return b === 0 ? a : this.getGCD(b, a % b);
  }

  // WORLD 6: Decimals
  static generateDecimalQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const templates = [
      () => {
        const a = parseFloat((this.getRandomInt(1, 50) / 10).toFixed(1));
        const b = parseFloat((this.getRandomInt(1, 50) / 10).toFixed(1));
        const sum = parseFloat((a + b).toFixed(1));
        const options = this.shuffleArray([
          sum.toString(),
          (sum + 0.1).toString(),
          (sum - 0.1).toString(),
          (a + b + 0.5).toFixed(1)
        ]);
        return {
          question: `What is ${a} + ${b}?`,
          options,
          correctIndex: options.indexOf(sum.toString()),
          explanation: `${a} + ${b} = ${sum}. Line up the decimal points and add.`
        };
      },
      () => {
        const a = parseFloat((this.getRandomInt(10, 99) / 10).toFixed(1));
        const b = parseFloat((this.getRandomInt(1, a * 10 - 1) / 10).toFixed(1));
        const diff = parseFloat((a - b).toFixed(1));
        const options = this.shuffleArray([
          diff.toString(),
          (diff + 0.1).toString(),
          (diff - 0.1).toString(),
          (a - b + 0.5).toFixed(1)
        ]);
        return {
          question: `What is ${a} - ${b}?`,
          options,
          correctIndex: options.indexOf(diff.toString()),
          explanation: `${a} - ${b} = ${diff}. Line up the decimal points and subtract.`
        };
      },
      () => {
        const num = this.getRandomInt(1, 99);
        const decimal = num / 100;
        const fraction = this.simplifyFraction(num, 100);
        const options = this.shuffleArray([
          `${fraction.n}/${fraction.d}`,
          `${num}/10`,
          `${num}/${num + 100}`,
          `${fraction.n}/${fraction.d + 1}`
        ]);
        return {
          question: `What is ${decimal.toFixed(2)} as a fraction in simplest form?`,
          options,
          correctIndex: options.indexOf(`${fraction.n}/${fraction.d}`),
          explanation: `${decimal.toFixed(2)} = ${num}/100 = ${fraction.n}/${fraction.d} in simplest form.`
        };
      }
    ];

    for (let i = 0; i < count; i++) {
      questions.push(templates[i % templates.length]());
    }
    return questions;
  }

  // WORLD 7: Percentages
  static generatePercentageQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const templates = [
      () => {
        const percent = [10, 20, 25, 50, 75, 100][this.getRandomInt(0, 5)];
        const base = this.getRandomInt(20, 200);
        const answer = Math.round((percent / 100) * base);
        const options = this.shuffleArray([
          answer.toString(),
          (answer + base).toString(),
          (base - answer).toString(),
          (answer * 2).toString()
        ]);
        return {
          question: `What is ${percent}% of ${base}?`,
          options,
          correctIndex: options.indexOf(answer.toString()),
          explanation: `${percent}% of ${base} = ${percent}/100 × ${base} = ${answer}.`
        };
      },
      () => {
        const fraction = this.getRandomInt(1, 4);
        const denominator = this.getRandomInt(2, 5);
        const percent = Math.round((fraction / denominator) * 100);
        const options = this.shuffleArray([
          `${percent}%`,
          `${percent + 10}%`,
          `${percent - 10}%`,
          `${Math.round((fraction / (denominator + 1)) * 100)}%`
        ]);
        return {
          question: `What is ${fraction}/${denominator} as a percentage?`,
          options,
          correctIndex: options.indexOf(`${percent}%`),
          explanation: `${fraction}/${denominator} = ${(fraction / denominator).toFixed(3)} = ${percent}%.`
        };
      }
    ];

    for (let i = 0; i < count; i++) {
      questions.push(templates[i % templates.length]());
    }
    return questions;
  }

  // WORLD 8: Geometry
  static generateGeometryQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const templates = [
      () => {
        const angles = [
          { name: 'acute', range: 'less than 90°' },
          { name: 'right', range: 'exactly 90°' },
          { name: 'obtuse', range: 'between 90° and 180°' },
          { name: 'straight', range: 'exactly 180°' }
        ];
        const target = angles[this.getRandomInt(0, angles.length - 1)];
        const wrong = angles.filter(a => a.name !== target.name).slice(0, 3);
        const options = this.shuffleArray([target.name, ...wrong.map(a => a.name)]);
        return {
          question: `An angle that is ${target.range} is called:`,
          options: options.map(o => o.charAt(0).toUpperCase() + o.slice(1)),
          correctIndex: options.indexOf(target.name),
          explanation: `A ${target.name} angle is ${target.range}.`
        };
      },
      () => {
        const shapes = [
          { name: 'Triangle', sides: 3, angles: 3 },
          { name: 'Quadrilateral', sides: 4, angles: 4 },
          { name: 'Pentagon', sides: 5, angles: 5 },
          { name: 'Hexagon', sides: 6, angles: 6 }
        ];
        const target = shapes[this.getRandomInt(0, shapes.length - 1)];
        const wrong = shapes.filter(s => s.name !== target.name).slice(0, 3);
        const options = this.shuffleArray([target.name, ...wrong.map(s => s.name)]);
        return {
          question: `A shape with ${target.sides} sides and ${target.angles} angles is a:`,
          options,
          correctIndex: options.indexOf(target.name),
          explanation: `A ${target.name} has ${target.sides} sides and ${target.angles} angles.`
        };
      },
      () => {
        const shapes3D = [
          { name: 'Cube', faces: 6, edges: 12, vertices: 8 },
          { name: 'Cuboid', faces: 6, edges: 12, vertices: 8 },
          { name: 'Sphere', faces: 0, edges: 0, vertices: 0 },
          { name: 'Cylinder', faces: 3, edges: 2, vertices: 0 }
        ];
        const target = shapes3D[this.getRandomInt(0, shapes3D.length - 1)];
        const wrong = shapes3D.filter(s => s.name !== target.name).slice(0, 3);
        const options = this.shuffleArray([target.name, ...wrong.map(s => s.name)]);
        return {
          question: `Which 3D shape has ${target.faces} faces, ${target.edges} edges, and ${target.vertices} vertices?`,
          options,
          correctIndex: options.indexOf(target.name),
          explanation: `A ${target.name} has ${target.faces} faces, ${target.edges} edges, and ${target.vertices} vertices.`
        };
      }
    ];

    for (let i = 0; i < count; i++) {
      questions.push(templates[i % templates.length]());
    }
    return questions;
  }

  // WORLD 9: Measurement
  static generateMeasurementQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const templates = [
      () => {
        const km = this.getRandomInt(1, 10);
        const m = km * 1000;
        const options = this.shuffleArray([
          `${m} m`,
          `${km * 100} m`,
          `${km * 10} m`,
          `${km + 1000} m`
        ]);
        return {
          question: `How many meters are in ${km} kilometer(s)?`,
          options,
          correctIndex: options.indexOf(`${m} m`),
          explanation: `1 km = 1000 m, so ${km} km = ${km} × 1000 = ${m} m.`
        };
      },
      () => {
        const kg = this.getRandomInt(1, 10);
        const g = kg * 1000;
        const options = this.shuffleArray([
          `${g} g`,
          `${kg * 100} g`,
          `${kg * 10} g`,
          `${kg + 1000} g`
        ]);
        return {
          question: `How many grams are in ${kg} kilogram(s)?`,
          options,
          correctIndex: options.indexOf(`${g} g`),
          explanation: `1 kg = 1000 g, so ${kg} kg = ${kg} × 1000 = ${g} g.`
        };
      },
      () => {
        const length = this.getRandomInt(3, 20);
        const width = this.getRandomInt(2, length - 1);
        const perimeter = 2 * (length + width);
        const area = length * width;
        const isPerimeter = Math.random() > 0.5;
        const answer = isPerimeter ? perimeter : area;
        const options = this.shuffleArray([
          answer.toString(),
          (answer + 2).toString(),
          (answer - 2).toString(),
          (answer * 2).toString()
        ]);
        return {
          question: `What is the ${isPerimeter ? 'perimeter' : 'area'} of a rectangle with length ${length} m and width ${width} m?`,
          options: options.map(o => isPerimeter ? `${o} m` : `${o} m²`),
          correctIndex: options.indexOf(answer.toString()),
          explanation: `${isPerimeter ? 'Perimeter' : 'Area'} = ${isPerimeter ? `2 × (${length} + ${width}) = ${perimeter} m` : `${length} × ${width} = ${area} m²`}.`
        };
      }
    ];

    for (let i = 0; i < count; i++) {
      questions.push(templates[i % templates.length]());
    }
    return questions;
  }

  // WORLD 10: Data Handling & Probability
  static generateDataQuestions(count: number = 5): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const fruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'];

    const templates = [
      () => {
        const data: Record<string, number> = {};
        fruits.forEach(f => data[f] = this.getRandomInt(5, 30));
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        const mostFrequent = Object.entries(data).sort((a, b) => b[1] - a[1])[0];
        const options = this.shuffleArray([
          mostFrequent[0],
          ...fruits.filter(f => f !== mostFrequent[0]).slice(0, 3)
        ]);
        const dataStr = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ');
        return {
          question: `A survey shows: ${dataStr}. Which is the most popular?`,
          options,
          correctIndex: options.indexOf(mostFrequent[0]),
          explanation: `${mostFrequent[0]} has ${mostFrequent[1]} votes, which is the highest. Total = ${total}.`
        };
      },
      () => {
        const total = this.getRandomInt(20, 50);
        const red = this.getRandomInt(5, total - 10);
        const blue = this.getRandomInt(3, total - red - 5);
        const green = total - red - blue;
        const options = this.shuffleArray([
          green.toString(),
          (green + 2).toString(),
          (green - 2).toString(),
          (red + blue).toString()
        ]);
        return {
          question: `A bag has ${total} balls: ${red} red, ${blue} blue. How many green balls are there?`,
          options: options.map(o => o),
          correctIndex: options.indexOf(green.toString()),
          explanation: `Green balls = Total - Red - Blue = ${total} - ${red} - ${blue} = ${green}.`
        };
      },
      () => {
        const terms = ['certain', 'likely', 'unlikely', 'impossible'];
        const scenarios = [
          { q: 'The sun will rise tomorrow', a: 'certain' },
          { q: 'You will roll a 7 on a standard die', a: 'impossible' },
          { q: 'It will rain tomorrow (if cloudy)', a: 'likely' },
          { q: 'You will win a lottery', a: 'unlikely' }
        ];
        const scenario = scenarios[this.getRandomInt(0, scenarios.length - 1)];
        const options = this.shuffleArray([
          scenario.a,
          ...terms.filter(t => t !== scenario.a).slice(0, 3)
        ]);
        return {
          question: `"${scenario.q}" is:`,
          options: options.map(o => o.charAt(0).toUpperCase() + o.slice(1)),
          correctIndex: options.indexOf(scenario.a),
          explanation: `"${scenario.q}" is ${scenario.a}.`
        };
      }
    ];

    for (let i = 0; i < count; i++) {
      questions.push(templates[i % templates.length]());
    }
    return questions;
  }

  // Main method to get questions for any world
  static getQuestionsForWorld(worldId: number, count: number = 5): MathQuestion[] {
    switch (worldId) {
      case 1: return this.generatePlaceValueQuestions(count);
      case 2: return this.generateMultiplicationQuestions(count);
      case 3: return this.generateDivisionQuestions(count);
      case 4: return this.generateFactorQuestions(count);
      case 5: return this.generateFractionQuestions(count);
      case 6: return this.generateDecimalQuestions(count);
      case 7: return this.generatePercentageQuestions(count);
      case 8: return this.generateGeometryQuestions(count);
      case 9: return this.generateMeasurementQuestions(count);
      case 10: return this.generateDataQuestions(count);
      default: return this.generatePlaceValueQuestions(count);
    }
  }
}
