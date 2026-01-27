const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Assets
const bgImage = new Image();
bgImage.src = 'room.png';

const spritesImage = new Image();
spritesImage.src = 'sprites.png';

let frame = 0;

function draw() {
    // Draw Background
    if (bgImage.complete) {
        // Draw image covering canvas, preserving aspect ratio if needed
        // For now, simple stretch or center
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw Sprites
    if (spritesImage.complete) {
        // Bounce animation
        const bounce = Math.sin(Date.now() / 200) * 5; 
        
        // Draw the sprite sheet in the center of the room (rug area)
        // Assuming sprite sheet is horizontal 1K width, scale it down
        const scale = 0.5;
        const w = spritesImage.width * scale;
        const h = spritesImage.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2 + 100 + bounce; // +100 to put on floor
        
        ctx.drawImage(spritesImage, x, y, w, h);
    }

    requestAnimationFrame(draw);
}

// Start Loop
draw();

// Status Fetcher
async function fetchStatus() {
    try {
        // Fetch from parent directory
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
