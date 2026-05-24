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

  // ============ MATH (12 chapters - Cambridge Primary Maths / NCERT Grade 5) ============
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

  static mathAddSubtract(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) { const a = this.getRandomInt(1000, 9999), b = this.getRandomInt(1000, 9999), s = a + b; q.push({ question: `What is ${a.toLocaleString()} + ${b.toLocaleString()}?`, ...this.makeOptions(s.toLocaleString(), [() => (s + this.getRandomInt(1, 50)).toLocaleString(), () => (s - this.getRandomInt(1, 50)).toLocaleString(), () => (a + b + this.getRandomInt(100, 500)).toLocaleString()]), explanation: `${a.toLocaleString()} + ${b.toLocaleString()} = ${s.toLocaleString()}.` }); }
      else { const a = this.getRandomInt(1000, 9999), b = this.getRandomInt(100, a - 1), diff = a - b; q.push({ question: `What is ${a.toLocaleString()} - ${b.toLocaleString()}?`, ...this.makeOptions(diff.toLocaleString(), [() => (diff + this.getRandomInt(1, 50)).toLocaleString(), () => (diff - this.getRandomInt(1, 50)).toLocaleString(), () => (a + b).toLocaleString()]), explanation: `${a.toLocaleString()} - ${b.toLocaleString()} = ${diff.toLocaleString()}.` }); }
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

  static mathMoney(n = 5): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const p = this.getRandomInt(10, 500), r = this.getRandomInt(5, p - 1); q.push({ question: `An item costs ₹${p}. You pay ₹${p + r}. What is the change?`, ...this.makeOptions(`₹${r}`, [() => `₹${r + this.getRandomInt(1, 10)}`, () => `₹${Math.max(1, r - this.getRandomInt(1, 5))}`, () => `₹${p}`]), explanation: `Change = Amount paid - Cost = ₹${p + r} - ₹${p} = ₹${r}.` }); }
      else if (i % 3 === 1) { const a = this.getRandomInt(5, 50), b = this.getRandomInt(5, 50), c = this.getRandomInt(5, 50), s = a + b + c; q.push({ question: `You buy items for ₹${a}, ₹${b}, and ₹${c}. What is the total?`, ...this.makeOptions(`₹${s}`, [() => `₹${s + this.getRandomInt(1, 10)}`, () => `₹${s - this.getRandomInt(1, 5)}`, () => `₹${a + b}`]), explanation: `Total = ₹${a} + ₹${b} + ₹${c} = ₹${s}.` }); }
      else { const r = this.getRandomInt(2, 10), qty = this.getRandomInt(2, 12), tot = r * qty; q.push({ question: `1 pen costs ₹${r}. What is the cost of ${qty} pens?`, ...this.makeOptions(`₹${tot}`, [() => `₹${tot + this.getRandomInt(1, 10)}`, () => `₹${r + qty}`, () => `₹${Math.max(1, tot - this.getRandomInt(1, 5))}`]), explanation: `Cost = ₹${r} x ${qty} = ₹${tot}.` }); }
    }
    return q;
  }

  // ============ ENGLISH GRAMMAR (Communicate with Cambridge Grade 5 Grammar) ============
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

  // ============ ENGLISH TEXTBOOK (Communicate with Cambridge Grade 5) ============
  // 10 chapters: Chuskit, Thunder Cake, Peter Pan, Coral Reef, Inspiring Women,
  // Go Green, Midsummer Night's Dream, Immigrant Experience, The Umbrella, Explorers
  static engTextbook(worldId: number, n = 10): MathQuestion[] {
    const passages: any[] = [
      // World 1: Chuskit Goes to School (Chapter 1) - Courage & Inclusion
      { questions: [
        { q: "A girl who uses a wheelchair wants to go to school. What is her biggest challenge?", a: "There are no proper roads for her wheelchair", w: ["She has no books", "She has no friends", "She does not want to study"], e: "The village paths are not suitable for a wheelchair, making it hard for her to reach school." },
        { q: "Who can help someone with a disability reach their goals?", a: "The whole community working together", w: ["Only a magic genie can help", "Nobody can help", "Only famous people"], e: "When communities come together, they can remove barriers for people with disabilities." },
        { q: "What does the story of a girl overcoming obstacles teach us?", a: "Determination and support can overcome difficulties", w: ["School is not important", "It is better to stay home", "Only rich children can study"], e: "With determination and community help, any obstacle can be overcome." },
        { q: "How can we show kindness to someone who faces physical challenges?", a: "By building accessible paths and including them", w: ["By ignoring them", "By telling them to stay home", "By giving them money only"], e: "Building ramps, accessible paths, and including everyone shows true kindness." },
        { q: "What does a mountain village in India look like?", a: "High mountains with cold dry land", w: ["Beaches and palm trees", "Tall buildings everywhere", "Dense rainforests"], e: "Mountain regions in northern India have high altitudes and cold desert landscapes." },
        { q: "Why is education important for every child?", a: "Every child deserves a chance to learn and grow", w: ["Only some children should study", "School is boring", "Education is not useful"], e: "Education is a fundamental right for every child, regardless of their situation." },
        { q: "What quality does a person who never gives up show?", a: "Determination and courage", w: ["Fear and weakness", "Laziness", "Selfishness"], e: "Never giving up despite difficulties shows determination and courage." },
        { q: "How can friends and neighbours help someone in need?", a: "By working together to solve problems", w: ["By pretending not to see", "By laughing at them", "By avoiding them"], e: "Working together as a community can create positive change for everyone." },
        { q: "What is inclusion?", a: "Making sure everyone can participate equally", w: ["Keeping some people out", "Only helping yourself", "Ignoring differences"], e: "Inclusion means ensuring everyone, regardless of ability, can participate in all activities." },
        { q: "What is the main theme of stories about overcoming challenges?", a: "Courage, inclusion, and the power of community", w: ["War and victory", "Magic and fantasy", "Wealth and success"], e: "Stories about overcoming challenges teach us about courage, inclusion, and community support." },
      ]},
      // World 2: Thunder Cake (Chapter 2) - Family & Overcoming Fear
      { questions: [
        { q: "A young girl is scared of thunderstorms. Who helps her overcome this fear?", a: "Her grandmother", w: ["A police officer", "A stranger", "Nobody helps her"], e: "Family members, especially grandparents, often help children overcome their fears with love and patience." },
        { q: "How can a grandparent help a child who is afraid?", a: "By keeping them busy with a fun activity", w: ["By scolding them", "By ignoring their fear", "By forcing them outside"], e: "Distracting a child with a fun, engaging activity helps them forget their fear." },
        { q: "What does a grandmother's love represent?", a: "Wisdom, comfort, and unconditional care", w: ["Fear and worry", "Anger and punishment", "Silence and distance"], e: "Grandmothers often symbolize wisdom, comfort, and unconditional love in stories." },
        { q: "What is a good way to face your fears?", a: "With the support of loved ones around you", w: ["By running away", "By hiding forever", "By getting angry"], e: "Having supportive people around makes facing fears much easier." },
        { q: "Why do grandparents play an important role in families?", a: "They share wisdom and provide emotional support", w: ["They just cook food", "They are not important", "They only tell stories"], e: "Grandparents offer wisdom, emotional support, and a loving presence in families." },
        { q: "What can baking or cooking together teach children?", a: "Family bonding and teamwork", w: ["Nothing useful", "How to make a mess", "That cooking is boring"], e: "Cooking together strengthens family bonds and teaches teamwork." },
        { q: "What emotion does a child feel when a loved one comforts them?", a: "Safe and secure", w: ["More scared", "Angry", "Lonely"], e: "Comfort from loved ones makes children feel safe and secure." },
        { q: "What is the opposite of fear?", a: "Courage", w: ["Sadness", "Happiness", "Anger"], e: "Courage is the ability to face fear despite feeling afraid." },
        { q: "Why are family bonds important?", a: "They give us love, support, and strength", w: ["They are not important", "They only cause problems", "They are temporary"], e: "Strong family bonds provide emotional support and help us grow." },
        { q: "What lesson do stories about family teach us?", a: "Love and patience help overcome any fear", w: ["Fear is permanent", "Family cannot help", "Running away is best"], e: "Stories about family show how love and patience conquer all fears." },
      ]},
      // World 3: Peter Pan (Chapter 3) - Imagination & Adventure
      { questions: [
        { q: "In a story about a boy who never grows up, where does he live?", a: "In a magical faraway island", w: ["In a big city", "Under the ocean", "On the moon"], e: "Stories of eternal childhood often take place in magical, imaginary lands." },
        { q: "What is special about a boy who never wants to grow up?", a: "He represents the innocence and joy of childhood", w: ["He is lazy", "He is afraid", "He is selfish"], e: "The idea of never growing up symbolizes preserving childhood innocence and imagination." },
        { q: "Who helps the children fly in a magical adventure story?", a: "A tiny magical being", w: ["A giant bird", "A rocket ship", "A magic carpet"], e: "Magical adventure stories often feature tiny magical helpers like fairies." },
        { q: "What is the main villain often like in adventure stories?", a: "A feared enemy with a distinguishing feature", w: ["A friendly helper", "A wise teacher", "A caring parent"], e: "Villains in adventure stories have unique traits that make them memorable." },
        { q: "What is a fairy?", a: "A tiny magical being with wings", w: ["A type of bird", "A large animal", "A flower"], e: "Fairies are mythical, magical creatures often depicted with wings." },
        { q: "What do adventure stories teach children?", a: "To use imagination and be brave", w: ["To be afraid of everything", "To never try new things", "To stay indoors"], e: "Adventure stories encourage children to be imaginative and courageous." },
        { q: "What is the 'lost children' theme about?", a: "Children who create their own family together", w: ["Children who are permanently lost", "Children who are bad", "Children who sleep all day"], e: "The theme of lost children banding together shows resilience and friendship." },
        { q: "How do characters in fantasy stories usually fly?", a: "With magical help and happy thoughts", w: ["With airplanes only", "They cannot fly", "With balloons"], e: "Fantasy stories use magic and positive thinking as ways to achieve the impossible." },
        { q: "What is the main theme of magical adventure stories?", a: "The joy and innocence of childhood imagination", w: ["War and revenge", "Money and power", "Science and technology"], e: "Magical adventures celebrate childhood wonder and imagination." },
        { q: "Why do children enjoy fantasy stories?", a: "They spark imagination and creativity", w: ["They are scary", "They are boring", "They have no purpose"], e: "Fantasy stories inspire children to think creatively and dream big." },
      ]},
      // World 4: The Coral Reef (Chapter 4) - Ocean & Environment
      { questions: [
        { q: "What are coral reefs made of?", a: "Tiny living animals called coral polyps", w: ["Plants only", "Rocks and sand", "Plastic waste"], e: "Coral reefs are built by millions of tiny coral polyps over thousands of years." },
        { q: "Where are coral reefs found?", a: "In warm, shallow ocean waters", w: ["In deep dark oceans", "In cold polar regions", "In freshwater lakes"], e: "Coral reefs need warm, clear, shallow water to grow." },
        { q: "Which is the largest coral reef system in the world?", a: "The Great Barrier Reef", w: ["The Red Sea Reef", "The Caribbean Reef", "The Maldives Reef"], e: "The Great Barrier Reef in Australia is the world's largest coral reef." },
        { q: "Why are coral reefs called the 'rainforests of the sea'?", a: "Because they support a huge variety of sea life", w: ["Because they have trees", "Because they are on land", "Because they produce rain"], e: "Like rainforests, coral reefs are home to an incredible diversity of species." },
        { q: "What do coral polyps eat?", a: "Tiny plankton and algae", w: ["Large fish", "Seaweed", "Rocks"], e: "Coral polyps catch tiny organisms floating in the water." },
        { q: "What gives coral its beautiful colours?", a: "Symbiotic algae living inside the coral", w: ["Paint", "Sunlight only", "Rocks"], e: "Tiny algae called zooxanthellae live inside coral and give it colour." },
        { q: "Why are coral reefs in danger?", a: "Due to climate change and pollution", w: ["Because they are too big", "Because fish eat them", "Because they move"], e: "Rising ocean temperatures cause coral bleaching and pollution harms reefs." },
        { q: "What is 'coral bleaching'?", a: "When coral turns white due to stress", w: ["When coral grows fast", "When coral changes shape", "When coral produces flowers"], e: "Bleaching happens when warm water causes coral to expel the colourful algae." },
        { q: "Why should we protect coral reefs?", a: "They protect coastlines and support marine life", w: ["They are just for decoration", "They are not important", "They are easy to replace"], e: "Reefs protect shores from waves and provide homes for fish." },
        { q: "Which animals live in coral reefs?", a: "Fish, sea turtles, octopus, and many more", w: ["Only sharks", "No animals", "Only plants"], e: "Coral reefs support thousands of marine species." },
      ]},
      // World 5: Inspiring Women (Chapter 5) - Biographies of Great Women
      { questions: [
        { q: "What do inspiring stories about real women teach us?", a: "That anyone can achieve great things with determination", w: ["Only queens can be great", "Only scientists matter", "Girls cannot be leaders"], e: "Real-life stories show that determination can help anyone achieve their dreams." },
        { q: "Why is it important to learn about inspiring people?", a: "They give us role models to look up to", w: ["They are not important", "They make us feel bad", "They are boring"], e: "Learning about inspiring people motivates us to pursue our own dreams." },
        { q: "What quality do all inspiring people share?", a: "They never give up despite challenges", w: ["They were all rich", "They never faced problems", "They were all famous from birth"], e: "All inspiring people persevered through difficulties to achieve their goals." },
        { q: "What did a famous scientist discover that helps in medicine?", a: "Radium, which is used to treat diseases", w: ["A new planet", "A type of food", "A way to fly"], e: "Marie Curie discovered radium and polonium, winning two Nobel Prizes." },
        { q: "Why did a young girl from Pakistan speak up for education?", a: "Because every child deserves to go to school", w: ["She wanted to be famous", "She did not like school", "She wanted money"], e: "She believed education is a fundamental right for every child." },
        { q: "What can we learn from people who fought for education?", a: "Education is a powerful tool for change", w: ["Education does not matter", "Only some should study", "School is a waste of time"], e: "Education empowers people and transforms societies." },
        { q: "What does it mean to 'break barriers'?", a: "To overcome obstacles that limit progress", w: ["To build walls", "To give up easily", "To follow the crowd"], e: "Breaking barriers means challenging limitations to achieve something new." },
        { q: "Why should we learn about women who changed the world?", a: "To understand that everyone can make a difference", w: ["Only men matter in history", "Women cannot achieve much", "History is not important"], e: "Stories of achievement inspire all children regardless of gender." },
        { q: "What qualities make someone inspiring?", a: "Courage, determination, and resilience", w: ["Fear and laziness", "Dishonesty", "Selfishness"], e: "Inspiring people show courage, determination, and the ability to bounce back." },
        { q: "What message do inspiring life stories convey?", a: "Believe in yourself and never stop trying", w: ["Give up when things are hard", "Only famous people matter", "Dreams are useless"], e: "Inspiring stories teach us to believe in ourselves and keep trying." },
      ]},
      // World 6: Go Green! (Chapter 6) - Environment & Conservation
      { questions: [
        { q: "What does 'going green' mean?", a: "Adopting environmentally friendly practices", w: ["Painting everything green", "Planting only one tree", "Wearing green clothes"], e: "Going green means making choices that protect the environment." },
        { q: "What is the 'Three R's' of going green?", a: "Reduce, Reuse, Recycle", w: ["Read, Write, Recite", "Run, Rest, Relax", "Rain, River, Sea"], e: "Reduce waste, Reuse items, and Recycle materials to protect the environment." },
        { q: "Why is it important to save electricity?", a: "It reduces pollution and conserves resources", w: ["It is expensive", "It is fun", "It is boring"], e: "Most electricity comes from burning fossil fuels which cause pollution." },
        { q: "What should we use instead of plastic bags?", a: "Cloth or jute bags", w: ["More plastic", "Paper bags only", "No bags at all"], e: "Reusable cloth or jute bags are eco-friendly alternatives to plastic." },
        { q: "How can we save water at home?", a: "By fixing leaks and turning off taps when not in use", w: ["By using more water", "By leaving taps running", "By ignoring leaks"], e: "Small habits like turning off the tap while brushing save lots of water." },
        { q: "What is recycling?", a: "Converting waste into reusable material", w: ["Throwing everything away", "Burning waste", "Burying waste"], e: "Recycling processes used materials into new products." },
        { q: "Why should we plant more trees?", a: "Trees absorb carbon dioxide and give us oxygen", w: ["Trees look pretty only", "Trees block roads", "Trees are not useful"], e: "Trees are essential for clean air and combating climate change." },
        { q: "What is renewable energy?", a: "Energy from natural sources like sun and wind", w: ["Energy from coal", "Energy from petrol", "Energy from plastic"], e: "Solar and wind energy are renewable and do not pollute." },
        { q: "How can students help the environment at school?", a: "By saving paper and using both sides", w: ["By wasting paper", "By leaving lights on", "By using plastic bottles"], e: "Using both sides of paper and reducing waste helps the environment." },
        { q: "What is the main message of environmental conservation?", a: "Everyone can help protect the environment", w: ["Only adults can help", "Only the government can help", "The environment is not important"], e: "Every small action counts in protecting our planet." },
      ]},
      // World 7: A Midsummer Night's Dream (Chapter 7) - Classic Literature
      { questions: [
        { q: "A famous English playwright wrote comedies and tragedies. Who was he?", a: "William Shakespeare", w: ["Charles Dickens", "Jane Austen", "Oscar Wilde"], e: "Shakespeare is widely considered the greatest writer in the English language." },
        { q: "What is a 'comedy' play?", a: "A play with humour and a happy ending", w: ["A sad play", "A scary play", "A play about history"], e: "Comedies are designed to amuse the audience with humour." },
        { q: "In classic plays about fairies, where does the story usually take place?", a: "In a magical forest", w: ["In a desert", "On a ship", "In a shopping mall"], e: "Magical forests are common settings for fairy tales and fantasy plays." },
        { q: "What is a fairy in classic literature?", a: "A magical being with supernatural powers", w: ["A human child", "A large animal", "A type of flower"], e: "Fairies in literature are magical creatures with special powers." },
        { q: "What is a 'mischievous sprite' in fairy tales?", a: "A playful magical being who causes trouble", w: ["A serious teacher", "A royal king", "A dangerous monster"], e: "Sprites are small magical beings known for their playful troublemaking." },
        { q: "In a famous comedy, a magical flower makes people fall in love. What is this?", a: "A fairy tale plot device", w: ["A real scientific fact", "A cooking recipe", "A type of medicine"], e: "Magical flowers that cause love are common fairy tale plot devices." },
        { q: "What is a 'play within a play'?", a: "A smaller play performed during the main play", w: ["A real fight", "A magic spell", "A commercial break"], e: "It is a theatrical device where characters put on a play inside the main story." },
        { q: "What do fairy tales and fantasy plays teach us?", a: "That imagination and love are powerful forces", w: ["That magic is real", "That we should fear fairies", "That logic does not matter"], e: "These stories celebrate imagination, love, and the power of dreams." },
        { q: "Why do we still read classic plays today?", a: "Because their themes about love and life are universal", w: ["They are required by law", "They are boring but famous", "Only old people read them"], e: "Classic plays explore universal human themes that remain relevant." },
        { q: "What is the main theme of romantic comedies?", a: "The confusion and magic of love", w: ["War and revenge", "Money and power", "Science and logic"], e: "Romantic comedies explore how love can be confusing yet magical." },
      ]},
      // World 8: The Immigrant Experience (Chapter 8) - Journeys & Homes
      { questions: [
        { q: "Why do people sometimes leave their home countries?", a: "To find better opportunities and safety", w: ["For a holiday", "To go shopping", "To watch movies"], e: "People often leave to escape hardship and find better lives." },
        { q: "What challenges do people face on long sea journeys?", a: "Storms, limited food, and seasickness", w: ["Too much space", "Too much food", "No challenges"], e: "Sea journeys are difficult with harsh weather and limited supplies." },
        { q: "What mixed emotions do people feel when leaving home?", a: "Hope mixed with fear and sadness", w: ["Only happiness", "Only anger", "Nothing at all"], e: "Leaving home brings mixed emotions of hope and fear." },
        { q: "What does the sea symbolize in journey stories?", a: "Both danger and hope for a new beginning", w: ["Just a road", "Just water", "Nothing important"], e: "The sea represents both the dangers and hopes of starting over." },
        { q: "How do people support each other during difficult journeys?", a: "By sharing food and comforting one another", w: ["By fighting", "By ignoring each other", "By stealing"], e: "Community support helps everyone survive difficult journeys." },
        { q: "What does arriving at a new land symbolize?", a: "A fresh start and new opportunities", w: ["The end of the journey only", "Going back home", "Nothing special"], e: "Reaching a destination means hope for a better future." },
        { q: "What is home?", a: "A place where you feel safe and loved", w: ["Only where you were born", "A building with walls", "A hotel room"], e: "Home is where you build a life, not just where you were born." },
        { q: "What does it take to start over in a new place?", a: "Bravery and determination", w: ["Fear and laziness", "Dishonesty", "Only money"], e: "Starting over takes courage and the will to keep going." },
        { q: "What values do journey stories teach?", a: "Hope, resilience, and friendship", w: ["Greed and selfishness", "Laziness and fear", "Dishonesty and cheating"], e: "Journey stories celebrate hope, perseverance, and helping each other." },
        { q: "Why is it important to welcome newcomers?", a: "Everyone deserves a chance to build a better life", w: ["Newcomers are not welcome", "Only some people deserve help", "Immigration is bad"], e: "Welcoming newcomers helps build stronger, more diverse communities." },
      ]},
      // World 9: The Umbrella (Chapter 9) - Kindness & Giving
      { questions: [
        { q: "A girl wants a beautiful umbrella she sees in a shop. What does she do?", a: "She trades something precious to get it", w: ["She steals it", "She breaks it", "She ignores it"], e: "She works hard and trades something valuable to get what she wants." },
        { q: "Why does everyone admire beautiful things?", a: "Because they bring joy to our eyes", w: ["Because they are old", "Because they are broken", "Because they are invisible"], e: "Beauty in objects, nature, and people brings us joy." },
        { q: "What does the girl do with her prized possession at the end?", a: "She gives it to someone who needs it more", w: ["She loses it", "She breaks it", "She sells it for profit"], e: "The story teaches that true kindness means giving to those in need." },
        { q: "Where are many Indian stories set?", a: "In small towns in the hills", w: ["Only in big cities", "Only in deserts", "Only on islands"], e: "Many Indian stories are set in the beautiful hill towns of India." },
        { q: "What does a beautiful object symbolize in stories?", a: "Beauty, desire, and the joy of giving", w: ["Fear", "Anger", "Danger"], e: "Beautiful objects in stories often represent deeper lessons about kindness." },
        { q: "What lesson do stories about giving teach?", a: "True happiness comes from giving to others", w: ["Always keep what you have", "Never share", "Buy everything you want"], e: "Stories about giving teach that generosity brings true happiness." },
        { q: "Why is kindness important?", a: "It makes both the giver and receiver happy", w: ["It is a sign of weakness", "It is not important", "It is only for rich people"], e: "Kindness creates happiness for everyone involved." },
        { q: "What is the opposite of selfishness?", a: "Generosity", w: ["Greed", "Fear", "Anger"], e: "Generosity means thinking of others before yourself." },
        { q: "How can children practice kindness?", a: "By sharing and helping others in need", w: ["By keeping everything for themselves", "By ignoring others", "By being mean"], e: "Sharing and helping others are simple ways children can be kind." },
        { q: "What is the main theme of stories about kindness?", a: "Giving brings more joy than receiving", w: ["We should never give anything", "Only take from others", "Material things matter most"], e: "Stories about kindness show that giving is more rewarding than receiving." },
      ]},
      // World 10: Explorers (Chapter 10) - Discovery & Exploration
      { questions: [
        { q: "What motivated early explorers to sail into unknown waters?", a: "To find new trade routes and lands", w: ["To go on holiday", "To escape school", "To watch movies"], e: "Explorers sought new trade routes, wealth, and knowledge." },
        { q: "Which European explorer reached the Americas in 1492?", a: "Christopher Columbus", w: ["Vasco da Gama", "Marco Polo", "Magellan"], e: "Columbus sailed across the Atlantic and reached the Americas." },
        { q: "Which explorer was the first European to reach India by sea?", a: "Vasco da Gama", w: ["Columbus", "Captain Cook", "Nelson"], e: "Vasco da Gama sailed around Africa to reach India." },
        { q: "What were the small ships used by early explorers called?", a: "Caravels", w: ["Steamships", "Submarines", "Aircraft carriers"], e: "Caravels were small, fast ships used for exploration." },
        { q: "What dangers did sailors face on long voyages?", a: "Storms, diseases, and running out of food", w: ["No dangers", "Too much food", "Perfect weather"], e: "Sailors faced scurvy, storms, starvation, and unknown waters." },
        { q: "What is navigation?", a: "The skill of finding direction at sea", w: ["Swimming", "Cooking", "Painting"], e: "Navigation is the art of steering a ship using stars, compass, and maps." },
        { q: "What did early explorers bring back from their voyages?", a: "Spices, gold, and new knowledge", w: ["Nothing", "Only maps", "Only clothes"], e: "They brought valuable spices, treasures, and knowledge of new lands." },
        { q: "How did exploration change the world?", a: "It connected different parts of the world", w: ["It isolated countries", "It stopped trade", "It ended travel"], e: "Exploration led to cultural exchange and global connections." },
        { q: "What qualities did successful explorers need?", a: "Courage, determination, and curiosity", w: ["Fear and laziness", "Dishonesty", "Only money"], e: "Explorers needed bravery and perseverance to face unknown dangers." },
        { q: "What can we learn from explorers today?", a: "To be curious and brave when facing the unknown", w: ["To never try new things", "To stay where we are", "To fear everything"], e: "The spirit of exploration teaches us to be curious and courageous." },
      ]},
    ];
    const selected = passages[worldId - 1] || passages[0];
    return (selected.questions as any[]).slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ SCIENCE (Splendid Science Level 5 by Lali John - Cambridge) ============
  // 5 Units, 14 Chapters total:
  // Unit 1: Living Things (4 ch) | Unit 2: Plants (3 ch) | Unit 3: Ecosystems (2 ch)
  // Unit 4: Materials (3 ch) | Unit 5: Forces (2 ch)
  static science(worldId: number, n = 10): MathQuestion[] {
    const questions: any[][] = [
      // World 1: Unit 1 - Living Things (Ch1-2: Characteristics of Living Things & Vertebrates)
      [
        { q: "What are the seven life processes that all living things do?", a: "Movement, respiration, sensitivity, growth, reproduction, excretion, nutrition", w: ["Running, jumping, sleeping, eating, drinking, playing, talking", "Flying, swimming, crawling, walking, hopping, climbing, rolling", "Reading, writing, singing, dancing, drawing, cooking, building"], e: "MRS GREN helps us remember: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition." },
        { q: "Why do living things need food?", a: "To get energy for life processes", w: ["To become heavier", "To make noise", "To change colour"], e: "Food provides energy for all life processes like movement and growth." },
        { q: "How do fish breathe underwater?", a: "Through gills", w: ["Through lungs", "Through skin", "Through their fins"], e: "Fish have gills that extract oxygen dissolved in water." },
        { q: "What is the backbone made of?", a: "Small bones called vertebrae", w: ["One long bone", "Muscles only", "Cartilage only"], e: "The backbone (spine) is made of many small bones called vertebrae." },
        { q: "Which group of vertebrates has feathers and lays eggs with hard shells?", a: "Birds", w: ["Mammals", "Reptiles", "Amphibians"], e: "Birds are the only vertebrates with feathers and beaks." },
        { q: "Which group of vertebrates feeds milk to their young?", a: "Mammals", w: ["Fish", "Birds", "Reptiles"], e: "All mammals feed their young with milk produced by the mother's body." },
        { q: "Which group of vertebrates has dry, scaly skin?", a: "Reptiles", w: ["Amphibians", "Fish", "Mammals"], e: "Reptiles like snakes and lizards have dry, scaly skin." },
        { q: "Which group of vertebrates lives both in water and on land?", a: "Amphibians", w: ["Birds", "Mammals", "Reptiles"], e: "Amphibians like frogs begin life in water and later live on land." },
        { q: "Which vertebrate group has fins and lives entirely in water?", a: "Fish", w: ["Amphibians", "Reptiles", "Mammals"], e: "Fish are aquatic vertebrates that breathe through gills." },
        { q: "How do mammals keep their body warm?", a: "They have hair or fur on their bodies", w: ["They bask in the sun", "They wear clothes", "They have scales"], e: "Mammals are warm-blooded and have hair or fur to keep warm." },
      ],
      // World 2: Unit 1 - Living Things (Ch3-4: Invertebrates & Classification Keys)
      [
        { q: "What is an invertebrate?", a: "An animal without a backbone", w: ["An animal with a backbone", "A type of plant", "A type of rock"], e: "Invertebrates are animals that do NOT have a backbone inside their body." },
        { q: "Which invertebrate has a soft body and often a hard shell?", a: "Mollusc", w: ["Insect", "Spider", "Worm"], e: "Snails, slugs, and clams are molluscs with soft bodies." },
        { q: "Which invertebrate has eight legs and two body parts?", a: "Arachnid (spider)", w: ["Insect", "Crustacean", "Worm"], e: "Spiders, scorpions, and ticks are arachnids with eight legs." },
        { q: "Which invertebrate has six legs and three body parts?", a: "Insect", w: ["Spider", "Worm", "Snail"], e: "All insects have six legs and bodies divided into head, thorax, and abdomen." },
        { q: "Which invertebrate has a hard outer shell and lives in water?", a: "Crustacean (crab)", w: ["Butterfly", "Earthworm", "Spider"], e: "Crabs, lobsters, and shrimp are crustaceans with hard shells." },
        { q: "What is a classification key used for?", a: "To identify and sort living things into groups", w: ["To count animals", "To measure plants", "To colour animals"], e: "A classification key uses yes/no questions to identify unknown organisms." },
        { q: "How do earthworms help the soil?", a: "They make tunnels that aerate the soil", w: ["They eat plants", "They destroy roots", "They make the soil hard"], e: "Earthworms improve soil by creating tunnels for air and water." },
        { q: "Which invertebrate has tentacles and stinging cells?", a: "Jellyfish (cnidarian)", w: ["Butterfly", "Spider", "Snail"], e: "Jellyfish and sea anemones are cnidarians with stinging tentacles." },
        { q: "What is an exoskeleton?", a: "A hard covering on the outside of an animal's body", w: ["Bones inside the body", "Soft skin", "No covering at all"], e: "Insects and crustaceans have exoskeletons for protection and support." },
        { q: "How many legs does a centipede have?", a: "Many legs (one pair per body segment)", w: ["Exactly six legs", "Exactly eight legs", "No legs at all"], e: "Centipedes have one pair of legs per body segment, so they have many legs." },
      ],
      // World 3: Unit 2 - Plants (Ch1-2: Parts of a Plant & Plant Growth)
      [
        { q: "What are the main parts of a flowering plant?", a: "Roots, stem, leaves, and flowers", w: ["Head, arms, legs, and body", "Bark, trunk, branches, and leaves", "Soil, water, sun, and air"], e: "Flowering plants have roots, stem, leaves, flowers, and fruits." },
        { q: "What do roots do for a plant?", a: "Anchor the plant and absorb water and minerals", w: ["Make food using sunlight", "Attract insects", "Produce seeds"], e: "Roots hold the plant firmly in soil and absorb water and nutrients." },
        { q: "What do leaves use to make food?", a: "Sunlight, water, and carbon dioxide", w: ["Soil and rocks", "Moonlight and stars", "Rain and wind only"], e: "Leaves make food through photosynthesis using sunlight, water, and CO2." },
        { q: "What is the green pigment in leaves called?", a: "Chlorophyll", w: ["Melanin", "Haemoglobin", "Carotene"], e: "Chlorophyll is the green pigment that captures light energy for photosynthesis." },
        { q: "What does the stem do?", a: "Transports water and food, and supports the plant", w: ["Only makes seeds", "Only absorbs water", "Only stores food"], e: "The stem carries water and nutrients between roots and leaves." },
        { q: "What do flowers produce?", a: "Seeds and fruits", w: ["Roots", "Water", "Soil"], e: "After pollination, flowers develop into fruits containing seeds." },
        { q: "What does a plant need to grow?", a: "Water, sunlight, air, nutrients, and suitable temperature", w: ["Only water", "Only soil", "Only sunlight"], e: "Plants need water, light, air, nutrients, and warmth to grow well." },
        { q: "What is germination?", a: "When a seed begins to grow into a new plant", w: ["When a plant makes flowers", "When a plant dies", "When a plant sheds leaves"], e: "Germination is the process where a seed starts to grow into a seedling." },
        { q: "What do seeds need to germinate?", a: "Water, warmth, and oxygen", w: ["Sunlight only", "Cold temperature", "Darkness only"], e: "Seeds need water, warmth (heat), and air (oxygen) to germinate." },
        { q: "What carries water from the roots to the leaves?", a: "The xylem vessels in the stem", w: ["The phloem", "The petals", "The stomata"], e: "Xylem are tiny tubes in the stem that transport water from roots to leaves." },
      ],
      // World 4: Unit 2 - Plants (Ch3: Seed Dispersal)
      [
        { q: "Why do plants need to disperse their seeds?", a: "To reduce competition for space, light, and nutrients", w: ["To make more flowers", "To change colour", "To grow bigger roots"], e: "Dispersal prevents overcrowding and gives seeds a better chance to grow." },
        { q: "Which seeds are dispersed by wind?", a: "Light seeds with wings or parachutes", w: ["Heavy seeds", "Seeds with hooks", "Seeds inside fleshy fruits"], e: "Dandelions and maple seeds are light and have wings for wind dispersal." },
        { q: "Which seeds are dispersed by water?", a: "Seeds that can float", w: ["Seeds that sink immediately", "Very heavy seeds", "Seeds that are sticky"], e: "Coconut seeds have a waterproof coating and can float on water." },
        { q: "How do some seeds stick to animals?", a: "They have hooks, spines, or burrs", w: ["They have glue", "They are magnetic", "They are very heavy"], e: "Burdock and Xanthium seeds have hooks that stick to animal fur." },
        { q: "Which seeds are dispersed by explosion?", a: "Seeds from pods that burst open", w: ["Seeds in fleshy fruits", "Seeds with wings", "Seeds that float"], e: "Balsam and pea plants burst their pods to scatter seeds." },
        { q: "Which seeds are dispersed by animals eating fruits?", a: "Seeds inside fleshy, tasty fruits", w: ["Seeds with hooks", "Light, wind-blown seeds", "Explosive pods"], e: "Birds and mammals eat fruits and later drop seeds in their droppings." },
        { q: "What is a seed dispersal method for coconut?", a: "Water dispersal", w: ["Wind dispersal", "Animal dispersal", "Explosion"], e: "Coconut seeds can float and are carried by water to new places." },
        { q: "What feature helps dandelion seeds fly?", a: "A feathery parachute (pappus)", w: ["Hard shell", "Sticky surface", "Heavy weight"], e: "Dandelion seeds have fluffy hairs that act like a parachute." },
        { q: "Why is seed dispersal important for survival?", a: "It helps plants colonise new areas and avoid overcrowding", w: ["It makes plants look pretty", "It changes the weather", "It prevents animals from eating them"], e: "Dispersal helps plant species survive by spreading to suitable habitats." },
        { q: "Which plant scatters seeds by bursting its pod?", a: "Balsam plant", w: ["Coconut tree", "Dandelion", "Strawberry"], e: "Balsam pods dry up and burst open, throwing seeds in all directions." },
      ],
      // World 5: Unit 3 - Ecosystems (Ch1-2: Food Chains, Food Webs & Human Impact)
      [
        { q: "What is an ecosystem?", a: "A community of living things and their environment", w: ["Only plants in a garden", "Only animals in a zoo", "Only water in a lake"], e: "An ecosystem includes all living organisms and their physical environment." },
        { q: "What is a producer in a food chain?", a: "A green plant that makes its own food", w: ["An animal that eats plants", "A fungus that grows on wood", "A bird that eats insects"], e: "Producers like plants make food through photosynthesis." },
        { q: "What is a consumer in a food chain?", a: "An animal that eats other organisms for food", w: ["A plant that makes food", "A rock in a river", "A cloud in the sky"], e: "Consumers are animals that cannot make their own food and must eat other organisms." },
        { q: "What is a herbivore?", a: "An animal that eats only plants", w: ["An animal that eats only meat", "An animal that eats both plants and meat", "A plant that eats insects"], e: "Herbivores like rabbits and cows feed only on plants." },
        { q: "What is a carnivore?", a: "An animal that eats other animals", w: ["An animal that eats only plants", "A plant-eating animal", "A decomposer"], e: "Carnivores like lions and tigers hunt and eat other animals." },
        { q: "What is an omnivore?", a: "An animal that eats both plants and animals", w: ["An animal that eats only plants", "An animal that eats only meat", "A fungus"], e: "Humans, bears, and crows are omnivores that eat both plants and animals." },
        { q: "What is a food web?", a: "Many connected food chains in an ecosystem", w: ["A spider's web", "A single food chain", "A plant's root system"], e: "A food web shows how different food chains are linked together." },
        { q: "How do humans harm the environment?", a: "By cutting forests, polluting, and hunting animals", w: ["By planting more trees", "By reducing pollution", "By protecting wildlife"], e: "Deforestation, pollution, and overhunting damage ecosystems." },
        { q: "What happens if one species disappears from a food web?", a: "It affects many other species in the ecosystem", w: ["Nothing happens", "Only that species is affected", "The ecosystem becomes stronger"], e: "All species are connected, so removing one affects the whole food web." },
        { q: "How can humans protect ecosystems?", a: "By reducing pollution and preserving habitats", w: ["By cutting more trees", "By building more factories", "By overfishing lakes"], e: "Conservation efforts help protect ecosystems and biodiversity." },
      ],
      // World 6: Unit 4 - Materials (Ch1-2: Properties of Materials & Changing States)
      [
        { q: "What is a solid?", a: "Matter with a fixed shape and volume", w: ["Matter that flows and takes shape of container", "Matter that spreads to fill space", "Matter with no shape at all"], e: "Solids have a definite shape because their particles are tightly packed." },
        { q: "What is a liquid?", a: "Matter that flows and takes the shape of its container", w: ["Matter with fixed shape", "Matter that spreads to fill room", "Matter that is very hard"], e: "Liquids flow because their particles can move past each other." },
        { q: "What is a gas?", a: "Matter that spreads out to fill its container", w: ["Matter with fixed shape", "Matter that stays at bottom of container", "Matter that cannot move"], e: "Gas particles move freely and spread to fill available space." },
        { q: "Which material conducts heat well: metal or plastic?", a: "Metal", w: ["Plastic", "Wood", "Rubber"], e: "Metals are good conductors of heat and electricity." },
        { q: "Which material is transparent: glass or wood?", a: "Glass", w: ["Wood", "Metal", "Cardboard"], e: "Transparent materials like glass let light pass through clearly." },
        { q: "What is melting?", a: "When a solid changes into a liquid by heating", w: ["When a liquid changes into a gas", "When a gas changes into a liquid", "When a liquid changes into a solid"], e: "Melting happens when heat energy breaks the bonds in a solid." },
        { q: "What is freezing?", a: "When a liquid changes into a solid by cooling", w: ["When a solid changes into a liquid", "When a liquid changes into a gas", "When a gas changes into a solid"], e: "Freezing happens when a liquid loses heat energy and becomes solid." },
        { q: "What is boiling?", a: "When a liquid changes into a gas by heating", w: ["When a solid changes into a liquid", "When a gas changes into a liquid", "When a solid changes directly to gas"], e: "Boiling occurs when a liquid is heated to its boiling point." },
        { q: "What temperature does water freeze at?", a: "0 degrees Celsius", w: ["100 degrees Celsius", "50 degrees Celsius", "10 degrees Celsius"], e: "Water freezes at 0 degrees C and boils at 100 degrees C." },
        { q: "Which material is a good insulator: wool or iron?", a: "Wool", w: ["Iron", "Copper", "Aluminium"], e: "Wool traps air and is a poor conductor, making it a good insulator." },
      ],
      // World 7: Unit 4 - Materials (Ch3: The Water Cycle)
      [
        { q: "What is evaporation?", a: "When the sun heats water and it turns into water vapour", w: ["When water falls from clouds as rain", "When water freezes into ice", "When plants absorb water"], e: "Evaporation is the process where liquid water changes to water vapour gas." },
        { q: "What is condensation?", a: "When water vapour cools and changes back into liquid droplets", w: ["When water turns into ice", "When ice melts into water", "When water flows into the sea"], e: "Condensation forms clouds when water vapour cools in the atmosphere." },
        { q: "What is precipitation?", a: "When water falls from clouds as rain, snow, sleet, or hail", w: ["When water evaporates from a lake", "When water flows in a river", "When plants release water"], e: "Precipitation includes rain, snow, sleet, and hail falling from clouds." },
        { q: "What is collection in the water cycle?", a: "When water gathers in rivers, lakes, and oceans", w: ["When water turns into vapour", "When clouds form in the sky", "When rain falls from clouds"], e: "Collection is when water collects in oceans, rivers, lakes, and groundwater." },
        { q: "What causes water to evaporate?", a: "Heat from the sun", w: ["Cold from ice", "Wind from fans", "Darkness at night"], e: "The Sun provides heat energy that causes water to evaporate." },
        { q: "What are clouds made of?", a: "Tiny water droplets or ice crystals", w: ["Cotton wool", "Smoke from factories", "Dust only"], e: "Clouds are formed by millions of tiny water droplets from condensation." },
        { q: "What is transpiration?", a: "When plants release water vapour from their leaves", w: ["When plants absorb sunlight", "When plants make food", "When plants grow roots"], e: "Transpiration is the loss of water vapour from plant leaves." },
        { q: "Why is the water cycle important?", a: "It provides fresh water for all living things", w: ["It makes the weather hot", "It creates new water", "It only helps plants"], e: "The water cycle continuously recycles water, providing fresh water for life." },
        { q: "Where does most evaporation on Earth happen?", a: "From oceans and seas", w: ["From rivers only", "From lakes only", "From plants only"], e: "The vast surface of oceans provides the most water for evaporation." },
        { q: "What type of precipitation is frozen water crystals?", a: "Snow", w: ["Rain", "Dew", "Fog"], e: "Snow forms when water vapour in clouds freezes into ice crystals." },
      ],
      // World 8: Unit 5 - Forces (Ch1-2: Types of Forces & Gravity & Friction)
      [
        { q: "What is a force?", a: "A push or a pull on an object", w: ["A type of energy", "A kind of food", "A form of light"], e: "Forces are pushes or pulls that can change how an object moves." },
        { q: "What does a force do to an object?", a: "It can change its speed, direction, or shape", w: ["It always destroys it", "It makes it disappear", "It changes its colour"], e: "Forces can start, stop, speed up, slow down, or change the direction of movement." },
        { q: "What is gravity?", a: "A force that pulls objects towards each other", w: ["A force that pushes objects apart", "A type of magnet", "A form of electricity"], e: "Gravity pulls everything towards the centre of the Earth." },
        { q: "Why do things fall down when dropped?", a: "Gravity pulls them towards the Earth", w: ["The air pushes them down", "The Earth pushes them away", "They are too heavy to stay up"], e: "Gravity is the force that pulls objects down towards the ground." },
        { q: "What is friction?", a: "A force that opposes motion between two surfaces", w: ["A force that speeds things up", "A type of lubricant", "A form of heat energy"], e: "Friction acts between touching surfaces and slows down movement." },
        { q: "Which surface has more friction: rough or smooth?", a: "Rough surface", w: ["Smooth surface", "Both have same friction", "Neither has friction"], e: "Rough surfaces have more friction because they have more bumps and ridges." },
        { q: "How can we reduce friction?", a: "By using lubricants like oil or grease", w: ["By making surfaces rougher", "By adding more weight", "By removing air"], e: "Oil and grease fill gaps between surfaces, making them slide more easily." },
        { q: "What is air resistance?", a: "Friction between an object and the air as it moves", w: ["The weight of air", "The temperature of air", "The colour of air"], e: "Air resistance (drag) is a type of friction that slows moving objects." },
        { q: "Why does a parachute fall slowly?", a: "It has a large surface area that creates air resistance", w: ["It is very heavy", "It is made of heavy material", "It has no gravity acting on it"], e: "Parachutes have large surface areas that create lots of air resistance." },
        { q: "What is magnetic force?", a: "A force that pulls iron and steel objects towards a magnet", w: ["A force that pushes all metals away", "A force that only works on wood", "A force that affects plastic"], e: "Magnets attract iron, nickel, cobalt, and some steel objects." },
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ SOCIAL SCIENCE (The World Around Us - Cambridge) ============
  // 6 Units, 19 Chapters total:
  // Unit 1: Early Humans (3 ch) | Unit 2: Ancient Civilizations (3 ch) | Unit 3: Medieval World (3 ch)
  // Unit 4: Renaissance & Exploration (2 ch) | Unit 5: Government & Citizenship (3 ch) | Unit 6: Trade & Economics (3 ch)
  static social(worldId: number, n = 10): MathQuestion[] {
    const questions: any[][] = [
      // World 1: Unit 1 - Early Humans (Ch1: Stone Age, Ch2: Bronze Age, Ch3: Iron Age)
      [
        { q: "What period of early human history is known for stone tools?", a: "The Stone Age", w: ["The Bronze Age", "The Iron Age", "The Industrial Age"], e: "The Stone Age is the earliest period when humans made tools from stone." },
        { q: "What were the two main periods of the Stone Age?", a: "Paleolithic and Neolithic", w: ["Old and New", "Early and Late", "Ancient and Modern"], e: "Paleolithic (Old Stone Age) and Neolithic (New Stone Age)." },
        { q: "How did early humans get food in the Paleolithic Age?", a: "By hunting animals and gathering plants", w: ["By farming crops", "By buying from shops", "By ordering online"], e: "Paleolithic people were hunter-gatherers who hunted and collected wild food." },
        { q: "What important discovery did humans make in the Neolithic Age?", a: "Farming and agriculture", w: ["How to fly", "How to use computers", "How to make plastic"], e: "The Neolithic Age saw the beginning of farming and settled communities." },
        { q: "What is the Bronze Age known for?", a: "Making tools and weapons from bronze", w: ["Making tools from iron", "Making tools from plastic", "Making tools from wood only"], e: "Bronze is a metal made by mixing copper and tin." },
        { q: "What metal is mixed with copper to make bronze?", a: "Tin", w: ["Iron", "Gold", "Silver"], e: "Bronze is an alloy (mixture) of copper and tin." },
        { q: "What did people in the Bronze Age build for burial?", a: "Stone circles and burial mounds", w: ["Skyscrapers", "Bridges", "Tunnels"], e: "Stonehenge and other stone structures were built during the Bronze Age." },
        { q: "What marked the beginning of the Iron Age?", a: "The discovery of iron smelting", w: ["The discovery of bronze", "The invention of wheels", "The first writing"], e: "The Iron Age began when humans learned to extract iron from ore." },
        { q: "Why was iron better than bronze for tools?", a: "Iron was stronger, more abundant, and kept sharp longer", w: ["Iron was prettier", "Iron was lighter", "Iron was easier to melt"], e: "Iron is stronger and more durable than bronze for tools and weapons." },
        { q: "What type of houses did Iron Age people build?", a: "Roundhouses with thatched roofs", w: ["Brick apartments", "Glass buildings", "Metal sheds"], e: "Iron Age people in Europe lived in roundhouses made of wood and mud." },
      ],
      // World 2: Unit 2 - Ancient Civilizations (Ch1: Mesopotamia, Ch2: Egypt, Ch3: Indus Valley)
      [
        { q: "Where was Mesopotamia located?", a: "Between the Tigris and Euphrates rivers", w: ["Between the Nile and Amazon", "Between the Ganges and Indus", "Between the Thames and Seine"], e: "Mesopotamia means 'land between the rivers' in Greek." },
        { q: "What is Mesopotamia called in the Bible?", a: "The Fertile Crescent", w: ["The Sahara Desert", "The Amazon Basin", "The Tibetan Plateau"], e: "The Fertile Crescent was ideal for farming due to rich soil and water." },
        { q: "What was the earliest form of writing developed in Mesopotamia?", a: "Cuneiform", w: ["Hieroglyphics", "Alphabet", "Braille"], e: "Cuneiform was written by pressing wedge-shaped marks into clay tablets." },
        { q: "What did ancient Egyptians build as tombs for their pharaohs?", a: "Pyramids", w: ["Castles", "Temples", "Palaces"], e: "The Great Pyramid of Giza is one of the Seven Wonders of the Ancient World." },
        { q: "What is hieroglyphics?", a: "The writing system of ancient Egypt using pictures", w: ["The writing system of China", "The Greek alphabet", "The Roman numbering system"], e: "Hieroglyphics used pictures and symbols to represent words and sounds." },
        { q: "Why was the River Nile important to ancient Egypt?", a: "It provided water for farming and transport", w: ["It was used for swimming only", "It had no importance", "It was used for fishing only"], e: "The Nile's annual floods deposited fertile soil for agriculture." },
        { q: "Where was the Indus Valley Civilization located?", a: "In present-day Pakistan and northwest India", w: ["In South India", "In Africa", "In South America"], e: "The Indus Valley was centred around the Indus River in South Asia." },
        { q: "What were the two largest cities of the Indus Valley Civilization?", a: "Mohenjo-daro and Harappa", w: ["Delhi and Mumbai", "Cairo and Alexandria", "Athens and Rome"], e: "These cities had advanced urban planning and drainage systems." },
        { q: "What was special about Indus Valley city planning?", a: "Grid-pattern streets and advanced drainage", w: ["Narrow winding roads", "No drainage system", "Random building layout"], e: "Indus cities had well-planned grids and covered drainage channels." },
        { q: "Which ancient civilization invented the wheel?", a: "Mesopotamia", w: ["Egypt", "Indus Valley", "China"], e: "The wheel was invented in Mesopotamia around 3500 BCE." },
      ],
      // World 3: Unit 3 - The Medieval World (Ch1: Byzantine Empire, Ch2: Islamic Golden Age, Ch3: Crusades)
      [
        { q: "What was the capital of the Byzantine Empire?", a: "Constantinople", w: ["Rome", "Athens", "Cairo"], e: "Constantinople (now Istanbul) was founded by Emperor Constantine." },
        { q: "What religion was central to the Byzantine Empire?", a: "Eastern Orthodox Christianity", w: ["Islam", "Buddhism", "Hinduism"], e: "The Byzantine Empire was a centre of Eastern Orthodox Christianity." },
        { q: "What is the Hagia Sophia?", a: "A famous Byzantine cathedral (church)", w: ["A Roman temple", "An Egyptian pyramid", "A Chinese palace"], e: "Hagia Sophia in Istanbul is an architectural marvel of the Byzantine era." },
        { q: "When did the Islamic Golden Age occur?", a: "Approximately 8th to 13th century", w: ["1st to 5th century", "15th to 18th century", "19th to 20th century"], e: "The Islamic Golden Age was a period of great scientific and cultural progress." },
        { q: "What important scientific advances came from the Islamic Golden Age?", a: "Algebra, astronomy, and medicine", w: ["Nuclear physics", "Computer science", "Genetic engineering"], e: "Muslim scholars made major contributions to mathematics, astronomy, and medicine." },
        { q: "What is algebra?", a: "A branch of mathematics using symbols and equations", w: ["A type of poetry", "A musical instrument", "A style of architecture"], e: "The word 'algebra' comes from the Arabic 'al-jabr' meaning reunion of parts." },
        { q: "What were the Crusades?", a: "A series of religious wars between Christians and Muslims", w: ["Trade expeditions to Asia", "Scientific conferences", "Peaceful pilgrimages"], e: "The Crusades were military campaigns to control the Holy Land." },
        { q: "What was the Holy Land that Crusaders wanted to capture?", a: "Jerusalem and surrounding areas", w: ["Rome", "Mecca", "Constantinople"], e: "Jerusalem is sacred to Christians, Muslims, and Jews." },
        { q: "What impact did the Crusades have on Europe?", a: "Increased trade and cultural exchange with the East", w: ["No impact at all", "Complete isolation", "Economic collapse"], e: "The Crusades opened trade routes and exposed Europeans to Eastern goods and ideas." },
        { q: "Which Muslim leader recaptured Jerusalem from the Crusaders?", a: "Saladin", w: ["Genghis Khan", "Alexander the Great", "Napoleon"], e: "Saladin was a respected Kurdish Muslim leader known for his chivalry." },
      ],
      // World 4: Unit 4 - Renaissance & Exploration (Ch1: Renaissance, Ch2: Age of Exploration)
      [
        { q: "What does 'Renaissance' mean?", a: "Rebirth", w: ["Destruction", "Isolation", "Revolution"], e: "The Renaissance was a rebirth of interest in art, science, and learning." },
        { q: "Where did the Renaissance begin?", a: "Italy", w: ["France", "England", "Germany"], e: "The Renaissance began in Italian city-states like Florence and Venice." },
        { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", w: ["Michelangelo", "Raphael", "Van Gogh"], e: "Leonardo da Vinci painted the Mona Lisa around 1503-1519." },
        { q: "What did Renaissance artists focus on?", a: "Realism, perspective, and human form", w: ["Abstract shapes", "Random colours", "Flat patterns only"], e: "Renaissance artists studied human anatomy and used mathematical perspective." },
        { q: "Who invented the printing press with movable type?", a: "Johannes Gutenberg", w: ["Leonardo da Vinci", "Galileo Galilei", "William Shakespeare"], e: "Gutenberg's printing press (c. 1440) revolutionised the spread of knowledge." },
        { q: "Which explorer reached the Americas in 1492?", a: "Christopher Columbus", w: ["Vasco da Gama", "Marco Polo", "Ferdinand Magellan"], e: "Columbus sailed for India but reached the Caribbean islands." },
        { q: "Which explorer first sailed around the world?", a: "Ferdinand Magellan", w: ["Columbus", "Vasco da Gama", "James Cook"], e: "Magellan's expedition (1519-1522) was the first to circumnavigate the globe." },
        { q: "What were explorers looking for on their voyages?", a: "New trade routes, gold, and spices", w: ["New animals", "New recipes", "New games"], e: "European explorers sought wealth and direct trade routes to Asia." },
        { q: "What was the Columbian Exchange?", a: "The transfer of plants, animals, and diseases between Old and New Worlds", w: ["A currency exchange", "A scientific conference", "A peace treaty"], e: "The Columbian Exchange transformed agriculture and diets worldwide." },
        { q: "How did exploration change world maps?", a: "Maps became more accurate with new lands added", w: ["Maps became less accurate", "Maps stayed the same", "Maps were no longer needed"], e: "New discoveries led to more complete and accurate world maps." },
      ],
      // World 5: Unit 5 - Government & Citizenship (Ch1: Types of Government, Ch2: Citizenship, Ch3: UN)
      [
        { q: "What is a monarchy?", a: "A government ruled by a king or queen", w: ["A government ruled by the people", "A government ruled by the military", "A government with no leader"], e: "In a monarchy, power is inherited by members of a royal family." },
        { q: "What is a democracy?", a: "A government where people choose their leaders by voting", w: ["A government ruled by one person", "A government ruled by wealthy people", "A government with no laws"], e: "Democracy means 'rule by the people' in Greek." },
        { q: "What is a dictatorship?", a: "A government controlled by one person with absolute power", w: ["A government with elected leaders", "A government with many political parties", "A government ruled by judges"], e: "In a dictatorship, one person makes all decisions without citizen input." },
        { q: "What is a citizen?", a: "A legal member of a country with rights and responsibilities", w: ["A visitor to a country", "A tourist", "An illegal immigrant"], e: "Citizens have rights (like voting) and duties (like obeying laws)." },
        { q: "What are rights?", a: "Freedoms and protections that every person deserves", w: ["Rules to follow", "Punishments for crimes", "Special privileges for the rich"], e: "Rights include freedom of speech, education, and equal treatment." },
        { q: "What are responsibilities of citizens?", a: "Obeying laws, voting, and helping the community", w: ["Only paying taxes", "Only following laws", "No responsibilities"], e: "Citizens have both rights and responsibilities to their country." },
        { q: "What does UN stand for?", a: "United Nations", w: ["Union of Nations", "Universal Network", "United Network"], e: "The UN is an international organisation founded in 1945." },
        { q: "Where is the headquarters of the United Nations?", a: "New York, USA", w: ["London, UK", "Paris, France", "Geneva, Switzerland"], e: "The UN headquarters is located in New York City." },
        { q: "What is the main goal of the United Nations?", a: "To maintain international peace and security", w: ["To start wars", "To make money", "To build roads"], e: "The UN was created after WWII to prevent future conflicts." },
        { q: "What is UNESCO?", a: "A UN agency for education, science, and culture", w: ["A military organisation", "A banking system", "A trade union"], e: "UNESCO protects world heritage sites and promotes education." },
      ],
      // World 6: Unit 6 - Trade & Economics (Ch1: Trade Routes, Ch2: Economic Systems, Ch3: Globalization)
      [
        { q: "What is trade?", a: "The exchange of goods and services between people or countries", w: ["Stealing goods from others", "Making things only for yourself", "Giving away things for free"], e: "Trade allows people to obtain things they cannot produce themselves." },
        { q: "What was the Silk Road?", a: "An ancient trade route connecting China to Europe", w: ["A road made of silk", "A road in India only", "A modern highway"], e: "The Silk Road traded silk, spices, and ideas between East and West." },
        { q: "What is barter?", a: "Exchanging goods directly without using money", w: ["Buying with cash", "Using credit cards", "Online banking"], e: "Barter is the oldest form of trade where goods are swapped directly." },
        { q: "What is an economy?", a: "The system of producing, distributing, and consuming goods and services", w: ["A type of government", "A form of religion", "A style of music"], e: "An economy includes all activities related to making and using resources." },
        { q: "What is supply and demand?", a: "How much is available vs how much people want", w: ["How much is produced vs how much is wasted", "How much costs vs how much sells", "How much is imported vs exported"], e: "Prices are affected by how much supply there is and how much demand exists." },
        { q: "What is globalization?", a: "The increasing connection between countries through trade and technology", w: ["Isolation of countries", "Closing of borders", "Stopping all trade"], e: "Globalization means the world is becoming more connected and interdependent." },
        { q: "What are imports?", a: "Goods brought into a country from another country", w: ["Goods sent out of a country", "Goods made locally", "Goods thrown away"], e: "Countries import goods they need but cannot produce efficiently." },
        { q: "What are exports?", a: "Goods sent out of a country to another country", w: ["Goods brought into a country", "Goods kept for local use", "Goods that are recycled"], e: "Countries export goods they produce well to earn money." },
        { q: "What is fair trade?", a: "Trade that ensures producers get fair prices for their goods", w: ["Trade that is free for all", "Trade with no rules", "Trade that only helps rich countries"], e: "Fair trade aims to give fair wages and better conditions to producers." },
        { q: "How has technology changed trade?", a: "Made it faster and easier to trade globally", w: ["Made trade impossible", "Slowed down trade", "Only helped local trade"], e: "The internet and modern transport have made global trade much easier." },
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ TAMIL GRAMMAR (My Tamil Grammar Ver 3 by Language House) ============
  // 36 topics covered across 6 worlds:
  // World 1: Parts of Speech (பெயர்ச்சொல், வினைச்சொல், இடைச்சொல், உரிச்சொல்)
  // World 2: Plurals, Pronouns, Conjunctions & Compound Sentences
  // World 3: Compound Words, Onomatopoeia & Proverbs
  // World 4: Case Suffixes, Adverbs & Antonyms
  // World 5: Question Words, Tenses & Interrogatives
  // World 6: Sentence Types (Exclamatory, Imperative, Proverbs)
  static tamilGrammar(worldId: number, n = 10): MathQuestion[] {
    const questions: any[][] = [
      // World 1: பெயர்ச்சொல், வினைச்சொல், சொற்றொடர் (Nouns, Verbs, Phrases)
      [
        { q: "'அழகு' என்ற சொல் எந்த வகைச் சொல்?", a: "பெயர்ச்சொல்", w: ["வினைச்சொல்", "இடைச்சொல்", "உரிச்சொல்"], e: "அழகு என்பது பெயர்ச்சொல் (Noun). பெயர்ச்சொல் என்பது பொருளைக் குறிக்கும் சொல்." },
        { q: "'ஓடு' என்ற சொல் எந்த வகைச் சொல்?", a: "வினைச்சொல்", w: ["பெயர்ச்சொல்", "இடைச்சொல்", "உரிச்சொல்"], e: "ஓடு என்பது வினைச்சொல் (Verb). வினைச்சொல் என்பது செயலைக் குறிக்கும் சொல்." },
        { q: "'மலர்' என்ற சொல்லின் பன்மைச் சொல் எது?", a: "மலர்கள்", w: ["மலரை", "மலரின்", "மலருக்கு"], e: "பன்மை = ஒன்றுக்கு மேற்பட்டது. மலர் → மலர்கள் (பன்மை)." },
        { q: "'பசு' என்ற சொல்லின் ஒருமைச் சொல் எது?", a: "ஒரு பசு", w: ["பசுக்கள்", "பசுகள்", "பசுக்களை"], e: "ஒருமை = ஒன்று மட்டும். பசுக்கள் (பன்மை) → பசு (ஒருமை)." },
        { q: "'அழகான மலர்' - இது எந்த வகைச் சொற்றொடர்?", a: "பெயர்ச்சொற்றொடர்", w: ["வினைச்சொற்றொடர்", "அடுக்குத் தொடர்", "எதிர்மறைத் தொடர்"], e: "பெயர்ச்சொல் + பெயரடை = பெயர்ச்சொற்றொடர். அழகான (பெயரடை) + மலர் (பெயர்ச்சொல்)." },
        { q: "'மாணவன் படிக்கிறான்' - இது எந்த வகைச் சொற்றொடர்?", a: "வினைச்சொற்றொடர்", w: ["பெயர்ச்சொற்றொடர்", "அடுக்குத் தொடர்", "மரபுத்தொடர்"], e: "மாணவன் (எழுவாய்) + படிக்கிறான் (வினைச்சொல்) = வினைச்சொற்றொடர்." },
        { q: "'நல்ல பழம்' - இது எந்த வகைச் சொற்றொடர்?", a: "பெயர்ச்சொற்றொடர்", w: ["வினைச்சொற்றொடர்", "இணைப்புத் தொடர்", "மரபுத்தொடர்"], e: "நல்ல (பெயரடை) + பழம் (பெயர்ச்சொல்) = பெயர்ச்சொற்றொடர்." },
        { q: "'குழந்தை விளையாடுகிறது' - இது எந்த வகைச் சொற்றொடர்?", a: "வினைச்சொற்றொடர்", w: ["பெயர்ச்சொற்றொடர்", "இணைப்புத் தொடர்", "மரபுத்தொடர்"], e: "குழந்தை (எழுவாய்) + விளையாடுகிறது (வினைச்சொல்) = வினைச்சொற்றொடர்." },
        { q: "'சிவப்பு' என்ற சொல் எந்த வகைச் சொல்?", a: "பெயர்ச்சொல் (பெயரடை)", w: ["வினைச்சொல்", "இடைச்சொல்", "முன்னிலைச் சொல்"], e: "சிவப்பு = பெயர்ச்சொல் / பெயரடை. நிறத்தைக் குறிக்கும் பெயர்ச்சொல்." },
        { q: "'பெண்' என்ற சொல் எந்த வகைப் பெயர்ச்சொல்?", a: "ஒருமைப் பெயர்ச்சொல்", w: ["பன்மைப் பெயர்ச்சொல்", "வினைச்சொல்", "இடைச்சொல்"], e: "பெண் = ஒருமைப் பெயர்ச்சொல் (Singular Noun). பெண்கள் = பன்மை." },
      ],
      // World 2: மூவிடப்பெயர்கள், இணைப்புச்சொற்கள், அடுக்குத் தொடர்
      [
        { q: "'நான்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?", a: "உடம்படுமை மூவிடப்பெயர்", w: ["படர்மை மூவிடப்பெயர்", "சுட்டுமை மூவிடப்பெயர்", "வினா மூவிடப்பெயர்"], e: "நான், நீ, அவன் = உடம்படுமை மூவிடப்பெயர்கள் (First/Second/Third person pronouns)." },
        { q: "'இவன்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?", a: "சுட்டுமை மூவிடப்பெயர்", w: ["உடம்படுமை மூவிடப்பெயர்", "படர்மை மூவிடப்பெயர்", "வினா மூவிடப்பெயர்"], e: "இவன், இவள், இது = சுட்டுமை மூவிடப்பெயர்கள் (Demonstrative pronouns - near)." },
        { q: "'யார்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?", a: "வினா மூவிடப்பெயர்", w: ["உடம்படுமை மூவிடப்பெயர்", "சுட்டுமை மூவிடப்பெயர்", "படர்மை மூவிடப்பெயர்"], e: "யார், எது, எவன் = வினா மூவிடப்பெயர்கள் (Interrogative pronouns)." },
        { q: "'மற்றும்' என்ற சொல் எந்த வகை இணைப்புச்சொல்?", a: "இணைப்புச்சொல்", w: ["பெயர்ச்சொல்", "வினைச்சொல்", "இடைச்சொல்"], e: "மற்றும், ஆனால், அல்லது = இணைப்புச்சொற்கள் (Conjunctions)." },
        { q: "'ஆனால்' என்ற சொல் என்ன செய்கிறது?", a: "இரண்டு தொடர்களை இணைக்கிறது", w: ["பெயரைக் குறிக்கிறது", "செயலைக் குறிக்கிறது", "எண்ணைக் குறிக்கிறது"], e: "ஆனால் என்பது இணைப்புச்சொல். இது இரண்டு தொடர்களை இணைக்கிறது." },
        { q: "'அவன் படித்தான் மற்றும் விளையாடினான்' - இது எந்த வகைத் தொடர்?", a: "அடுக்குத் தொடர்", w: ["எதிர்மறைத் தொடர்", "வினாத் தொடர்", "உணர்ச்சித் தொடர்"], e: "அடுக்குத் தொடர் = இரண்டு தொடர்கள் இணைப்புச்சொல்லால் இணைக்கப்படும்." },
        { q: "'அவள் பாடினாள் ஆனால் நடக்கவில்லை' - இது எந்த வகைத் தொடர்?", a: "அடுக்குத் தொடர்", w: ["உணர்ச்சித் தொடர்", "வினாத் தொடர்", "கட்டளைத் தொடர்"], e: "அவள் பாடினாள் + ஆனால் + நடக்கவில்லை = அடுக்குத் தொடர்." },
        { q: "'அவர்கள்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?", a: "படர்மை மூவிடப்பெயர்", w: ["உடம்படுமை மூவிடப்பெயர்", "சுட்டுமை மூவிடப்பெயர்", "வினா மூவிடப்பெயர்"], e: "அவர்கள், அவை = படர்மை மூவிடப்பெயர்கள் (Third person plural - distant)." },
        { q: "'அல்லது' என்ற சொல் என்ன செய்கிறது?", a: "தேர்வு செய்ய உதவுகிறது", w: ["எண்ணிக்கை சொல்கிறது", "நிறத்தைக் குறிக்கிறது", "இடத்தைக் குறிக்கிறது"], e: "அல்லது = இணைப்புச்சொல். இரண்டில் ஒன்றைத் தேர்ந்தெடுக்க உதவுகிறது." },
        { q: "'நான் வந்தேன் அவன் போனான்' - இதை இணைக்கும் சொல் எது?", a: "மற்றும்", w: ["ஆனால்", "அல்லது", "எனவே"], e: "'நான் வந்தேன் மற்றும் அவன் போனான்' = அடுக்குத் தொடர்." },
      ],
      // World 3: இணைச்சொற்கள், மயங்கொலிச் சொற்கள், மரபுத்தொடர்கள்
      [
        { q: "'நல்லது + அழகு = நல்லழகு' - இது எந்த வகைச் சொல்?", a: "இணைச்சொல்", w: ["பெயர்ச்சொல்", "வினைச்சொல்", "இடைச்சொல்"], e: "இரண்டு சொற்கள் சேர்ந்து ஒரு புதிய சொல் உருவாகும் = இணைச்சொல்." },
        { q: "'பொன் + நிறம் = பொன்னிறம்' - இது எந்த வகைச் சொல்?", a: "இணைச்சொல்", w: ["பெயர்ச்சொல்", "வினைச்சொல்", "இடைச்சொல்"], e: "பொன் + நிறம் = பொன்னிறம். இரண்டு சொற்கள் இணைந்து ஒரு புதிய சொல்." },
        { q: "'கா + கா = காக்கா' - இது எந்த வகைச் சொல்?", a: "மயங்கொலிச் சொல்", w: ["இணைச்சொல்", "பெயர்ச்சொல்", "வினைச்சொல்"], e: "மயங்கொலிச் சொல் = ஒரே எழுத்து அல்லது ஒலி மீண்டும் மீண்டும் வரும்." },
        { q: "'தா + தா = தாத்தா' - இது எந்த வகைச் சொல்?", a: "மயங்கொலிச் சொல்", w: ["இணைச்சொல்", "பெயர்ச்சொல்", "வினைச்சொல்"], e: "தா + தா = தாத்தா. ஒரே ஒலி மீண்டும் வருவதால் மயங்கொலிச் சொல்." },
        { q: "'கண் உறுதி மூன்று' என்ற மரபுத்தொடரின் பொருள் என்ன?", a: "பார்ப்பதை நம்பலாம்", w: ["கேட்பதை நம்பலாம்", "பேசுவது முக்கியம்", "எழுதுவது முக்கியம்"], e: "கண் உறுதி மூன்று = பார்ப்பதை விட உறுதியான சாட்சி வேறில்லை." },
        { q: "'சிறு துளி பெரு வெள்ளம்' என்ற மரபுத்தொடரின் பொருள் என்ன?", a: "சிறியது பெரிதாக மாறும்", w: ["பெரியது சிறியதாக மாறும்", "நீர் முக்கியம்", "வெள்ளம் அபாயம்"], e: "சிறு துளி பெரு வெள்ளம் = சிறிய தொடக்கம் பெரிய மாற்றத்தை உருவாக்கும்." },
        { q: "'பழையன கழிதலும் புதியன பிறத்தலும்' - இதன் பொருள் என்ன?", a: "பழையது மறைந்து புதியது வரும்", w: ["பழையதை வைத்துக்கொள்", "புதியதை நிராகரி", "காலம் நிற்கிறது"], e: "பழையன கழிதலும் புதியன பிறத்தலும் = Change is constant (திருக்குறள்)." },
        { q: "'பளிச்' என்ற சொல் எந்த வகைச் சொல்?", a: "ஒலிக்குறிப்புச் சொல்", w: ["பெயர்ச்சொல்", "வினைச்சொல்", "மயங்கொலிச் சொல்"], e: "பளிச் = ஒலிக்குறிப்புச் சொல் (Onomatopoeia). ஒரு ஒலியைக் குறிக்கும்." },
        { q: "'கிலுகிலு' என்ற சொல் எந்த வகைச் சொல்?", a: "ஒலிக்குறிப்புச் சொல்", w: ["இணைச்சொல்", "பெயர்ச்சொல்", "மரபுத்தொடர்"], e: "கிலுகிலு = ஒலிக்குறிப்புச் சொல். நகைச்சுவையான ஒலியைக் குறிக்கும்." },
        { q: "'அழகு + மலர் = அழகுமலர்' - இது எந்த வகைச் சொல்?", a: "இணைச்சொல்", w: ["மயங்கொலிச் சொல்", "பெயர்ச்சொல்", "ஒலிக்குறிப்புச் சொல்"], e: "அழகு + மலர் = அழகுமலர். இரண்டு பெயர்ச்சொற்கள் இணைந்தது = இணைச்சொல்." },
      ],
      // World 4: உரிச்சொல், இடைச்சொல், எதிர்ச்சொல், தொடர்புச்சொல்
      [
        { q: "'மரத்தில்' என்ற சொல்லில் 'இல்' என்பது என்ன?", a: "உரிச்சொல் (இடப்பொருள் உரி)", w: ["பெயர்ச்சொல்", "வினைச்சொல்", "இணைச்சொல்"], e: "'இல்' = இடத்தைக் குறிக்கும் உரிச்சொல். மரத்தில், வீட்டில்." },
        { q: "'மரத்தை' என்ற சொல்லில் 'ஐ' என்பது என்ன?", a: "உரிச்சொல் (கருமை உரி)", w: ["எழுவாய் உரி", "இடப்பொருள் உரி", "கொடை உரி"], e: "'ஐ' = கருமை (object) உரிச்சொல். பழத்தை, புத்தகத்தை." },
        { q: "'அவனுக்கு' என்ற சொல்லில் 'க்கு' என்பது என்ன?", a: "உரிச்சொல் (கொடை உரி)", w: ["இடப்பொருள் உரி", "கருமை உரி", "உடைமை உரி"], e: "'க்கு' = கொடை (dative) உரிச்சொல். அவனுக்கு, பையனுக்கு." },
        { q: "'மேல்' என்ற சொல் எந்த வகை இடைச்சொல்?", a: "இடவிளிக்கை இடைச்சொல்", w: ["சான்றிடை இடைச்சொல்", "உடனிலை இடைச்சொல்", "வினவிடை இடைச்சொல்"], e: "மேல், கீழ், முன் = இடவிளிக்கை இடைச்சொற்கள் (Adverbs of place)." },
        { q: "'நல்ல + கெட்ட = எதிர்ச்சொல்' - 'நல்ல' இன் எதிர்ச்சொல் எது?", a: "கெட்ட", w: ["சிறந்த", "அழகான", "புதிய"], e: "நல்ல → கெட்ட (Antonyms/எதிர்ச்சொற்கள்)." },
        { q: "'அழகு' என்ற சொல்லின் தொடர்புச்சொல் எது?", a: "அழகான (அழகிய)", w: ["அழகில்லாத", "அழகுடைய", "அழகுக்கு"], e: "தொடர்புச்சொல் = Related word. அழகு → அழகான, அழகிய, அழகுள்ள." },
        { q: "'இன்று' என்ற சொல் எந்த வகை இடைச்சொல்?", a: "காலவிளிக்கை இடைச்சொல்", w: ["இடவிளிக்கை", "பண்பு விளிக்கை", "எண்ணிடை"], e: "இன்று, நேற்று, நாளை = காலவிளிக்கை இடைச்சொற்கள் (Adverbs of time)." },
        { q: "'மிகவும்' என்ற சொல் எந்த வகை இடைச்சொல்?", a: "பண்பு விளிக்கை இடைச்சொல்", w: ["காலவிளிக்கை", "இடவிளிக்கை", "எண்ணிடை"], e: "மிகவும், மிக, அதிகம் = பண்பு விளிக்கை இடைச்சொற்கள் (Adverbs of degree)." },
        { q: "'அன்று' என்ற சொல்லின் எதிர்ச்சொல் எது?", a: "இன்று", w: ["நேற்று", "நாளை", "இன்றைக்கு"], e: "அன்று (that day) → இன்று (today) = எதிர்ச்சொற்கள்." },
        { q: "'மேல்' என்ற சொல்லின் எதிர்ச்சொல் எது?", a: "கீழ்", w: ["முன்", "பின்", "உள்"], e: "மேல் (up) → கீழ் (down) = எதிர்ச்சொற்கள்." },
      ],
      // World 5: வேற்றுமை உருபுகள், வினாச்சொற்கள், காலம்
      [
        { q: "'பள்ளிக்கு' என்ற சொல்லில் 'க்கு' என்ற உருபு எந்த வேற்றுமையைக் குறிக்கிறது?", a: "நான்காம் வேற்றுமை (கொடை)", w: ["முதல் வேற்றுமை", "இரண்டாம் வேற்றுமை", "மூன்றாம் வேற்றுமை"], e: "நான்காம் வேற்றுமை = கொடை/இலக்கம். பள்ளிக்கு, வீட்டுக்கு." },
        { q: "'புத்தகத்தால்' என்ற சொல்லில் 'ஆல்' எந்த வேற்றுமை உருபு?", a: "மூன்றாம் வேற்றுமை (கரணம்)", w: ["முதல் வேற்றுமை", "இரண்டாம் வேற்றுமை", "ஐந்தாம் வேற்றுமை"], e: "மூன்றாம் வேற்றுமை = கரணம் (by/with). பென்னால், புத்தகத்தால்." },
        { q: "'எங்கே' என்ற சொல் எந்த வகை வினாச்சொல்?", a: "இட வினாச்சொல்", w: ["கால வினாச்சொல்", "பொருள் வினாச்சொல்", "எண் வினாச்சொல்"], e: "எங்கே = இடத்தைக் கேட்கும் வினாச்சொல் (Where?)." },
        { q: "'எப்போது' என்ற சொல் எந்த வகை வினாச்சொல்?", a: "கால வினாச்சொல்", w: ["இட வினாச்சொல்", "பொருள் வினாச்சொல்", "எண் வினாச்சொல்"], e: "எப்போது = காலத்தைக் கேட்கும் வினாச்சொல் (When?)." },
        { q: "'எத்தனை' என்ற சொல் எந்த வகை வினாச்சொல்?", a: "எண் வினாச்சொல்", w: ["இட வினாச்சொல்", "கால வினாச்சொல்", "பொருள் வினாச்சொல்"], e: "எத்தனை = எண்ணிக்கையைக் கேட்கும் வினாச்சொல் (How many?)." },
        { q: "'எழுந்தான்' என்ற சொல் எந்த காலம்?", a: "இறந்த காலம் (Past tense)", w: ["நிகழ் காலம்", "எதிர் காலம்", "எதிர்காலம்"], e: "எழுந்தான் = Past tense. எழுகிறான் = Present. எழுவான் = Future." },
        { q: "'ஓடுகிறான்' என்ற சொல் எந்த காலம்?", a: "நிகழ் காலம் (Present tense)", w: ["இறந்த காலம்", "எதிர் காலம்", "எதிர்காலம்"], e: "ஓடுகிறான் = Present tense. ஓடினான் = Past. ஓடுவான் = Future." },
        { q: "'பாடுவாள்' என்ற சொல் எந்த காலம்?", a: "எதிர் காலம் (Future tense)", w: ["நிகழ் காலம்", "இறந்த காலம்", "எதிர்காலம்"], e: "பாடுவாள் = Future tense. பாடுகிறாள் = Present. பாடினாள் = Past." },
        { q: "'எவ்வளவு' என்ற சொல் எந்த வகை வினாச்சொல்?", a: "அளவு வினாச்சொல்", w: ["இட வினாச்சொல்", "கால வினாச்சொல்", "எண் வினாச்சொல்"], e: "எவ்வளவு = அளவைக் கேட்கும் வினாச்சொல் (How much?)." },
        { q: "'மரத்தின்' என்ற சொல்லில் 'இன்' எந்த வேற்றுமை உருபு?", a: "ஆறாம் வேற்றுமை (உடைமை)", w: ["ஐந்தாம் வேற்றுமை", "ஏழாம் வேற்றுமை", "ஒன்றாம் வேற்றுமை"], e: "ஆறாம் வேற்றுமை = உடைமை/சார்வு (of/'s). மரத்தின், பள்ளியின்." },
      ],
      // World 6: தொடர் வகைகள், உணர்ச்சித் தொடர், கட்டளைத் தொடர், பழமொழித் தொடர்
      [
        { q: "'அடி முட்கால் மேல் முட்கால்' - இது எந்த வகைத் தொடர்?", a: "உணர்ச்சித் தொடர் (Exclamatory)", w: ["வினாத் தொடர்", "கட்டளைத் தொடர்", "அடுக்குத் தொடர்"], e: "உணர்ச்சித் தொடர் = Exclamatory sentence. உணர்ச்சியை வெளிப்படுத்தும்." },
        { q: "'வகுப்பறைக்குச் செல்லுங்கள்' - இது எந்த வகைத் தொடர்?", a: "கட்டளைத் தொடர் (Imperative)", w: ["வினாத் தொடர்", "உணர்ச்சித் தொடர்", "அடுக்குத் தொடர்"], e: "கட்டளைத் தொடர் = Imperative sentence. ஒரு கட்டளை/வேண்டுகோள்." },
        { q: "'நீ எங்கே செல்கிறாய்?' - இது எந்த வகைத் தொடர்?", a: "வினாத் தொடர் (Interrogative)", w: ["கட்டளைத் தொடர்", "உணர்ச்சித் தொடர்", "தொகைத் தொடர்"], e: "வினாத் தொடர் = Interrogative sentence. கேள்வி கேட்கும்." },
        { q: "'மழை பெய்கிறது' - இது எந்த வகைத் தொடர்?", a: "எளிய வினைத்தொடர்", w: ["அடுக்குத் தொடர்", "கட்டளைத் தொடர்", "உணர்ச்சித் தொடர்"], e: "எளிய வினைத்தொடர் = Simple sentence with subject + verb." },
        { q: "'என்ன அழகு!' - இது எந்த வகைத் தொடர்?", a: "உணர்ச்சித் தொடர்", w: ["வினாத் தொடர்", "கட்டளைத் தொடர்", "எதிர்மறைத் தொடர்"], e: "உணர்ச்சித் தொடர் = Exclamatory. வியப்பு/உணர்ச்சி தெரிவிக்கும்." },
        { q: "'அமைதியாக இரு' - இது எந்த வகைத் தொடர்?", a: "கட்டளைத் தொடர்", w: ["வினாத் தொடர்", "உணர்ச்சித் தொடர்", "தொகைத் தொடர்"], e: "கட்டளைத் தொடர் = Imperative. 'இரு' = கட்டளை வடிவம்." },
        { q: "'நீ பள்ளிக்கு வருகிறாயா?' - இது எந்த வகைத் தொடர்?", a: "வினாத் தொடர்", w: ["கட்டளைத் தொடர்", "உணர்ச்சித் தொடர்", "அடுக்குத் தொடர்"], e: "வினாத் தொடர் = Interrogative. வினா வார்த்தைகள்/சின்னங்கள் இருக்கும்." },
        { q: "'நல்லவன் பிள்ளை' - இது எந்த வகைத் தொடர்?", a: "சொல்லாட்சித் தொடர் (Proverbial)", w: ["வினாத் தொடர்", "கட்டளைத் தொடர்", "எதிர்மறைத் தொடர்"], e: "சொல்லாட்சித் தொடர் = Proverb/wise saying. நல்லவன் பிள்ளை = நல்ல பிள்ளை." },
        { q: "'கற்றது கைமண்ணளவு, கல்லாதது உலகளவு' - இது எந்த வகைத் தொடர்?", a: "பழமொழித் தொடர் (Proverb)", w: ["வினாத் தொடர்", "கட்டளைத் தொடர்", "அடுக்குத் தொடர்"], e: "பழமொழித் தொடர் = Proverb/wise saying. கற்றது கைமண்ணளவு = What we know is tiny." },
        { q: "'நீர் இல்லா உலகு இல்லை' - இது எந்த வகைத் தொடர்?", a: "உவமைத் தொடர்", w: ["வினாத் தொடர்", "கட்டளைத் தொடர்", "எதிர்மறைத் தொடர்"], e: "உவமைத் தொடர் = Comparative sentence. நீர் இல்லாமல் உலகம் இல்லை என்று உவமை." },
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ HINDI (3rd Language) - Finding Text-Cum Work Book 3 by Madhubun ============
  // 10 chapters:
  // 1. मेहनत (Hard work) | 2. पंछी (Birds - poem) | 3. चाँदनी रात (Moonlit night - poem)
  // 4. दोस्ती (Friendship) | 5. ईमानदारी (Honesty) | 6. बहादुर (Bravery)
  // 7. बचपन (Childhood - poem) | 8. अक्ल बड़ी या भैंस (Wisdom story)
  // 9. हमारा भारत (Our India - poem) | 10. प्रकृति (Nature - poem)
  static hindi(worldId: number, n = 10): MathQuestion[] {
    const questions: any[][] = [
      // World 1: मेहनत (Hard Work & Perseverance)
      [
        { q: "'मेहनत' शब्द का अर्थ क्या है?", a: "कड़ी मेहनत / Hard work", w: ["आराम", "सोना", "खेलना"], e: "मेहनत = Hard work / Effort." },
        { q: "एक अच्छा विद्यार्थी कैसा होता है?", a: "जो पढ़ाई पर ध्यान दे", w: ["जो शोर मचाए", "जो सोता रहे", "जो स्कूल न जाए"], e: "A good student pays attention to studies." },
        { q: "'पढ़ना' शब्द किस वर्ग का है?", a: "क्रिया (Verb)", w: ["संज्ञा (Noun)", "विशेषण (Adjective)", "सर्वनाम (Pronoun)"], e: "पढ़ना = क्रिया (Verb) - यह एक क्रिया/कार्य को दर्शाता है." },
        { q: "'लड़की' शब्द का पुल्लिंग रूप क्या है?", a: "लड़का", w: ["लड़के", "लड़कियाँ", "बच्चा"], e: "लड़की (स्त्रीलिंग) → लड़का (पुल्लिंग)." },
        { q: "सफलता कैसे मिलती है?", a: "मेहनत और लगन से", w: ["सोने से", "खेलने से", "कुछ न करने से"], e: "Success comes through hard work and dedication." },
        { q: "'लड़की' शब्द का बहुवचन रूप क्या है?", a: "लड़कियाँ", w: ["लड़का", "लड़के", "लड़की"], e: "लड़की (एकवचन) → लड़कियाँ (बहुवचन)." },
        { q: "'होशियार' शब्द का विलोम शब्द क्या है?", a: "मूर्ख", w: ["चालाक", "तेज़", "समझदार"], e: "होशियार → मूर्ख (Smart → Foolish)." },
        { q: "'पढ़ाई' शब्द का पर्यायवाची शब्द क्या है?", a: "अध्ययन", w: ["खेल", "नाच", "सोना"], e: "पढ़ाई = अध्ययन = Studies." },
        { q: "घर का काम करके फिर पढ़ना क्या दर्शाता है?", a: "जिम्मेदारी और मेहनत", w: ["आलस", "कामचोरी", "बेकारी"], e: "Doing housework and then studying shows responsibility." },
        { q: "'होशियार' शब्द का पर्यायवाची शब्द क्या है?", a: "बुद्धिमान", w: ["मूर्ख", "आलसी", "डरपोक"], e: "होशियार = बुद्धिमान = Intelligent." },
      ],
      // World 2: पंछी (Birds - Poem)
      [
        { q: "'पंछी' शब्द का बहुवचन क्या है?", a: "पंछी", w: ["पंछिया", "पंछे", "पंछिन"], e: "पंछी = Birds (plural already). एक पंछी = one bird." },
        { q: "पंछी कैसे उड़ते हैं?", a: "पंख फड़फड़ाकर", w: ["तैरकर", "दौड़कर", "रेंगकर"], e: "Birds flap their wings to fly in the sky." },
        { q: "'पंख' शब्द का अर्थ क्या है?", a: "Wings", w: ["Legs", "Eyes", "Beak"], e: "पंख = Wings. पंछी पंखों से उड़ते हैं." },
        { q: "पंछों का घर क्या कहलाता है?", a: "घोंसला (Nest)", w: ["मकान", "दरवाज़ा", "खिड़की"], e: "Birds build nests (घोंसला) to lay eggs and live." },
        { q: "'आकाश' शब्द का पर्यायवाची शब्द क्या है?", a: "अम्बर / गगन", w: ["पृथ्वी", "ज़मीन", "समुद्र"], e: "आकाश = अम्बर = गगन = Sky." },
        { q: "पंछी कहाँ रहते हैं?", a: "घोंसले में पेड़ों पर", w: ["ज़मीन के नीचे", "पानी में", "घरों के अंदर"], e: "Birds live in nests built on trees." },
        { q: "'चहचहाना' शब्द का अर्थ क्या है?", a: "Birds chirping", w: ["Dogs barking", "Cats meowing", "Cows mooing"], e: "चहचहाना = Chirping sound made by birds." },
        { q: "पंछी सुबह क्या करते हैं?", a: "चहचहाते हैं और उड़ते हैं", w: ["सोते हैं", "रोते हैं", "खेलते हैं"], e: "Birds chirp and fly in the morning." },
        { q: "'ऊँचा' शब्द का विलोम शब्द क्या है?", a: "नीचा", w: ["बड़ा", "लंबा", "उंचा"], e: "ऊँचा (High) → नीचा (Low)." },
        { q: "पंछी हमें क्या सिखाते हैं?", a: "स्वतंत्रता और सुबह-सुबह जागने की आदत", w: ["आलस", "डर", "गुस्सा"], e: "Birds symbolise freedom and waking up early." },
      ],
      // World 3: चाँदनी रात (Moonlit Night - Poem)
      [
        { q: "'चाँद' किसका उपग्रह (satellite) है?", a: "पृथ्वी (Earth) का", w: ["सूरज का", "मंगल का", "बुध का"], e: "The Moon is Earth's only natural satellite." },
        { q: "चाँद रात में कैसा दिखता है?", a: "चमकदार और सुनहला", w: ["काला और गंदा", "छोटा और सूखा", "गर्म और लाल"], e: "The moon appears bright and golden at night." },
        { q: "'चाँदनी' शब्द का अर्थ क्या है?", a: "Moonlight", w: ["Sunlight", "Starlight", "Firelight"], e: "चाँदनी = Moonlight = the light of the moon." },
        { q: "रात में आसमान में चमकने वाली वस्तुएँ क्या हैं?", a: "चाँद और तारे", w: ["सूरज और बादल", "पक्षी और हवाई जहाज", "गेंद और खिलौने"], e: "The moon and stars shine in the night sky." },
        { q: "'रात्रि' शब्द का पर्यायवाची शब्द क्या है?", a: "रात", w: ["दिन", "सुबह", "शाम"], e: "रात्रि = रात (Night)." },
        { q: "चाँद के बारे में कविताएँ क्या दर्शाती हैं?", a: "बच्चों की कल्पना और सपने", w: ["डर और चिंता", "गुस्सा और लड़ाई", "थकान और नींद"], e: "Poems about the moon reflect children's imagination." },
        { q: "'चाँद' शब्द का विशेषण रूप क्या है?", a: "चाँदनी / चाँद सा", w: ["चाँदवा", "चाँदनीला", "चाँदी"], e: "चाँद सा सुंदर = Beautiful like the moon." },
        { q: "'तारा' शब्द का बहुवचन क्या है?", a: "तारे", w: ["तारों", "तारी", "तारा"], e: "तारा (Singular) → तारे (Plural)." },
        { q: "अंतरिक्ष यात्री कहाँ गए हैं?", a: "चाँद पर", w: ["सूरज पर", "तारे पर", "बादल में"], e: "Astronauts have travelled to the Moon." },
        { q: "'चमकना' शब्द का अर्थ क्या है?", a: "To shine / glow", w: ["To sleep", "To eat", "To cry"], e: "चमकना = To shine / glow." },
      ],
      // World 4: दोस्ती (Friendship)
      [
        { q: "सबसे अच्छा मित्र कौन होता है?", a: "जो कठिन समय में साथ दे", w: ["जो मज़े में साथ हो", "जो अमीर हो", "जो ताकतवर हो"], e: "A true friend stands by you in difficult times." },
        { q: "'मित्र' शब्द का पर्यायवाची शब्द क्या है?", a: "दोस्त", w: ["दुश्मन", "अजनबी", "बड़ा"], e: "मित्र = दोस्त = Friend." },
        { q: "सच्चा मित्र कैसा होता है?", a: "विश्वासयोग्य और ईमानदार", w: ["झूठा और धोखेबाज़", "आलसी और कामचोर", "गुस्सैल और क्रोधी"], e: "A true friend is trustworthy and honest." },
        { q: "'अच्छा' शब्द का विलोम शब्द क्या है?", a: "बुरा", w: ["सुंदर", "उत्तम", "बढ़िया"], e: "अच्छा (Good) → बुरा (Bad)." },
        { q: "मित्रता का महत्व क्या है?", a: "मित्र जीवन का सच्चा साथी है", w: ["मित्र बेकार है", "मित्र से डरना चाहिए", "मित्र को नज़रअंदाज़ करना चाहिए"], e: "A friend is life's true companion." },
        { q: "'साथ' शब्द का अर्थ क्या है?", a: "Together / साथ में", w: ["अकेला", "दूर", "बिना"], e: "साथ = Together / With." },
        { q: "दोस्ती किस पर आधारित होनी चाहिए?", a: "विश्वास और समझ", w: ["धोखा और फरेब", "अमीरी और रुतबा", "डर और धमकी"], e: "Friendship should be based on trust and understanding." },
        { q: "'मित्र' शब्द का विलोम शब्द क्या है?", a: "शत्रु (Enemy)", w: ["भाई", "पिता", "गुरु"], e: "मित्र (Friend) → शत्रु (Enemy)." },
        { q: "सच्चा दोस्त कब काम आता है?", a: "मुश्किल वक़्त में", w: ["आसान वक़्त में", "कभी नहीं", "सिर्फ खाने में"], e: "A true friend is revealed during difficult times." },
        { q: "दोस्ती का संदेश क्या है?", a: "अच्छी दोस्ती जीवनभर काम आती है", w: ["दोस्ती बेकार है", "अकेला रहना अच्छा है", "किसी पर भरोसा न करें"], e: "Good friendship lasts a lifetime." },
      ],
      // World 5: ईमानदारी (Honesty / Truth & Values)
      [
        { q: "'सच्चाई' शब्द का अर्थ क्या है?", a: "Truth / ईमानदारी", w: ["झूठ", "चोरी", "धोखा"], e: "सच्चाई = Truth / Honesty." },
        { q: "'पैगाम' शब्द का अर्थ क्या है?", a: "संदेश (Message)", w: ["खत", "उपहार", "खेल"], e: "पैगाम = Message / News." },
        { q: "सच्चा इंसान कैसा होता है?", a: "ईमानदार और भरोसेमंद", w: ["झूठा और चालाक", "आलसी और कामचोर", "गुस्सैल और क्रोधी"], e: "An honest person is trustworthy and reliable." },
        { q: "'ईमानदार' शब्द का विलोम शब्द क्या है?", a: "बेईमान", w: ["सच्चा", "अच्छा", "मेहनती"], e: "ईमानदार (Honest) → बेईमान (Dishonest)." },
        { q: "सच्चाई का रास्ता कैसा होता है?", a: "कठिन लेकिन सही", w: ["आसान लेकिन गलत", "छोटा और संकीर्ण", "लंबा और भयानक"], e: "The path of truth may be difficult but it is always right." },
        { q: "'सच' शब्द का पर्यायवाची शब्द क्या है?", a: "सच्चाई", w: ["झूठ", "फरेब", "धोखा"], e: "सच = सच्चाई = Truth." },
        { q: "सच्चाई को किससे तुलना की जाती है?", a: "रोशनी (Light) से", w: ["अंधेरे से", "आग से", "पानी से"], e: "Truth is compared to light that removes darkness." },
        { q: "'संदेश' शब्द का पर्यायवाची शब्द क्या है?", a: "पैगाम", w: ["खत", "उपहार", "खेल"], e: "संदेश = पैगाम = Message." },
        { q: "कविताएँ हमें क्या सिखाती हैं?", a: "अच्छे संस्कार और नैतिकता", w: ["बुरी आदतें", "झूठ बोलना", "चोरी करना"], e: "Poems about values teach us good morals and ethics." },
        { q: "'नैतिकता' शब्द का अर्थ क्या है?", a: "Morality / Ethics", w: ["Immorality", "Dishonesty", "Laziness"], e: "नैतिकता = Morality / Ethics." },
      ],
      // World 6: बहादुर (Bravery / Courage)
      [
        { q: "'वीर' शब्द का अर्थ क्या है?", a: "बहादुर (Brave)", w: ["डरपोक", "आलसी", "कायर"], e: "वीर = Brave / Courageous warrior." },
        { q: "1857 की क्रांति क्या थी?", a: "अंग्रेज़ों के खिलाफ पहला बड़ा विद्रोह", w: ["1947 की आज़ादी", "पहला विश्व युद्ध", "दूसरा विश्व युद्ध"], e: "The 1857 Revolt was the first major uprising against British rule." },
        { q: "'क्रांति' शब्द का अर्थ क्या है?", a: "Revolution / विद्रोह", w: ["शांति", "आराम", "मित्रता"], e: "क्रांति = Revolution / Revolt against unjust rule." },
        { q: "'बहादुर' शब्द का पर्यायवाची शब्द क्या है?", a: "वीर", w: ["डरपोक", "कायर", "आलसी"], e: "बहादुर = वीर = Brave." },
        { q: "देशभक्ति का अर्थ क्या है?", a: "अपने देश से प्रेम", w: ["देश से नफरत", "दूसरे देश की तारीफ", "कुछ नहीं"], e: "Patriotism means love for one's country." },
        { q: "'मर्दानी' शब्द का अर्थ क्या है?", a: "जो औरत पुरुषों जैसी बहादुर हो", w: ["जो डरती हो", "जो सोती हो", "जो रोती हो"], e: "मर्दानी = A brave woman who fights courageously." },
        { q: "'मातृभूमि' शब्द का अर्थ क्या है?", a: "Motherland / अपना देश", w: ["Fatherland", " neighbour", "Enemy"], e: "मातृभूमि = Motherland = One's own country." },
        { q: "'रानी' शब्द का अर्थ क्या है?", a: "Queen / महारानी", w: ["King", "Soldier", "Farmer"], e: "रानी = Queen." },
        { q: "हमें वीरों से क्या सीखना चाहिए?", a: "देशभक्ति और बहादुरी", w: ["डर और कायरता", "आलस और सुस्ती", "धोखा और झूठ"], e: "We should learn patriotism and bravery from heroes." },
        { q: "'स्वतंत्रता' शब्द का अर्थ क्या है?", a: "Freedom / आज़ादी", w: ["Slavery", "Dependence", "Weakness"], e: "स्वतंत्रता = Freedom / Independence." },
      ],
      // World 7: बचपन (Childhood - Poem)
      [
        { q: "'बचपन' शब्द का अर्थ क्या है?", a: "लड़कपन / शैशव अवस्था", w: ["जवानी", "बूढ़ापा", "मध्यम अवस्था"], e: "बचपन = Childhood / Early years of life." },
        { q: "बचपन में बच्चे कैसे होते हैं?", a: "मासूम और खुशमिजाज़", w: ["चालाक और धोखेबाज़", "गुस्सैल और क्रोधी", "आलसी और सुस्त"], e: "Children in their early years are innocent and cheerful." },
        { q: "'मासूम' शब्द का अर्थ क्या है?", a: "निर्दोष / Innocent", w: ["चालाक", "गुस्सैल", "आलसी"], e: "मासूम = Innocent / Pure / Free from guilt." },
        { q: "बच्चे क्या करना पसंद करते हैं?", a: "खेलना और हँसना", w: ["काम करना", "रोना और गुस्सा करना", "सोना"], e: "Children love to play and laugh." },
        { q: "'खुशमिज़ाज' शब्द का विलोम शब्द क्या है?", a: "उदास / रूठा हुआ", w: ["प्रसन्न", "आनंदित", "हर्षित"], e: "खुशमिज़ाज (Cheerful) → उदास (Sad)." },
        { q: "'याद' शब्द का अर्थ क्या है?", a: "Memory / यादें", w: ["भूलना", "अनजान", "वर्तमान"], e: "याद = Memory / Remembering." },
        { q: "बचपन की सबसे अच्छी बात क्या है?", a: "निर्दोषता और खुशी", w: ["चिंता और डर", "क्रोध और ईर्ष्या", "धोखा और झूठ"], e: "The best thing about childhood is innocence and joy." },
        { q: "'बचपन' शब्द का पर्यायवाची शब्द क्या है?", a: "शैशव / बाल्यावस्था", w: ["जवानी", "वृद्धावस्था", "किशोरावस्था"], e: "बचपन = शैशव = बाल्यावस्था = Childhood." },
        { q: "हमें बचपन की यादों को कैसे रखना चाहिए?", a: "संजोकर और याद करके", w: ["भूल जाना चाहिए", "मिटा देना चाहिए", "नज़रअंदाज़ करना चाहिए"], e: "We should cherish the memories of childhood." },
        { q: "'बाल्यावस्था' शब्द का अर्थ क्या है?", a: "Childhood / बचपन", w: ["Youth", "Old age", "Adulthood"], e: "बाल्यावस्था = Childhood." },
      ],
      // World 8: अक्ल बड़ी या भैंस (Wisdom Story - Clever Solutions)
      [
        { q: "'होशियार' शब्द का अर्थ क्या है?", a: "बुद्धिमान / Intelligent", w: ["मूर्ख", "आलसी", "डरपोक"], e: "होशियार = Clever / Intelligent / Sharp-minded." },
        { q: "'बुद्धिमान' शब्द का पर्यायवाची शब्द क्या है?", a: "होशियार", w: ["मूर्ख", "आलसी", "बेकार"], e: "बुद्धिमान = होशियार = Intelligent / Wise." },
        { q: "समस्याओं का हल कैसे निकालना चाहिए?", a: "बुद्धि और सोच से", w: ["लड़ाई से", "धोखा देकर", "चोरी करके"], e: "Problems should be solved using wit and intelligence." },
        { q: "'दरबार' शब्द का अर्थ क्या है?", a: "राजा का सभा-स्थल (Court)", w: ["खेत", "बाज़ार", "स्कूल"], e: "दरबार = Royal court where the king holds meetings." },
        { q: "'समस्या' शब्द का अर्थ क्या है?", a: "Problem", w: ["Solution", "Joy", "Friend"], e: "समस्या = Problem / Difficulty." },
        { q: "होशियार लोग कैसे होते हैं?", a: "तेज़ दिमाग और चतुर", w: ["धीमे और मूर्ख", "आलसी", "डरपोक"], e: "Clever people are sharp-minded and quick thinkers." },
        { q: "'चतुर' शब्द का विलोम शब्द क्या है?", a: "मूर्ख", w: ["होशियार", "बुद्धिमान", "तेज़"], e: "चतुर (Clever) → मूर्ख (Foolish)." },
        { q: "'उपाय' शब्द का अर्थ क्या है?", a: "Solution / तरीका", w: ["Problem", "Fight", "Escape"], e: "उपाय = Solution / Way out." },
        { q: "हमें होशियार लोगों से क्या सीखना चाहिए?", a: "सोच-समझकर काम करना", w: ["जल्दबाजी करना", "धोखा देना", "कुछ न करना"], e: "We should learn to think before acting." },
        { q: "'सलाह' शब्द का अर्थ क्या है?", a: "Advice / सुझाव", w: ["Fight", "Anger", "Ignore"], e: "सलाह = Advice / Suggestion." },
      ],
      // World 9: हमारा भारत (Our India - Patriotic Poem)
      [
        { q: "'भारत' देश का दूसरा नाम क्या है?", a: "हिंदुस्तान / इंडिया", w: ["चीन", "पाकिस्तान", "अमेरिका"], e: "भारत = India = Hindustan." },
        { q: "भारत की राजधानी क्या है?", a: "नई दिल्ली", w: ["मुंबई", "कोलकाता", "चेन्नई"], e: "New Delhi is the capital of India." },
        { q: "भारत का राष्ट्रीय पंछी कौन सा है?", a: "मोर (Peacock)", w: ["गिद्ध", "कौआ", "तोता"], e: "The peacock (मोर) is India's national bird." },
        { q: "भारत का राष्ट्रीय फूल कौन सा है?", a: "कमल (Lotus)", w: ["गुलाब", "सूरजमुखी", "गेंदा"], e: "The lotus (कमल) is India's national flower." },
        { q: "भारत का राष्ट्रीय जानवर कौन सा है?", a: "बाघ (Tiger)", w: ["हाथी", "सिंह", "भालू"], e: "The Bengal tiger (बाघ) is India's national animal." },
        { q: "'स्वतंत्रता दिवस' कब मनाया जाता है?", a: "15 अगस्त", w: ["26 जनवरी", "2 अक्टूबर", "14 नवंबर"], e: "Independence Day is celebrated on 15th August." },
        { q: "भारत की सबसे बड़ी नदी कौन सी है?", a: "गंगा (Ganges)", w: ["यमुना", "कावेरी", "नर्मदा"], e: "The Ganga is the longest and most sacred river in India." },
        { q: "भारत में कितने राज्य हैं?", a: "28 राज्य", w: ["25 राज्य", "30 राज्य", "20 राज्य"], e: "India has 28 states and 8 Union territories." },
        { q: "'वंदे मातरम' का अर्थ क्या है?", a: "मैं मातृभूमि को प्रणाम करता हूँ", w: ["जय हिन्द", "भारत माता की जय", "जय जवान"], e: "Vande Mataram means 'I bow to thee, Mother'." },
        { q: "भारत का राष्ट्रीय ध्वज कैसा दिखता है?", a: "तीन रंगों की पट्टियाँ: केसरिया, सफेद, हरा", w: ["दो रंग: लाल और नीला", "एक रंग: हरा", "चार रंग"], e: "The Indian flag has three horizontal stripes: saffron, white, and green." },
      ],
      // World 10: प्रकृति (Nature - Poem)
      [
        { q: "'प्रकृति' शब्द का अर्थ क्या है?", a: "Nature / प्राकृतिक संसार", w: ["City", "Village", "Building"], e: "प्रकृति = Nature = the natural world around us." },
        { q: "'पेड़' शब्द का बहुवचन क्या है?", a: "पेड़", w: ["पेड़ा", "पेड़ों", "पेड़ी"], e: "पेड़ = Tree(s) - same form for singular and plural." },
        { q: "प्रकृति में कौन-कौन से रंग हैं?", a: "हरा, पीला, लाल, नीला", w: ["सिर्फ काला और सफेद", "सिर्फ हरा", "कोई रंग नहीं"], e: "Nature is full of many beautiful colours." },
        { q: "'पहाड़' शब्द का पर्यायवाची शब्द क्या है?", a: "पर्वत / अचल", w: ["नदी", "समुद्र", "मैदान"], e: "पहाड़ = पर्वत = Mountain." },
        { q: "'नदी' शब्द का बहुवचन क्या है?", a: "नदियाँ", w: ["नदी", "नदा", "नदिन"], e: "नदी (Singular) → नदियाँ (Plural)." },
        { q: "प्रकृति से हमें क्या सीखना चाहिए?", a: "शांति और सद्भाव", w: ["लड़ना", "चिल्लाना", "गुस्सा करना"], e: "Nature teaches us peace and harmony." },
        { q: "'फूल' शब्द का बहुवचन क्या है?", a: "फूल", w: ["फूला", "फूली", "फूलों"], e: "फूल = same in singular and plural." },
        { q: "प्रकृति की सुंदरता कब सबसे अच्छी लगती है?", a: "सुबह-सुबह (Morning)", w: ["रात में", "दोपहर में", "शाम को"], e: "Nature is most beautiful in the early morning." },
        { q: "'पत्ती' शब्द का बहुवचन क्या है?", a: "पत्तियाँ", w: ["पत्ता", "पत्ते", "पत्तिन"], e: "पत्ती (Singular) → पत्तियाँ (Plural - feminine)." },
        { q: "प्रकृति की कविताएँ क्या सिखाती हैं?", a: "प्रकृति के प्रति प्रेम और सम्मान", w: ["गुस्सा और लड़ाई", "डर और चिंता", "थकान और नींद"], e: "Nature poems teach us to love and respect nature." },
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  static getQuestions(subjectId: string, bookId: number, worldId: number, count = 5): MathQuestion[] {
    switch (subjectId) {
      case 'math': {
        switch (worldId) {
          case 1: return this.mathPlaceValue(count);
          case 2: return this.mathAddSubtract(count);
          case 3: return this.mathMultiply(count);
          case 4: return this.mathDivide(count);
          case 5: return this.mathFactors(count);
          case 6: return this.mathFractions(count);
          case 7: return this.mathDecimals(count);
          case 8: return this.mathGeometry(count);
          case 9: return this.mathMeasure(count);
          case 10: return this.mathData(count);
          case 11: return this.mathPercent(count);
          case 12: return this.mathMoney(count);
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
