/**
 * Game Configuration
 *
 * This file contains all tunable parameters for the game.
 * Adjust values here to change gameplay feel, difficulty, and level layouts.
 */

const GameConfig = {
    // ===== PHYSICS PARAMETERS =====
    physics: {
        gravity: 2200,              // Gravity acceleration (units/s²)
        jumpVelocity: -850,         // Initial jump velocity (units/s, negative = up)
        maxHorizontalSpeed: 240,    // Maximum horizontal movement speed (units/s)
        horizontalAcceleration: 1200, // Horizontal acceleration when moving
        horizontalDrag: 800,        // Deceleration when no input

        // Forgiving jump mechanics
        coyoteTime: 0.12,          // Seconds after leaving platform where jump still works
        jumpBufferTime: 0.12,       // Seconds to buffer jump input before landing
        shortJumpMultiplier: 0.5,   // Jump cut multiplier for short taps
        variableJumpThreshold: 0.12 // Time threshold for short vs long jump (seconds)
    },

    // ===== PLAYER SETTINGS =====
    player: {
        width: 32,
        height: 48,
        startLives: 3,
        invincibilityTime: 1.5,     // Seconds of invincibility after taking damage
        coinValue: 50,              // Points per coin
        enemyBounceVelocity: -600   // Velocity when bouncing on enemy
    },

    // ===== VIEWPORT & SCALING =====
    viewport: {
        gameHeight: 960,            // Fixed virtual height for consistent gameplay
        minAspectRatio: 0.5,        // Minimum width/height ratio
        maxAspectRatio: 0.8         // Maximum width/height ratio
    },

    // ===== UI SETTINGS =====
    ui: {
        buttonSize: 80,             // Touch button diameter
        buttonOpacity: 0.4,         // Touch button transparency
        buttonPressedOpacity: 0.7,  // Touch button opacity when pressed
        safeAreaMargin: 20,         // Margin from screen edges
        fontSize: 24,               // UI text size
        hudPadding: 15              // Padding for score/lives display
    },

    // ===== AUDIO SETTINGS =====
    audio: {
        enabled: true,
        masterVolume: 0.7,
        sfxVolume: 0.5,
        musicVolume: 0.3
    },

    // ===== ROUNDS 1-4: LEVEL DEFINITIONS =====
    // Coordinates are in percentage (0-1) of game width/height for responsiveness
    levels: [
        // ROUND 1 - Tutorial/Easy
        {
            round: 1,
            name: "Getting Started",
            backgroundColor: 0x5c94fc,
            platforms: [
                { x: 0, y: 0.92, width: 1.0, height: 0.08, fixed: true },  // Ground
                { x: 0.15, y: 0.75, width: 0.25, height: 0.04 },
                { x: 0.50, y: 0.60, width: 0.25, height: 0.04 },
                { x: 0.20, y: 0.45, width: 0.25, height: 0.04 },
                { x: 0.60, y: 0.30, width: 0.25, height: 0.04 }
            ],
            coins: [
                { x: 0.27, y: 0.68 },
                { x: 0.62, y: 0.53 },
                { x: 0.32, y: 0.38 },
                { x: 0.72, y: 0.23 }
            ],
            enemies: [
                { x: 0.55, y: 0.88, patrol: { min: 0.40, max: 0.70 }, speed: 60 }
            ],
            movingPlatforms: []
        },

        // ROUND 2 - Moderate difficulty
        {
            round: 2,
            name: "Rising Up",
            backgroundColor: 0x6ea5ff,
            platforms: [
                { x: 0, y: 0.92, width: 1.0, height: 0.08, fixed: true },
                { x: 0.10, y: 0.78, width: 0.20, height: 0.04 },
                { x: 0.40, y: 0.68, width: 0.18, height: 0.04 },
                { x: 0.70, y: 0.58, width: 0.20, height: 0.04 },
                { x: 0.25, y: 0.48, width: 0.18, height: 0.04 },
                { x: 0.55, y: 0.35, width: 0.20, height: 0.04 },
                { x: 0.15, y: 0.22, width: 0.22, height: 0.04 }
            ],
            coins: [
                { x: 0.20, y: 0.71 },
                { x: 0.49, y: 0.61 },
                { x: 0.80, y: 0.51 },
                { x: 0.34, y: 0.41 },
                { x: 0.65, y: 0.28 },
                { x: 0.26, y: 0.15 }
            ],
            enemies: [
                { x: 0.45, y: 0.88, patrol: { min: 0.30, max: 0.60 }, speed: 80 },
                { x: 0.75, y: 0.54, patrol: { min: 0.68, max: 0.88 }, speed: 70 }
            ],
            movingPlatforms: [
                { startX: 0.05, startY: 0.55, endX: 0.35, endY: 0.55, width: 0.18, height: 0.04, speed: 100 }
            ]
        },

        // ROUND 3 - Challenging
        {
            round: 3,
            name: "Sky High",
            backgroundColor: 0x87a8d0,
            platforms: [
                { x: 0, y: 0.92, width: 1.0, height: 0.08, fixed: true },
                { x: 0.05, y: 0.80, width: 0.15, height: 0.04 },
                { x: 0.30, y: 0.72, width: 0.15, height: 0.04 },
                { x: 0.55, y: 0.64, width: 0.15, height: 0.04 },
                { x: 0.75, y: 0.54, width: 0.18, height: 0.04 },
                { x: 0.45, y: 0.44, width: 0.15, height: 0.04 },
                { x: 0.15, y: 0.34, width: 0.18, height: 0.04 },
                { x: 0.60, y: 0.24, width: 0.15, height: 0.04 },
                { x: 0.30, y: 0.14, width: 0.20, height: 0.04 }
            ],
            coins: [
                { x: 0.12, y: 0.73 },
                { x: 0.37, y: 0.65 },
                { x: 0.62, y: 0.57 },
                { x: 0.83, y: 0.47 },
                { x: 0.52, y: 0.37 },
                { x: 0.23, y: 0.27 },
                { x: 0.68, y: 0.17 },
                { x: 0.38, y: 0.07 }
            ],
            enemies: [
                { x: 0.40, y: 0.88, patrol: { min: 0.20, max: 0.55 }, speed: 100 },
                { x: 0.70, y: 0.50, patrol: { min: 0.60, max: 0.90 }, speed: 90 },
                { x: 0.25, y: 0.30, patrol: { min: 0.12, max: 0.40 }, speed: 85 }
            ],
            movingPlatforms: [
                { startX: 0.08, startY: 0.58, endX: 0.38, endY: 0.58, width: 0.15, height: 0.04, speed: 120 },
                { startX: 0.50, startY: 0.38, endX: 0.50, endY: 0.20, width: 0.15, height: 0.04, speed: 80 }
            ]
        },

        // ROUND 4 - Very Hard
        {
            round: 4,
            name: "Final Challenge",
            backgroundColor: 0xa0b5d8,
            platforms: [
                { x: 0, y: 0.92, width: 1.0, height: 0.08, fixed: true },
                { x: 0.02, y: 0.82, width: 0.12, height: 0.04 },
                { x: 0.20, y: 0.74, width: 0.12, height: 0.04 },
                { x: 0.40, y: 0.68, width: 0.12, height: 0.04 },
                { x: 0.60, y: 0.62, width: 0.12, height: 0.04 },
                { x: 0.78, y: 0.54, width: 0.14, height: 0.04 },
                { x: 0.50, y: 0.46, width: 0.12, height: 0.04 },
                { x: 0.25, y: 0.38, width: 0.12, height: 0.04 },
                { x: 0.65, y: 0.30, width: 0.14, height: 0.04 },
                { x: 0.38, y: 0.20, width: 0.12, height: 0.04 },
                { x: 0.10, y: 0.10, width: 0.15, height: 0.04 }
            ],
            coins: [
                { x: 0.08, y: 0.75 },
                { x: 0.26, y: 0.67 },
                { x: 0.46, y: 0.61 },
                { x: 0.66, y: 0.55 },
                { x: 0.86, y: 0.47 },
                { x: 0.56, y: 0.39 },
                { x: 0.31, y: 0.31 },
                { x: 0.71, y: 0.23 },
                { x: 0.44, y: 0.13 },
                { x: 0.17, y: 0.03 }
            ],
            enemies: [
                { x: 0.35, y: 0.88, patrol: { min: 0.15, max: 0.50 }, speed: 110 },
                { x: 0.70, y: 0.88, patrol: { min: 0.55, max: 0.85 }, speed: 120 },
                { x: 0.80, y: 0.50, patrol: { min: 0.70, max: 0.95 }, speed: 100 },
                { x: 0.30, y: 0.34, patrol: { min: 0.18, max: 0.45 }, speed: 95 }
            ],
            movingPlatforms: [
                { startX: 0.05, startY: 0.64, endX: 0.35, endY: 0.64, width: 0.12, height: 0.04, speed: 140 },
                { startX: 0.70, startY: 0.42, endX: 0.70, endY: 0.24, width: 0.12, height: 0.04, speed: 100 },
                { startX: 0.15, startY: 0.28, endX: 0.45, endY: 0.28, width: 0.12, height: 0.04, speed: 130 }
            ]
        }
    ],

    // ===== BOSS ROUND (Round 5) =====
    bossLevel: {
        round: 5,
        name: "Dragon Boss",
        backgroundColor: 0x8B0000,
        platforms: [
            { x: 0, y: 0.92, width: 1.0, height: 0.08, fixed: true },   // Ground
            { x: 0.05, y: 0.65, width: 0.15, height: 0.04 },           // Left platform
            { x: 0.30, y: 0.50, width: 0.15, height: 0.04 },           // Mid-left high
            { x: 0.55, y: 0.50, width: 0.15, height: 0.04 },           // Mid-right high
            { x: 0.80, y: 0.65, width: 0.15, height: 0.04 }            // Right platform
        ],
        coins: [],  // No coins in boss fight
        enemies: [] // Only the dragon
    },

    // ===== DRAGON BOSS PARAMETERS =====
    dragon: {
        maxHP: 30,
        width: 120,
        height: 100,
        position: { x: 0.70, y: 0.70 },     // Relative position

        // Attack patterns
        attacks: {
            fireballVolley: {
                count: 3,
                speed: 300,
                damage: 1,
                cooldown: 3000,             // ms between volleys
                telegraphTime: 800          // ms warning before firing
            },
            tailSwipe: {
                range: 200,
                damage: 1,
                cooldown: 4000,
                duration: 600               // ms animation time
            },
            roar: {
                pushbackForce: 400,
                cooldown: 6000,
                invulnerabilityFrames: 0.3  // seconds player is invincible after push
            },
            flameTrap: {
                count: 2,                   // Number of traps spawned
                duration: 2000,             // ms trap stays active
                damage: 1,
                cooldown: 5000,
                activatesAtPhase: 2         // Only in phase 2 (≤2/3 HP)
            }
        },

        // Phase thresholds
        phases: [
            { threshold: 1.0, attackSpeedMultiplier: 1.0 },
            { threshold: 0.66, attackSpeedMultiplier: 1.3 },    // Phase 2
            { threshold: 0.33, attackSpeedMultiplier: 1.6 }     // Phase 3
        ],

        // Weak points
        weakPoint: {
            showInterval: 8000,             // ms between weak point appearances
            showDuration: 3000,             // ms weak point stays visible
            damagePerHit: 3,
            flashDuration: 200              // ms flash on hit
        },

        // Victory rewards
        defeatBonus: {
            score: 5000,
            coins: 0
        }
    },

    // ===== SCORING =====
    scoring: {
        coinValue: 50,
        enemyDefeatValue: 100,
        roundCompleteBonus: 200,
        noDeathBonus: 500,
        allCoinsBonus: 300
    }
};

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}
