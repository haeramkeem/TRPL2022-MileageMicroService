#!/bin/bash

set -e

# import
source ../.example.env
source <(curl -sL https://raw.githubusercontent.com/haeramkeem/sh-it/main/func/curl_post.sh)

# Invalid type
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
