#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const shell = require('shelljs');

const PACKAGE_PATH = path.join(__dirname, '../package.json');
const packageJSON = require(PACKAGE_PATH);

shell.set('-e');

const status = shell.exec('git status --porcelain');
if (status.stdout) {
  throw Error('Your worktree is dirty! Please commit your changes first.');
}

// Bump version in package.json
const args = process.argv.slice(2);
const bumpLevel = args[0];
if (!bumpLevel) {
  throw Error('You must provide a version bump level.');
}
console.log(bumpLevel, packageJSON.version);
packageJSON.version = semver.inc(packageJSON.version, bumpLevel);

fs.writeFileSync(PACKAGE_PATH, `${JSON.stringify(packageJSON, null, 2)}\n`);

shell.exec(`git commit -am v${packageJSON.version}`);
shell.exec(`git tag ${packageJSON.version} && git push origin ${packageJSON.version}`);
shell.exec(`npm publish ${path.join(__dirname, '..')}`);
