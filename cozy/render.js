const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Assets
const bgImage = new Image();
bgImage.src = 'room.png';

const spritesImage = new Image();
spritesImage.src = 'sprites.png?v=' + Date.now(); // FORCE NEW VERSION

// Sprite Sheet Configuration
// Sheet is a 3x3 grid.
const ROWS = 3;
const COLS = 3;

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
    if (spritesImage.complete && spritesImage.naturalWidth) {
        const time = Date.now();
        const spriteW = spritesImage.naturalWidth / COLS;
        const spriteH = spritesImage.naturalHeight / ROWS;
        
        CHARS.forEach((char, index) => {
            // Animation: Simple Idle Bounce
            // Offset logic creates desync so they don't bounce in unison
            const bounceOffset = index * 1000; 
            const bounceY = Math.sin((time + bounceOffset) / 250) * 5; 
            
            // Source Calculation (Middle column is usually the best "idle" pose in 3-frame sheets)
            // But let's cycle 0 -> 1 -> 2 for walking animation if we wanted
            // For now, let's stick to column 1 (center) as static pose, or animate cols
            const frame = Math.floor(time / 500) % COLS; 
            const sx = frame * spriteW; 
            const sy = char.row * spriteH;
            
            // Destination Calculation
            const dw = spriteW * char.scale;
            const dh = spriteH * char.scale;
            const dx = char.x;
            const dy = char.y + bounceY;

            // Draw Sprite
            ctx.drawImage(spritesImage, 
                sx, sy, spriteW, spriteH, // Source
                dx, dy, dw, dh            // Destination
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
        // Fetch from Gist Raw URL (High speed, decoupled from Git commits)
        const GIST_URL = "https://gist.githubusercontent.com/botthew/c7197e494c806aa7c9830543fd6a762f/raw/status.json";
        const response = await fetch(GIST_URL + '?t=' + Date.now());
        
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        document.getElementById('status-val').textContent = data.status || "UNKNOWN";
        document.getElementById('task').textContent = data.task || "IDLE";
        document.getElementById('message').textContent = `"${data.message || ''}"`;
        
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Increased poll rate to 5s for real-time feel
fetchStatus();
setInterval(fetchStatus, 5000);
