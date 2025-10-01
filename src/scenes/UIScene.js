/**
 * UIScene - Persistent HUD overlay
 */
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        const gameWidth = this.game.registry.get('gameWidth');
        const padding = GameConfig.ui.hudPadding;
        const fontSize = GameConfig.ui.fontSize;

        // Score display
        this.scoreText = this.add.text(padding, padding, 'Score: 0', {
            fontSize: `${fontSize}px`,
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(2000);

        // Coins display
        this.coinsText = this.add.text(padding, padding + fontSize + 10, 'Coins: 0', {
            fontSize: `${fontSize}px`,
            fontFamily: 'Arial',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.coinsText.setScrollFactor(0);
        this.coinsText.setDepth(2000);

        // Lives display
        this.livesText = this.add.text(gameWidth - padding, padding, 'Lives: 3', {
            fontSize: `${fontSize}px`,
            fontFamily: 'Arial',
            color: '#FF0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.livesText.setOrigin(1, 0);
        this.livesText.setScrollFactor(0);
        this.livesText.setDepth(2000);

        // Round display
        this.roundText = this.add.text(gameWidth - padding, padding + fontSize + 10, 'Round: 1', {
            fontSize: `${fontSize}px`,
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.roundText.setOrigin(1, 0);
        this.roundText.setScrollFactor(0);
        this.roundText.setDepth(2000);

        // Update display
        this.updateDisplay();

        // Listen for events to update display
        this.events = this.game.events;
        this.events.on('updateUI', this.updateDisplay, this);
    }

    updateDisplay() {
        const data = gameState.getData();
        this.scoreText.setText(`Score: ${data.score}`);
        this.coinsText.setText(`Coins: ${data.coins}`);
        this.livesText.setText(`Lives: ${data.lives}`);
        this.roundText.setText(`Round: ${data.round}`);
    }
}
