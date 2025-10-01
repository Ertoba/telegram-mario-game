/**
 * BossScene - Boss fight in Round 5
 */
class BossScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossScene' });
    }

    init() {
        this.audioManager = this.registry.get('audioManager');
        this.bossData = GameConfig.bossLevel;
        this.dragonConfig = GameConfig.dragon;
    }

    create() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');

        // Set background
        this.cameras.main.setBackgroundColor(this.bossData.backgroundColor);

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.createPlatforms(gameWidth, gameHeight);

        // Create player
        const startX = gameWidth * 0.15;
        const startY = gameHeight * 0.8;
        this.player = new Player(this, startX, startY);

        // Create dragon boss
        const dragonX = gameWidth * this.dragonConfig.position.x;
        const dragonY = gameHeight * this.dragonConfig.position.y;
        this.dragon = new Dragon(this, dragonX, dragonY);

        // Touch controls
        this.touchControls = new TouchControls(this, this.player);

        // Setup collisions
        this.setupCollisions();

        // Boss HP bar
        this.createBossHPBar(gameWidth);

        // Setup world bounds
        this.physics.world.setBounds(0, 0, gameWidth, gameHeight);

        // Update UI
        this.game.events.emit('updateUI');

        // Show boss intro
        this.showBossIntro();
    }

    createPlatforms(gameWidth, gameHeight) {
        this.bossData.platforms.forEach(platformData => {
            const x = platformData.x * gameWidth;
            const y = platformData.y * gameHeight;
            const width = platformData.width * gameWidth;
            const height = platformData.height * gameHeight;

            const key = `platform_${Math.round(width)}_${Math.round(height)}`;
            if (!this.textures.exists(key)) {
                const graphics = this.add.graphics();
                graphics.fillStyle(platformData.fixed ? 0x654321 : 0x8B4513);
                graphics.fillRect(0, 0, width, height);
                graphics.generateTexture(key, width, height);
                graphics.destroy();
            }

            const platform = this.platforms.create(x + width / 2, y + height / 2, key);
            platform.setDisplaySize(width, height);
            platform.body.updateFromGameObject();
            platform.refreshBody();
        });
    }

    createBossHPBar(gameWidth) {
        const barWidth = gameWidth * 0.6;
        const barHeight = 30;
        const x = gameWidth / 2 - barWidth / 2;
        const y = 60;

        // Background
        this.hpBarBg = this.add.rectangle(x, y, barWidth, barHeight, 0x000000, 0.5);
        this.hpBarBg.setOrigin(0);
        this.hpBarBg.setScrollFactor(0);
        this.hpBarBg.setDepth(2000);

        // HP bar
        this.hpBar = this.add.rectangle(x + 2, y + 2, barWidth - 4, barHeight - 4, 0xFF0000);
        this.hpBar.setOrigin(0);
        this.hpBar.setScrollFactor(0);
        this.hpBar.setDepth(2001);

        // Boss name
        this.bossNameText = this.add.text(gameWidth / 2, y - 20, '🐉 DRAGON BOSS', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#FF0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.bossNameText.setOrigin(0.5);
        this.bossNameText.setScrollFactor(0);
        this.bossNameText.setDepth(2001);

        this.maxHPBarWidth = barWidth - 4;
    }

    updateBossHP() {
        const hpPercent = this.dragon.getHPPercent();
        this.hpBar.width = this.maxHPBarWidth * hpPercent;

        // Change color based on HP
        if (hpPercent > 0.66) {
            this.hpBar.setFillStyle(0xFF0000);
        } else if (hpPercent > 0.33) {
            this.hpBar.setFillStyle(0xFF6600);
        } else {
            this.hpBar.setFillStyle(0xFFFF00);
        }
    }

    setupCollisions() {
        // Player-platform collisions
        this.physics.add.collider(this.player.sprite, this.platforms);

        // Player-dragon body collision
        this.physics.add.overlap(this.player.sprite, this.dragon.sprite, () => {
            this.playerHitByBoss();
        }, null, this);

        // Player-weak point collision
        this.physics.add.overlap(this.player.sprite, this.dragon.weakPoint, () => {
            if (this.dragon.hitWeakPoint()) {
                this.updateBossHP();
            }
        }, () => {
            return this.dragon.weakPointVisible;
        }, this);

        // Player-fireball collisions
        this.physics.add.overlap(this.player.sprite, this.dragon.fireballs, (playerSprite, fireball) => {
            fireball.destroy();
            this.playerHitByBoss();
        }, null, this);
    }

    playerHitByBoss() {
        if (this.player.takeDamage()) {
            if (!gameState.loseLife()) {
                this.gameOver();
            } else {
                this.game.events.emit('updateUI');
                this.respawnPlayer();
            }
        }
    }

    respawnPlayer() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');
        this.player.reset(gameWidth * 0.15, gameHeight * 0.8);
    }

    showBossIntro() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');

        const overlay = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.9);
        overlay.setOrigin(0);
        overlay.setDepth(5000);

        const text = this.add.text(gameWidth / 2, gameHeight / 2, 'BOSS ROUND\n\nDefeat the Dragon!', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#FF0000',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        });
        text.setOrigin(0.5);
        text.setDepth(5001);

        const hint = this.add.text(gameWidth / 2, gameHeight * 0.7,
            'Jump on the glowing weak point to damage the boss!\nAvoid fireballs and attacks!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        });
        hint.setOrigin(0.5);
        hint.setDepth(5001);

        // Fade out after 3 seconds
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: [overlay, text, hint],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    overlay.destroy();
                    text.destroy();
                    hint.destroy();
                }
            });
        });
    }

    update(time, delta) {
        if (this.isGameOver || this.isBossDefeated) return;

        // Check if player fell off
        const gameHeight = this.game.registry.get('gameHeight');
        if (this.player.sprite.y > gameHeight + 100) {
            if (!gameState.loseLife()) {
                this.gameOver();
            } else {
                this.game.events.emit('updateUI');
                this.respawnPlayer();
            }
            return;
        }

        // Update player
        this.player.update(delta);

        // Update dragon
        this.dragon.update(time, delta);

        // Check flame trap collisions
        this.dragon.flameTraps.forEach(trap => {
            if (trap.active && this.physics.overlap(this.player.sprite, trap.sprite)) {
                this.playerHitByBoss();
            }
        });

        // Update weak point collision if it exists
        if (this.dragon.weakPoint) {
            this.physics.world.overlap(this.player.sprite, this.dragon.weakPoint, () => {
                if (this.dragon.hitWeakPoint()) {
                    this.updateBossHP();
                }
            });
        }
    }

    bossDefeated() {
        if (this.isBossDefeated) return;
        this.isBossDefeated = true;

        // Award bonus
        gameState.addScore(this.dragonConfig.defeatBonus.score);
        this.game.events.emit('updateUI');

        if (this.audioManager) {
            this.audioManager.playVictory();
        }

        // Save high score
        const highScore = parseInt(localStorage.getItem('highScore') || '0');
        if (gameState.score > highScore) {
            localStorage.setItem('highScore', gameState.score.toString());
        }

        // Send data to Telegram
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify({
                score: gameState.score,
                coins: gameState.coins,
                completed: true
            }));
        }

        // Show victory screen
        this.time.delayedCall(2000, () => {
            this.showVictoryScreen();
        });
    }

    showVictoryScreen() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');

        const overlay = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.9);
        overlay.setOrigin(0);
        overlay.setScrollFactor(0);
        overlay.setDepth(6000);

        const victoryText = this.add.text(gameWidth / 2, gameHeight * 0.25, '🎉 VICTORY! 🎉', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        victoryText.setOrigin(0.5);
        victoryText.setScrollFactor(0);
        victoryText.setDepth(6001);

        const stats = this.add.text(gameWidth / 2, gameHeight * 0.45,
            `You defeated the Dragon!\n\nFinal Score: ${gameState.score}\nTotal Coins: ${gameState.coins}`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 15
        });
        stats.setOrigin(0.5);
        stats.setScrollFactor(0);
        stats.setDepth(6001);

        const menuButton = this.add.text(gameWidth / 2, gameHeight * 0.75, 'MAIN MENU', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 30, y: 15 },
            fontStyle: 'bold'
        });
        menuButton.setOrigin(0.5);
        menuButton.setInteractive({ useHandCursor: true });
        menuButton.setScrollFactor(0);
        menuButton.setDepth(6001);

        menuButton.on('pointerdown', () => {
            this.scene.stop('UIScene');
            this.scene.start('MenuScene');
        });

        // Animate
        this.tweens.add({
            targets: victoryText,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        if (this.audioManager) {
            this.audioManager.playGameOver();
        }

        const highScore = parseInt(localStorage.getItem('highScore') || '0');
        if (gameState.score > highScore) {
            localStorage.setItem('highScore', gameState.score.toString());
        }

        this.showGameOverScreen();
    }

    showGameOverScreen() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');

        const overlay = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.8);
        overlay.setOrigin(0);
        overlay.setScrollFactor(0);
        overlay.setDepth(6000);

        const gameOverText = this.add.text(gameWidth / 2, gameHeight * 0.3, 'GAME OVER', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#FF0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setScrollFactor(0);
        gameOverText.setDepth(6001);

        const stats = this.add.text(gameWidth / 2, gameHeight * 0.5,
            `The Dragon was too strong...\n\nFinal Score: ${gameState.score}\nBoss HP Remaining: ${Math.ceil(this.dragon.getHPPercent() * 100)}%`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        });
        stats.setOrigin(0.5);
        stats.setScrollFactor(0);
        stats.setDepth(6001);

        const retryButton = this.add.text(gameWidth / 2, gameHeight * 0.7, 'RETRY BOSS', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#FF6600',
            padding: { x: 30, y: 15 },
            fontStyle: 'bold'
        });
        retryButton.setOrigin(0.5);
        retryButton.setInteractive({ useHandCursor: true });
        retryButton.setScrollFactor(0);
        retryButton.setDepth(6001);

        retryButton.on('pointerdown', () => {
            // Restore lives for retry
            gameState.lives = GameConfig.player.startLives;
            this.scene.restart();
        });

        const menuButton = this.add.text(gameWidth / 2, gameHeight * 0.85, 'MAIN MENU', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 25, y: 12 },
            fontStyle: 'bold'
        });
        menuButton.setOrigin(0.5);
        menuButton.setInteractive({ useHandCursor: true });
        menuButton.setScrollFactor(0);
        menuButton.setDepth(6001);

        menuButton.on('pointerdown', () => {
            this.scene.stop('UIScene');
            this.scene.start('MenuScene');
        });
    }
}
