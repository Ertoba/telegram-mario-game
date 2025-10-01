// Initialize Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = Math.min(window.innerWidth, 800);
canvas.height = Math.min(window.innerHeight, 600);

// Game variables
let score = 0;
let coins = 0;
let gameRunning = true;
let keys = {};

// Player object
const player = {
    x: 100,
    y: 300,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 12,
    grounded: false,
    direction: 1 // 1 = right, -1 = left
};

// Physics constants
const gravity = 0.5;
const friction = 0.8;
const maxVelocityY = 15;

// Platforms array
const platforms = [
    { x: 0, y: canvas.height - 50, width: canvas.width, height: 50, color: '#8B4513' },
    { x: 150, y: 400, width: 120, height: 20, color: '#228B22' },
    { x: 350, y: 320, width: 100, height: 20, color: '#228B22' },
    { x: 520, y: 240, width: 120, height: 20, color: '#228B22' },
    { x: 200, y: 180, width: 100, height: 20, color: '#228B22' },
    { x: 450, y: 150, width: 80, height: 20, color: '#228B22' },
    { x: 100, y: 100, width: 100, height: 20, color: '#228B22' },
    { x: 600, y: 350, width: 150, height: 20, color: '#228B22' }
];

// Coins array
const coinsList = [
    { x: 200, y: 150, width: 20, height: 20, collected: false },
    { x: 400, y: 290, width: 20, height: 20, collected: false },
    { x: 570, y: 210, width: 20, height: 20, collected: false },
    { x: 250, y: 370, width: 20, height: 20, collected: false },
    { x: 480, y: 120, width: 20, height: 20, collected: false },
    { x: 650, y: 320, width: 20, height: 20, collected: false },
    { x: 150, y: 70, width: 20, height: 20, collected: false }
];

// Enemies array
const enemies = [
    { x: 300, y: 380, width: 30, height: 30, velocityX: 2, minX: 250, maxX: 450 },
    { x: 550, y: 220, width: 30, height: 30, velocityX: 1.5, minX: 500, maxX: 640 },
    { x: 150, y: canvas.height - 80, width: 30, height: 30, velocityX: 3, minX: 0, maxX: 400 }
];

// Input handling
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Touch controls
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const jumpBtn = document.getElementById('jumpBtn');

leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowLeft'] = true;
});
leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['ArrowLeft'] = false;
});

rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowRight'] = true;
});
rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['ArrowRight'] = false;
});

jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys[' '] = true;
});
jumpBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys[' '] = false;
});

// Draw player (Mario-like character)
function drawPlayer() {
    // Body
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x + 8, player.y + 16, 16, 16);

    // Head
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(player.x + 8, player.y + 8, 16, 8);

    // Cap
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x + 6, player.y + 4, 20, 6);

    // Legs
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(player.x + 10, player.y + 32, 6, 12);
    ctx.fillRect(player.x + 18, player.y + 32, 6, 12);

    // Eyes (direction indicator)
    ctx.fillStyle = '#000000';
    if (player.direction === 1) {
        ctx.fillRect(player.x + 18, player.y + 10, 3, 3);
    } else {
        ctx.fillRect(player.x + 11, player.y + 10, 3, 3);
    }
}

// Draw platforms
function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Add texture
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < platform.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(platform.x + i, platform.y);
            ctx.lineTo(platform.x + i, platform.y + platform.height);
            ctx.stroke();
        }
    });
}

// Draw coins
function drawCoins() {
    coinsList.forEach(coin => {
        if (!coin.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
            ctx.fill();

            // Inner circle
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 4, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(enemy.x + 5, enemy.y + 8, 8, 8);
        ctx.fillRect(enemy.x + 17, enemy.y + 8, 8, 8);

        ctx.fillStyle = '#000000';
        ctx.fillRect(enemy.x + 8, enemy.y + 11, 3, 3);
        ctx.fillRect(enemy.x + 20, enemy.y + 11, 3, 3);
    });
}

// Update player physics
function updatePlayer() {
    // Horizontal movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.velocityX = -player.speed;
        player.direction = -1;
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.velocityX = player.speed;
        player.direction = 1;
    } else {
        player.velocityX *= friction;
    }

    // Jump
    if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) && player.grounded) {
        player.velocityY = -player.jumpPower;
        player.grounded = false;
    }

    // Apply gravity
    if (!player.grounded) {
        player.velocityY += gravity;
    }

    // Limit fall speed
    if (player.velocityY > maxVelocityY) {
        player.velocityY = maxVelocityY;
    }

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Screen boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Check platform collisions
    player.grounded = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            // Top collision (landing on platform)
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
            // Bottom collision (hitting head)
            else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            // Side collisions
            else if (player.velocityX > 0) {
                player.x = platform.x - player.width;
            } else if (player.velocityX < 0) {
                player.x = platform.x + platform.width;
            }
        }
    });

    // Fall off screen (game over)
    if (player.y > canvas.height) {
        endGame();
    }
}

// Update enemies
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.velocityX;

        // Bounce between boundaries
        if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
            enemy.velocityX *= -1;
        }

        // Check collision with player
        if (checkCollision(player, enemy)) {
            // Jump on enemy
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y + 10) {
                player.velocityY = -8;
                score += 100;
                enemy.x = -1000; // Remove enemy
            } else {
                endGame();
            }
        }
    });
}

// Check coin collection
function checkCoins() {
    coinsList.forEach(coin => {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true;
            coins++;
            score += 50;
            updateScore();
        }
    });
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coins;
}

// End game
function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCoins').textContent = coins;
    document.getElementById('gameOver').style.display = 'block';

    // Send score to Telegram
    tg.sendData(JSON.stringify({
        score: score,
        coins: coins
    }));
}

// Restart game
document.getElementById('restartBtn').addEventListener('click', () => {
    location.reload();
});

// Draw background
function drawBackground() {
    // Sky
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(100, 80, 30, 0, Math.PI * 2);
    ctx.arc(130, 80, 35, 0, Math.PI * 2);
    ctx.arc(160, 80, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(500, 120, 25, 0, Math.PI * 2);
    ctx.arc(525, 120, 30, 0, Math.PI * 2);
    ctx.arc(550, 120, 25, 0, Math.PI * 2);
    ctx.fill();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw everything
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawEnemies();
    drawPlayer();

    // Update game state
    updatePlayer();
    updateEnemies();
    checkCoins();

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();

// Notify Telegram that the app is ready
tg.ready();
