const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Assets
const bgImage = new Image();
bgImage.src = 'room.png';

const spritesImage = new Image();
spritesImage.src = 'sprites.png?v=' + Date.now(); // FORCE NEW VERSION

// Sprite Sheet Configuration
// Assumes 1024x1024 sheet with 3x3 grid
const SHEET_SIZE = 1024;
const ROWS = 3;
const COLS = 3;
const SPRITE_W = SHEET_SIZE / COLS; // ~341px
const SPRITE_H = SHEET_SIZE / ROWS; // ~341px

// Character Definitions
const CHARS = [
    { name: 'BOTTHEW',   row: 0, x: 400, y: 350, scale: 0.4 },
    { name: 'SANDSTORM', row: 1, x: 250, y: 380, scale: 0.4 },
    { name: 'CRAWLER',   row: 2, x: 550, y: 380, scale: 0.4 }
];

function draw() {
    // 1. Draw Background
    if (bgImage.complete) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Characters
    if (spritesImage.complete) {
        const time = Date.now();
        
        CHARS.forEach((char, index) => {
            // Animation: Simple Idle Bounce
            // Offset logic creates desync so they don't bounce in unison
            const bounceOffset = index * 1000; 
            const bounceY = Math.sin((time + bounceOffset) / 250) * 5; 
            
            // Source Calculation (Middle column is usually the best "idle" pose in 3-frame sheets)
            // But let's cycle 0 -> 1 -> 2 for walking animation if we wanted
            // For now, let's stick to column 1 (center) as static pose, or animate cols
            const frame = Math.floor(time / 500) % 3; 
            const sx = frame * SPRITE_W; 
            const sy = char.row * SPRITE_H;
            
            // Destination Calculation
            const dw = SPRITE_W * char.scale;
            const dh = SPRITE_H * char.scale;
            const dx = char.x;
            const dy = char.y + bounceY;

            // Draw Sprite
            ctx.drawImage(spritesImage, 
                sx, sy, SPRITE_W, SPRITE_H, // Source
                dx, dy, dw, dh              // Destination
            );
            
            // Draw Name Label
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(dx + 10, dy - 20, dw - 20, 20);
            ctx.fillStyle = "#fff";
            ctx.font = "10px monospace";
            ctx.textAlign = "center";
            ctx.fillText(char.name, dx + dw/2, dy - 6);
        });
    }

    requestAnimationFrame(draw);
}

// Start Loop
draw();

// Status Fetcher
async function fetchStatus() {
    try {
        const response = await fetch('../status.json?t=' + Date.now());
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        document.getElementById('status-val').textContent = data.status || "UNKNOWN";
        document.getElementById('task').textContent = data.task || "IDLE";
        document.getElementById('message').textContent = `"${data.message || ''}"`;
        
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

fetchStatus();
setInterval(fetchStatus, 30000);
