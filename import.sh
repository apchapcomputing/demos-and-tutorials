#!/bin/bash
set -e

url="$1"

if [ -z "$url" ]; then
  echo "Usage: ./import.sh <repo-url>"
  exit 1
fi

name=$(basename -s .git "$url")

git remote add "$name" "$url"
git fetch "$name"
git subtree add --prefix="$name" "$name" main --squash \
  || git subtree add --prefix="$name" "$name" master --squash
git remote remove "$name"