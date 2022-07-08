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

# Gen review, photo id
REVIEW=$(uuidgen)
PHOTO1=$(uuidgen)

# Add
cat << EOF | curl_post localhost:60079/events &> /dev/null
{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "$REVIEW",
    "content": "good!",
    "attachedPhotoIds": ["$PHOTO1"],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF

# Invalid review id
echo ""
echo "*** TC1: Review ID not found"
echo "*** Should response '400 Bad Request'"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "MOD",
    "reviewId": "$(uuidgen)",
    "content": "",
    "attachedPhotoIds": ["$PHOTO1"],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF

# Invalid user id
echo ""
echo "*** TC2: User ID not found"
echo "*** Should response '400 Bad Request'"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "MOD",
    "reviewId": "$REVIEW",
    "content": "",
    "attachedPhotoIds": [],
    "userId": "$(uuidgen)",
    "placeId": "$PLACE"
}
EOF

# Invalid place id
echo ""
echo "*** TC3: Place ID not found"
echo "*** Should response '400 Bad Request'"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "MOD",
    "reviewId": "$REVIEW",
    "content": "",
    "attachedPhotoIds": ["$(uuidgen)"],
    "userId": "$USER",
    "placeId": "$(uuidgen)"
}
EOF
