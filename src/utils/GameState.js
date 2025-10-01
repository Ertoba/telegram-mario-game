/**
 * GameState - Manages global game state across scenes
 */
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.coins = 0;
        this.lives = GameConfig.player.startLives;
        this.currentRound = 1;
        this.roundsCompleted = [];
        this.totalCoinsCollected = 0;
        this.totalEnemiesDefeated = 0;
        this.deathsThisRound = 0;
    }

    addScore(points) {
        this.score += points;
    }

    addCoin() {
        this.coins++;
        this.totalCoinsCollected++;
        this.addScore(GameConfig.scoring.coinValue);
    }

    defeatEnemy() {
        this.totalEnemiesDefeated++;
        this.addScore(GameConfig.scoring.enemyDefeatValue);
    }

    loseLife() {
        this.lives--;
        this.deathsThisRound++;
        return this.lives > 0;
    }

    completeRound(allCoinsCollected) {
        this.roundsCompleted.push(this.currentRound);
        this.addScore(GameConfig.scoring.roundCompleteBonus);

        if (this.deathsThisRound === 0) {
            this.addScore(GameConfig.scoring.noDeathBonus);
        }

        if (allCoinsCollected) {
            this.addScore(GameConfig.scoring.allCoinsBonus);
        }

        this.deathsThisRound = 0;
    }

    nextRound() {
        this.currentRound++;
    }

    getData() {
        return {
            score: this.score,
            coins: this.coins,
            lives: this.lives,
            round: this.currentRound
        };
    }
}

// Global game state instance
const gameState = new GameState();
