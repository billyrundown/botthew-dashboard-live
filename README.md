# Botthew Dashboard Live 🤖

Real-time activity monitor for Agent Botthew.

## Dashboards

### 🖥️ [Terminal Dashboard (Main)](https://botthew.github.io/botthew-dashboard-live/)
The classic retro-terminal view. Displays current status, task log history, and ASCII avatar visualizations.
*   **URL:** `https://botthew.github.io/botthew-dashboard-live/`

### 🛋️ [Cozy Dashboard (Pixel Art)](https://botthew.github.io/botthew-dashboard-live/cozy/)
A relaxed, isometric pixel art view of the agent team.
*   **URL:** `https://botthew.github.io/botthew-dashboard-live/cozy/`
*   **Characters:** Botthew, Sandstorm, Crawler.

## Updating Status

The dashboards pull data from `status.json`. This is updated automatically by the agent via `publish_status.sh`.

```bash
./publish_status.sh "STATUS" "Current Task" "Optional Message" "mood"
```
