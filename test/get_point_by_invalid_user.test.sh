#!/bin/bash

set -e

# Request -> must return error (w/ 400)
curl -v \
    --max-time 10 \
    localhost:60079/point?owner=$(uuidgen)
echo ""

# Request -> must return error (w/ 400)
curl -v \
    --max-time 10 \
    localhost:60079/point
echo ""
