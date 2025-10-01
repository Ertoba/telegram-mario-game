# 🐉 Telegram Mario - Dragon Boss Game

A fully responsive, mobile-first platformer game built as a Telegram Mini App with 5 challenging rounds and an epic dragon boss fight!

## 🎮 Features

- **5 Progressive Rounds**: Increasing difficulty from tutorial to expert platforming
- **Boss Round**: Epic dragon fight with multiple attack patterns and phases
- **Mobile-First Design**: Fully responsive with touch controls optimized for phones
- **Advanced Physics**: Variable-height jumps, coyote time, jump buffering
- **Multiple Attack Patterns**: Fireballs, tail swipes, roar pushback, flame traps
- **Score System**: Comprehensive scoring with bonuses for perfect runs
- **Telegram Integration**: Seamless integration with Telegram Web App SDK

## 📱 Tested Device Sizes

The game is optimized for common phone screen sizes:
- 360×780 (Small phones)
- 375×812 (iPhone X/11/12)
- 390×844 (iPhone 13/14)
- 412×915 (Large Android phones)

## 🎯 Gameplay

### Rounds 1-4: Platforming
- Navigate platforms and collect golden coins
- Jump on enemies to defeat them
- Avoid falling off platforms
- Reach the top to complete each round

### Round 5: Dragon Boss
- Fight a multi-phase dragon boss
- Jump on glowing weak points to deal damage
- Dodge fireballs, tail swipes, and flame traps
- Defeat the dragon to win the game!

## 🕹️ Controls

### Desktop/Keyboard
- **Arrow Keys** / **WASD**: Move left/right
- **Space** / **Up Arrow** / **W**: Jump
  - Tap quickly for small jump
  - Hold for higher jump

### Mobile/Touch
- **Left Button** (◄): Move left
- **Right Button** (►): Move right
- **Jump Button** (▲): Jump
  - Quick tap for small jump
  - Long press for higher jump

## ⚙️ Configuration

All game parameters can be adjusted in [`config.js`](config.js):

### Physics Parameters (`GameConfig.physics`)
```javascript
gravity: 2200                    // Gravity strength (units/s²)
jumpVelocity: -850               // Jump power (negative = upward)
maxHorizontalSpeed: 240          // Maximum run speed
coyoteTime: 0.12                 // Grace period for jumping after leaving platform
jumpBufferTime: 0.12             // Grace period for jump input before landing
variableJumpThreshold: 0.12      // Time threshold for short vs long jump
```

**To make jumping easier**: Increase `jumpVelocity` (more negative) or decrease `gravity`
**To make jumping harder**: Decrease `jumpVelocity` (less negative) or increase `gravity`

### Level Definitions (`GameConfig.levels`)

Each level is defined with percentage-based coordinates (0-1) for full responsiveness:

```javascript
{
    round: 1,
    name: "Getting Started",
    backgroundColor: 0x5c94fc,
    platforms: [
        { x: 0, y: 0.92, width: 1.0, height: 0.08, fixed: true },  // Ground
        { x: 0.15, y: 0.75, width: 0.25, height: 0.04 }            // Platform
    ],
    coins: [
        { x: 0.27, y: 0.68 }  // Coin position
    ],
    enemies: [
        { x: 0.55, y: 0.88, patrol: { min: 0.40, max: 0.70 }, speed: 60 }
    ],
    movingPlatforms: [
        { startX: 0.05, startY: 0.55, endX: 0.35, endY: 0.55,
          width: 0.18, height: 0.04, speed: 100 }
    ]
}
```

**Coordinates**: All `x` and `y` values are percentages (0.0 to 1.0) of screen dimensions
- `x: 0.5` = center horizontally
- `y: 0.0` = top, `y: 1.0` = bottom
- `width: 0.25` = 25% of screen width

### Dragon Boss Parameters (`GameConfig.dragon`)

```javascript
maxHP: 30                        // Boss health points
attacks: {
    fireballVolley: {
        count: 3,                // Number of fireballs per volley
        speed: 300,              // Fireball velocity
        cooldown: 3000           // Time between attacks (ms)
    },
    // ... more attack patterns
}
phases: [
    { threshold: 1.0, attackSpeedMultiplier: 1.0 },      // Phase 1
    { threshold: 0.66, attackSpeedMultiplier: 1.3 },     // Phase 2 at 66% HP
    { threshold: 0.33, attackSpeedMultiplier: 1.6 }      // Phase 3 at 33% HP
]
```

## 📂 Project Structure

```
telegram-mario-game/
├── index.html              # Main HTML entry point
├── config.js               # ⚙️ Game configuration (edit this!)
├── src/
│   ├── main.js            # Game initialization
│   ├── scenes/
│   │   ├── BootScene.js   # Initial loading scene
│   │   ├── MenuScene.js   # Main menu
│   │   ├── GameScene.js   # Rounds 1-4 gameplay
│   │   ├── BossScene.js   # Round 5 boss fight
│   │   ├── UIScene.js     # HUD overlay
│   │   └── TransitionScene.js  # Round transitions
│   ├── objects/
│   │   ├── Player.js      # Player with advanced physics
│   │   ├── Enemy.js       # Patrolling enemies
│   │   ├── Dragon.js      # Dragon boss with attack patterns
│   │   ├── MovingPlatform.js  # Moving platforms
│   │   └── TouchControls.js   # Mobile touch buttons
│   └── utils/
│       ├── GameState.js   # Global game state management
│       └── AudioManager.js # Sound effects generator
├── node_modules/
│   └── phaser/            # Phaser 3 game framework (~500KB)
└── README.md              # This file
```

## 🚀 Deployment

### Quick Deploy to GitHub Pages

```bash
# Already initialized! Just push updates:
git add .
git commit -m "Update game"
git push origin main
```

Your game is live at: **https://ertoba.github.io/telegram-mario-game/**

### Enable GitHub Pages (if not already)
1. Go to https://github.com/Ertoba/telegram-mario-game/settings/pages
2. Select "main" branch as source
3. Save

### Set Up Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Create bot: `/newbot`
3. Create Mini App: `/newapp`
4. Select your bot
5. Enter game details and **use your GitHub Pages URL**
6. Share your Mini App!

## 🧪 Testing

### Local Testing

```bash
# Install dependencies (if needed)
npm install

# Start local server
npx http-server -p 8080

# Open in browser
http://localhost:8080
```

### Manual Test Checklist

#### Responsiveness
- [ ] Game fits on 360×780 screen without scrolling
- [ ] Game fits on 412×915 screen without scrolling
- [ ] Touch buttons don't block gameplay
- [ ] Score/lives HUD visible on all screens

#### Physics & Jump Mechanics
- [ ] Short tap produces small jump (<0.12s press)
- [ ] Long press produces high jump
- [ ] Can jump shortly after leaving platform (coyote time)
- [ ] Jump input buffered when landing (jump buffer)
- [ ] Can reach second platform in Round 2 with conservative jump

#### Gameplay - Rounds 1-4
- [ ] Can collect coins reliably (hitbox feels fair)
- [ ] Can defeat enemies by jumping on them
- [ ] Falling off platform loses a life
- [ ] Reaching top of level completes round
- [ ] Moving platforms carry player correctly
- [ ] Round transition shows stats correctly

#### Boss Round
- [ ] Dragon appears and boss HP bar displays
- [ ] Weak point appears periodically (glowing yellow)
- [ ] Hitting weak point damages dragon
- [ ] Fireballs spawn and move toward player
- [ ] Tail swipe damages player when in range
- [ ] Roar pushes player back
- [ ] Flame traps spawn in Phase 2/3
- [ ] Dragon becomes more aggressive in later phases
- [ ] Victory screen shows when dragon defeated
- [ ] Game Over screen shows when player loses all lives

#### Audio
- [ ] Jump sound plays
- [ ] Coin collection sound plays
- [ ] Hit sounds play for damage
- [ ] Boss attacks have sound effects
- [ ] Victory/Game Over music plays

#### Telegram Integration
- [ ] Game expands to full screen in Telegram
- [ ] Score data sent to Telegram on boss defeat
- [ ] Closing confirmation works

## 🎨 Customization Guide

### Adding a New Platform to a Level

Edit `config.js` → `GameConfig.levels[index].platforms`:

```javascript
platforms: [
    // ... existing platforms
    { x: 0.40, y: 0.60, width: 0.20, height: 0.04 }
    // x: 40% from left, y: 60% from top, width: 20% of screen
]
```

### Adding More Coins

Edit `config.js` → `GameConfig.levels[index].coins`:

```javascript
coins: [
    // ... existing coins
    { x: 0.50, y: 0.50 }  // Add coin at center of screen
]
```

### Making Jumps Higher

Edit `config.js` → `GameConfig.physics`:

```javascript
jumpVelocity: -950  // Increase from -850 (more negative = higher)
```

### Making Boss Easier

Edit `config.js` → `GameConfig.dragon`:

```javascript
maxHP: 20  // Reduce from 30
attacks: {
    fireballVolley: {
        cooldown: 5000  // Increase from 3000 (slower attacks)
    }
}
```

### Changing Lives

Edit `config.js` → `GameConfig.player`:

```javascript
startLives: 5  // Increase from 3
```

## 🐛 Known Issues & Solutions

**Issue**: Player can't reach high platforms
**Solution**: Increase `jumpVelocity` in config.js (make more negative)

**Issue**: Jumps feel floaty
**Solution**: Increase `gravity` in config.js

**Issue**: Hard to collect coins
**Solution**: Coins have smaller hitboxes for precision. Position them more generously in level data.

**Issue**: Touch buttons block view
**Solution**: Adjust `GameConfig.ui.buttonSize` and `buttonOpacity` in config.js

**Issue**: Dragon too hard/easy
**Solution**: Adjust `GameConfig.dragon.maxHP` and attack cooldowns

## 📊 Performance

- **Bundle Size**: ~500KB (Phaser 3 minified)
- **Assets**: 0KB (all graphics generated procedurally)
- **Total**: <500KB ✅
- **Frame Rate**: 60 FPS target on modern phones

## 🔧 Technical Details

- **Framework**: Phaser 3 (Arcade Physics)
- **Rendering**: WebGL with Canvas fallback
- **Audio**: Web Audio API (procedural sounds)
- **Scaling**: Fixed virtual height (960px) with responsive width
- **Input**: Pointer API for touch, Keyboard API for desktop

## 📜 License

MIT License - Free to use and modify

## 🙏 Credits

- Built with [Phaser 3](https://phaser.io/)
- Created for Telegram Mini Apps
- All graphics procedurally generated (no external assets)

---

**Need help?** Check `config.js` comments or test on multiple devices!

**Want to modify?** Start with `config.js` → adjust physics and level layouts!

Enjoy the game! 🎮🐉
