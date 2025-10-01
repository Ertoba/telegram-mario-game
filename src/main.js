/**
 * Main Game Initialization
 * Sets up Phaser with responsive scaling
 */

// Initialize Telegram Web App
let tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.enableClosingConfirmation();
    tg.ready();
}

// Calculate responsive game dimensions
function getGameDimensions() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const gameHeight = GameConfig.viewport.gameHeight;

    // Calculate width based on aspect ratio constraints
    let aspectRatio = windowWidth / windowHeight;
    aspectRatio = Math.max(GameConfig.viewport.minAspectRatio,
                          Math.min(aspectRatio, GameConfig.viewport.maxAspectRatio));

    const gameWidth = Math.round(gameHeight * aspectRatio);

    return { width: gameWidth, height: gameHeight };
}

const gameDimensions = getGameDimensions();

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: gameDimensions.width,
    height: gameDimensions.height,
    backgroundColor: '#5c94fc',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GameConfig.physics.gravity },
            debug: false // Set to true for debugging collision boxes
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gameDimensions.width,
        height: gameDimensions.height
    },
    scene: [BootScene, MenuScene, GameScene, BossScene, UIScene, TransitionScene],
    input: {
        activePointers: 3 // Support multiple touch points
    },
    render: {
        pixelArt: false,
        antialias: true
    }
};

// Create game instance
const game = new Phaser.Game(config);

// Store game dimensions globally for easy access
game.registry.set('gameWidth', gameDimensions.width);
game.registry.set('gameHeight', gameDimensions.height);

// Hide loading screen once game boots
game.events.once('ready', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 500);
});

// Handle visibility changes (pause when app goes to background)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        game.sound.pauseAll();
    } else {
        game.sound.resumeAll();
    }
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    if (gameState.currentRound > 1) {
        e.preventDefault();
        e.returnValue = '';
    }
});
