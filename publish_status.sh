#!/bin/bash
# Usage: ./publish_status.sh "STATUS" "TASK" "MESSAGE" [MOOD]

STATUS="$1"
TASK="$2"
MESSAGE="$3"
MOOD="${4:-neutral}"

# Update the JSON using the node helper
node update_status.js "$STATUS" "$TASK" "$MESSAGE" "$MOOD"

# Git Push (quietly)
git add status.json index.html
git commit -m "Update status: $TASK ($MOOD)" --quiet
git push --quiet

echo "Status updated: $STATUS | $TASK | $MOOD"
