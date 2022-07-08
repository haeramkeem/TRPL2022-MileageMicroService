#!/bin/bash

set -e

# import
source ../.example.env
source <(curl -sL https://raw.githubusercontent.com/haeramkeem/sh-it/main/func/curl_post.sh)

# Invalid type
echo ""
echo "*** TC1: Invalid event type"
echo "*** Should response '400 Bad Request'"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "review",
    "action": "ADD",
    "reviewId": "$(uuidgen)",
    "content": "good!",
    "attachedPhotoIds": ["$(uuidgen)"],
    "userId": "$(uuidgen)",
    "placeId": "$(uuidgen)"
}
EOF

# Invalid action
echo ""
echo "*** TC2: Invalid event action"
echo "*** Should response '400 Bad Request'"
echo ""
cat << EOF | curl_post localhost:60079/events
{
    "type": "REVIEW",
    "action": "GOOD",
    "reviewId": "$(uuidgen)",
    "content": "good!",
    "attachedPhotoIds": ["$(uuidgen)"],
    "userId": "$(uuidgen)",
    "placeId": "$(uuidgen)"
}
EOF
