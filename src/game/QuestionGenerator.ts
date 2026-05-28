// Question Generator for ALL Subjects - 30 questions per world with plausible distractors

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

  // ============ MATH (12 worlds) - 30 questions each, dynamically generated ============
  static mathPlaceValue(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      const num = this.getRandomInt(10000, 999999), ns = num.toString(), pos = this.getRandomInt(0, ns.length - 1);
      const digit = parseInt(ns[pos]), places = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'lakhs'];
      const place = places[ns.length - 1 - pos], value = digit * 10 ** (ns.length - 1 - pos);
      if (i % 3 === 0) {
        const p1 = places[(ns.length - 1 - pos + 1) % places.length], p2 = places[(ns.length - 1 - pos + 2) % places.length], p3 = places[(ns.length - 1 - pos + 3) % places.length];
        q.push({ question: `In ${num.toLocaleString()}, the digit ${digit} is in which place?`, ...this.makeOptions(place, [() => p1, () => p2, () => p3]), explanation: `The digit ${digit} is in the ${place} place.` });
      } else if (i % 3 === 1) {
        q.push({ question: `What is the place value of ${digit} in ${num.toLocaleString()}?`, ...this.makeOptions(value.toString(), [() => (value * 10).toString(), () => (value / 10).toString(), () => (value + digit).toString()]), explanation: `The digit ${digit} is in the ${place} place, so its value is ${value}.` });
      } else {
        const exp = ns.split('').map((d, j) => `${d} x ${10 ** (ns.length - 1 - j)}`).join(' + ');
        q.push({ question: `What is the expanded form of ${num.toLocaleString()}?`, ...this.makeOptions(exp, [() => ns.split('').reverse().join(' + '), () => `${num} + 1`, () => ns.split('').join(' x ')]), explanation: `Expanded form: ${exp}` });
      }
    }
    return q;
  }

  static mathAddSubtract(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) { const a = this.getRandomInt(1000, 9999), b = this.getRandomInt(1000, 9999), s = a + b; q.push({ question: `${a.toLocaleString()} + ${b.toLocaleString()} = ?`, ...this.makeOptions(s.toLocaleString(), [() => (s + this.getRandomInt(10, 99)).toLocaleString(), () => (s - this.getRandomInt(10, 99)).toLocaleString(), () => (a + b + 1000).toLocaleString()]), explanation: `${a.toLocaleString()} + ${b.toLocaleString()} = ${s.toLocaleString()}` }); }
      else { const a = this.getRandomInt(1000, 9999), b = this.getRandomInt(100, a - 1), diff = a - b; q.push({ question: `${a.toLocaleString()} - ${b.toLocaleString()} = ?`, ...this.makeOptions(diff.toLocaleString(), [() => (diff + this.getRandomInt(10, 99)).toLocaleString(), () => (a + b).toLocaleString(), () => (diff - this.getRandomInt(10, 99)).toLocaleString()]), explanation: `${a.toLocaleString()} - ${b.toLocaleString()} = ${diff.toLocaleString()}` }); }
    }
    return q;
  }

  static mathMultiply(n = 30): MathQuestion[] {
    return Array.from({ length: n }, () => { const a = this.getRandomInt(100, 999), b = this.getRandomInt(2, 9), ans = a * b; return { question: `${a} x ${b} = ?`, ...this.makeOptions(ans.toString(), [() => (ans + b * this.getRandomInt(2, 5)).toString(), () => (ans - b * this.getRandomInt(2, 5)).toString(), () => ((a + this.getRandomInt(1, 3)) * b).toString()]), explanation: `${a} x ${b} = ${ans}` }; });
  }

  static mathDivide(n = 30): MathQuestion[] {
    return Array.from({ length: n }, () => { const d = this.getRandomInt(2, 9), q = this.getRandomInt(10, 99), r = this.getRandomInt(1, d - 1), div = d * q + r; return { question: `${div} ÷ ${d} = ?`, ...this.makeOptions(`${q} remainder ${r}`, [() => `${q + this.getRandomInt(1, 3)} remainder ${r}`, () => `${q} remainder ${(r + 1) % d || 1}`, () => `${Math.max(1, q - this.getRandomInt(1, 3))} remainder ${r}`]), explanation: `${div} ÷ ${d} = ${q} remainder ${r}` }; });
  }

  static mathFactors(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) {
        const num = this.getRandomInt(12, 100), facs = this.factors(num);
        const nonFacs: number[] = []; let c = num + 1;
        while (nonFacs.length < 10 && c <= num + 50) { if (!facs.includes(c)) nonFacs.push(c); c++; }
        const cf = facs[facs.length > 2 ? this.getRandomInt(1, facs.length - 2) : 0];
        q.push({ question: `Which of these is a factor of ${num}?`, ...this.makeOptions(cf.toString(), [() => nonFacs[this.getRandomInt(0, Math.min(9, nonFacs.length - 1))].toString(), () => nonFacs[this.getRandomInt(0, Math.min(9, nonFacs.length - 1))].toString(), () => nonFacs[this.getRandomInt(0, Math.min(9, nonFacs.length - 1))].toString()]), explanation: `Factors of ${num} are: ${facs.join(', ')}. So ${cf} is a factor.` });
      } else if (i % 3 === 1) {
        const num = this.getRandomInt(2, 12), mult = num * this.getRandomInt(3, 15);
        q.push({ question: `Which of these is a multiple of ${num}?`, ...this.makeOptions(mult.toString(), [() => (mult + this.getRandomInt(1, num - 1)).toString(), () => (mult + num + this.getRandomInt(1, num)).toString(), () => (mult - this.getRandomInt(1, num - 1)).toString()]), explanation: `${mult} = ${num} x ${mult / num}, so it is a multiple of ${num}.` });
      } else {
        const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47], nonPrimes = [4,6,8,9,10,12,14,15,16,18,20,21,22,24,25,26,27,28,30,32,33,34,35,36,38,39,40,42,44,45,46,48,49,50];
        const c = primes[this.getRandomInt(0, primes.length - 1)];
        q.push({ question: `Which of these is a prime number?`, ...this.makeOptions(c.toString(), [() => nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)].toString(), () => nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)].toString(), () => nonPrimes[this.getRandomInt(0, nonPrimes.length - 1)].toString()]), explanation: `${c} is prime because it has only two factors: 1 and ${c}.` });
      }
    }
    return q;
  }

  static mathFractions(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) {
        const d = this.getRandomInt(2, 12), an = this.getRandomInt(1, 5), bn = this.getRandomInt(1, 5), s = this.simplify(an + bn, d);
        q.push({ question: `${an}/${d} + ${bn}/${d} = ?`, ...this.makeOptions(`${s.n}/${s.d}`, [() => `${an + bn + this.getRandomInt(1, 3)}/${d}`, () => `${an + bn}/${d + this.getRandomInt(1, 3)}`, () => `${Math.max(1, an + bn - this.getRandomInt(1, 2))}/${d}`]), explanation: `${an}/${d} + ${bn}/${d} = ${an + bn}/${d}${s.n !== an + bn ? ` = ${s.n}/${s.d}` : ''}` });
      } else if (i % 3 === 1) {
        const d = this.getRandomInt(3, 12), an = this.getRandomInt(3, 10), bn = this.getRandomInt(1, an - 1), diff = this.simplify(an - bn, d);
        q.push({ question: `${an}/${d} - ${bn}/${d} = ?`, ...this.makeOptions(`${diff.n}/${diff.d}`, [() => `${an - bn + this.getRandomInt(1, 3)}/${d}`, () => `${an}/${d + this.getRandomInt(1, 3)}`, () => `${Math.max(1, an - bn - this.getRandomInt(1, 2))}/${d + this.getRandomInt(1, 3)}`]), explanation: `${an}/${d} - ${bn}/${d} = ${an - bn}/${d}${diff.n !== an - bn ? ` = ${diff.n}/${diff.d}` : ''}` });
      } else {
        const pairs = [[1,2,1,3],[2,3,1,2],[3,4,2,3],[2,5,3,5],[3,8,5,8],[4,5,3,5],[5,6,1,2],[7,8,3,8],[5,9,4,9],[3,7,4,7]];
        const p = pairs[this.getRandomInt(0, pairs.length - 1)]; const [an, ad, bn, bd] = p; const vA = an / ad, vB = bn / bd; const larger = vA > vB ? `${an}/${ad}` : `${bn}/${bd}`;
        q.push({ question: `Which is larger: ${an}/${ad} or ${bn}/${bd}?`, ...this.makeOptions(larger, [() => vA > vB ? `${bn}/${bd}` : `${an}/${ad}`, () => `${an + bn}/${ad + bd}`, () => `${Math.max(an, bn)}/${Math.min(ad, bd)}`]), explanation: `${an}/${ad} = ${(an/ad).toFixed(3)} and ${bn}/${bd} = ${(bn/bd).toFixed(3)}, so ${larger} is larger.` });
      }
    }
    return q;
  }

  static mathDecimals(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const a = this.getRandomInt(1, 99) / 10, b = this.getRandomInt(1, 99) / 10, s = Math.round((a + b) * 10) / 10; q.push({ question: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`, ...this.makeOptions(s.toFixed(1), [() => (s + this.getRandomInt(2, 9) / 10).toFixed(1), () => Math.max(0.1, s - this.getRandomInt(2, 9) / 10).toFixed(1), () => (s + this.getRandomInt(10, 30) / 10).toFixed(1)]), explanation: `${a.toFixed(1)} + ${b.toFixed(1)} = ${s.toFixed(1)}` }); }
      else if (i % 3 === 1) { const a = this.getRandomInt(20, 99) / 10, b = this.getRandomInt(5, Math.floor(a * 10) - 1) / 10, diff = Math.round((a - b) * 10) / 10; q.push({ question: `${a.toFixed(1)} - ${b.toFixed(1)} = ?`, ...this.makeOptions(diff.toFixed(1), [() => (diff + this.getRandomInt(2, 9) / 10).toFixed(1), () => Math.max(0.1, diff - this.getRandomInt(2, 9) / 10).toFixed(1), () => (a + b).toFixed(1)]), explanation: `${a.toFixed(1)} - ${b.toFixed(1)} = ${diff.toFixed(1)}` }); }
      else { const num = this.getRandomInt(1, 99), fr = this.simplify(num, 100); q.push({ question: `${(num / 100).toFixed(2)} as a fraction in simplest form = ?`, ...this.makeOptions(`${fr.n}/${fr.d}`, [() => `${num}/${this.getRandomInt(50, 90)}`, () => `${this.getRandomInt(1, num - 1 || 1)}/${fr.d + this.getRandomInt(1, 5)}`, () => `${num + this.getRandomInt(1, 10)}/${100 + this.getRandomInt(1, 20)}`]), explanation: `${(num / 100).toFixed(2)} = ${num}/100 = ${fr.n}/${fr.d} in simplest form.` }); }
    }
    return q;
  }

  static mathPercent(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) { const p = [10,20,25,50,75][this.getRandomInt(0, 4)], base = this.getRandomInt(20, 200), ans = Math.round((p / 100) * base); q.push({ question: `${p}% of ${base} = ?`, ...this.makeOptions(ans.toString(), [() => (ans + base).toString(), () => (ans * 2).toString(), () => Math.abs(base - ans).toString()]), explanation: `${p}% of ${base} = (${p}/100) x ${base} = ${ans}` }); }
      else { const fr = this.getRandomInt(1, 4), den = this.getRandomInt(2, 5), p = Math.round((fr / den) * 100); q.push({ question: `${fr}/${den} as a percentage = ?`, ...this.makeOptions(`${p}%`, [() => `${p + this.getRandomInt(11, 30)}%`, () => `${Math.max(5, p - this.getRandomInt(11, 30))}%`, () => `${Math.round((fr / (den + this.getRandomInt(2, 4))) * 100)}%`]), explanation: `${fr}/${den} = ${(fr/den).toFixed(3)} = ${p}%` }); }
    }
    return q;
  }

  static mathGeometry(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const angles = [{n:'acute',r:'less than 90 degrees'},{n:'right',r:'exactly 90 degrees'},{n:'obtuse',r:'between 90 and 180 degrees'},{n:'straight',r:'exactly 180 degrees'},{n:'reflex',r:'between 180 and 360 degrees'}], t = angles[this.getRandomInt(0, Math.min(4, angles.length - 1))]; q.push({ question: `An angle that is ${t.r} is called:`, ...this.makeOptions(t.n.charAt(0).toUpperCase() + t.n.slice(1), angles.filter(a => a.n !== t.n).slice(0, 3).map(a => () => a.n.charAt(0).toUpperCase() + a.n.slice(1))), explanation: `A ${t.n} angle measures ${t.r}.` }); }
      else if (i % 3 === 1) { const shapes = [{n:'Triangle',s:3,ang:180},{n:'Quadrilateral',s:4,ang:360},{n:'Pentagon',s:5,ang:540},{n:'Hexagon',s:6,ang:720}], t = shapes[this.getRandomInt(0, 3)], wrong = shapes.filter(s => s.n !== t.n); q.push({ question: `A shape with ${t.s} sides and interior angles adding to ${t.ang}° is a:`, ...this.makeOptions(t.n, wrong.map(s => () => s.n)), explanation: `A ${t.n} has ${t.s} sides. Sum of interior angles = (${t.s}-2) x 180 = ${t.ang}°` }); }
      else { const s3d = [{n:'Cube',f:6,e:12,v:8},{n:'Cuboid',f:6,e:12,v:8},{n:'Square pyramid',f:5,e:8,v:5},{n:'Triangular prism',f:5,e:9,v:6}], t = s3d[this.getRandomInt(0, 3)], wrong = s3d.filter(s => s.n !== t.n); q.push({ question: `Which 3D shape has ${t.f} faces, ${t.e} edges, and ${t.v} vertices?`, ...this.makeOptions(t.n, wrong.map(s => () => s.n)), explanation: `A ${t.n} has ${t.f} faces, ${t.e} edges, and ${t.v} vertices.` }); }
    }
    return q;
  }

  static mathMeasure(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 4 === 0) { const km = this.getRandomInt(1, 10), m = km * 1000; q.push({ question: `${km} km = ? metres`, ...this.makeOptions(`${m} m`, [() => `${km * 100} m`, () => `${km * 10} m`, () => `${km + 1000} m`]), explanation: `1 km = 1000 m, so ${km} km = ${m} m` }); }
      else if (i % 4 === 1) { const kg = this.getRandomInt(1, 10), g = kg * 1000; q.push({ question: `${kg} kg = ? grams`, ...this.makeOptions(`${g} g`, [() => `${kg * 100} g`, () => `${kg * 10} g`, () => `${kg + 1000} g`]), explanation: `1 kg = 1000 g, so ${kg} kg = ${g} g` }); }
      else if (i % 4 === 2) { const l = this.getRandomInt(5, 20), w = this.getRandomInt(3, l - 1), ans = 2 * (l + w); q.push({ question: `Perimeter of a rectangle with length ${l} m and width ${w} m:`, ...this.makeOptions(ans.toString(), [() => (ans + this.getRandomInt(3, 15)).toString(), () => (l * w).toString(), () => (ans - this.getRandomInt(3, 15)).toString()]), explanation: `Perimeter = 2 x (${l} + ${w}) = ${ans} m` }); }
      else { const l = this.getRandomInt(4, 15), w = this.getRandomInt(3, l), ans = l * w; q.push({ question: `Area of a rectangle with length ${l} m and width ${w} m:`, ...this.makeOptions(ans.toString(), [() => (2 * (l + w)).toString(), () => (ans + this.getRandomInt(3, 15)).toString(), () => (l + w).toString()]), explanation: `Area = ${l} x ${w} = ${ans} sq m` }); }
    }
    return q;
  }

  static mathData(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const data: Record<string, number> = {}; const fruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes']; let start = this.getRandomInt(10, 25); fruits.forEach((f, j) => data[f] = start + j * this.getRandomInt(2, 5)); const vals = Object.values(data).sort(() => Math.random() - 0.5); fruits.forEach((f, j) => data[f] = vals[j]); const most = Object.entries(data).sort((a, b) => b[1] - a[1])[0]; q.push({ question: `Survey results: ${Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ')}. Which is most popular?`, ...this.makeOptions(most[0], fruits.filter(f => f !== most[0]).slice(0, 3).map(f => () => f)), explanation: `${most[0]} has ${most[1]} votes, the highest.` }); }
      else if (i % 3 === 1) { const data = [this.getRandomInt(12, 25), this.getRandomInt(8, 20), this.getRandomInt(15, 30), this.getRandomInt(10, 22)]; const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length); q.push({ question: `Find the average of: ${data.join(', ')}`, ...this.makeOptions(avg.toString(), [() => Math.max(...data).toString(), () => Math.min(...data).toString(), () => (data.reduce((a, b) => a + b, 0)).toString()]), explanation: `Average = (${data.join(' + ')}) / ${data.length} = ${data.reduce((a, b) => a + b, 0)} / ${data.length} = ${avg}` }); }
      else { const terms = ['certain', 'likely', 'unlikely', 'impossible'], scenarios = [{q:'The sun will rise tomorrow',a:'certain'},{q:'Rolling a 7 on a standard die',a:'impossible'},{q:'It will rain on a cloudy day',a:'likely'},{q:'Winning a lottery jackpot',a:'unlikely'},{q:'A square has exactly 4 sides',a:'certain'},{q:'Being born on February 30',a:'impossible'}], s = scenarios[this.getRandomInt(0, scenarios.length - 1)], wrong = terms.filter(t => t !== s.a); q.push({ question: `"${s.q}" is:`, ...this.makeOptions(s.a.charAt(0).toUpperCase() + s.a.slice(1), wrong.map(t => () => t.charAt(0).toUpperCase() + t.slice(1))), explanation: `"${s.q}" is ${s.a}.` }); }
    }
    return q;
  }

  static mathMoney(n = 30): MathQuestion[] {
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const p = this.getRandomInt(15, 500), r = this.getRandomInt(5, p - 1); q.push({ question: `An item costs ₹${p}. You pay ₹${p + r}. Your change is:`, ...this.makeOptions(`₹${r}`, [() => `₹${r + this.getRandomInt(1, 10)}`, () => `₹${Math.max(1, r - this.getRandomInt(1, 5))}`, () => `₹${p}`]), explanation: `Change = ₹${p + r} - ₹${p} = ₹${r}` }); }
      else if (i % 3 === 1) { const a = this.getRandomInt(10, 100), b = this.getRandomInt(10, 100), c = this.getRandomInt(10, 100), s = a + b + c; q.push({ question: `Items cost ₹${a}, ₹${b}, and ₹${c}. Total cost:`, ...this.makeOptions(`₹${s}`, [() => `₹${s + this.getRandomInt(1, 10)}`, () => `₹${s - this.getRandomInt(1, 5)}`, () => `₹${a + b}`]), explanation: `Total = ₹${a} + ₹${b} + ₹${c} = ₹${s}` }); }
      else { const r = this.getRandomInt(2, 15), qty = this.getRandomInt(3, 20), tot = r * qty; q.push({ question: `1 item costs ₹${r}. What is the cost of ${qty} items?`, ...this.makeOptions(`₹${tot}`, [() => `₹${tot + this.getRandomInt(1, 10)}`, () => `₹${r + qty}`, () => `₹${Math.max(1, tot - this.getRandomInt(1, 5))}`]), explanation: `Cost = ₹${r} x ${qty} = ₹${tot}` }); }
    }
    return q;
  }

  // ============ ENGLISH GRAMMAR (8 worlds) - 30 questions each ============
  static engGrammar(worldId: number, n = 30): MathQuestion[] {
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

  static engNouns(n = 30): MathQuestion[] {
    const nouns = [
      {w:'dog',t:'common',e:'"Dog" names a type of animal, not a specific one.'},
      {w:'India',t:'proper',e:'"India" names a specific country and starts with a capital letter.'},
      {w:'team',t:'collective',e:'"Team" refers to a group of people acting as one unit.'},
      {w:'honesty',t:'abstract',e:'"Honesty" is an idea or quality we cannot touch.'},
      {w:'happiness',t:'abstract',e:'"Happiness" is a feeling, not a physical object.'},
      {w:'Ravi',t:'proper',e:'"Ravi" is a specific person\'s name.'},
      {w:'flock',t:'collective',e:'"Flock" is a group noun for birds.'},
      {w:'courage',t:'abstract',e:'"Courage" is a quality, not something you can hold.'},
      {w:'cat',t:'common',e:'"Cat" is a general name for that type of animal.'},
      {w:'Monday',t:'proper',e:'"Monday" names a specific day of the week.'},
      {w:'herd',t:'collective',e:'"Herd" is a group noun for cattle or elephants.'},
      {w:'bravery',t:'abstract',e:'"Bravery" is an idea we feel, not see.'},
      {w:'river',t:'common',e:'"River" is a general name for flowing water bodies.'},
      {w:'Ganges',t:'proper',e:'"Ganges" is the name of a specific river.'},
      {w:'bunch',t:'collective',e:'"Bunch" is a group noun for things tied together, like grapes or flowers.'},
    ];
    const allTypes = ['Common', 'Proper', 'Collective', 'Abstract'];
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      const item = nouns[i % nouns.length];
      const wrong = allTypes.filter(t => t.toLowerCase() !== item.t);
      q.push({ question: `"${item.w}" is what type of noun?`, ...this.makeOptions(item.t.charAt(0).toUpperCase() + item.t.slice(1), wrong.slice(0, 3).map(w => () => w)), explanation: item.e });
    }
    return q;
  }

  static engVerbs(n = 30): MathQuestion[] {
    const tenses = [
      {q:'She ___ to school every day.', a:'goes', w1:'go', w2:'going', w3:'gone', e:'With "she" (he/she/it), we add -es to "go" for simple present tense.'},
      {q:'They ___ football yesterday evening.', a:'played', w1:'plays', w2:'playing', w3:'play', e:'"Yesterday" tells us the action is in the past, so we use "played".'},
      {q:'We will ___ the match tomorrow.', a:'win', w1:'won', w2:'wins', w3:'winning', e:'"Will" is always followed by the base form of the verb.'},
      {q:'The baby ___ crying all night.', a:'was', w1:'were', w2:'is', w3:'are', e:'"Baby" is singular, so we use "was" for past continuous tense.'},
      {q:'My friends ___ coming to the party.', a:'are', w1:'is', w2:'was', w3:'am', e:'"Friends" is plural, so we use "are".'},
      {q:'I ___ my homework right now.', a:'am doing', w1:'do', w2:'does', w3:'was doing', e:'"Right now" means the action is happening at this moment - present continuous.'},
      {q:'He ___ never been to Delhi.', a:'has', w1:'have', w2:'had', w3:'is', e:'"He" is singular third person, so we use "has" for present perfect tense.'},
      {q:'The dogs ___ barking loudly.', a:'are', w1:'is', w2:'was', w3:'were', e:'"Dogs" is plural, and the sentence describes a present action.'},
      {q:'By next year, she ___ graduated.', a:'will have', w1:'will', w2:'has', w3:'would', e:'"By next year" indicates a future completion - future perfect tense uses "will have".'},
      {q:'If I ___ rich, I would buy a house.', a:'were', w1:'was', w2:'am', w3:'be', e:'In unreal conditional sentences (type 2), we always use "were" for all subjects.'},
    ];
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      const t = tenses[i % tenses.length];
      q.push({ question: t.q, ...this.makeOptions(t.a, [() => t.w1, () => t.w2, () => t.w3]), explanation: t.e });
    }
    return q;
  }

  static engAdjectives(n = 30): MathQuestion[] {
    const items = [
      {w:'beautiful',t:'adjective',e:'"Beautiful" describes a noun (a quality of appearance).'},
      {w:'quickly',t:'adverb',e:'"Quickly" describes how an action is done (a verb).'},
      {w:'brave',t:'adjective',e:'"Brave" describes someone\'s character (a noun).'},
      {w:'happily',t:'adverb',e:'"Happily" tells us the manner of an action.'},
      {w:'tall',t:'adjective',e:'"Tall" describes the height of a noun.'},
      {w:'softly',t:'adverb',e:'"Softly" describes how something is done.'},
      {w:'intelligent',t:'adjective',e:'"Intelligent" describes a person\'s mental ability.'},
      {w:'carefully',t:'adverb',e:'"Carefully" describes the manner of doing something.'},
      {w:'bright',t:'adjective',e:'"Bright" describes the quality of light or colour.'},
      {w:'loudly',t:'adverb',e:'"Loudly" describes the volume of an action.'},
    ];
    const comparatives = [
      {adj:'big',comp:'bigger',sup:'biggest'},
      {adj:'small',comp:'smaller',sup:'smallest'},
      {adj:'fast',comp:'faster',sup:'fastest'},
      {adj:'slow',comp:'slower',sup:'slowest'},
      {adj:'hot',comp:'hotter',sup:'hottest'},
      {adj:'cold',comp:'colder',sup:'coldest'},
      {adj:'tall',comp:'taller',sup:'tallest'},
      {adj:'short',comp:'shorter',sup:'shortest'},
      {adj:'happy',comp:'happier',sup:'happiest'},
      {adj:'easy',comp:'easier',sup:'easiest'},
      {adj:'brave',comp:'braver',sup:'bravest'},
      {adj:'large',comp:'larger',sup:'largest'},
    ];
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) {
        const item = items[i % items.length];
        q.push({ question: `"${item.w}" is an:`, ...this.makeOptions(item.t.charAt(0).toUpperCase() + item.t.slice(1), ['Noun', 'Verb', item.t === 'adjective' ? 'Adverb' : 'Adjective'].map(w => () => w)), explanation: item.e });
      } else if (i % 3 === 1) {
        const c = comparatives[i % comparatives.length];
        q.push({ question: `What is the comparative form of "${c.adj}"?`, ...this.makeOptions(c.comp, [() => c.sup, () => `more ${c.adj}`, () => c.adj + 'ly']), explanation: `"${c.adj}" → "${c.comp}" (comparing two things) → "${c.sup}" (comparing three or more).` });
      } else {
        const c = comparatives[i % comparatives.length];
        q.push({ question: `What is the superlative form of "${c.adj}"?`, ...this.makeOptions(c.sup, [() => c.comp, () => `most ${c.adj}`, () => c.adj + 'est']), explanation: `"${c.adj}" → "${c.comp}" → "${c.sup}" is the superlative form.` });
      }
    }
    return q;
  }

  static engPronouns(n = 30): MathQuestion[] {
    const questions = [
      {q:'___ is my best friend. (He/Him/His)',a:'He',w:['Him','His','Her'],e:'"He" is a subject pronoun used when someone performs an action.'},
      {q:'The book is ___ . (my/mine/me)',a:'mine',w:['my','me','mines'],e:'"Mine" is a possessive pronoun that stands alone without a noun.'},
      {q:'___ book is on the table? (Which/What/Who)',a:'Which',w:['Who','What','Whose'],e:'"Which" is used when choosing from a limited set of options.'},
      {q:'I saw ___ at the park. (they/them/their)',a:'them',w:['they','their','theirs'],e:'"Them" is an object pronoun used after a verb.'},
      {q:'___ apple a day keeps the doctor away. (A/An/The)',a:'An',w:['A','The','No article'],e:'Use "An" before words starting with a vowel sound.'},
      {q:'She did the work ___ . (herself/himself/ourselves)',a:'herself',w:['himself','ourselves','themselves'],e:'Reflexive pronoun must match the subject "She" (female, singular).'},
      {q:'___ did you meet at the store? (Whom/Who/Which)',a:'Whom',w:['Who','Which','What'],e:'"Whom" is used for the object of a verb or preposition.'},
      {q:'The children cleaned ___ room. (their/there/they\'re)',a:'their',w:['there',"they're",'them'],e:'"Their" is the possessive form showing the room belongs to the children.'},
      {q:'___ is knocking at the door. (Someone/Some/Somebody)',a:'Someone',w:['Some','Somebody','Anyone'],e:'"Someone" refers to an unspecified person.'},
      {q:'We enjoyed ___ at the party. (ourselves/ourself/themselves)',a:'ourselves',w:['ourself','themselves','himself'],e:'The reflexive pronoun must match "We" (first person plural).'},
    ];
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      const item = questions[i % questions.length];
      q.push({ question: item.q, ...this.makeOptions(item.a, item.w.map(w => () => w)), explanation: item.e });
    }
    return q;
  }

  static engSentences(n = 30): MathQuestion[] {
    const questions = [
      {q:'"What a beautiful day!" is what type of sentence?',a:'Exclamatory',w:['Declarative','Interrogative','Imperative'],e:'Exclamatory sentences express strong emotion and end with "!"'},
      {q:'"Close the door." is what type of sentence?',a:'Imperative',w:['Declarative','Interrogative','Exclamatory'],e:'Imperative sentences give commands or make requests.'},
      {q:'"Where is the library?" is what type of sentence?',a:'Interrogative',w:['Declarative','Imperative','Exclamatory'],e:'Interrogative sentences ask questions and end with "?"'},
      {q:'"The cat sat on the mat." is what type of sentence?',a:'Declarative',w:['Interrogative','Imperative','Exclamatory'],e:'Declarative sentences make statements or give information.'},
      {q:'Which punctuation ends a direct question?',a:'Question mark (?)',w:['Full stop (.)','Exclamation mark (!)','Comma (,)'],e:'Questions always end with a question mark (?).'},
      {q:'"Please pass the salt." is what type of sentence?',a:'Imperative',w:['Declarative','Interrogative','Exclamatory'],e:'Although polite, this is a request/command - imperative.'},
      {q:'"How amazing that performance was!" is:',a:'Exclamatory',w:['Declarative','Interrogative','Imperative'],e:'It expresses strong emotion and ends with "!" - exclamatory.'},
      {q:'"The Earth revolves around the Sun." is:',a:'Declarative',w:['Interrogative','Imperative','Exclamatory'],e:'It states a fact - declarative sentence.'},
      {q:'"Did you finish your homework?" is:',a:'Interrogative',w:['Declarative','Imperative','Exclamatory'],e:'It asks for information - interrogative sentence.'},
      {q:'"Stop!" is:',a:'Imperative',w:['Declarative','Interrogative','Exclamatory'],e:'It is a command to stop - imperative sentence.'},
    ];
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      const item = questions[i % questions.length];
      q.push({ question: item.q, ...this.makeOptions(item.a, item.w.map(w => () => w)), explanation: item.e });
    }
    return q;
  }

  static engPrepositions(n = 30): MathQuestion[] {
    const questions = [
      {q:'The cat is ___ the table. (on/in/under)',a:'on',w:['in','under','beside'],e:'"On" means touching a surface from above.'},
      {q:'She walked ___ the park to reach home.',a:'through',w:['across','beside','along'],e:'"Through" means going from one side to the other.'},
      {q:'The ball is ___ the box.',a:'in',w:['on','at','beside'],e:'"In" means inside something.'},
      {q:'He sat ___ his friend during class.',a:'beside',w:['between','through','under'],e:'"Beside" means next to someone or something.'},
      {q:'"And", "But", and "Or" are:',a:'Conjunctions',w:['Prepositions','Adverbs','Articles'],e:'Conjunctions join words, phrases, or clauses together.'},
      {q:'The bird flew ___ the rainbow.',a:'over',w:['under','through','between'],e:'"Over" means above something at a higher level.'},
      {q:'We have class ___ Monday mornings.',a:'on',w:['in','at','during'],e:'Days of the week always use "on".'},
      {q:'She arrived ___ 8 o\'clock.',a:'at',w:['in','on','during'],e:'Specific times use the preposition "at".'},
      {q:'The picture hangs ___ the wall.',a:'on',w:['in','at','above'],e:'"On" is used for surfaces like walls.'},
      {q:'Put the book ___ the shelf.',a:'on',w:['in','at','under'],e:'"On" means resting on a surface.'},
    ];
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      const item = questions[i % questions.length];
      q.push({ question: item.q, ...this.makeOptions(item.a, item.w.map(w => () => w)), explanation: item.e });
    }
    return q;
  }

  static engVoice(n = 30): MathQuestion[] {
    const questions = [
      {q:'Convert to passive: "Ram eats an apple."',a:'An apple is eaten by Ram.',w1:'An apple was eaten by Ram.',w2:'Ram is eating an apple.',w3:'An apple eats Ram.',e:'Object becomes subject + is + past participle + by + subject.'},
      {q:'Convert to passive: "She writes a letter."',a:'A letter is written by her.',w1:'A letter was written by her.',w2:'She is writing a letter.',w3:'A letter writes her.',e:'Object becomes subject + is + past participle + by + subject.'},
      {q:'"The cake was baked by mother." is:',a:'Passive voice',w1:'Active voice',w2:'Direct speech',w3:'Indirect speech',e:'In passive voice, the object receives the action (was baked).'},
      {q:'"The dog bit the man." is:',a:'Active voice',w1:'Passive voice',w2:'Interrogative',w3:'Imperative',e:'In active voice, the subject performs the action (dog bit).'},
      {q:'Convert to active: "The ball was kicked by him."',a:'He kicked the ball.',w1:'The ball kicked him.',w2:'He was kicking the ball.',w3:'The ball is kicked by him.',e:'Remove "was...by", make the doer the subject of the sentence.'},
      {q:'"The letter has been posted by Ravi." is:',a:'Passive voice (present perfect)',w1:'Active voice',w2:'Past tense',w3:'Future tense',e:'"Has been posted" is the passive form of present perfect tense.'},
      {q:'Convert to passive: "They are building a house."',a:'A house is being built by them.',w1:'A house was built by them.',w2:'They are being built a house.',w3:'A house has been built by them.',e:'Present continuous passive: is/am/are + being + past participle.'},
      {q:'"Someone stole my bicycle." Convert to passive:',a:'My bicycle was stolen by someone.',w1:'My bicycle is stolen.',w2:'Someone was stolen my bicycle.',w3:'My bicycle has been stolen by me.',e:'Past simple passive: was/were + past participle.'},
      {q:'"English is spoken all over the world." is:',a:'Passive voice',w1:'Active voice',w2:'Direct speech',w3:'Imperative sentence',e:'"Is spoken" is passive - the subject receives the action.'},
      {q:'Convert to active: "The work was done by the students."',a:'The students did the work.',w1:'The work did the students.',w2:'The students were doing the work.',w3:'The work is done by the students.',e:'"Was done by" becomes the active verb "did" with the students as subject.'},
    ];
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      const item = questions[i % questions.length];
      q.push({ question: item.q, ...this.makeOptions(item.a, [() => item.w1, () => item.w2, () => item.w3]), explanation: item.e });
    }
    return q;
  }

  static engWords(n = 30): MathQuestion[] {
    const syns = [
      {w:'happy',s:'joyful',e:'"Joyful" and "happy" both describe a pleasant, cheerful feeling.'},
      {w:'big',s:'large',e:'"Large" is a direct synonym for "big" - both describe great size.'},
      {w:'fast',s:'quick',e:'"Quick" and "fast" both describe rapid speed.'},
      {w:'sad',s:'unhappy',e:'"Unhappy" directly means the same as "sad".'},
      {w:'smart',s:'clever',e:'"Clever" and "smart" both describe being mentally sharp.'},
      {w:'angry',s:'furious',e:'"Furious" is a stronger synonym for "angry" - both describe strong displeasure.'},
      {w:'tired',s:'exhausted',e:'"Exhausted" means very tired - a stronger synonym.'},
      {w:'beautiful',s:'gorgeous',e:'"Gorgeous" means extremely beautiful - a stronger synonym.'},
      {w:'begin',s:'start',e:'"Start" and "begin" both mean to commence something.'},
      {w:'end',s:'finish',e:'"Finish" and "end" both mean to bring something to a close.'},
    ];
    const ants = [
      {w:'hot',a:'cold',e:'"Cold" is the direct opposite of "hot" - different temperatures.'},
      {w:'tall',a:'short',e:'"Short" is the opposite of "tall" - describing height.'},
      {w:'happy',a:'sad',e:'"Sad" is the direct emotional opposite of "happy".'},
      {w:'fast',a:'slow',e:'"Slow" is the opposite of "fast" - describing speed.'},
      {w:'brave',a:'cowardly',e:'"Cowardly" means lacking courage - the opposite of "brave".'},
      {w:'rich',a:'poor',e:'"Poor" is the opposite of "rich" - describing wealth.'},
      {w:'strong',a:'weak',e:'"Weak" is the opposite of "strong" - describing physical power.'},
      {w:'bright',a:'dim',e:'"Dim" means not bright - the opposite in terms of light.'},
      {w:'love',a:'hate',e:'"Hate" is the emotional opposite of "love".'},
      {w:'clean',a:'dirty',e:'"Dirty" is the opposite of "clean" - describing cleanliness.'},
    ];
    const q: MathQuestion[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) { const s = syns[i % syns.length]; q.push({ question: `Synonym of "${s.w}":`, ...this.makeOptions(s.s, [() => ants.find(a => a.w === s.w)?.a || 'small', () => s.w + 'ness', () => 'un' + s.w]), explanation: s.e }); }
      else if (i % 3 === 1) { const a = ants[i % ants.length]; q.push({ question: `Opposite of "${a.w}":`, ...this.makeOptions(a.a, [() => syns.find(s => s.w === a.w)?.s || 'large', () => a.w + 'ness', () => 'not ' + a.w]), explanation: a.e }); }
      else { const prefix = ['un','dis','re','mis','pre','over','under','out'][this.getRandomInt(0, 7)], root = ['happy','appear','write','understand','view','take','pay','grow'][this.getRandomInt(0, 7)]; const meanings: Record<string,string> = {un:'not',dis:'not',re:'again',mis:'wrongly',pre:'before',over:'too much',under:'not enough',out:'more than'}; q.push({ question: `What does "${prefix}${root}" mean?`, ...this.makeOptions(`${meanings[prefix] || 'not'} + ${root}`, [() => root + ' less', () => root + ' completely', () => 'before ' + root]), explanation: `"${prefix}" means "${meanings[prefix] || 'not'}". So "${prefix}${root}" means "${meanings[prefix] || 'not'} ${root}".` }); }
    }
    return q;
  }

  // ============ SCIENCE - Splendid Science Level 5 (8 worlds × 30 questions) ============
  static science(worldId: number, n = 30): MathQuestion[] {
    const questions: any[][] = [
      // World 1: Unit 1A - Living Things & Vertebrates
      [
        {q:"What are the seven life processes?",a:"Movement, respiration, sensitivity, growth, reproduction, excretion, nutrition",w:["Sleeping, eating, drinking, playing, running, talking, reading","Flying, swimming, crawling, walking, hopping, climbing, rolling","Breathing, seeing, hearing, touching, tasting, smelling, feeling"],e:"MRS GREN: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition."},
        {q:"Why do living things need food?",a:"To get energy for life processes",w:["To become heavier","To store water in the body","To change their colour"],e:"Food provides energy for movement, growth, and all life processes."},
        {q:"How do fish breathe underwater?",a:"Through gills",w:["Through their mouth by gulping air","Through their skin like amphibians","Through tiny holes in their fins"],e:"Fish have gills that extract dissolved oxygen from water."},
        {q:"What is the backbone made of?",a:"Small bones called vertebrae",w:["One continuous long bone","Only cartilage, no bones","Muscles connected by tendons"],e:"The backbone (spine) is made of 33 small bones called vertebrae."},
        {q:"Which vertebrate group has feathers?",a:"Birds",w:["Bats, which are flying mammals","Flying reptiles like pterosaurs","Flying insects like butterflies"],e:"Birds are the only vertebrates with feathers and beaks."},
        {q:"Which mammals feed milk to their young?",a:"All mammals",w:["Only humans and cows","Only domestic animals","Only animals that live on land"],e:"All female mammals produce milk to feed their babies."},
        {q:"Which vertebrates have dry, scaly skin?",a:"Reptiles",w:["Amphibians like frogs","Fish like salmon","Mammals like elephants"],e:"Reptiles (snakes, lizards, crocodiles) have dry, scaly skin."},
        {q:"Which vertebrates live both in water and on land?",a:"Amphibians",w:["Dolphins, which are aquatic mammals","Penguins, which are birds","Seals, which are marine mammals"],e:"Amphibians like frogs and salamanders begin life in water and later live on land."},
        {q:"Which vertebrate group breathes through gills?",a:"Fish",w:["Whales, which are mammals","Turtles, which are reptiles","Ducks, which are birds"],e:"Fish are the only vertebrates that use gills to breathe underwater."},
        {q:"How do mammals keep warm?",a:"Hair or fur on their bodies",w:["By basking in the sun like reptiles","By wearing layers of skin","By staying close to volcanoes"],e:"Mammals are warm-blooded and have hair or fur to keep warm."},
        {q:"What does 'warm-blooded' mean?",a:"Body temperature stays constant",w:["Body temperature changes with the environment","Blood is always hot to touch","They live in warm places only"],e:"Warm-blooded animals maintain a constant body temperature regardless of the environment."},
        {q:"Which vertebrate lays soft, leathery eggs?",a:"Reptiles",w:["Birds, which lay hard-shelled eggs","Mammals, which mostly give live birth","Fish, which lay eggs in water"],e:"Reptiles like snakes and turtles lay soft, leathery eggs."},
        {q:"What is the largest mammal?",a:"Blue whale",w:["African elephant","Giraffe","Great white shark"],e:"The blue whale is the largest animal ever known to have lived."},
        {q:"Which bird cannot fly but swims?",a:"Penguin",w:["Ostrich, which runs fast","Eagle, which soars high","Sparrow, which is small"],e:"Penguins are flightless birds that are excellent swimmers."},
        {q:"What do amphibians use to breathe on land?",a:"Lungs and moist skin",w:["Gills like fish","Only lungs like mammals","Feathers like birds"],e:"Adult amphibians use lungs and their moist skin to breathe on land."},
        {q:"Which mammal lays eggs?",a:"Platypus and echidna",w:["Kangaroo and koala","Lion and tiger","Dolphin and whale"],e:"Only the platypus and echidna (monotremes) are egg-laying mammals."},
        {q:"What covers a fish's body?",a:"Scales",w:["Fur like mammals","Feathers like birds","Dry skin like reptiles"],e:"Fish bodies are covered with scales that protect them."},
        {q:"How do birds keep warm?",a:"Feathers trap air for insulation",w:["They hibernate in winter","They have thick fur under feathers","They only live in hot countries"],e:"Birds' feathers trap air close to their bodies for insulation."},
        {q:"What is a carnivore?",a:"An animal that eats meat",w:["An animal that eats only plants","An animal that eats everything","An animal that eats only insects"],e:"Carnivores (like lions and tigers) eat meat from other animals."},
        {q:"What is a herbivore?",a:"An animal that eats only plants",w:["An animal that eats meat","An animal that eats both plants and meat","An animal that eats only fish"],e:"Herbivores (like cows and deer) eat only plant material."},
        {q:"What is an omnivore?",a:"An animal that eats both plants and meat",w:["An animal that eats only insects","An animal that eats only fruit","An animal that eats only grass"],e:"Omnivores (like humans, bears, and crows) eat both plants and animals."},
        {q:"Which sense organ do snakes use to smell?",a:"Tongue",w:["Nose like mammals","Skin like amphibians","Ears like humans"],e:"Snakes flick their tongue to pick up scent particles from the air."},
        {q:"How do bats find their way in the dark?",a:"Using echolocation",w:["Using their excellent night vision","Using their sense of smell","Using magnetic fields"],e:"Bats emit sound waves that bounce off objects and return to them."},
        {q:"What is the habitat of a polar bear?",a:"Arctic regions",w:["Tropical rainforests","African savannas","Australian deserts"],e:"Polar bears live in the cold Arctic regions near the North Pole."},
        {q:"Which animal has a pouch for carrying babies?",a:"Kangaroo",w:["Lioness","Elephant","Giraffe"],e:"Kangaroos (marsupials) carry their babies in a pouch called a marsupium."},
        {q:"What do all vertebrates have?",a:"A backbone",w:["Wings for flying","Gills for breathing","Six legs"],e:"All vertebrates (animals with a backbone) have an internal skeleton."},
        {q:"How many chambers does a human heart have?",a:"Four",w:["Two","Three","Five"],e:"The human heart has 4 chambers: 2 atria and 2 ventricles."},
        {q:"What is the function of the lungs?",a:"To take in oxygen and remove carbon dioxide",w:["To pump blood around the body","To digest food","To filter waste from blood"],e:"Lungs are the breathing organs that exchange oxygen and carbon dioxide."},
        {q:"Which animal is known as the 'ship of the desert'?",a:"Camel",w:["Horse","Elephant","Donkey"],e:"Camels are called the 'ship of the desert' for their ability to travel in deserts."},
        {q:"What type of teeth do carnivores have?",a:"Sharp pointed teeth",w:["Flat grinding teeth","No teeth at all","Beaks like birds"],e:"Carnivores have sharp, pointed teeth for tearing meat."},
      ],
      // World 2: Unit 1B - Invertebrates & Classification
      [
        {q:"What is an invertebrate?",a:"An animal without a backbone",w:["An animal with a hollow backbone","An animal with an external shell only","A plant that looks like an animal"],e:"Invertebrates (like insects, worms, jellyfish) lack a backbone."},
        {q:"Which invertebrate has a soft body and a hard shell?",a:"Mollusc (snail/clam)",w:["Insect with hard exoskeleton","Spider with eight legs","Earthworm with segments"],e:"Molluscs like snails, slugs, and clams have soft bodies, often with shells."},
        {q:"Which invertebrate has eight legs?",a:"Spider (arachnid)",w:["Insect like a beetle","Crustacean like a crab","Centipede with many legs"],e:"Arachnids (spiders, scorpions) have eight legs and two body parts."},
        {q:"How many legs does an insect have?",a:"Six",w:["Eight like a spider","Ten like a crab","Hundreds like a centipede"],e:"All insects have exactly six legs and three body parts (head, thorax, abdomen)."},
        {q:"Which invertebrate has a hard shell and lives in water?",a:"Crustacean (crab/lobster)",w:["Butterfly with wings","Earthworm in soil","Spider on a web"],e:"Crustaceans like crabs, lobsters, and shrimp have hard shells and live in water."},
        {q:"What is a classification key used for?",a:"To identify and sort living things",w:["To count how many animals exist","To measure the weight of plants","To colour-code different species"],e:"A dichotomous key uses yes/no questions to identify unknown organisms."},
        {q:"How do earthworms help soil?",a:"By making tunnels that aerate it",w:["By eating plant roots","By adding chemicals to soil","By making the soil hard"],e:"Earthworms create tunnels that allow air and water to reach plant roots."},
        {q:"Which invertebrate has stinging tentacles?",a:"Jellyfish (cnidarian)",w:["Butterfly with colourful wings","Spider with a web","Snail with a shell"],e:"Cnidarians (jellyfish, sea anemones) have stinging cells in their tentacles."},
        {q:"What is an exoskeleton?",a:"A hard outer covering on the body",w:["Bones inside the body like humans","Soft skin without any covering","Hair covering the body like fur"],e:"Insects and crustaceans have exoskeletons - hard outer coverings for protection."},
        {q:"How do centipedes move?",a:"With many legs (one pair per segment)",w:["By crawling like snakes","By jumping like fleas","By swimming like fish"],e:"Centipedes have one pair of legs per body segment, giving them many legs."},
        {q:"What do bees collect from flowers?",a:"Nectar and pollen",w:["Water and minerals","Seeds and leaves","Roots and bark"],e:"Bees collect nectar (for honey) and pollen (for protein) from flowers."},
        {q:"Which invertebrate can regenerate lost body parts?",a:"Starfish",w:["Butterfly","Spider","Mosquito"],e:"Starfish can regrow lost arms, and some can regenerate a whole body from one arm."},
        {q:"What is the largest group of invertebrates?",a:"Insects",w:["Spiders","Worms","Jellyfish"],e:"Insects are the largest group of animals on Earth, with over a million species."},
        {q:"How do spiders catch their prey?",a:"Using webs made of silk",w:["By chasing them on the ground","By digging traps in soil","By swimming after them"],e:"Spiders produce silk from spinnerets to build webs that trap flying insects."},
        {q:"What is metamorphosis?",a:"A complete change in body form",w:["Growing bigger over time","Changing colour to match surroundings","Moving to a new habitat"],e:"Metamorphosis is the transformation from larva to adult (like caterpillar to butterfly)."},
        {q:"Which invertebrate has no legs at all?",a:"Earthworm",w:["Centipede","Spider","Crab"],e:"Earthworms have no legs - they move by contracting and relaxing their muscles."},
        {q:"What do silkworms produce?",a:"Silk thread",w:["Cotton fibres","Wool fibres","Nylon thread"],e:"Silkworms (larvae of silk moths) produce silk from their salivary glands."},
        {q:"Which invertebrate has compound eyes?",a:"Insects (like flies and bees)",w:["Spiders","Earthworms","Jellyfish"],e:"Insects have compound eyes made of many tiny lenses for a wide field of view."},
        {q:"What is the body of a snail called?",a:"Foot",w:["Tail","Belly","Arm"],e:"A snail moves on a large, flat muscular organ called a foot."},
        {q:"How many body parts does an insect have?",a:"Three (head, thorax, abdomen)",w:["Two like a spider","One like a worm","Four like a crab"],e:"All insects have three body parts: head, thorax (middle), and abdomen (rear)."},
        {q:"What do butterflies use to taste?",a:"Their feet",w:["Their tongue","Their antennae","Their wings"],e:"Butterflies have taste receptors on their feet to test if plants are good for laying eggs."},
        {q:"Which invertebrate lives in a colony with a queen?",a:"Ants, bees, and termites",w:["Spiders","Scorpions","Centipedes"],e:"Social insects like ants, bees, and termites live in organized colonies with a queen."},
        {q:"What is the larva of a butterfly called?",a:"Caterpillar",w:["Maggot","Grub","Tadpole"],e:"The larval stage of a butterfly is called a caterpillar."},
        {q:"How do octopuses escape from predators?",a:"By releasing ink and changing colour",w:["By flying away","By digging into sand","By growing a hard shell"],e:"Octopuses release a cloud of dark ink and can change skin colour to camouflage."},
        {q:"Which invertebrate has the most legs?",a:"Millipede",w:["Centipede","Spider","Crab"],e:"Millipedes can have up to 750 legs - the most of any animal on Earth."},
        {q:"What is the shell of a crab made of?",a:"Chitin (a tough protein)",w:["Calcium like human bones","Silica like glass","Cellulose like plants"],e:"Crustacean shells are made of chitin, a tough, flexible polysaccharide."},
        {q:"How do mosquitoes find humans?",a:"By sensing carbon dioxide and body heat",w:["By seeing colours from far away","By hearing human voices","By smelling flowers on clothes"],e:"Mosquitoes sense the CO2 we breathe out and the heat from our bodies."},
        {q:"What is a group of jellyfish called?",a:"A smack",w:["A swarm","A school","A flock"],e:"A group of jellyfish is called a 'smack' or sometimes a 'bloom'."},
        {q:"Which invertebrate is used to make honey?",a:"Honeybee",w:["Butterfly","Ant","Wasp"],e:"Honeybees collect nectar from flowers and convert it into honey in their hives."},
        {q:"What helps a slug move and leave a trail?",a:"Mucus (slime)",w:["Tiny feet underneath","Rolling like a wheel","Jumping like a flea"],e:"Slugs secrete mucus (slime) that lubricates their path and helps them glide."},
      ],
      // World 3: Unit 2A - Parts of a Plant & Plant Growth
      [
        {q:"What are the main parts of a flowering plant?",a:"Roots, stem, leaves, and flowers",w:["Head, arms, legs, and body like animals","Bark, trunk, branches, and cones","Soil, water, sunlight, and air"],e:"Flowering plants have roots, stem, leaves, flowers, and fruits."},
        {q:"What do roots do for a plant?",a:"Anchor the plant and absorb water and minerals",w:["Make food using sunlight like leaves","Attract insects for pollination","Produce seeds for new plants"],e:"Roots hold the plant firmly in soil and absorb water and nutrients."},
        {q:"What do leaves use to make food?",a:"Sunlight, water, and carbon dioxide",w:["Soil nutrients absorbed directly","Moonlight and star energy","Rainwater and wind energy"],e:"Leaves make food through photosynthesis using sunlight, water, and CO2."},
        {q:"What is the green pigment in leaves called?",a:"Chlorophyll",w:["Carotene which is orange","Anthocyanin which is red","Melanin which is brown"],e:"Chlorophyll is the green pigment that captures light energy for photosynthesis."},
        {q:"What does the stem do?",a:"Transports water and food, and supports the plant",w:["Only makes seeds for reproduction","Only absorbs water from soil","Only stores food for winter"],e:"The stem carries water (from roots) and food (from leaves) around the plant."},
        {q:"What do flowers produce?",a:"Seeds and fruits",w:["Oxygen for breathing","Water for hydration","Soil nutrients"],e:"After pollination, flowers develop into fruits that contain seeds."},
        {q:"What does a plant need to grow?",a:"Water, sunlight, air, nutrients, and warmth",w:["Only water and soil","Only sunlight and warmth","Only air and nutrients"],e:"Plants need water, light, air, nutrients, and warmth to grow well."},
        {q:"What is germination?",a:"When a seed begins to grow into a new plant",w:["When a plant produces flowers","When a plant sheds its leaves","When a plant stops growing"],e:"Germination is the process where a seed starts to grow into a seedling."},
        {q:"What do seeds need to germinate?",a:"Water, warmth, and oxygen",w:["Sunlight and cold temperatures","Darkness and dryness","Moonlight and nutrients"],e:"Seeds need water, warmth (heat), and air (oxygen) to germinate."},
        {q:"What carries water from roots to leaves?",a:"Xylem vessels in the stem",w:["Phloem which carries food","Stomata which are leaf pores","Petals which attract insects"],e:"Xylem are tiny tubes in the stem that transport water from roots to leaves."},
        {q:"What carries food from leaves to other parts?",a:"Phloem vessels",w:["Xylem which carries water","Stomata which release gases","Roots which absorb minerals"],e:"Phloem tubes transport food (sugar) made in leaves to all parts of the plant."},
        {q:"What are stomata?",a:"Tiny pores on leaf surface",w:["Small insects that live on leaves","Holes made by caterpillars","Root hairs that absorb water"],e:"Stomata are tiny pores on leaves that allow gases (CO2 and O2) to enter and exit."},
        {q:"Why do plants need sunlight?",a:"For photosynthesis to make food",w:["To keep the leaves warm","To scare away insects","To change the colour of flowers"],e:"Plants use sunlight energy to convert CO2 and water into glucose (food)."},
        {q:"What gas do plants take in during photosynthesis?",a:"Carbon dioxide",w:["Oxygen which they release","Nitrogen from the air","Hydrogen from water vapour"],e:"Plants take in CO2 through stomata and release oxygen during photosynthesis."},
        {q:"What gas do plants release during photosynthesis?",a:"Oxygen",w:["Carbon dioxide","Nitrogen","Helium"],e:"Oxygen is released as a by-product of photosynthesis - essential for animals to breathe."},
        {q:"What is the job of root hairs?",a:"To absorb water and minerals from soil",w:["To produce flowers underground","To protect the plant from wind","To store food for animals"],e:"Root hairs are tiny extensions that increase the surface area for absorbing water."},
        {q:"Which part of the plant makes food?",a:"Leaves",w:["Roots which absorb water","Flowers which attract bees","Stem which gives support"],e:"Leaves are the food factories of the plant where photosynthesis occurs."},
        {q:"What is a tap root?",a:"A single, thick main root going deep into soil",w:["A network of thin roots near the surface","Roots that grow above the ground","Roots that wrap around other plants"],e:"A tap root is a single thick root (like a carrot) that grows deep into the soil."},
        {q:"What are fibrous roots?",a:"A network of thin, branching roots",w:["A single thick main root","Roots that grow only in water","Roots that climb up walls"],e:"Fibrous roots form a dense network of thin roots near the soil surface (like grass)."},
        {q:"What happens to a plant without water?",a:"It wilts and may die",w:["It grows faster to find water","It changes colour to green","It produces more flowers"],e:"Without water, plants cannot perform photosynthesis and will wilt and die."},
        {q:"What is a seedling?",a:"A young plant that has just germinated",w:["A mature tree with fruits","A flower bud before opening","A root growing underground"],e:"A seedling is the young stage of a plant after the seed has germinated."},
        {q:"Which part of the flower becomes the fruit?",a:"The ovary",w:["The petal","The stamen","The sepal"],e:"After pollination, the ovary swells and develops into a fruit containing seeds."},
        {q:"What is pollination?",a:"Transfer of pollen from one flower to another",w:["Planting seeds in soil","Watering the plant daily","Removing weeds around plants"],e:"Pollination is the transfer of pollen (by wind, insects, or birds) between flowers."},
        {q:"Which insects help in pollination?",a:"Bees and butterflies",w:["Mosquitoes and flies","Ants and termites","Spiders and beetles"],e:"Bees and butterflies visit flowers for nectar and carry pollen between flowers."},
        {q:"What protects a flower bud before it opens?",a:"Sepals",w:["Petals","Stamens","Ovaries"],e:"Sepals are the green leaf-like parts that protect the flower bud before it opens."},
        {q:"What are the colourful parts of a flower called?",a:"Petals",w:["Sepals","Stamens","Ovaries"],e:"Petals are the colourful parts that attract pollinators like bees and butterflies."},
        {q:"Why do some plants have thorns?",a:"To protect themselves from animals",w:["To absorb more sunlight","To collect water from air","To attract more insects"],e:"Thorns are a defence mechanism to stop animals from eating the plant."},
        {q:"What type of plant lives for many years?",a:"Perennial plant",w:["Annual plant","Biennial plant","Seasonal plant"],e:"Perennial plants live for more than two years (like trees and shrubs)."},
        {q:"What is the male part of a flower called?",a:"Stamen",w:["Pistil","Ovary","Petal"],e:"The stamen is the male reproductive part of a flower that produces pollen."},
        {q:"What is the female part of a flower called?",a:"Pistil (or carpel)",w:["Stamen","Petal","Sepal"],e:"The pistil (or carpel) is the female reproductive part containing the ovary."},
      ],
      // World 4: Unit 2B - Seed Dispersal
      [
        {q:"Why do plants need to disperse their seeds?",a:"To reduce competition for space, light, and nutrients",w:["To grow more flowers quickly","To change colour of the soil","To attract more animals to eat them"],e:"Dispersal prevents overcrowding and gives seeds a better chance to grow."},
        {q:"Which seeds are dispersed by wind?",a:"Light seeds with wings or parachutes",w:["Heavy seeds that fall straight down","Seeds with hooks that stick to fur","Seeds inside fleshy fruits"],e:"Dandelions and maple seeds are light and have wings or fluffy hairs for wind dispersal."},
        {q:"Which seeds are dispersed by water?",a:"Seeds that can float",w:["Seeds that sink immediately in water","Very heavy seeds that stay on ground","Seeds that are sticky and attach to rocks"],e:"Coconut seeds have a waterproof coating and can float on water to new places."},
        {q:"How do some seeds stick to animals?",a:"They have hooks, spines, or burrs",w:["They produce a sticky glue-like substance","They are magnetic and attach to metal","They are very heavy and drag along"],e:"Burdock and Xanthium seeds have tiny hooks that stick to animal fur."},
        {q:"Which seeds are dispersed by explosion?",a:"Seeds from pods that burst open",w:["Seeds that gently fall to the ground","Seeds carried by ocean currents","Seeds eaten by birds and dropped"],e:"Balsam and pea plants have pods that dry up and burst, throwing seeds out."},
        {q:"How do animals help seed dispersal?",a:"By eating fruits and dropping seeds in droppings",w:["By planting seeds deliberately","By building nests with seeds","By watering the seeds daily"],e:"Birds and mammals eat fruits, and the seeds pass through them and are dropped elsewhere."},
        {q:"What is the seed dispersal method for coconut?",a:"Water dispersal",w:["Wind dispersal with wings","Animal dispersal with hooks","Explosion from a pod"],e:"Coconut seeds can float on water and are carried by ocean currents."},
        {q:"What feature helps dandelion seeds fly?",a:"A feathery parachute (pappus)",w:["A hard protective shell","A sticky surface to attach to birds","A heavy weight to roll on ground"],e:"Dandelion seeds have fluffy hairs called a pappus that act like a parachute."},
        {q:"Why is seed dispersal important for survival?",a:"It helps plants colonise new areas",w:["It makes the soil more fertile","It prevents animals from eating seeds","It changes the weather patterns"],e:"Dispersal helps plant species spread to suitable habitats and avoid overcrowding."},
        {q:"Which plant scatters seeds by bursting pods?",a:"Balsam plant",w:["Coconut tree","Dandelion","Strawberry plant"],e:"Balsam pods dry up and burst open, throwing seeds in all directions."},
        {q:"Which seeds have wings for wind dispersal?",a:"Maple seeds",w:["Apple seeds","Mango seeds","Watermelon seeds"],e:"Maple seeds have a wing-like structure that helps them spin and glide through the air."},
        {q:"What is a fruit that is dispersed by water?",a:"Coconut",w:["Apple","Grapes","Banana"],e:"Coconuts have a fibrous husk that allows them to float on water."},
        {q:"How are strawberry seeds dispersed?",a:"By animals eating the fruit",w:["By wind blowing the seeds","By water carrying them away","By exploding pods"],e:"Animals eat strawberries, and the tiny seeds pass through and grow where dropped."},
        {q:"What do seeds need after dispersal to grow?",a:"Water, warmth, and suitable soil",w:["Wind to push them deeper","Cold temperatures to freeze","Darkness underground forever"],e:"Dispersed seeds need water, warmth, and suitable soil conditions to germinate."},
        {q:"Which seeds are carried by ants?",a:"Some plants have elaiosomes (food bodies) that attract ants",w:["All seeds are carried by ants","No seeds are carried by ants","Only large seeds are carried by ants"],e:"Some plants have elaiosomes - fatty attachments that ants carry to their nests."},
        {q:"What is a seed bank?",a:"A place where seeds are stored to protect plant diversity",w:["A bank that gives loans for farming","A river bank where seeds grow","A shop that sells seeds"],e:"Seed banks store seeds from many plant species to protect biodiversity."},
        {q:"How do pine seeds travel?",a:"Wind carries them from pine cones",w:["Birds eat and drop them","Water carries them downstream","They roll down hills"],e:"Pine cones open and release seeds with small wings that are carried by wind."},
        {q:"What happens if seeds fall too close to the parent plant?",a:"They compete for limited resources",w:["They grow faster together","They share nutrients equally","They form a giant plant"],e:"Seeds near the parent compete for sunlight, water, and nutrients, reducing survival."},
        {q:"Which seed has a fibrous husk for floating?",a:"Coconut",w:["Mango","Apple","Wheat"],e:"The coconut's fibrous husk traps air, allowing it to float on water for months."},
        {q:"What is a tumbleweed?",a:"A plant that rolls in wind to disperse seeds",w:["A plant that grows underwater","A plant that climbs walls","A plant that grows on other plants"],e:"Tumbleweeds break off and roll in the wind, scattering seeds as they bounce."},
        {q:"How are orchid seeds dispersed?",a:"By wind (they are tiny and dust-like)",w:["By animals eating the fruit","By water currents","By exploding capsules"],e:"Orchid seeds are so tiny and light that they are carried by wind like dust."},
        {q:"What protects seeds inside a fruit?",a:"The fruit wall (pericarp)",w:["The flower petals","The leaf surface","The stem bark"],e:"The pericarp is the fruit wall that protects the developing seeds inside."},
        {q:"Which animal is known to bury seeds and forget them?",a:"Squirrels",w:["Rabbits","Cows","Pigeons"],e:"Squirrels bury nuts and seeds for later but often forget, allowing new trees to grow."},
        {q:"What is germination triggered by?",a:"Water absorption by the seed",w:["Wind blowing on the seed","Cold freezing the seed","Darkness underground"],e:"When a seed absorbs water, it swells and activates enzymes that start germination."},
        {q:"How do mangrove seeds disperse?",a:"They germinate while still attached to the parent plant",w:["They float on ocean currents","They are carried by birds","They roll down riverbanks"],e:"Mangrove seedlings grow on the parent tree and drop into the mud below."},
        {q:"What is the seed coat called?",a:"Testa",w:["Pericarp","Endosperm","Embryo"],e:"The testa is the tough outer covering that protects the seed from damage and drying."},
        {q:"Which seed is dispersed by spinning like a helicopter?",a:"Maple seed (samaras)",w:["Dandelion seed","Coconut","Apple seed"],e:"Maple samaras have a wing that makes them spin like helicopter blades in the wind."},
        {q:"What does the endosperm provide?",a:"Food for the developing embryo",w:["Protection from insects","Attraction for pollinators","Water storage for drought"],e:"The endosperm is the food storage tissue that feeds the embryo during germination."},
        {q:"How do berries help seed dispersal?",a:"Their bright colour attracts birds and animals to eat them",w:["Their sour taste keeps insects away","Their hard shell protects from water","Their smell repels herbivores"],e:"Brightly coloured berries signal to animals that the fruit is ripe and ready to eat."},
        {q:"What is the embryo in a seed?",a:"The baby plant that will grow into a new plant",w:["The food storage tissue","The protective outer coat","The root hairs"],e:"The embryo is the tiny plant inside the seed that develops into a new plant."},
      ],
      // World 5: Unit 3 - Ecosystems & Food Chains
      [
        {q:"What is an ecosystem?",a:"A community of living things and their environment",w:["Only plants growing in a garden","Only animals in a zoo enclosure","Only water and rocks in a lake"],e:"An ecosystem includes all living organisms and their physical environment."},
        {q:"What is a producer in a food chain?",a:"A green plant that makes its own food",w:["A meat-eating animal","An insect that eats leaves","A fungus that grows on wood"],e:"Producers (green plants) make food through photosynthesis using sunlight."},
        {q:"What is a consumer in a food chain?",a:"An animal that eats other organisms for food",w:["A plant that makes its own food","A rock that stores minerals","A cloud that produces rain"],e:"Consumers are animals that cannot make their own food and must eat others."},
        {q:"What is a herbivore?",a:"An animal that eats only plants",w:["An animal that eats only other animals","An animal that eats both plants and meat","A plant that eats insects"],e:"Herbivores (like rabbits, cows, deer) feed only on plant material."},
        {q:"What is a carnivore?",a:"An animal that eats other animals",w:["An animal that eats only plants","An animal that eats both plants and animals","An animal that eats only fruit"],e:"Carnivores (like lions, tigers, eagles) hunt and eat other animals."},
        {q:"What is an omnivore?",a:"An animal that eats both plants and animals",w:["An animal that eats only plants","An animal that eats only meat","An animal that eats only insects"],e:"Omnivores (like humans, bears, crows) eat both plant and animal food."},
        {q:"What is a food web?",a:"Many connected food chains in an ecosystem",w:["A spider's silk web for catching prey","A single food chain from producer to top predator","A plant's root system underground"],e:"A food web shows how different food chains are linked together in an ecosystem."},
        {q:"How do humans harm the environment?",a:"By cutting forests, polluting, and overhunting",w:["By planting more trees than needed","By reducing air pollution deliberately","By protecting all wildlife species"],e:"Deforestation, pollution, and overhunting damage ecosystems and reduce biodiversity."},
        {q:"What happens if one species disappears from a food web?",a:"It affects many other species in the ecosystem",w:["Nothing happens to other species","The ecosystem becomes stronger","Only that species' family is affected"],e:"All species are connected in a food web, so removing one affects many others."},
        {q:"How can humans protect ecosystems?",a:"By reducing pollution and preserving habitats",w:["By cutting more trees for farms","By building more factories","By overfishing all lakes and rivers"],e:"Conservation efforts like reducing pollution and protecting habitats help ecosystems."},
        {q:"What is a decomposer?",a:"An organism that breaks down dead matter",w:["An animal that hunts live prey","A plant that makes food from sunlight","A consumer that eats producers"],e:"Decomposers (like fungi and bacteria) break down dead plants and animals into nutrients."},
        {q:"What is a predator?",a:"An animal that hunts and eats other animals",w:["An animal that is hunted by others","A plant that catches insects","An animal that eats only grass"],e:"A predator hunts, kills, and eats other animals (prey) for food."},
        {q:"What is prey?",a:"An animal that is hunted and eaten by another animal",w:["An animal that hunts other animals","A plant that is eaten by herbivores","A decomposer that breaks down dead matter"],e:"Prey are animals that are hunted and eaten by predators."},
        {q:"What is biodiversity?",a:"The variety of living things in an area",w:["The number of trees in a forest","The amount of water in a lake","The temperature of a habitat"],e:"Biodiversity means having many different species of plants, animals, and organisms."},
        {q:"What is the role of bacteria in soil?",a:"They break down dead matter into nutrients",w:["They eat living plant roots","They produce oxygen for plants","They make soil hard and rocky"],e:"Soil bacteria decompose dead organic matter, releasing nutrients for plants."},
        {q:"What is overfishing?",a:"Catching fish faster than they can reproduce",w:["Fishing with oversized nets","Eating too many types of fish","Fishing only in deep oceans"],e:"Overfishing reduces fish populations faster than they can breed and recover."},
        {q:"What is deforestation?",a:"Cutting down large areas of forests",w:["Planting new trees in cities","Growing forests in deserts","Studying forest animals"],e:"Deforestation is the clearing of forests, which destroys habitats and reduces oxygen."},
        {q:"What is pollution?",a:"Harmful substances added to the environment",w:["Natural weather changes","Plant growth in cities","Animal migration patterns"],e:"Pollution is the introduction of harmful substances into air, water, or soil."},
        {q:"What is conservation?",a:"Protecting and preserving nature",w:["Building more cities","Clearing land for farming","Using all natural resources quickly"],e:"Conservation means managing natural resources to prevent waste, loss, or destruction."},
        {q:"What is the greenhouse effect?",a:"Gases trapping heat in Earth's atmosphere",w:["Plants growing in glass houses","The Sun getting hotter each year","Earth moving closer to the Sun"],e:"Greenhouse gases (like CO2) trap heat from the Sun, warming the Earth."},
        {q:"Which gas do plants absorb from the air?",a:"Carbon dioxide",w:["Oxygen","Nitrogen","Helium"],e:"Plants absorb CO2 during photosynthesis and release oxygen."},
        {q:"What is the top predator in a food chain called?",a:"Apex predator",w:["Primary consumer","Secondary producer","Base feeder"],e:"An apex predator is at the top of the food chain with no natural predators."},
        {q:"What is camouflage?",a:"When an animal blends with its surroundings",w:["When an animal changes its diet","When an animal migrates long distances","When an animal builds a nest"],e:"Camouflage helps animals hide from predators or sneak up on prey."},
        {q:"What is migration?",a:"Animals moving from one place to another seasonally",w:["Animals hibernating in winter","Animals changing colour","Animals growing new body parts"],e:"Migration is seasonal movement to find food, water, or suitable breeding conditions."},
        {q:"What is hibernation?",a:"Animals sleeping through winter to save energy",w:["Animals migrating to warm countries","Animals eating more in winter","Animals growing thicker fur only"],e:"Hibernation is a deep sleep-like state where animals save energy during winter."},
        {q:"What is a habitat?",a:"The natural home of a plant or animal",w:["A zoo enclosure for animals","A laboratory for scientists","A garden in a city"],e:"A habitat is the natural environment where a plant or animal lives."},
        {q:"What happens when a habitat is destroyed?",a:"Animals lose their homes and may become extinct",w:["Animals find better homes quickly","Animals adapt within a few days","Nothing happens to the animals"],e:"Habitat destruction forces animals to relocate or die, leading to extinction."},
        {q:"What is the Sun's role in an ecosystem?",a:"It provides energy for producers to make food",w:["It heats up the soil only","It provides water for plants","It scares predators away"],e:"The Sun is the primary energy source for nearly all ecosystems on Earth."},
        {q:"What is a scavenger?",a:"An animal that feeds on dead animals",w:["A predator that hunts live prey","A herbivore that eats plants","A decomposer like bacteria"],e:"Scavengers (like vultures and hyenas) eat dead animals that they did not kill."},
        {q:"Why are bees important for ecosystems?",a:"They pollinate flowers to produce fruits and seeds",w:["They eat harmful insects","They make honey for humans only","They scare away predators"],e:"Bees pollinate crops and wild plants, ensuring food production and biodiversity."},
      ],
      // World 6: Unit 4A - Materials & States of Matter
      [
        {q:"What is a solid?",a:"Matter with a fixed shape and volume",w:["Matter that flows and takes the shape of its container","Matter that spreads out to fill all available space","Matter that has no definite shape or volume"],e:"Solids have a definite shape because their particles are tightly packed together."},
        {q:"What is a liquid?",a:"Matter that flows and takes the shape of its container",w:["Matter with a fixed shape and volume","Matter that spreads to fill the whole room","Matter that has no particles"],e:"Liquids flow because their particles can move past each other while staying close."},
        {q:"What is a gas?",a:"Matter that spreads out to fill its container",w:["Matter with a fixed shape and volume","Matter that stays at the bottom of a container","Matter that cannot move at all"],e:"Gas particles move freely and spread to fill all available space."},
        {q:"Which material conducts heat well?",a:"Metal",w:["Plastic","Wood","Rubber"],e:"Metals are good conductors of heat and electricity due to free-moving electrons."},
        {q:"Which material is transparent?",a:"Glass",w:["Wood","Metal","Cardboard"],e:"Transparent materials like glass let light pass through clearly."},
        {q:"What is melting?",a:"When a solid changes into a liquid by heating",w:["When a liquid changes into a gas by boiling","When a gas changes into a liquid by cooling","When a liquid freezes into a solid"],e:"Melting occurs when heat energy breaks the bonds holding solid particles together."},
        {q:"What is freezing?",a:"When a liquid changes into a solid by cooling",w:["When a solid changes into a liquid","When a liquid changes into a gas","When a gas changes into a solid directly"],e:"Freezing happens when a liquid loses heat energy and particles lock into place."},
        {q:"What is boiling?",a:"When a liquid changes into a gas by heating",w:["When a solid melts into a liquid","When a gas condenses into a liquid","When a solid sublimates into a gas"],e:"Boiling occurs when a liquid is heated to its boiling point and bubbles form."},
        {q:"At what temperature does water freeze?",a:"0 degrees Celsius",w:["10 degrees Celsius","50 degrees Celsius","100 degrees Celsius"],e:"Water freezes at 0°C (32°F) and boils at 100°C (212°F) at sea level."},
        {q:"Which material is a good insulator?",a:"Wool",w:["Iron","Copper","Aluminium"],e:"Wool traps air and is a poor conductor of heat, making it a good insulator."},
        {q:"What is condensation?",a:"When a gas changes into a liquid",w:["When a solid melts into a liquid","When a liquid freezes into a solid","When a liquid boils into a gas"],e:"Condensation happens when gas particles lose energy and form liquid droplets."},
        {q:"What is evaporation?",a:"When a liquid changes into a gas at the surface",w:["When a gas changes into a liquid","When a solid changes directly into a gas","When a liquid freezes into a solid"],e:"Evaporation happens at the surface of a liquid at any temperature."},
        {q:"Which state of matter has particles that vibrate in fixed positions?",a:"Solid",w:["Liquid","Gas","Plasma"],e:"In solids, particles vibrate in fixed positions due to strong intermolecular forces."},
        {q:"What is the boiling point of water?",a:"100 degrees Celsius",w:["0 degrees Celsius","50 degrees Celsius","200 degrees Celsius"],e:"Water boils at 100°C (212°F) at standard atmospheric pressure."},
        {q:"What happens to most materials when heated?",a:"They expand",w:["They contract","They freeze","They dissolve"],e:"When heated, particles gain energy and move apart, causing expansion."},
        {q:"What is a mixture?",a:"Two or more substances combined without chemical bonding",w:["A single pure substance","A new chemical compound","A substance that cannot be separated"],e:"Mixtures can be separated by physical means (like filtration or evaporation)."},
        {q:"What is a solution?",a:"A mixture where one substance dissolves in another",w:["A mixture of oil and water","A solid that cannot be broken","A chemical reaction product"],e:"In a solution, the solute dissolves completely in the solvent (like salt in water)."},
        {q:"What is solubility?",a:"The ability of a substance to dissolve in a liquid",w:["The weight of a substance","The colour of a substance","The temperature of a liquid"],e:"Solubility is how much solute can dissolve in a solvent at a given temperature."},
        {q:"How can you separate sand from water?",a:"By filtration",w:["By evaporation","By distillation","By chromatography"],e:"Filtration uses a filter to separate insoluble solids (sand) from a liquid (water)."},
        {q:"How can you separate salt from salt water?",a:"By evaporation",w:["By filtration","By magnetism","By hand picking"],e:"Evaporation heats the water until it turns to gas, leaving salt crystals behind."},
        {q:"What is a reversible change?",a:"A change that can be undone",w:["A change that cannot be reversed","A chemical reaction that produces new substances","A change that creates heat only"],e:"Reversible changes (like melting ice) can be undone (freezing water back to ice)."},
        {q:"What is an irreversible change?",a:"A change that cannot be undone",w:["A change that can be reversed easily","A physical change only","A change in temperature only"],e:"Irreversible changes (like burning paper) create new substances that cannot be reversed."},
        {q:"Which material is magnetic?",a:"Iron",w:["Plastic","Wood","Glass"],e:"Iron, nickel, and cobalt are magnetic materials that are attracted to magnets."},
        {q:"What is rust?",a:"Iron oxide formed when iron reacts with oxygen and water",w:["A type of fungus on metal","A chemical used to clean iron","A protective coating on steel"],e:"Rust forms when iron is exposed to both oxygen and moisture over time."},
        {q:"How can rusting be prevented?",a:"By painting, oiling, or galvanising",w:["By leaving metal exposed to air","By heating the metal red hot","By adding salt water to the surface"],e:"Coating iron with paint, oil, or zinc (galvanising) prevents contact with oxygen and water."},
        {q:"What is the difference between heat and temperature?",a:"Heat is energy; temperature is how hot or cold something is",w:["They are the same thing","Heat is cold; temperature is hot","Temperature is energy; heat is a measurement"],e:"Heat is the total thermal energy, while temperature measures the average kinetic energy."},
        {q:"What happens to water at 0°C?",a:"It freezes into ice",w:["It boils into steam","It evaporates into vapour","It condenses into droplets"],e:"At 0°C, water molecules slow down enough to form a solid crystal structure (ice)."},
        {q:"What is the process of a solid turning directly into a gas?",a:"Sublimation",w:["Evaporation","Condensation","Freezing"],e:"Sublimation is when a solid changes directly to a gas without becoming a liquid first."},
        {q:"What is distillation?",a:"Separating a liquid from a solution by boiling and condensing",w:["Separating solids using a magnet","Separating mixtures by hand","Separating colours using paper"],e:"Distillation boils a liquid, collects the vapour, and cools it back into a pure liquid."},
        {q:"Which material is a poor conductor and good insulator?",a:"Plastic",w:["Copper","Silver","Gold"],e:"Plastic does not allow heat or electricity to pass through easily, making it a good insulator."},
      ],
      // World 7: Unit 4B - The Water Cycle
      [
        {q:"What is evaporation in the water cycle?",a:"When the sun heats water and it turns into water vapour",w:["When rain falls from clouds","When water freezes into ice","When plants release oxygen"],e:"Evaporation is the process where liquid water changes into water vapour (gas)."},
        {q:"What is condensation?",a:"When water vapour cools and forms liquid droplets",w:["When water turns into ice crystals","When ice melts into liquid water","When water flows into rivers"],e:"Condensation forms clouds when water vapour cools in the atmosphere."},
        {q:"What is precipitation?",a:"When water falls from clouds as rain, snow, sleet, or hail",w:["When water evaporates from lakes","When clouds form in the sky","When plants release water vapour"],e:"Precipitation includes rain, snow, sleet, and hail falling from clouds."},
        {q:"What is collection in the water cycle?",a:"When water gathers in rivers, lakes, and oceans",w:["When water turns into vapour","When clouds form in the sky","When rain falls from clouds"],e:"Collection is when water collects in oceans, rivers, lakes, and groundwater."},
        {q:"What causes water to evaporate?",a:"Heat from the sun",w:["Cold from ice cubes","Wind from electric fans","Darkness at night time"],e:"The Sun provides heat energy that causes water molecules to escape as vapour."},
        {q:"What are clouds made of?",a:"Tiny water droplets or ice crystals",w:["Cotton-like fluffy material","Smoke from factories","Dust particles only"],e:"Clouds are formed by millions of tiny water droplets from condensation."},
        {q:"What is transpiration?",a:"When plants release water vapour from their leaves",w:["When plants absorb sunlight","When plants make food through photosynthesis","When plants grow new roots"],e:"Transpiration is the loss of water vapour from plant leaves into the atmosphere."},
        {q:"Why is the water cycle important?",a:"It provides fresh water for all living things",w:["It makes the weather hotter","It creates new water molecules","It only helps plants grow faster"],e:"The water cycle continuously recycles water, providing fresh water for all life."},
        {q:"Where does most evaporation on Earth happen?",a:"From oceans and seas",w:["From rivers only","From lakes only","From plants only"],e:"The vast surface area of oceans provides the most water for evaporation."},
        {q:"What type of precipitation is frozen water crystals?",a:"Snow",w:["Rain which is liquid","Dew which forms on grass","Fog which is near the ground"],e:"Snow forms when water vapour in clouds freezes directly into ice crystals."},
        {q:"What is groundwater?",a:"Water stored underground in soil and rocks",w:["Water in rivers above ground","Water in clouds in the sky","Water frozen in glaciers"],e:"Groundwater is water that seeps into the ground and collects in underground aquifers."},
        {q:"What is run-off?",a:"Water flowing over land into rivers and lakes",w:["Water evaporating from soil","Water being absorbed by plants","Water freezing into ice"],e:"Run-off is precipitation that does not soak into the ground but flows over the surface."},
        {q:"What is dew?",a:"Water droplets that form on cool surfaces at night",w:["Rain that falls very gently","Ice that forms on windows","Water released by flowers"],e:"Dew forms when water vapour in the air condenses on cool surfaces overnight."},
        {q:"What is hail?",a:"Frozen balls of ice that fall during thunderstorms",w:["Soft snowflakes","Cold raindrops","Ice formed on roads"],e:"Hailstones form when water droplets freeze and are lifted repeatedly in storm clouds."},
        {q:"What is a water table?",a:"The level below which the ground is saturated with water",w:["A table made of ice","A chart showing rainfall","A river that flows underground"],e:"The water table is the boundary between saturated (wet) and unsaturated (dry) soil."},
        {q:"How do mountains affect rainfall?",a:"They force air up, causing it to cool and condense",w:["They block all rain completely","They absorb water from clouds","They heat up the surrounding air"],e:"When moist air rises over mountains, it cools and condenses, creating rain."},
        {q:"What is a drought?",a:"A long period with very little rain",w:["Heavy rainfall for many days","A sudden flood event","Freezing temperatures for weeks"],e:"A drought occurs when an area receives much less rain than usual for a long time."},
        {q:"What is a flood?",a:"When water overflows onto normally dry land",w:["When a river dries up completely","When all the rain is absorbed by soil","When clouds disappear from the sky"],e:"Floods happen when rivers overflow or heavy rain cannot drain away quickly."},
        {q:"How much of Earth's surface is covered by water?",a:"About 71%",w:["About 50%","About 25%","About 90%"],e:"Approximately 71% of Earth's surface is covered by oceans, seas, and other water bodies."},
        {q:"What percentage of Earth's water is freshwater?",a:"About 3%",w:["About 50%","About 25%","About 10%"],e:"Only about 3% of all Earth's water is freshwater, and most of it is frozen in ice caps."},
        {q:"What is an aquifer?",a:"An underground layer of rock that holds water",w:["A large above-ground reservoir","A type of water treatment plant","A river that flows underground"],e:"Aquifers are underground layers of permeable rock that store and transmit groundwater."},
        {q:"Why do we need to save water?",a:"Freshwater is limited and essential for life",w:["Water is disappearing from Earth","Oceans are running dry","Rain will stop falling soon"],e:"Freshwater is limited, and conserving it ensures there is enough for everyone."},
        {q:"What is a reservoir?",a:"A large artificial lake for storing water",w:["A natural underground cave","A container for oil storage","A small pond in a garden"],e:"Reservoirs are man-made lakes created by building dams across rivers to store water."},
        {q:"What is a dam?",a:"A barrier built across a river to control water flow",w:["A bridge for crossing rivers","A tunnel for water transport","A pipe for drinking water"],e:"Dams block rivers to create reservoirs, generate electricity, and prevent floods."},
        {q:"What is water pollution?",a:"Harmful substances contaminating water bodies",w:["Natural minerals dissolving in water","Water evaporating too quickly","Water freezing in winter"],e:"Water pollution occurs when chemicals, waste, or sewage enter rivers, lakes, or oceans."},
        {q:"What causes acid rain?",a:"Pollutants like sulphur dioxide mixing with rainwater",w:["Too much oxygen in the air","Natural evaporation of seawater","Plants releasing too much CO2"],e:"Acid rain forms when industrial pollutants combine with water vapour in clouds."},
        {q:"What is a watershed?",a:"An area of land where all water drains into the same river",w:["A building where water is stored","A tool for measuring rainfall","A machine for purifying water"],e:"A watershed (or drainage basin) is the area where all water flows to a common outlet."},
        {q:"How does deforestation affect the water cycle?",a:"It reduces transpiration and increases run-off",w:["It creates more rainfall","It purifies groundwater","It prevents flooding"],e:"Fewer trees means less transpiration and more soil erosion, affecting the water cycle."},
        {q:"What is desalination?",a:"Removing salt from seawater to make it drinkable",w:["Adding salt to freshwater","Freezing seawater into ice","Boiling water to remove minerals"],e:"Desalination is the process of removing salt and minerals from seawater."},
        {q:"What is humidity?",a:"The amount of water vapour in the air",w:["The speed of wind","The temperature of the air","The pressure of the atmosphere"],e:"Humidity measures how much water vapour is present in the air."},
      ],
      // World 8: Unit 5 - Forces, Gravity & Friction
      [
        {q:"What is a force?",a:"A push or a pull on an object",w:["A type of energy stored in batteries","A kind of food that gives strength","A form of light that we can see"],e:"Forces are pushes or pulls that can change how an object moves or its shape."},
        {q:"What can a force do to an object?",a:"Change its speed, direction, or shape",w:["Always destroy the object completely","Make the object disappear","Change the object's colour permanently"],e:"Forces can start, stop, speed up, slow down, or change the direction of movement."},
        {q:"What is gravity?",a:"A force that pulls objects towards each other",w:["A force that pushes objects apart from each other","A type of magnet that attracts metal","A form of electricity in the air"],e:"Gravity pulls everything towards the centre of the Earth (or any massive object)."},
        {q:"Why do dropped objects fall to the ground?",a:"Gravity pulls them towards the Earth",w:["The air pushes them downwards","The Earth pushes up against them","Objects naturally want to be on the ground"],e:"Gravity is the force that pulls objects towards the centre of the Earth."},
        {q:"What is friction?",a:"A force that opposes motion between two surfaces",w:["A force that speeds up moving objects","A type of lubricant that reduces heat","A form of energy that creates light"],e:"Friction acts between touching surfaces and slows down or stops movement."},
        {q:"Which surface has more friction?",a:"Rough surface",w:["Smooth surface like ice","Wet surface like a slide","Oiled surface like a machine"],e:"Rough surfaces have more friction because their bumps and ridges interlock."},
        {q:"How can friction be reduced?",a:"By using lubricants like oil or grease",w:["By making surfaces rougher","By adding more weight to the object","By removing all air around the object"],e:"Oil and grease fill gaps between surfaces, allowing them to slide more easily."},
        {q:"What is air resistance?",a:"Friction between an object and the air as it moves",w:["The weight of the air pressing down","The temperature of the surrounding air","The colour of the sky above"],e:"Air resistance (drag) is a type of friction that slows objects moving through air."},
        {q:"Why does a parachute fall slowly?",a:"It has a large surface area that creates air resistance",w:["It is made of very heavy material","It has no gravity acting on it","It is filled with helium gas"],e:"Parachutes have large surface areas that create lots of air resistance, slowing the fall."},
        {q:"What is magnetic force?",a:"A force that pulls iron and steel objects towards a magnet",w:["A force that pushes all metals away","A force that only works on wood","A force that affects plastic objects"],e:"Magnets attract iron, nickel, cobalt, and some steel objects."},
        {q:"What is weight?",a:"The force of gravity pulling on an object's mass",w:["The amount of matter in an object","The size of an object","The colour of an object"],e:"Weight = mass x gravity. It is the force with which gravity pulls an object down."},
        {q:"What is mass?",a:"The amount of matter in an object",w:["The force pulling the object down","The speed of the object","The temperature of the object"],e:"Mass is the amount of material in an object, measured in kilograms (kg)."},
        {q:"Why is it easier to pull a box on wheels than to drag it?",a:"Wheels reduce friction",w:["Wheels increase gravity","Wheels make the box lighter","Wheels create more air resistance"],e:"Rolling friction is much less than sliding friction, making movement easier."},
        {q:"What is a balanced force?",a:"Forces that are equal and opposite, causing no movement",w:["Forces that make an object speed up","Forces that only push in one direction","Forces that cause objects to break"],e:"When forces are balanced, the object stays still or moves at constant speed."},
        {q:"What is an unbalanced force?",a:"Forces that are not equal, causing movement or change",w:["Forces that cancel each other out","Forces that only act on liquids","Forces that work on magnets only"],e:"Unbalanced forces cause objects to accelerate (speed up, slow down, or change direction)."},
        {q:"Why do skiers wax their skis?",a:"To reduce friction with the snow",w:["To increase friction for better grip","To make the skis heavier","To change the colour of the skis"],e:"Wax creates a smooth layer that reduces friction between skis and snow."},
        {q:"What is elastic force?",a:"The force that returns a stretched or compressed object to its original shape",w:["The force that breaks an object apart","The force that makes objects stick together","The force that creates heat in wires"],e:"Elastic force is seen in springs and rubber bands that return to shape when released."},
        {q:"What is buoyancy?",a:"The upward force that helps objects float in liquid",w:["The downward force of gravity on water","The sideways force of waves","The force that makes objects sink"],e:"Buoyant force pushes up on objects in liquid, helping them float if less dense."},
        {q:"Why does a boat float?",a:"It is less dense than the water it displaces",w:["It is heavier than the water","It has no gravity acting on it","It is made of waterproof material only"],e:"A boat floats when the weight of the water it pushes aside equals the boat's weight."},
        {q:"What is Newton's First Law?",a:"An object stays still or moves at constant speed unless acted on by a force",w:["Force equals mass times acceleration","Every action has an equal and opposite reaction","Objects naturally slow down over time"],e:"Also called the Law of Inertia - objects resist changes to their motion."},
        {q:"What is inertia?",a:"The tendency of an object to resist changes in motion",w:["The force that pulls objects down","The speed at which light travels","The temperature of an object"],e:"Inertia is why you feel pushed back when a car suddenly accelerates."},
        {q:"Why do seat belts save lives?",a:"They stop passengers from continuing forward in a crash",w:["They make the car go slower","They reduce the weight of passengers","They increase friction in the engine"],e:"Due to inertia, passengers keep moving forward when the car stops suddenly."},
        {q:"What is a lever?",a:"A rigid bar that pivots around a fixed point to move loads",w:["A type of wheel used in cars","A rope used for pulling objects","A type of magnet for lifting metal"],e:"Levers make work easier by multiplying force (like a seesaw or crowbar)."},
        {q:"What is a pulley?",a:"A wheel with a rope used to lift heavy objects",w:["A type of lever used in factories","A tool for measuring weight","A type of gear for bicycles"],e:"Pulleys change the direction of force, making it easier to lift heavy loads."},
        {q:"What is speed?",a:"How fast an object is moving",w:["The weight of an object","The force on an object","The direction an object moves"],e:"Speed = Distance / Time. It measures how fast something covers distance."},
        {q:"Why does a ball rolling on grass stop?",a:"Friction between the ball and grass slows it down",w:["Gravity pulls the ball into the ground","The ball runs out of energy instantly","Air resistance pushes the ball backwards"],e:"Friction between the ball and grass converts kinetic energy into heat, slowing the ball."},
        {q:"What happens to astronauts in space?",a:"They float because there is very little gravity",w:["They fall to the bottom of the spaceship","They become lighter than on Earth","They disappear because of no air"],e:"In orbit, astronauts are in free fall, so they appear weightless (microgravity)."},
        {q:"What is a spring balance used for?",a:"Measuring the weight of an object",w:["Measuring the temperature of water","Measuring the length of a table","Measuring the speed of a car"],e:"A spring balance measures weight by how much a spring stretches under gravity."},
        {q:"What is the unit of force?",a:"Newton (N)",w:["Kilogram (kg)","Metre (m)","Second (s)"],e:"Force is measured in Newtons (N). 1 N is the force needed to lift an apple."},
        {q:"Why is oil used in car engines?",a:"To reduce friction between moving parts",w:["To make the engine heavier","To increase the speed of the car","To clean the exhaust fumes"],e:"Engine oil lubricates moving parts, reducing friction, heat, and wear."},
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }
  // ============ SOCIAL SCIENCE - The World Around Us (6 worlds × 30 questions) ============
  static social(worldId: number, n = 30): MathQuestion[] {
    const questions: any[][] = [
      // World 1: Early Humans (Stone, Bronze, Iron Age)
      [
        {q:"What period used stone tools?",a:"The Stone Age",w:["The Bronze Age","The Iron Age","The Industrial Age"],e:"The Stone Age is the earliest period when humans made tools from stone."},
        {q:"What are the two periods of the Stone Age?",a:"Paleolithic and Neolithic",w:["Old and New Stone","Early and Late Stone","Ancient and Modern Stone"],e:"Paleolithic (Old Stone Age) and Neolithic (New Stone Age) are the two main periods."},
        {q:"How did Paleolithic people get food?",a:"By hunting animals and gathering plants",w:["By farming crops in fields","By buying food from markets","By ordering food online"],e:"Paleolithic people were hunter-gatherers who found wild food."},
        {q:"What important discovery was made in the Neolithic Age?",a:"Farming and agriculture",w:["How to build computers","How to use electricity","How to fly in aeroplanes"],e:"The Neolithic Age saw the beginning of farming and settled communities."},
        {q:"What is the Bronze Age known for?",a:"Making tools and weapons from bronze",w:["Making tools from pure iron","Making tools from plastic","Making tools only from wood"],e:"Bronze is a metal alloy made by mixing copper and tin."},
        {q:"What two metals make bronze?",a:"Copper and tin",w:["Iron and carbon","Gold and silver","Lead and zinc"],e:"Bronze is an alloy (mixture) of about 90% copper and 10% tin."},
        {q:"What did Bronze Age people build for burials?",a:"Stone circles and burial mounds",w:["Skyscrapers and bridges","Tunnels and dams","Temples and mosques"],e:"Structures like Stonehenge and burial mounds were built during the Bronze Age."},
        {q:"What marked the beginning of the Iron Age?",a:"Discovery of iron smelting",w:["Discovery of bronze","Invention of the wheel","First writing systems"],e:"The Iron Age began when humans learned to extract iron from iron ore."},
        {q:"Why was iron better than bronze for tools?",a:"Iron was stronger, more abundant, and kept sharp longer",w:["Iron was prettier and shinier","Iron was lighter and softer","Iron was easier to melt"],e:"Iron is harder, more durable, and more common than bronze."},
        {q:"What type of houses did Iron Age people build?",a:"Roundhouses with thatched roofs",w:["Brick apartment buildings","Glass office towers","Metal storage sheds"],e:"Iron Age people in Europe lived in roundhouses made of wood, mud, and thatch."},
        {q:"What is a hunter-gatherer?",a:"Someone who hunts animals and collects wild plants for food",w:["Someone who buys food from shops","Someone who grows crops on farms","Someone who only eats meat"],e:"Hunter-gatherers do not farm - they find wild food in nature."},
        {q:"What is fire important for in early human life?",a:"For warmth, cooking, and protection",w:["For making mobile phones","For driving cars","For building aeroplanes"],e:"Early humans used fire for warmth, cooking food, scaring predators, and light."},
        {q:"What are cave paintings?",a:"Drawings made by early humans on cave walls",w:["Paintings bought from art shops","Digital images on computers","Photographs taken with cameras"],e:"Cave paintings (like those in Lascaux, France) show animals and hunting scenes."},
        {q:"What tool did early humans use to make fire?",a:"Flint stones to create sparks",w:["Matches from a box","A lighter from a shop","An electric stove"],e:"Early humans struck flint stones together to create sparks for starting fires."},
        {q:"What is agriculture?",a:"Growing crops and raising animals for food",w:["Hunting wild animals","Gathering wild fruits","Trading goods in markets"],e:"Agriculture (farming) began in the Neolithic Age and allowed settled communities."},
        {q:"What is domestication?",a:"Taming wild animals for human use",w:["Hunting animals for sport","Painting pictures of animals","Protecting animals in zoos"],e:"Domestication is training wild animals (like wolves to dogs) to live with humans."},
        {q:"What crop was first farmed in the Fertile Crescent?",a:"Wheat",w:["Rice","Maize (corn)","Potatoes"],e:"Wheat was one of the first crops farmed in the Fertile Crescent (Mesopotamia)."},
        {q:"What animals were first domesticated?",a:"Dogs and sheep",w:["Lions and tigers","Elephants and giraffes","Sharks and whales"],e:"Dogs (from wolves) and sheep were among the first animals domesticated."},
        {q:"What is a tribe?",a:"A group of families living and working together",w:["A group of animals in a zoo","A type of government building","A style of ancient clothing"],e:"Tribes were small communities of related families who hunted and gathered together."},
        {q:"Why did early humans make tools?",a:"To hunt, cut, build, and make life easier",w:["To play games","To decorate caves","To write letters"],e:"Tools helped early humans hunt animals, cut plants, build shelters, and process food."},
        {q:"What is flint?",a:"A hard stone that produces sparks when struck",w:["A type of metal ore","A soft clay for pottery","A precious gemstone"],e:"Flint is a hard sedimentary rock that early humans used to make tools and start fires."},
        {q:"What is a settlement?",a:"A place where people establish a community to live",w:["A place where animals hibernate","A temporary camping ground","A market for trading goods"],e:"Settlements are permanent or semi-permanent communities where people live."},
        {q:"What invention helped early humans travel on water?",a:"The boat or raft",w:["The bicycle","The hot air balloon","The submarine"],e:"Early humans built rafts and boats from logs to travel across rivers and seas."},
        {q:"What is the Fertile Crescent?",a:"A region in the Middle East where farming first began",w:["A shape of the moon","A type of farming tool","A constellation of stars"],e:"The Fertile Crescent (Mesopotamia) had rich soil and water, ideal for early farming."},
        {q:"What is metal smelting?",a:"Heating ore to extract metal from it",w:["Painting metal with colours","Shaping metal with a hammer","Cooling metal in water"],e:"Smelting involves heating metal ore to high temperatures to separate the metal."},
        {q:"What did the invention of pottery allow?",a:"Storing food and water safely",w:["Flying through the air","Sending messages quickly","Building tall towers"],e:"Clay pots allowed people to store grain, water, and cooked food."},
        {q:"What is a megalith?",a:"A large stone used to build prehistoric structures",w:["A small clay pot","A bronze weapon","An iron farming tool"],e:"Megaliths are large stones used to build monuments like Stonehenge."},
        {q:"Why is the Neolithic Age called a 'revolution'?",a:"Because farming changed how humans lived forever",w:["Because people invented wheels","Because people discovered fire","Because people built pyramids"],e:"The Neolithic Revolution transformed humans from nomads to settled farmers."},
        {q:"What evidence tells us about early humans?",a:"Tools, bones, cave paintings, and fossils",w:["Books written by early humans","Videos recorded by early humans","Maps drawn by early humans"],e:"Archaeologists study tools, bones, cave paintings, and fossils to learn about early humans."},
        {q:"What is the difference between Paleolithic and Neolithic people?",a:"Paleolithic hunted and gathered; Neolithic farmed",w:["Paleolithic used iron; Neolithic used bronze","Paleolithic lived in cities; Neolithic lived in caves","Paleolithic wrote books; Neolithic made paintings"],e:"The key difference: Paleolithic = hunter-gatherers; Neolithic = farmers with settlements."},
      ],
      // World 2: Ancient Civilizations (Mesopotamia, Egypt, Indus Valley)
      [
        {q:"Where was Mesopotamia located?",a:"Between the Tigris and Euphrates rivers",w:["Between the Nile and Amazon rivers","Between the Ganges and Indus rivers","Between the Thames and Seine rivers"],e:"Mesopotamia means 'land between the rivers' in Greek."},
        {q:"What is Mesopotamia called in the Bible?",a:"The Fertile Crescent",w:["The Sahara Desert","The Amazon Basin","The Tibetan Plateau"],e:"The Fertile Crescent had rich soil and water, ideal for early agriculture."},
        {q:"What was the earliest form of writing in Mesopotamia?",a:"Cuneiform",w:["Hieroglyphics","The alphabet","Braille"],e:"Cuneiform was written by pressing wedge-shaped marks into clay tablets."},
        {q:"What did ancient Egyptians build as tombs?",a:"Pyramids",w:["Castles","Temples only","Palaces"],e:"The Great Pyramid of Giza is one of the Seven Wonders of the Ancient World."},
        {q:"What is hieroglyphics?",a:"The picture writing system of ancient Egypt",w:["The writing system of China","The Greek alphabet","The Roman numbering system"],e:"Hieroglyphics used pictures and symbols to represent words and sounds."},
        {q:"Why was the River Nile important to Egypt?",a:"It provided water for farming and transport",w:["It was used only for swimming","It had no importance to Egyptians","It was only good for fishing"],e:"The Nile's annual floods deposited fertile soil, enabling agriculture in a desert."},
        {q:"Where was the Indus Valley Civilization?",a:"In present-day Pakistan and northwest India",w:["In southern India","In central Africa","In South America"],e:"The Indus Valley was centred around the Indus River in South Asia."},
        {q:"What were the two largest Indus Valley cities?",a:"Mohenjo-daro and Harappa",w:["Delhi and Mumbai","Cairo and Alexandria","Athens and Rome"],e:"These cities had advanced urban planning and covered drainage systems."},
        {q:"What was special about Indus Valley city planning?",a:"Grid-pattern streets and advanced drainage",w:["Narrow winding roads","No drainage system at all","Random building placement"],e:"Indus cities had well-planned grid streets and covered brick-lined drains."},
        {q:"Which ancient civilization invented the wheel?",a:"Mesopotamia",w:["Ancient Egypt","Indus Valley","Ancient China"],e:"The wheel was invented in Mesopotamia around 3500 BCE for pottery and transport."},
        {q:"What is a ziggurat?",a:"A stepped pyramid temple in Mesopotamia",w:["An Egyptian tomb","An Indus Valley house","A Chinese palace"],e:"Ziggurats were massive stepped temples built in the centre of Mesopotamian cities."},
        {q:"Who were the pharaohs?",a:"Rulers of ancient Egypt considered gods on earth",w:["Farmers in Mesopotamia","Traders in the Indus Valley","Soldiers in ancient Greece"],e:"Pharaohs were the kings of Egypt, believed to be divine representatives of gods."},
        {q:"What is papyrus?",a:"A paper-like material made from reeds in Egypt",w:["A type of stone used for building","A metal used for tools","A food grain like wheat"],e:"Egyptians made papyrus from Nile reeds to write on - the origin of the word 'paper'."},
        {q:"What is the Rosetta Stone?",a:"A stone with the same text in three scripts",w:["A precious gemstone from Egypt","A building material from Mesopotamia","A tool from the Indus Valley"],e:"The Rosetta Stone helped decode hieroglyphics because it had Greek, demotic, and hieroglyphic text."},
        {q:"What did the Indus Valley people trade?",a:"Cotton cloth, beads, and metal goods",w:["Computers and phones","Cars and aeroplanes","Oil and gas"],e:"Indus Valley people were skilled traders who exported cotton, beads, and crafted goods."},
        {q:"What is the significance of the Great Bath at Mohenjo-daro?",a:"It shows advanced water management and possibly ritual use",w:["It was a swimming pool for kings","It was used for fishing","It was a storage tank for grain"],e:"The Great Bath is a large, water-tight pool that shows sophisticated engineering."},
        {q:"What writing system did the Indus Valley use?",a:"Indus script (still undeciphered)",w:["Cuneiform","Hieroglyphics","The Greek alphabet"],e:"The Indus script has not been fully deciphered - scholars are still studying it."},
        {q:"What did the Sumerians invent?",a:"Writing (cuneiform), the wheel, and mathematics",w:["Telephones and televisions","Cars and trains","Computers and the internet"],e:"The Sumerians of Mesopotamia made many important early inventions."},
        {q:"What is a dynasty?",a:"A series of rulers from the same family",w:["A type of building","A style of art","A form of writing"],e:"Dynasties are families that rule a country over multiple generations."},
        {q:"What did ancient Egyptians use for mummification?",a:"Natron salt and linen wraps",w:["Ice and snow","Fire and ash","Oil and vinegar"],e:"Natron salt dried out the body, and linen wraps preserved it for the afterlife."},
        {q:"Why did Egyptians mummify bodies?",a:"They believed in life after death",w:["To scare away enemies","To use bodies as decorations","To study human anatomy"],e:"Egyptians believed the soul needed the body in the afterlife, so they preserved it."},
        {q:"What is the Sphinx?",a:"A statue with a lion's body and a human head",w:["A type of pyramid","A form of writing","A style of clothing"],e:"The Great Sphinx of Giza guards the pyramids and has the body of a lion."},
        {q:"What did the Indus Valley people grow?",a:"Wheat, barley, peas, and cotton",w:["Rice and tea only","Coffee and cocoa","Potatoes and tomatoes"],e:"Indus Valley farmers grew wheat, barley, peas, dates, and cotton."},
        {q:"What is the importance of ancient civilizations?",a:"They laid foundations for modern society",w:["They had no impact on modern life","They only built large buildings","They only fought wars"],e:"Ancient civilizations invented writing, farming, mathematics, law, and governance."},
        {q:"How did Egyptians tell time?",a:"Using sundials and water clocks",w:["Using digital watches","Using mobile phones","Using radio signals"],e:"Egyptians used sundials (shadow clocks) and water clocks (clepsydra) to tell time."},
        {q:"What was the role of priests in ancient Egypt?",a:"They performed religious ceremonies and maintained temples",w:["They were farmers who grew crops","They were soldiers who fought wars","They were traders who sold goods"],e:"Priests were powerful figures who conducted rituals and managed temple affairs."},
        {q:"What is irrigation?",a:"Supplying water to crops artificially",w:["Growing crops without water","Removing water from fields","Harvesting crops by hand"],e:"Irrigation channels brought water from rivers to fields, enabling farming in dry areas."},
        {q:"What did Mesopotamians use to count and record?",a:"Clay tokens and tablets",w:["Electronic calculators","Paper notebooks","Computer spreadsheets"],e:"Before writing, Mesopotamians used clay tokens. Later they pressed marks into clay tablets."},
        {q:"Why did ancient civilizations develop near rivers?",a:"Rivers provided water, fertile soil, and transport",w:["Rivers were good for swimming","Rivers kept enemies away","Rivers provided fish only"],e:"Rivers provided water for drinking, farming, fishing, and transport for trade."},
      ],
      // World 3: The Medieval World (Byzantine, Islamic Golden Age, Crusades)
      [
        {q:"What was the capital of the Byzantine Empire?",a:"Constantinople",w:["Rome","Athens","Cairo"],e:"Constantinople (now Istanbul, Turkey) was founded by Emperor Constantine."},
        {q:"What religion was central to the Byzantine Empire?",a:"Eastern Orthodox Christianity",w:["Islam","Buddhism","Hinduism"],e:"The Byzantine Empire was the centre of Eastern Orthodox Christianity for over 1000 years."},
        {q:"What is the Hagia Sophia?",a:"A famous Byzantine cathedral (church)",w:["A Roman temple","An Egyptian pyramid","A Chinese palace"],e:"Hagia Sophia in Istanbul is an architectural masterpiece built in 537 CE."},
        {q:"When did the Islamic Golden Age occur?",a:"Approximately 8th to 13th century",w:["1st to 5th century","15th to 18th century","19th to 20th century"],e:"The Islamic Golden Age was a period of great scientific and cultural advancement."},
        {q:"What scientific advances came from the Islamic Golden Age?",a:"Algebra, astronomy, and medicine",w:["Nuclear physics","Computer science","Genetic engineering"],e:"Muslim scholars made major contributions to mathematics, astronomy, chemistry, and medicine."},
        {q:"What is algebra?",a:"A branch of mathematics using symbols and equations",w:["A type of Arabic poetry","A musical instrument","A style of architecture"],e:"The word 'algebra' comes from the Arabic 'al-jabr' meaning 'reunion of broken parts'."},
        {q:"What were the Crusades?",a:"A series of religious wars between Christians and Muslims",w:["Peaceful trade expeditions to Asia","Scientific conferences in Europe","Religious pilgrimages without conflict"],e:"The Crusades were military campaigns (1095-1291) to control the Holy Land."},
        {q:"What was the Holy Land?",a:"Jerusalem and surrounding areas",w:["Rome","Mecca","Constantinople"],e:"Jerusalem is sacred to Christians, Muslims, and Jews."},
        {q:"What impact did the Crusades have on Europe?",a:"Increased trade and cultural exchange with the East",w:["No impact at all","Complete isolation from Asia","Economic collapse across Europe"],e:"The Crusades opened trade routes and exposed Europeans to Eastern goods and ideas."},
        {q:"Which Muslim leader recaptured Jerusalem?",a:"Saladin",w:["Genghis Khan","Alexander the Great","Napoleon Bonaparte"],e:"Saladin was a respected Kurdish Muslim leader known for his chivalry and mercy."},
        {q:"What is a caliphate?",a:"An Islamic state led by a caliph (religious and political leader)",w:["A Christian kingdom","A Buddhist monastery","A Hindu temple complex"],e:"A caliph was both the religious and political leader of the Muslim community."},
        {q:"What did Ibn Sina (Avicenna) contribute?",a:"The Canon of Medicine - a medical encyclopedia",w:["The theory of relativity","The invention of printing","The discovery of America"],e:"Ibn Sina's Canon of Medicine was used as a medical textbook in Europe for centuries."},
        {q:"What did Al-Khwarizmi invent?",a:"Algebra and algorithms",w:["The microscope","The steam engine","The telephone"],e:"Al-Khwarizmi is called the 'father of algebra'. The word 'algorithm' comes from his name."},
        {q:"What is a mosque?",a:"A Muslim place of worship",w:["A Christian church","A Hindu temple","A Buddhist shrine"],e:"Mosques are places where Muslims gather to pray and learn about Islam."},
        {q:"What is the significance of the House of Wisdom?",a:"It was a major centre for scholarship and translation",w:["It was a palace for kings","It was a military fortress","It was a marketplace for traders"],e:"The House of Wisdom in Baghdad preserved and translated Greek, Persian, and Indian texts."},
        {q:"What did Muslim scholars preserve?",a:"Ancient Greek and Roman knowledge",w:["Modern European inventions","Chinese silk-making secrets","African drum traditions"],e:"Muslim scholars translated and preserved Greek and Roman texts that Europe had lost."},
        {q:"What is chivalry?",a:"The medieval code of honour for knights",w:["A type of medieval weapon","A style of castle building","A form of medieval farming"],e:"Chivalry included bravery, courtesy, honour, and respect for women and the weak."},
        {q:"What is feudalism?",a:"A social system where lords gave land to vassals in exchange for service",w:["A democratic voting system","A trading network between cities","A religious belief system"],e:"In feudalism, kings gave land to lords, who gave land to knights, who protected peasants."},
        {q:"What was the Black Death?",a:"A plague that killed millions in Europe",w:["A volcanic eruption","A massive flood","A great fire"],e:"The bubonic plague (1347-1351) killed about one-third of Europe's population."},
        {q:"What is a knight?",a:"A mounted warrior who served a lord",w:["A farming peasant","A travelling merchant","A religious priest"],e:"Knights were trained warriors who swore loyalty to a lord and followed the code of chivalry."},
        {q:"What is a castle?",a:"A fortified building for defence and residence",w:["A farming village","A trading market","A religious temple"],e:"Castles had thick walls, towers, and moats to protect against enemy attacks."},
        {q:"What is a moat?",a:"A deep ditch filled with water around a castle",w:["A garden inside a castle","A road leading to a castle","A tower on a castle wall"],e:"Moats made it difficult for enemies to reach and climb castle walls."},
        {q:"What was the Silk Road?",a:"A network of trade routes connecting East and West",w:["A road made of silk fabric","A single road in China only","A modern highway system"],e:"The Silk Road was a network of trade routes connecting China to Europe."},
        {q:"What did Marco Polo do?",a:"Travelled from Europe to China and wrote about it",w:["Invented the compass","Discovered America","Built the Great Wall"],e:"Marco Polo's travels introduced Europeans to Asian culture, goods, and innovations."},
        {q:"What is the significance of paper in the medieval period?",a:"It made knowledge easier to share and preserve",w:["It was used only for art","It was too expensive for common use","It was only used in China"],e:"Paper, invented in China and spread via the Islamic world, replaced expensive parchment."},
        {q:"What was the role of monks in medieval Europe?",a:"They preserved books, educated people, and helped the poor",w:["They fought in wars","They ruled kingdoms","They traded in markets"],e:"Monks in monasteries copied manuscripts, ran schools, and provided charity."},
        {q:"What is a manuscript?",a:"A handwritten book or document",w:["A printed book from a factory","A digital document on a computer","A spoken story passed down orally"],e:"Before printing presses, all books were carefully handwritten by scribes."},
        {q:"What was the Reconquista?",a:"The Christian reconquest of Spain from Muslim rule",w:["The discovery of America","The Crusades in the Middle East","The fall of the Roman Empire"],e:"The Reconquista (722-1492) ended with the fall of Granada, the last Muslim state in Spain."},
        {q:"What did the fall of Constantinople (1453) mark?",a:"The end of the Byzantine Empire",w:["The beginning of the Roman Empire","The start of the Crusades","The discovery of India"],e:"The Ottoman conquest of Constantinople ended the Byzantine Empire after 1000 years."},
      ],
      // World 4: Renaissance & Exploration
      [
        {q:"What does 'Renaissance' mean?",a:"Rebirth",w:["Destruction","Isolation","Revolution"],e:"The Renaissance was a rebirth of interest in art, science, and learning from ancient Greece and Rome."},
        {q:"Where did the Renaissance begin?",a:"Italy",w:["France","England","Germany"],e:"The Renaissance began in Italian city-states like Florence, Venice, and Milan."},
        {q:"Who painted the Mona Lisa?",a:"Leonardo da Vinci",w:["Michelangelo","Raphael","Vincent van Gogh"],e:"Leonardo da Vinci painted the Mona Lisa around 1503-1519."},
        {q:"What did Renaissance artists focus on?",a:"Realism, perspective, and human form",w:["Abstract shapes only","Random colour patterns","Flat patterns with no depth"],e:"Renaissance artists studied human anatomy and used mathematical perspective."},
        {q:"Who invented the printing press?",a:"Johannes Gutenberg",w:["Leonardo da Vinci","Galileo Galilei","William Shakespeare"],e:"Gutenberg's printing press (c. 1440) revolutionised the spread of knowledge."},
        {q:"Which explorer reached the Americas in 1492?",a:"Christopher Columbus",w:["Vasco da Gama","Marco Polo","Ferdinand Magellan"],e:"Columbus sailed west for India but reached the Caribbean islands instead."},
        {q:"Which explorer first sailed around the world?",a:"Ferdinand Magellan",w:["Christopher Columbus","Vasco da Gama","Captain Cook"],e:"Magellan's expedition (1519-1522) was the first to circumnavigate the globe."},
        {q:"What were explorers looking for?",a:"New trade routes, gold, and spices",w:["New animals for zoos","New recipes for cooking","New games to play"],e:"European explorers sought wealth and direct sea routes to Asia for spices."},
        {q:"What was the Columbian Exchange?",a:"Transfer of plants, animals, and diseases between Old and New Worlds",w:["A currency exchange system","A scientific conference","A peace treaty between nations"],e:"The Columbian Exchange transformed agriculture, diets, and populations worldwide."},
        {q:"How did exploration change world maps?",a:"Maps became more accurate with new lands added",w:["Maps became less accurate","Maps stayed the same","Maps were no longer needed"],e:"New discoveries led to more complete and accurate world maps."},
        {q:"Who was Michelangelo?",a:"A sculptor, painter, and architect of the Renaissance",w:["A medieval king","A Chinese explorer","An Indian mathematician"],e:"Michelangelo created the statue of David and painted the Sistine Chapel ceiling."},
        {q:"What is perspective in art?",a:"A technique to create the illusion of depth on a flat surface",w:["Painting only faces","Using only one colour","Drawing only small objects"],e:"Perspective uses a vanishing point to make flat paintings look three-dimensional."},
        {q:"What did the printing press allow?",a:"Books to be produced faster and cheaper",w:["Only kings to read books","Books to become more expensive","Only religious texts to be printed"],e:"The printing press made books affordable, spreading literacy and new ideas."},
        {q:"Who was Shakespeare?",a:"England's greatest playwright and poet",w:["An Italian painter","A Spanish explorer","A French scientist"],e:"Shakespeare wrote Romeo and Juliet, Hamlet, Macbeth, and many other plays."},
        {q:"What is humanism?",a:"A focus on human values and achievements rather than only religion",w:["A religion that worships humans","A scientific method for experiments","A type of government system"],e:"Humanism emphasised education, individual achievement, and the study of classical texts."},
        {q:"What did Galileo discover?",a:"Moons orbiting Jupiter and mountains on the Moon",w:["The Earth is flat","The Sun orbits the Earth","America is a continent"],e:"Galileo used a telescope to discover Jupiter's moons and lunar mountains."},
        {q:"Who proved the Earth orbits the Sun?",a:"Nicolaus Copernicus (later Galileo)",w:["Ptolemy of Egypt","Aristotle of Greece","Christopher Columbus"],e:"Copernicus proposed the heliocentric model where the Earth orbits the Sun."},
        {q:"What is a compass used for?",a:"Finding direction using Earth's magnetic field",w:["Drawing circles on paper","Measuring temperature","Telling time accurately"],e:"The magnetic compass was crucial for navigation during the Age of Exploration."},
        {q:"Who was Vasco da Gama?",a:"The first European to reach India by sea",w:["The first man on the moon","The inventor of the telescope","The painter of the Mona Lisa"],e:"Vasco da Gama sailed around Africa to reach India in 1498."},
        {q:"What did explorers bring back from the Americas?",a:"Potatoes, tomatoes, maize, and chocolate",w:["Computers and phones","Cars and trains","Televisions and radios"],e:"New World crops like potatoes and tomatoes transformed European agriculture."},
        {q:"What was the triangular trade?",a:"Trade routes connecting Europe, Africa, and the Americas",w:["Trade between three cities in Italy","Trade of triangular-shaped goods","Trade only during the daytime"],e:"The triangular trade involved manufactured goods, enslaved people, and raw materials."},
        {q:"What is a colony?",a:"A territory controlled by another country",w:["An independent nation","A type of animal group","A natural forest area"],e:"European powers established colonies to extract resources and expand their empires."},
        {q:"What was the Scientific Revolution?",a:"A period when science replaced traditional beliefs",w:["A political revolution in France","A religious war in Germany","An artistic movement in Italy"],e:"The Scientific Revolution (16th-17th century) established modern scientific methods."},
        {q:"What did explorers use to navigate?",a:"Compass, astrolabe, and star charts",w:["GPS satellites","Mobile phone maps","Radar systems"],e:"Explorers used the compass, astrolabe (for measuring star positions), and star charts."},
        {q:"What was the Encomienda system?",a:"Spanish system granting colonists control over indigenous people",w:["A system of free education","A method of farming","A type of ship design"],e:"The Encomienda system exploited indigenous labour in Spanish colonies."},
        {q:"What did the Renaissance spread to?",a:"All of Europe",w:["Only Italy","Only France","Only England"],e:"The Renaissance began in Italy and gradually spread across all of Europe."},
        {q:"What was the Reformation?",a:"A religious movement that split the Christian church",w:["An artistic movement","A scientific discovery","A military campaign"],e:"The Reformation (1517) led by Martin Luther split the Catholic Church."},
        {q:"What did astronomers study during the Renaissance?",a:"The movement of planets and stars",w:["The weather on Earth","The ocean currents","The soil composition"],e:"Renaissance astronomers like Copernicus and Galileo studied celestial bodies."},
        {q:"How did the Renaissance change education?",a:"It promoted learning in arts, science, and classical texts",w:["It banned all schools","It only taught religion","It discouraged reading books"],e:"The Renaissance established schools and universities focused on a broad liberal education."},
        {q:"What legacy did the Renaissance leave?",a:"Modern art, science, and the spirit of inquiry",w:["Only ancient buildings","Only religious paintings","Only musical compositions"],e:"The Renaissance laid the foundation for modern Western art, science, and critical thinking."},
      ],
      // World 5: Government & Citizenship
      [
        {q:"What is a monarchy?",a:"A government ruled by a king or queen",w:["A government where people vote for leaders","A government ruled by the military","A government with no leader at all"],e:"In a monarchy, power is inherited by members of a royal family."},
        {q:"What is a democracy?",a:"A government where people choose leaders by voting",w:["A government ruled by one person","A government ruled by wealthy people only","A government with no laws"],e:"Democracy means 'rule by the people' in Greek."},
        {q:"What is a dictatorship?",a:"A government controlled by one person with absolute power",w:["A government with elected representatives","A government with many political parties","A government ruled by judges only"],e:"In a dictatorship, one person makes all decisions without citizen input."},
        {q:"What is a citizen?",a:"A legal member of a country with rights and responsibilities",w:["A visitor to a country on holiday","A tourist exploring a city","A person living illegally in a country"],e:"Citizens have rights (like voting) and duties (like obeying laws and paying taxes)."},
        {q:"What are rights?",a:"Freedoms and protections that every person deserves",w:["Rules that people must follow","Punishments for breaking laws","Special privileges for rich people only"],e:"Rights include freedom of speech, education, equality, and fair treatment."},
        {q:"What are responsibilities of citizens?",a:"Obeying laws, voting, and helping the community",w:["Only paying taxes","Only following traffic rules","No responsibilities at all"],e:"Citizens have both rights and responsibilities to their country and community."},
        {q:"What does UN stand for?",a:"United Nations",w:["Union of Nations","Universal Network","United Network"],e:"The UN is an international organisation founded in 1945 after World War II."},
        {q:"Where is the UN headquarters?",a:"New York, USA",w:["London, UK","Paris, France","Geneva, Switzerland"],e:"The UN headquarters is located in New York City, USA."},
        {q:"What is the main goal of the UN?",a:"To maintain international peace and security",w:["To start wars between countries","To make money for rich nations","To build roads in all countries"],e:"The UN was created after WWII to prevent future conflicts and promote cooperation."},
        {q:"What is UNESCO?",a:"A UN agency for education, science, and culture",w:["A military organisation","A banking system","A trade union"],e:"UNESCO protects world heritage sites and promotes education worldwide."},
        {q:"What is the Constitution?",a:"The supreme law of a country",w:["A list of popular songs","A collection of fairy tales","A map of the country"],e:"A Constitution defines the structure of government and the rights of citizens."},
        {q:"What is Parliament?",a:"The group of elected representatives who make laws",w:["A group of religious leaders","A team of sports players","A panel of judges in court"],e:"In a democracy, Parliament (or Congress) is where laws are debated and passed."},
        {q:"What is the rule of law?",a:"Everyone must follow the law, including leaders",w:["Only poor people must follow laws","Leaders are above the law","Laws are only suggestions"],e:"The rule of law means no one is above the law - everyone is treated equally."},
        {q:"What is voting?",a:"Choosing representatives or decisions by casting a ballot",w:["A type of sport competition","A musical performance","A religious ceremony"],e:"Voting is how citizens participate in a democracy by choosing their leaders."},
        {q:"What is freedom of speech?",a:"The right to express opinions without fear",w:["The right to break any law","The right to ignore all rules","The right to hurt others physically"],e:"Freedom of speech allows people to share ideas, but not to harm others with words."},
        {q:"What is equality?",a:"Treating all people with the same respect and rights",w:["Giving everyone the same amount of money","Making everyone look the same","Forcing everyone to think the same"],e:"Equality means everyone has the same rights and opportunities regardless of background."},
        {q:"What is a political party?",a:"A group of people with similar ideas who want to govern",w:["A group of musicians","A sports team","A business company"],e:"Political parties compete in elections to win seats in Parliament and form government."},
        {q:"What is an election?",a:"A formal process where citizens choose their leaders",w:["A meeting to discuss weather","A celebration of a holiday","A competition between schools"],e:"Elections allow citizens to vote for representatives who will make decisions for them."},
        {q:"What is a referendum?",a:"A direct vote by citizens on a specific issue",w:["A vote only by politicians","A vote by judges in court","A vote by foreign citizens"],e:"A referendum lets citizens vote directly on important issues, not just choose leaders."},
        {q:"What is the judiciary?",a:"The system of courts that interprets and applies laws",w:["The group that makes new laws","The group that enforces laws on streets","The group that collects taxes"],e:"The judiciary (courts and judges) ensures laws are applied fairly and interprets them."},
        {q:"What is the executive branch?",a:"The part of government that implements and enforces laws",w:["The part that writes new laws","The part that judges court cases","The part that prints money only"],e:"The executive branch (led by the Prime Minister or President) runs the government."},
        {q:"What is the legislative branch?",a:"The part of government that makes laws",w:["The part that enforces laws","The part that judges court cases","The part that builds roads"],e:"The legislative branch (Parliament/Congress) creates, debates, and passes laws."},
        {q:"What is a bill?",a:"A proposed new law",w:["A payment for electricity","A type of bird","A piece of paper money"],e:"A bill is a proposed law that must be debated and voted on before becoming law."},
        {q:"What is a treaty?",a:"A formal agreement between countries",w:["A type of traditional clothing","A celebration of independence","A style of ancient architecture"],e:"Treaties are legally binding agreements between nations on trade, peace, or borders."},
        {q:"What is diplomacy?",a:"The practice of managing relations between countries",w:["A type of military attack","A form of ancient medicine","A style of classical music"],e:"Diplomacy involves negotiation, dialogue, and peaceful resolution of disputes."},
        {q:"What is an ambassador?",a:"A representative of one country in another country",w:["A military general","A business CEO","A famous artist"],e:"Ambassadors live in foreign countries and represent their home country's interests."},
        {q:"What is a refugee?",a:"A person forced to leave their country due to danger",w:["A person travelling for holiday","A person moving for a better job","A person visiting family abroad"],e:"Refugees flee war, persecution, or natural disasters and seek safety in other countries."},
        {q:"What are human rights?",a:"Basic rights that every person has from birth",w:["Rights only for citizens of rich countries","Rights that must be purchased","Rights only for adults over 18"],e:"Human rights (like the right to life, education, and freedom) belong to every person."},
        {q:"What is the Universal Declaration of Human Rights?",a:"A UN document listing rights for all people",w:["A book of ancient laws","A constitution for one country","A trade agreement between nations"],e:"Adopted in 1948, it defines fundamental human rights for all people worldwide."},
        {q:"What is civic duty?",a:"Responsibilities citizens have towards their community",w:["Only paying taxes","Only obeying the speed limit","Volunteering and participating in community life"],e:"Civic duties include voting, jury service, volunteering, and respecting others' rights."},
      ],
      // World 6: Trade & Economics
      [
        {q:"What is trade?",a:"The exchange of goods and services between people or countries",w:["Stealing goods from others","Making things only for yourself","Giving away things for free to everyone"],e:"Trade allows people to obtain things they cannot produce themselves."},
        {q:"What was the Silk Road?",a:"An ancient trade route connecting China to Europe",w:["A road made of silk fabric","A road that only sold silk","A modern highway in China"],e:"The Silk Road traded silk, spices, ideas, and cultures between East and West."},
        {q:"What is barter?",a:"Exchanging goods directly without using money",w:["Buying with cash","Using credit cards","Online banking"],e:"Barter is the oldest form of trade where goods are swapped directly."},
        {q:"What is an economy?",a:"The system of producing, distributing, and consuming goods",w:["A type of government","A form of religion","A style of music"],e:"An economy includes all activities related to making and using resources."},
        {q:"What is supply and demand?",a:"How much is available vs how much people want",w:["How much is produced vs wasted","How much costs vs sells","How much is imported vs exported"],e:"Prices are affected by how much supply exists and how much demand there is."},
        {q:"What is globalization?",a:"The increasing connection between countries through trade and technology",w:["Isolation of countries from each other","Closing of all borders","Stopping all international trade"],e:"Globalization means the world is becoming more connected and interdependent."},
        {q:"What are imports?",a:"Goods brought into a country from another country",w:["Goods sent out of a country","Goods made in the same country","Goods that are recycled"],e:"Countries import goods they need but cannot produce efficiently themselves."},
        {q:"What are exports?",a:"Goods sent out of a country to another country",w:["Goods brought into a country","Goods kept for local use","Goods that are thrown away"],e:"Countries export goods they produce well to earn money from other nations."},
        {q:"What is fair trade?",a:"Trade that ensures producers get fair prices",w:["Trade that is free for all with no rules","Trade with no taxes or tariffs","Trade that only helps rich countries"],e:"Fair trade aims to give fair wages and better working conditions to producers."},
        {q:"How has technology changed trade?",a:"Made it faster and easier to trade globally",w:["Made trade impossible","Slowed down all trade","Only helped local trade"],e:"The internet and modern transport have made global trade much easier."},
        {q:"What is currency?",a:"Money used as a medium of exchange in a country",w:["A type of food grain","A style of clothing","A form of transportation"],e:"Currency (like rupees, dollars, euros) is the money accepted in a country for trade."},
        {q:"What is a market?",a:"A place where buyers and sellers exchange goods",w:["A place for playing sports","A place for religious worship","A place for government meetings"],e:"Markets can be physical (shops, bazaars) or virtual (online stores)."},
        {q:"What is a producer?",a:"Someone who makes goods or provides services",w:["Someone who only buys things","Someone who sells used items","Someone who saves money"],e:"Producers create goods (like farmers, manufacturers) or provide services (like teachers)."},
        {q:"What is a consumer?",a:"Someone who buys and uses goods or services",w:["Someone who makes products","Someone who sells products","Someone who donates products"],e:"Consumers are the people who purchase and use the goods and services produced."},
        {q:"What is scarcity?",a:"When there is not enough of something to satisfy everyone's wants",w:["When there is too much of something","When something is free for all","When everyone has enough"],e:"Scarcity forces people to make choices about how to use limited resources."},
        {q:"What is a budget?",a:"A plan for how to spend money",w:["A type of bank account","A form of tax payment","A way to earn interest"],e:"A budget helps individuals, families, and governments manage their money wisely."},
        {q:"What is profit?",a:"Money earned after all costs are paid",w:["Total money received from sales","Money spent on making products","Money donated to charity"],e:"Profit = Revenue - Costs. It is the money left over after all expenses."},
        {q:"What is a tariff?",a:"A tax on imported goods",w:["A type of imported food","A discount on exports","A subsidy for local farmers"],e:"Tariffs are taxes placed on imported goods to protect local industries."},
        {q:"What is inflation?",a:"A general increase in prices over time",w:["A decrease in prices","A stable price level","An increase in product quality"],e:"Inflation means money buys less over time as prices of goods and services rise."},
        {q:"What is a bank?",a:"A financial institution that accepts deposits and gives loans",w:["A shop that sells goods","A warehouse for storing food","A government office for taxes"],e:"Banks keep money safe, provide loans, and help people manage their finances."},
        {q:"What is interest?",a:"Money paid for borrowing or earned on savings",w:["A fee for opening an account","A tax on spending money","A fine for late payment"],e:"Banks charge interest on loans and pay interest on savings accounts."},
        {q:"What is credit?",a:"Borrowing money with a promise to pay it back later",w:["Free money that does not need repayment","Money earned from working","Money donated by the government"],e:"Credit allows people to buy things now and pay for them over time."},
        {q:"What is entrepreneurship?",a:"Starting and running a new business",w:["Working for the government","Studying in a university","Retiring from a job"],e:"Entrepreneurs take risks to start businesses that create products, services, and jobs."},
        {q:"What is a cooperative?",a:"A business owned and run by its members",w:["A business owned by one person","A business owned by the government","A business owned by foreign investors"],e:"Cooperatives are democratically run by members who share the profits."},
        {q:"What is a monopoly?",a:"When one company controls the entire market",w:["When many companies compete fairly","When two companies share the market","When customers control prices"],e:"A monopoly exists when one company is the only seller of a product with no competition."},
        {q:"What is advertising?",a:"Promoting products to encourage people to buy them",w:["Hiding information about products","Giving products away for free","Storing products in warehouses"],e:"Advertising uses media (TV, internet, billboards) to persuade consumers."},
        {q:"What is a trade surplus?",a:"When a country exports more than it imports",w:["When a country imports more than it exports","When a country does not trade at all","When a country only trades locally"],e:"A trade surplus means a country earns more from exports than it spends on imports."},
        {q:"What is a trade deficit?",a:"When a country imports more than it exports",w:["When a country exports more than it imports","When trade is perfectly balanced","When a country has no imports"],e:"A trade deficit means a country spends more on imports than it earns from exports."},
        {q:"What is sustainable development?",a:"Meeting current needs without harming future generations",w:["Using all resources as quickly as possible","Stopping all economic growth","Building only in cities"],e:"Sustainable development balances economic growth with environmental protection."},
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }
  // ============ ENGLISH TEXTBOOK - Communicate with Cambridge (10 worlds × 30 questions) ============
  static engTextbook(worldId: number, n = 30): MathQuestion[] {
    const passages: any[] = [
      // World 1: Chuskit Goes to School
      [
        {q:"What is Chuskit's biggest challenge in going to school?",a:"There are no proper roads for her wheelchair",w:["She has no books to study","She has no friends at school","She does not like studying"],e:"The village paths are not wheelchair-accessible, making it hard for her to reach school."},
        {q:"Who helps Chuskit overcome her obstacles?",a:"The whole community working together",w:["A magic genie appears to help","Nobody in the village cares","Only the school principal helps"],e:"When communities come together, they can remove barriers for people with disabilities."},
        {q:"What does Chuskit's story teach us?",a:"Determination and community support can overcome difficulties",w:["School is not important for anyone","It is better to stay home and rest","Only rich children can study well"],e:"With determination and community help, any obstacle can be overcome."},
        {q:"How can we show kindness to someone with physical challenges?",a:"By building accessible paths and including them",w:["By ignoring their difficulties","By telling them to stay home","By giving them money only"],e:"Building ramps, accessible paths, and including everyone shows true kindness."},
        {q:"Where is Chuskit's story set?",a:"A mountain village in India",w:["A beach town in Kerala","A big city like Mumbai","A desert village in Rajasthan"],e:"Mountain regions in northern India have high altitudes and challenging terrain."},
        {q:"Why is education important for every child?",a:"Every child deserves a chance to learn and grow",w:["Only some children should study","School is boring and useless","Education is not useful in villages"],e:"Education is a fundamental right for every child, regardless of their situation."},
        {q:"What quality does Chuskit show by never giving up?",a:"Determination and courage",w:["Fear and weakness","Laziness and avoidance","Selfishness and pride"],e:"Never giving up despite difficulties shows determination and courage."},
        {q:"How do friends and neighbours help Chuskit?",a:"By working together to solve problems",w:["By pretending not to notice","By laughing at her struggles","By avoiding her completely"],e:"Working together as a community can create positive change for everyone."},
        {q:"What is inclusion?",a:"Making sure everyone can participate equally",w:["Keeping some people separate","Only helping yourself","Ignoring people's differences"],e:"Inclusion means ensuring everyone, regardless of ability, can participate in all activities."},
        {q:"What is the main theme of Chuskit's story?",a:"Courage, inclusion, and the power of community",w:["War and military victory","Magic and supernatural powers","Wealth and material success"],e:"Stories about overcoming challenges teach us about courage, inclusion, and community support."},
        {q:"What does 'accessibility' mean?",a:"Making places usable by everyone including people with disabilities",w:["Building very tall buildings","Making everything very expensive","Keeping certain areas private"],e:"Accessibility means designing spaces so people with disabilities can use them independently."},
        {q:"How does Chuskit feel about going to school?",a:"She is determined and eager to learn",w:["She is afraid of school","She thinks school is boring","She does not care about education"],e:"Despite her challenges, Chuskit remains eager to learn and attend school."},
        {q:"What role does the village community play?",a:"They come together to build a path for Chuskit",w:["They discourage Chuskit from studying","They ignore Chuskit's problem","They move Chuskit to another village"],e:"The community recognises the barrier and works together to build an accessible path."},
        {q:"Why do mountain villages face challenges for accessibility?",a:"The terrain is rough and paths are steep",w:["There are too many roads","The weather is always perfect","There are no people living there"],e:"Mountain terrain with steep, uneven paths makes wheelchair access very difficult."},
        {q:"What can schools do to be more inclusive?",a:"Build ramps and adapt classrooms for all students",w:["Only admit certain students","Make classrooms more difficult","Ignore students with disabilities"],e:"Inclusive schools provide ramps, adapted facilities, and support for all students."},
        {q:"What does Chuskit use to move around?",a:"A wheelchair",w:["A bicycle","A horse","A car"],e:"Chuskit uses a wheelchair, which requires smooth, accessible paths to move around."},
        {q:"Why do the villagers build a path for Chuskit?",a:"Because every child deserves to go to school",w:["Because the government ordered them","Because they want a reward","Because it is a holiday project"],e:"The villagers believe every child has the right to education and works to make it possible."},
        {q:"What is a 'barrier'?",a:"Something that blocks or prevents progress",w:["A type of bridge","A helper or assistant","A reward for good work"],e:"A barrier is an obstacle that prevents someone from doing what they want or need to do."},
        {q:"How can children practise inclusion at school?",a:"By including everyone in games and activities",w:["By only playing with best friends","By avoiding different people","By competing against everyone"],e:"True inclusion means inviting and involving everyone, regardless of differences."},
        {q:"What mountain range is in northern India?",a:"The Himalayas",w:["The Alps","The Andes","The Rockies"],e:"The Himalayas are the world's highest mountain range, located in northern India."},
        {q:"What does 'disability' mean?",a:"A condition that makes some activities more difficult",w:["Something that prevents all activities","A temporary illness like a cold","Something that only affects old people"],e:"A disability is a physical or mental condition that may limit some activities."},
        {q:"How can ramps help people?",a:"They provide smooth access for wheelchairs",w:["They make buildings look taller","They are only for decoration","They block people from entering"],e:"Ramps replace stairs, making buildings accessible for wheelchairs and strollers."},
        {q:"What is empathy?",a:"Understanding and sharing the feelings of others",w:["Ignoring other people's problems","Feeling sorry for yourself","Being angry at everyone"],e:"Empathy means putting yourself in someone else's shoes and understanding their feelings."},
        {q:"What do we call someone who never gives up?",a:"Determined and resilient",w:["Lazy and careless","Weak and afraid","Stubborn and rude"],e:"Resilience is the ability to keep trying despite difficulties and setbacks."},
        {q:"Why is it important to help others?",a:"It creates a stronger, kinder community",w:["Only to get rewards","Only when forced to","It is not important at all"],e:"Helping others builds trust, kindness, and a community where everyone thrives."},
        {q:"What does 'community' mean?",a:"A group of people living in the same area who help each other",w:["Only your family members","Only your classmates","Only people who are the same"],e:"A community includes neighbours, friends, and all people who share a common area or goal."},
        {q:"What can we learn from Chuskit?",a:"To be brave and never give up on our dreams",w:["To avoid challenges","To depend only on others","To stay home when things are hard"],e:"Chuskit teaches us that determination and courage can help us achieve our goals."},
        {q:"What is the Right to Education?",a:"Every child has the right to go to school",w:["Only some children can study","Education is only for cities","School is optional for girls"],e:"The Right to Education Act ensures free and compulsory education for all children."},
        {q:"How can we make our school more inclusive?",a:"By welcoming and supporting all students",w:["By excluding different students","By making fun of others","By ignoring people's needs"],e:"Inclusive schools welcome all students and provide support for different needs."},
        {q:"What does Chuskit's wheelchair symbolise?",a:"Both her challenge and her determination",w:["That she cannot do anything","That she is different in a bad way","That she does not need help"],e:"The wheelchair represents both the physical barrier she faces and her determination to overcome it."},
      ],
      // World 2: Thunder Cake
      [
        {q:"What is the girl in 'Thunder Cake' afraid of?",a:"Thunderstorms",w:["The dark at night","Meeting new people","Going to school"],e:"The story is about a young girl who fears thunderstorms and learns to overcome her fear."},
        {q:"Who helps the girl overcome her fear of thunder?",a:"Her grandmother (Babushka)",w:["Her school teacher","A famous scientist","Her pet dog"],e:"The grandmother helps the girl face her fear through a special activity together."},
        {q:"What do they bake together during the thunderstorm?",a:"Thunder Cake",w:["Chocolate cookies","Apple pie","Banana bread"],e:"They bake a special 'Thunder Cake' together while the thunderstorm rages outside."},
        {q:"What does the grandmother teach the girl?",a:"That counting between lightning and thunder tells how far away the storm is",w:["That thunder is caused by monsters","That storms are always dangerous","That lightning never strikes the same place twice"],e:"Counting seconds between lightning flash and thunder sound tells the storm's distance."},
        {q:"What is the main theme of 'Thunder Cake'?",a:"Overcoming fear with the help of loved ones",w:["Learning to bake cakes","The science of thunderstorms","Moving to a new house"],e:"The story shows how family love and support can help us face our fears."},
        {q:"Where does the story take place?",a:"On a farm in the countryside",w:["In a big city apartment","On a tropical island","In a mountain village"],e:"The story is set on a farm where the girl experiences thunderstorms."},
        {q:"What ingredients do they need for Thunder Cake?",a:"Eggs, milk, tomatoes, chocolate and more",w:["Just flour and water","Only sugar and butter","Rice and vegetables"],e:"The grandmother gathers various ingredients from around the farm for the special cake."},
        {q:"What does 'Babushka' mean?",a:"Grandmother in Russian",w:["Mother in Russian","Sister in Russian","Aunt in Russian"],e:"Babushka is the Russian word for grandmother."},
        {q:"How does the girl feel at the end of the story?",a:"Proud and no longer afraid of thunder",w:["Still very frightened","Angry at the storm","Sad that the storm ended"],e:"By completing the cake, the girl realises she has overcome her fear of thunder."},
        {q:"What can we learn from 'Thunder Cake'?",a:"Facing our fears with support makes us stronger",w:["We should always avoid scary things","Thunderstorms are always very dangerous","Baking cake is the only way to be brave"],e:"The story teaches that with love and courage, we can overcome our fears."},
        {q:"What is a thunderstorm?",a:"A storm with thunder, lightning, and usually rain",w:["A storm with only wind","A snowstorm in winter","A storm at sea only"],e:"Thunderstorms produce lightning, thunder, and often heavy rain."},
        {q:"What causes thunder?",a:"The rapid expansion of air heated by lightning",w:["Clouds crashing together","Rain falling very fast","Wind blowing through trees"],e:"Lightning heats the air to about 30,000°C, causing it to expand rapidly - that's thunder."},
        {q:"How can you tell how far away lightning is?",a:"Count seconds between lightning and thunder, divide by 3",w:["Look at how bright the lightning is","Listen to how loud the thunder is","Measure the wind speed"],e:"Sound travels about 1 km in 3 seconds, so counting tells you the distance."},
        {q:"What does the grandmother represent?",a:"Wisdom, love, and patience",w:["Fear and anxiety","Anger and frustration","Doubt and worry"],e:"The grandmother symbolises the wisdom and patience of elders who guide us."},
        {q:"Why does gathering ingredients help the girl?",a:"It distracts her and gives her courage",w:["It makes the storm go away","It changes the weather","It stops the thunder completely"],e:"Keeping busy and having a goal helps take her mind off the fear."},
        {q:"What is courage?",a:"Being brave even when you feel afraid",w:["Never feeling afraid at all","Being stronger than everyone","Ignoring danger completely"],e:"Courage is not the absence of fear, but the ability to act despite feeling afraid."},
        {q:"How does the grandmother show she understands the girl?",a:"She acknowledges the fear but gently encourages her",w:["She tells her to stop being silly","She ignores the girl's fear","She forces the girl outside"],e:"The grandmother validates the girl's feelings while helping her face the fear."},
        {q:"What role does distraction play?",a:"It helps the girl focus on something positive instead of her fear",w:["It makes the storm worse","It has no effect at all","It makes the girl more scared"],e:"Distraction through activity can help manage anxiety and fear."},
        {q:"What ingredients come from the farm?",a:"Eggs from chickens, milk from cows, tomatoes from the garden",w:["Only items from the supermarket","Only water and flour","Only chocolate and sugar"],e:"They gather fresh ingredients from around the farm - eggs, milk, and vegetables."},
        {q:"What does the cake symbolise?",a:"The girl's courage and achievement",w:["Just a dessert to eat","The grandmother's cooking skill","The storm's destructive power"],e:"The completed cake represents the girl's victory over her fear."},
        {q:"Why are grandmothers important in stories?",a:"They represent wisdom, tradition, and unconditional love",w:["They are only for cooking","They do not understand children","They are not important characters"],e:"Grandmothers in stories often guide and nurture the younger generation."},
        {q:"What is personification in literature?",a:"Giving human qualities to non-human things",w:["Writing about real people only","Describing places in detail","Using only facts and no imagination"],e:"Thunder Cake personifies the storm as something that can be faced and overcome."},
        {q:"How can we help someone who is afraid?",a:"Be patient, understanding, and help them face their fear gradually",w:["Tell them to stop being afraid","Ignore their fear completely","Force them into scary situations"],e:"Gentle support and gradual exposure help people overcome fears."},
        {q:"What is a 'coping strategy'?",a:"A way to deal with difficult feelings or situations",w:["A way to avoid all problems","A way to ignore feelings","A way to make problems worse"],e:"Coping strategies like distraction, breathing, or talking help us manage fear."},
        {q:"What weather comes with thunderstorms?",a:"Lightning, thunder, rain, and sometimes wind",w:["Only sunshine and clouds","Only snow and ice","Only fog and mist"],e:"Thunderstorms typically include lightning, thunder, rain, and gusty winds."},
        {q:"What does 'bravery' mean?",a:"Facing something difficult or scary despite fear",w:["Never being afraid of anything","Being stronger than others","Ignoring all warnings"],e:"Bravery is acting even when you feel scared or uncertain."},
        {q:"How does the setting (farm) add to the story?",a:"It makes the storm feel more intense and isolating",w:["It makes the storm less scary","It has no effect on the story","It makes the story boring"],e:"The rural setting without city distractions makes the storm feel more powerful."},
        {q:"What does the girl learn about herself?",a:"She is braver than she thought",w:["She should always stay inside","She is too weak to face fears","She needs someone to protect her always"],e:"The story shows that we often have more courage than we realise."},
        {q:"What is the value of family traditions?",a:"They create bonds and shared memories across generations",w:["They are outdated and useless","They only cause arguments","They are only for holidays"],e:"Baking Thunder Cake becomes a meaningful family tradition."},
        {q:"How does cooking together build relationships?",a:"It creates shared experiences and communication",w:["It causes fights and arguments","It is boring and wasteful","It has no effect on relationships"],e:"Shared activities like cooking create bonds and opportunities for conversation."},
      ],
      // World 3: Peter Pan
      [
        {q:"Where does Peter Pan live?",a:"Neverland",w:["London","Paris","New York"],e:"Peter Pan lives in the magical island of Neverland where children never grow up."},
        {q:"What is special about Peter Pan?",a:"He never grows up",w:["He is the tallest boy","He has magical powers","He is the richest child"],e:"Peter Pan is the boy who never grows up - he represents eternal childhood."},
        {q:"Who are the Lost Boys?",a:"Boys who fell out of their prams and were forgotten",w:["Peter Pan's brothers","Pirates who became good","Fairies in human form"],e:"The Lost Boys are children who fell out of their prams and were taken to Neverland."},
        {q:"Who is Wendy in the story?",a:"A girl who flies to Neverland with Peter",w:["Peter Pan's mother","Captain Hook's daughter","A fairy who helps Peter"],e:"Wendy Darling flies to Neverland with Peter and becomes a mother figure to the Lost Boys."},
        {q:"Who is the main villain in Peter Pan?",a:"Captain Hook",w:["Mr. Smee","Tinker Bell","The Crocodile"],e:"Captain Hook is the pirate captain who lost his hand to a crocodile and seeks revenge."},
        {q:"What is Tinker Bell?",a:"A fairy",w:["A bird","A butterfly","A star"],e:"Tinker Bell is a fairy who is Peter Pan's loyal companion and friend."},
        {q:"How do Peter and the children fly?",a:"With fairy dust and happy thoughts",w:["With magic carpets","With aeroplanes","With broomsticks"],e:"Tinker Bell sprinkles them with fairy dust, and thinking happy thoughts lets them fly."},
        {q:"What does Captain Hook fear most?",a:"The crocodile that took his hand",w:["Peter Pan's sword","The Lost Boys","Tinker Bell"],e:"A crocodile ate Hook's hand and now follows him, ticking because it also swallowed a clock."},
        {q:"What is the moral of Peter Pan?",a:"Childhood innocence and imagination are precious",w:["Growing up is always bad","Adults are always wrong","Children should never listen to parents"],e:"Peter Pan celebrates childhood imagination while showing growing up has its own value."},
        {q:"Who wrote Peter Pan?",a:"J.M. Barrie",w:["Charles Dickens","Lewis Carroll","Roald Dahl"],e:"J.M. Barrie wrote Peter Pan, which first appeared as a play in 1904."},
        {q:"What is Neverland?",a:"An imaginary island where adventures happen",w:["A real island in the Pacific","A theme park in London","A restaurant in Paris"],e:"Neverland is a fictional magical island where Peter Pan and the Lost Boys live."},
        {q:"What are mermaids in Peter Pan?",a:"Magical creatures who live in the lagoon",w:["Pirates in disguise","Lost Girls who fell in water","Statues in the garden"],e:"The mermaids in the Mermaid Lagoon are beautiful but can be dangerous."},
        {q:"What does the crocodile symbolise?",a:"Time catching up with you",w:["Friendship and loyalty","Wealth and power","Beauty and grace"],e:"The ticking crocodile represents time that eventually catches up with everyone."},
        {q:"Who are the Darling children?",a:"Wendy, John, and Michael",w:["Peter, Paul, and Mary","Tom, Dick, and Harry","Anne, Mary, and Jane"],e:"The three Darling children who fly to Neverland with Peter Pan."},
        {q:"What does Peter Pan forget?",a:"Things quickly because he lives in the moment",w:["His own name","How to fly","Where Neverland is"],e:"Peter forgets people and events quickly because he lives entirely in the present."},
        {q:"What is the significance of the ticking clock?",a:"It reminds Captain Hook of the crocodile",w:["It tells the time in London","It is Peter Pan's alarm","It counts down to an explosion"],e:"The ticking clock the crocodile swallowed warns Hook of its approach."},
        {q:"What does Wendy decide at the end?",a:"To return home and grow up",w:["To stay in Neverland forever","To become a pirate","To marry Captain Hook"],e:"Wendy chooses to return home, accepting that growing up is a natural part of life."},
        {q:"What is imagination in Peter Pan?",a:"The power to believe and create magic",w:["A form of lying","Something only children have","A useless daydream"],e:"Imagination is the key to magic in Neverland - you must believe for it to work."},
        {q:"Who is Mr. Smee?",a:"Captain Hook's bumbling assistant",w:["The leader of the Lost Boys","Peter Pan's teacher","A friendly mermaid"],e:"Mr. Smee is Hook's loyal but incompetent first mate."},
        {q:"What is the 'second star to the right'?",a:"The way to Neverland",w:["A song about London","A recipe for cake","A map of the ocean"],e:"'Second star to the right, and straight on till morning' is the way to Neverland."},
        {q:"Why does Peter visit the Darling house?",a:"To hear Wendy's stories",w:["To steal their food","To find his shadow","To take their toys"],e:"Peter lost his shadow at the Darling house and came back to find it."},
        {q:"What does a shadow represent in the story?",a:"A part of oneself that cannot be separated",w:["Darkness and evil","Fear of the unknown","Wealth and power"],e:"Peter's shadow represents the part of him connected to the real world."},
        {q:"What does growing up mean in Peter Pan?",a:"Accepting responsibility and cherishing memories",w:["Becoming boring and serious","Losing all imagination","Forgetting about friends"],e:"The story suggests growing up means keeping your imagination while accepting responsibility."},
        {q:"What is the role of storytelling?",a:"It preserves imagination and connects generations",w:["It is only for entertainment","It has no real value","It is only for children"],e:"Wendy's stories keep the Lost Boys' imaginations alive."},
        {q:"What does the island of Neverland have?",a:"Pirates, mermaids, fairies, and Lost Boys",w:["Only pirates and treasure","Only peaceful meadows","Only schools and libraries"],e:"Neverland is full of adventures with diverse magical creatures."},
        {q:"Why do children love Peter Pan?",a:"It celebrates adventure and imagination",w:["It teaches them to disobey","It shows adults are evil","It encourages staying young forever"],e:"Children love Peter Pan because it celebrates the joy of imagination and adventure."},
        {q:"What does Tinker Bell's jealousy show?",a:"Even magical beings have human emotions",w:["Fairies are always mean","Jealousy is a good thing","Wendy is a bad person"],e:"Tinker Bell's jealousy of Wendy shows that even magical creatures have feelings."},
        {q:"What is the significance of flight?",a:"Freedom from the constraints of the ordinary world",w:["A way to escape homework","Only possible with technology","A dangerous activity"],e:"Flying represents the freedom of childhood imagination."},
        {q:"What does Peter teach the Darling children?",a:"To fly and to use their imagination",w:["To fight pirates","To avoid their parents","To never go home"],e:"Peter teaches them to believe in themselves and use their imagination."},
        {q:"What happens to those who grow up in Neverland?",a:"Peter forgets them and they are replaced",w:["They become pirates","They turn into fairies","They are banished forever"],e:"As children grow up, Peter forgets them and new Lost Boys take their place."},
      ],
      // World 4: The Coral Reef
      [
        {q:"What are coral reefs made of?",a:"Tiny living animals called coral polyps",w:["Underwater plants","Rocks formed by volcanoes","Sand compacted over time"],e:"Coral reefs are built by millions of tiny coral polyps over thousands of years."},
        {q:"Where are coral reefs found?",a:"In warm, shallow ocean waters",w:["In deep dark oceans only","In cold polar regions","In freshwater lakes"],e:"Coral reefs need warm (20-30°C), clear, shallow water with sunlight to grow."},
        {q:"Which is the largest coral reef system?",a:"The Great Barrier Reef",w:["The Red Sea Reef","The Caribbean Reef","The Maldives Reef"],e:"The Great Barrier Reef in Australia is the world's largest, stretching 2,300 km."},
        {q:"Why are coral reefs called 'rainforests of the sea'?",a:"They support a huge variety of sea life",w:["They have trees growing on them","They are found in rainy areas","They produce rain clouds"],e:"Like rainforests, coral reefs are home to an incredible diversity of species."},
        {q:"What do coral polyps eat?",a:"Tiny plankton and algae",w:["Large fish","Seaweed","Rocks"],e:"Coral polyps catch tiny organisms and nutrients floating in the water."},
        {q:"What gives coral its beautiful colours?",a:"Symbiotic algae living inside the coral",w:["Pigments from the ocean floor","Sunlight reflection only","Minerals from the water"],e:"Tiny algae called zooxanthellae live inside coral and give it colour through photosynthesis."},
        {q:"Why are coral reefs in danger?",a:"Climate change, pollution, and ocean acidification",w:["They are growing too large","Fish are eating them","They are moving locations"],e:"Rising ocean temperatures cause coral bleaching, and pollution harms reef ecosystems."},
        {q:"What is coral bleaching?",a:"When coral turns white due to stress and loses its algae",w:["When coral grows very fast","When coral changes its shape","When coral produces more colour"],e:"Bleaching happens when warm water causes coral to expel the colourful algae."},
        {q:"Why should we protect coral reefs?",a:"They protect coastlines and support marine life",w:["They are just for decoration","They have no real value","They are easy to replace"],e:"Reefs protect shores from waves, provide homes for fish, and support fishing industries."},
        {q:"Which animals live in coral reefs?",a:"Fish, sea turtles, octopus, sharks, and many more",w:["Only small fish","No animals at all","Only plants"],e:"Coral reefs support 25% of all marine species despite covering less than 1% of the ocean."},
        {q:"What is a clownfish's relationship with sea anemones?",a:"Mutualism - both benefit",w:["Parasitism - clownfish harms anemone","Predation - anemone eats clownfish","Competition - they fight for food"],e:"Clownfish are protected by anemone stings, and their waste feeds the anemone."},
        {q:"How do coral reefs form?",a:"Coral polyps deposit calcium carbonate over thousands of years",w:["They grow from underwater volcanoes","They are built by ocean currents","They are planted by humans"],e:"Each generation of coral polyps builds on the skeletons of previous generations."},
        {q:"What is ocean acidification?",a:"CO2 dissolving in seawater making it more acidic",w:["Oceans becoming less salty","Waves becoming stronger","Water temperature rising"],e:"Increased CO2 in the atmosphere dissolves in oceans, making it harder for coral to build shells."},
        {q:"How can we help protect coral reefs?",a:"Reduce carbon emissions and avoid harmful sunscreens",w:["Touch corals when diving","Buy coral jewellery","Drain chemicals into oceans"],e:"Using reef-safe sunscreen, reducing pollution, and supporting conservation helps protect reefs."},
        {q:"What is a marine ecosystem?",a:"A community of organisms living in the ocean",w:["Only fish swimming together","A type of underwater volcano","A human-made aquarium"],e:"Marine ecosystems include all the living and non-living things in the ocean environment."},
        {q:"What is biodiversity?",a:"The variety of different species in an ecosystem",w:["The size of the ocean","The depth of the water","The temperature of the sea"],e:"Coral reefs have the highest biodiversity of any ecosystem on Earth."},
        {q:"What do sea turtles eat near coral reefs?",a:"Seagrass, jellyfish, and sponges",w:["Only coral polyps","Only small fish","Only seaweed"],e:"Different sea turtle species have different diets including seagrass, jellyfish, and sponges."},
        {q:"What is the Great Barrier Reef made of?",a:"Over 2,900 individual reefs and 900 islands",w:["One giant rock","Sand dunes","A single continuous reef"],e:"The Great Barrier Reef is a vast system of thousands of individual reefs and islands."},
        {q:"How fast does coral grow?",a:"Some types grow only 1-2 cm per year",w:["Several metres per month","Several kilometres per year","It does not grow at all"],e:"Most coral grows very slowly - some take hundreds of years to form large reefs."},
        {q:"What is a food web?",a:"Connected food chains showing who eats whom",w:["A spider web under water","A net used for fishing","A type of seaweed"],e:"Food webs show how energy flows through an ecosystem from producers to top predators."},
        {q:"What is symbiosis?",a:"A close relationship between two different species",w:["A fight between two animals","A type of underwater cave","A form of ocean current"],e:"Symbiosis includes mutualism (both benefit), commensalism (one benefits), and parasitism."},
        {q:"What is the role of parrotfish in coral reefs?",a:"They eat algae and help create sand",w:["They build coral structures","They scare away predators","They clean the water"],e:"Parrotfish eat algae that could smother coral, and their waste becomes beach sand."},
        {q:"What is the biggest threat to coral reefs?",a:"Climate change causing ocean warming",w:["Too many fish","Too much sunlight","Not enough waves"],e:"Rising ocean temperatures from global warming are the biggest threat to coral reefs."},
        {q:"How long have coral reefs existed?",a:"About 240 million years",w:["About 1,000 years","About 10,000 years","About 1 million years"],e:"Coral reefs have been forming on Earth for approximately 240 million years."},
        {q:"What is a lagoon?",a:"A shallow body of water separated from the ocean by a reef or island",w:["A deep ocean trench","A type of coral","An underwater cave"],e:"Lagoons are calm, shallow waters between coral reefs and coastlines."},
        {q:"What is the economic value of coral reefs?",a:"Billions of dollars from fishing, tourism, and coastal protection",w:["They have no economic value","Only a few thousand dollars","Only scientific value"],e:"Coral reefs provide food, income from tourism, and protection from storms worth billions."},
        {q:"What can students do to help coral reefs?",a:"Learn about them and spread awareness",w:["Visit reefs and touch corals","Buy coral products","Ignore the problem"],e:"Education and awareness are the first steps toward protecting coral reefs."},
        {q:"What is an atoll?",a:"A ring-shaped coral reef surrounding a lagoon",w:["A type of fish","A volcanic island","A deep ocean trench"],e:"Atolls form when coral grows around a sinking volcanic island, creating a ring."},
        {q:"How do coral reefs protect coastlines?",a:"They act as barriers reducing wave energy",w:["They make waves stronger","They have no effect on waves","They absorb tsunamis completely"],e:"Coral reef structures break up waves, reducing coastal erosion and storm damage."},
      ],
      // World 5: Inspiring Women
      [
        {q:"What do inspiring stories about women teach us?",a:"That anyone can achieve great things with determination",w:["Only queens can be great","Only scientists matter","Girls cannot be leaders"],e:"Real-life stories show that determination can help anyone achieve their dreams."},
        {q:"Why is it important to learn about inspiring people?",a:"They give us role models to look up to",w:["They are not important","They make us feel bad","They are boring"],e:"Learning about inspiring people motivates us to pursue our own dreams."},
        {q:"What quality do all inspiring people share?",a:"They never give up despite challenges",w:["They were all rich from birth","They never faced problems","They were all famous from childhood"],e:"All inspiring people persevered through difficulties to achieve their goals."},
        {q:"What did Marie Curie discover?",a:"Radium and polonium",w:["A new planet","A type of food","A way to fly"],e:"Marie Curie discovered radium and polonium, winning two Nobel Prizes in Physics and Chemistry."},
        {q:"Why did Malala Yousafzai speak up for education?",a:"Because every child deserves to go to school",w:["She wanted to be famous","She did not like school","She wanted money"],e:"She believed education is a fundamental right for every child, especially girls."},
        {q:"What can we learn from education advocates?",a:"Education is a powerful tool for change",w:["Education does not matter","Only some should study","School is a waste of time"],e:"Education empowers people and transforms societies for the better."},
        {q:"What does it mean to 'break barriers'?",a:"To overcome obstacles that limit progress",w:["To build walls","To give up easily","To follow the crowd"],e:"Breaking barriers means challenging limitations to achieve something new."},
        {q:"Why should we learn about women who changed the world?",a:"To understand that everyone can make a difference",w:["Only men matter in history","Women cannot achieve much","History is not important"],e:"Stories of achievement inspire all children regardless of gender."},
        {q:"What qualities make someone inspiring?",a:"Courage, determination, and resilience",w:["Fear and laziness","Dishonesty","Selfishness"],e:"Inspiring people show courage, determination, and the ability to bounce back."},
        {q:"What message do inspiring life stories convey?",a:"Believe in yourself and never stop trying",w:["Give up when things are hard","Only famous people matter","Dreams are useless"],e:"Inspiring stories teach us to believe in ourselves and keep trying."},
        {q:"Who was Kalpana Chawla?",a:"The first Indian woman in space",w:["An Indian politician","A famous singer","A sports champion"],e:"Kalpana Chawla was an astronaut who flew on the Space Shuttle Columbia."},
        {q:"What did Florence Nightingale do?",a:"Founded modern nursing and improved hospital care",w:["Invented the telephone","Discovered penicillin","Built the first hospital"],e:"Florence Nightingale improved nursing practices and saved countless lives."},
        {q:"What was Rani Lakshmibai known for?",a:"Leading the fight against British rule in 1857",w:["Writing the Indian Constitution","Building the Taj Mahal","Discovering a new medicine"],e:"Rani Lakshmibai of Jhansi was a brave warrior queen who fought in the 1857 revolt."},
        {q:"What did Sarojini Naidu achieve?",a:"She was a poet and freedom fighter, first woman president of Indian National Congress",w:["She was the first Prime Minister","She discovered a new element","She built the first school"],e:"Sarojini Naidu was known as the 'Nightingale of India' for her poetry and activism."},
        {q:"What did Mother Teresa do?",a:"Dedicated her life to helping the poor and sick in Kolkata",w:["Started a technology company","Wrote famous novels","Built luxury hotels"],e:"Mother Teresa founded the Missionaries of Charity to serve the poorest of the poor."},
        {q:"What is the significance of women's contributions to history?",a:"They show that talent and courage have no gender",w:["Only men have done important things","Women's contributions are minor","History only needs to remember kings"],e:"Women have made enormous contributions to science, politics, art, and social reform."},
        {q:"What did Indira Gandhi achieve?",a:"First female Prime Minister of India",w:["First female President of India","First female astronaut","First female scientist"],e:"Indira Gandhi served as Prime Minister of India and was a powerful world leader."},
        {q:"What did Mary Kom achieve?",a:"World champion boxer from India",w:["Olympic swimmer","Tennis champion","Football player"],e:"Mary Kom is a six-time world champion boxer and Olympic medalist."},
        {q:"What is the message of 'Inspiring Women'?",a:"Women can achieve anything they set their minds to",w:["Women should stay at home","Only men can be successful","Women should not study"],e:"The chapter celebrates women who broke barriers and achieved great things."},
        {q:"What is gender equality?",a:"Equal rights and opportunities for all genders",w:["Women getting more rights than men","Men doing all the work","Only boys going to school"],e:"Gender equality means everyone has the same rights, opportunities, and respect."},
        {q:"What can we learn from the lives of great women?",a:"Hard work and determination lead to success",w:["Success comes only to the rich","Great achievements require no effort","Only men can achieve greatness"],e:"The stories show that dedication and perseverance can overcome any obstacle."},
        {q:"Why is it important to treat everyone equally?",a:"Everyone has unique talents and deserves respect",w:["Only some people are talented","Only certain people deserve respect","Equality is not important"],e:"Treating everyone equally allows all people to contribute their unique talents."},
        {q:"What did Sunita Williams achieve?",a:"NASA astronaut who spent record time in space",w:["First woman Prime Minister","Olympic gold medalist","Nobel Prize winner"],e:"Sunita Williams is a NASA astronaut of Indian origin who set records in space."},
        {q:"What is the role of education in empowerment?",a:"Education gives people knowledge and confidence",w:["Education is not useful","Education only helps boys","Education makes people arrogant"],e:"Education is the foundation of empowerment and personal growth."},
        {q:"What can young people learn from inspiring women?",a:"To follow their dreams despite obstacles",w:["To give up when things are hard","To only do what others do","To avoid challenges"],e:"The stories encourage young people to pursue their dreams with courage."},
        {q:"Why should both boys and girls read about inspiring women?",a:"It helps everyone understand the value of equality",w:["Only girls need role models","Boys do not need to learn this","It is not relevant to everyone"],e:"Learning about inspiring women helps everyone appreciate the contributions of all people."},
        {q:"What is resilience?",a:"The ability to recover from difficulties and keep going",w:["Giving up when things are hard","Ignoring problems completely","Being afraid of challenges"],e:"Resilience is the strength to bounce back from setbacks and continue trying."},
        {q:"What is a role model?",a:"Someone whose behaviour and success inspires others",w:["A person on television only","A famous actor or singer","Someone who never fails"],e:"A role model is someone whose achievements and character inspire us to do better."},
        {q:"What can we do to support equality?",a:"Treat everyone with respect and give equal opportunities",w:["Only help people we know","Treat people differently based on gender","Ignore inequality around us"],e:"Supporting equality means ensuring everyone has the same chances and is treated fairly."},
        {q:"What does 'determination' mean?",a:"Having a strong will to achieve a goal",w:["Being unsure about what to do","Giving up when things get difficult","Depending on others to succeed"],e:"Determination is the quality of continuing to try even when things are difficult."},
        {q:"Why are these stories included in the textbook?",a:"To inspire students to achieve their goals",w:["To only teach about history","To memorise dates and names","To compare men and women"],e:"The stories are meant to motivate and inspire all students to pursue their dreams."},
      ],
      // World 6: Go Green!
      [
        {q:"What does 'going green' mean?",a:"Adopting environmentally friendly practices",w:["Painting everything green","Planting only one tree","Wearing green clothes daily"],e:"Going green means making choices that protect the environment and reduce harm."},
        {q:"What are the Three Rs of going green?",a:"Reduce, Reuse, Recycle",w:["Read, Write, Recite","Run, Rest, Relax","Rain, River, Sea"],e:"Reduce waste, Reuse items, and Recycle materials to protect the environment."},
        {q:"Why is it important to save electricity?",a:"It reduces pollution and conserves resources",w:["Electricity is very expensive","Power plants are fun to visit","It makes the lights brighter"],e:"Most electricity comes from burning fossil fuels which cause air pollution."},
        {q:"What should we use instead of plastic bags?",a:"Cloth or jute bags",w:["More plastic bags","Paper bags only (not always better)","No bags at all"],e:"Reusable cloth or jute bags are eco-friendly alternatives to single-use plastic."},
        {q:"How can we save water at home?",a:"By fixing leaks and turning off taps when not in use",w:["By using more water","By leaving taps running","By ignoring leaks"],e:"Small habits like turning off the tap while brushing save thousands of litres per year."},
        {q:"What is recycling?",a:"Converting waste into reusable material",w:["Throwing everything away","Burning waste in open fires","Burying waste underground"],e:"Recycling processes used materials into new products, saving resources."},
        {q:"Why should we plant more trees?",a:"Trees absorb carbon dioxide and give us oxygen",w:["Trees look pretty only","Trees block roads","Trees are not useful"],e:"Trees are essential for clean air, shade, preventing soil erosion, and fighting climate change."},
        {q:"What is renewable energy?",a:"Energy from natural sources like sun and wind",w:["Energy from coal","Energy from petrol","Energy from natural gas"],e:"Solar and wind energy are renewable because they will never run out."},
        {q:"How can students help the environment at school?",a:"By saving paper and using both sides",w:["By wasting paper","By leaving lights on","By using more plastic"],e:"Using both sides of paper and reducing waste helps the environment significantly."},
        {q:"What is the main message of environmental conservation?",a:"Everyone can help protect the environment",w:["Only adults can help","Only the government can help","The environment is not important"],e:"Every small action counts in protecting our planet for future generations."},
        {q:"What is global warming?",a:"The gradual increase in Earth's average temperature",w:["A sudden cold snap in winter","Only happening in tropical areas","A type of weather forecast"],e:"Global warming is caused by greenhouse gases trapping heat in the atmosphere."},
        {q:"What are greenhouse gases?",a:"Gases that trap heat in the atmosphere",w:["Gases used in greenhouses for plants","Only oxygen and nitrogen","Gases that cool the Earth"],e:"CO2, methane, and other greenhouse gases trap heat, warming the planet."},
        {q:"What is composting?",a:"Turning organic waste into nutrient-rich soil",w:["Burning waste in a fire","Throwing food in the bin","Burying plastic underground"],e:"Composting turns kitchen scraps and yard waste into fertiliser for plants."},
        {q:"Why is plastic pollution dangerous?",a:"It harms wildlife and takes hundreds of years to decompose",w:["It looks ugly only","It smells bad","It helps plants grow"],e:"Plastic in oceans harms marine life and can take 400+ years to break down."},
        {q:"What is a carbon footprint?",a:"The total amount of greenhouse gases produced by our activities",w:["The mark left by shoes on the ground","The size of a person's house","The number of trees planted"],e:"Your carbon footprint includes emissions from travel, electricity, food, and purchases."},
        {q:"How does deforestation affect climate?",a:"It releases stored carbon and reduces oxygen production",w:["It cools the Earth down","It has no effect on climate","It only affects animals"],e:"Cutting trees releases carbon and removes nature's way of absorbing CO2."},
        {q:"What is solar energy?",a:"Energy from the sun converted to electricity",w:["Energy from fossil fuels","Energy from wind turbines","Energy from ocean waves"],e:"Solar panels convert sunlight directly into electricity without pollution."},
        {q:"What is wind energy?",a:"Energy from wind turning turbines to generate electricity",w:["Energy from human breathing","Energy from car exhausts","Energy from waterfalls"],e:"Wind turbines convert the kinetic energy of wind into electrical power."},
        {q:"Why should we avoid single-use plastics?",a:"They create waste that harms the environment",w:["They are too expensive","They are hard to find","They are the best type of plastic"],e:"Single-use plastics are used once but persist in the environment for centuries."},
        {q:"What is an endangered species?",a:"An animal at risk of becoming extinct",w:["An animal that is dangerous","An animal that is very common","An animal that lives only in zoos"],e:"Endangered species have populations so small they may disappear forever."},
        {q:"How can we reduce air pollution?",a:"By using public transport, cycling, or walking",w:["By driving more cars","By burning more waste","By using more aerosol sprays"],e:"Fewer vehicles on the road means less exhaust fumes and cleaner air."},
        {q:"What is organic farming?",a:"Farming without synthetic chemicals or pesticides",w:["Farming with extra chemicals","Farming only in cities","Farming with genetically modified seeds"],e:"Organic farming uses natural methods to grow food without harmful chemicals."},
        {q:"Why are bees important?",a:"They pollinate flowers that become fruits and vegetables",w:["They make honey only","They sting dangerous animals","They clean the environment"],e:"Bees pollinate about one-third of the food crops we eat."},
        {q:"What is an ecosystem?",a:"A community of living things interacting with their environment",w:["Only animals in a zoo","Only plants in a garden","Only water in a river"],e:"An ecosystem includes all living organisms and their physical surroundings."},
        {q:"How does littering affect the environment?",a:"It harms animals and pollutes soil and water",w:["It helps plants grow","It makes the area look colourful","It has no real effect"],e:"Litter can choke animals, release toxins, and block waterways."},
        {q:"What is sustainable living?",a:"Living in a way that does not deplete natural resources",w:["Living without any technology","Living only in rural areas","Living without any comfort"],e:"Sustainable living means meeting our needs without compromising future generations."},
        {q:"What can we do with old clothes?",a:"Donate, reuse, or recycle them",w:["Throw them in the bin","Burn them in a fire","Bury them in the garden"],e:"Donating clothes extends their life and reduces textile waste."},
        {q:"What is water pollution?",a:"Contamination of water bodies by harmful substances",w:["Only natural minerals in water","Only rainwater in rivers","Only clean spring water"],e:"Industrial waste, sewage, and chemicals pollute rivers, lakes, and oceans."},
        {q:"Why should we care about the environment?",a:"It is our home and we need it to survive",w:["Only scientists need to care","It does not affect us personally","The environment will fix itself"],e:"Clean air, water, and food all come from a healthy environment."},
        {q:"What is the ozone layer?",a:"A protective layer in the atmosphere that blocks harmful UV rays",w:["A layer of clouds","A type of pollution","A man-made shield"],e:"The ozone layer protects life on Earth from the Sun's harmful ultraviolet radiation."},
      ],
      // World 7: A Midsummer Night's Dream (Simplified)
      [
        {q:"What is 'A Midsummer Night's Dream'?",a:"A famous comedy play by William Shakespeare",w:["A horror movie","A science fiction novel","A historical documentary"],e:"It is one of Shakespeare's most popular romantic comedies."},
        {q:"Who wrote 'A Midsummer Night's Dream'?",a:"William Shakespeare",w:["Charles Dickens","J.K. Rowling","Rudyard Kipling"],e:"William Shakespeare wrote this play around 1595-1596."},
        {q:"Where does much of the play take place?",a:"In a magical forest near Athens",w:["In a castle in England","On a ship at sea","In a desert oasis"],e:"The enchanted forest is where the fairy magic creates confusion and comedy."},
        {q:"Who is the king of the fairies?",a:"Oberon",w:["Puck","Theseus","Lysander"],e:"Oberon is the Fairy King who plots with Puck to use magic."},
        {q:"Who is the queen of the fairies?",a:"Titania",w:["Hermia","Helena","Hippolyta"],e:"Titania is the Fairy Queen who falls in love with Bottom due to a magic spell."},
        {q:"What is Puck also known as?",a:"Robin Goodfellow",w:["Fairy King","The Duke","The Tailor"],e:"Puck (Robin Goodfellow) is Oberon's mischievous servant."},
        {q:"What does Puck use to cause confusion?",a:"A magical flower's juice",w:["A magic wand","A fairy dust potion","A talking mirror"],e:"The juice of a magical flower, when placed on sleeping eyes, makes people fall in love with the first person they see."},
        {q:"Who is turned into a donkey-headed man?",a:"Bottom",w:["Oberon","Theseus","Lysander"],e:"Puck gives Bottom the head of a donkey as a prank."},
        {q:"What type of play is 'A Midsummer Night's Dream'?",a:"A romantic comedy",w:["A tragic drama","A historical war story","A mystery thriller"],e:"It is a comedy with magical elements, mistaken identities, and happy endings."},
        {q:"What happens when the magical flower juice is used?",a:"The person falls in love with the first being they see",w:["The person falls asleep for 100 years","The person becomes invisible","The person turns into an animal"],e:"The love potion causes characters to fall in love with unexpected people."},
        {q:"Who are the four young lovers in the play?",a:"Hermia, Helena, Lysander, and Demetrius",w:["Romeo, Juliet, Oberon, Titania","Puck, Bottom, Theseus, Hippolyta","Rosalind, Orlando, Beatrice, Benedick"],e:"The four young Athenians get caught in the fairy magic and confused about love."},
        {q:"What lesson does the play teach about love?",a:"Love can be confusing but works out in the end",w:["Love is always predictable","Love should be avoided","Love is only for fairies"],e:"The play shows that love is unpredictable and sometimes irrational."},
        {q:"What role do the fairies play in the story?",a:"They create magical chaos and confusion",w:["They are the main rulers of Athens","They do not appear in the play","They help the lovers immediately"],e:"The fairies' magic causes mistaken identities and humorous situations."},
        {q:"What is a 'midsummer night' traditionally associated with?",a:"Magic and dreams",w:["War and battles","Harvesting crops","Building cities"],e:"Midsummer Eve was traditionally believed to be a time of magic and fairies."},
        {q:"How does the play end?",a:"With the lovers happily married and the fairies blessing the houses",w:["With everyone turning into animals","With a tragic battle","With the lovers separating forever"],e:"It is a comedy, so all misunderstandings are resolved happily."},
        {q:"What is the name of the Duke of Athens?",a:"Theseus",w:["Oberon","Lysander","Puck"],e:"Theseus is the Duke of Athens who is preparing to marry Hippolyta."},
        {q:"Why do Hermia and Lysander run away?",a:"Because Hermia's father wants her to marry Demetrius",w:["Because they are bored","Because the forest is safer","Because Oberon ordered them"],e:"Hermia's father Egeus wants her to marry Demetrius, not Lysander."},
        {q:"What kind of character is Puck?",a:"Mischievous and playful",w:["Evil and cruel","Serious and boring","Wise and elderly"],e:"Puck enjoys creating chaos and playing pranks on humans."},
        {q:"What is the purpose of the play-within-a-play?",a:"To add comedy and show amateur actors",w:["To teach a history lesson","To introduce new characters","To create a tragic ending"],e:"The craftsmen performing a play adds another layer of humour."},
        {q:"What does Titania fall in love with while under the spell?",a:"Bottom with a donkey's head",w:["Oberon","Theseus","A real donkey"],e:"The magic juice makes Titania fall in love with the ridiculous Bottom."},
        {q:"What is the setting of the play?",a:"Athens and a nearby enchanted forest",w:["London and the countryside","Rome and its arenas","Paris and the Eiffel Tower"],e:"The play is set in ancient Athens and a magical forest."},
        {q:"Who is Hippolyta?",a:"The Queen of the Amazons, engaged to Theseus",w:["A fairy servant","A young Athenian girl","A village cook"],e:"Hippolyta is the warrior queen who will marry Duke Theseus."},
        {q:"What makes Shakespeare's plays still popular today?",a:"They explore universal human emotions",w:["They are very short and easy","They only deal with royalty","They have no complicated plots"],e:"Shakespeare wrote about love, jealousy, ambition, and friendship that still resonate."},
        {q:"What is the name of the group of craftsmen who perform a play?",a:"The mechanicals",w:["The fairies","The nobles","The soldiers"],e:"Bottom and his fellow craftsmen (the mechanicals) rehearse a play for the Duke's wedding."},
        {q:"What is the message of the play?",a:"Love is powerful, irrational, and magical",w:["War solves all problems","Never go into forests","Avoid marriage at all costs"],e:"The play celebrates the mysterious and transformative power of love."},
        {q:"What does 'dream' symbolise in the title?",a:"The blurred line between reality and imagination",w:["Sleeping all the time","Having nightmares","Waking up early"],e:"The title suggests that life's strange events can feel like dreams."},
        {q:"Why is this play studied in schools?",a:"It introduces Shakespeare's language and themes in an accessible way",w:["It is the shortest play ever written","It has no complex characters","It is entirely about history"],e:"It is a fun, magical introduction to Shakespeare's work."},
        {q:"What does the word 'comedy' mean in Shakespeare's time?",a:"A play with a happy ending, often with humour",w:["A stand-up performance","A sad tragic story","A serious historical drama"],e:"Shakespearean comedies end with marriages and happiness."},
        {q:"What is special about the forest in the play?",a:"It is a place of magic, transformation, and freedom",w:["It is a dangerous war zone","It is an ordinary city park","It is under strict laws"],e:"The forest represents a world removed from normal rules where magic happens."},
        {q:"How does Oberon resolve the confusion he caused?",a:"He removes the spells and sets everything right",w:["He leaves everyone confused","He runs away from the forest","He turns everyone into fairies"],e:"Oberon realises the chaos has gone too far and fixes the spells."},
      ],
      // World 8: The Immigrant Experience
      [
        {q:"What does 'immigrant' mean?",a:"A person who moves to live in another country",w:["A person who never leaves home","A person born in a country","A person who visits for a holiday"],e:"An immigrant is someone who comes to live permanently in a foreign country."},
        {q:"Why do people immigrate to new countries?",a:"For better opportunities, safety, or family reunion",w:["To cause problems","To avoid all work","To destroy culture"],e:"People move for jobs, education, safety from war, or to join family."},
        {q:"What challenges do immigrants often face?",a:"Learning a new language and adapting to culture",w:["Nothing is ever challenging","Only financial challenges","Only weather changes"],e:"Immigrants face language barriers, cultural differences, and homesickness."},
        {q:"What is 'culture shock'?",a:"The feeling of confusion when experiencing a new culture",w:["A medical illness","A type of music","A weather phenomenon"],e:"Culture shock happens when someone encounters very different customs and ways of life."},
        {q:"How can communities help immigrants feel welcome?",a:"By being friendly and inclusive",w:["By ignoring them completely","By making fun of their accent","By refusing to talk to them"],e:"Being welcoming helps immigrants adjust and contribute to society."},
        {q:"What is diversity?",a:"Having many different cultures and backgrounds together",w:["Everyone being exactly the same","Only one culture in a place","Avoiding all differences"],e:"Diversity means a variety of people, cultures, and perspectives living together."},
        {q:"Why is it important to respect different cultures?",a:"It creates harmony and mutual understanding",w:["It causes confusion and fights","It makes people feel unwelcome","It prevents learning"],e:"Respecting differences helps everyone live together peacefully."},
        {q:"What can we learn from immigrants?",a:"New languages, foods, traditions, and perspectives",w:["Nothing at all","Only bad habits","Only historical facts"],e:"Immigrants bring rich cultural contributions to their new homes."},
        {q:"What is a 'melting pot'?",a:"A place where different cultures blend together",w:["A cooking utensil only","A type of restaurant","A historical monument"],e:"A melting pot describes a society where many cultures mix and influence each other."},
        {q:"How do immigrant children often feel at first?",a:"Nervous but hopeful about fitting in",w:["Completely confident immediately","Angry at their parents","Uninterested in school"],e:"Starting a new school in a new country can be scary but exciting."},
        {q:"What is 'integration'?",a:"Becoming part of a new community while keeping your identity",w:["Losing all your original culture","Refusing to learn anything new","Isolating yourself completely"],e:"Integration means participating in society while maintaining your heritage."},
        {q:"What languages do immigrants often speak at home?",a:"Their native language",w:["Only the new country's language","No languages at all","A made-up language"],e:"Many immigrant families continue speaking their first language at home."},
        {q:"What is discrimination?",a:"Unfair treatment based on background or differences",w:["Fair treatment of everyone","Helping people in need","Celebrating diversity"],e:"Discrimination means treating people unfairly because of their race, origin, or other differences."},
        {q:"How can schools support immigrant students?",a:"By providing language help and cultural understanding",w:["By ignoring their difficulties","By separating them from others","By making them skip grades"],e:"Language support and inclusive classrooms help immigrant students succeed."},
        {q:"What foods might immigrants bring to a new country?",a:"Traditional dishes from their homeland",w:["Only fast food","No food at all","Only desserts"],e:"Immigrants share their cuisine, enriching the food culture of their new country."},
        {q:"What is 'heritage'?",a:"The traditions and culture passed down from ancestors",w:["A type of building","A modern invention","A sports team"],e:"Heritage includes language, food, music, and customs from one's background."},
        {q:"Why do immigrant stories matter?",a:"They teach us about courage, resilience, and human connection",w:["They are boring and irrelevant","They only help historians","They cause arguments"],e:"Immigrant stories help us understand the human experience of adapting and thriving."},
        {q:"What is 'resilience'?",a:"The ability to recover from difficulties and keep going",w:["Giving up when things are hard","Being afraid of everything","Avoiding all challenges"],e:"Immigrants often show great resilience in building new lives."},
        {q:"What does 'multicultural' mean?",a:"Containing many different cultures",w:["Having only one culture","Having no culture","Being against culture"],e:"A multicultural society values and includes many cultural traditions."},
        {q:"How can you be a good friend to someone from another country?",a:"Show interest in their culture and be patient with language",w:["Ignore their differences","Make fun of their accent","Avoid talking to them"],e:"Friendship and patience help bridge cultural gaps."},
        {q:"What is 'empathy'?",a:"Understanding and sharing the feelings of others",w:["Being cruel to others","Ignoring other people's feelings","Only caring about yourself"],e:"Empathy helps us understand what immigrants might be going through."},
        {q:"What festivals might immigrants celebrate?",a:"Traditional festivals from their home country",w:["No festivals at all","Only local festivals","Only sports events"],e:"Immigrants bring their celebrations, adding to cultural richness."},
        {q:"What is a 'refugee'?",a:"A person forced to leave their country due to danger",w:["A person who travels for fun","A person who moves for a job","A person visiting family"],e:"Refugees flee war, persecution, or disaster to find safety."},
        {q:"How do immigrants contribute to their new country?",a:"Through work, arts, food, innovation, and cultural exchange",w:["They do not contribute at all","They only take resources","They cause problems"],e:"Immigrants enrich society economically and culturally."},
        {q:"What is 'prejudice'?",a:"An unfair opinion about someone without knowing them",w:["A fair judgment","A scientific fact","A helpful attitude"],e:"Prejudice means judging people before getting to know them."},
        {q:"Why is learning about immigration important?",a:"It helps us understand our diverse world",w:["It is not important at all","It only helps immigrants","It causes arguments"],e:"Understanding immigration helps us appreciate diversity."},
        {q:"What might immigrant families miss from home?",a:"Family, food, language, and familiar customs",w:["Nothing at all","Only the weather","Only their house"],e:"Homesickness is common when people leave their home country."},
        {q:"What does 'belonging' mean?",a:"Feeling accepted and part of a community",w:["Feeling lonely and isolated","Feeling angry and rejected","Feeling scared and anxious"],e:"Everyone wants to feel like they belong in their community."},
        {q:"How can we celebrate cultural diversity?",a:"By learning about and participating in different traditions",w:["By ignoring other cultures","By making fun of differences","By avoiding all contact"],e:"Celebrating diversity makes communities richer and more interesting."},
        {q:"What is the main message of 'The Immigrant Experience'?",a:"That everyone deserves respect and a chance to succeed",w:["That immigration is bad","That people should stay home","That differences are wrong"],e:"The chapter teaches empathy, respect, and the value of diversity."},
      ],
      // World 9: The Umbrella (Ruskin Bond)
      [
        {q:"Who wrote 'The Umbrella'?",a:"Ruskin Bond",w:["R.K. Narayan","Rabindranath Tagore","Chetan Bhagat"],e:"Ruskin Bond is a famous Indian author of British descent who writes children's stories."},
        {q:"Where does Ruskin Bond live?",a:"In the hill station of Mussoorie",w:["In Mumbai","In Kolkata","In Chennai"],e:"Ruskin Bond lives in Landour, Mussoorie in the Himalayan foothills."},
        {q:"What is the main object in the story 'The Umbrella'?",a:"An umbrella",w:["A book","A bicycle","A kite"],e:"The umbrella is central to the story's theme of simple joys."},
        {q:"What kind of stories does Ruskin Bond write?",a:"Simple stories about nature and everyday life",w:["Science fiction stories","Horror stories","War stories only"],e:"Bond's stories celebrate ordinary moments in beautiful Himalayan settings."},
        {q:"What does the umbrella symbolise in the story?",a:"Small joys and simple pleasures in life",w:["Wealth and luxury","Power and control","Speed and technology"],e:"The umbrella represents finding happiness in simple things."},
        {q:"What is a common theme in Ruskin Bond's stories?",a:"Love for nature and the mountains",w:["City life and technology","Space exploration","War and battles"],e:"Bond's stories often describe the beauty of the Himalayan region."},
        {q:"What is special about the monsoon in hill stations?",a:"It brings mist, rain, and lush greenery",w:["It is always dry","It causes no changes","It makes everything brown"],e:"The monsoon transforms hill stations into green, misty paradises."},
        {q:"What does Ruskin Bond often write about?",a:"The people, animals, and seasons of the mountains",w:["Only famous politicians","Only space travel","Only big cities"],e:"Bond's writing captures the simple life in the Himalayan foothills."},
        {q:"What is a 'hill station'?",a:"A town in the mountains that is cooler than the plains",w:["A station for trains","A sports stadium","A shopping mall"],e:"Hill stations like Mussoorie were built in mountains to escape summer heat."},
        {q:"Why do people enjoy reading Ruskin Bond?",a:"His writing is gentle, descriptive, and heartwarming",w:["It is scary and violent","It is confusing and complex","It is only about history"],e:"Readers love Bond's ability to make ordinary moments feel magical."},
        {q:"What animals appear in Ruskin Bond's stories?",a:"Monkeys, birds, leopards, and mountain animals",w:["Only farm animals","Only sea creatures","Only zoo animals"],e:"The Himalayan region is home to diverse wildlife that Bond writes about."},
        {q:"What is the climate like in Mussoorie?",a:"Cool and pleasant with distinct seasons",w:["Hot and humid all year","Extremely cold with snow always","Dry and desert-like"],e:"Mussoorie has a pleasant climate with beautiful springs and snowy winters."},
        {q:"What does the umbrella protect against?",a:"Rain and sun",w:["Wild animals","Strong winds only","Darkness"],e:"An umbrella shields from both rain and harsh sunlight."},
        {q:"What is the writing style of Ruskin Bond?",a:"Simple, clear, and full of vivid descriptions",w:["Complex and hard to understand","Very short with no details","Full of technical words"],e:"Bond uses simple language that paints beautiful pictures."},
        {q:"What can students learn from Ruskin Bond's stories?",a:"To appreciate nature and find beauty in small things",w:["To fear the outdoors","To ignore simple pleasures","To only care about money"],e:"Bond teaches us to observe and enjoy the world around us."},
        {q:"What is Landour?",a:"A small cantonment town near Mussoorie",w:["A big city in Delhi","A beach in Goa","A desert in Rajasthan"],e:"Landour is where Ruskin Bond has lived and written for decades."},
        {q:"What natural features does Bond describe?",a:"Pine forests, misty mountains, and monsoon rains",w:["Skyscrapers and highways","Shopping malls and theatres","Airports and factories"],e:"Bond's descriptions focus on natural Himalayan landscapes."},
        {q:"What is the mood of 'The Umbrella'?",a:"Peaceful and nostalgic",w:["Scary and frightening","Angry and violent","Confusing and chaotic"],e:"The story creates a calm, reflective feeling about simple pleasures."},
        {q:"Why is the umbrella important to the character?",a:"It provides comfort and joy in rainy weather",w:["It is very expensive","It has magical powers","It is the only one in town"],e:"The umbrella represents finding happiness in everyday objects."},
        {q:"What age group enjoys Ruskin Bond's stories?",a:"Children and adults alike",w:["Only very small children","Only elderly people","Only teenagers"],e:"Bond's stories appeal to readers of all ages."},
        {q:"What is the setting of most Ruskin Bond stories?",a:"The Himalayan foothills in North India",w:["The beaches of Kerala","The deserts of Gujarat","The cities of Maharashtra"],e:"Bond writes about the mountains, forests, and villages of Uttarakhand."},
        {q:"What does Bond teach about material possessions?",a:"True happiness does not come from expensive things",w:["Only expensive things bring joy","Owning more is always better","Simple things have no value"],e:"Bond shows that simple, everyday objects can bring great joy."},
        {q:"What is a 'cantonment'?",a:"A military town or settlement",w:["A religious temple","A shopping district","A farming village"],e:"Cantonments were originally military settlements in British India."},
        {q:"How does Bond describe the rain?",a:"As beautiful and life-giving",w:["As dangerous and scary","As ugly and unpleasant","As boring and dull"],e:"Bond describes the monsoon rain as transforming the landscape beautifully."},
        {q:"What can we learn about observation from Bond?",a:"Paying attention to small details enriches life",w:["Details do not matter","Only big things are important","Observation is a waste of time"],e:"Bond's keen observation of nature makes his writing vivid."},
        {q:"What other famous books did Ruskin Bond write?",a:"'The Blue Umbrella' and 'Room on the Roof'",w:["'Harry Potter' series","'The Jungle Book' only","'Famous Five' series"],e:"The Blue Umbrella and Room on the Roof are among his most loved works."},
        {q:"What is the main lesson of 'The Umbrella'?",a:"Simple things in life bring the most happiness",w:["Always buy expensive things","Avoid going outside","Ignore nature"],e:"The story celebrates finding joy in ordinary, everyday moments."},
        {q:"Why are hill stations popular in India?",a:"They offer cool weather and beautiful scenery",w:["They are very hot","They have no trees","They are crowded cities"],e:"People visit hill stations to enjoy nature and escape heat."},
        {q:"What makes a good story according to Ruskin Bond?",a:"Honest writing about real experiences and places",w:["Only fantasy and magic","Only violent action","Only complex vocabulary"],e:"Bond believes in writing honestly about what he knows and loves."},
      ],
      // World 10: Explorers & Adventurers
      [
        {q:"What is an explorer?",a:"A person who travels to discover new places",w:["A person who stays at home","A person who only reads books","A person who avoids travel"],e:"Explorers venture into unknown territories to learn and discover."},
        {q:"Who was Marco Polo?",a:"A Venetian traveller who explored Asia",w:["An Egyptian pharaoh","A Chinese emperor","An Indian mathematician"],e:"Marco Polo travelled the Silk Road and wrote about his journeys to China."},
        {q:"What did explorers often face on their journeys?",a:"Danger, hardship, and uncertainty",w:["Only comfort and luxury","Instant fame and wealth","No challenges at all"],e:"Exploration involved great risks including storms, hunger, and unknown dangers."},
        {q:"Why do people explore?",a:"To discover new lands, knowledge, and resources",w:["To avoid work","To stay safe","To avoid learning"],e:"Humans are naturally curious and want to understand the world."},
        {q:"What is a 'compass' used for?",a:"Finding direction while travelling",w:["Measuring weight","Telling time","Cooking food"],e:"A compass uses Earth's magnetic field to point north, helping navigation."},
        {q:"Who was Christopher Columbus famous for?",a:"Sailing across the Atlantic to the Americas",w:["Climbing Mount Everest","Reaching the South Pole","Discovering Australia"],e:"Columbus's 1492 voyage led to European contact with the Americas."},
        {q:"What qualities make a good explorer?",a:"Courage, curiosity, and determination",w:["Fear and laziness","Avoiding all risks","Staying comfortable"],e:"Explorers need bravery, curiosity, and perseverance to face challenges."},
        {q:"What did early explorers use to navigate?",a:"Stars, maps, and compasses",w:["GPS satellites","Mobile phones","Airplanes"],e:"Before modern technology, explorers used celestial navigation and basic tools."},
        {q:"What is the 'Silk Road'?",a:"An ancient network of trade routes across Asia",w:["A road made of silk","A single straight highway","A river for boats"],e:"The Silk Road connected East and West for trade and cultural exchange."},
        {q:"Who was the first person to reach the South Pole?",a:"Roald Amundsen",w:["Christopher Columbus","Marco Polo","Vasco da Gama"],e:"Roald Amundsen reached the South Pole in 1911."},
        {q:"What did explorers discover about the world?",a:"That Earth is round and connected by oceans",w:["That Earth is flat","That Earth has no oceans","That Earth is very small"],e:"Explorers proved Earth is spherical and mapped its continents."},
        {q:"What is 'navigation'?",a:"The skill of planning and directing a journey",w:["A type of food","A musical instrument","A kind of clothing"],e:"Navigation involves using tools and knowledge to find one's way."},
        {q:"What dangers did sea explorers face?",a:"Storms, scurvy, and getting lost",w:["Too much sleep","Perfect weather","Unlimited food"],e:"Sea voyages were dangerous due to disease, storms, and limited supplies."},
        {q:"Who was Vasco da Gama?",a:"A Portuguese explorer who found a sea route to India",w:["An Indian king","A Chinese sailor","An English scientist"],e:"Vasco da Gama sailed around Africa to reach India in 1498."},
        {q:"What is 'scurvy'?",a:"A disease caused by lack of Vitamin C",w:["A type of fish","A navigation tool","A kind of ship"],e:"Sailors on long voyages got scurvy from not eating fresh fruits."},
        {q:"Why is exploration important for science?",a:"It leads to new discoveries about geography and nature",w:["It prevents any new knowledge","It only causes problems","It has no scientific value"],e:"Exploration has expanded human knowledge of biology, geography, and astronomy."},
        {q:"What did explorers bring back from their travels?",a:"New foods, ideas, plants, and knowledge",w:["Nothing at all","Only weapons","Only gold"],e:"Explorers facilitated cultural exchange of foods, ideas, and inventions."},
        {q:"What is an 'expedition'?",a:"An organised journey with a specific purpose",w:["A holiday at the beach","A trip to the mall","A walk in the park"],e:"Expeditions are carefully planned journeys to explore or achieve a goal."},
        {q:"What modern tool has replaced the compass for navigation?",a:"GPS (Global Positioning System)",w:["A telescope","A microscope","A thermometer"],e:"GPS satellites now provide precise location data worldwide."},
        {q:"Who was Edmund Hillary famous for?",a:"Climbing Mount Everest with Tenzing Norgay",w:["Sailing around the world","Discovering America","Reaching the North Pole"],e:"Edmund Hillary and Tenzing Norgay were the first to summit Everest in 1953."},
        {q:"What is 'cartography'?",a:"The art and science of making maps",w:["Singing songs","Painting portraits","Building houses"],e:"Cartographers create maps that help us understand geography."},
        {q:"What challenges do modern explorers face?",a:"Extreme climates and environmental hazards",w:["No challenges at all","Only boredom","Too many comforts"],e:"Modern explorers tackle deep oceans, space, and polar regions."},
        {q:"What is 'latitude'?",a:"The distance north or south of the Equator",w:["The distance east of London","The height of a mountain","The depth of the ocean"],e:"Latitude lines run parallel to the Equator and measure north-south position."},
        {q:"What did exploration lead to?",a:"Global trade, cultural exchange, and new knowledge",w:["Complete isolation of countries","No changes in society","Only wars and conflicts"],e:"Exploration connected the world and led to exchange of goods and ideas."},
        {q:"What is 'longitude'?",a:"The distance east or west of the Prime Meridian",w:["The distance north of the pole","The temperature of a place","The speed of a ship"],e:"Longitude lines run from pole to pole and measure east-west position."},
        {q:"Why should we study explorers?",a:"To learn about courage, curiosity, and human achievement",w:["To copy everything they did","To avoid all travel","To fear the unknown"],e:"Explorer stories inspire us to be curious and face challenges."},
        {q:"What did Tenzing Norgay achieve?",a:"He was one of the first to climb Mount Everest",w:["He discovered America","He sailed around the world","He mapped the ocean floor"],e:"Tenzing Norgay, a Sherpa, summited Everest with Edmund Hillary."},
        {q:"What is the spirit of exploration?",a:"The desire to learn, discover, and push boundaries",w:["The desire to stay safe","The fear of new things","The wish to be alone"],e:"The spirit of exploration drives human progress and discovery."},
        {q:"What can we learn from explorers' mistakes?",a:"Preparation and knowledge are essential",w:["Exploration is always easy","Mistakes do not matter","No planning is needed"],e:"Many explorer tragedies teach us the importance of careful planning."},
      ],
    ];
    const selected = passages[worldId - 1] || passages[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }


  // ============ TAMIL GRAMMAR (My Tamil Grammar Ver 3 by Language House) ============
  // 6 worlds × 30 questions:
  // World 1: Parts of Speech (பெயர்ச்சொல், வினைச்சொல், இடைச்சொல், உரிச்சொல்)
  // World 2: Plurals, Pronouns, Conjunctions & Compound Sentences
  // World 3: Compound Words, Onomatopoeia & Proverbs
  // World 4: Case Suffixes, Adverbs & Antonyms
  // World 5: Question Words, Tenses & Interrogatives
  // World 6: Sentence Types (Exclamatory, Imperative, Proverbs)
  static tamilGrammar(worldId: number, n = 30): MathQuestion[] {
    const questions: any[][] = [
      // World 1: பெயர்ச்சொல், வினைச்சொல், சொற்றொடர் (Nouns, Verbs, Phrases)
      [
        {q:"'அழகு' என்ற சொல் எந்த வகைச் சொல்?",a:"பெயர்ச்சொல்",w:["வினைச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"அழகு என்பது பெயர்ச்சொல் (Noun). பெயர்ச்சொல் என்பது பொருளைக் குறிக்கும் சொல்."},
        {q:"'ஓடு' என்ற சொல் எந்த வகைச் சொல்?",a:"வினைச்சொல்",w:["பெயர்ச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"ஓடு என்பது வினைச்சொல் (Verb). வினைச்சொல் என்பது செயலைக் குறிக்கும் சொல்."},
        {q:"'மலர்' என்ற சொல்லின் பன்மைச் சொல் எது?",a:"மலர்கள்",w:["மலரை","மலரின்","மலருக்கு"],e:"பன்மை = ஒன்றுக்கு மேற்பட்டது. மலர் → மலர்கள் (பன்மை)."},
        {q:"'பசு' என்ற சொல்லின் ஒருமைச் சொல் எது?",a:"ஒரு பசு",w:["பசுக்கள்","பசுகள்","பசுக்களை"],e:"ஒருமை = ஒன்று மட்டும். பசுக்கள் (பன்மை) → பசு (ஒருமை)."},
        {q:"'அழகான மலர்' - இது எந்த வகைச் சொற்றொடர்?",a:"பெயர்ச்சொற்றொடர்",w:["வினைச்சொற்றொடர்","அடுக்குத் தொடர்","எதிர்மறைத் தொடர்"],e:"பெயர்ச்சொல் + பெயரடை = பெயர்ச்சொற்றொடர். அழகான (பெயரடை) + மலர் (பெயர்ச்சொல்)."},
        {q:"'மாணவன் படிக்கிறான்' - இது எந்த வகைச் சொற்றொடர்?",a:"வினைச்சொற்றொடர்",w:["பெயர்ச்சொற்றொடர்","அடுக்குத் தொடர்","மரபுத்தொடர்"],e:"மாணவன் (எழுவாய்) + படிக்கிறான் (வினைச்சொல்) = வினைச்சொற்றொடர்."},
        {q:"'நல்ல பழம்' - இது எந்த வகைச் சொற்றொடர்?",a:"பெயர்ச்சொற்றொடர்",w:["வினைச்சொற்றொடர்","இணைப்புத் தொடர்","மரபுத்தொடர்"],e:"நல்ல (பெயரடை) + பழம் (பெயர்ச்சொல்) = பெயர்ச்சொற்றொடர்."},
        {q:"'குழந்தை விளையாடுகிறது' - இது எந்த வகைச் சொற்றொடர்?",a:"வினைச்சொற்றொடர்",w:["பெயர்ச்சொற்றொடர்","இணைப்புத் தொடர்","மரபுத்தொடர்"],e:"குழந்தை (எழுவாய்) + விளையாடுகிறது (வினைச்சொல்) = வினைச்சொற்றொடர்."},
        {q:"'சிவப்பு' என்ற சொல் எந்த வகைச் சொல்?",a:"பெயர்ச்சொல் (பெயரடை)",w:["வினைச்சொல்","இடைச்சொல்","முன்னிலைச் சொல்"],e:"சிவப்பு = பெயர்ச்சொல் / பெயரடை. நிறத்தைக் குறிக்கும் பெயர்ச்சொல்."},
        {q:"'பெண்' என்ற சொல் எந்த வகைப் பெயர்ச்சொல்?",a:"ஒருமைப் பெயர்ச்சொல்",w:["பன்மைப் பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"பெண் = ஒருமைப் பெயர்ச்சொல் (Singular Noun). பெண்கள் = பன்மை."},
        {q:"'மரம்' என்ற சொல் எந்த வகைச் சொல்?",a:"பெயர்ச்சொல்",w:["வினைச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"மரம் = பெயர்ச்சொல் (Noun). பொருளைக் குறிக்கும்."},
        {q:"'நடக்கிறான்' என்ற சொல் எந்த வகைச் சொல்?",a:"வினைச்சொல்",w:["பெயர்ச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"நடக்கிறான் = வினைச்சொல். செயலைக் குறிக்கும்."},
        {q:"'அழகான' என்ற சொல் எந்த வகைச் சொல்?",a:"பெயரடை (Adjective)",w:["வினைச்சொல்","இடைச்சொல்","வினாச்சொல்"],e:"பெயரடை = பெயரை விளக்கும் சொல். அழகான மலர்."},
        {q:"'பறவைகள்' என்ற சொல் எந்த வகைப் பெயர்ச்சொல்?",a:"பன்மைப் பெயர்ச்சொல்",w:["ஒருமைப் பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"பறவைகள் = பன்மை. ஒன்றுக்கு மேற்பட்ட பறவைகள்."},
        {q:"'அவன்' என்ற சொல் எந்த வகைச் சொல்?",a:"மூவிடப்பெயர் (Pronoun)",w:["பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"அவன் = மூவிடப்பெயர். பெயருக்குப் பதிலாகப் பயன்படும்."},
        {q:"'பள்ளியில்' - இது எந்த வகைச் சொற்றொடர்?",a:"பெயர்ச்சொற்றொடர்",w:["வினைச்சொற்றொடர்","அடுக்குத் தொடர்","மரபுத்தொடர்"],e:"பள்ளி (பெயர்ச்சொல்) + இல் (உரிச்சொல்) = பெயர்ச்சொற்றொடர்."},
        {q:"'அவள் பாடுகிறாள்' - இது எந்த வகைச் சொற்றொடர்?",a:"வினைச்சொற்றொடர்",w:["பெயர்ச்சொற்றொடர்","அடுக்குத் தொடர்","எதிர்மறைத் தொடர்"],e:"அவள் (எழுவாய்) + பாடுகிறாள் (வினைச்சொல்) = வினைச்சொற்றொடர்."},
        {q:"'எழுது' என்ற சொல் எந்த வகைச் சொல்?",a:"வினைச்சொல்",w:["பெயர்ச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"எழுது = வினைச்சொல் (Verb). எழுதுதல் என்ற செயலைக் குறிக்கும்."},
        {q:"'கட்டிடம்' என்ற சொல் எந்த வகைச் சொல்?",a:"பெயர்ச்சொல்",w:["வினைச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"கட்டிடம் = பெயர்ச்சொல். ஒரு பொருளின் பெயர்."},
        {q:"'நீலம்' என்ற சொல் எந்த வகைச் சொல்?",a:"பெயர்ச்சொல் (பெயரடை)",w:["வினைச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"நீலம் = நிறத்தைக் குறிக்கும் பெயர்ச்சொல் / பெயரடை."},
        {q:"'புத்தகங்கள்' என்ற சொல் எந்த வகைப் பெயர்ச்சொல்?",a:"பன்மைப் பெயர்ச்சொல்",w:["ஒருமைப் பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"புத்தகங்கள் = பன்மை. புத்தகம் = ஒருமை."},
        {q:"'ஓடுகிறது' என்ற சொல் எந்த வகைச் சொல்?",a:"வினைச்சொல்",w:["பெயர்ச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"ஓடுகிறது = வினைச்சொல். ஓடுதல் என்ற செயலைக் குறிக்கும்."},
        {q:"'வீடு' என்ற சொல் எந்த வகைச் சொல்?",a:"பெயர்ச்சொல்",w:["வினைச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"வீடு = பெயர்ச்சொல். வசிப்பிடம் என்ற பொருளைக் குறிக்கும்."},
        {q:"'நல்ல' என்ற சொல் எந்த வகைச் சொல்?",a:"பெயரடை",w:["வினைச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"நல்ல = பெயரடை. பெயரை விளக்கும் சொல். நல்ல பையன்."},
        {q:"'பறக்கிறது' என்ற சொல் எந்த வகைச் சொல்?",a:"வினைச்சொல்",w:["பெயர்ச்சொல்","இடைச்சொல்","உரிச்சொல்"],e:"பறக்கிறது = வினைச்சொல். பறத்தல் என்ற செயலைக் குறிக்கும்."},
        {q:"'மரங்கள்' என்ற சொல் எந்த வகைப் பெயர்ச்சொல்?",a:"பன்மைப் பெயர்ச்சொல்",w:["ஒருமைப் பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"மரங்கள் = பன்மை. மரம் = ஒருமை."},
        {q:"'அழகிய பூ' - இது எந்த வகைச் சொற்றொடர்?",a:"பெயர்ச்சொற்றொடர்",w:["வினைச்சொற்றொடர்","அடுக்குத் தொடர்","மரபுத்தொடர்"],e:"அழகிய (பெயரடை) + பூ (பெயர்ச்சொல்) = பெயர்ச்சொற்றொடர்."},
        {q:"'நாய் ஓடுகிறது' - இது எந்த வகைச் சொற்றொடர்?",a:"வினைச்சொற்றொடர்",w:["பெயர்ச்சொற்றொடர்","அடுக்குத் தொடர்","எதிர்மறைத் தொடர்"],e:"நாய் (எழுவாய்) + ஓடுகிறது (வினைச்சொல்) = வினைச்சொற்றொடர்."},
        {q:"'சிறிய பையன்' - இது எந்த வகைச் சொற்றொடர்?",a:"பெயர்ச்சொற்றொடர்",w:["வினைச்சொற்றொடர்","அடுக்குத் தொடர்","மரபுத்தொடர்"],e:"சிறிய (பெயரடை) + பையன் (பெயர்ச்சொல்) = பெயர்ச்சொற்றொடர்."},
        {q:"'ஆறு ஓடுகிறது' - இது எந்த வகைச் சொற்றொடர்?",a:"வினைச்சொற்றொடர்",w:["பெயர்ச்சொற்றொடர்","அடுக்குத் தொடர்","மரபுத்தொடர்"],e:"ஆறு (எழுவாய்) + ஓடுகிறது (வினைச்சொல்) = வினைச்சொற்றொடர்."},
      ],
      // World 2: மூவிடப்பெயர்கள், இணைப்புச்சொற்கள், அடுக்குத் தொடர்
      [
        {q:"'நான்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"உடம்படுமை மூவிடப்பெயர்",w:["படர்மை மூவிடப்பெயர்","சுட்டுமை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"நான், நீ, அவன் = உடம்படுமை மூவிடப்பெயர்கள்."},
        {q:"'இவன்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"சுட்டுமை மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"இவன், இவள், இது = சுட்டுமை மூவிடப்பெயர்கள் (அருகில் உள்ளவை)."},
        {q:"'யார்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"வினா மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","சுட்டுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்"],e:"யார், எது, எவன் = வினா மூவிடப்பெயர்கள். கேள்வி கேட்கும்."},
        {q:"'மற்றும்' என்ற சொல் எந்த வகை இணைப்புச்சொல்?",a:"இணைப்புச்சொல்",w:["பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"மற்றும், ஆனால், அல்லது = இணைப்புச்சொற்கள்."},
        {q:"'ஆனால்' என்ற சொல் என்ன செய்கிறது?",a:"இரண்டு தொடர்களை இணைக்கிறது",w:["பெயரைக் குறிக்கிறது","செயலைக் குறிக்கிறது","எண்ணைக் குறிக்கிறது"],e:"ஆனால் = இணைப்புச்சொல். இரண்டு தொடர்களை இணைக்கும்."},
        {q:"'அவன் படித்தான் மற்றும் விளையாடினான்' - இது எந்த வகைத் தொடர்?",a:"அடுக்குத் தொடர்",w:["எதிர்மறைத் தொடர்","வினாத் தொடர்","உணர்ச்சித் தொடர்"],e:"அடுக்குத் தொடர் = இரண்டு தொடர்கள் இணைப்புச்சொல்லால் இணைக்கப்படும்."},
        {q:"'அவள் பாடினாள் ஆனால் நடக்கவில்லை' - இது எந்த வகைத் தொடர்?",a:"அடுக்குத் தொடர்",w:["உணர்ச்சித் தொடர்","வினாத் தொடர்","கட்டளைத் தொடர்"],e:"அவள் பாடினாள் + ஆனால் + நடக்கவில்லை = அடுக்குத் தொடர்."},
        {q:"'அவர்கள்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"படர்மை மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","சுட்டுமை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"அவர்கள், அவை = படர்மை மூவிடப்பெயர்கள்."},
        {q:"'அல்லது' என்ற சொல் என்ன செய்கிறது?",a:"தேர்வு செய்ய உதவுகிறது",w:["எண்ணிக்கை சொல்கிறது","நிறத்தைக் குறிக்கிறது","இடத்தைக் குறிக்கிறது"],e:"அல்லது = இணைப்புச்சொல். இரண்டில் ஒன்றைத் தேர்ந்தெடுக்க உதவும்."},
        {q:"'நான் வந்தேன் அவன் போனான்' - இதை இணைக்கும் சொல் எது?",a:"மற்றும்",w:["ஆனால்","அல்லது","எனவே"],e:"'நான் வந்தேன் மற்றும் அவன் போனான்' = அடுக்குத் தொடர்."},
        {q:"'அது' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"சுட்டுமை மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"அது = சுட்டுமை மூவிடப்பெயர். ஒரு பொருளைச் சுட்டிக்காட்டும்."},
        {q:"'இவள்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"சுட்டுமை மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"இவள் = சுட்டுமை மூவிடப்பெயர். அருகில் உள்ளவளைச் சுட்டும்."},
        {q:"'எவள்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"வினா மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","சுட்டுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்"],e:"எவள் = வினா மூவிடப்பெயர். கேள்வி கேட்கும்."},
        {q:"'எனவே' என்ற சொல் என்ன செய்கிறது?",a:"காரணத்தைக் காட்டுகிறது",w:["எண்ணைக் குறிக்கிறது","நிறத்தைக் குறிக்கிறது","இடத்தைக் குறிக்கிறது"],e:"எனவே = இணைப்புச்சொல். காரணத்தைக் காட்டும்."},
        {q:"'அவன் ஓடினான் ஆனால் விழுந்தான்' - இது எந்த வகைத் தொடர்?",a:"அடுக்குத் தொடர்",w:["உணர்ச்சித் தொடர்","வினாத் தொடர்","கட்டளைத் தொடர்"],e:"அவன் ஓடினான் + ஆனால் + விழுந்தான் = அடுக்குத் தொடர்."},
        {q:"'அவள் நடந்தாள் மற்றும் பாடினாள்' - இது எந்த வகைத் தொடர்?",a:"அடுக்குத் தொடர்",w:["எதிர்மறைத் தொடர்","வினாத் தொடர்","உணர்ச்சித் தொடர்"],e:"அவள் நடந்தாள் + மற்றும் + பாடினாள் = அடுக்குத் தொடர்."},
        {q:"'அவை' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"படர்மை மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","சுட்டுமை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"அவை = படர்மை மூவிடப்பெயர். அங்குள்ளவற்றைக் குறிக்கும்."},
        {q:"'ஆயினும்' என்ற சொல் என்ன செய்கிறது?",a:"இணைப்புச்சொல் - எதிர்ப்புக் காட்டுகிறது",w:["பெயரைக் குறிக்கிறது","செயலைக் குறிக்கிறது","இடத்தைக் குறிக்கிறது"],e:"ஆயினும் = இணைப்புச்சொல். இரண்டு தொடர்களை இணைக்கும்."},
        {q:"'அவன் வந்தான் எனவே நான் போனேன்' - இது எந்த வகைத் தொடர்?",a:"அடுக்குத் தொடர்",w:["உணர்ச்சித் தொடர்","வினாத் தொடர்","கட்டளைத் தொடர்"],e:"அவன் வந்தான் + எனவே + நான் போனேன் = அடுக்குத் தொடர்."},
        {q:"'நாம்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"உடம்படுமை மூவிடப்பெயர்",w:["சுட்டுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"நாம் = உடம்படுமை மூவிடப்பெயர். பேசுபவர் சேர்ந்து சொல்லும்."},
        {q:"'இது' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"சுட்டுமை மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"இது = சுட்டுமை மூவிடப்பெயர். அருகில் உள்ளதைச் சுட்டும்."},
        {q:"'அவன் அல்லது அவள்' - இது எந்த வகைத் தொடர்?",a:"அடுக்குத் தொடர்",w:["உணர்ச்சித் தொடர்","வினாத் தொடர்","கட்டளைத் தொடர்"],e:"அவன் + அல்லது + அவள் = அடுக்குத் தொடர்."},
        {q:"'நான் நீ அவன்' என்பவை எந்த வகை மூவிடப்பெயர்கள்?",a:"உடம்படுமை மூவிடப்பெயர்கள்",w:["சுட்டுமை மூவிடப்பெயர்கள்","படர்மை மூவிடப்பெயர்கள்","வினா மூவிடப்பெயர்கள்"],e:"நான், நீ, அவன் = உடம்படுமை மூவிடப்பெயர்கள்."},
        {q:"'எது' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"வினா மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","சுட்டுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்"],e:"எது = வினா மூவிடப்பெயர். கேள்வி கேட்கும்."},
        {q:"'அவர்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"படர்மை மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","சுட்டுமை மூவிடப்பெயர்","வினா மூவிடப்பெயர்"],e:"அவர் = படர்மை மூவிடப்பெயர். மரியாதையுடன் குறிப்பிடும்."},
        {q:"'அவன் படித்தான் அவள் பாடினாள்' - இதை இணைக்கும் சொல் எது?",a:"மற்றும்",w:["ஆனால்","அல்லது","எனவே"],e:"'அவன் படித்தான் மற்றும் அவள் பாடினாள்' = அடுக்குத் தொடர்."},
        {q:"'எவன்' என்ற சொல் எந்த வகை மூவிடப்பெயர்?",a:"வினா மூவிடப்பெயர்",w:["உடம்படுமை மூவிடப்பெயர்","சுட்டுமை மூவிடப்பெயர்","படர்மை மூவிடப்பெயர்"],e:"எவன் = வினா மூவிடப்பெயர். ஆண் பற்றிய கேள்வி."},
        {q:"'அவர்கள் வந்தார்கள் ஆனால் போகவில்லை' - இது எந்த வகைத் தொடர்?",a:"அடுக்குத் தொடர்",w:["உணர்ச்சித் தொடர்","வினாத் தொடர்","கட்டளைத் தொடர்"],e:"அவர்கள் வந்தார்கள் + ஆனால் + போகவில்லை = அடுக்குத் தொடர்."},
      ],
      // World 3: இணைச்சொற்கள், மயங்கொலிச் சொற்கள், மரபுத்தொடர்கள்
      [
        {q:"'நல்லது + அழகு = நல்லழகு' - இது எந்த வகைச் சொல்?",a:"இணைச்சொல்",w:["பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"இரண்டு சொற்கள் சேர்ந்து ஒரு புதிய சொல் உருவாகும் = இணைச்சொல்."},
        {q:"'பொன் + நிறம் = பொன்னிறம்' - இது எந்த வகைச் சொல்?",a:"இணைச்சொல்",w:["பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"பொன் + நிறம் = பொன்னிறம். இரண்டு சொற்கள் இணைந்து ஒரு புதிய சொல்."},
        {q:"'கா + கா = காக்கா' - இது எந்த வகைச் சொல்?",a:"மயங்கொலிச் சொல்",w:["இணைச்சொல்","பெயர்ச்சொல்","வினைச்சொல்"],e:"மயங்கொலிச் சொல் = ஒரே எழுத்து அல்லது ஒலி மீண்டும் மீண்டும் வரும்."},
        {q:"'தா + தா = தாத்தா' - இது எந்த வகைச் சொல்?",a:"மயங்கொலிச் சொல்",w:["இணைச்சொல்","பெயர்ச்சொல்","வினைச்சொல்"],e:"தா + தா = தாத்தா. ஒரே ஒலி மீண்டும் வருவதால் மயங்கொலிச் சொல்."},
        {q:"'கண் உறுதி மூன்று' என்ற மரபுத்தொடரின் பொருள் என்ன?",a:"பார்ப்பதை நம்பலாம்",w:["கேட்பதை நம்பலாம்","பேசுவது முக்கியம்","எழுதுவது முக்கியம்"],e:"கண் உறுதி மூன்று = பார்ப்பதை விட உறுதியான சாட்சி வேறில்லை."},
        {q:"'சிறு துளி பெரு வெள்ளம்' என்ற மரபுத்தொடரின் பொருள் என்ன?",a:"சிறியது பெரிதாக மாறும்",w:["பெரியது சிறியதாக மாறும்","நீர் முக்கியம்","வெள்ளம் அபாயம்"],e:"சிறு துளி பெரு வெள்ளம் = சிறிய தொடக்கம் பெரிய மாற்றத்தை உருவாக்கும்."},
        {q:"'பழையன கழிதலும் புதியன பிறத்தலும்' - இதன் பொருள் என்ன?",a:"பழையது மறைந்து புதியது வரும்",w:["பழையதை வைத்துக்கொள்","புதியதை நிராகரி","காலம் நிற்கிறது"],e:"பழையன கழிதலும் புதியன பிறத்தலும் = மாற்றம் நிலையானது (திருக்குறள்)."},
        {q:"'பளிச்' என்ற சொல் எந்த வகைச் சொல்?",a:"ஒலிக்குறிப்புச் சொல்",w:["பெயர்ச்சொல்","வினைச்சொல்","மயங்கொலிச் சொல்"],e:"பளிச் = ஒலிக்குறிப்புச் சொல். ஒரு ஒலியைக் குறிக்கும்."},
        {q:"'கிலுகிலு' என்ற சொல் எந்த வகைச் சொல்?",a:"ஒலிக்குறிப்புச் சொல்",w:["இணைச்சொல்","பெயர்ச்சொல்","மரபுத்தொடர்"],e:"கிலுகிலு = ஒலிக்குறிப்புச் சொல். நகைச்சுவையான ஒலியைக் குறிக்கும்."},
        {q:"'அழகு + மலர் = அழகுமலர்' - இது எந்த வகைச் சொல்?",a:"இணைச்சொல்",w:["மயங்கொலிச் சொல்","பெயர்ச்சொல்","ஒலிக்குறிப்புச் சொல்"],e:"அழகு + மலர் = அழகுமலர். இரண்டு பெயர்ச்சொற்கள் இணைந்தது = இணைச்சொல்."},
        {q:"'மா + மா = மாமா' - இது எந்த வகைச் சொல்?",a:"மயங்கொலிச் சொல்",w:["இணைச்சொல்","பெயர்ச்சொல்","ஒலிக்குறிப்புச் சொல்"],e:"மா + மா = மாமா. ஒரே ஒலி மீண்டும் வருவதால் மயங்கொலிச் சொல்."},
        {q:"'தண் + தண் = தண்டண்' - இது எந்த வகைச் சொல்?",a:"மயங்கொலிச் சொல்",w:["இணைச்சொல்","பெயர்ச்சொல்","ஒலிக்குறிப்புச் சொல்"],e:"தண் + தண் = தண்டண். ஒரே ஒலி மீண்டும் வருவது மயங்கொலிச் சொல்."},
        {q:"'அழகிய + பெண் = அழகியபெண்' - இது எந்த வகைச் சொல்?",a:"இணைச்சொல்",w:["மயங்கொலிச் சொல்","ஒலிக்குறிப்புச் சொல்","பெயர்ச்சொல்"],e:"அழகிய + பெண் = அழகியபெண். இரண்டு சொற்கள் இணைந்த புதிய சொல்."},
        {q:"'தூங்காமல் இருப்பது நல்லது' என்ற மரபுத்தொடர் என்ன?",a:"கண் இருக்கப் பார்வை இல்லை",w:["கால் இருக்க ஓட முடியாது","கை இருக்கப் பிடிக்க முடியாது","மூக்கு இருக்க மணக்க முடியாது"],e:"கண் இருக்கப் பார்வை இல்லை = வாய்ப்பு இருந்தும் பயன்படுத்தவில்லை."},
        {q:"'பொறுமையே முக்கியம்' என்ற மரபுத்தொடர்?",a:"பொறுமை ஒரு பெரும் பேறு",w:["கோபம் ஒரு பெரும் பேறு","அவசரம் ஒரு பெரும் பேறு","பயம் ஒரு பெரும் பேறு"],e:"பொறுமை ஒரு பெரும் பேறு = பொறுமை மிக்க மனிதன் வெற்றி பெறுவான்."},
        {q:"'அறிவு முக்கியம்' என்ற மரபுத்தொடர்?",a:"அறிவு ஒளி",w:["அறிவு இருள்","அறிவு பயம்","அறிவு கோபம்"],e:"அறிவு ஒளி = அறிவு மனிதனுக்கு ஒளியைத் தரும்."},
        {q:"'தொழில் செய்பவன் வாழ்வில் வெற்றி' என்ற மரபுத்தொடர்?",a:"உழைப்பே உயிர்",w:["உழைப்பே பயம்","உழைப்பே துன்பம்","உழைப்பே சோர்வு"],e:"உழைப்பே உயிர் = உழைப்புடன் இருப்பவன் வாழ்வில் உயர்வான்."},
        {q:"'பட்' என்ற சொல் எந்த வகைச் சொல்?",a:"ஒலிக்குறிப்புச் சொல்",w:["இணைச்சொல்","பெயர்ச்சொல்","மயங்கொலிச் சொல்"],e:"பட் = ஒலிக்குறிப்புச் சொல். பாய்வது போன்ற ஒலியைக் குறிக்கும்."},
        {q:"'பச்' என்ற சொல் எந்த வகைச் சொல்?",a:"ஒலிக்குறிப்புச் சொல்",w:["இணைச்சொல்","பெயர்ச்சொல்","மயங்கொலிச் சொல்"],e:"பச் = ஒலிக்குறிப்புச் சொல். வெடிப்பு போன்ற ஒலியைக் குறிக்கும்."},
        {q:"'கற்றது கைமண்ணளவு கல்லாதது உலகளவு' - இதன் பொருள்?",a:"கற்றது சிறிது கல்லாதது பெரிது",w:["கற்றது பெரிது கல்லாதது சிறிது","கற்பது தேவையில்லை","கற்றால் போதும்"],e:"கற்றது கைமண்ணளவு = கற்றது சிறிது, கல்லாதது பெரிது என்று பொருள்."},
        {q:"'சுட்டி + விரல் = சுட்டிவிரல்' - இது எந்த வகைச் சொல்?",a:"இணைச்சொல்",w:["மயங்கொலிச் சொல்","ஒலிக்குறிப்புச் சொல்","பெயர்ச்சொல்"],e:"சுட்டி + விரல் = சுட்டிவிரல். இரண்டு சொற்கள் இணைந்த புதிய சொல்."},
        {q:"'சிறு + கதை = சிறுகதை' - இது எந்த வகைச் சொல்?",a:"இணைச்சொல்",w:["மயங்கொலிச் சொல்","ஒலிக்குறிப்புச் சொல்","பெயர்ச்சொல்"],e:"சிறு + கதை = சிறுகதை. இரண்டு சொற்கள் இணைந்த புதிய சொல்."},
        {q:"'தத்தா + தத்தா = தத்ததாத்தா' என்பது எந்த வகைச் சொல்?",a:"மயங்கொலிச் சொல்",w:["இணைச்சொல்","ஒலிக்குறிப்புச் சொல்","பெயர்ச்சொல்"],e:"தத்தா + தத்தா = தத்ததாத்தா. ஒலி மீண்டும் வருவதால் மயங்கொலிச் சொல்."},
        {q:"'குடம் இல்லா வீடு' என்ற மரபுத்தொடரின் பொருள்?",a:"வறுமையான வீடு",w:["செல்வந்த வீடு","அழகான வீடு","பெரிய வீடு"],e:"குடம் இல்லா வீடு = வறுமையான நிலையைக் குறிக்கும்."},
        {q:"'நீர் இல்லா நாடு' என்ற மரபுத்தொடரின் பொருள்?",a:"வறட்சியான நாடு",w:["வளமான நாடு","பசுமையான நாடு","குளிரான நாடு"],e:"நீர் இல்லா நாடு = தண்ணீர் இல்லாத வறட்சியான பகுதி."},
        {q:"'கல் இல்லா கிராமம்' என்ற மரபுத்தொடரின் பொருள்?",a:"எளிய கிராமம்",w:["பெரிய நகரம்","கல்லாலான கிராமம்","கடினமான கிராமம்"],e:"கல் இல்லா கிராமம் = எளிமையான, பழங்கால வாழ்க்கை."},
        {q:"'தீயினால் சுட்ட புண்' என்ற மரபுத்தொடரின் பொருள்?",a:"அனுபவத்தால் கிடைத்த பாடம்",w:["நெருப்பால் காயம்","சமையல் குறிப்பு","விளையாட்டு"],e:"தீயினால் சுட்ட புண் = அனுபவத்தின் மூலம் கிடைந்த பாடம் மறக்காது."},
        {q:"'எட்டப்பா + எட்டப்பா = எட்டப்பாட்டப்பா' என்பது?",a:"மயங்கொலிச் சொல்",w:["இணைச்சொல்","ஒலிக்குறிப்புச் சொல்","பெயர்ச்சொல்"],e:"எட்டப்பா + எட்டப்பா = எட்டப்பாட்டப்பா. ஒலி மீண்டும் வருவது மயங்கொலிச் சொல்."},
        {q:"'சிரிப்பு + ஒலி = சிரிப்பொலி' - இது எந்த வகைச் சொல்?",a:"இணைச்சொல்",w:["மயங்கொலிச் சொல்","ஒலிக்குறிப்புச் சொல்","பெயர்ச்சொல்"],e:"சிரிப்பு + ஒலி = சிரிப்பொலி. இரண்டு சொற்கள் இணைந்த புதிய சொல்."},
      ],
      // World 4: உரிச்சொல், இடைச்சொல், எதிர்ச்சொல், தொடர்புச்சொல்
      [
        {q:"'மரத்தில்' என்ற சொல்லில் 'இல்' என்பது என்ன?",a:"உரிச்சொல் (இடப்பொருள் உரி)",w:["பெயர்ச்சொல்","வினைச்சொல்","இணைச்சொல்"],e:"'இல்' = இடத்தைக் குறிக்கும் உரிச்சொல். மரத்தில், வீட்டில்."},
        {q:"'மரத்தை' என்ற சொல்லில் 'ஐ' என்பது என்ன?",a:"உரிச்சொல் (கருமை உரி)",w:["எழுவாய் உரி","இடப்பொருள் உரி","கொடை உரி"],e:"'ஐ' = கருமை (object) உரிச்சொல். பழத்தை, புத்தகத்தை."},
        {q:"'அவனுக்கு' என்ற சொல்லில் 'க்கு' என்பது என்ன?",a:"உரிச்சொல் (கொடை உரி)",w:["இடப்பொருள் உரி","கருமை உரி","உடைமை உரி"],e:"'க்கு' = கொடை (dative) உரிச்சொல். அவனுக்கு, பையனுக்கு."},
        {q:"'மேல்' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"இடவிளிக்கை இடைச்சொல்",w:["சான்றிடை இடைச்சொல்","உடனிலை இடைச்சொல்","வினவிடை இடைச்சொல்"],e:"மேல், கீழ், முன் = இடவிளிக்கை இடைச்சொற்கள் (Adverbs of place)."},
        {q:"'நல்ல' இன் எதிர்ச்சொல் எது?",a:"கெட்ட",w:["சிறந்த","அழகான","புதிய"],e:"நல்ல → கெட்ட (Antonyms/எதிர்ச்சொற்கள்)."},
        {q:"'அழகு' என்ற சொல்லின் தொடர்புச்சொல் எது?",a:"அழகான (அழகிய)",w:["அழகில்லாத","அழகுடைய","அழகுக்கு"],e:"தொடர்புச்சொல் = Related word. அழகு → அழகான, அழகிய, அழகுள்ள."},
        {q:"'இன்று' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"காலவிளிக்கை இடைச்சொல்",w:["இடவிளிக்கை","பண்பு விளிக்கை","எண்ணிடை"],e:"இன்று, நேற்று, நாளை = காலவிளிக்கை இடைச்சொற்கள் (Adverbs of time)."},
        {q:"'மிகவும்' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"பண்பு விளிக்கை இடைச்சொல்",w:["காலவிளிக்கை","இடவிளிக்கை","எண்ணிடை"],e:"மிகவும், மிக, அதிகம் = பண்பு விளிக்கை இடைச்சொற்கள் (Adverbs of degree)."},
        {q:"'அன்று' என்ற சொல்லின் எதிர்ச்சொல் எது?",a:"இன்று",w:["நேற்று","நாளை","இன்றைக்கு"],e:"அன்று (that day) → இன்று (today) = எதிர்ச்சொற்கள்."},
        {q:"'மேல்' என்ற சொல்லின் எதிர்ச்சொல் எது?",a:"கீழ்",w:["முன்","பின்","உள்"],e:"மேல் (up) → கீழ் (down) = எதிர்ச்சொற்கள்."},
        {q:"'பள்ளியில்' - இதில் 'இல்' என்பது?",a:"உரிச்சொல் (இடம்)",w:["பெயர்ச்சொல்","வினைச்சொல்","இடைச்சொல்"],e:"'இல்' = இடத்தைக் குறிக்கும் உரிச்சொல்."},
        {q:"'வீட்டுக்கு' - இதில் 'க்கு' என்பது?",a:"உரிச்சொல் (கொடை)",w:["எழுவாய் உரி","கருமை உரி","உடைமை உரி"],e:"'க்கு' = கொடை உரிச்சொல். இலக்கம்/கொடையைக் குறிக்கும்."},
        {q:"'புத்தகத்தை' - இதில் 'ஐ' என்பது?",a:"உரிச்சொல் (கருமை)",w:["இடப்பொருள் உரி","கொடை உரி","உடைமை உரி"],e:"'ஐ' = கருமை உரிச்சொல். பொருளைப் பெறுபவன்."},
        {q:"'மரத்தின்' - இதில் 'இன்' என்பது?",a:"உரிச்சொல் (உடைமை)",w:["இடப்பொருள் உரி","கொடை உரி","கருமை உரி"],e:"'இன்' = உடைமை/சார்வு உரிச்சொல். மரத்தின், பள்ளியின்."},
        {q:"'நேற்று' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"காலவிளிக்கை இடைச்சொல்",w:["இடவிளிக்கை","பண்பு விளிக்கை","எண்ணிடை"],e:"நேற்று = காலவிளிக்கை. கடந்த காலத்தைக் குறிக்கும்."},
        {q:"'நாளை' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"காலவிளிக்கை இடைச்சொல்",w:["இடவிளிக்கை","பண்பு விளிக்கை","எண்ணிடை"],e:"நாளை = காலவிளிக்கை. வருங்காலத்தைக் குறிக்கும்."},
        {q:"'மிக' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"பண்பு விளிக்கை இடைச்சொல்",w:["காலவிளிக்கை","இடவிளிக்கை","எண்ணிடை"],e:"மிக = பண்பு விளிக்கை. அளவைக் குறிக்கும்."},
        {q:"'கீழ்' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"இடவிளிக்கை இடைச்சொல்",w:["காலவிளிக்கை","பண்பு விளிக்கை","எண்ணிடை"],e:"கீழ் = இடவிளிக்கை. இடத்தைக் குறிக்கும்."},
        {q:"'சிறந்த' இன் எதிர்ச்சொல் எது?",a:"மோசமான",w:["நல்ல","அழகான","புதிய"],e:"சிறந்த → மோசமான (Best → Worst). எதிர்ச்சொற்கள்."},
        {q:"'பெரிய' இன் எதிர்ச்சொல் எது?",a:"சிறிய",w:["நீளமான","அகலமான","அழகான"],e:"பெரிய → சிறிய (Big → Small). எதிர்ச்சொற்கள்."},
        {q:"'புதிய' இன் எதிர்ச்சொல் எது?",a:"பழைய",w:["அழகான","நல்ல","கெட்ட"],e:"புதிய → பழைய (New → Old). எதிர்ச்சொற்கள்."},
        {q:"'அழகு' என்ற சொல்லின் தொடர்புச்சொல்?",a:"அழகிய",w:["அழகற்ற","அழகின்றி","அழகில்லாத"],e:"அழகு → அழகிய (Beautiful → Beauty). தொடர்புச்சொல்."},
        {q:"'கல்வி' என்ற சொல்லின் தொடர்புச்சொல்?",a:"கல்வியாளர்",w:["கல்வியற்ற","கல்வியின்றி","கல்வியில்லா"],e:"கல்வி → கல்வியாளர் (Education → Educated person). தொடர்புச்சொல்."},
        {q:"'முன்' இன் எதிர்ச்சொல் எது?",a:"பின்",w:["மேல்","கீழ்","உள்"],e:"முன் → பின் (Front → Back). எதிர்ச்சொற்கள்."},
        {q:"'உள்' இன் எதிர்ச்சொல் எது?",a:"வெளி",w:["மேல்","கீழ்","முன்"],e:"உள் → வெளி (Inside → Outside). எதிர்ச்சொற்கள்."},
        {q:"'வலது' இன் எதிர்ச்சொல் எது?",a:"இடது",w:["மேல்","கீழ்","பின்"],e:"வலது → இடது (Right → Left). எதிர்ச்சொற்கள்."},
        {q:"'வெள்ளை' இன் எதிர்ச்சொல் எது?",a:"கருப்பு",w:["சிவப்பு","நீலம்","பச்சை"],e:"வெள்ளை → கருப்பு (White → Black). எதிர்ச்சொற்கள்."},
        {q:"'நல்லது' இன் தொடர்புச்சொல்?",a:"நற்பண்பு",w:["தீயது","கெட்டது","மோசமானது"],e:"நல்லது → நற்பண்பு (Goodness). தொடர்புச்சொல்."},
        {q:"'பறக்கும்' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"பண்பு விளிக்கை இடைச்சொல்",w:["காலவிளிக்கை","இடவிளிக்கை","எண்ணிடை"],e:"பறக்கும் = பண்பு விளிக்கை. செயலின் தன்மையைக் குறிக்கும்."},
      ],
      // World 5: வேற்றுமை உருபுகள், வினாச்சொற்கள், காலம்
      [
        {q:"'பள்ளிக்கு' என்ற சொல்லில் 'க்கு' என்ற உருபு எந்த வேற்றுமையைக் குறிக்கிறது?",a:"நான்காம் வேற்றுமை (கொடை)",w:["முதல் வேற்றுமை","இரண்டாம் வேற்றுமை","மூன்றாம் வேற்றுமை"],e:"நான்காம் வேற்றுமை = கொடை/இலக்கம். பள்ளிக்கு, வீட்டுக்கு."},
        {q:"'புத்தகத்தால்' என்ற சொல்லில் 'ஆல்' எந்த வேற்றுமை உருபு?",a:"மூன்றாம் வேற்றுமை (கரணம்)",w:["முதல் வேற்றுமை","இரண்டாம் வேற்றுமை","ஐந்தாம் வேற்றுமை"],e:"மூன்றாம் வேற்றுமை = கரணம் (by/with). பென்னால், புத்தகத்தால்."},
        {q:"'எங்கே' என்ற சொல் எந்த வகை வினாச்சொல்?",a:"இட வினாச்சொல்",w:["கால வினாச்சொல்","பொருள் வினாச்சொல்","எண் வினாச்சொல்"],e:"எங்கே = இடத்தைக் கேட்கும் வினாச்சொல் (Where?)."},
        {q:"'எப்போது' என்ற சொல் எந்த வகை வினாச்சொல்?",a:"கால வினாச்சொல்",w:["இட வினாச்சொல்","பொருள் வினாச்சொல்","எண் வினாச்சொல்"],e:"எப்போது = காலத்தைக் கேட்கும் வினாச்சொல் (When?)."},
        {q:"'எத்தனை' என்ற சொல் எந்த வகை வினாச்சொல்?",a:"எண் வினாச்சொல்",w:["இட வினாச்சொல்","கால வினாச்சொல்","பொருள் வினாச்சொல்"],e:"எத்தனை = எண்ணிக்கையைக் கேட்கும் வினாச்சொல் (How many?)."},
        {q:"'எழுந்தான்' என்ற சொல் எந்த காலம்?",a:"இறந்த காலம் (Past tense)",w:["நிகழ் காலம்","எதிர் காலம்","எதிர்காலம்"],e:"எழுந்தான் = Past tense. எழுகிறான் = Present. எழுவான் = Future."},
        {q:"'ஓடுகிறான்' என்ற சொல் எந்த காலம்?",a:"நிகழ் காலம் (Present tense)",w:["இறந்த காலம்","எதிர் காலம்","எதிர்காலம்"],e:"ஓடுகிறான் = Present tense. ஓடினான் = Past. ஓடுவான் = Future."},
        {q:"'பாடுவாள்' என்ற சொல் எந்த காலம்?",a:"எதிர் காலம் (Future tense)",w:["நிகழ் காலம்","இறந்த காலம்","எதிர்காலம்"],e:"பாடுவாள் = Future tense. பாடுகிறாள் = Present. பாடினாள் = Past."},
        {q:"'எவ்வளவு' என்ற சொல் எந்த வகை வினாச்சொல்?",a:"அளவு வினாச்சொல்",w:["இட வினாச்சொல்","கால வினாச்சொல்","எண் வினாச்சொல்"],e:"எவ்வளவு = அளவைக் கேட்கும் வினாச்சொல் (How much?)."},
        {q:"'மரத்தின்' என்ற சொல்லில் 'இன்' எந்த வேற்றுமை உருபு?",a:"ஆறாம் வேற்றுமை (உடைமை)",w:["ஐந்தாம் வேற்றுமை","ஏழாம் வேற்றுமை","ஒன்றாம் வேற்றுமை"],e:"ஆறாம் வேற்றுமை = உடைமை/சார்வு (of/'s). மரத்தின், பள்ளியின்."},
        {q:"'பையனுக்கு' - இதில் 'க்கு' எந்த வேற்றுமை?",a:"நான்காம் வேற்றுமை (கொடை)",w:["முதல் வேற்றுமை","இரண்டாம் வேற்றுமை","மூன்றாம் வேற்றுமை"],e:"நான்காம் = கொடை. பையனுக்கு, மாணவனுக்கு."},
        {q:"'பேனாவால்' - இதில் 'ஆல்' எந்த வேற்றுமை?",a:"மூன்றாம் வேற்றுமை (கரணம்)",w:["முதல் வேற்றுமை","இரண்டாம் வேற்றுமை","ஐந்தாம் வேற்றுமை"],e:"மூன்றாம் = கரணம் (by means of). பேனாவால், பென்சிலால்."},
        {q:"'எப்படி' என்ற சொல் எந்த வகை வினாச்சொல்?",a:"வினா வினாச்சொல்",w:["இட வினாச்சொல்","கால வினாச்சொல்","எண் வினாச்சொல்"],e:"எப்படி = முறையைக் கேட்கும் வினாச்சொல் (How?)."},
        {q:"'என்ன' என்ற சொல் எந்த வகை வினாச்சொல்?",a:"பொருள் வினாச்சொல்",w:["இட வினாச்சொல்","கால வினாச்சொல்","எண் வினாச்சொல்"],e:"என்ன = பொருளைக் கேட்கும் வினாச்சொல் (What?)."},
        {q:"'விளையாடினான்' என்ற சொல் எந்த காலம்?",a:"இறந்த காலம்",w:["நிகழ் காலம்","எதிர் காலம்","எதிர்காலம்"],e:"விளையாடினான் = Past. விளையாடுகிறான் = Present. விளையாடுவான் = Future."},
        {q:"'எழுதுவாள்' என்ற சொல் எந்த காலம்?",a:"எதிர் காலம்",w:["நிகழ் காலம்","இறந்த காலம்","எதிர்காலம்"],e:"எழுதுவாள் = Future. எழுதுகிறாள் = Present. எழுதினாள் = Past."},
        {q:"'நடக்கிறான்' என்ற சொல் எந்த காலம்?",a:"நிகழ் காலம்",w:["இறந்த காலம்","எதிர் காலம்","எதிர்காலம்"],e:"நடக்கிறான் = Present. நடந்தான் = Past. நடப்பான் = Future."},
        {q:"'பள்ளியின்' - இதில் 'இன்' எந்த வேற்றுமை?",a:"ஆறாம் வேற்றுமை (உடைமை)",w:["ஐந்தாம் வேற்றுமை","ஏழாம் வேற்றுமை","ஒன்றாம் வேற்றுமை"],e:"ஆறாம் = உடைமை. பள்ளியின், வீட்டின்."},
        {q:"'மேசையில்' - இதில் 'இல்' எந்த வேற்றுமை?",a:"ஏழாம் வேற்றுமை (இடம்)",w:["ஐந்தாம் வேற்றுமை","ஆறாம் வேற்றுமை","எட்டாம் வேற்றுமை"],e:"ஏழாம் = இடம். மேசையில், வீட்டில்."},
        {q:"'காலையில்' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"காலவிளிக்கை இடைச்சொல்",w:["இடவிளிக்கை","பண்பு விளிக்கை","எண்ணிடை"],e:"காலையில் = காலவிளிக்கை. நேரத்தைக் குறிக்கும்."},
        {q:"'எங்கு' என்ற சொல் எந்த வகை வினாச்சொல்?",a:"இட வினாச்சொல்",w:["கால வினாச்சொல்","பொருள் வினாச்சொல்","எண் வினாச்சொல்"],e:"எங்கு = இடத்தைக் கேட்கும் (Where?). எங்கே என்றும் சொல்வர்."},
        {q:"'எத்தனை பேர்' - இது எந்த வகை வினாச்சொல்?",a:"எண் வினாச்சொல்",w:["இட வினாச்சொல்","கால வினாச்சொல்","அளவு வினாச்சொல்"],e:"எத்தனை = எண்ணிக்கையைக் கேட்கும்."},
        {q:"'அவன் வந்தான்' என்ற சொல் எந்த காலம்?",a:"இறந்த காலம்",w:["நிகழ் காலம்","எதிர் காலம்","எதிர்காலம்"],e:"வந்தான் = Past. வருகிறான் = Present. வருவான் = Future."},
        {q:"'அவள் பாடுவாள்' என்ற சொல் எந்த காலம்?",a:"எதிர் காலம்",w:["நிகழ் காலம்","இறந்த காலம்","எதிர்காலம்"],e:"பாடுவாள் = Future. பாடுகிறாள் = Present. பாடினாள் = Past."},
        {q:"'அவர்கள் செல்கிறார்கள்' என்ற சொல் எந்த காலம்?",a:"நிகழ் காலம்",w:["இறந்த காலம்","எதிர் காலம்","எதிர்காலம்"],e:"செல்கிறார்கள் = Present. சென்றார்கள் = Past. செல்வார்கள் = Future."},
        {q:"'பூவிலிருந்து' - இதில் 'இருந்து' எந்த வேற்றுமை?",a:"ஐந்தாம் வேற்றுமை (அபாதம்)",w:["நான்காம் வேற்றுமை","ஆறாம் வேற்றுமை","ஏழாம் வேற்றுமை"],e:"ஐந்தாம் = அபாதம் (from). பூவிலிருந்து, மரத்திலிருந்து."},
        {q:"'எதற்கு' என்ற சொல் எந்த வகை வினாச்சொல்?",a:"பொருள் வினாச்சொல்",w:["இட வினாச்சொல்","கால வினாச்சொல்","எண் வினாச்சொல்"],e:"எதற்கு = காரணத்தைக் கேட்கும் (Why/For what?)."},
        {q:"'நேற்று மாலை' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"காலவிளிக்கை இடைச்சொல்",w:["இடவிளிக்கை","பண்பு விளிக்கை","எண்ணிடை"],e:"நேற்று மாலை = காலவிளிக்கை. குறிப்பிட்ட நேரத்தைக் குறிக்கும்."},
        {q:"'எப்போதும்' என்ற சொல் எந்த வகை இடைச்சொல்?",a:"காலவிளிக்கை இடைச்சொல்",w:["இடவிளிக்கை","பண்பு விளிக்கை","எண்ணிடை"],e:"எப்போதும் = காலவிளிக்கை. எல்லா நேரமும் என்ற பொருள்."},
      ],
      // World 6: தொடர் வகைகள், உணர்ச்சித் தொடர், கட்டளைத் தொடர், பழமொழித் தொடர்
      [
        {q:"'அடி முட்கால் மேல் முட்கால்' - இது எந்த வகைத் தொடர்?",a:"உணர்ச்சித் தொடர் (Exclamatory)",w:["வினாத் தொடர்","கட்டளைத் தொடர்","அடுக்குத் தொடர்"],e:"உணர்ச்சித் தொடர் = Exclamatory sentence. உணர்ச்சியை வெளிப்படுத்தும்."},
        {q:"'வகுப்பறைக்குச் செல்லுங்கள்' - இது எந்த வகைத் தொடர்?",a:"கட்டளைத் தொடர் (Imperative)",w:["வினாத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"கட்டளைத் தொடர் = Imperative. ஒரு கட்டளை/வேண்டுகோள் விடுக்கும்."},
        {q:"'நீ எங்கே செல்கிறாய்?' - இது எந்த வகைத் தொடர்?",a:"வினாத் தொடர் (Interrogative)",w:["கட்டளைத் தொடர்","உணர்ச்சித் தொடர்","தொகைத் தொடர்"],e:"வினாத் தொடர் = Interrogative. கேள்வி கேட்கும்."},
        {q:"'மழை பெய்கிறது' - இது எந்த வகைத் தொடர்?",a:"எளிய வினைத்தொடர்",w:["அடுக்குத் தொடர்","கட்டளைத் தொடர்","உணர்ச்சித் தொடர்"],e:"எளிய வினைத்தொடர் = Simple sentence with subject + verb."},
        {q:"'என்ன அழகு!' - இது எந்த வகைத் தொடர்?",a:"உணர்ச்சித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"உணர்ச்சித் தொடர் = Exclamatory. வியப்பு/உணர்ச்சி தெரிவிக்கும்."},
        {q:"'அமைதியாக இரு' - இது எந்த வகைத் தொடர்?",a:"கட்டளைத் தொடர்",w:["வினாத் தொடர்","உணர்ச்சித் தொடர்","தொகைத் தொடர்"],e:"கட்டளைத் தொடர் = Imperative. 'இரு' = கட்டளை வடிவம்."},
        {q:"'நீ பள்ளிக்கு வருகிறாயா?' - இது எந்த வகைத் தொடர்?",a:"வினாத் தொடர்",w:["கட்டளைத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"வினாத் தொடர் = Interrogative. வினா வார்த்தைகள்/சின்னங்கள் இருக்கும்."},
        {q:"'நல்லவன் பிள்ளை' - இது எந்த வகைத் தொடர்?",a:"சொல்லாட்சித் தொடர் (Proverbial)",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"சொல்லாட்சித் தொடர் = Proverb/wise saying. நல்லவன் பிள்ளை = நல்ல பிள்ளை."},
        {q:"'கற்றது கைமண்ணளவு, கல்லாதது உலகளவு' - இது எந்த வகைத் தொடர்?",a:"பழமொழித் தொடர் (Proverb)",w:["வினாத் தொடர்","கட்டளைத் தொடர்","அடுக்குத் தொடர்"],e:"பழமொழித் தொடர் = Proverb. கற்றது கைமண்ணளவு = கற்றது சிறிது."},
        {q:"'நீர் இல்லா உலகு இல்லை' - இது எந்த வகைத் தொடர்?",a:"உவமைத் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"உவமைத் தொடர் = Comparative. நீர் இல்லாமல் உலகம் இல்லை."},
        {q:"'எத்தனை அழகான மலர்!' - இது எந்த வகைத் தொடர்?",a:"உணர்ச்சித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"உணர்ச்சித் தொடர் = Exclamatory. வியப்பு தெரிவிக்கும்."},
        {q:"'தயவுசெய்து அமருங்கள்' - இது எந்த வகைத் தொடர்?",a:"கட்டளைத் தொடர்",w:["வினாத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"கட்டளைத் தொடர் = Imperative. வேண்டுகோள்/கட்டளை."},
        {q:"'அவன் எங்கே போனான்?' - இது எந்த வகைத் தொடர்?",a:"வினாத் தொடர்",w:["கட்டளைத் தொடர்","உணர்ச்சித் தொடர்","தொகைத் தொடர்"],e:"வினாத் தொடர் = Interrogative. கேள்விக்குறி/வினாச்சொல் இருக்கும்."},
        {q:"'அறிவுடையார் எல்லாம் உலகு ஆண்டார்' - இது எந்த வகைத் தொடர்?",a:"பழமொழித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","உணர்ச்சித் தொடர்"],e:"அறிவுடையார் எல்லாம் உலகு ஆண்டார் = அறிவால் வெற்றி."},
        {q:"'ஓடாதே' - இது எந்த வகைத் தொடர்?",a:"கட்டளைத் தொடர் (எதிர்கட்டளை)",w:["வினாத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"ஓடாதே = எதிர்கட்டளை (Negative imperative). செய்ய வேண்டாம் என்ற கட்டளை."},
        {q:"'என்ன அற்புதம்!' - இது எந்த வகைத் தொடர்?",a:"உணர்ச்சித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"உணர்ச்சித் தொடர். வியப்பை/உணர்ச்சியை வெளிப்படுத்தும்."},
        {q:"'அவள் வீட்டுக்குச் செல்கிறாளா?' - இது எந்த வகைத் தொடர்?",a:"வினாத் தொடர்",w:["கட்டளைத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"வினாத் தொடர். கேள்விக்குறி/வினாச்சொல் இருக்கும்."},
        {q:"'தண்ணீர் குடி' - இது எந்த வகைத் தொடர்?",a:"கட்டளைத் தொடர்",w:["வினாத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"கட்டளைத் தொடர். செய்யுமாறு கூறுவது."},
        {q:"'எழுந்தருளும்' - இது எந்த வகைத் தொடர்?",a:"கட்டளைத் தொடர் (வணங்கிய கட்டளை)",w:["வினாத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"எழுந்தருளும் = மரியாதையான கட்டளை (Polite imperative)."},
        {q:"'ஓ அழகே!' - இது எந்த வகைத் தொடர்?",a:"உணர்ச்சித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"உணர்ச்சித் தொடர். வியப்பை/மகிழ்ச்சியை வெளிப்படுத்தும்."},
        {q:"'கல்லாதார் கல்வி இல்லாதார்' - இது எந்த வகைத் தொடர்?",a:"பழமொழித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","உணர்ச்சித் தொடர்"],e:"கல்லாதார் கல்வி இல்லாதார் = கற்காதவர் அறிவற்றவர்."},
        {q:"'அஃறநாள் ஈகை அறமாகும்' - இது எந்த வகைத் தொடர்?",a:"பழமொழித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","உணர்ச்சித் தொடர்"],e:"அஃறநாள் ஈகை அறமாகும் = கொடுப்பதே முக்கியமான பண்பு."},
        {q:"'என் கண்ணே!' - இது எந்த வகைத் தொடர்?",a:"உணர்ச்சித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"உணர்ச்சித் தொடர். அன்பை வெளிப்படுத்தும்."},
        {q:"'பாடாதே' - இது எந்த வகைத் தொடர்?",a:"கட்டளைத் தொடர் (எதிர்கட்டளை)",w:["வினாத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"பாடாதே = எதிர்கட்டளை. செய்ய வேண்டாம் என்ற கட்டளை."},
        {q:"'அவன் என்ன செய்கிறான்?' - இது எந்த வகைத் தொடர்?",a:"வினாத் தொடர்",w:["கட்டளைத் தொடர்","உணர்ச்சித் தொடர்","தொகைத் தொடர்"],e:"வினாத் தொடர். செயலைக் கேட்கும் கேள்வி."},
        {q:"'வெறும் கை வந்தான் வெறும் கை போனான்' - இது எந்த வகைத் தொடர்?",a:"பழமொழித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","உணர்ச்சித் தொடர்"],e:"வெறும் கை வந்தான் வெறும் கை போனான் = பிறந்தபோது எதுவும் இல்லை; இறக்கும்போது எதுவும் எடுத்துச் செல்ல முடியாது."},
        {q:"'என்ன பெருமை!' - இது எந்த வகைத் தொடர்?",a:"உணர்ச்சித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"உணர்ச்சித் தொடர். பெருமை/வியப்பை வெளிப்படுத்தும்."},
        {q:"'தூங்குங்கள்' - இது எந்த வகைத் தொடர்?",a:"கட்டளைத் தொடர்",w:["வினாத் தொடர்","உணர்ச்சித் தொடர்","அடுக்குத் தொடர்"],e:"கட்டளைத் தொடர். செய்யுமாறு கூறுவது."},
        {q:"'அவள் எங்கே வசிக்கிறாள்?' - இது எந்த வகைத் தொடர்?",a:"வினாத் தொடர்",w:["கட்டளைத் தொடர்","உணர்ச்சித் தொடர்","தொகைத் தொடர்"],e:"வினாத் தொடர். இடத்தைக் கேட்கும் கேள்வி."},
        {q:"'நீரும் நெருப்பும் ஒன்றாகா' - இது எந்த வகைத் தொடர்?",a:"பழமொழித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","உணர்ச்சித் தொடர்"],e:"நீரும் நெருப்பும் ஒன்றாகா = எதிரிகள் ஒன்று சேரமாட்டார்கள்."},
        {q:"'எத்தனை மகிழ்ச்சி!' - இது எந்த வகைத் தொடர்?",a:"உணர்ச்சித் தொடர்",w:["வினாத் தொடர்","கட்டளைத் தொடர்","எதிர்மறைத் தொடர்"],e:"உணர்ச்சித் தொடர். மகிழ்ச்சியை வெளிப்படுத்தும்."},
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  // ============ HINDI - Finding Text-Cum Work Book 3 by Madhubun (10 worlds × 30 questions) ============
  static hindi(worldId: number, n = 30): MathQuestion[] {
    const questions: any[][] = [
      // World 1: मेहनत (Hard Work & Perseverance)
      [
        {q:"'मेहनत' शब्द का अर्थ क्या है?",a:"कड़ी मेहनत / Hard work",w:["आराम / Rest","सोना / Sleep","खेलना / Play"],e:"मेहनत = Hard work / Effort. मेहनत से सफलता मिलती है."},
        {q:"एक अच्छा विद्यार्थी कैसा होता है?",a:"जो पढ़ाई पर ध्यान दे",w:["जो शोर मचाए","जो सोता रहे","जो स्कूल न जाए"],e:"A good student pays attention to studies and works hard."},
        {q:"'पढ़ना' शब्द किस वर्ग का है?",a:"क्रिया (Verb)",w:["संज्ञा (Noun)","विशेषण (Adjective)","सर्वनाम (Pronoun)"],e:"पढ़ना = क्रिया (Verb) - यह एक क्रिया/कार्य को दर्शाता है."},
        {q:"'लड़की' शब्द का पुल्लिंग रूप क्या है?",a:"लड़का",w:["लड़के","लड़कियाँ","बच्चा"],e:"लड़की (स्त्रीलिंग) → लड़का (पुल्लिंग)."},
        {q:"सफलता कैसे मिलती है?",a:"मेहनत और लगन से",w:["सोने से","खेलने से","कुछ न करने से"],e:"Success comes through hard work and dedication."},
        {q:"'लड़की' शब्द का बहुवचन रूप क्या है?",a:"लड़कियाँ",w:["लड़का","लड़के","लड़की"],e:"लड़की (एकवचन) → लड़कियाँ (बहुवचन)."},
        {q:"'होशियार' शब्द का विलोम शब्द क्या है?",a:"मूर्ख",w:["चालाक","तेज़","समझदार"],e:"होशियार → मूर्ख (Smart → Foolish)."},
        {q:"'पढ़ाई' शब्द का पर्यायवाची शब्द क्या है?",a:"अध्ययन",w:["खेल","नाच","सोना"],e:"पढ़ाई = अध्ययन = Studies."},
        {q:"घर का काम करके फिर पढ़ना क्या दर्शाता है?",a:"जिम्मेदारी और मेहनत",w:["आलस","कामचोरी","बेकारी"],e:"Doing housework and then studying shows responsibility and hard work."},
        {q:"'होशियार' शब्द का पर्यायवाची शब्द क्या है?",a:"बुद्धिमान",w:["मूर्ख","आलसी","डरपोक"],e:"होशियार = बुद्धिमान = Intelligent."},
        {q:"'मेहनती' शब्द का विलोम शब्द क्या है?",a:"आलसी",w:["चालाक","होशियार","बुद्धिमान"],e:"मेहनती → आलसी (Hardworking → Lazy)."},
        {q:"'लगन' शब्द का अर्थ क्या है?",a:"Dedication / मेहनत",w:["आलस","क्रोध","डर"],e:"लगन = Dedication. काम में लगन से लगे रहना."},
        {q:"'सफल' शब्द का विलोम शब्द क्या है?",a:"असफल",w:["मेहनती","होशियार","चालाक"],e:"सफल → असफल (Successful → Unsuccessful)."},
        {q:"'विद्यार्थी' शब्द का पर्यायवाची शब्द क्या है?",a:"छात्र",w:["शिक्षक","अध्यापक","प्रधान"],e:"विद्यार्थी = छात्र = Student."},
        {q:"'उद्यम' शब्द का अर्थ क्या है?",a:"Effort / प्रयत्न",w:["आलस","निद्रा","भय"],e:"उद्यम = Effort / Hard work."},
        {q:"'छात्र' शब्द का बहुवचन क्या है?",a:"छात्र",w:["छात्रा","छात्रों","छात्रे"],e:"छात्र = Students (plural same as singular)."},
        {q:"'परीक्षा' शब्द का अर्थ क्या है?",a:"Examination",w:["खेल","नाच","गीत"],e:"परीक्षा = Examination / Test."},
        {q:"'परीक्षा' शब्द का पर्यायवाची शब्द क्या है?",a:"इम्तहान",w:["खेल","उत्सव","यात्रा"],e:"परीक्षा = इम्तहान = Examination."},
        {q:"'माता-पिता' शब्द का पर्यायवाची शब्द क्या है?",a:"माता-पिता (Parents)",w:["भाई-बहन","दोस्त","रिश्तेदार"],e:"माता-पिता = Parents."},
        {q:"'गुरु' शब्द का पर्यायवाची शब्द क्या है?",a:"शिक्षक",w:["छात्र","विद्यार्थी","मित्र"],e:"गुरु = शिक्षक = Teacher."},
        {q:"'अध्ययन' शब्द का विलोम शब्द क्या है?",a:"अनध्ययन",w:["मेहनत","लगन","उद्यम"],e:"अध्ययन → अनध्ययन (Study → Not studying)."},
        {q:"'पुरुषार्थ' शब्द का अर्थ क्या है?",a:"Human effort / मेहनत",w:["आलस","भाग्य","डर"],e:"पुरुषार्थ = Human effort. मेहनत से ही सफलता मिलती है."},
        {q:"'लक्ष्य' शब्द का अर्थ क्या है?",a:"Goal / Aim",w:["खेल","नाच","भय"],e:"लक्ष्य = Goal. जीवन में लक्ष्य निर्धारित करना."},
        {q:"'उद्देश्य' शब्द का पर्यायवाची शब्द क्या है?",a:"लक्ष्य",w:["आलस","भय","क्रोध"],e:"उद्देश्य = लक्ष्य = Purpose / Goal."},
        {q:"'छात्रावास' शब्द का अर्थ क्या है?",a:"Hostel",w:["School","Hospital","Market"],e:"छात्रावास = Hostel. विद्यार्थियों का निवास स्थान."},
        {q:"'परीश्रम' शब्द का पर्यायवाची शब्द क्या है?",a:"मेहनत",w:["आलस","निद्रा","भय"],e:"परीश्रम = मेहनत = Hard work."},
        {q:"'सेवा' शब्द का विलोम शब्द क्या है?",a:"अनादर",w:["मेहनत","लगन","उद्यम"],e:"सेवा → अनादर (Service → Disrespect)."},
        {q:"'सफलता' शब्द का पर्यायवाची शब्द क्या है?",a:"विजय",w:["पराजय","हार","असफलता"],e:"सफलता = विजय = Success."},
        {q:"'असफलता' शब्द का पर्यायवाची शब्द क्या है?",a:"पराजय",w:["विजय","सफलता","जीत"],e:"असफलता = पराजय = Failure."},
        {q:"'मेहनत' शब्द का पर्यायवाची शब्द क्या है?",a:"परिश्रम",w:["आलस","निद्रा","भय"],e:"मेहनत = परिश्रम = Hard work."},
      ],
      // World 2: पंछी (Birds - Poem)
      [
        {q:"'पंछी' शब्द का बहुवचन क्या है?",a:"पंछी",w:["पंछिया","पंछे","पंछिन"],e:"पंछी = Birds (plural already). एक पंछी = one bird."},
        {q:"पंछी कैसे उड़ते हैं?",a:"पंख फड़फड़ाकर",w:["तैरकर","दौड़कर","रेंगकर"],e:"Birds flap their wings to fly in the sky."},
        {q:"'पंख' शब्द का अर्थ क्या है?",a:"Wings",w:["Legs","Eyes","Beak"],e:"पंख = Wings. पंछी पंखों से उड़ते हैं."},
        {q:"पंछों का घर क्या कहलाता है?",a:"घोंसला (Nest)",w:["मकान","दरवाज़ा","खिड़की"],e:"Birds build nests (घोंसला) to lay eggs and live."},
        {q:"'आकाश' शब्द का पर्यायवाची शब्द क्या है?",a:"अम्बर / गगन",w:["पृथ्वी","ज़मीन","समुद्र"],e:"आकाश = अम्बर = गगन = Sky."},
        {q:"पंछी कहाँ रहते हैं?",a:"घोंसले में पेड़ों पर",w:["ज़मीन के नीचे","पानी में","घरों के अंदर"],e:"Birds live in nests built on trees."},
        {q:"'चहचहाना' शब्द का अर्थ क्या है?",a:"Birds chirping",w:["Dogs barking","Cats meowing","Cows mooing"],e:"चहचहाना = Chirping sound made by birds."},
        {q:"पंछी सुबह क्या करते हैं?",a:"चहचहाते हैं और उड़ते हैं",w:["सोते हैं","रोते हैं","खेलते हैं"],e:"Birds chirp and fly in the morning."},
        {q:"'ऊँचा' शब्द का विलोम शब्द क्या है?",a:"नीचा",w:["बड़ा","लंबा","उंचा"],e:"ऊँचा (High) → नीचा (Low)."},
        {q:"पंछी हमें क्या सिखाते हैं?",a:"स्वतंत्रता और सुबह-सुबह जागने की आदत",w:["आलस","डर","गुस्सा"],e:"Birds symbolise freedom and waking up early."},
        {q:"'पंछी' शब्द का पर्यायवाची शब्द क्या है?",a:"चिड़िया",w:["कुत्ता","बिल्ली","गाय"],e:"पंछी = चिड़िया = Bird."},
        {q:"'उड़ान' शब्द का अर्थ क्या है?",a:"Flight / Flying",w:["Running","Swimming","Sleeping"],e:"उड़ान = Flight. पंछियों की उड़ान."},
        {q:"'गगन' शब्द का अर्थ क्या है?",a:"Sky / आकाश",w:["Earth","Water","Fire"],e:"गगन = Sky. गगन में उड़ते पंछी."},
        {q:"'नीड़' शब्द का अर्थ क्या है?",a:"Nest / घोंसला",w:["Tree","River","Mountain"],e:"नीड़ = Nest. पंछी का घोंसला."},
        {q:"'डाल' शब्द का पर्यायवाची शब्द क्या है?",a:"शाखा",w:["पत्ता","जड़","फूल"],e:"डाल = शाखा = Branch."},
        {q:"'पेड़' शब्द का पर्यायवाची शब्द क्या है?",a:"वृक्ष",w:["पत्ता","फूल","घास"],e:"पेड़ = वृक्ष = Tree."},
        {q:"'सवेरा' शब्द का अर्थ क्या है?",a:"Morning / सुबह",w:["Evening","Night","Afternoon"],e:"सवेरा = Morning. सवेरे-सवेरे पंछी चहचहाते हैं."},
        {q:"'स्वतंत्रता' शब्द का पर्यायवाची शब्द क्या है?",a:"आज़ादी",w:["गुलामी","बंधन","डर"],e:"स्वतंत्रता = आज़ादी = Freedom."},
        {q:"'पंखा' शब्द का बहुवचन क्या है?",a:"पंखे",w:["पंख","पंखों","पंखी"],e:"पंखा → पंखे (Fan)."},
        {q:"'फड़फड़ाना' शब्द का अर्थ क्या है?",a:"To flap",w:["To run","To swim","To sleep"],e:"फड़फड़ाना = To flap wings."},
        {q:"'स्वर्ग' शब्द का पर्यायवाची शब्द क्या है?",a:"जन्नत",w:["नरक","पाताल","धरती"],e:"स्वर्ग = जन्नत = Heaven."},
        {q:"'सुबह' शब्द का पर्यायवाची शब्द क्या है?",a:"प्रभात",w:["रात","दोपहर","शाम"],e:"सुबह = प्रभात = Morning."},
        {q:"'छाता' शब्द का पर्यायवाची शब्द क्या है?",a:"साया",w:["पंख","पत्ता","फूल"],e:"छाता = साया = Umbrella/Shade."},
        {q:"'शाम' शब्द का पर्यायवाची शब्द क्या है?",a:"संध्या",w:["सुबह","रात","दोपहर"],e:"शाम = संध्या = Evening."},
        {q:"'तारा' शब्द का पर्यायवाची शब्द क्या है?",a:"नक्षत्र",w:["चाँद","सूरज","बादल"],e:"तारा = नक्षत्र = Star."},
        {q:"'झुंड' शब्द का अर्थ क्या है?",a:"Flock / Group",w:["Single","Alone","Pair"],e:"झुंड = Flock. पंछियों का झुंड."},
        {q:"'वसंत' शब्द का अर्थ क्या है?",a:"Spring season",w:["Summer","Winter","Monsoon"],e:"वसंत = Spring. वसंत ऋतु में पंछी गाते हैं."},
        {q:"'संगीत' शब्द का पर्यायवाची शब्द क्या है?",a:"सुर",w:["शोर","आवाज़","ध्वनि"],e:"संगीत = सुर = Music."},
        {q:"'पंछी' शब्द का विलोम शब्द क्या है?",a:"पिंजरे में बंद पंछी",w:["उड़ता पंछी","आज़ाद पंछी","स्वतंत्र पंछी"],e:"पंछी का विलोम = बंदी पंछी (Caged bird)."},
      ],
      // World 3: चाँदनी रात (Moonlit Night - Poem)
      [
        {q:"'चाँद' किसका उपग्रह (satellite) है?",a:"पृथ्वी (Earth) का",w:["सूरज का","मंगल का","बुध का"],e:"The Moon is Earth's only natural satellite."},
        {q:"चाँद रात में कैसा दिखता है?",a:"चमकदार और सुनहला",w:["काला और गंदा","छोटा और सूखा","गर्म और लाल"],e:"The moon appears bright and golden at night."},
        {q:"'चाँदनी' शब्द का अर्थ क्या है?",a:"Moonlight",w:["Sunlight","Starlight","Firelight"],e:"चाँदनी = Moonlight = the light of the moon."},
        {q:"रात में आसमान में चमकने वाली वस्तुएँ क्या हैं?",a:"चाँद और तारे",w:["सूरज और बादल","पक्षी और हवाई जहाज","गेंद और खिलौने"],e:"The moon and stars shine in the night sky."},
        {q:"'रात्रि' शब्द का पर्यायवाची शब्द क्या है?",a:"रात",w:["दिन","सुबह","शाम"],e:"रात्रि = रात (Night)."},
        {q:"चाँद के बारे में कविताएँ क्या दर्शाती हैं?",a:"बच्चों की कल्पना और सपने",w:["डर और चिंता","गुस्सा और लड़ाई","थकान और नींद"],e:"Poems about the moon reflect children's imagination."},
        {q:"'चाँद' शब्द का विशेषण रूप क्या है?",a:"चाँदनी / चाँद सा",w:["चाँदवा","चाँदनीला","चाँदी"],e:"चाँद सा सुंदर = Beautiful like the moon."},
        {q:"'तारा' शब्द का बहुवचन क्या है?",a:"तारे",w:["तारों","तारी","तारा"],e:"तारा (Singular) → तारे (Plural)."},
        {q:"अंतरिक्ष यात्री कहाँ गए हैं?",a:"चाँद पर",w:["सूरज पर","तारे पर","बादल में"],e:"Astronauts have travelled to the Moon."},
        {q:"'चमकना' शब्द का अर्थ क्या है?",a:"To shine / glow",w:["To sleep","To eat","To cry"],e:"चमकना = To shine / glow."},
        {q:"'चाँद' शब्द का पर्यायवाची शब्द क्या है?",a:"सोम / इंदु",w:["सूरज","अग्नि","पृथ्वी"],e:"चाँद = सोम = इंदु = Moon."},
        {q:"'रात' शब्द का पर्यायवाची शब्द क्या है?",a:"रात्रि / रजनी",w:["दिन","सुबह","शाम"],e:"रात = रात्रि = रजनी = Night."},
        {q:"'आकाश' शब्द का पर्यायवाची शब्द क्या है?",a:"गगन / अम्बर",w:["पृथ्वी","ज़मीन","समुद्र"],e:"आकाश = गगन = अम्बर = Sky."},
        {q:"'झिलमिलाना' शब्द का अर्थ क्या है?",a:"To twinkle",w:["To sleep","To eat","To run"],e:"झिलमिलाना = To twinkle. तारे झिलमिलाते हैं."},
        {q:"'घूर्णन' शब्द का अर्थ क्या है?",a:"Rotation / Revolving",w:["Sleeping","Eating","Running"],e:"घूर्णन = Rotation. चाँद पृथ्वी के चारों ओर घूमता है."},
        {q:"'कल्पना' शब्द का पर्यायवाची शब्द क्या है?",a:"सपना",w:["वास्तविकता","सच","यथार्थ"],e:"कल्पना = सपना = Imagination."},
        {q:"'शीतल' शब्द का अर्थ क्या है?",a:"Cool / ठंडा",w:["Hot","Warm","Burning"],e:"शीतल = Cool. चाँदनी शीतल होती है."},
        {q:"'सुनहरा' शब्द का विलोम शब्द क्या है?",a:"काला / धूसर",w:["चमकदार","रोशन","उज्ज्वल"],e:"सुनहरा → काला (Golden → Dark)."},
        {q:"'नींद' शब्द का पर्यायवाची शब्द क्या है?",a:"निद्रा",w:["जागरण","चेतना","चौकसी"],e:"नींद = निद्रा = Sleep."},
        {q:"'सपना' शब्द का पर्यायवाची शब्द क्या है?",a:"स्वप्न",w:["यथार्थ","सच","वास्तविकता"],e:"सपना = स्वप्न = Dream."},
        {q:"'छाया' शब्द का पर्यायवाची शब्द क्या है?",a:"साया",w:["रोशनी","प्रकाश","उजाला"],e:"छाया = साया = Shadow."},
        {q:"'रोशनी' शब्द का पर्यायवाची शब्द क्या है?",a:"उजाला / प्रकाश",w:["अंधेरा","छाया","साया"],e:"रोशनी = उजाला = प्रकाश = Light."},
        {q:"'अंधेरा' शब्द का पर्यायवाची शब्द क्या है?",a:"तारिकी / घुप्प अंधेरा",w:["उजाला","रोशनी","प्रकाश"],e:"अंधेरा = तारिकी = Darkness."},
        {q:"'शांति' शब्द का पर्यायवाची शब्द क्या है?",a:"सुकून",w:["शोर","हलचल","कोलाहल"],e:"शांति = सुकून = Peace."},
        {q:"'चाँद' शब्द का विलोम शब्द क्या है?",a:"सूरज",w:["तारा","आकाश","पृथ्वी"],e:"चाँद → सूरज (Moon → Sun)."},
        {q:"'रोशन' शब्द का पर्यायवाची शब्द क्या है?",a:"उज्ज्वल",w:["अंधेरा","काला","धूसर"],e:"रोशन = उज्ज्वल = Bright."},
        {q:"'मौन' शब्द का पर्यायवाची शब्द क्या है?",a:"खामोशी",w:["शोर","बोलना","हलचल"],e:"मौन = खामोशी = Silence."},
        {q:"'नदी' शब्द का पर्यायवाची शब्द क्या है?",a:"सरिता / नद",w:["पहाड़","समुद्र","तालाब"],e:"नदी = सरिता = नद = River."},
        {q:"'सरोवर' शब्द का पर्यायवाची शब्द क्या है?",a:"तालाब / जलाशय",w:["नदी","समुद्र","पहाड़"],e:"सरोवर = तालाब = Lake."},
        {q:"'शीतलता' शब्द का पर्यायवाची शब्द क्या है?",a:"ठंडक",w:["गर्मी","ताप","उष्णता"],e:"शीतलता = ठंडक = Coolness."},
      ],
      // World 4: दोस्ती (Friendship)
      [
        {q:"सबसे अच्छा मित्र कौन होता है?",a:"जो कठिन समय में साथ दे",w:["जो मज़े में साथ हो","जो अमीर हो","जो ताकतवर हो"],e:"A true friend stands by you in difficult times."},
        {q:"'मित्र' शब्द का पर्यायवाची शब्द क्या है?",a:"दोस्त",w:["दुश्मन","अजनबी","बड़ा"],e:"मित्र = दोस्त = Friend."},
        {q:"सच्चा मित्र कैसा होता है?",a:"विश्वासयोग्य और ईमानदार",w:["झूठा और धोखेबाज़","आलसी और कामचोर","गुस्सैल और क्रोधी"],e:"A true friend is trustworthy and honest."},
        {q:"'अच्छा' शब्द का विलोम शब्द क्या है?",a:"बुरा",w:["सुंदर","उत्तम","बढ़िया"],e:"अच्छा (Good) → बुरा (Bad)."},
        {q:"मित्रता का महत्व क्या है?",a:"मित्र जीवन का सच्चा साथी है",w:["मित्र बेकार है","मित्र से डरना चाहिए","मित्र को नज़रअंदाज़ करना चाहिए"],e:"A friend is life's true companion."},
        {q:"'साथ' शब्द का अर्थ क्या है?",a:"Together / साथ में",w:["अकेला","दूर","बिना"],e:"साथ = Together / With."},
        {q:"दोस्ती किस पर आधारित होनी चाहिए?",a:"विश्वास और समझ",w:["धोखा और फरेब","अमीरी और रुतबा","डर और धमकी"],e:"Friendship should be based on trust and understanding."},
        {q:"'मित्र' शब्द का विलोम शब्द क्या है?",a:"शत्रु (Enemy)",w:["भाई","पिता","गुरु"],e:"मित्र (Friend) → शत्रु (Enemy)."},
        {q:"सच्चा दोस्त कब काम आता है?",a:"मुश्किल वक़्त में",w:["आसान वक़्त में","कभी नहीं","सिर्फ खाने में"],e:"A true friend is revealed during difficult times."},
        {q:"दोस्ती का संदेश क्या है?",a:"अच्छी दोस्ती जीवनभर काम आती है",w:["दोस्ती बेकार है","अकेला रहना अच्छा है","किसी पर भरोसा न करें"],e:"Good friendship lasts a lifetime."},
        {q:"'विश्वास' शब्द का अर्थ क्या है?",a:"Trust / भरोसा",w:["धोखा","फरेब","झूठ"],e:"विश्वास = Trust. दोस्ती की नींव विश्वास है."},
        {q:"'सच्चाई' शब्द का पर्यायवाची शब्द क्या है?",a:"ईमानदारी",w:["झूठ","फरेब","धोखा"],e:"सच्चाई = ईमानदारी = Truth / Honesty."},
        {q:"'भरोसा' शब्द का विलोम शब्द क्या है?",a:"अविश्वास",w:["विश्वास","यकीन","भरोसा"],e:"भरोसा → अविश्वास (Trust → Distrust)."},
        {q:"'दुश्मन' शब्द का पर्यायवाची शब्द क्या है?",a:"शत्रु",w:["मित्र","दोस्त","साथी"],e:"दुश्मन = शत्रु = Enemy."},
        {q:"'अजनबी' शब्द का पर्यायवाची शब्द क्या है?",a:"अनजान / पराया",w:["मित्र","दोस्त","परिचित"],e:"अजनबी = अनजान = Stranger."},
        {q:"'मदद' शब्द का पर्यायवाची शब्द क्या है?",a:"सहायता",w:["हानि","नुकसान","अनादर"],e:"मदद = सहायता = Help."},
        {q:"'साथी' शब्द का पर्यायवाची शब्द क्या है?",a:"संगी",w:["दुश्मन","अकेला","पराया"],e:"साथी = संगी = Companion."},
        {q:"'एकांत' शब्द का पर्यायवाची शब्द क्या है?",a:"अकेलापन",w:["भीड़","संगति","मेला"],e:"एकांत = अकेलापन = Solitude."},
        {q:"'स्नेह' शब्द का पर्यायवाची शब्द क्या है?",a:"प्यार / मोहब्बत",w:["घृणा","नफ़रत","अनादर"],e:"स्नेह = प्यार = Affection."},
        {q:"'घृणा' शब्द का पर्यायवाची शब्द क्या है?",a:"नफ़रत",w:["स्नेह","प्यार","मोहब्बत"],e:"घृणा = नफ़रत = Hatred."},
        {q:"'त्याग' शब्द का पर्यायवाची शब्द क्या है?",a:"बलिदान",w:["लाभ","फायदा","मुनाफ़ा"],e:"त्याग = बलिदान = Sacrifice."},
        {q:"'समझ' शब्द का पर्यायवाची शब्द क्या है?",a:"बूझ",w:["भूल","ग़लती","अनजान"],e:"समझ = बूझ = Understanding."},
        {q:"'परख' शब्द का पर्यायवाची शब्द क्या है?",a:"जाँच",w:["भूल","अनजान","अविश्वास"],e:"परख = जाँच = Test / Evaluation."},
        {q:"'दोस्ती' शब्द का पर्यायवाची शब्द क्या है?",a:"मित्रता",w:["शत्रुता","दुश्मनी","अनबन"],e:"दोस्ती = मित्रता = Friendship."},
        {q:"'अमीर' शब्द का विलोम शब्द क्या है?",a:"ग़रीब",w:["धनी","समृद्ध","मालदार"],e:"अमीर → ग़रीब (Rich → Poor)."},
        {q:"'कमज़ोर' शब्द का विलोम शब्द क्या है?",a:"मज़बूत",w:["दुर्बल","कमज़ोर","निर्बल"],e:"कमज़ोर → मज़बूत (Weak → Strong)."},
        {q:"'झूठ' शब्द का विलोम शब्द क्या है?",a:"सच",w:["फरेब","धोखा","छल"],e:"झूठ → सच (Lie → Truth)."},
        {q:"'स्वार्थी' शब्द का विलोम शब्द क्या है?",a:"निस्वार्थी",w:["लालची","कंजूस","मतलबी"],e:"स्वार्थी → निस्वार्थी (Selfish → Selfless)."},
        {q:"'वफ़ादार' शब्द का पर्यायवाची शब्द क्या है?",a:"निष्ठावान",w:["बेवफ़ा","धोखेबाज़","गद्दार"],e:"वफ़ादार = निष्ठावान = Loyal."},
      ],
      // World 5: ईमानदारी (Honesty / Truth & Values)
      [
        {q:"'सच्चाई' शब्द का अर्थ क्या है?",a:"Truth / ईमानदारी",w:["झूठ","चोरी","धोखा"],e:"सच्चाई = Truth / Honesty."},
        {q:"'पैगाम' शब्द का अर्थ क्या है?",a:"संदेश (Message)",w:["खत","उपहार","खेल"],e:"पैगाम = Message / News."},
        {q:"सच्चा इंसान कैसा होता है?",a:"ईमानदार और भरोसेमंद",w:["झूठा और चालाक","आलसी और कामचोर","गुस्सैल और क्रोधी"],e:"An honest person is trustworthy and reliable."},
        {q:"'ईमानदार' शब्द का विलोम शब्द क्या है?",a:"बेईमान",w:["सच्चा","अच्छा","मेहनती"],e:"ईमानदार (Honest) → बेईमान (Dishonest)."},
        {q:"सच्चाई का रास्ता कैसा होता है?",a:"कठिन लेकिन सही",w:["आसान लेकिन गलत","छोटा और संकीर्ण","लंबा और भयानक"],e:"The path of truth may be difficult but it is always right."},
        {q:"'सच' शब्द का पर्यायवाची शब्द क्या है?",a:"सच्चाई",w:["झूठ","फरेब","धोखा"],e:"सच = सच्चाई = Truth."},
        {q:"सच्चाई को किससे तुलना की जाती है?",a:"रोशनी (Light) से",w:["अंधेरे से","आग से","पानी से"],e:"Truth is compared to light that removes darkness."},
        {q:"'संदेश' शब्द का पर्यायवाची शब्द क्या है?",a:"पैगाम",w:["खत","उपहार","खेल"],e:"संदेश = पैगाम = Message."},
        {q:"कविताएँ हमें क्या सिखाती हैं?",a:"अच्छे संस्कार और नैतिकता",w:["बुरी आदतें","झूठ बोलना","चोरी करना"],e:"Poems about values teach us good morals and ethics."},
        {q:"'नैतिकता' शब्द का अर्थ क्या है?",a:"Morality / Ethics",w:["Immorality","Dishonesty","Laziness"],e:"नैतिकता = Morality / Ethics."},
        {q:"'झूठ' शब्द का पर्यायवाची शब्द क्या है?",a:"असत्य",w:["सच","सच्चाई","ईमानदारी"],e:"झूठ = असत्य = Lie."},
        {q:"'चोरी' शब्द का विलोम शब्द क्या है?",a:"ईमानदारी",w:["लूट","चंगारी","झपट"],e:"चोरी → ईमानदारी (Theft → Honesty)."},
        {q:"'अच्छाई' शब्द का पर्यायवाची शब्द क्या है?",a:"भलाई",w:["बुराई","शैतानी","घृणा"],e:"अच्छाई = भलाई = Goodness."},
        {q:"'निष्ठा' शब्द का पर्यायवाची शब्द क्या है?",a:"विश्वास / भरोसा",w:["अविश्वास","नफ़रत","घृणा"],e:"निष्ठा = विश्वास = Loyalty."},
        {q:"'अपराध' शब्द का पर्यायवाची शब्द क्या है?",a:"गुनाह",w:["ईमानदारी","नेकी","अच्छाई"],e:"अपराध = गुनाह = Crime."},
        {q:"'पाप' शब्द का पर्यायवाची शब्द क्या है?",a:"अपराध",w:["पुण्य","नेकी","भलाई"],e:"पाप = अपराध = Sin."},
        {q:"'पुण्य' शब्द का पर्यायवाची शब्द क्या है?",a:"नेकी / भलाई",w:["पाप","अपराध","गुनाह"],e:"पुण्य = नेकी = Virtue."},
        {q:"'रिश्वत' शब्द का पर्यायवाची शब्द क्या है?",a:"घूस",w:["ईमानदारी","निष्ठा","विश्वास"],e:"रिश्वत = घूस = Bribe."},
        {q:"'साहस' शब्द का पर्यायवाची शब्द क्या है?",a:"हिम्मत",w:["डर","भय","घबराहट"],e:"साहस = हिम्मत = Courage."},
        {q:"'डर' शब्द का पर्यायवाची शब्द क्या है?",a:"भय",w:["साहस","हिम्मत","वीरता"],e:"डर = भय = Fear."},
        {q:"'अंधेरा' शब्द का पर्यायवाची शब्द क्या है?",a:"तारिकी",w:["उजाला","रोशनी","प्रकाश"],e:"अंधेरा = तारिकी = Darkness."},
        {q:"'रोशनी' शब्द का पर्यायवाची शब्द क्या है?",a:"उजाला",w:["अंधेरा","तारिकी","घुप्प अंधेरा"],e:"रोशनी = उजाला = Light."},
        {q:"'अच्छा' शब्द का पर्यायवाची शब्द क्या है?",a:"उत्तम",w:["बुरा","घटिया","खराब"],e:"अच्छा = उत्तम = Good."},
        {q:"'बुरा' शब्द का पर्यायवाची शब्द क्या है?",a:"खराब",w:["अच्छा","उत्तम","उत्कृष्ट"],e:"बुरा = खराब = Bad."},
        {q:"'स्वच्छ' शब्द का पर्यायवाची शब्द क्या है?",a:"साफ़",w:["गंदा","मैला","अशुद्ध"],e:"स्वच्छ = साफ़ = Clean."},
        {q:"'ईमान' शब्द का पर्यायवाची शब्द क्या है?",a:"विश्वास / निष्ठा",w:["धोखा","फरेब","छल"],e:"ईमान = विश्वास = Integrity."},
        {q:"'नेक' शब्द का पर्यायवाची शब्द क्या है?",a:"अच्छा / भला",w:["बुरा","शैतान","अपराधी"],e:"नेक = अच्छा = Good / Pious."},
        {q:"'गुनाहगार' शब्द का पर्यायवाची शब्द क्या है?",a:"अपराधी",w:["नेक","अच्छा","ईमानदार"],e:"गुनाहगार = अपराधी = Sinner."},
        {q:"'ईमानदारी' शब्द का पर्यायवाची शब्द क्या है?",a:"निष्ठा",w:["बेईमानी","धोखा","छल"],e:"ईमानदारी = निष्ठा = Honesty."},
      ],
      // World 6: बहादुर (Bravery / Courage)
      [
        {q:"'वीर' शब्द का अर्थ क्या है?",a:"बहादुर (Brave)",w:["डरपोक","आलसी","कायर"],e:"वीर = Brave / Courageous warrior."},
        {q:"1857 की क्रांति क्या थी?",a:"अंग्रेज़ों के खिलाफ पहला बड़ा विद्रोह",w:["1947 की आज़ादी","पहला विश्व युद्ध","दूसरा विश्व युद्ध"],e:"The 1857 Revolt was the first major uprising against British rule."},
        {q:"'क्रांति' शब्द का अर्थ क्या है?",a:"Revolution / विद्रोह",w:["शांति","आराम","मित्रता"],e:"क्रांति = Revolution / Revolt against unjust rule."},
        {q:"'बहादुर' शब्द का पर्यायवाची शब्द क्या है?",a:"वीर",w:["डरपोक","कायर","आलसी"],e:"बहादुर = वीर = Brave."},
        {q:"देशभक्ति का अर्थ क्या है?",a:"अपने देश से प्रेम",w:["देश से नफरत","दूसरे देश की तारीफ","कुछ नहीं"],e:"Patriotism means love for one's country."},
        {q:"'मर्दानी' शब्द का अर्थ क्या है?",a:"जो औरत पुरुषों जैसी बहादुर हो",w:["जो डरती हो","जो सोती हो","जो रोती हो"],e:"मर्दानी = A brave woman who fights courageously."},
        {q:"'मातृभूमि' शब्द का अर्थ क्या है?",a:"Motherland / अपना देश",w:["Fatherland"," neighbour","Enemy"],e:"मातृभूमि = Motherland = One's own country."},
        {q:"'रानी' शब्द का अर्थ क्या है?",a:"Queen / महारानी",w:["King","Soldier","Farmer"],e:"रानी = Queen."},
        {q:"हमें वीरों से क्या सीखना चाहिए?",a:"देशभक्ति और बहादुरी",w:["डर और कायरता","आलस और सुस्ती","धोखा और झूठ"],e:"We should learn patriotism and bravery from heroes."},
        {q:"'स्वतंत्रता' शब्द का अर्थ क्या है?",a:"Freedom / आज़ादी",w:["Slavery","Dependence","Weakness"],e:"स्वतंत्रता = Freedom / Independence."},
        {q:"'शहीद' शब्द का अर्थ क्या है?",a:"Martyr / कुर्बान होने वाला",w:["कायर","डरपोक","आलसी"],e:"शहीद = Martyr. देश के लिए जान देने वाला."},
        {q:"'देशभक्त' शब्द का पर्यायवाची शब्द क्या है?",a:"वतनप्रेमी",w:["देशद्रोही","गद्दार","विदेशी"],e:"देशभक्त = वतनप्रेमी = Patriot."},
        {q:"'वीरता' शब्द का पर्यायवाची शब्द क्या है?",a:"शूरता / बहादुरी",w:["कायरता","डरपोकता","आलस्य"],e:"वीरता = शूरता = Bravery."},
        {q:"'कायर' शब्द का पर्यायवाची शब्द क्या है?",a:"डरपोक",w:["वीर","बहादुर","शूर"],e:"कायर = डरपोक = Coward."},
        {q:"'देशद्रोही' शब्द का पर्यायवाची शब्द क्या है?",a:"गद्दार",w:["देशभक्त","वतनप्रेमी","शहीद"],e:"देशद्रोही = गद्दार = Traitor."},
        {q:"'सैनिक' शब्द का पर्यायवाची शब्द क्या है?",a:"जवान / सिपाही",w:["नागरिक","अपराधी","देशद्रोही"],e:"सैनिक = जवान = Soldier."},
        {q:"'हथियार' शब्द का पर्यायवाची शब्द क्या है?",a:"शस्त्र",w:["फूल","उपहार","खिलौना"],e:"हथियार = शस्त्र = Weapon."},
        {q:"'रण' शब्द का पर्यायवाची शब्द क्या है?",a:"युद्ध / लड़ाई",w:["शांति","आराम","मित्रता"],e:"रण = युद्ध = Battle."},
        {q:"'विजय' शब्द का पर्यायवाची शब्द क्या है?",a:"जीत",w:["हार","पराजय","असफलता"],e:"विजय = जीत = Victory."},
        {q:"'पराजय' शब्द का पर्यायवाची शब्द क्या है?",a:"हार",w:["विजय","जीत","सफलता"],e:"पराजय = हार = Defeat."},
        {q:"'सम्मान' शब्द का पर्यायवाची शब्द क्या है?",a:"आदर / इज़्ज़त",w:["अपमान","बेइज़्ज़ती","तिरस्कार"],e:"सम्मान = आदर = Honour."},
        {q:"'अपमान' शब्द का पर्यायवाची शब्द क्या है?",a:"बेइज़्ज़ती",w:["सम्मान","आदर","मान"],e:"अपमान = बेइज़्ज़ती = Insult."},
        {q:"'वफ़ादार' शब्द का पर्यायवाची शब्द क्या है?",a:"निष्ठावान",w:["गद्दार","बेवफ़ा","देशद्रोही"],e:"वफ़ादार = निष्ठावान = Loyal."},
        {q:"'गुलाम' शब्द का पर्यायवाची शब्द क्या है?",a:"दास",w:["आज़ाद","स्वतंत्र","मालिक"],e:"गुलाम = दास = Slave."},
        {q:"'आज़ाद' शब्द का पर्यायवाची शब्द क्या है?",a:"स्वतंत्र",w:["गुलाम","दास","बंधुआ"],e:"आज़ाद = स्वतंत्र = Free."},
        {q:"'कुर्बानी' शब्द का पर्यायवाची शब्द क्या है?",a:"बलिदान",w:["लाभ","फायदा","मुनाफ़ा"],e:"कुर्बानी = बलिदान = Sacrifice."},
        {q:"'हिम्मत' शब्द का पर्यायवाची शब्द क्या है?",a:"साहस",w:["डर","भय","घबराहट"],e:"हिम्मत = साहस = Courage."},
        {q:"'जाँबाज़' शब्द का पर्यायवाची शब्द क्या है?",a:"बहादुर",w:["कायर","डरपोक","आलसी"],e:"जाँबाज़ = बहादुर = Brave."},
        {q:"'जनानी' शब्द का पर्यायवाची शब्द क्या है?",a:"औरत / महिला",w:["पुरुष","मर्द","सैनिक"],e:"जनानी = औरत = Woman."},
        {q:"'वीरांगना' शब्द का अर्थ क्या है?",a:"बहादुर औरत",w:["डरपोक औरत","आलसी औरत","कायर औरत"],e:"वीरांगना = Brave woman / Warrior woman."},
      ],
      // World 7: बचपन (Childhood - Poem)
      [
        {q:"'बचपन' शब्द का अर्थ क्या है?",a:"लड़कपन / शैशव अवस्था",w:["जवानी","बूढ़ापा","मध्यम अवस्था"],e:"बचपन = Childhood / Early years of life."},
        {q:"बचपन में बच्चे कैसे होते हैं?",a:"मासूम और खुशमिजाज़",w:["चालाक और धोखेबाज़","गुस्सैल और क्रोधी","आलसी और सुस्त"],e:"Children in their early years are innocent and cheerful."},
        {q:"'मासूम' शब्द का अर्थ क्या है?",a:"निर्दोष / Innocent",w:["चालाक","गुस्सैल","आलसी"],e:"मासूम = Innocent / Pure / Free from guilt."},
        {q:"बच्चे क्या करना पसंद करते हैं?",a:"खेलना और हँसना",w:["काम करना","रोना और गुस्सा करना","सोना"],e:"Children love to play and laugh."},
        {q:"'खुशमिज़ाज' शब्द का विलोम शब्द क्या है?",a:"उदास / रूठा हुआ",w:["प्रसन्न","आनंदित","हर्षित"],e:"खुशमिज़ाज (Cheerful) → उदास (Sad)."},
        {q:"'याद' शब्द का अर्थ क्या है?",a:"Memory / यादें",w:["भूलना","अनजान","वर्तमान"],e:"याद = Memory / Remembering."},
        {q:"बचपन की सबसे अच्छी बात क्या है?",a:"निर्दोषता और खुशी",w:["चिंता और डर","क्रोध और ईर्ष्या","धोखा और झूठ"],e:"The best thing about childhood is innocence and joy."},
        {q:"'बचपन' शब्द का पर्यायवाची शब्द क्या है?",a:"शैशव / बाल्यावस्था",w:["जवानी","वृद्धावस्था","किशोरावस्था"],e:"बचपन = शैशव = बाल्यावस्था = Childhood."},
        {q:"हमें बचपन की यादों को कैसे रखना चाहिए?",a:"संजोकर और याद करके",w:["भूल जाना चाहिए","मिटा देना चाहिए","नज़रअंदाज़ करना चाहिए"],e:"We should cherish the memories of childhood."},
        {q:"'बाल्यावस्था' शब्द का अर्थ क्या है?",a:"Childhood / बचपन",w:["Youth","Old age","Adulthood"],e:"बाल्यावस्था = Childhood."},
        {q:"'शैशव' शब्द का अर्थ क्या है?",a:"बचपन / बाल्यावस्था",w:["जवानी","वृद्धावस्था","मृत्यु"],e:"शैशव = बचपन = Infancy/Childhood."},
        {q:"'लड़कपन' शब्द का अर्थ क्या है?",a:"बचकाना हरकत",w:["बूढ़ापा","जवानी","परिपक्वता"],e:"लड़कपन = Childishness."},
        {q:"'खेल' शब्द का पर्यायवाची शब्द क्या है?",a:"क्रीड़ा",w:["काम","निद्रा","भय"],e:"खेल = क्रीड़ा = Play / Game."},
        {q:"'हँसी' शब्द का पर्यायवाची शब्द क्या है?",a:"हास्य",w:["रोना","गुस्सा","डर"],e:"हँसी = हास्य = Laughter."},
        {q:"'निर्दोष' शब्द का पर्यायवाची शब्द क्या है?",a:"मासूम",w:["अपराधी","दोषी","गुनहगार"],e:"निर्दोष = मासूम = Innocent."},
        {q:"'खुशी' शब्द का पर्यायवाची शब्द क्या है?",a:"आनंद / प्रसन्नता",w:["दुःख","गम","उदासी"],e:"खुशी = आनंद = Happiness."},
        {q:"'उदासी' शब्द का पर्यायवाची शब्द क्या है?",a:"गम / दुःख",w:["खुशी","आनंद","हर्ष"],e:"उदासी = गम = Sadness."},
        {q:"'चंचल' शब्द का अर्थ क्या है?",a:"Active / Energetic",w:["आलसी","सुस्त","मंद"],e:"चंचल = Active. बच्चे चंचल होते हैं."},
        {q:"'शरारत' शब्द का अर्थ क्या है?",a:"Mischief / Naughtiness",w:["नेकी","अच्छाई","सज्जनता"],e:"शरारत = Mischief. बच्चों की शरारतें."},
        {q:"'परी' शब्द का पर्यायवाची शब्द क्या है?",a:"अप्सरा / देवी",w:["राक्षसी","चुड़ैल","भूत"],e:"परी = अप्सरा = Fairy."},
        {q:"'सपना' शब्द का पर्यायवाची शब्द क्या है?",a:"स्वप्न",w:["यथार्थ","वास्तविकता","सच"],e:"सपना = स्वप्न = Dream."},
        {q:"'खिलौना' शब्द का पर्यायवाची शब्द क्या है?",a:"खिलोना / खेल",w:["काम","निद्रा","भय"],e:"खिलौना = खिलोना = Toy."},
        {q:"'झूला' शब्द का पर्यायवाची शब्द क्या है?",a:"पालना",w:["कुर्सी","मेज","दरवाज़ा"],e:"झूला = पालना = Swing."},
        {q:"'कहानी' शब्द का पर्यायवाची शब्द क्या है?",a:"कथा",w:["इतिहास","विज्ञान","गणित"],e:"कहानी = कथा = Story."},
        {q:"'दादी' शब्द का पर्यायवाची शब्द क्या है?",a:"नानी",w:["माँ","बहन","बेटी"],e:"दादी = नानी = Grandmother."},
        {q:"'दादा' शब्द का पर्यायवाची शब्द क्या है?",a:"नाना",w:["पिता","भाई","बेटा"],e:"दादा = नाना = Grandfather."},
        {q:"'लोरी' शब्द का अर्थ क्या है?",a:"सुलाने का गीत",w:["नाच","कहानी","खेल"],e:"लोरी = Lullaby. बच्चों को सुलाने का गीत."},
        {q:"'बच्चा' शब्द का पर्यायवाची शब्द क्या है?",a:"शिशु / बालक",w:["बूढ़ा","वृद्ध","जवान"],e:"बच्चा = शिशु = Child."},
        {q:"'संझा' शब्द का अर्थ क्या है?",a:"संध्या / शाम",w:["सुबह","रात","दोपहर"],e:"संझा = संध्या = Evening."},
      ],
      // World 8: अक्ल बड़ी या भैंस (Wisdom Story)
      [
        {q:"'होशियार' शब्द का अर्थ क्या है?",a:"बुद्धिमान / Intelligent",w:["मूर्ख","आलसी","डरपोक"],e:"होशियार = Clever / Intelligent / Sharp-minded."},
        {q:"'बुद्धिमान' शब्द का पर्यायवाची शब्द क्या है?",a:"होशियार",w:["मूर्ख","आलसी","बेकार"],e:"बुद्धिमान = होशियार = Intelligent / Wise."},
        {q:"समस्याओं का हल कैसे निकालना चाहिए?",a:"बुद्धि और सोच से",w:["लड़ाई से","धोखा देकर","चोरी करके"],e:"Problems should be solved using wit and intelligence."},
        {q:"'दरबार' शब्द का अर्थ क्या है?",a:"राजा का सभा-स्थल (Court)",w:["खेत","बाज़ार","स्कूल"],e:"दरबार = Royal court where the king holds meetings."},
        {q:"'समस्या' शब्द का अर्थ क्या है?",a:"Problem",w:["Solution","Joy","Friend"],e:"समस्या = Problem / Difficulty."},
        {q:"होशियार लोग कैसे होते हैं?",a:"तेज़ दिमाग और चतुर",w:["धीमे और मूर्ख","आलसी","डरपोक"],e:"Clever people are sharp-minded and quick thinkers."},
        {q:"'चतुर' शब्द का विलोम शब्द क्या है?",a:"मूर्ख",w:["होशियार","बुद्धिमान","तेज़"],e:"चतुर (Clever) → मूर्ख (Foolish)."},
        {q:"'उपाय' शब्द का अर्थ क्या है?",a:"Solution / तरीका",w:["Problem","Fight","Escape"],e:"उपाय = Solution / Way out."},
        {q:"हमें होशियार लोगों से क्या सीखना चाहिए?",a:"सोच-समझकर काम करना",w:["जल्दबाजी करना","धोखा देना","कुछ न करना"],e:"We should learn to think before acting."},
        {q:"'सलाह' शब्द का अर्थ क्या है?",a:"Advice / सुझाव",w:["Fight","Anger","Ignore"],e:"सलाह = Advice / Suggestion."},
        {q:"'अक्ल' शब्द का पर्यायवाची शब्द क्या है?",a:"बुद्धि",w:["मूर्खता","आलस्य","डर"],e:"अक्ल = बुद्धि = Intelligence."},
        {q:"'भैंस' शब्द का पर्यायवाची शब्द क्या है?",a:"भैंस",w:["गाय","बकरी","भेड़"],e:"भैंस = Buffalo. अक्ल बड़ी या भैंस = Wisdom is greater than strength."},
        {q:"'राजा' शब्द का पर्यायवाची शब्द क्या है?",a:"महाराजा",w:["सैनिक","चोर","गरीब"],e:"राजा = महाराजा = King."},
        {q:"'मंत्री' शब्द का पर्यायवाची शब्द क्या है?",a:"सलाहकार",w:["चोर","दुश्मन","सैनिक"],e:"मंत्री = सलाहकार = Minister / Advisor."},
        {q:"'सभा' शब्द का पर्यायवाची शब्द क्या है?",a:"मीटिंग / सम्मेलन",w:["खेल","नाच","लड़ाई"],e:"सभा = Meeting / Assembly."},
        {q:"'प्रश्न' शब्द का पर्यायवाची शब्द क्या है?",a:"सवाल",w:["उत्तर","जवाब","हल"],e:"प्रश्न = सवाल = Question."},
        {q:"'उत्तर' शब्द का पर्यायवाची शब्द क्या है?",a:"जवाब",w:["प्रश्न","सवाल","समस्या"],e:"उत्तर = जवाब = Answer."},
        {q:"'तर्क' शब्द का पर्यायवाची शब्द क्या है?",a:"विचार / तर्क",w:["भावना","डर","क्रोध"],e:"तर्क = Logic / Reasoning."},
        {q:"'मूर्ख' शब्द का पर्यायवाची शब्द क्या है?",a:"अज्ञानी",w:["होशियार","बुद्धिमान","चतुर"],e:"मूर्ख = अज्ञानी = Foolish."},
        {q:"'तेज़' शब्द का पर्यायवाची शब्द क्या है?",a:"शीघ्र",w:["धीमा","मंद","आलसी"],e:"तेज़ = शीघ्र = Fast."},
        {q:"'धीमा' शब्द का पर्यायवाची शब्द क्या है?",a:"मंद",w:["तेज़","शीघ्र","जल्दी"],e:"धीमा = मंद = Slow."},
        {q:"'कहानी' शब्द का पर्यायवाची शब्द क्या है?",a:"कथा",w:["इतिहास","विज्ञान","गणित"],e:"कहानी = कथा = Story."},
        {q:"'नीति' शब्द का पर्यायवाची शब्द क्या है?",a:"सीख / उपदेश",w:["अनीति","बुराई","धोखा"],e:"नीति = Moral / Lesson."},
        {q:"'उपदेश' शब्द का पर्यायवाची शब्द क्या है?",a:"सीख / नसीहत",w:["धोखा","छल","फरेब"],e:"उपदेश = Lesson / Teaching."},
        {q:"'सीख' शब्द का पर्यायवाची शब्द क्या है?",a:"उपदेश",w:["भूल","ग़लती","अनजान"],e:"सीख = Lesson."},
        {q:"'समझदार' शब्द का पर्यायवाची शब्द क्या है?",a:"बुद्धिमान",w:["मूर्ख","अज्ञानी","आलसी"],e:"समझदार = बुद्धिमान = Wise."},
        {q:"'जल्दबाज़' शब्द का पर्यायवाची शब्द क्या है?",a:"अधीर",w:["धीरजवान","शांत","स्थिर"],e:"जल्दबाज़ = अधीर = Impatient."},
        {q:"'समस्या' शब्द का पर्यायवाची शब्द क्या है?",a:"मुश्किल",w:["आसानी","सरलता","सुविधा"],e:"समस्या = मुश्किल = Problem."},
        {q:"'हल' शब्द का पर्यायवाची शब्द क्या है?",a:"उपाय",w:["समस्या","मुश्किल","संकट"],e:"हल = उपाय = Solution."},
      ],
      // World 9: हमारा भारत (Our India - Patriotic Poem)
      [
        {q:"'भारत' देश का दूसरा नाम क्या है?",a:"हिंदुस्तान / इंडिया",w:["चीन","पाकिस्तान","अमेरिका"],e:"भारत = India = Hindustan."},
        {q:"भारत की राजधानी क्या है?",a:"नई दिल्ली",w:["मुंबई","कोलकाता","चेन्नई"],e:"New Delhi is the capital of India."},
        {q:"भारत का राष्ट्रीय पंछी कौन सा है?",a:"मोर (Peacock)",w:["गिद्ध","कौआ","तोता"],e:"The peacock (मोर) is India's national bird."},
        {q:"भारत का राष्ट्रीय फूल कौन सा है?",a:"कमल (Lotus)",w:["गुलाब","सूरजमुखी","गेंदा"],e:"The lotus (कमल) is India's national flower."},
        {q:"भारत का राष्ट्रीय जानवर कौन सा है?",a:"बाघ (Tiger)",w:["हाथी","सिंह","भालू"],e:"The Bengal tiger (बाघ) is India's national animal."},
        {q:"'स्वतंत्रता दिवस' कब मनाया जाता है?",a:"15 अगस्त",w:["26 जनवरी","2 अक्टूबर","14 नवंबर"],e:"Independence Day is celebrated on 15th August."},
        {q:"भारत की सबसे बड़ी नदी कौन सी है?",a:"गंगा (Ganges)",w:["यमुना","कावेरी","नर्मदा"],e:"The Ganga is the longest and most sacred river in India."},
        {q:"भारत में कितने राज्य हैं?",a:"28 राज्य",w:["25 राज्य","30 राज्य","20 राज्य"],e:"India has 28 states and 8 Union territories."},
        {q:"'वंदे मातरम' का अर्थ क्या है?",a:"मैं मातृभूमि को प्रणाम करता हूँ",w:["जय हिन्द","भारत माता की जय","जय जवान"],e:"Vande Mataram means 'I bow to thee, Mother'."},
        {q:"भारत का राष्ट्रीय ध्वज कैसा दिखता है?",a:"तीन रंगों की पट्टियाँ: केसरिया, सफेद, हरा",w:["दो रंग: लाल और नीला","एक रंग: हरा","चार रंग"],e:"The Indian flag has three horizontal stripes: saffron, white, and green."},
        {q:"भारत का राष्ट्रीय गीत कौन सा है?",a:"वंदे मातरम",w:["जन गण मन","सारे जहाँ से अच्छा","झंडा ऊँचा रहे हमारा"],e:"वंदे मातरम is India's national song."},
        {q:"भारत का राष्ट्रीय गान कौन सा है?",a:"जन गण मन",w:["वंदे मातरम","सारे जहाँ से अच्छा","झंडा ऊँचा रहे हमारा"],e:"जन गण मन is India's national anthem."},
        {q:"'गणतंत्र दिवस' कब मनाया जाता है?",a:"26 जनवरी",w:["15 अगस्त","2 अक्टूबर","14 नवंबर"],e:"Republic Day is celebrated on 26th January."},
        {q:"भारत का राष्ट्रीय पेड़ कौन सा है?",a:"बरगद (Banyan)",w:["आम","नीम","पीपल"],e:"The Banyan tree (बरगद) is India's national tree."},
        {q:"भारत का राष्ट्रीय फल कौन सा है?",a:"आम (Mango)",w:["सेब","केला","संतरा"],e:"Mango (आम) is India's national fruit."},
        {q:"'हिंदी' भारत की क्या है?",a:"राजभाषा",w:["विदेशी भाषा","प्रादेशिक भाषा","अल्पसंख्यक भाषा"],e:"Hindi is the official language of India."},
        {q:"भारत की सबसे ऊँची चोटी कौन सी है?",a:"माउंट एवरेस्ट",w:["कांचनजंघा","नंदा देवी","केटू"],e:"Mount Everest is the highest peak in India/World."},
        {q:"'संविधान' शब्द का अर्थ क्या है?",a:"Constitution",w:["Dictatorship","Monarchy","Anarchy"],e:"संविधान = Constitution. भारत का संविधान."},
        {q:"भारत का राष्ट्रीय चिह्न क्या है?",a:"अशोक स्तंभ",w:["ताज महल","लाल किला","कुतुब मीनार"],e:"The Ashoka Pillar (अशोक स्तंभ) is India's national emblem."},
        {q:"'अहिंसा' शब्द का अर्थ क्या है?",a:"Non-violence",w:["Violence","War","Hate"],e:"अहिंसा = Non-violence. गांधीजी का सिद्धांत."},
        {q:"'एकता' शब्द का अर्थ क्या है?",a:"Unity",w:["Division","Hate","War"],e:"एकता = Unity. भारत की एकता में अनेकता."},
        {q:"'अनेकता' शब्द का अर्थ क्या है?",a:"Diversity",w:["Sameness","Uniformity","Singularity"],e:"अनेकता = Diversity. भारत में अनेकता में एकता."},
        {q:"'संस्कृति' शब्द का अर्थ क्या है?",a:"Culture",w:["War","Hate","Poverty"],e:"संस्कृति = Culture. भारत की संस्कृति."},
        {q:"'भाषा' शब्द का पर्यायवाची शब्द क्या है?",a:"बोली",w:["युद्ध","शांति","संस्कृति"],e:"भाषा = बोली = Language."},
        {q:"'संसार' शब्द का पर्यायवाची शब्द क्या है?",a:"दुनिया / जग",w:["गाँव","घर","मकान"],e:"संसार = दुनिया = World."},
        {q:"'मानवता' शब्द का अर्थ क्या है?",a:"Humanity",w:["Inhumanity","Cruelty","Hate"],e:"मानवता = Humanity."},
        {q:"'शांति' शब्द का पर्यायवाची शब्द क्या है?",a:"सुकून",w:["युद्ध","लड़ाई","हिंसा"],e:"शांति = सुकून = Peace."},
        {q:"'स्वर्ग' शब्द का पर्यायवाची शब्द क्या है?",a:"जन्नत",w:["नरक","पाताल","धरती"],e:"स्वर्ग = जन्नत = Heaven."},
        {q:"'पर्व' शब्द का पर्यायवाची शब्द क्या है?",a:"त्योहार / उत्सव",w:["दुःख","गम","शोक"],e:"पर्व = त्योहार = Festival."},
      ],
      // World 10: प्रकृति (Nature - Poem)
      [
        {q:"'प्रकृति' शब्द का अर्थ क्या है?",a:"Nature / प्राकृतिक संसार",w:["City","Village","Building"],e:"प्रकृति = Nature = the natural world around us."},
        {q:"'पेड़' शब्द का बहुवचन क्या है?",a:"पेड़",w:["पेड़ा","पेड़ों","पेड़ी"],e:"पेड़ = Tree(s) - same form for singular and plural."},
        {q:"प्रकृति में कौन-कौन से रंग हैं?",a:"हरा, पीला, लाल, नीला",w:["सिर्फ काला और सफेद","सिर्फ हरा","कोई रंग नहीं"],e:"Nature is full of many beautiful colours."},
        {q:"'पहाड़' शब्द का पर्यायवाची शब्द क्या है?",a:"पर्वत / अचल",w:["नदी","समुद्र","मैदान"],e:"पहाड़ = पर्वत = Mountain."},
        {q:"'नदी' शब्द का बहुवचन क्या है?",a:"नदियाँ",w:["नदी","नदा","नदिन"],e:"नदी (Singular) → नदियाँ (Plural)."},
        {q:"प्रकृति से हमें क्या सीखना चाहिए?",a:"शांति और सद्भाव",w:["लड़ना","चिल्लाना","गुस्सा करना"],e:"Nature teaches us peace and harmony."},
        {q:"'फूल' शब्द का बहुवचन क्या है?",a:"फूल",w:["फूला","फूली","फूलों"],e:"फूल = same in singular and plural."},
        {q:"प्रकृति की सुंदरता कब सबसे अच्छी लगती है?",a:"सुबह-सुबह (Morning)",w:["रात में","दोपहर में","शाम को"],e:"Nature is most beautiful in the early morning."},
        {q:"'पत्ती' शब्द का बहुवचन क्या है?",a:"पत्तियाँ",w:["पत्ता","पत्ते","पत्तिन"],e:"पत्ती (Singular) → पत्तियाँ (Plural - feminine)."},
        {q:"प्रकृति की कविताएँ क्या सिखाती हैं?",a:"प्रकृति के प्रति प्रेम और सम्मान",w:["गुस्सा और लड़ाई","डर और चिंता","थकान और नींद"],e:"Nature poems teach us to love and respect nature."},
        {q:"'हवा' शब्द का पर्यायवाची शब्द क्या है?",a:"वायु / पवन",w:["अग्नि","जल","पृथ्वी"],e:"हवा = वायु = पवन = Wind/Air."},
        {q:"'आग' शब्द का पर्यायवाची शब्द क्या है?",a:"अग्नि",w:["जल","वायु","पृथ्वी"],e:"आग = अग्नि = Fire."},
        {q:"'पानी' शब्द का पर्यायवाची शब्द क्या है?",a:"जल / नीर",w:["अग्नि","वायु","पृथ्वी"],e:"पानी = जल = नीर = Water."},
        {q:"'धरती' शब्द का पर्यायवाची शब्द क्या है?",a:"पृथ्वी / जमीन",w:["आकाश","अग्नि","वायु"],e:"धरती = पृथ्वी = Earth."},
        {q:"'सूरज' शब्द का पर्यायवाची शब्द क्या है?",a:"सूर्य / रवि",w:["चाँद","तारा","बादल"],e:"सूरज = सूर्य = Sun."},
        {q:"'बादल' शब्द का पर्यायवाची शब्द क्या है?",a:"मेघ",w:["सूरज","चाँद","तारा"],e:"बादल = मेघ = Cloud."},
        {q:"'वर्षा' शब्द का पर्यायवाची शब्द क्या है?",a:"बारिश",w:["धूप","ओस","पाला"],e:"वर्षा = बारिश = Rain."},
        {q:"'सर्दी' शब्द का पर्यायवाची शब्द क्या है?",a:"जाड़ा",w:["गर्मी","बरसात","बसंत"],e:"सर्दी = जाड़ा = Winter."},
        {q:"'गर्मी' शब्द का पर्यायवाची शब्द क्या है?",a:"उष्णकाल",w:["सर्दी","जाड़ा","बरसात"],e:"गर्मी = उष्णकाल = Summer."},
        {q:"'बसंत' शब्द का पर्यायवाची शब्द क्या है?",a:"वसंत",w:["ग्रीष्म","शरद","हेमंत"],e:"बसंत = वसंत = Spring."},
        {q:"'पतझड़' शब्द का पर्यायवाची शब्द क्या है?",a:"शरद",w:["वसंत","ग्रीष्म","बरसात"],e:"पतझड़ = शरद = Autumn."},
        {q:"'ओस' शब्द का पर्यायवाची शब्द क्या है?",a:"शबनम",w:["बारिश","वर्षा","तूफ़ान"],e:"ओस = शबनम = Dew."},
        {q:"'तूफ़ान' शब्द का पर्यायवाची शब्द क्या है?",a:"आंधी",w:["शांति","सुकून","खामोशी"],e:"तूफ़ान = आंधी = Storm."},
        {q:"'समुद्र' शब्द का पर्यायवाची शब्द क्या है?",a:"सागर / महासागर",w:["नदी","तालाब","पोखर"],e:"समुद्र = सागर = Ocean."},
        {q:"'झरना' शब्द का पर्यायवाची शब्द क्या है?",a:"झरना / सोता",w:["समुद्र","नदी","तालाब"],e:"झरना = Waterfall / Stream."},
        {q:"'वन' शब्द का पर्यायवाची शब्द क्या है?",a:"जंगल",w:["मरुस्थल","रेगिस्तान","सहरा"],e:"वन = जंगल = Forest."},
        {q:"'मरुस्थल' शब्द का पर्यायवाची शब्द क्या है?",a:"रेगिस्तान",w:["जंगल","वन","उद्यान"],e:"मरुस्थल = रेगिस्तान = Desert."},
        {q:"'उद्यान' शब्द का पर्यायवाची शब्द क्या है?",a:"बगीचा",w:["रेगिस्तान","जंगल","मरुस्थल"],e:"उद्यान = बगीचा = Garden."},
        {q:"'फल' शब्द का पर्यायवाची शब्द क्या है?",a:"फलद्रुप्य",w:["फूल","पत्ती","जड़"],e:"फल = Fruit."},
        {q:"'सुगंध' शब्द का पर्यायवाची शब्द क्या है?",a:"महक",w:["दुर्गंध","बदबू","कड़वाहट"],e:"सुगंध = महक = Fragrance."},
      ],
    ];
    const selected = questions[worldId - 1] || questions[0];
    return selected.slice(0, n).map((item: any) => {
      const opts = this.shuffleArray([item.a, item.w[0], item.w[1], item.w[2]]);
      return { question: item.q, options: opts, correctIndex: opts.indexOf(item.a), explanation: item.e, image: item.i };
    });
  }

  static getQuestions(subjectId: string, bookId: number, worldId: number, count = 30): MathQuestion[] {
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
