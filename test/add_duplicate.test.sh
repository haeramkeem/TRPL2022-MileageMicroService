#!/bin/bash

set -e

# import
source ../.example.env
source <(curl -sL https://raw.githubusercontent.com/haeramkeem/sh-it/main/func/curl_post.sh)
source <(curl -sL https://raw.githubusercontent.com/haeramkeem/sh-it/main/func/exec_sql.sh)

# Gen user
USER1=$(uuidgen)
cat << EOF | exec_sql
INSERT INTO userData (id) VALUES ('$USER1');
EOF

USER2=$(uuidgen)
cat << EOF | exec_sql
INSERT INTO userData (id) VALUES ('$USER2');
EOF

# Gen place
PLACE=$(uuidgen)
cat << EOF | exec_sql
INSERT INTO placeData (id) VALUES ('$PLACE');
EOF

# Gen review ID
REVIEW=$(uuidgen)

# Gen first review
cat << EOF | curl_post localhost:60079/events &> /dev/null
{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "$REVIEW",
    "content": "good!",
    "attachedPhotoIds": ["$(uuidgen)"],
    "userId": "$USER1",
    "placeId": "$PLACE"
}
EOF

# Gen duplicated review
echo ""
echo "*** TC1: Add duplicated review"
echo "*** Should response '400 Bad Request'"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "$REVIEW",
    "content": "good!",
    "attachedPhotoIds": ["$(uuidgen)"],
    "userId": "$USER2",
    "placeId": "$PLACE"
}
EOF
