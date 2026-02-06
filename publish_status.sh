#!/bin/bash
# Usage: ./publish_status.sh "STATUS" "TASK" "MESSAGE" [MOOD]
# Updates local status.json (for consistent schema/history) and then publishes it to the live GitHub Gist.

set -euo pipefail

STATUS="${1:-}"
TASK="${2:-}"
MESSAGE="${3:-}"
MOOD="${4:-neutral}"

if [[ -z "$STATUS" || -z "$TASK" || -z "$MESSAGE" ]]; then
  echo "Usage: ./publish_status.sh \"STATUS\" \"TASK\" \"MESSAGE\" [MOOD]"
  exit 1
fi

# 1) Update local JSON via node helper
node update_status.js "$STATUS" "$TASK" "$MESSAGE" "$MOOD"

# 2) Publish to Gist (used by GitHub Pages dashboard)
GIST_ID="c7197e494c806aa7c9830543fd6a762f"

python3 - <<PY
import json
content=open('status.json','r',encoding='utf-8').read()
payload={"files": {"status.json": {"content": content}}}
open('.tmp_gist_payload.json','w',encoding='utf-8').write(json.dumps(payload))
PY

# Requires gh auth
gh api -X PATCH "gists/${GIST_ID}" --input .tmp_gist_payload.json > /dev/null
rm -f .tmp_gist_payload.json

echo "Status published to Gist: $STATUS | $TASK | $MOOD"
