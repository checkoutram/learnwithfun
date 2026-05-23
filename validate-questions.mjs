// Validation script - generates thousands of questions and checks for duplicates
import { QuestionGenerator } from './src/game/QuestionGenerator.ts';

let totalQuestions = 0;
let duplicateCount = 0;
let correctDuplicates = 0;
let issues = [];

for (let world = 1; world <= 10; world++) {
  for (let batch = 0; batch < 50; batch++) {
    const questions = QuestionGenerator.getQuestionsForWorld(world, 5);
    for (const q of questions) {
      totalQuestions++;
      
      // Check 1: All 4 options must be unique
      const unique = new Set(q.options);
      if (unique.size !== 4) {
        duplicateCount++;
        issues.push({
          world,
          type: 'duplicate_options',
          question: q.question.substring(0, 60),
          options: q.options,
          correct: q.options[q.correctIndex]
        });
      }
      
      // Check 2: Correct answer must appear exactly once
      const correctOccurrences = q.options.filter(opt => opt === q.options[q.correctIndex]).length;
      if (correctOccurrences !== 1) {
        correctDuplicates++;
        issues.push({
          world,
          type: 'correct_answer_appears_' + correctOccurrences + '_times',
          question: q.question.substring(0, 60),
          options: q.options,
          correct: q.options[q.correctIndex]
        });
      }
    }
  }
}

console.log('\n========== VALIDATION RESULTS ==========');
console.log(`Total questions generated: ${totalQuestions}`);
console.log(`Duplicate options found:   ${duplicateCount}`);
console.log(`Correct answer duplicates: ${correctDuplicates}`);
console.log(`Pass rate: ${((totalQuestions - duplicateCount - correctDuplicates) / totalQuestions * 100).toFixed(4)}%`);

if (issues.length > 0) {
  console.log('\n--- First 10 issues ---');
  issues.slice(0, 10).forEach((issue, i) => {
    console.log(`\n[${i+1}] World ${issue.world} | ${issue.type}`);
    console.log(`  Q: ${issue.question}`);
    console.log(`  Options: ${JSON.stringify(issue.options)}`);
    console.log(`  Correct: ${issue.correct}`);
  });
} else {
  console.log('\nALL CLEAR: No duplicate options found!');
}
console.log('========================================\n');

process.exit(duplicateCount > 0 || correctDuplicates > 0 ? 1 : 0);
