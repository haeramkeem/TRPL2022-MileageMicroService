#!/bin/bash

set -e

# import
source ../.example.env
source <(curl -sL https://raw.githubusercontent.com/haeramkeem/sh-it/main/func/exec_sql.sh)

# Clear all
cat << EOF | exec_sql
DELETE FROM userData;
DELETE FROM placeData;
EOF
