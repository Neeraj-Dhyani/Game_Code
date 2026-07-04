# 🐎 Horse Runner Game
A simple endless runner game built using **HTML5 Canvas** and **Vanilla JavaScript**. Control a horse, jump over obstacles, earn points, and try to survive as long as possible.

## 🎮 Features

- Animated horse running using sprite sheets
- Jump mechanics with gravity physics
- Infinite scrolling grass background
- Random obstacle spawning
- Collision detection
- Score tracking system
- Main menu with buttons
- Sound effects while running
- Sprite sheet based rendering

---

## 📸 Gameplay

The horse continuously runs forward while obstacles appear randomly.

Press **Spacebar** to jump and avoid obstacles.

The game ends when the horse collides with an obstacle.

---

## 🛠️ Technologies Used

- HTML5 Canvas
- JavaScript (ES6)
- Sprite Sheets (JSON + PNG)
- Audio API

---

## 📂 Project Structure

```text
project/
│
├── index.html
├── script.js
│
├── asset/
│   ├── horse_Run.png
│   ├── horse_Run.json
│   ├── horse_Jump.png
│   ├── horse_Jump.json
│   ├── grass_tile.png
│   ├── grass_tile_data.json
│   ├── number.png
│   ├── number.json
│   ├── game_menu.png
│   └── game_menu.json
│
└── sound/
    └── grass.mp3
```

---

## 🎯 Controls

| Key | Action |
|------|--------|
| Space | Jump |
| Mouse Click | Interact with Menu Buttons |

---

## 🚀 How to Run

### Option 1: Live Server (Recommended)

1. Clone the repository

```bash
git clone https://github.com/your-username/horse-runner-game.git
```

2. Open the project folder

```bash
cd horse-runner-game
```

3. Start a local server

Using VS Code Live Server:

- Right Click `index.html`
- Click **Open with Live Server**

### Option 2: Python Server

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

---

## 🎨 Game Mechanics

### Running Animation

The horse animation is rendered using frames loaded from:

```text
horse_Run.json
horse_Run.png
```

### Jump Physics

The game uses:

```javascript
velocityY += gravity;
posY += velocityY;
```

to simulate realistic jumping.

### Obstacle System

Obstacles:

- Spawn at random intervals
- Move toward the player
- Trigger Game Over on collision

### Collision Detection

Bounding-box collision detection:

```javascript
horseRect.x < obstacleRect.x + obstacleRect.w &&
horseRect.x + horseRect.w > obstacleRect.x &&
horseRect.y < obstacleRect.y + obstacleRect.h &&
horseRect.y + horseRect.h > obstacleRect.y
```

---

## 📈 Scoring

The score increases automatically every second.

```javascript
setInterval(() => {
    score += 1;
}, 1000);
```

The score is displayed using a sprite-based number system.

---

## 🔊 Sound Effects

Running sound plays while the horse is running:

```javascript
runAudio.play();
```

and pauses during jumps.

---

## 🎯 Future Improvements

- Restart button
- Pause menu
- High score system
- Mobile controls
- Multiple obstacle types
- Power-ups
- Day/Night cycle
- Local storage for scores

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Neeraj Dhyani**

Frontend Developer | Aspiring Full-Stack Developer

GitHub: https://github.com/Neeraj-Dhyani
