#!/usr/bin/env bash

if [ -n "$(git status --porcelain)" ]; then
  echo "Unclean repository : tracked git files are added/modified after installation";
  git status
  exit 1
else
  echo "no changes";
fi
