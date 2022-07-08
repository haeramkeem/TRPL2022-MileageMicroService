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
echo ""
echo "*** TC1: Modify review content"
echo "*** Should response '200 OK'"
echo ""
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
echo ""
echo "*** TC2: Delete photo"
echo "*** Should response '200 OK'"
echo ""
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
echo ""
echo "*** TC3: Add new photo"
echo "*** Should response '200 OK'"
echo ""
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
echo ""
echo "*** TC4: Add another photo"
echo "*** Should response '200 OK'"
echo ""
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
