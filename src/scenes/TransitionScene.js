/**
 * TransitionScene - Shows transition between rounds
 */
class TransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TransitionScene' });
    }

    init(data) {
        this.roundCompleted = data.round;
        this.coinsCollected = data.coinsCollected;
        this.totalCoins = data.totalCoins;
        this.score = data.score;
        this.nextRound = data.nextRound;
    }

    create() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');

        // Semi-transparent background
        const overlay = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.8);
        overlay.setOrigin(0);

        // Round complete text
        const title = this.add.text(gameWidth / 2, gameHeight * 0.25, `ROUND ${this.roundCompleted}\nCOMPLETE!`, {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#FFD700',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // Stats
        const allCoins = this.coinsCollected === this.totalCoins;
        const statsText = [
            `Coins: ${this.coinsCollected}/${this.totalCoins}${allCoins ? ' ✓' : ''}`,
            `Score: ${this.score}`,
            ''
        ];

        if (gameState.deathsThisRound === 0) {
            statsText.push('🌟 No Deaths Bonus!');
        }
        if (allCoins) {
            statsText.push('🌟 All Coins Bonus!');
        }

        const stats = this.add.text(gameWidth / 2, gameHeight * 0.45, statsText.join('\n'), {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        });
        stats.setOrigin(0.5);

        // Continue button or boss warning
        let buttonText = 'CONTINUE';
        let buttonColor = '#4CAF50';

        if (this.nextRound === 5) {
            buttonText = 'BOSS ROUND!';
            buttonColor = '#FF0000';

            const warning = this.add.text(gameWidth / 2, gameHeight * 0.65,
                'Prepare to face the Dragon!', {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#FF6B6B',
                fontStyle: 'italic'
            });
            warning.setOrigin(0.5);
        }

        const continueButton = this.add.text(gameWidth / 2, gameHeight * 0.75, buttonText, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: buttonColor,
            padding: { x: 30, y: 15 },
            fontStyle: 'bold'
        });
        continueButton.setOrigin(0.5);
        continueButton.setInteractive({ useHandCursor: true });

        continueButton.on('pointerover', () => {
            continueButton.setScale(1.1);
        });

        continueButton.on('pointerout', () => {
            continueButton.setScale(1);
        });

        continueButton.on('pointerdown', () => {
            if (this.nextRound === 5) {
                // Boss round
                this.scene.stop('TransitionScene');
                this.scene.start('BossScene');
            } else {
                // Next regular round
                this.scene.stop('TransitionScene');
                this.scene.start('GameScene', { levelIndex: this.nextRound - 1 });
            }
        });

        // Animate title
        this.tweens.add({
            targets: title,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }
}
