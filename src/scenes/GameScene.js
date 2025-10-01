/**
 * GameScene - Main gameplay scene for Rounds 1-4
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.levelIndex = data.levelIndex || 0;
        this.levelData = GameConfig.levels[this.levelIndex];
        this.audioManager = this.registry.get('audioManager');
    }

    create() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');

        // Set background color
        this.cameras.main.setBackgroundColor(this.levelData.backgroundColor);

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.createPlatforms(gameWidth, gameHeight);

        // Create moving platforms
        this.movingPlatforms = [];
        this.createMovingPlatforms(gameWidth, gameHeight);

        // Create player
        const startX = gameWidth * 0.1;
        const startY = gameHeight * 0.8;
        this.player = new Player(this, startX, startY);

        // Create coins
        this.coins = this.physics.add.group();
        this.coinsTotal = 0;
        this.coinsCollected = 0;
        this.createCoins(gameWidth, gameHeight);

        // Create enemies
        this.enemies = [];
        this.createEnemies(gameWidth, gameHeight);

        // Touch controls
        this.touchControls = new TouchControls(this, this.player);

        // Setup collisions
        this.setupCollisions();

        // Setup world bounds
        this.physics.world.setBounds(0, 0, gameWidth, gameHeight);

        // Update UI
        this.game.events.emit('updateUI');
    }

    createPlatforms(gameWidth, gameHeight) {
        this.levelData.platforms.forEach(platformData => {
            const x = platformData.x * gameWidth;
            const y = platformData.y * gameHeight;
            const width = platformData.width * gameWidth;
            const height = platformData.height * gameHeight;

            // Create platform texture if needed
            const key = `platform_${Math.round(width)}_${Math.round(height)}`;
            if (!this.textures.exists(key)) {
                const graphics = this.add.graphics();
                graphics.fillStyle(platformData.fixed ? 0x8B4513 : 0x228B22);
                graphics.fillRect(0, 0, width, height);

                // Add texture
                if (!platformData.fixed) {
                    graphics.lineStyle(2, 0x1a6b1a);
                    for (let i = 0; i < width; i += 20) {
                        graphics.lineBetween(i, 0, i, height);
                    }
                }

                graphics.generateTexture(key, width, height);
                graphics.destroy();
            }

            const platform = this.platforms.create(x + width / 2, y + height / 2, key);
            platform.setDisplaySize(width, height);
            platform.body.updateFromGameObject();
            platform.refreshBody();
        });
    }

    createMovingPlatforms(gameWidth, gameHeight) {
        if (!this.levelData.movingPlatforms) return;

        this.levelData.movingPlatforms.forEach(platformData => {
            const startX = platformData.startX * gameWidth;
            const startY = platformData.startY * gameHeight;
            const endX = platformData.endX * gameWidth;
            const endY = platformData.endY * gameHeight;
            const width = platformData.width * gameWidth;
            const height = platformData.height * gameHeight;

            const movingPlatform = new MovingPlatform(
                this, startX, startY, endX, endY,
                width, height, platformData.speed
            );

            this.movingPlatforms.push(movingPlatform);
        });
    }

    createCoins(gameWidth, gameHeight) {
        this.levelData.coins.forEach(coinData => {
            const x = coinData.x * gameWidth;
            const y = coinData.y * gameHeight;

            // Create coin texture if needed
            if (!this.textures.exists('coin')) {
                const graphics = this.add.graphics();
                graphics.fillStyle(0xFFD700);
                graphics.fillCircle(10, 10, 10);
                graphics.fillStyle(0xFFA500);
                graphics.fillCircle(10, 10, 5);
                graphics.generateTexture('coin', 20, 20);
                graphics.destroy();
            }

            const coin = this.coins.create(x, y, 'coin');
            coin.body.setAllowGravity(false);
            coin.setSize(16, 16); // Smaller hitbox for precision

            // Animate coin
            this.tweens.add({
                targets: coin,
                y: y - 5,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.inOut'
            });

            this.coinsTotal++;
        });
    }

    createEnemies(gameWidth, gameHeight) {
        if (!this.levelData.enemies) return;

        this.levelData.enemies.forEach(enemyData => {
            const x = enemyData.x * gameWidth;
            const y = enemyData.y * gameHeight;
            const minX = enemyData.patrol.min * gameWidth;
            const maxX = enemyData.patrol.max * gameWidth;

            const enemy = new Enemy(this, x, y, minX, maxX, enemyData.speed);
            this.enemies.push(enemy);
        });
    }

    setupCollisions() {
        // Player collisions with platforms
        this.physics.add.collider(this.player.sprite, this.platforms);

        // Player collisions with moving platforms
        this.movingPlatforms.forEach(movingPlatform => {
            this.physics.add.collider(this.player.sprite, movingPlatform.sprite);
        });

        // Player coin collection
        this.physics.add.overlap(this.player.sprite, this.coins, this.collectCoin, null, this);

        // Enemy collisions with platforms
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy.sprite, this.platforms);
            this.movingPlatforms.forEach(movingPlatform => {
                this.physics.add.collider(enemy.sprite, movingPlatform.sprite);
            });

            // Player-enemy collision
            this.physics.add.overlap(this.player.sprite, enemy.sprite, (playerSprite, enemySprite) => {
                this.handlePlayerEnemyCollision(enemy);
            }, null, this);
        });
    }

    collectCoin(playerSprite, coinSprite) {
        coinSprite.destroy();
        this.coinsCollected++;
        gameState.addCoin();

        if (this.audioManager) {
            this.audioManager.playCoin();
        }

        this.game.events.emit('updateUI');

        // Check if all coins collected
        if (this.coinsCollected === this.coinsTotal) {
            // Bonus fanfare could go here
        }
    }

    handlePlayerEnemyCollision(enemy) {
        // Check if player is above enemy (bouncing on top)
        if (this.player.sprite.body.velocity.y > 0 &&
            this.player.sprite.y < enemy.sprite.y - 10) {
            // Defeat enemy
            enemy.defeat();
            this.player.bounceOnEnemy();
            gameState.defeatEnemy();
            this.game.events.emit('updateUI');

            // Remove from array
            const index = this.enemies.indexOf(enemy);
            if (index > -1) {
                this.enemies.splice(index, 1);
            }
        } else {
            // Player takes damage
            if (this.player.takeDamage()) {
                if (!gameState.loseLife()) {
                    // Game over
                    this.gameOver();
                } else {
                    // Lost a life, respawn
                    this.game.events.emit('updateUI');
                    this.respawnPlayer();
                }
            }
        }
    }

    respawnPlayer() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');
        this.player.reset(gameWidth * 0.1, gameHeight * 0.8);
    }

    update(time, delta) {
        // Check if player fell off
        const gameHeight = this.game.registry.get('gameHeight');
        if (this.player.sprite.y > gameHeight + 100) {
            if (!gameState.loseLife()) {
                this.gameOver();
            } else {
                this.game.events.emit('updateUI');
                this.respawnPlayer();
            }
        }

        // Update player
        this.player.update(delta);

        // Update enemies
        this.enemies.forEach(enemy => enemy.update());

        // Update moving platforms
        this.movingPlatforms.forEach(platform => platform.update());

        // Check round completion (could be triggered by reaching a goal or collecting all coins)
        // For now, pressing 'R' completes round (can be changed to automatic trigger)
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('R'))) {
            this.completeRound();
        }

        // Add completion zone (invisible trigger at top of level)
        if (!this.completionZone) {
            const gameWidth = this.game.registry.get('gameWidth');
            this.completionZone = this.add.zone(gameWidth / 2, 50, gameWidth, 100);
            this.physics.world.enable(this.completionZone);
            this.completionZone.body.setAllowGravity(false);
            this.physics.add.overlap(this.player.sprite, this.completionZone, () => {
                this.completeRound();
            });
        }
    }

    completeRound() {
        if (this.roundCompleted) return;
        this.roundCompleted = true;

        const allCoinsCollected = (this.coinsCollected === this.coinsTotal);
        gameState.completeRound(allCoinsCollected);
        gameState.nextRound();

        if (this.audioManager) {
            this.audioManager.playVictory();
        }

        // Transition to next round
        this.scene.pause();
        this.scene.launch('TransitionScene', {
            round: this.levelData.round,
            coinsCollected: this.coinsCollected,
            totalCoins: this.coinsTotal,
            score: gameState.score,
            nextRound: gameState.currentRound
        });
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        if (this.audioManager) {
            this.audioManager.playGameOver();
        }

        // Save high score
        const highScore = parseInt(localStorage.getItem('highScore') || '0');
        if (gameState.score > highScore) {
            localStorage.setItem('highScore', gameState.score.toString());
        }

        // Show game over screen
        this.showGameOverScreen();
    }

    showGameOverScreen() {
        const gameWidth = this.game.registry.get('gameWidth');
        const gameHeight = this.game.registry.get('gameHeight');

        const overlay = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.8);
        overlay.setOrigin(0);
        overlay.setScrollFactor(0);
        overlay.setDepth(3000);

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
        gameOverText.setDepth(3001);

        const stats = this.add.text(gameWidth / 2, gameHeight * 0.5,
            `Final Score: ${gameState.score}\nRound Reached: ${this.levelData.round}`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        });
        stats.setOrigin(0.5);
        stats.setScrollFactor(0);
        stats.setDepth(3001);

        const restartButton = this.add.text(gameWidth / 2, gameHeight * 0.7, 'RESTART', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 30, y: 15 },
            fontStyle: 'bold'
        });
        restartButton.setOrigin(0.5);
        restartButton.setInteractive({ useHandCursor: true });
        restartButton.setScrollFactor(0);
        restartButton.setDepth(3001);

        restartButton.on('pointerdown', () => {
            this.scene.stop('UIScene');
            this.scene.start('MenuScene');
        });
    }
}
