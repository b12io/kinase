#!/usr/bin/env bash
cleanup() {
  code=$?
  echo 'Something went wrong! Reinstalling dependencies...'
  yarn >/dev/null
  exit $code
}
trap cleanup ERR

echo 'Installing dependencies...'
yarn >/dev/null

echo 'Bundling source code...'
webpack >/dev/null

if [ -n "$1" ]
then
  echo 'Bumping version...'
  node scripts/bump-version.js $1
fi

echo 'Zipping files...'
git archive --format zip --output package.zip HEAD
