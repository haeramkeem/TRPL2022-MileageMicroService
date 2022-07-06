#!/bin/bash

set -e

## Usage
# 1. Write test request body JSON file in current dir w/ '.body.json' suffix
#   eg. 'add.body.json'
# 2. Provide filenames (without suffix) to the arg
#   eg. './curl_test.sh add'

for fname in $@; do
    curl -d "$(sed ':a; N; s/[[:space:]]//g; ta' ./$fname.body.json)" \
        -H "Content-Type: application/json" \
        -X POST \
        -v \
        http://localhost:60079/events
    echo ""
done
