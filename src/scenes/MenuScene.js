/**
 * MenuScene - Main menu and game start
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');

        // Background
        this.cameras.main.setBackgroundColor(0x5c94fc);

        // Title
        const title = this.add.text(gameWidth / 2, gameHeight * 0.25, 'DRAGON\nBOSS', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(gameWidth / 2, gameHeight * 0.4, '5 Rounds of Platforming Action', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        });
        subtitle.setOrigin(0.5);

        // Start button
        const startButton = this.add.text(gameWidth / 2, gameHeight * 0.6, 'START GAME', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 30, y: 15 },
            fontStyle: 'bold'
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });

        startButton.on('pointerover', () => {
            startButton.setScale(1.1);
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1);
        });

        startButton.on('pointerdown', () => {
            // Reset game state
            gameState.reset();

            // Start first round
            this.scene.start('GameScene', { levelIndex: 0 });
            this.scene.launch('UIScene');
        });

        // Instructions
        const instructions = this.add.text(gameWidth / 2, gameHeight * 0.8,
            'Use arrow keys or touch controls\nCollect coins • Defeat enemies\nBeat the Dragon Boss!', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8
        });
        instructions.setOrigin(0.5);

        // High score (if available)
        const highScore = localStorage.getItem('highScore') || 0;
        if (highScore > 0) {
            const highScoreText = this.add.text(gameWidth / 2, gameHeight * 0.95, `High Score: ${highScore}`, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#FFD700'
            });
            highScoreText.setOrigin(0.5);
        }

        // Animate title
        this.tweens.add({
            targets: title,
            y: title.y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }
}
