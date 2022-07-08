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

# Gen review, photo id
REVIEW=$(uuidgen)
PHOTO=$(uuidgen)

# User 1 adds review
echo ""
echo "*** User 1 adds a review"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "$REVIEW",
    "content": "good!",
    "attachedPhotoIds": ["$PHOTO"],
    "userId": "$USER1",
    "placeId": "$PLACE"
}
EOF

# User 1 deletes review
echo ""
echo "*** User 1 deletes a review"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "DELETE",
    "reviewId": "$REVIEW",
    "content": "",
    "attachedPhotoIds": [],
    "userId": "$USER1",
    "placeId": "$PLACE"
}
EOF

# User 2 adds review
echo ""
echo "*** User 2 adds a review"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "$(uuidgen)",
    "content": "good!",
    "attachedPhotoIds": ["$(uuidgen)"],
    "userId": "$USER2",
    "placeId": "$PLACE"
}
EOF
