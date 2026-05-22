import * as Phaser from 'phaser';

interface WorldProgress {
  unlockedWorlds: number[];
  completedWorlds: number[];
}

export class LevelSelectScene extends Phaser.Scene {
  private worlds = [
    { id: 1, name: 'Number Kingdom', topic: 'Place Value', color: 0x4CAF50 },
    { id: 2, name: 'Multiplication Forest', topic: 'Multiplication', color: 0x2E7D32 },
    { id: 3, name: 'Division Desert', topic: 'Division', color: 0xFF9800 },
    { id: 4, name: 'Factor Farm', topic: 'Factors & Multiples', color: 0x8BC34A },
    { id: 5, name: 'Lake Fraction', topic: 'Fractions', color: 0x03A9F4 },
    { id: 6, name: 'Decimal City', topic: 'Decimals', color: 0x9C27B0 },
    { id: 7, name: 'Percentage Park', topic: 'Percentages', color: 0xE91E63 },
    { id: 8, name: 'Geometry Mountain', topic: 'Geometry', color: 0x795548 },
    { id: 9, name: 'Measurement Meadows', topic: 'Measurement', color: 0x607D8B },
    { id: 10, name: 'Data Castle', topic: 'Data Handling', color: 0x3F51B5 },
  ];

  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Dark blue background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x0d1b2a, 0x0d1b2a, 0x1b3a4b, 0x1b3a4b, 1);
    graphics.fillRect(0, 0, width, height);

    // Floating particles
    for (let i = 0; i < 20; i++) {
      const circle = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(2, 5),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.1, 0.4)
      );
      
      this.tweens.add({
        targets: circle,
        y: circle.y - 50,
        alpha: 0.1,
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Title
    const titleText = this.add.text(width / 2, 50, 'SELECT WORLD', {
      fontSize: '42px',
      fontFamily: 'Fredoka One, Nunito, sans-serif',
      color: '#FFC107',
      fontStyle: 'bold',
      stroke: '#0d1b2a',
      strokeThickness: 6,
    });
    titleText.setOrigin(0.5);

    // Subtitle
    const subtitleText = this.add.text(width / 2, 90, 'Choose a math topic to explore!', {
      fontSize: '18px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
    });
    subtitleText.setOrigin(0.5);

    // Get progress
    const saved = localStorage.getItem('mathQuestProgress');
    const progress: WorldProgress = saved ? JSON.parse(saved) : { unlockedWorlds: [1], completedWorlds: [] };

    // Create world buttons in a grid
    const cols = 5;
    const startX = width / 2 - (cols - 1) * 90;
    const startY = 160;
    const spacingX = 180;
    const spacingY = 160;

    this.worlds.forEach((world, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;

      const isUnlocked = progress.unlockedWorlds.includes(world.id);
      const isCompleted = progress.completedWorlds.includes(world.id);

      // Node circle
      const circle = this.add.circle(x, y, 55, isUnlocked ? world.color : 0x546E7A);
      circle.setStrokeStyle(4, isUnlocked ? 0xFFFFFF : 0x78909C);
      circle.setInteractive(isUnlocked ? { useHandCursor: true } : undefined);

      // World number
      const numText = this.add.text(x, y - 10, world.id.toString(), {
        fontSize: '32px',
        fontFamily: 'Nunito, sans-serif',
        color: isUnlocked ? '#FFFFFF' : '#90A4AE',
        fontStyle: 'bold',
      });
      numText.setOrigin(0.5);

      // World name (below circle)
      const nameText = this.add.text(x, y + 65, world.name, {
        fontSize: '12px',
        fontFamily: 'Nunito, sans-serif',
        color: isUnlocked ? '#FFFFFF' : '#78909C',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: 140 },
      });
      nameText.setOrigin(0.5, 0);

      // Topic text
      const topicText = this.add.text(x, y + 82, world.topic, {
        fontSize: '10px',
        fontFamily: 'Nunito, sans-serif',
        color: isUnlocked ? '#B0BEC5' : '#546E7A',
        align: 'center',
        wordWrap: { width: 140 },
      });
      topicText.setOrigin(0.5, 0);

      // Lock icon for locked worlds
      if (!isUnlocked) {
        const lockText = this.add.text(x, y + 15, '🔒', {
          fontSize: '20px',
        });
        lockText.setOrigin(0.5);
      }

      // Star for completed worlds
      if (isCompleted) {
        const starText = this.add.text(x + 35, y - 35, '★', {
          fontSize: '24px',
          color: '#FFC107',
        });
        starText.setOrigin(0.5);
      }

      // Hover and click effects
      if (isUnlocked) {
        circle.on('pointerover', () => {
          this.tweens.add({
            targets: circle,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
          });
          circle.setStrokeStyle(6, 0xFFFFFF);
        });

        circle.on('pointerout', () => {
          this.tweens.add({
            targets: circle,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
          });
          circle.setStrokeStyle(4, 0xFFFFFF);
        });

        circle.on('pointerdown', () => {
          this.cameras.main.fadeOut(400);
          this.time.delayedCall(400, () => {
            this.scene.start('GameScene', { worldId: world.id });
          });
        });

        // Idle animation for unlocked nodes
        this.tweens.add({
          targets: circle,
          scaleX: 1.03,
          scaleY: 1.03,
          duration: 1500 + index * 100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    });

    // Progress summary
    const totalCompleted = progress.completedWorlds.length;
    this.add.text(20, height - 30, `Progress: ${totalCompleted}/10 Worlds Completed`, {
      fontSize: '16px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
    });

    // Reset progress button
    const resetBtn = this.add.rectangle(width - 100, height - 25, 160, 35, 0xF44336, 0.6);
    resetBtn.setInteractive({ useHandCursor: true });
    const resetText = this.add.text(width - 100, height - 25, 'Reset Progress', {
      fontSize: '14px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
    });
    resetText.setOrigin(0.5);

    resetBtn.on('pointerover', () => {
      resetBtn.setFillStyle(0xF44336, 0.8);
    });
    resetBtn.on('pointerout', () => {
      resetBtn.setFillStyle(0xF44336, 0.6);
    });
    resetBtn.on('pointerdown', () => {
      if (confirm('Are you sure you want to reset all progress?')) {
        localStorage.removeItem('mathQuestProgress');
        this.scene.restart();
      }
    });

    // Back button
    const backBtn = this.add.rectangle(70, 30, 100, 35, 0xFF9800);
    backBtn.setInteractive({ useHandCursor: true });
    const backText = this.add.text(70, 30, 'Back', {
      fontSize: '16px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    backText.setOrigin(0.5);

    backBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400);
      this.time.delayedCall(400, () => {
        this.scene.start('MenuScene');
      });
    });

    // Fade in
    this.cameras.main.fadeIn(500);
  }
}
