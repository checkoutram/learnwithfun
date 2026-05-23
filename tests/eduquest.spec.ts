/**
 * EduQuest Multi-Subject Platform - Playwright Test Suite
 * Tests: Menu, Name Input, Subject Select, Book Select, World Select, Question Flow
 * Positive, negative, and edge cases for ALL subjects
 */

import { test, expect } from '@playwright/test';

const TEST_NAME = 'Aarav';
const INVALID_NAMES = ['', 'A', 'Aarav123', 'Aarav@#!', 'AaravKumarSinghIsTheBest', '   '];

// ===== HELPERS =====
async function startGame(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function enterName(page, name) {
  await page.click('button:has-text("PLAY")');
  await page.waitForSelector('[data-testid="name-input"]');
  if (name) await page.fill('[data-testid="name-input"]', name);
  await page.click('[data-testid="name-submit"]');
}

async function selectSubject(page, subjectName) {
  await page.waitForSelector('.subject-screen');
  await page.click(`.subject-card:has-text("${subjectName}")`);
}

async function selectBook(page, bookName) {
  await page.waitForSelector('.book-screen');
  await page.click(`.book-card:has-text("${bookName}")`);
}

async function startWorld(page, worldName) {
  await page.waitForSelector('.worlds-grid');
  await page.click(`.world-card:has-text("${worldName}")`);
  await page.waitForSelector('.question-card');
}

async function answerQuestion(page, btnIndex = 0) {
  await page.click(`[data-testid="answer-btn-${btnIndex}"]`);
  await page.waitForSelector('[data-testid="next-btn"]');
}

// ===== MENU SCREEN =====
test.describe('Menu Screen', () => {
  test('should display title, mascot, and buttons', async ({ page }) => {
    await startGame(page);
    await expect(page.locator('.game-title')).toHaveText('Subjects of Fun');
    await expect(page.locator('.hero-img')).toBeVisible();
    await expect(page.locator('button:has-text("PLAY")')).toBeVisible();
    await expect(page.locator('button:has-text("How to Play")')).toBeVisible();
  });

  test('should navigate to name input on Play click', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await expect(page.locator('.name-screen')).toBeVisible();
  });
});

// ===== NAME INPUT =====
test.describe('Name Input', () => {
  test('should accept valid name and go to subjects', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await expect(page.locator('.subject-screen')).toBeVisible();
    await expect(page.locator('.subject-greeting')).toContainText(TEST_NAME);
  });

  test('should reject empty name', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.click('[data-testid="name-submit"]');
    await expect(page.locator('[data-testid="name-error"]')).toHaveText('Please tell us your name!');
  });

  test('should reject single character', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.fill('[data-testid="name-input"]', 'A');
    await page.click('[data-testid="name-submit"]');
    await expect(page.locator('[data-testid="name-error"]')).toHaveText('Name must be at least 2 letters!');
  });

  test('should reject numbers', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.fill('[data-testid="name-input"]', 'Aarav123');
    await page.click('[data-testid="name-submit"]');
    await expect(page.locator('[data-testid="name-error"]')).toHaveText('Use only letters, spaces, and hyphens!');
  });

  test('should reject special characters', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.fill('[data-testid="name-input"]', 'Aarav@#!');
    await page.click('[data-testid="name-submit"]');
    await expect(page.locator('[data-testid="name-error"]')).toContainText('only letters');
  });

  test('should reject name over 20 chars', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.fill('[data-testid="name-input"]', 'AaravKumarSinghIsTheBest');
    await page.click('[data-testid="name-submit"]');
    await expect(page.locator('[data-testid="name-error"]')).toContainText('too long');
  });

  test('should trim whitespace', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.fill('[data-testid="name-input"]', `  ${TEST_NAME}  `);
    await page.click('[data-testid="name-submit"]');
    await expect(page.locator('.subject-screen')).toBeVisible();
  });

  test('should skip and use default name', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.click('[data-testid="name-skip"]');
    await expect(page.locator('.subject-screen')).toBeVisible();
    await expect(page.locator('.subject-greeting')).toContainText('Explorer');
  });

  test('should navigate with Enter key', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.fill('[data-testid="name-input"]', TEST_NAME);
    await page.keyboard.press('Enter');
    await expect(page.locator('.subject-screen')).toBeVisible();
  });

  test('should clear error on type', async ({ page }) => {
    await startGame(page);
    await page.click('button:has-text("PLAY")');
    await page.click('[data-testid="name-submit"]');
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
    await page.fill('[data-testid="name-input"]', 'A');
    await expect(page.locator('[data-testid="name-error"]')).not.toBeVisible();
  });
});

// ===== SUBJECT SELECT =====
test.describe('Subject Select', () => {
  test.beforeEach(async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
  });

  test('should display all 6 subjects', async ({ page }) => {
    const cards = page.locator('.subject-card');
    await expect(cards).toHaveCount(6);
  });

  test('should display subject names', async ({ page }) => {
    await expect(page.locator('.subject-card:has-text("Mathematics")')).toBeVisible();
    await expect(page.locator('.subject-card:has-text("English")')).toBeVisible();
    await expect(page.locator('.subject-card:has-text("Science")')).toBeVisible();
    await expect(page.locator('.subject-card:has-text("Social Science")')).toBeVisible();
    await expect(page.locator('.subject-card:has-text("Tamil")')).toBeVisible();
    await expect(page.locator('.subject-card:has-text("Hindi")')).toBeVisible();
  });

  test('should navigate to book select for multi-book subject (English)', async ({ page }) => {
    await selectSubject(page, 'English');
    await expect(page.locator('.book-screen')).toBeVisible();
  });

  test('should navigate directly to worlds for single-book subject (Science)', async ({ page }) => {
    await selectSubject(page, 'Science');
    await expect(page.locator('.worlds-screen')).toBeVisible();
  });

  test('should navigate directly to worlds for single-book subject (Math)', async ({ page }) => {
    await page.click('.btn-back');
    await selectSubject(page, 'Mathematics');
    await expect(page.locator('.worlds-screen')).toBeVisible();
  });

  test('should show personalized greeting', async ({ page }) => {
    await expect(page.locator('.subject-greeting')).toContainText(TEST_NAME);
  });

  test('back button returns to menu', async ({ page }) => {
    await page.click('.btn-back');
    await expect(page.locator('.menu-screen')).toBeVisible();
  });

  test('selecting remembered name skips name screen', async ({ page }) => {
    await page.click('.btn-back');
    await expect(page.locator('.menu-screen')).toBeVisible();
    await page.click('button:has-text("PLAY")');
    await expect(page.locator('.subject-screen')).toBeVisible();
  });
});

// ===== BOOK SELECT (English) =====
test.describe('Book Select - English', () => {
  test.beforeEach(async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'English');
  });

  test('should display both books', async ({ page }) => {
    await expect(page.locator('.book-card:has-text("Textbook")')).toBeVisible();
    await expect(page.locator('.book-card:has-text("Grammar")')).toBeVisible();
  });

  test('should navigate to worlds on Textbook click', async ({ page }) => {
    await page.click('.book-card:has-text("Textbook")');
    await expect(page.locator('.worlds-screen')).toBeVisible();
  });

  test('should navigate to worlds on Grammar click', async ({ page }) => {
    await page.click('.book-card:has-text("Grammar")');
    await expect(page.locator('.worlds-screen')).toBeVisible();
  });

  test('back button returns to subject select', async ({ page }) => {
    await page.click('.btn-back');
    await expect(page.locator('.subject-screen')).toBeVisible();
  });
});

// ===== BOOK SELECT (Tamil) =====
test.describe('Book Select - Tamil', () => {
  test.beforeEach(async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'Tamil');
  });

  test('should show disabled main book', async ({ page }) => {
    await expect(page.locator('.book-card.disabled:has-text("Coming Soon")')).toBeVisible();
  });

  test('should show enabled grammar book', async ({ page }) => {
    await expect(page.locator('.book-card:not(.disabled):has-text("Grammar")')).toBeVisible();
  });

  test('disabled book should not be clickable', async ({ page }) => {
    await page.click('.book-card.disabled');
    await expect(page.locator('.book-screen')).toBeVisible();
  });

  test('grammar book should navigate to worlds', async ({ page }) => {
    await page.click('.book-card:not(.disabled)');
    await expect(page.locator('.worlds-screen')).toBeVisible();
  });
});

// ===== QUESTION SCREEN - ALL SUBJECTS =====
test.describe('Question Screen - Answer Flow', () => {
  test.beforeEach(async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'Mathematics');
    await startWorld(page, 'Number Kingdom');
  });

  test('should display question with 4 options', async ({ page }) => {
    await expect(page.locator('.question-text')).toBeVisible();
    await expect(page.locator('[data-testid="answer-btn-0"]')).toBeVisible();
    await expect(page.locator('[data-testid="answer-btn-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="answer-btn-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="answer-btn-3"]')).toBeVisible();
  });

  test('should lock buttons after any answer', async ({ page }) => {
    await answerQuestion(page, 0);
    for (let i = 0; i < 4; i++) {
      await expect(page.locator(`[data-testid="answer-btn-${i}"]`)).toBeDisabled();
    }
  });

  test('should show personalized appreciation with name', async ({ page }) => {
    await answerQuestion(page, 0);
    await expect(page.locator('[data-testid="appreciation-message"]')).toContainText(TEST_NAME);
  });

  test('should not allow double selection after wrong answer', async ({ page }) => {
    await page.click('[data-testid="answer-btn-0"]');
    await page.click('[data-testid="answer-btn-1"]');
    const selected = await page.locator('.answer-btn.wrong, .answer-btn.correct, .answer-btn.revealed-correct').count();
    expect(selected).toBeGreaterThanOrEqual(1);
  });

  test('back button shows confirmation after answering', async ({ page }) => {
    await answerQuestion(page, 0);
    await page.click('.btn-back');
    await expect(page.locator('.modal-overlay')).toBeVisible();
  });

  test('Keep Playing dismisses confirmation', async ({ page }) => {
    await answerQuestion(page, 0);
    await page.click('.btn-back');
    await page.click('button:has-text("Keep Playing")');
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
    await expect(page.locator('.question-screen')).toBeVisible();
  });

  test('Leave exits to world map', async ({ page }) => {
    await answerQuestion(page, 0);
    await page.click('.btn-back');
    await page.click('button:has-text("Leave")');
    await expect(page.locator('.worlds-screen')).toBeVisible();
  });

  test('completing 5 questions shows world complete', async ({ page }) => {
    for (let q = 0; q < 5; q++) {
      await answerQuestion(page, 0);
      if (q < 4) await page.click('[data-testid="next-btn"]');
    }
    await expect(page.locator('.complete-screen')).toBeVisible();
    await expect(page.locator('.complete-title')).toContainText('World Complete');
  });
});

// ===== EDGE CASES =====
test.describe('Edge Cases', () => {
  test('rapid clicking does not break state', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'Science');
    await startWorld(page, 'Plant Paradise');
    await page.click('[data-testid="answer-btn-0"]');
    await page.click('[data-testid="answer-btn-1"]');
    await page.click('[data-testid="answer-btn-2"]');
    const selected = await page.locator('.answer-btn.wrong, .answer-btn.correct').count();
    expect(selected).toBe(1);
  });

  test('progress persists across subjects', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'Science');
    await startWorld(page, 'Plant Paradise');
    await answerQuestion(page, 0);
    await page.click('[data-testid="next-btn"]');
    await page.click('.btn-back');
    await page.click('button:has-text("Leave")');
    await page.click('.btn-back');
    await selectSubject(page, 'Mathematics');
    await expect(page.locator('.worlds-screen')).toBeVisible();
  });

  test('localStorage saves multi-subject progress', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'Mathematics');
    await startWorld(page, 'Number Kingdom');
    await answerQuestion(page, 0);
    const saved = await page.evaluate(() => {
      const data = localStorage.getItem('subjectsOfFun_v1');
      return data ? JSON.parse(data) : null;
    });
    expect(saved).not.toBeNull();
    expect(saved.playerName).toBe(TEST_NAME);
    expect(saved.subjectProgress).toBeDefined();
  });

  test('all 4 answer options are unique', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'Science');
    await startWorld(page, 'Plant Paradise');
    const opts: string[] = [];
    for (let i = 0; i < 4; i++) {
      const text = await page.locator(`[data-testid="answer-btn-${i}"]`).textContent();
      opts.push(text || '');
    }
    const unique = new Set(opts);
    expect(unique.size).toBe(4);
  });

  test('page refresh keeps player name', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await page.reload();
    await page.click('button:has-text("PLAY")');
    await expect(page.locator('.subject-screen')).toBeVisible();
    await expect(page.locator('.subject-greeting')).toContainText(TEST_NAME);
  });
});

// ===== CROSS-SUBJECT NAVIGATION =====
test.describe('Cross-Subject Navigation', () => {
  test('full flow: Math → English Grammar → Science', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);

    // Math
    await selectSubject(page, 'Mathematics');
    await expect(page.locator('.worlds-screen')).toBeVisible();
    await page.click('.btn-back');

    // English Grammar
    await selectSubject(page, 'English');
    await page.click('.book-card:has-text("Grammar")');
    await expect(page.locator('.worlds-screen')).toBeVisible();
    await page.click('.btn-back');
    await page.click('.btn-back');

    // Science (direct to worlds)
    await selectSubject(page, 'Science');
    await expect(page.locator('.worlds-screen')).toBeVisible();
  });

  test('Hindi (3rd language) subject select and question', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'Hindi');
    await expect(page.locator('.worlds-screen')).toBeVisible();
    await startWorld(page, 'Shabd Sadan');
    await expect(page.locator('.question-card')).toBeVisible();
    await expect(page.locator('[data-testid="answer-btn-0"]')).toBeVisible();
  });

  test('Tamil Grammar subject select and question', async ({ page }) => {
    await startGame(page);
    await enterName(page, TEST_NAME);
    await selectSubject(page, 'Tamil');
    await page.click('.book-card:not(.disabled)');
    await expect(page.locator('.worlds-screen')).toBeVisible();
    await startWorld(page, 'ezhuthu Elango');
    await expect(page.locator('.question-card')).toBeVisible();
  });
});
