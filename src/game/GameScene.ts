import * as Phaser from 'phaser';
import { QuestionGenerator } from './QuestionGenerator';
import type { MathQuestion } from './QuestionGenerator';

interface GameState {
  worldId: number;
  starsCollected: number;
  totalStars: number;
  questionsSolved: boolean[];
}

export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private stars: Phaser.GameObjects.Sprite[] = [];
  private nodes: { sprite: Phaser.GameObjects.Container; solved: boolean; question: MathQuestion; id: number }[] = [];
  private obstacles: Phaser.GameObjects.Sprite[] = [];
  private gameState: GameState = { worldId: 1, starsCollected: 0, totalStars: 5, questionsSolved: [] };
  private scoreText!: Phaser.GameObjects.Text;
  private questionPanel!: Phaser.GameObjects.Container;
  private isPanelOpen = false;
  private currentNodeIndex = -1;
  private background!: Phaser.GameObjects.TileSprite;
  private worldNameText!: Phaser.GameObjects.Text;
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;

  // World configurations
  private readonly worlds = [
    { id: 1, name: 'Number Kingdom', bg: 'bg_world1', topic: 'Place Value' },
    { id: 2, name: 'Multiplication Forest', bg: 'bg_world2', topic: 'Multiplication' },
    { id: 3, name: 'Division Desert', bg: 'bg_world3', topic: 'Division' },
    { id: 4, name: 'Factor Farm', bg: 'bg_world4', topic: 'Factors & Multiples' },
    { id: 5, name: 'Lake Fraction', bg: 'bg_world5', topic: 'Fractions' },
    { id: 6, name: 'Decimal City', bg: 'bg_world6', topic: 'Decimals' },
    { id: 7, name: 'Percentage Park', bg: 'bg_world7', topic: 'Percentages' },
    { id: 8, name: 'Geometry Mountain', bg: 'bg_world8', topic: 'Geometry' },
    { id: 9, name: 'Measurement Meadows', bg: 'bg_world9', topic: 'Measurement' },
    { id: 10, name: 'Data Castle', bg: 'bg_world10', topic: 'Data Handling' },
  ];

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { worldId: number }) {
    this.gameState.worldId = data.worldId || 1;
    this.gameState.starsCollected = 0;
    this.gameState.totalStars = 5;
    this.gameState.questionsSolved = new Array(5).fill(false);
    this.isPanelOpen = false;
    this.currentNodeIndex = -1;
    this.nodes = [];
    this.stars = [];
    this.obstacles = [];
  }

  preload() {
    const world = this.worlds[this.gameState.worldId - 1];
    
    // Load assets
    this.load.image('player', '/assets/player.png');
    this.load.image('star', '/assets/star.png');
    this.load.image('tree', '/assets/tree.png');
    this.load.image('bg', `/assets/${world.bg}.jpg`);
  }

  create() {
    const { width, height } = this.scale;
    const world = this.worlds[this.gameState.worldId - 1];

    // Create tiled background
    this.background = this.add.tileSprite(width / 2, height / 2, width, height, 'bg');
    this.background.setScrollFactor(0);

    // Create world boundaries (virtual larger world)
    const worldWidth = Math.max(width, 1200);
    const worldHeight = Math.max(height, 800);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // Place obstacles (trees)
    this.placeObstacles(worldWidth, worldHeight);

    // Generate questions
    const questions = QuestionGenerator.getQuestionsForWorld(this.gameState.worldId, 5);

    // Place question nodes
    this.placeNodes(questions, worldWidth, worldHeight);

    // Create player
    this.player = this.add.sprite(worldWidth / 2, worldHeight / 2, 'player');
    this.player.setScale(0.15);
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(40, 40);

    // Camera follows player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setZoom(1.2);

    // Setup keyboard input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Score HUD (fixed to camera)
    const hudBg = this.add.rectangle(width - 100, 40, 180, 50, 0x000000, 0.6);
    hudBg.setScrollFactor(0);
    hudBg.setOrigin(0.5);

    this.scoreText = this.add.text(width - 100, 40, 'Stars: 0 / 5', {
      fontSize: '22px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setOrigin(0.5);

    // World name
    this.worldNameText = this.add.text(20, 20, `${world.name} - ${world.topic}`, {
      fontSize: '18px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
      backgroundColor: '#3F51B5',
      padding: { x: 12, y: 6 },
    });
    this.worldNameText.setScrollFactor(0);
    this.worldNameText.setOrigin(0, 0);

    // Back button
    const backBtn = this.add.rectangle(60, height - 40, 100, 40, 0xF44336, 0.8);
    backBtn.setScrollFactor(0);
    backBtn.setInteractive({ useHandCursor: true });
    const backText = this.add.text(60, height - 40, 'Back', {
      fontSize: '18px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    backText.setScrollFactor(0);
    backText.setOrigin(0.5);
    backBtn.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });

    // Create question panel (hidden initially)
    this.createQuestionPanel();

    // Particle emitter for correct answers
    const particleSprite = this.add.particles(0, 0, 'star', {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      lifespan: 800,
      quantity: 15,
      emitting: false,
    });
    this.particles = particleSprite;

    // Collisions
    this.physics.add.collider(this.player, this.obstacles);

    // Node interaction overlap
    this.physics.add.overlap(this.player, this.nodes.map(n => n.sprite), (_player, nodeSprite) => {
      if (!this.isPanelOpen) {
        const node = this.nodes.find(n => n.sprite === nodeSprite);
        if (node && !node.solved) {
          this.openQuestionPanel(node);
        }
      }
    });

    // Instructions
    const instructBg = this.add.rectangle(width / 2, height - 20, 500, 30, 0x000000, 0.4);
    instructBg.setScrollFactor(0);
    const instructText = this.add.text(width / 2, height - 20, 'Use WASD or Arrow keys to move. Walk to question marks to solve!', {
      fontSize: '14px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
    });
    instructText.setScrollFactor(0);
    instructText.setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(500);
  }

  private placeObstacles(worldWidth: number, worldHeight: number) {
    const obstaclePositions = [
      { x: 200, y: 200 }, { x: 400, y: 150 }, { x: 700, y: 300 },
      { x: 900, y: 200 }, { x: 300, y: 500 }, { x: 600, y: 450 },
      { x: 800, y: 600 }, { x: 150, y: 650 }, { x: 500, y: 700 },
      { x: 1000, y: 500 }, { x: 1100, y: 350 }, { x: 350, y: 350 },
    ];

    obstaclePositions.forEach(pos => {
      if (pos.x < worldWidth && pos.y < worldHeight) {
        const tree = this.add.sprite(pos.x, pos.y, 'tree');
        tree.setScale(0.2);
        this.physics.add.existing(tree, true);
        (tree.body as Phaser.Physics.Arcade.Body).setSize(40, 40);
        (tree.body as Phaser.Physics.Arcade.Body).setOffset(20, 20);
        this.obstacles.push(tree);
      }
    });
  }

  private placeNodes(questions: MathQuestion[], worldWidth: number, worldHeight: number) {
    const positions = [
      { x: worldWidth * 0.2, y: worldHeight * 0.3 },
      { x: worldWidth * 0.8, y: worldHeight * 0.25 },
      { x: worldWidth * 0.5, y: worldHeight * 0.5 },
      { x: worldWidth * 0.25, y: worldHeight * 0.75 },
      { x: worldWidth * 0.75, y: worldHeight * 0.7 },
    ];

    questions.forEach((q, i) => {
      const pos = positions[i];
      const container = this.add.container(pos.x, pos.y);

      // Question circle
      const circle = this.add.circle(0, 0, 30, 0xFF9800);
      circle.setStrokeStyle(4, 0xE65100);
      
      // Question mark text
      const qText = this.add.text(0, -2, '?', {
        fontSize: '36px',
        fontFamily: 'Nunito, sans-serif',
        color: '#FFFFFF',
        fontStyle: 'bold',
      });
      qText.setOrigin(0.5);

      container.add([circle, qText]);
      
      this.physics.add.existing(container);
      (container.body as Phaser.Physics.Arcade.Body).setSize(60, 60);

      // Bobbing animation
      this.tweens.add({
        targets: container,
        y: pos.y - 8,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Glow effect
      this.tweens.add({
        targets: circle,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.nodes.push({
        sprite: container,
        solved: false,
        question: q,
        id: i,
      });
    });
  }

  private createQuestionPanel() {
    const { width, height } = this.scale;
    
    this.questionPanel = this.add.container(width / 2, height + 300);
    this.questionPanel.setScrollFactor(0);
    this.questionPanel.setDepth(100);

    // Dark overlay
    const overlay = this.add.rectangle(0, -height / 2, width, height, 0x000000, 0.5);
    overlay.setInteractive();
    overlay.on('pointerdown', () => {}); // Block clicks
    this.questionPanel.add(overlay);

    // Panel background
    const panelBg = this.add.rectangle(0, 0, width * 0.85, height * 0.45, 0xFFFFFF);
    panelBg.setStrokeStyle(6, 0x3F51B5);
    this.questionPanel.add(panelBg);

    // Question text
    const questionText = this.add.text(0, -height * 0.12, '', {
      fontSize: '24px',
      fontFamily: 'Nunito, sans-serif',
      color: '#212121',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: width * 0.75 },
    });
    questionText.setOrigin(0.5);
    questionText.setName('questionText');
    this.questionPanel.add(questionText);

    // Explanation text (hidden initially)
    const explanationText = this.add.text(0, -height * 0.05, '', {
      fontSize: '16px',
      fontFamily: 'Nunito, sans-serif',
      color: '#4CAF50',
      align: 'center',
      wordWrap: { width: width * 0.75 },
    });
    explanationText.setOrigin(0.5);
    explanationText.setName('explanationText');
    explanationText.setVisible(false);
    this.questionPanel.add(explanationText);

    // Answer buttons (A, B, C, D)
    const buttonYPositions = [height * 0.02, height * 0.1];
    const buttonXOffsets = [-width * 0.2, width * 0.2];
    
    ['A', 'B', 'C', 'D'].forEach((label, i) => {
      const x = buttonXOffsets[i % 2];
      const y = buttonYPositions[Math.floor(i / 2)];
      
      const btnBg = this.add.rectangle(x, y, width * 0.35, 50, 0xE8EAF6);
      btnBg.setStrokeStyle(3, 0x3F51B5);
      btnBg.setInteractive({ useHandCursor: true });
      btnBg.setName(`btnBg_${i}`);
      
      const btnText = this.add.text(x, y, `${label}. Option`, {
        fontSize: '18px',
        fontFamily: 'Nunito, sans-serif',
        color: '#3F51B5',
        fontStyle: 'bold',
      });
      btnText.setOrigin(0.5);
      btnText.setName(`btnText_${i}`);
      
      btnBg.on('pointerover', () => {
        if (!this.nodes[this.currentNodeIndex]?.solved) {
          btnBg.setFillStyle(0xC5CAE9);
        }
      });
      btnBg.on('pointerout', () => {
        if (!this.nodes[this.currentNodeIndex]?.solved) {
          btnBg.setFillStyle(0xE8EAF6);
        }
      });
      btnBg.on('pointerdown', () => {
        this.checkAnswer(i);
      });
      
      this.questionPanel.add([btnBg, btnText]);
    });

    // Close button
    const closeBtn = this.add.text(width * 0.38, -height * 0.18, 'X', {
      fontSize: '24px',
      fontFamily: 'Nunito, sans-serif',
      color: '#F44336',
      fontStyle: 'bold',
    });
    closeBtn.setOrigin(0.5);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      this.closeQuestionPanel();
    });
    this.questionPanel.add(closeBtn);
  }

  private openQuestionPanel(node: typeof this.nodes[0]) {
    this.isPanelOpen = true;
    this.currentNodeIndex = this.nodes.indexOf(node);
    
    const { height } = this.scale;
    const questionText = this.questionPanel.getByName('questionText') as Phaser.GameObjects.Text;
    const explanationText = this.questionPanel.getByName('explanationText') as Phaser.GameObjects.Text;
    
    questionText.setText(node.question.question);
    explanationText.setVisible(false);

    // Update button texts
    node.question.options.forEach((opt, i) => {
      const btnText = this.questionPanel.getByName(`btnText_${i}`) as Phaser.GameObjects.Text;
      const btnBg = this.questionPanel.getByName(`btnBg_${i}`) as Phaser.GameObjects.Rectangle;
      btnText.setText(`${String.fromCharCode(65 + i)}. ${opt}`);
      btnBg.setFillStyle(0xE8EAF6);
      btnBg.setStrokeStyle(3, 0x3F51B5);
    });

    // Animate panel in
    this.tweens.add({
      targets: this.questionPanel,
      y: height * 0.65,
      duration: 400,
      ease: 'Back.easeOut',
    });
  }

  private closeQuestionPanel() {
    const { height } = this.scale;
    this.isPanelOpen = false;
    this.currentNodeIndex = -1;
    
    this.tweens.add({
      targets: this.questionPanel,
      y: height + 300,
      duration: 300,
      ease: 'Power2',
    });
  }

  private checkAnswer(selectedIndex: number) {
    if (this.currentNodeIndex < 0) return;
    
    const node = this.nodes[this.currentNodeIndex];
    if (node.solved) return;

    const isCorrect = selectedIndex === node.question.correctIndex;
    const btnBg = this.questionPanel.getByName(`btnBg_${selectedIndex}`) as Phaser.GameObjects.Rectangle;
    const explanationText = this.questionPanel.getByName('explanationText') as Phaser.GameObjects.Text;

    if (isCorrect) {
      // Correct answer!
      btnBg.setFillStyle(0x4CAF50);
      btnBg.setStrokeStyle(3, 0x2E7D32);
      
      node.solved = true;
      this.gameState.questionsSolved[this.currentNodeIndex] = true;
      this.gameState.starsCollected++;
      
      // Update score
      this.scoreText.setText(`Stars: ${this.gameState.starsCollected} / ${this.gameState.totalStars}`);
      
      // Show explanation
      explanationText.setText(node.question.explanation);
      explanationText.setVisible(true);

      // Transform node to star
      this.transformNodeToStar(node);

      // Particle burst
      const nodePos = node.sprite.getBounds();
      this.particles.emitParticleAt(nodePos.centerX, nodePos.centerY, 20);

      // Check level completion
      if (this.gameState.starsCollected >= this.gameState.totalStars) {
        this.time.delayedCall(1500, () => {
          this.levelComplete();
        });
      } else {
        // Auto close after delay
        this.time.delayedCall(2000, () => {
          this.closeQuestionPanel();
        });
      }
    } else {
      // Wrong answer
      btnBg.setFillStyle(0xF44336);
      btnBg.setStrokeStyle(3, 0xC62828);
      
      // Shake animation
      this.tweens.add({
        targets: this.questionPanel,
        x: this.scale.width / 2 + 10,
        duration: 50,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          this.questionPanel.setX(this.scale.width / 2);
        },
      });

      // Reset button after delay
      this.time.delayedCall(800, () => {
        btnBg.setFillStyle(0xE8EAF6);
        btnBg.setStrokeStyle(3, 0x3F51B5);
      });
    }
  }

  private transformNodeToStar(node: typeof this.nodes[0]) {
    const pos = node.sprite;
    
    // Create star at node position
    const star = this.add.sprite(pos.x, pos.y, 'star');
    star.setScale(0);
    this.physics.add.existing(star);
    
    // Remove question node
    node.sprite.setVisible(false);
    (node.sprite.body as Phaser.Physics.Arcade.Body).destroy();
    
    // Animate star appearance
    this.tweens.add({
      targets: star,
      scale: 0.15,
      duration: 500,
      ease: 'Back.easeOut',
    });
    
    // Continuous rotation
    this.tweens.add({
      targets: star,
      angle: 360,
      duration: 3000,
      repeat: -1,
    });
    
    this.stars.push(star);
  }

  private levelComplete() {
    const { width, height } = this.scale;
    
    // Save progress
    const saved = localStorage.getItem('mathQuestProgress');
    const progress = saved ? JSON.parse(saved) : { unlockedWorlds: [1], completedWorlds: [] };
    if (!progress.completedWorlds.includes(this.gameState.worldId)) {
      progress.completedWorlds.push(this.gameState.worldId);
    }
    if (!progress.unlockedWorlds.includes(this.gameState.worldId + 1) && this.gameState.worldId < 10) {
      progress.unlockedWorlds.push(this.gameState.worldId + 1);
    }
    localStorage.setItem('mathQuestProgress', JSON.stringify(progress));

    // Show completion overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setScrollFactor(0);
    overlay.setDepth(200);

    const congratsText = this.add.text(width / 2, height * 0.35, 'WORLD COMPLETE!', {
      fontSize: '42px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFC107',
      fontStyle: 'bold',
    });
    congratsText.setOrigin(0.5);
    congratsText.setScrollFactor(0);
    congratsText.setDepth(201);

    const worldText = this.add.text(width / 2, height * 0.45, this.worlds[this.gameState.worldId - 1].name, {
      fontSize: '28px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
    });
    worldText.setOrigin(0.5);
    worldText.setScrollFactor(0);
    worldText.setDepth(201);

    const starsText = this.add.text(width / 2, height * 0.55, `${this.gameState.starsCollected} / ${this.gameState.totalStars} Stars Collected`, {
      fontSize: '24px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFC107',
    });
    starsText.setOrigin(0.5);
    starsText.setScrollFactor(0);
    starsText.setDepth(201);

    // Next level button
    const nextBtn = this.add.rectangle(width / 2, height * 0.7, 200, 50, 0x4CAF50);
    nextBtn.setScrollFactor(0);
    nextBtn.setInteractive({ useHandCursor: true });
    nextBtn.setDepth(201);
    const nextText = this.add.text(width / 2, height * 0.7, this.gameState.worldId < 10 ? 'Next World' : 'All Complete!', {
      fontSize: '20px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    nextText.setOrigin(0.5);
    nextText.setScrollFactor(0);
    nextText.setDepth(202);

    nextBtn.on('pointerdown', () => {
      if (this.gameState.worldId < 10) {
        this.scene.start('GameScene', { worldId: this.gameState.worldId + 1 });
      } else {
        this.scene.start('LevelSelectScene');
      }
    });

    // Menu button
    const menuBtn = this.add.rectangle(width / 2, height * 0.8, 200, 50, 0xFF9800);
    menuBtn.setScrollFactor(0);
    menuBtn.setInteractive({ useHandCursor: true });
    menuBtn.setDepth(201);
    const menuText = this.add.text(width / 2, height * 0.8, 'World Select', {
      fontSize: '20px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    menuText.setOrigin(0.5);
    menuText.setScrollFactor(0);
    menuText.setDepth(202);

    menuBtn.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });
  }

  update() {
    if (this.isPanelOpen) {
      // Stop player movement when panel is open
      (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0);
      return;
    }

    const speed = 200;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    
    body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      body.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      body.setVelocityX(speed);
      this.player.setFlipX(false);
    }

    // Vertical movement
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      body.setVelocityY(speed);
    }

    // Normalize diagonal movement
    body.velocity.normalize().scale(speed);
  }
}
