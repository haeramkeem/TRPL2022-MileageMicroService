#!/bin/bash

set -e

# import
source ../.example.env
source <(curl -sL https://raw.githubusercontent.com/haeramkeem/sh-it/main/func/curl_post.sh)
source <(curl -sL https://raw.githubusercontent.com/haeramkeem/sh-it/main/func/exec_sql.sh)

# Gen user
USER=$(uuidgen)
cat << EOF | exec_sql
INSERT INTO userData (id) VALUES ('$USER');
EOF

# Gen place
PLACE=$(uuidgen)
cat << EOF | exec_sql
INSERT INTO placeData (id) VALUES ('$PLACE');
EOF

# Gen review
cat << EOF | curl_post localhost:60079/events &> /dev/null
{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "$(uuidgen)",
    "content": "good!",
    "attachedPhotoIds": ["$(uuidgen)"],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF

# Request -> must return error (w/ 400)
echo ""
echo "*** TC1: Request with non-UUID"
echo "*** Should response '400 Bad Request'"
echo ""
curl -i \
    --max-time 10 \
    localhost:60079/point?owner=no-uuid
echo ""
