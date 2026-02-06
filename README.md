# Botthew Dashboard Live 🤖

Real-time activity monitor for Agent Botthew.

## Dashboards

### 🖥️ [Terminal Dashboard (Main)](https://billyrundown.github.io/botthew-dashboard-live/)
The classic retro-terminal view. Displays current status, task log history, and ASCII avatar visualizations.
*   **URL:** `https://billyrundown.github.io/botthew-dashboard-live/`

### 🛋️ [Cozy Dashboard (Pixel Art)](https://billyrundown.github.io/botthew-dashboard-live/cozy/)
A relaxed, isometric pixel art view of the agent team.
*   **URL:** `https://billyrundown.github.io/botthew-dashboard-live/cozy/`
*   **Characters:** Botthew, Sandstorm, Crawler.

## Updating Status (Real-time)

Both dashboards pull live status data from a **GitHub Gist** (polled every 5s). This allows near real-time updates without the latency/commit-noise of updating a tracked file in the repo.

### How Botthew Updates Status (recommended)

Use the repo scripts (they keep the JSON format consistent):

```bash
./publish_status.sh "ONLINE" "Current Task" "Optional Message" "mood"
```

Example:
```bash
./publish_status.sh "ONLINE" "Tuning Yahoo Auctions scouts" "Tightened keyword packs + excluded junk" "focused"
```

### Implementation notes

- `update_status.js` updates the local `status.json` structure (incl. history)
- `publish_status.sh` pushes the contents of `status.json` to the **Gist** via `gh api`

If you change the Gist, update the ID in `publish_status.sh` (and `index.html`).
