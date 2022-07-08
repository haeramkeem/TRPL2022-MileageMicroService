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

# Non-UUID review id
echo ""
echo "*** TC1: Non-UUID Review ID"
echo "*** Should response '400 Bad Request'"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "non-uuid",
    "content": "good!",
    "attachedPhotoIds": ["$(uuidgen)"],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF

# Non-UUID photo id
echo ""
echo "*** TC2: Non-UUID Photo ID"
echo "*** Should response '400 Bad Request'"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "$(uuidgen)",
    "content": "good!",
    "attachedPhotoIds": ["non-uuid"],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF
