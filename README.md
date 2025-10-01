# Telegram Mario Mini App

A Super Mario-style platformer game built as a Telegram Mini App.

## Features

- Classic platformer physics with jumping and running
- Collectible coins
- Enemy AI with patrol patterns
- Touch controls for mobile
- Keyboard controls for desktop
- Score tracking
- Game over detection
- Integration with Telegram Web App SDK

## Game Controls

### Keyboard
- **Arrow Keys** or **A/D**: Move left/right
- **Space** or **Arrow Up** or **W**: Jump

### Touch (Mobile)
- **Left/Right buttons**: Move
- **Jump button**: Jump

## Gameplay

- Navigate platforms and collect golden coins
- Jump on enemies to defeat them (land on top)
- Avoid falling off the screen
- Each coin = 50 points
- Each enemy defeated = 100 points

## How to Deploy

### Option 1: GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Push these files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. Go to Settings → Pages
4. Select "main" branch and save
5. Your game will be available at: `https://yourusername.github.io/repo-name/`

### Option 2: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts
4. Your game will be deployed automatically

### Option 3: Netlify

1. Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your game will be deployed instantly

## Setting up Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Create a new bot: `/newbot`
3. Follow the prompts to name your bot
4. After creation, set up the Mini App:
   ```
   /newapp
   ```
5. Select your bot
6. Enter the title, description, and upload an image
7. **Important**: When asked for the URL, paste your deployed game URL
8. Send a short name (username) for the app
9. Done! You can now share your Mini App

## Testing Locally

To test locally before deploying:

1. Install a local web server:
   ```bash
   npm install -g http-server
   ```

2. Run the server:
   ```bash
   http-server
   ```

3. Open browser at `http://localhost:8080`

**Note**: Telegram Web App features will only work when accessed through Telegram. For local testing, the game will work but Telegram-specific features (like data sending) won't function.

## File Structure

```
telegram-mario-game/
├── index.html          # Main HTML file with UI
├── game.js            # Game logic and physics
├── package.json       # Project metadata
└── README.md          # This file
```

## Customization

### Add More Platforms
Edit the `platforms` array in `game.js`:
```javascript
platforms.push({ x: 300, y: 250, width: 100, height: 20, color: '#228B22' });
```

### Add More Coins
Edit the `coinsList` array:
```javascript
coinsList.push({ x: 400, y: 200, width: 20, height: 20, collected: false });
```

### Add More Enemies
Edit the `enemies` array:
```javascript
enemies.push({ x: 400, y: 300, width: 30, height: 30, velocityX: 2, minX: 350, maxX: 550 });
```

### Adjust Physics
Modify these constants in `game.js`:
- `gravity`: Fall speed
- `player.speed`: Movement speed
- `player.jumpPower`: Jump height
- `friction`: How quickly player stops

## License

MIT License - Feel free to modify and use for your own projects!
