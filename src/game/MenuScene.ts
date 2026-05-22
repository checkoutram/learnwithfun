import * as Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Gradient background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a237e, 0x1a237e, 0x0d47a1, 0x0d47a1, 1);
    graphics.fillRect(0, 0, width, height);

    // Animated stars in background
    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.3, 0.8)
      );
      
      this.tweens.add({
        targets: star,
        alpha: { from: 0.3, to: 1 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Title
    const titleText = this.add.text(width / 2, height * 0.2, 'MATH QUEST', {
      fontSize: '64px',
      fontFamily: 'Fredoka One, Nunito, sans-serif',
      color: '#FFC107',
      fontStyle: 'bold',
      stroke: '#1a237e',
      strokeThickness: 8,
      shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 8, stroke: true, fill: true },
    });
    titleText.setOrigin(0.5);

    // Subtitle
    const subtitleText = this.add.text(width / 2, height * 0.3, 'Grade 5 Adventure', {
      fontSize: '28px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
    });
    subtitleText.setOrigin(0.5);

    // Floating math symbols
    const symbols = ['+', '-', '×', '÷', '=', '%', 'π', '√'];
    symbols.forEach((sym, i) => {
      const x = width * 0.15 + (i * width * 0.1);
      const y = height * 0.1 + Math.sin(i) * 50;
      const symbol = this.add.text(x, y, sym, {
        fontSize: '40px',
        fontFamily: 'Nunito, sans-serif',
        color: '#FF9800',
      });
      symbol.setOrigin(0.5);
      symbol.setAlpha(0.4);
      
      this.tweens.add({
        targets: symbol,
        y: y + 30,
        rotation: Math.PI / 8,
        duration: 2000 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // Player character
    const playerChar = this.add.image(width / 2, height * 0.5, 'player');
    playerChar.setScale(0.25);
    
    this.tweens.add({
      targets: playerChar,
      y: height * 0.5 - 15,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Start Button
    const startBtn = this.add.rectangle(width / 2, height * 0.7, 280, 60, 0x4CAF50);
    startBtn.setInteractive({ useHandCursor: true });
    const startText = this.add.text(width / 2, height * 0.7, 'START ADVENTURE', {
      fontSize: '24px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    startText.setOrigin(0.5);

    startBtn.on('pointerover', () => {
      startBtn.setFillStyle(0x66BB6A);
      this.tweens.add({
        targets: [startBtn, startText],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });
    });
    startBtn.on('pointerout', () => {
      startBtn.setFillStyle(0x4CAF50);
      this.tweens.add({
        targets: [startBtn, startText],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });
    startBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500);
      this.time.delayedCall(500, () => {
        this.scene.start('LevelSelectScene');
      });
    });

    // How to play button
    const helpBtn = this.add.rectangle(width / 2, height * 0.82, 200, 45, 0xFF9800);
    helpBtn.setInteractive({ useHandCursor: true });
    const helpText = this.add.text(width / 2, height * 0.82, 'How to Play', {
      fontSize: '18px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    helpText.setOrigin(0.5);

    helpBtn.on('pointerover', () => {
      helpBtn.setFillStyle(0xFFA726);
    });
    helpBtn.on('pointerout', () => {
      helpBtn.setFillStyle(0xFF9800);
    });
    helpBtn.on('pointerdown', () => {
      this.showHowToPlay();
    });

    // Version text
    const versionText = this.add.text(width - 10, height - 10, 'v1.0', {
      fontSize: '12px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
    });
    versionText.setAlpha(0.5);
    versionText.setOrigin(1, 1);

    // Fade in
    this.cameras.main.fadeIn(500);
  }

  private showHowToPlay() {
    const { width, height } = this.scale;
    
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    overlay.setInteractive();
    overlay.setDepth(300);

    const panel = this.add.rectangle(width / 2, height / 2, width * 0.7, height * 0.6, 0xFFFFFF);
    panel.setStrokeStyle(4, 0x3F51B5);
    panel.setDepth(301);

    const title = this.add.text(width / 2, height * 0.25, 'How to Play', {
      fontSize: '32px',
      fontFamily: 'Nunito, sans-serif',
      color: '#3F51B5',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);
    title.setDepth(302);

    const instructions = [
      'Use WASD or Arrow Keys to move your character',
      'Walk to the orange question mark nodes',
      'Solve the math problems to collect stars',
      'Collect all 5 stars to complete each world',
      'Wrong answers let you try again - no penalties!',
      'Complete worlds to unlock new math topics',
    ];

    instructions.forEach((text, i) => {
      const line = this.add.text(width / 2, height * 0.35 + i * 35, `${i + 1}. ${text}`, {
        fontSize: '16px',
        fontFamily: 'Nunito, sans-serif',
        color: '#212121',
      });
      line.setOrigin(0.5);
      line.setDepth(302);
    });

    const closeBtn = this.add.rectangle(width / 2, height * 0.7, 120, 40, 0xF44336);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.setDepth(302);
    const closeText = this.add.text(width / 2, height * 0.7, 'Close', {
      fontSize: '18px',
      fontFamily: 'Nunito, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    closeText.setOrigin(0.5);
    closeText.setDepth(303);

    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
      title.destroy();
      closeBtn.destroy();
      closeText.destroy();
      // Destroy instruction lines
      const toDestroy = this.children.list.filter(child => {
        const go = child as unknown as { depth: number };
        return go.depth === 302 && child !== title && child !== closeBtn && child !== closeText;
      });
      toDestroy.forEach(child => child.destroy());
    });
  }
}
