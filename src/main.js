/**
 * Main Game Initialization
 * Sets up Phaser with responsive scaling
 */

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.message, e.filename, e.lineno);
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.innerHTML = `
            <div style="color: red; padding: 20px; max-width: 80%; text-align: center;">
                <h2>Error Loading Game</h2>
                <p>${e.message}</p>
                <p style="font-size: 14px;">${e.filename}:${e.lineno}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; font-size: 16px;">
                    Reload
                </button>
            </div>
        `;
    }
});

console.log('Starting game initialization...');

// Initialize Telegram Web App
let tg = window.Telegram?.WebApp;
if (tg) {
    console.log('Telegram WebApp detected');
    tg.expand();
    tg.enableClosingConfirmation();
    tg.ready();
} else {
    console.log('Running outside Telegram');
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

console.log('Checking dependencies...');
console.log('GameConfig:', typeof GameConfig !== 'undefined' ? '✓' : '✗');
console.log('Phaser:', typeof Phaser !== 'undefined' ? '✓' : '✗');
console.log('BootScene:', typeof BootScene !== 'undefined' ? '✓' : '✗');
console.log('MenuScene:', typeof MenuScene !== 'undefined' ? '✓' : '✗');
console.log('GameScene:', typeof GameScene !== 'undefined' ? '✓' : '✗');
console.log('BossScene:', typeof BossScene !== 'undefined' ? '✓' : '✗');

const gameDimensions = getGameDimensions();
console.log('Game dimensions:', gameDimensions);

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
console.log('Creating Phaser game instance...');
try {
    const game = new Phaser.Game(config);
    console.log('Phaser game created successfully');

    // Store game dimensions globally for easy access
    game.registry.set('gameWidth', gameDimensions.width);
    game.registry.set('gameHeight', gameDimensions.height);

    // Hide loading screen once game boots
    game.events.once('ready', () => {
        console.log('Game ready!');
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 500);
    });
} catch (error) {
    console.error('Failed to create Phaser game:', error);
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.innerHTML = `
            <div style="color: red; padding: 20px; max-width: 80%; text-align: center;">
                <h2>Failed to Initialize Game</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; font-size: 16px;">
                    Reload
                </button>
            </div>
        `;
    }
}

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
