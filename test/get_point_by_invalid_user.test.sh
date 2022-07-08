#!/bin/bash

set -e

# Request -> must return error (w/ 400)
echo ""
echo "*** TC1: Request total point for the unknown user"
echo "*** Should response '400 Bad Request'"
echo ""
curl -i \
    --max-time 10 \
    localhost:60079/point?owner=$(uuidgen)
echo ""

# Request -> must return error (w/ 400)
echo ""
echo "*** TC2: Request total point with no user"
echo "*** Should response '400 Bad Request'"
echo ""
curl -i \
    --max-time 10 \
    localhost:60079/point
echo ""
