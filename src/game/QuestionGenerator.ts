// Math Question Generator for ALL Subjects

export interface MathQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  image?: string;
}

class QG {
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

  /** Ensures 4 unique options where exactly ONE matches correctAnswer */
  static makeOptions(correct: string, wrongs: (() => string)[]): { options: string[]; correctIndex: number } {
    for (let attempts = 0; attempts < 50; attempts++) {
      const genWrongs: string[] = [];
      for (const gen of wrongs) {
        let w = gen(), wa = 0;
        while ((w === correct || genWrongs.includes(w)) && wa < 20) { w = gen(); wa++; }
        genWrongs.push(w);
      }
      const unique = [...new Set(genWrongs)].filter(w => w !== correct);
      if (unique.length >= 3) {
        const pool = this.shuffleArray([correct, unique[0], unique[1], unique[2]]);
        return { options: pool, correctIndex: pool.indexOf(correct) };
      }
    }
    // Fallback
    const forced = wrongs.slice(0, 3).map((g, i) => { let b = g(); let a = 0; while (b === correct && a < 20) { b = g(); a++; } return b || `Opt${i}`; });
    const pool = this.shuffleArray([correct, ...forced]);
    return { options: pool, correctIndex: pool.indexOf(correct) };
  }

  static simplify(n: number, d: number) {
    const g = (a: number, b: number): number => b === 0 ? a : g(b, a % b);
    const gg = g(n, d); return { n: n / gg, d: d / gg };
  }

  static factors(num: number): number[] {
    const f: number[] = [];
    for (let i = 1; i <= Math.sqrt(num); i++) if (num % i === 0) { f.push(i); if (i !== num / i) f.push(num / i); }
    return f.sort((a, b) => a - b);
  }

  // ============ MATH (existing + fixed) ============
  static mathPlaceValue(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      const num = this.getRandomInt(10000, 999999), ns = num.toString(), pos = this.getRandomInt(0, ns.length - 1);
      const digit = parseInt(ns[pos]), places = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'lakhs'];
      const place = places[ns.length - 1 - pos], value = digit * 10 ** (ns.length - 1 - pos);
      if (i % 3 === 2) {
        const exp = ns.split('').map((d, j) => `${d} x ${10 ** (ns.length - 1 - j)}`).join(' + ');
        q.push({ question: `What is the expanded form of ${num.toLocaleString()}?`, options: [exp, ns.split('').reverse().join(' + '), `${num} + 0`, `${num} x 1`], correctIndex: 0, explanation: `Expanded form: ${exp}` });
      } else if (i % 3 === 1) {
        q.push({ question: `In ${num.toLocaleString()}, what does digit ${digit} represent?`, ...this.makeOptions(`${place} place`, [`${places[(places.indexOf(place) + 1) % places.length]} place`, 'Tens', 'Ones'].map(w => () => w)), explanation: `The digit ${digit} is in the ${place} place.` });
      } else {
        q.push({ question: `What is the place value of digit ${digit} in ${num.toLocaleString()}?`, ...this.makeOptions(value.toString(), [() => (value * 10).toString(), () => (value / 10).toString(), () => (value * 2).toString()]), explanation: `The digit ${digit} is in the ${place} place, so its value is ${value}.` });
      }
    }
    return q;
  }

  static mathMultiply(n = 5): MathQuestion[] {
    return Array.from({ length: n }, () => { const a = this.getRandomInt(100, 999), b = this.getRandomInt(2, 9), ans = a * b; return { question: `What is ${a} x ${b}?`, ...this.makeOptions(ans.toString(), [() => (ans + this.getRandomInt(21, 50)).toString(), () => Math.max(0, ans - this.getRandomInt(21, 50)).toString(), () => ((a + this.getRandomInt(2, 5)) * b).toString()]), explanation: `${a} x ${b} = ${ans}.` }; });
  }

  static mathDivide(n = 5): MathQuestion[] {
    return Array.from({ length: n }, () => { const d = this.getRandomInt(2, 9), q = this.getRandomInt(10, 99), r = this.getRandomInt(1, d - 1), div = d * q + r; return { question: `What is ${div} divided by ${d}?`, ...this.makeOptions(`${q} remainder ${r}`, [() => `${q + this.getRandomInt(1, 5)} remainder ${r}`, () => `${q} remainder ${r + this.getRandomInt(1, 3)}`, () => `${Math.max(1, q - this.getRandomInt(1, 5))} remainder ${r}`]), explanation: `${div} / ${d} = ${q} remainder ${r}.` }; });
  }

  static mathFactors(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) {
        const num = this.getRandomInt(12, 100), facs = this.factors(num), nonFacs: number[] = []; let c = 1;
        while (nonFacs.length < 10 && c <= num + 20) { if (!facs.includes(c) && c !== num) nonFacs.push(c); c++; }
        const cf = facs[facs.length > 2 ? this.getRandomInt(1, facs.length - 2) : 0];
        q.push({ question: `Which of these is a factor of ${num}?`, ...this.makeOptions(cf.toString(), [() => nonFacs[this.getRandomInt(0, Math.min(9, nonFacs.length - 1))].toString(), () => nonFacs[this.getRandomInt(0, Math.min(9, nonFacs.length - 1))].toString(), () => nonFacs[this.getRandomInt(0, Math.min(9, nonFacs.length - 1))].toString()]), explanation: `Factors of ${num} are: ${facs.join(', ')}. So ${cf} is a factor.` });
      } else if (i % 3 === 1) {
        const num = this.getRandomInt(2, 12), mult = num * this.getRandomInt(3, 10);
        q.push({ question: `Which of these is a multiple of ${num}?`, ...this.makeOptions(mult.toString(), [() => (mult + this.getRandomInt(1, num - 1)).toString(), () => (mult + this.getRandomInt(num + 1, num * 2)).toString(), () => (mult - this.getRandomInt(1, num - 1)).toString()]), explanation: `${mult} = ${num} x ${mult / num}, so it is a multiple of ${num}.` });
      } else {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47], nonPrimes = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
        const c = primes[this.getRandomInt(0, primes.length - 1)];
        q.push({ question: `Which of these is a prime number?`, ...this.makeOptions(c.toString(), [() => nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)].toString(), () => nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)].toString(), () => nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)].toString()]), explanation: `${c} is prime because it has only two factors: 1 and ${c}.` });
      }
    }
    return q;
  }

  static mathFractions(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) {
        const d = this.getRandomInt(2, 8), an = this.getRandomInt(1, 5), bn = this.getRandomInt(1, 5), s = this.simplify(an + bn, d);
        q.push({ question: `What is ${an}/${d} + ${bn}/${d}?`, ...this.makeOptions(`${s.n}/${s.d}`, [() => `${an + bn + this.getRandomInt(1, 3)}/${d}`, () => `${an}/${d + this.getRandomInt(1, 3)}`, () => `${bn + this.getRandomInt(1, 3)}/${d + this.getRandomInt(1, 3)}`]), explanation: `${an}/${d} + ${bn}/${d} = ${an + bn}/${d}${s.n !== an + bn ? ` = ${s.n}/${s.d}` : ''}.` });
      } else if (i % 3 === 1) {
        const d = this.getRandomInt(3, 10), an = this.getRandomInt(3, 8), bn = this.getRandomInt(1, an - 1), diff = this.simplify(an - bn, d);
        q.push({ question: `What is ${an}/${d} - ${bn}/${d}?`, ...this.makeOptions(`${diff.n}/${diff.d}`, [() => `${an - bn + this.getRandomInt(1, 3)}/${d}`, () => `${an}/${d + this.getRandomInt(1, 3)}`, () => `${Math.max(1, an - bn - this.getRandomInt(1, 2))}/${d + this.getRandomInt(1, 3)}`]), explanation: `${an}/${d} - ${bn}/${d} = ${an - bn}/${d}${diff.n !== an - bn ? ` = ${diff.n}/${diff.d}` : ''}.` });
      } else {
        const pairs = [[1,2,1,4],[3,4,1,2],[2,3,1,3],[3,5,2,5],[5,8,3,8],[4,5,2,5],[5,6,1,2],[7,8,3,8]];
        const p = pairs[this.getRandomInt(0, pairs.length - 1)]; const [an, ad, bn, bd] = p; const vA = an / ad, vB = bn / bd; const larger = vA > vB ? `${an}/${ad}` : `${bn}/${bd}`, smaller = vA > vB ? `${bn}/${bd}` : `${an}/${ad}`;
        const w2 = (Math.abs(vA - vB) / 2 + Math.min(vA, vB)).toFixed(2).replace(/^0\./, '.'), w3 = (Math.max(vA, vB) + 0.1).toFixed(2).replace(/^0\./, '.');
        q.push({ question: `Which is larger: ${an}/${ad} or ${bn}/${bd}?`, ...this.makeOptions(larger, [() => smaller, () => w2, () => w3]), explanation: `${an}/${ad} = ${vA.toFixed(3)} and ${bn}/${bd} = ${vB.toFixed(3)}, so ${larger} is larger.` });
      }
    }
    return q;
  }

  static mathDecimals(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const a = this.getRandomInt(1, 50) / 10, b = this.getRandomInt(1, 50) / 10, s = Math.round((a + b) * 10) / 10; q.push({ question: `What is ${a.toFixed(1)} + ${b.toFixed(1)}?`, ...this.makeOptions(s.toFixed(1), [() => (s + this.getRandomInt(2, 9) / 10).toFixed(1), () => Math.max(0.1, s - this.getRandomInt(2, 9) / 10).toFixed(1), () => (s + this.getRandomInt(10, 30) / 10).toFixed(1)]), explanation: `${a.toFixed(1)} + ${b.toFixed(1)} = ${s.toFixed(1)}.` }); }
      else if (i % 3 === 1) { const a = this.getRandomInt(20, 99) / 10, b = this.getRandomInt(5, Math.floor(a * 10) - 1) / 10, diff = Math.round((a - b) * 10) / 10; q.push({ question: `What is ${a.toFixed(1)} - ${b.toFixed(1)}?`, ...this.makeOptions(diff.toFixed(1), [() => (diff + this.getRandomInt(2, 9) / 10).toFixed(1), () => Math.max(0.1, diff - this.getRandomInt(2, 9) / 10).toFixed(1), () => (diff + this.getRandomInt(10, 30) / 10).toFixed(1)]), explanation: `${a.toFixed(1)} - ${b.toFixed(1)} = ${diff.toFixed(1)}.` }); }
      else { const num = this.getRandomInt(1, 99), fr = this.simplify(num, 100); q.push({ question: `What is ${(num / 100).toFixed(2)} as a fraction in simplest form?`, ...this.makeOptions(`${fr.n}/${fr.d}`, [() => `${num}/${this.getRandomInt(50, 90)}`, () => `${this.getRandomInt(1, num - 1 || 1)}/${fr.d + this.getRandomInt(1, 5)}`, () => `${num + this.getRandomInt(1, 10)}/${100 + this.getRandomInt(1, 20)}`]), explanation: `${(num / 100).toFixed(2)} = ${num}/100 = ${fr.n}/${fr.d} in simplest form.` }); }
    }
    return q;
  }

  static mathPercent(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) { const p = [10, 20, 25, 75, 100][this.getRandomInt(0, 4)], base = this.getRandomInt(20, 200), ans = Math.round((p / 100) * base); q.push({ question: `What is ${p}% of ${base}?`, ...this.makeOptions(ans.toString(), [() => (ans + base + this.getRandomInt(1, 20)).toString(), () => Math.abs(base - ans + this.getRandomInt(5, 30)).toString(), () => (ans * 2 + this.getRandomInt(1, 10)).toString()]), explanation: `${p}% of ${base} = ${ans}.` }); }
      else { const fr = this.getRandomInt(1, 4), den = this.getRandomInt(2, 5), p = Math.round((fr / den) * 100); q.push({ question: `What is ${fr}/${den} as a percentage?`, ...this.makeOptions(`${p}%`, [() => `${p + this.getRandomInt(11, 30)}%`, () => `${Math.max(5, p - this.getRandomInt(11, 30))}%`, () => `${Math.round((fr / (den + this.getRandomInt(2, 4))) * 100)}%`]), explanation: `${fr}/${den} = ${p}%.` }); }
    }
    return q;
  }

  static mathGeometry(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const angles = [{ n: 'acute', r: 'less than 90 degrees' }, { n: 'right', r: 'exactly 90 degrees' }, { n: 'obtuse', r: 'between 90 and 180 degrees' }, { n: 'straight', r: 'exactly 180 degrees' }], t = angles[this.getRandomInt(0, 3)], wrong = angles.filter(a => a.n !== t.n); q.push({ question: `An angle that is ${t.r} is called:`, ...this.makeOptions(t.n.charAt(0).toUpperCase() + t.n.slice(1), wrong.map(a => () => a.n.charAt(0).toUpperCase() + a.n.slice(1))), explanation: `A ${t.n} angle is ${t.r}.` }); }
      else if (i % 3 === 1) { const shapes = [{ n: 'Triangle', s: 3 }, { n: 'Quadrilateral', s: 4 }, { n: 'Pentagon', s: 5 }, { n: 'Hexagon', s: 6 }], t = shapes[this.getRandomInt(0, 3)], wrong = shapes.filter(s => s.n !== t.n); q.push({ question: `A shape with ${t.s} sides is a:`, ...this.makeOptions(t.n, wrong.map(s => () => s.n)), explanation: `A ${t.n} has ${t.s} sides.` }); }
      else { const s3d = [{ n: 'Cube', f: 6, e: 12, v: 8 }, { n: 'Cuboid', f: 6, e: 12, v: 8 }, { n: 'Sphere', f: 0, e: 0, v: 0 }, { n: 'Cylinder', f: 3, e: 2, v: 0 }], t = s3d[this.getRandomInt(0, 3)], wrong = s3d.filter(s => s.n !== t.n); q.push({ question: `Which 3D shape has ${t.f} faces, ${t.e} edges, and ${t.v} vertices?`, ...this.makeOptions(t.n, wrong.map(s => () => s.n)), explanation: `A ${t.n} has ${t.f} faces, ${t.e} edges, and ${t.v} vertices.` }); }
    }
    return q;
  }

  static mathMeasure(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const km = this.getRandomInt(1, 10), m = km * 1000; q.push({ question: `How many meters are in ${km} kilometre(s)?`, ...this.makeOptions(`${m} m`, [() => `${km * 100} m`, () => `${km * 10} m`, () => `${km + 1000} m`]), explanation: `1 km = 1000 m, so ${km} km = ${m} m.` }); }
      else if (i % 3 === 1) { const kg = this.getRandomInt(1, 10), g = kg * 1000; q.push({ question: `How many grams are in ${kg} kilogram(s)?`, ...this.makeOptions(`${g} g`, [() => `${kg * 100} g`, () => `${kg * 10} g`, () => `${kg + 1000} g`]), explanation: `1 kg = 1000 g, so ${kg} kg = ${g} g.` }); }
      else { const l = this.getRandomInt(5, 20), w = this.getRandomInt(3, l - 1), ans = Math.random() > 0.5 ? 2 * (l + w) : l * w; q.push({ question: `What is the ${Math.random() > 0.5 ? 'perimeter' : 'area'} of a rectangle with length ${l} m and width ${w} m?`, ...this.makeOptions(ans.toString(), [() => (ans + this.getRandomInt(3, 15)).toString(), () => Math.max(1, ans - this.getRandomInt(3, 15)).toString(), () => (ans + this.getRandomInt(20, 50)).toString()]), explanation: `Answer = ${ans}.` }); }
    }
    return q;
  }

  static mathData(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [], fruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const data: Record<string, number> = {}; let start = this.getRandomInt(10, 20); fruits.forEach((f, j) => data[f] = start + j * 3); const vals = Object.values(data).sort(() => Math.random() - 0.5); fruits.forEach((f, j) => data[f] = vals[j]); const most = Object.entries(data).sort((a, b) => b[1] - a[1])[0]; q.push({ question: `A survey shows: ${Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ')}. Which is most popular?`, ...this.makeOptions(most[0], fruits.filter(f => f !== most[0]).slice(0, 3).map(f => () => f)), explanation: `${most[0]} has ${most[1]} votes, the highest.` }); }
      else if (i % 3 === 1) { let total: number, red: number, blue: number, green: number, a = 0; do { total = this.getRandomInt(25, 50); red = this.getRandomInt(5, total - 15); blue = this.getRandomInt(3, total - red - 10); green = total - red - blue; a++; } while ((green === red + blue) && a < 20); q.push({ question: `A bag has ${total} balls: ${red} red, ${blue} blue. How many green balls?`, ...this.makeOptions(green.toString(), [() => (green + this.getRandomInt(3, 8)).toString(), () => Math.max(1, green - this.getRandomInt(3, 8)).toString(), () => (red + this.getRandomInt(1, 3)).toString()]), explanation: `Green = ${total} - ${red} - ${blue} = ${green}.` }); }
      else { const terms = ['certain', 'likely', 'unlikely', 'impossible'], scenarios = [{ q: 'The sun will rise tomorrow', a: 'certain' }, { q: 'You will roll a 7 on a die', a: 'impossible' }, { q: 'It will rain if cloudy', a: 'likely' }, { q: 'You will win a lottery', a: 'unlikely' }, { q: 'A square has 4 sides', a: 'certain' }], s = scenarios[this.getRandomInt(0, scenarios.length - 1)], wrong = terms.filter(t => t !== s.a); q.push({ question: `"${s.q}" is:`, ...this.makeOptions(s.a.charAt(0).toUpperCase() + s.a.slice(1), wrong.map(t => () => t.charAt(0).toUpperCase() + t.slice(1))), explanation: `"${s.q}" is ${s.a}.` }); }
    }
    return q;
  }

  // ============ ENGLISH GRAMMAR ============
  static engGrammar(worldId: number, n = 5): MathQuestion[] {
    switch (worldId) {
      case 1: return this.engNouns(n);
      case 2: return this.engVerbs(n);
      case 3: return this.engAdjectives(n);
      case 4: return this.engPronouns(n);
      case 5: return this.engSentences(n);
      case 6: return this.engPrepositions(n);
      case 7: return this.engVoice(n);
      case 8: return this.engWords(n);
      default: return this.engNouns(n);
    }
  }

  static engNouns(n = 5): MathQuestion[] {
    const nouns = [{ w: 'dog', t: 'common' }, { w: 'India', t: 'proper' }, { w: 'team', t: 'collective' }, { w: 'honesty', t: 'abstract' }, { w: 'happiness', t: 'abstract' }, { w: 'Ravi', t: 'proper' }, { w: 'flock', t: 'collective' }, { w: 'courage', t: 'abstract' }, { w: 'cat', t: 'common' }, { w: 'Monday', t: 'proper' }];
    return Array.from({ length: n }, (_, i) => {
      const item = nouns[i % nouns.length];
      return { question: `"${item.w}" is what type of noun?`, ...this.makeOptions(item.t.charAt(0).toUpperCase() + item.t.slice(1), ['Common', 'Proper', 'Collective', 'Abstract'].filter(t => t.toLowerCase() !== item.t).slice(0, 3).map(w => () => w)), explanation: `"${item.w}" is a ${item.t} noun.` };
    });
  }

  static engVerbs(n = 5): MathQuestion[] {
    const verbs = ['run', 'jump', 'eat', 'write', 'think', 'play', 'read', 'sing', 'dance', 'swim'];
    return Array.from({ length: n }, (_, i) => {
      if (i % 2 === 0) {
        const v = verbs[this.getRandomInt(0, verbs.length - 1)], tenses = [{ q: `She ___ to school every day.`, a: `${v}s`, e: `Simple present: She ${v}s to school every day.` }, { q: `He ___ the letter yesterday.`, a: `${v === 'run' ? 'ran' : v === 'eat' ? 'ate' : v + 'ed'}`, e: `Simple past tense.` }, { q: `They will ___ tomorrow.`, a: v, e: `Future tense uses 'will' + base verb.` }];
        const t = tenses[this.getRandomInt(0, tenses.length - 1)];
        return { question: t.q, ...this.makeOptions(t.a, [() => `${v}ing`, () => `${v}s`, () => `${v}ed`]), explanation: t.e };
      } else {
        const subj = ['He', 'She', 'It', 'They', 'We'][this.getRandomInt(0, 4)], bv = subj === 'He' || subj === 'She' || subj === 'It' ? 'is' : 'are';
        return { question: `${subj} ___ playing in the park.`, ...this.makeOptions(bv, [() => 'am', () => subj === 'They' || subj === 'We' ? 'is' : 'are', () => 'were']), explanation: `${subj} ${bv}: singular subjects use 'is', plural subjects use 'are'.` };
      }
    });
  }

  static engAdjectives(n = 5): MathQuestion[] {
    const items = [{ w: 'beautiful', t: 'adjective', q: 'describes a noun' }, { w: 'quickly', t: 'adverb', q: 'describes a verb' }, { w: 'brave', t: 'adjective', q: 'describes a noun' }, { w: 'happily', t: 'adverb', q: 'describes a verb' }, { w: 'tall', t: 'adjective', q: 'describes a noun' }];
    return Array.from({ length: n }, (_, i) => {
      const item = items[i % items.length];
      if (i % 2 === 0) return { question: `"${item.w}" is an:`, ...this.makeOptions(item.t.charAt(0).toUpperCase() + item.t.slice(1), ['Noun', 'Verb', item.t === 'adjective' ? 'Adverb' : 'Adjective', 'Preposition'].map(w => () => w)), explanation: `"${item.w}" is an ${item.t} because it ${item.q}.` };
      else { const adj = ['big', 'small', 'fast', 'slow', 'hot', 'cold'][this.getRandomInt(0, 5)], comp = adj + (adj.endsWith('y') ? 'ier' : adj.endsWith('e') ? 'r' : 'er'), sup = adj + (adj.endsWith('y') ? 'iest' : adj.endsWith('e') ? 'st' : 'est'); return { question: `What is the comparative form of "${adj}"?`, ...this.makeOptions(comp, [() => sup, () => adj + ' more', () => 'more ' + adj]), explanation: `Comparative of "${adj}" is "${comp}" (comparing two things).` }; }
    });
  }

  static engPronouns(n = 5): MathQuestion[] {
    const questions = [
      { q: '___ is my best friend. (He/Him/His)', a: 'He', e: '"He" is a subject pronoun.' },
      { q: 'The book is ___ . (my/mine/me)', a: 'mine', e: '"Mine" is a possessive pronoun.' },
      { q: '___ book is on the table? (Which/What/Who)', a: 'Which', e: '"Which" asks about a specific choice.' },
      { q: 'I saw ___ at the park. (they/them/their)', a: 'them', e: '"Them" is an object pronoun.' },
      { q: '___ apple a day keeps the doctor away. (A/An/The)', a: 'An', e: 'Use "An" before words starting with a vowel sound.' },
    ];
    return questions.map(q => ({ question: q.q, ...this.makeOptions(q.a, [() => q.a === 'He' ? 'Him' : q.a === 'mine' ? 'my' : q.a === 'Which' ? 'Who' : q.a === 'them' ? 'they' : 'A', () => q.a === 'He' ? 'His' : q.a === 'mine' ? 'me' : q.a === 'Which' ? 'What' : q.a === 'them' ? 'their' : 'The', () => 'It']), explanation: q.e }));
  }

  static engSentences(n = 5): MathQuestion[] {
    const questions = [
      { q: '"What a beautiful day!" is what type of sentence?', a: 'Exclamatory', e: 'Exclamatory sentences express strong emotion with "!"' },
      { q: '"Close the door." is what type of sentence?', a: 'Imperative', e: 'Imperative sentences give commands or requests.' },
      { q: '"Where is the library?" is what type of sentence?', a: 'Interrogative', e: 'Interrogative sentences ask questions with "?"' },
      { q: '"The cat sat on the mat." is what type of sentence?', a: 'Declarative', e: 'Declarative sentences make statements with "."' },
      { q: 'Which punctuation ends a question?', a: 'Question mark (?)', e: 'Questions always end with a question mark.' },
    ];
    return questions.map(q => ({ question: q.q, ...this.makeOptions(q.a, ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'].filter(t => t !== q.a).slice(0, 3).map(w => () => w)), explanation: q.e }));
  }

  static engPrepositions(n = 5): MathQuestion[] {
    const questions = [
      { q: 'The cat is ___ the table. (on/in/under)', a: 'on', e: '"On" means touching a surface.' },
      { q: 'She walked ___ the park. (through/across/beside)', a: 'through', e: '"Through" means going from one side to the other.' },
      { q: 'The ball is ___ the box. (in/on/at)', a: 'in', e: '"In" means inside something.' },
      { q: 'He sat ___ his friend. (between/beside/through)', a: 'beside', e: '"Beside" means next to.' },
      { q: '"And" and "But" are:', a: 'Conjunctions', e: 'Conjunctions join words, phrases, or clauses.' },
    ];
    return questions.map(q => ({ question: q.q, ...this.makeOptions(q.a, [() => 'Prepositions', () => 'Adverbs', () => 'Articles']), explanation: q.e }));
  }

  static engVoice(n = 5): MathQuestion[] {
    const questions = [
      { q: 'Convert to passive: "Ram eats an apple."', a: 'An apple is eaten by Ram.', e: 'Object becomes subject + is + past participle + by + subject.' },
      { q: 'Convert to passive: "She writes a letter."', a: 'A letter is written by her.', e: 'Object becomes subject + is + past participle + by + subject.' },
      { q: '"The cake was baked by mother." is:', a: 'Passive voice', e: 'In passive voice, the object receives the action.' },
      { q: '"The dog bit the man." is:', a: 'Active voice', e: 'In active voice, the subject performs the action.' },
      { q: 'Convert to active: "The ball was kicked by him."', a: 'He kicked the ball.', e: 'Remove "was...by", make the doer the subject.' },
    ];
    return questions.map(q => ({ question: q.q, ...this.makeOptions(q.a, [() => 'A letter is wrote by her.', () => q.a.includes('passive') ? 'Active voice' : 'Passive voice', () => 'The ball kicked by he.']), explanation: q.e }));
  }

  static engWords(n = 5): MathQuestion[] {
    const syns = [{ w: 'happy', s: 'joyful' }, { w: 'big', s: 'large' }, { w: 'fast', s: 'quick' }, { w: 'sad', s: 'unhappy' }, { w: 'smart', s: 'clever' }];
    const ants = [{ w: 'hot', a: 'cold' }, { w: 'tall', a: 'short' }, { w: 'happy', a: 'sad' }, { w: 'fast', a: 'slow' }, { w: 'brave', a: 'cowardly' }];
    return Array.from({ length: n }, (_, i) => {
      if (i % 3 === 0) { const s = syns[i % syns.length]; return { question: `What is a synonym of "${s.w}"?`, ...this.makeOptions(s.s, [() => ants.find(a => a.w === s.w)?.a || 'small', () => s.w + 'ness', () => 'un' + s.w]), explanation: `"${s.s}" means the same as "${s.w}".` }; }
      else if (i % 3 === 1) { const a = ants[i % ants.length]; return { question: `What is the opposite of "${a.w}"?`, ...this.makeOptions(a.a, [() => syns.find(s => s.w === a.w)?.s || 'large', () => 'un' + a.w, () => a.w + 'ness']), explanation: `"${a.a}" is the opposite of "${a.w}".` }; }
      else { const prefix = ['un', 'dis', 're', 'mis', 'pre'][this.getRandomInt(0, 4)], root = ['happy', 'appear', 'write', 'understand', 'view'][this.getRandomInt(0, 4)]; return { question: `What does "${prefix}${root}" mean?`, ...this.makeOptions(this.prefixMeaning(prefix) + ' ' + root, [() => 'not ' + root, () => root + ' again', () => 'before ' + root]), explanation: `"${prefix}" means "${this.prefixMeaning(prefix)}". So "${prefix}${root}" means "${this.prefixMeaning(prefix)} ${root}".` }; }
    });
  }

  static prefixMeaning(p: string): string {
    const m: Record<string, string> = { un: 'not', dis: 'not', re: 'again', mis: 'wrongly', pre: 'before' }; return m[p] || 'not';
  }


  // ============ ENGLISH TEXTBOOK ============
  static engTextbook(worldId: number, n = 10): MathQuestion[] {
    const passages: any[] = [
      { title: 'The Wise Crow', i: '/assets/img_wise_crow.png', questions: [
        { q: 'What problem did the crow face?', a: 'He could not reach the water.', w: ['The pitcher was too heavy', 'The water was dirty', 'He was too tired to fly'], e: 'The pitcher had very little water.' },
        { q: 'How did the crow solve the problem?', a: 'By dropping pebbles into the pitcher.', w: ['By breaking the pitcher', 'By asking another bird for help', 'By drinking from a different place'], e: 'The pebbles raised the water level.' },
        { q: 'What does this story teach us?', a: 'Intelligence can solve problems.', w: ['Always give up when things are hard', 'Ask others to do your work', 'Water is always hard to find'], e: 'The crow used his brain to find a solution.' },
        { q: 'What kind of bird was in the story?', a: 'A crow', w: ['A parrot', 'An eagle', 'A sparrow'], e: 'The main character was a clever crow.' },
        { q: 'What did the crow drop into the pitcher?', a: 'Pebbles', w: ['Leaves', 'Stones too big to fit', 'Sand'], e: 'The crow dropped small stones (pebbles).' },
        { q: 'Why did the water rise?', a: 'The pebbles displaced the water', w: ['The water magically grew', 'The sun evaporated the water', 'Another bird added water'], e: 'Pebbles took up space and pushed water up.' },
        { q: 'What was the crow trying to do?', a: 'Drink water', w: ['Take a bath', 'Fill the pitcher', 'Play with the pebbles'], e: 'The crow was thirsty and wanted water.' },
        { q: 'Was the pitcher full of water?', a: 'No', w: ['Yes, completely full', 'Only at the top', 'It was overflowing'], e: 'The pitcher had very little water in it.' },
        { q: 'How did the crow feel at the end?', a: 'Satisfied and happy', w: ['Angry and frustrated', 'Scared and worried', 'Tired and sleepy'], e: 'The crow finally got to drink water.' },
        { q: 'What quality of the crow helped him?', a: 'Cleverness', w: ['Strength', 'Speed', 'Beauty'], e: 'The crow used intelligence to solve the problem.' },
      ]},
      { title: 'The Ant and the Grasshopper', questions: [
        { q: 'What was the ant doing?', a: 'Carrying a heavy grain.', w: ['Sleeping under a tree', 'Playing with friends', 'Eating the grain'], e: 'The ant was storing food for winter.' },
        { q: 'What was the grasshopper doing?', a: 'Singing and hopping about.', w: ['Working hard', 'Sleeping all day', 'Building a house'], e: 'The grasshopper was playing instead of working.' },
        { q: 'Why was the ant storing food?', a: 'For the winter.', w: ['To sell at the market', 'For a big party', 'Because he was hungry right now'], e: 'Winter food would be scarce.' },
        { q: 'What season was it?', a: 'Summer', w: ['Winter', 'Rainy season', 'Spring'], e: 'The story takes place on a summer day.' },
        { q: 'What did the grasshopper invite the ant to do?', a: 'Sing with him', w: ['Work together', 'Go swimming', 'Build a house'], e: 'The grasshopper wanted the ant to stop working.' },
        { q: 'Was the ant being lazy?', a: 'No', w: ['Yes, very lazy', 'Sometimes', 'Only in the morning'], e: 'The ant was hard at work storing food.' },
        { q: 'What lesson does this story teach?', a: 'Work hard for the future', w: ['Always play and have fun', 'Ignore your friends', 'Never share your food'], e: 'We should prepare for difficult times.' },
        { q: 'Who was working hard?', a: 'The ant', w: ['The grasshopper', 'The spider', 'The butterfly'], e: 'The ant was carrying grains to store.' },
        { q: 'Who was playing and singing?', a: 'The grasshopper', w: ['The ant', 'The cricket', 'The bee'], e: 'The grasshopper was enjoying summer.' },
        { q: 'When would food be scarce?', a: 'In winter', w: ['In summer', 'During spring', 'On sunny days'], e: 'The ant knew winter food would be hard to find.' },
      ]},
      { title: 'Rainbow Colors', i: '/assets/img_rainbow.png', questions: [
        { q: 'How many colors does a rainbow have?', a: 'Seven', w: ['Five', 'Eight', 'Ten'], e: 'Violet, indigo, blue, green, yellow, orange, red.' },
        { q: 'When does a rainbow appear?', a: 'After rain', w: ['At midnight', 'During a storm', 'On a cloudy day'], e: 'Rainbow forms when sunlight passes through raindrops.' },
        { q: 'What causes a rainbow?', a: 'Sunlight passing through raindrops', w: ['Paint in the sky', 'A giant flashlight', 'Reflection from the moon'], e: 'Light bends (refracts) through water droplets.' },
        { q: 'What is the first color of the rainbow?', a: 'Violet', w: ['Red', 'Blue', 'Green'], e: 'VIBGYOR starts with Violet.' },
        { q: 'What is the last color of the rainbow?', a: 'Red', w: ['Violet', 'Orange', 'Yellow'], e: 'Red is the outermost color of the rainbow.' },
        { q: 'Do rainbow colors always appear in the same order?', a: 'Yes', w: ['No, they change daily', 'Only on Tuesdays', 'It depends on the weather'], e: 'The colors always appear in VIBGYOR order.' },
        { q: 'What is needed to form a rainbow?', a: 'Sunlight and raindrops', w: ['Only sunlight', 'Only clouds', 'Moonlight and stars'], e: 'Both sunlight and water droplets are needed.' },
        { q: 'What color comes between blue and yellow?', a: 'Green', w: ['Orange', 'Red', 'Purple'], e: 'The order is violet, indigo, blue, green, yellow...' },
        { q: 'Is a rainbow a real object you can touch?', a: 'No', w: ['Yes, it is solid', 'Only if you climb high', 'Yes, it is made of paint'], e: 'A rainbow is an optical illusion caused by light.' },
        { q: 'What does sunlight do in raindrops?', a: 'Bends or refracts', w: ['Gets absorbed completely', 'Changes to darkness', 'Makes the rain warm'], e: 'Light bends (refracts) when passing through water.' },
      ]},
      { title: 'The Tortoise and the Hare', questions: [
        { q: 'Who won the race?', a: 'The tortoise', w: ['The hare', 'Both together', 'Neither of them'], e: 'The tortoise crossed the finish line first.' },
        { q: 'Why did the hare lose?', a: 'He took a nap', w: ['He was too slow', 'He got lost', 'He broke his leg'], e: 'The hare was overconfident and fell asleep.' },
        { q: 'What is the moral of this story?', a: 'Slow and steady wins the race', w: ['Fast runners always win', 'Sleeping helps you win', 'Never race with others'], e: 'Consistent effort leads to success.' },
        { q: 'Who challenged whom to a race?', a: 'The tortoise challenged the hare', w: ['The hare challenged the tortoise', 'A fox challenged them', 'They were forced to race'], e: 'The tortoise was tired of being mocked.' },
        { q: 'Why did the hare make fun of the tortoise?', a: 'For being slow', w: ['For being ugly', 'For being small', 'For being loud'], e: 'The tortoise walked very slowly.' },
        { q: 'Did the hare run fast at first?', a: 'Yes', w: ['No, he walked', 'He stayed still', 'He ran backwards'], e: 'The hare was very fast and got far ahead.' },
        { q: 'What did the hare do during the race?', a: 'Took a nap', w: ['Kept running', 'Ate some food', 'Helped the tortoise'], e: 'He thought he would win easily.' },
        { q: 'How did the tortoise walk?', a: 'Slowly but steadily', w: ['Very fast', 'He stopped often', 'He ran in circles'], e: 'The tortoise never stopped walking.' },
        { q: 'Was the hare overconfident?', a: 'Yes', w: ['No, he was careful', 'He was scared', 'He was tired'], e: 'The hare underestimated the tortoise.' },
        { q: 'What lesson do we learn?', a: 'Never give up', w: ['Always sleep during work', 'Fast is always better', 'Do not try hard things'], e: 'Persistence is more important than speed.' },
      ]},
      { title: 'The Sun and the Wind', questions: [
        { q: 'Who removed the traveller\'s coat in the end?', a: 'The Sun', w: ['The Wind', 'The traveller himself', 'The rain'], e: 'The Sun\'s warmth made the traveller remove his coat.' },
        { q: 'What did the Wind do?', a: 'Blew hard', w: ['Shone brightly', 'Made it rain', 'Did nothing'], e: 'The Wind tried to blow the coat off.' },
        { q: 'What is the moral of the story?', a: 'Kindness is more powerful than force', w: ['Force always wins', 'Never help anyone', 'Wind is stronger than Sun'], e: 'Gentle persuasion works better than force.' },
        { q: 'What did the traveller do when the Wind blew?', a: 'Held his coat tighter', w: ['Removed his coat', 'Ran away', 'Thanked the Wind'], e: 'The harder the Wind blew, the tighter he held on.' },
        { q: 'How did the Sun make the traveller remove his coat?', a: 'By shining warmly', w: ['By making it cold', 'By creating a storm', 'By asking politely'], e: 'The warmth made the traveller comfortable.' },
        { q: 'Who were arguing about strength?', a: 'The Sun and the Wind', w: ['The Moon and the Stars', 'Two travellers', 'The clouds and rain'], e: 'They wanted to know who was stronger.' },
        { q: 'What was the bet about?', a: 'Who could make the traveller remove his coat', w: ['Who could make it rain', 'Who was bigger', 'Who could run faster'], e: 'This was their test of strength.' },
        { q: 'Did force work in this story?', a: 'No', w: ['Yes, perfectly', 'Only at first', 'It worked halfway'], e: 'The Wind\'s force only made things worse.' },
        { q: 'What approach worked better?', a: 'Gentleness and warmth', w: ['Shouting and pushing', 'Being rude', 'Ignoring the problem'], e: 'The Sun\'s gentle warmth succeeded.' },
        { q: 'What do we learn from this story?', a: 'Gentle ways are often more effective', w: ['Always use force', 'Never argue', 'Wind is useless'], e: 'Kindness can achieve what force cannot.' },
      ]},
    ];
    const selected = passages[worldId - 1] || passages[0];
    return (selected.questions as any[]).slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: `From "${selected.title}": ${item.q}`, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i || selected.i };
    });
  }

  // ============ SCIENCE ============
  static science(worldId: number, n = 10): MathQuestion[] {
    const questions: any[][] = [
      // Plants
      [
        { q: 'Look at the diagram. What is the process by which plants make their own food?', a: 'Photosynthesis', w: ['Respiration', 'Digestion', 'Fermentation'], e: 'Plants use sunlight, water, and CO2 to make food.', i: '/assets/img_photosynthesis.png' },
        { q: 'Which part of the plant absorbs water?', a: 'Roots', w: ['Leaves', 'Stem', 'Flowers'], e: 'Roots absorb water and minerals from the soil.' },
        { q: 'What gas do plants take in during photosynthesis?', a: 'Carbon dioxide', w: ['Oxygen', 'Nitrogen', 'Hydrogen'], e: 'Plants take in CO2 and release oxygen.' },
        { q: 'Which part of the flower produces pollen?', a: 'Anther', w: ['Petal', 'Sepal', 'Stigma'], e: 'The anther produces pollen for reproduction.' },
        { q: 'What is the female part of a flower called?', a: 'Pistil', w: ['Stamen', 'Petal', 'Calyx'], e: 'The pistil includes the stigma, style, and ovary.' },
        { q: 'What do plants release during photosynthesis?', a: 'Oxygen', w: ['Carbon dioxide', 'Nitrogen', 'Methane'], e: 'Plants release oxygen as a byproduct of photosynthesis.' },
        { q: 'What is the green pigment in plants called?', a: 'Chlorophyll', w: ['Melanin', 'Hemoglobin', 'Keratin'], e: 'Chlorophyll captures light energy from the sun.' },
        { q: 'Which part of the plant carries food and water?', a: 'Stem', w: ['Roots', 'Leaves', 'Flowers'], e: 'The stem transports water and nutrients throughout the plant.' },
        { q: 'What are the tiny openings on leaves called?', a: 'Stomata', w: ['Thorns', 'Roots', 'Veins'], e: 'Stomata allow gas exchange in plants.' },
        { q: 'What is the process of a seed growing into a plant?', a: 'Germination', w: ['Pollination', 'Photosynthesis', 'Fertilization'], e: 'Germination begins when a seed gets water, air, and warmth.' },
      ],
      // Animals
      [
        { q: 'What is a group of lions called?', a: 'Pride', w: ['Herd', 'Pack', 'Flock'], e: 'A group of lions is called a pride.', i: '/assets/img_animals.png' },
        { q: 'Which animal is known as the ship of the desert?', a: 'Camel', w: ['Elephant', 'Horse', 'Buffalo'], e: 'Camels can survive long periods without water.' },
        { q: 'What do we call animals that eat only plants?', a: 'Herbivores', w: ['Carnivores', 'Omnivores', 'Insectivores'], e: 'Herbivores eat plants; carnivores eat meat.' },
        { q: 'Which bird cannot fly?', a: 'Ostrich', w: ['Penguin', 'Emu', 'Kiwi'], e: 'The ostrich is the largest flightless bird.' },
        { q: 'What is the process of shedding skin called?', a: 'Molting', w: ['Hibernating', 'Migrating', 'Breeding'], e: 'Many animals molt to grow new skin or feathers.' },
        { q: 'What do we call animals that eat only meat?', a: 'Carnivores', w: ['Herbivores', 'Omnivores', 'Frugivores'], e: 'Carnivores hunt and eat other animals.' },
        { q: 'Which is the largest land animal?', a: 'African elephant', w: ['Giraffe', 'Hippopotamus', 'Rhinoceros'], e: 'African elephants are the largest land animals.' },
        { q: 'What is the fastest land animal?', a: 'Cheetah', w: ['Lion', 'Leopard', 'Tiger'], e: 'A cheetah can run up to 70 km/h.' },
        { q: 'Which mammal can fly?', a: 'Bat', w: ['Flying squirrel', 'Eagle', 'Owl'], e: 'Bats are the only mammals capable of true flight.' },
        { q: 'What do we call animals that eat both plants and meat?', a: 'Omnivores', w: ['Herbivores', 'Carnivores', 'Scavengers'], e: 'Omnivores eat both plant and animal matter.' },
      ],
      // Human Body
      [
        { q: 'How many bones does an adult human have?', a: '206', w: ['180', '250', '300'], e: 'An adult has 206 bones; babies have about 300.', i: '/assets/img_human_body.png' },
        { q: 'Which organ pumps blood in our body?', a: 'Heart', w: ['Lungs', 'Liver', 'Kidneys'], e: 'The heart is a muscular organ that pumps blood.' },
        { q: 'What is the largest organ of the human body?', a: 'Skin', w: ['Liver', 'Brain', 'Heart'], e: 'The skin protects our body from germs and heat.' },
        { q: 'How many teeth does an adult human have?', a: '32', w: ['28', '36', '24'], e: 'Adults have 32 teeth including wisdom teeth.' },
        { q: 'Which part of the brain controls balance?', a: 'Cerebellum', w: ['Cerebrum', 'Medulla', 'Hypothalamus'], e: 'The cerebellum is at the back of the brain.' },
        { q: 'What is the liquid part of blood called?', a: 'Plasma', w: ['Serum', 'Lymph', 'Mucus'], e: 'Plasma makes up about 55% of blood volume.' },
        { q: 'How many chambers does the human heart have?', a: 'Four', w: ['Two', 'Three', 'Five'], e: 'The heart has two atria and two ventricles.' },
        { q: 'What is the tube that carries food to the stomach?', a: 'Oesophagus', w: ['Trachea', 'Intestine', 'Vein'], e: 'The oesophagus carries food from mouth to stomach.' },
        { q: 'What gives blood its red colour?', a: 'Haemoglobin', w: ['Chlorophyll', 'Melanin', 'Calcium'], e: 'Haemoglobin is a protein that carries oxygen.' },
        { q: 'Which organ helps us breathe?', a: 'Lungs', w: ['Heart', 'Stomach', 'Brain'], e: 'The lungs take in oxygen and remove carbon dioxide.' },
      ],
      // Matter
      [
        { q: 'What are the three states of matter?', a: 'Solid, liquid, gas', w: ['Earth, wind, fire', 'Hot, warm, cold', 'Big, medium, small'], e: 'Matter exists as solid, liquid, or gas.', i: '/assets/img_water_cycle.png' },
        { q: 'At what temperature does water boil?', a: '100 degrees Celsius', w: ['50 degrees Celsius', '150 degrees Celsius', '0 degrees Celsius'], e: 'Water boils at 100 degrees C at sea level.' },
        { q: 'What is the process of liquid turning to gas called?', a: 'Evaporation', w: ['Condensation', 'Freezing', 'Melting'], e: 'Evaporation happens when liquid is heated.' },
        { q: 'What is the process of gas turning to liquid called?', a: 'Condensation', w: ['Evaporation', 'Sublimation', 'Fusion'], e: 'Condensation is when gas cools and becomes liquid.' },
        { q: 'What is the freezing point of water?', a: '0 degrees Celsius', w: ['10 degrees Celsius', 'Minus 10 degrees Celsius', '50 degrees Celsius'], e: 'Water freezes at 0 degrees C.' },
        { q: 'What is the process of solid turning directly to gas?', a: 'Sublimation', w: ['Evaporation', 'Condensation', 'Melting'], e: 'Dry ice (solid CO2) sublimates directly to gas.' },
        { q: 'Which state of matter has a fixed shape and volume?', a: 'Solid', w: ['Liquid', 'Gas', 'Plasma'], e: 'Solids have tightly packed particles.' },
        { q: 'What do we call a mixture of two or more metals?', a: 'Alloy', w: ['Compound', 'Solution', 'Element'], e: 'Brass and bronze are examples of alloys.' },
        { q: 'Which metal is liquid at room temperature?', a: 'Mercury', w: ['Gold', 'Iron', 'Copper'], e: 'Mercury is the only metal that is liquid at room temp.' },
        { q: 'What is the chemical formula of water?', a: 'H2O', w: ['CO2', 'NaCl', 'O2'], e: 'Water is made of two hydrogen atoms and one oxygen atom.' },
      ],
      // Force & Motion
      [
        { q: 'What force pulls objects toward the Earth?', a: 'Gravity', w: ['Magnetism', 'Friction', 'Electricity'], e: 'Gravity is the force of attraction between objects.', i: '/assets/img_3d_shapes.png' },
        { q: 'What is the unit of force?', a: 'Newton', w: ['Watt', 'Volt', 'Gram'], e: 'Force is measured in Newtons (N).' },
        { q: 'What is a push or a pull called?', a: 'Force', w: ['Energy', 'Motion', 'Speed'], e: 'Force can change the motion of an object.' },
        { q: 'Which simple machine is a sloping surface?', a: 'Inclined plane', w: ['Lever', 'Pulley', 'Wheel'], e: 'An inclined plane makes it easier to lift objects.' },
        { q: 'What is the pivot point of a lever called?', a: 'Fulcrum', w: ['Axle', 'Gear', 'Shaft'], e: 'The fulcrum is the fixed point a lever rotates around.' },
        { q: 'What is the force that opposes motion?', a: 'Friction', w: ['Gravity', 'Magnetism', 'Tension'], e: 'Friction slows down moving objects.' },
        { q: 'Which simple machine is a wheel with a groove?', a: 'Pulley', w: ['Gear', 'Lever', 'Wedge'], e: 'A pulley helps lift heavy objects easily.' },
        { q: 'What is the tendency of an object to resist motion change?', a: 'Inertia', w: ['Momentum', 'Velocity', 'Acceleration'], e: 'Inertia keeps objects moving or at rest.' },
        { q: 'What force slows a parachute down?', a: 'Air resistance', w: ['Gravity', 'Friction', 'Magnetism'], e: 'Air resistance pushes against falling objects.' },
        { q: 'What is the speeding up of an object called?', a: 'Acceleration', w: ['Velocity', 'Speed', 'Deceleration'], e: 'Acceleration is the rate of change of velocity.' },
      ],
      // Energy
      [
        { q: 'What is the main source of energy for Earth?', a: 'The Sun', w: ['The Moon', 'Volcanoes', 'Lightning'], e: 'The Sun provides light and heat energy.' },
        { q: 'What type of energy is in a battery?', a: 'Chemical energy', w: ['Solar energy', 'Wind energy', 'Nuclear energy'], e: 'Batteries store chemical energy that converts to electrical.' },
        { q: 'What do we call materials that allow electricity to flow?', a: 'Conductors', w: ['Insulators', 'Resistors', 'Semiconductors'], e: 'Metals like copper are good conductors.' },
        { q: 'What do we call materials that block electricity?', a: 'Insulators', w: ['Conductors', 'Magnets', 'Electrodes'], e: 'Rubber and plastic are good insulators.' },
        { q: 'What type of circuit has only one path for electricity?', a: 'Series circuit', w: ['Parallel circuit', 'Open circuit', 'Short circuit'], e: 'In a series circuit, current flows through one path.' },
        { q: 'What is energy of motion called?', a: 'Kinetic energy', w: ['Potential energy', 'Thermal energy', 'Solar energy'], e: 'Moving objects have kinetic energy.' },
        { q: 'What is stored energy called?', a: 'Potential energy', w: ['Kinetic energy', 'Heat energy', 'Light energy'], e: 'A stretched spring has potential energy.' },
        { q: 'Which metal is the best conductor of electricity?', a: 'Silver', w: ['Gold', 'Aluminium', 'Lead'], e: 'Silver is the best conductor, followed by copper.' },
        { q: 'What converts electrical energy to light?', a: 'Bulb', w: ['Fan', 'Battery', 'Motor'], e: 'A bulb or lamp converts electricity to light.' },
        { q: 'What is a circuit with multiple paths called?', a: 'Parallel circuit', w: ['Series circuit', 'Closed circuit', 'Direct circuit'], e: 'In parallel circuits, current can flow through multiple paths.' },
      ],
      // Earth
      [
        { q: 'What are the three types of rocks?', a: 'Igneous, sedimentary, metamorphic', w: ['Hard, soft, medium', 'Gold, silver, iron', 'Big, small, medium'], e: 'Rocks are classified into these three types.', i: '/assets/img_earth_globe.png' },
        { q: 'What is a fossil?', a: 'Remains of ancient living things', w: ['A type of rock', 'A precious stone', 'A type of soil'], e: 'Fossils are preserved remains of plants and animals.' },
        { q: 'What is the hardest natural mineral?', a: 'Diamond', w: ['Quartz', 'Granite', 'Marble'], e: 'Diamond is rated 10 on the Mohs hardness scale.' },
        { q: 'What are the three layers of the Earth?', a: 'Crust, mantle, core', w: ['Sky, land, water', 'Top, middle, bottom', 'Soil, sand, clay'], e: 'The Earth has a crust, mantle, and core.' },
        { q: 'What is molten rock inside the Earth called?', a: 'Magma', w: ['Lava', 'Obsidian', 'Granite'], e: 'Magma is molten rock beneath the Earth\'s surface.' },
        { q: 'What is molten rock that reaches the surface?', a: 'Lava', w: ['Magma', 'Basalt', 'Sand'], e: 'Lava is magma that erupts from a volcano.' },
        { q: 'What is the study of rocks called?', a: 'Geology', w: ['Biology', 'Archaeology', 'Geography'], e: 'Geologists study rocks and the Earth.' },
        { q: 'Which is the tallest mountain on Earth?', a: 'Mount Everest', w: ['K2', 'Kilimanjaro', 'Makalu'], e: 'Mount Everest is 8,849 meters tall.' },
        { q: 'What is the outermost layer of the Earth called?', a: 'Crust', w: ['Core', 'Mantle', 'Atmosphere'], e: 'The crust is the thin, solid outermost layer.' },
        { q: 'What are broken pieces of rock called?', a: 'Sediments', w: ['Fossils', 'Minerals', 'Crystals'], e: 'Sediments pile up and form sedimentary rocks.' },
      ],
      // Weather
      [
        { q: 'What instrument measures temperature?', a: 'Thermometer', w: ['Barometer', 'Hygrometer', 'Anemometer'], e: 'A thermometer measures hot and cold.', i: '/assets/img_rainbow.png' },
        { q: 'What is water falling from clouds called?', a: 'Precipitation', w: ['Evaporation', 'Condensation', 'Transpiration'], e: 'Rain, snow, sleet, and hail are all precipitation.' },
        { q: 'What are clouds made of?', a: 'Tiny water droplets', w: ['Cotton', 'Smoke', 'Dust only'], e: 'Clouds form when water vapor condenses.' },
        { q: 'What do we call the average weather of a place over time?', a: 'Climate', w: ['Temperature', 'Season', 'Forecast'], e: 'Climate is long-term weather patterns.' },
        { q: 'What is the center of a hurricane called?', a: 'Eye', w: ['Nose', 'Heart', 'Mouth'], e: 'The eye is the calm center of a hurricane.' },
        { q: 'What instrument measures rainfall?', a: 'Rain gauge', w: ['Wind vane', 'Thermometer', 'Compass'], e: 'A rain gauge collects and measures rain.' },
        { q: 'What is a violent rotating column of air?', a: 'Tornado', w: ['Hurricane', 'Typhoon', 'Cyclone'], e: 'Tornadoes have very strong spinning winds.' },
        { q: 'What do we call frozen raindrops?', a: 'Hail', w: ['Snow', 'Sleet', 'Frost'], e: 'Hail forms when raindrops freeze in storm clouds.' },
        { q: 'Which gas in the air do we need to breathe?', a: 'Oxygen', w: ['Carbon dioxide', 'Nitrogen', 'Helium'], e: 'Air contains about 21% oxygen.' },
        { q: 'What is the boundary between two air masses?', a: 'Front', w: ['Zone', 'Line', 'Wall'], e: 'Weather fronts bring changes in temperature and precipitation.' },
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ SOCIAL SCIENCE ============
  static social(worldId: number, n = 10): MathQuestion[] {
    const questions: any[][] = [
      // Ancient Civilizations
      [
        { q: 'Which ancient civilization built the pyramids?', a: 'Egyptians', w: ['Romans', 'Greeks', 'Persians'], e: 'The Great Pyramids of Giza were built by ancient Egyptians.', i: '/assets/img_pyramid.png' },
        { q: 'Which river was the cradle of ancient Indian civilization?', a: 'Indus River', w: ['Ganga River', 'Yamuna River', 'Brahmaputra River'], e: 'The Indus Valley Civilization flourished along the Indus River.' },
        { q: 'Who was the first emperor of unified China?', a: 'Qin Shi Huang', w: ['Genghis Khan', 'Kublai Khan', 'Sun Tzu'], e: 'He united China and built the Great Wall.' },
        { q: 'What was the writing system of ancient Egypt called?', a: 'Hieroglyphics', w: ['Cuneiform', 'Sanskrit', 'Latin'], e: 'Hieroglyphics used picture symbols to represent words.' },
        { q: 'Which ancient city is known as the lost city of the Incas?', a: 'Machu Picchu', w: ['Petra', 'Tikal', 'Angkor Wat'], e: 'Machu Picchu is in Peru, built in the 15th century.' },
        { q: 'Which civilization invented the wheel?', a: 'Sumerians', w: ['Egyptians', 'Chinese', 'Indians'], e: 'The Sumerians of Mesopotamia invented the wheel.' },
        { q: 'What was the Great Wall of China built for?', a: 'Protection from invaders', w: ['For decoration', 'To keep animals in', 'For trading goods'], e: 'The wall protected China from northern invasions.' },
        { q: 'Which river was crucial to ancient Egyptian civilization?', a: 'Nile River', w: ['Amazon River', 'Tigris River', 'Euphrates River'], e: 'The Nile provided water and fertile soil for farming.' },
        { q: 'What were ancient Egyptian rulers called?', a: 'Pharaohs', w: ['Kings', 'Emperors', 'Sultans'], e: 'Pharaohs were the kings and religious leaders of Egypt.' },
        { q: 'Which ancient civilization created the decimal system?', a: 'Indians', w: ['Arabs', 'Romans', 'Chinese'], e: 'Ancient Indians developed the decimal numeral system.' },
      ],
      // Freedom Movement
      [
        { q: 'Who is known as the Father of the Nation in India?', a: 'Mahatma Gandhi', w: ['Jawaharlal Nehru', 'Sardar Patel', 'Bhagat Singh'], e: 'Gandhi led India\'s non-violent independence movement.', i: '/assets/img_indian_flag.png' },
        { q: 'In which year did India gain independence?', a: '1947', w: ['1942', '1950', '1935'], e: 'India became independent on August 15, 1947.' },
        { q: 'What was the non-cooperation movement about?', a: 'Boycotting British goods', w: ['Helping the British', 'Trading with British', 'Learning English'], e: 'Indians boycotted British goods and institutions.' },
        { q: 'Who gave the slogan "Jai Hind"?', a: 'Subhas Chandra Bose', w: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Lal Bahadur Shastri'], e: 'Netaji Bose used this slogan for the INA.' },
        { q: 'What is the national flag of India called?', a: 'Tiranga', w: ['Tricolour', 'Jhanda', 'Dhwaj'], e: 'The Tiranga has three colors: saffron, white, and green.' },
        { q: 'Who was the first Prime Minister of India?', a: 'Jawaharlal Nehru', w: ['Mahatma Gandhi', 'Sardar Patel', 'Rajendra Prasad'], e: 'Nehru served as PM from 1947 to 1964.' },
        { q: 'What is the Dandi March famous for?', a: 'Salt protest', w: ['Cotton protest', 'Sugar protest', 'Rice protest'], e: 'Gandhi protested the British salt tax by making salt.' },
        { q: 'When is Independence Day celebrated?', a: '15th August', w: ['26th January', '2nd October', '14th November'], e: 'India gained independence on August 15, 1947.' },
        { q: 'Who wrote the national anthem of India?', a: 'Rabindranath Tagore', w: ['Bankim Chandra Chatterjee', 'Sarojini Naidu', 'Muhammad Iqbal'], e: 'Tagore wrote Jana Gana Mana.' },
        { q: 'What colour represents courage on the Indian flag?', a: 'Saffron', w: ['White', 'Green', 'Blue'], e: 'The top saffron stripe stands for courage.' },
      ],
      // Maps & Geography
      [
        { q: 'What does a map\'s scale show?', a: 'The ratio of distance on map to real distance', w: ['The size of the map', 'The colour of places', 'The weather of places'], e: 'Scale helps measure real distances on a map.', i: '/assets/img_compass.png' },
        { q: 'Which lines run horizontally on a globe?', a: 'Latitude lines', w: ['Longitude lines', 'Equator lines', 'Polar lines'], e: 'Latitudes run east-west, parallel to the equator.' },
        { q: 'What is the line at 0 degrees latitude called?', a: 'Equator', w: ['Prime Meridian', 'Tropic of Cancer', 'Arctic Circle'], e: 'The Equator divides Earth into Northern and Southern Hemispheres.' },
        { q: 'Which color is usually used for water on maps?', a: 'Blue', w: ['Green', 'Brown', 'Red'], e: 'Maps use blue to show oceans, rivers, and lakes.' },
        { q: 'What does a compass rose show?', a: 'Directions', w: ['Distances', 'Heights', 'Temperatures'], e: 'A compass rose shows North, South, East, and West.' },
        { q: 'Which lines run vertically on a globe?', a: 'Longitude lines', w: ['Latitude lines', 'Time zone lines', 'Border lines'], e: 'Longitudes run north-south from pole to pole.' },
        { q: 'What does green usually represent on a map?', a: 'Low land or plains', w: ['Mountains', 'Water bodies', 'Deserts'], e: 'Green shows low-lying areas suitable for farming.' },
        { q: 'What is a map key also called?', a: 'Legend', w: ['Index', 'Scale', 'Title'], e: 'A legend explains the symbols used on a map.' },
        { q: 'What is a globe a model of?', a: 'Earth', w: ['The Moon', 'The Sun', 'Mars'], e: 'A globe is a spherical model of Earth.' },
        { q: 'What do brown lines on a map usually show?', a: 'Mountains or high land', w: ['Rivers', 'Roads', 'Railways'], e: 'Brown indicates higher elevation areas.' },
      ],
      // Continents & Oceans
      [
        { q: 'How many continents are there?', a: 'Seven', w: ['Five', 'Eight', 'Six'], e: 'Asia, Africa, North America, South America, Antarctica, Europe, Australia.', i: '/assets/img_earth_globe.png' },
        { q: 'Which is the largest ocean?', a: 'Pacific Ocean', w: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], e: 'The Pacific Ocean covers about 30% of Earth\'s surface.' },
        { q: 'Which is the smallest continent?', a: 'Australia', w: ['Europe', 'Antarctica', 'South America'], e: 'Australia is both a continent and a country.' },
        { q: 'Which continent is known as the Frozen Continent?', a: 'Antarctica', w: ['Asia', 'Europe', 'North America'], e: 'Antarctica is covered in ice and is the coldest place.' },
        { q: 'Which ocean is named after a country?', a: 'Indian Ocean', w: ['Pacific Ocean', 'Atlantic Ocean', 'Arctic Ocean'], e: 'The Indian Ocean is named after India.' },
        { q: 'Which is the largest continent?', a: 'Asia', w: ['Africa', 'North America', 'Europe'], e: 'Asia covers about 30% of Earth\'s land area.' },
        { q: 'Which ocean is the smallest?', a: 'Arctic Ocean', w: ['Indian Ocean', 'Atlantic Ocean', 'Southern Ocean'], e: 'The Arctic Ocean is around the North Pole.' },
        { q: 'Which continent has the most countries?', a: 'Africa', w: ['Asia', 'Europe', 'South America'], e: 'Africa has 54 recognized countries.' },
        { q: 'What separates Europe from Africa?', a: 'Mediterranean Sea', w: ['Atlantic Ocean', 'Red Sea', 'Black Sea'], e: 'The Mediterranean Sea lies between them.' },
        { q: 'Which ocean lies between Africa and Australia?', a: 'Indian Ocean', w: ['Pacific Ocean', 'Atlantic Ocean', 'Southern Ocean'], e: 'The Indian Ocean borders Africa, Asia, and Australia.' },
      ],
      // Civics
      [
        { q: 'What is the highest court in India?', a: 'Supreme Court', w: ['High Court', 'District Court', 'Lok Sabha'], e: 'The Supreme Court is the guardian of the Constitution.', i: '/assets/img_indian_flag.png' },
        { q: 'How many fundamental rights do Indian citizens have?', a: 'Six', w: ['Four', 'Eight', 'Ten'], e: 'Right to Equality, Freedom, Religion, etc.' },
        { q: 'Who is called the first citizen of India?', a: 'President', w: ['Prime Minister', 'Chief Justice', 'Speaker'], e: 'The President is the ceremonial head of state.' },
        { q: 'What is the minimum voting age in India?', a: '18 years', w: ['16 years', '21 years', '25 years'], e: 'Every citizen 18 and above can vote.' },
        { q: 'What is the national anthem of India?', a: 'Jana Gana Mana', w: ['Vande Mataram', 'Saare Jahan', 'Ae Mere Watan'], e: 'Written by Rabindranath Tagore.' },
        { q: 'What is the Parliament of India called?', a: 'Sansad', w: ['Panchayat', 'Cabinet', 'Assembly'], e: 'The Indian Parliament consists of Lok Sabha and Rajya Sabha.' },
        { q: 'How many years is a Lok Sabha term?', a: 'Five', w: ['Three', 'Four', 'Six'], e: 'Members are elected for a five-year term.' },
        { q: 'What is the written document of rules called?', a: 'Constitution', w: ['Manifesto', 'Law book', 'Register'], e: 'The Constitution is the supreme law of India.' },
        { q: 'Who is the head of the Indian government?', a: 'Prime Minister', w: ['President', 'Chief Minister', 'Governor'], e: 'The PM leads the executive branch.' },
        { q: 'What is the national emblem of India?', a: 'Lion Capital of Ashoka', w: ['Peacock', 'Lotus', 'Wheel'], e: 'It features four lions standing back to back.' },
      ],
      // Economics
      [
        { q: 'What is the system of exchanging goods for goods called?', a: 'Barter system', w: ['Banking system', 'Trade system', 'Money system'], e: 'Before money, people traded goods directly.' },
        { q: 'What is the main occupation in rural India?', a: 'Agriculture', w: ['Manufacturing', 'Banking', 'Teaching'], e: 'Most rural people depend on farming.' },
        { q: 'What do we call money earned from work?', a: 'Income', w: ['Expense', 'Savings', 'Loan'], e: 'Income is the money received for work or investments.' },
        { q: 'What is a person who starts a business called?', a: 'Entrepreneur', w: ['Manager', 'Worker', 'Investor'], e: 'An entrepreneur takes risks to start businesses.' },
        { q: 'What does GDP stand for?', a: 'Gross Domestic Product', w: ['General Development Plan', 'Global Distribution Point', 'Government Duty Policy'], e: 'GDP is the total value of goods and services produced.' },
        { q: 'What is money saved in a bank called?', a: 'Savings', w: ['Spending', 'Borrowing', 'Lending'], e: 'Saving money helps for future needs.' },
        { q: 'What is a tax paid on goods we buy?', a: 'Sales tax', w: ['Income tax', 'Property tax', 'Road tax'], e: 'GST is the goods and services tax in India.' },
        { q: 'What do we call goods sold to other countries?', a: 'Exports', w: ['Imports', 'Products', 'Stocks'], e: 'Exports bring money into the country.' },
        { q: 'What is the paper money issued by RBI called?', a: 'Currency', w: ['Bond', 'Cheque', 'Receipt'], e: 'The Indian currency is the Rupee.' },
        { q: 'What is the place where stocks are traded?', a: 'Stock exchange', w: ['Bank', 'Post office', 'Marketplace'], e: 'BSE and NSE are Indian stock exchanges.' },
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ TAMIL GRAMMAR ============
  static tamilGrammar(worldId: number, n = 10): MathQuestion[] {
    const questions: any[][] = [
      // Alphabets
      [
        { q: 'How many Uyir (vowel) letters are in Tamil?', a: '12', w: ['10', '16', '18'], e: 'Tamil has 12 Uyir letters: அ, ஆ, இ, ஈ, உ, ஊ, எ, ஏ, ஐ, ஒ, ஓ, ஔ' },
        { q: 'How many Mei (consonant) letters are in Tamil?', a: '18', w: ['12', '24', '216'], e: 'Tamil has 18 Mei consonant letters.' },
        { q: 'How many Uyirmei letters are there?', a: '216', w: ['108', '324', '18'], e: 'Uyirmei = combination of Uyir and Mei (12 x 18).' },
        { q: 'What is the first letter of Tamil alphabet?', a: 'அ', w: ['ஆ', 'இ', 'ஔ'], e: 'அ (A) is the first Uyir letter.' },
        { q: 'Which letter group contains க, ங, ச?', a: 'Vallinam', w: ['Mellinam', 'Idaiyinam', 'Uyirmei'], e: 'Vallinam letters are hard consonants.' },
        { q: 'Which letter is the last Uyir letter?', a: 'ஔ', w: ['ஓ', 'ஐ', 'ஆ'], e: 'ஔ is the 12th and last Uyir letter.' },
        { q: 'What are மெய் letters also called?', a: 'Consonants', w: ['Vowels', 'Numbers', 'Symbols'], e: 'மெய் (Mei) letters are consonant sounds.' },
        { q: 'How many vowel sounds are in Tamil?', a: '12', w: ['8', '18', '24'], e: 'Tamil has 12 primary vowel sounds.' },
        { q: 'What is the combination of Uyir and Mei called?', a: 'Uyirmei', w: ['Sandhi', 'Vibhakti', 'Alankaram'], e: 'Uyirmei letters combine vowels and consonants.' },
        { q: 'Which group contains ந, ன, ண?', a: 'Nedil', w: ['Vallinam', 'Mellinam', 'Idaiyinam'], e: 'These are nasal consonant sounds in Tamil.' },
      ],
      // Word Formation
      [
        { q: 'What is "நல்ல" (nalla) in English?', a: 'Good', w: ['Bad', 'Happy', 'Beautiful'], e: 'நல்ல means good.' },
        { q: 'What is "பள்ளி" (palli) in English?', a: 'School', w: ['Temple', 'College', 'Hospital'], e: 'பள்ளி means school.' },
        { q: 'What is the plural of "மரம்" (maram)?', a: 'மரங்கள் (marangal)', w: ['மரம்gal', 'மரங்க', 'மரம்kal'], e: 'Add கள் for plural in Tamil.' },
        { q: 'What is "நீர்" (neer) in English?', a: 'Water', w: ['Milk', 'Juice', 'River'], e: 'நீர் means water.' },
        { q: 'What type of word is "மகிழ்ச்சி" (magizhchi)?', a: 'Abstract noun', w: ['Proper noun', 'Verb', 'Adjective'], e: 'மகிழ்ச்சி (happiness) is an abstract noun.' },
        { q: 'What is "வீடு" (veedu) in English?', a: 'House', w: ['Door', 'Window', 'Roof'], e: 'வீடு means house.' },
        { q: 'What is "அம்மா" (amma) in English?', a: 'Mother', w: ['Sister', 'Grandmother', 'Aunt'], e: 'அம்மா means mother.' },
        { q: 'What is "நண்பன்" (nanban) in English?', a: 'Friend', w: ['Brother', 'Student', 'Teacher'], e: 'நண்பன் means friend (male).' },
        { q: 'What is "புத்தகம்" (puthagam) in English?', a: 'Book', w: ['Paper', 'Pen', 'Note'], e: 'புத்தகம் means book.' },
        { q: 'What is "மழை" (malai) in English?', a: 'Rain', w: ['Cloud', 'Thunder', 'Lightning'], e: 'மழை means rain.' },
      ],
      // Sentence Types
      [
        { q: 'What is a statement sentence called?', a: 'அறிவித்தல் வாக்கியம்', w: ['வினா வாக்கியம்', 'கட்டளை வாக்கியம்', 'மறுப்பு வாக்கியம்'], e: 'Statement sentences give information.' },
        { q: 'What is a question sentence called?', a: 'வினா வாக்கியம்', w: ['அறிவித்தல் வாக்கியம்', 'உணர்ச்சி வாக்கியம்', 'சேர்க்கை வாக்கியம்'], e: 'Question sentences ask for information.' },
        { q: 'What is an order/command sentence called?', a: 'கட்டளை வாக்கியம்', w: ['வேண்டுகோள் வாக்கியம்', 'வினா வாக்கியம்', 'மறுப்பு வாக்கியம்'], e: 'Command sentences tell someone to do something.' },
        { q: 'What punctuation ends a question in Tamil?', a: '?', w: ['!', '.', ','], e: 'Questions end with a question mark.' },
        { q: 'Which sentence type expresses strong feeling?', a: 'உணர்ச்சி வாக்கியம்', w: ['அறிவித்தல் வாக்கியம்', 'வினா வாக்கியம்', 'கட்டளை வாக்கியம்'], e: 'Exclamatory sentences show emotion.' },
        { q: 'What is a sentence that makes a request called?', a: 'வேண்டுகோள் வாக்கியம்', w: ['கட்டளை வாக்கியம்', 'அறிவித்தல் வாக்கியம்', 'சேர்க்கை வாக்கியம்'], e: 'Request sentences ask politely for something.' },
        { q: 'What is the subject of a sentence called?', a: 'எழுவாய்', w: ['பயனிலை', 'வினைச்சொல்', 'பெயர்ச்சொல்'], e: 'The subject performs the action.' },
        { q: 'What is the predicate of a sentence called?', a: 'பயனிலை', w: ['எழுவாய்', 'பெயரடை', 'வினாப்பெயர்'], e: 'The predicate tells what the subject does.' },
        { q: 'What is a compound sentence called?', a: 'சேர்க்கை வாக்கியம்', w: ['எளிய வாக்கியம்', 'வினா வாக்கியம்', 'கட்டளை வாக்கியம்'], e: 'It joins two independent clauses.' },
        { q: 'What is a negative sentence called?', a: 'மறுப்பு வாக்கியம்', w: ['அறிவித்தல் வாக்கியம்', 'வினா வாக்கியம்', 'உணர்ச்சி வாக்கியம்'], e: 'Negative sentences say "no" or "not".' },
      ],
      // Nouns & Pronouns
      [
        { q: 'What is "பெயர்ச்சொல்"?', a: 'Noun', w: ['Verb', 'Adjective', 'Adverb'], e: 'பெயர்ச்சொல் = noun (naming word).' },
        { q: 'What is "பெயரடை"?', a: 'Adjective', w: ['Noun', 'Verb', 'Preposition'], e: 'பெயரடை describes a noun.' },
        { q: 'What is "வினைச்சொல்"?', a: 'Verb', w: ['Noun', 'Adjective', 'Conjunction'], e: 'வினைச்சொல் = verb (action word).' },
        { q: 'What is "இடப்பெயர்"?', a: 'Place noun', w: ['Person noun', 'Thing noun', 'Animal noun'], e: 'இடப்பெயர் = proper noun for places.' },
        { q: 'What is "செயப்பாடு"?', a: 'Verb', w: ['Noun', 'Pronoun', 'Adverb'], e: 'செயப்பாடு = action (verb).' },
        { q: 'What is "எண்ணுப்பெயர்"?', a: 'Numeral', w: ['Pronoun', 'Verb', 'Adjective'], e: 'Numbers used as nouns.' },
        { q: 'What is "வினாப்பெயர்"?', a: 'Interrogative noun', w: ['Demonstrative noun', 'Proper noun', 'Collective noun'], e: 'Words like யார் (who), என்ன (what).' },
        { q: 'What is "சுட்டுப்பெயர்"?', a: 'Demonstrative pronoun', w: ['Personal pronoun', 'Reflexive pronoun', 'Relative pronoun'], e: 'Words like இவன், அவன் (this/that person).' },
        { q: 'What is "ஒலிப்பெயர்"?', a: 'Onomatopoeia', w: ['Synonym', 'Antonym', 'Homonym'], e: 'Words that imitate sounds.' },
        { q: 'What is "காலப்பெயர்"?', a: 'Temporal noun', w: ['Spatial noun', 'Material noun', 'Abstract noun'], e: 'Nouns related to time like today, yesterday.' },
      ],
      // Verbs & Tenses
      [
        { q: 'What is present tense called in Tamil?', a: 'நிகழ்காலம்', w: ['இறந்தகாலம்', 'எதிர்காலம்', 'காலமில்லை'], e: 'நிகழ்காலம் = present tense.' },
        { q: 'What is past tense called in Tamil?', a: 'இறந்தகாலம்', w: ['நிகழ்காலம்', 'எதிர்காலம்', 'இன்றியமையா'], e: 'இறந்தகாலம் = past tense.' },
        { q: 'What is future tense called in Tamil?', a: 'எதிர்காலம்', w: ['நிகழ்காலம்', 'இறந்தகாலம்', 'நடப்பு'], e: 'எதிர்காலம் = future tense.' },
        { q: 'What is the verb "to go" in Tamil?', a: 'செல்', w: ['வரு', 'ஓடு', 'படி'], e: 'செல் = go.' },
        { q: 'What is "ஓடு" in English?', a: 'Run', w: ['Walk', 'Jump', 'Sit'], e: 'ஓடு = run.' },
        { q: 'What is "வரு" in English?', a: 'Come', w: ['Go', 'Stay', 'Leave'], e: 'வரு = come.' },
        { q: 'What is "படி" in English?', a: 'Read/Study', w: ['Write', 'Speak', 'Listen'], e: 'படி = read or study.' },
        { q: 'What is "எழுது" in English?', a: 'Write', w: ['Read', 'Speak', 'Sing'], e: 'எழுது = write.' },
        { q: 'What is a transitive verb called?', a: 'செயப்பாட்டு வினை', w: ['செயப்படு வினை', 'இடைச்சொல்', 'பெயர்ச்சொல்'], e: 'A verb that takes an object.' },
        { q: 'What is an intransitive verb called?', a: 'செயப்படு வினை', w: ['செயப்பாட்டு வினை', 'உரிச்சொல்', 'இடைச்சொல்'], e: 'A verb that does not need an object.' },
      ],
      // Grammar Rules
      [
        { q: 'What is "வேற்றுமை"?', a: 'Vibhakti (case ending)', w: ['Sandhi', 'Alankaram', 'Tinai'], e: 'Vibhakti shows the relationship between words.' },
        { q: 'How many types of Vibhakti are there?', a: '8', w: ['6', '10', '12'], e: 'Tamil has 8 Vibhakti (case endings).' },
        { q: 'What is "சந்தி"?', a: 'Sandhi (joining rule)', w: ['Vibhakti', 'Punarchi', 'Alankaram'], e: 'Sandhi is the rule for joining words together.' },
        { q: 'What is "ஒற்றுமை" in grammar?', a: 'Agreement', w: ['Disagreement', 'Harmony', ['Balance']], e: 'Words must agree in gender, number, and person.' },
        { q: 'What is "எதுகை"?', a: 'Opposite words', w: ['Rhyming words', 'Similar words', 'Descriptive words'], e: 'எதுகை = opposite/antonym in Tamil.' },
        { q: 'What is "மோனை"?', a: 'Alliteration', w: ['Rhyme', 'Metaphor', 'Simile'], e: 'Repeated first consonant sounds.' },
        { q: 'What is "எதுகை" in poetry?', a: 'Rhyming opposite', w: ['Alliteration', 'Metaphor', 'Personification'], e: 'Words with opposite meanings that rhyme.' },
        { q: 'How many grammatical cases are in Tamil?', a: '8', w: ['5', '7', '10'], e: 'Tamil uses 8 cases (வேற்றுமை உருபுகள்).' },
        { q: 'What is "இயல்பு" in grammar?', a: 'Natural form', w: ['Changed form', 'Plural form', 'Past form'], e: 'The natural or unchanged form of a word.' },
        { q: 'What is "புணர்ச்சி"?', a: 'Combination', w: ['Separation', 'Division', 'Exclusion'], e: 'When two words join together.' },
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ HINDI (3rd Language) ============
  static hindi(worldId: number, n = 10): MathQuestion[] {
    const questions: any[][] = [
      // Vocabulary
      [
        { q: 'What is "किताब" in English?', a: 'Book', w: ['Pen', 'Paper', 'Bag'], e: 'किताब = book.' },
        { q: 'What is "पानी" in English?', a: 'Water', w: ['Milk', 'Juice', 'Tea'], e: 'पानी = water.' },
        { q: 'What is "स्कूल" in English?', a: 'School', w: ['College', 'Hospital', 'Office'], e: 'स्कूल = school.' },
        { q: 'What is "मित्र" in English?', a: 'Friend', w: ['Enemy', 'Teacher', 'Stranger'], e: 'मित्र = friend.' },
        { q: 'What is "सूरज" in English?', a: 'Sun', w: ['Moon', 'Star', 'Cloud'], e: 'सूरज = sun.' },
        { q: 'What is "माँ" in English?', a: 'Mother', w: ['Father', 'Sister', 'Daughter'], e: 'माँ = mother.' },
        { q: 'What is "घर" in English?', a: 'House', w: ['Room', 'Door', 'Garden'], e: 'घर = house.' },
        { q: 'What is "खाना" in English?', a: 'Food', w: ['Water', 'Fruit', 'Vegetable'], e: 'खाना = food.' },
        { q: 'What is "बच्चा" in English?', a: 'Child', w: ['Adult', 'Baby', 'Parent'], e: 'बच्चा = child.' },
        { q: 'What is "पेड़" in English?', a: 'Tree', w: ['Leaf', 'Flower', 'Plant'], e: 'पेड़ = tree.' },
      ],
      // Grammar (Ling, Vachan, Kaal)
      [
        { q: 'What is the plural of "लड़का"?', a: 'लड़के', w: ['लड़की', 'लड़कों', 'लड़कियाँ'], e: 'लड़का (boy) → लड़के (boys).' },
        { q: 'What is the feminine of "राजा"?', a: 'रानी', w: ['राजकुमारी', 'महारानी', 'दासी'], e: 'राजा (king) → रानी (queen).' },
        { q: 'What is the past tense of "खाना"?', a: 'खाया', w: ['खाता', 'खाएगा', 'खा'], e: 'खाना (to eat) → खाया (ate).' },
        { q: 'What is the feminine gender called in Hindi?', a: 'स्त्रीलिंग', w: ['पुल्लिंग', ' napumsakling', 'ubhayling'], e: 'स्त्रीलिंग = feminine gender.' },
        { q: 'What is the masculine gender called in Hindi?', a: 'पुल्लिंग', w: ['स्त्रीलिंग', 'वचन', 'कारक'], e: 'पुल्लिंग = masculine gender.' },
        { q: 'What is the plural of "लड़की"?', a: 'लड़कियाँ', w: ['लड़के', 'लड़कियों', 'लड़का'], e: 'लड़की (girl) → लड़कियाँ (girls).' },
        { q: 'What is one in Hindi called?', a: 'एकवचन', w: ['बहुवचन', 'पुल्लिंग', 'स्त्रीलिंग'], e: 'एकवचन = singular.' },
        { q: 'What is many in Hindi called?', a: 'बहुवचन', w: ['एकवचन', 'अनेक', 'कई'], e: 'बहुवचन = plural.' },
        { q: 'What is the feminine of "भाई"?', a: 'बहन', w: ['माँ', 'पत्नी', 'बेटी'], e: 'भाई (brother) → बहन (sister).' },
        { q: 'What is the past tense of "जाना"?', a: 'गया', w: ['जाता', 'जाएगा', 'जा'], e: 'जाना (to go) → गया (went).' },
      ],
      // Sentence Formation
      [
        { q: 'What is a "वाक्य"?', a: 'Sentence', w: ['Word', 'Paragraph', 'Letter'], e: 'वाक्य = sentence.' },
        { q: 'What type of sentence is "राम खाता है"?', a: 'सरल वाक्य', w: ['मिश्र वाक्य', 'संयुक्त वाक्य', 'विस्मयादिबोधक वाक्य'], e: 'सरल वाक्य = simple sentence.' },
        { q: 'What is the subject of "राम स्कूल जाता है"?', a: 'राम', w: ['स्कूल', 'जाता', 'है'], e: 'राम is doing the action (going).' },
        { q: 'What is the verb in "वह गाता है"?', a: 'गाता', w: ['वह', 'है', 'गाना'], e: 'गाता = sings (the action).' },
        { q: 'Which punctuation ends a question in Hindi?', a: '?', w: ['!', '.', ','], e: 'Questions use ? at the end.' },
        { q: 'What is the object in "मैं किताब पढ़ता हूँ"?', a: 'किताब', w: ['मैं', 'पढ़ता', 'हूँ'], e: 'किताब (book) is being read.' },
        { q: 'What type of sentence is a question?', a: 'प्रश्नवाचक वाक्य', w: ['सरल वाक्य', 'कथन वाक्य', 'आज्ञार्थक वाक्य'], e: 'Interrogative sentence.' },
        { q: 'What is a negative sentence called?', a: 'नकारात्मक वाक्य', w: ['सकारात्मक वाक्य', 'सरल वाक्य', 'मिश्र वाक्य'], e: 'Sentences with "no" or "not".' },
        { q: 'What is the verb "to be" in Hindi?', a: 'होना', w: ['करना', 'जाना', 'देना'], e: 'होना means to be/exist.' },
        { q: 'What is an exclamatory sentence called?', a: 'विस्मयादिबोधक वाक्य', w: ['संयुक्त वाक्य', 'सरल वाक्य', 'प्रश्नवाचक वाक्य'], e: 'Sentences showing surprise or emotion.' },
      ],
      // Comprehension
      [
        { q: 'What is "गधा" in English?', a: 'Donkey', w: ['Horse', 'Cow', 'Goat'], e: 'गधा = donkey.' },
        { q: 'What is "पक्षी" in English?', a: 'Bird', w: ['Animal', 'Insect', 'Fish'], e: 'पक्षी = bird.' },
        { q: 'What is "खुश" in English?', a: 'Happy', w: ['Sad', 'Angry', 'Tired'], e: 'खुश = happy.' },
        { q: 'What is "बड़ा" in English?', a: 'Big', w: ['Small', 'Tall', 'Wide'], e: 'बड़ा = big.' },
        { q: 'What is "चोटी" in English?', a: 'Peak/top', w: ['Bottom', 'Middle', 'Side'], e: 'चोटी = peak or top.' },
        { q: 'What is "छोटा" in English?', a: 'Small', w: ['Big', 'Tall', 'Long'], e: 'छोटा = small.' },
        { q: 'What is "तेज" in English?', a: 'Fast', w: ['Slow', 'Weak', 'Quiet'], e: 'तेज = fast.' },
        { q: 'What is "अच्छा" in English?', a: 'Good', w: ['Bad', 'Okay', 'Fine'], e: 'अच्छा = good.' },
        { q: 'What is "सच" in English?', a: 'Truth', w: ['Lie', 'Story', 'News'], e: 'सच = truth.' },
        { q: 'What is "झूठ" in English?', a: 'Lie', w: ['Truth', 'Fact', 'Reality'], e: 'झूठ = lie.' },
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ MAIN ROUTER ============
  static getQuestions(subjectId: string, bookId: number, worldId: number, count = 5): MathQuestion[] {
    switch (subjectId) {
      case 'math': {
        switch (worldId) {
          case 1: return this.mathPlaceValue(count);
          case 2: return this.mathMultiply(count);
          case 3: return this.mathDivide(count);
          case 4: return this.mathFactors(count);
          case 5: return this.mathFractions(count);
          case 6: return this.mathDecimals(count);
          case 7: return this.mathPercent(count);
          case 8: return this.mathGeometry(count);
          case 9: return this.mathMeasure(count);
          case 10: return this.mathData(count);
          default: return this.mathPlaceValue(count);
        }
      }
      case 'english': {
        if (bookId === 1) return this.engTextbook(worldId, count);
        return this.engGrammar(worldId, count);
      }
      case 'science': return this.science(worldId, count);
      case 'social': return this.social(worldId, count);
      case 'tamil': return this.tamilGrammar(worldId, count);
      case 'hindi': return this.hindi(worldId, count);
      default: return this.mathPlaceValue(count);
    }
  }
}

export { QG as QuestionGenerator };