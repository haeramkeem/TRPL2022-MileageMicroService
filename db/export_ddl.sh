#!/bin/bash

source ../.example.env

docker exec mariadb mysqldump -u$DB_USERNAME -p$DB_PASSWORD $DB_DATABASE > triple.sql
