const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, 'status.json');
const args = process.argv.slice(2);

// Usage: node update_status.js <STATUS> <TASK> <MESSAGE> [MOOD]
if (args.length < 3) {
    console.error("Usage: node update_status.js <STATUS> <TASK> <MESSAGE> [MOOD]");
    process.exit(1);
}

const [newStatus, newTask, newMessage] = args;
const newMood = args[3] || "neutral"; // Default to neutral if not specified

// Helper to get formatted date "YYYY-MM-DD HH:MM EST"
// Note: Simulating EST since system time might be UTC, but user asked for EST.
// We'll just use the system locale string for simplicity or fixed offset if needed.
// For now, simple toLocaleString with options.
const getTimestamp = () => {
    return new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    }) + " EST";
};

let data = { history: [] };

if (fs.existsSync(statusFile)) {
    try {
        data = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    } catch (e) {
        console.error("Error reading status.json, starting fresh.");
    }
}

// Ensure history exists
if (!data.history) data.history = [];

// Create the new entry
const entry = {
    timestamp: getTimestamp(),
    status: newStatus,
    task: newTask,
    message: newMessage,
    mood: newMood
};

// Update current state (legacy fields for backward compat if needed, but we can just use the entry)
data.status = entry.status;
data.last_active = entry.timestamp;
data.task = entry.task;
data.message = entry.message;
data.mood = entry.mood;

// Add to history (at the beginning)
data.history.unshift(entry);

// Keep only the last 5 entries (we display 3, but keeping 5 is safe)
data.history = data.history.slice(0, 5);

fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
console.log("Updated status.json");
