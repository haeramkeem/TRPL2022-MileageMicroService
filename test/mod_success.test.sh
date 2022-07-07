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

# Modify content
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "MOD",
    "reviewId": "$REVIEW",
    "content": "",
    "attachedPhotoIds": ["$PHOTO1"],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF

# Delete photos
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "MOD",
    "reviewId": "$REVIEW",
    "content": "",
    "attachedPhotoIds": [],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF

# Add photos
PHOTO2=$(uuidgen)
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "MOD",
    "reviewId": "$REVIEW",
    "content": "",
    "attachedPhotoIds": ["$PHOTO2"],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF

# Add another photos
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "MOD",
    "reviewId": "$REVIEW",
    "content": "",
    "attachedPhotoIds": ["$PHOTO2", "$(uuidgen)"],
    "userId": "$USER",
    "placeId": "$PLACE"
}
EOF
