# Horse Runner Game

A browser-based endless runner game built with vanilla JavaScript and the HTML5 Canvas API. Inspired by the classic Chrome "Dino" game, but featuring a running/jumping horse, animated via sprite sheets.

## How It Works

The game is driven entirely by `requestAnimationFrame` and sprite-sheet animation data loaded from JSON files, drawn onto a single `<canvas>` element (1000x500).

### Core Loop
- `animation(currentTime)` is the main render/update loop.
- Gravity and vertical velocity control the horse's jump arc.
- Obstacles ("grass" sprites) spawn at randomized intervals and scroll toward the player.
- Axis-aligned bounding box collision detection between the horse and obstacles triggers game over (`alert` with final score).
- Score increments by 1 every second (`setInterval`) and is rendered using a numeric sprite sheet.

### States
The game uses a simple `state` variable (`"run"` / `"jump"`) to determine which sprite sheet and animation frame to draw each tick.

- **Run**: Looping horse-running animation, synced with a background grass/run sound effect.
- **Jump**: Triggered by pressing `Space`. Applies an upward velocity impulse (`velocityY = -25`) and gravity pulls the horse back down until it lands on the ground line, at which point state returns to `"run"`.

### Menu
Before the game starts, `gamMenu()` draws a set of menu buttons (Continue / Quit / Start) using sprite frame data. Clicking a button uses point-in-rectangle hit testing to determine which button was clicked and calls `handleButton(index)`.

## Assets

All sprite sheets consist of a PNG image plus a matching JSON file describing frame coordinates (`x`, `y`, `w`, `h`) within the sheet, following a Texture Packer–style frame format (`res.frames`).

| Purpose | JSON | PNG |
|---|---|---|
| Horse running animation | `./asset/horse_Run.json` | `./asset/horse_Run.png` |
| Horse jumping animation | `./asset/horse_Jump.json` | `./asset/horse_Jump.png` |
| Grass ground tile + obstacle | `./asset/grass_tile_data.json` | `./asset/grass_tile.png` |
| Score digit sprites (0-9) | `./asset/number.json` | `./asset/number.png` |
| Menu buttons | `./asset/game_menu.json` | `./asset/game_menu.png` |
| Ambient/run sound | — | `./sound/grass.mp3` |

All assets load asynchronously via `fetch`, and image drawing only begins once the relevant `Image.onload` and JSON fetches resolve.

## Controls

| Input | Action |
|---|---|
| `Space` | Jump (only while grounded) |
| Mouse click | Interact with menu buttons |

## Known Issues / Incomplete Areas

This appears to be a work-in-progress prototype. Notable rough edges:

- **Menu → game flow**: `handleButton` calls `requestAnimationFrame(animation)` on "start", but `animation` is also invoked once already at the bottom of the file (`loadSpriteSheetData(gamMenu)` then an unconditional call), so the loop may start before the menu is interacted with.
- **`obstacle` cleanup bug**: the off-screen removal check tests `obstacle[i].width` (undefined) instead of `obstacle[i].w`, so obstacles are never spliced out after leaving the screen.
- **`cancelAnimationFrame(animation)`**: this is called with the function reference rather than the request ID returned by `requestAnimationFrame`, so it has no effect on stopping the loop (the game relies on `return` and the user dismissing the `alert` instead).
- **Global/implicit state**: horse position, obstacle list, and timers are all module-level mutable variables rather than encapsulated state — fine for a prototype, but would need refactoring for restart/reset support.
- **No restart flow**: after game over, there's no code path to reset `score`, `obstacle`, and `posY` and return to the menu.
- Several older/dead implementations of horse drawing (`drawHorse`, `horseJump`) remain commented out in the file.

## Suggested Next Steps

1. Fix the obstacle cleanup condition (`obstacle[i].w` instead of `.width`).
2. Store the `requestAnimationFrame` ID and use it with `cancelAnimationFrame` to properly stop/restart the loop.
3. Add a proper reset function tied to the "Continue"/"Start" menu buttons.
4. Move shared mutable state into a single game-state object to make restart and pause/resume logic easier to manage.

**Setup (top of file)**
You grab the canvas, set it to 1000×500, and declare a big pile of state variables: sprite frame data placeholders (`stripeRunData`, `stripeJumpData`, etc.), physics variables (`posY`, `velocityY`, `gravity`), game state (`state`, `isJumping`), and obstacle tracking (`obstacle[]`, `obstacleTimer`, `obstacleInterval`).

**Loading assets**
`loadSpriteSheetData()` fires off five `fetch` calls to JSON files. Each JSON describes a sprite sheet in the common "frame packer" format — basically a lookup table saying "frame 3 of the horse running animation lives at pixel (x, y) with size (w, h) inside horse_Run.png." Once the run-animation JSON loads, `loadRun()` sets the actual `.png` sources on the `Image` objects. When the jump JSON loads, you attach the spacebar listener that triggers a jump.

**The menu**
`gamMenu()` draws menu button sprites (continue/quit/start) and stores their bounding boxes in `buttonMenu[]`. The canvas click listener checks if a click falls inside any button's box and calls `handleButton(index)` — index 2 ("start") kicks off `requestAnimationFrame(animation)`.

**The main loop — `animation(currentTime)`**
This runs every frame:
1. Clears the canvas.
2. Applies gravity to `velocityY`, then updates `posY` — this is what makes the jump arc feel natural (rises, decelerates, falls).
3. Counts up `obstacleTimer`; once it passes `obstacleInterval`, spawns a new obstacle and picks a new random interval for the next one.
4. Picks which sprite frame to use based on `state` ("run" or "jump").
5. Builds `horseRect` — a shrunk-down hitbox around the horse (inset by ~15-30px) so collisions feel fair instead of matching the full sprite bounding box.
6. If the horse has landed (`posY >= ground`), resets to running state.
7. Every `frameDelay` (80ms), advances to the next animation frame (`indexRun`/`indexJump`), so the sprite animates at a fixed rate independent of the render framerate.
8. Plays/pauses the running sound effect depending on state.
9. Draws the horse at the current frame.
10. Draws the scrolling grass ground — it tiles the grass sprite across the canvas width and shifts `grassX` left each frame to simulate movement, wrapping back to 0 once a tile scrolls fully off.
11. Draws and moves each obstacle, checks its bounding box against `horseRect` for collision (basic AABB overlap test), and calls `alert()` + returns if there's a hit.
12. Calls `requestAnimationFrame(animation)` isn't shown at the very end of the function you pasted, but it's implied to loop.

**Score**
A separate `setInterval` bumps `score` once per second, and `drawScore()` converts the score to a string, looks up each digit's sprite frame, and draws them side by side.

**Bugs worth knowing about** (I flagged these in the README too):
- The obstacle-removal check uses `obstacle[i].width` — that property doesn't exist (you used `w`, not `width`), so old obstacles never get removed from the array. Over a long game this array just keeps growing.
- `cancelAnimationFrame(animation)` is called with the function itself instead of the ID returned by `requestAnimationFrame`. That call does nothing — the loop actually stops because of the `return` right after it, not because of that line.
- There's a bit of a race in the startup: `loadSpriteSheetData(gamMenu)` is called at the bottom, but `gamMenu` isn't actually used as a callback there (loading is fully async via its own `.then()` chains), so passing it as an argument has no effect.

Want me to actually go in and fix any of these (obstacle cleanup, restart flow, etc.)?
