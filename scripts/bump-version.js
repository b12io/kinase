#!/usr/bin/env bash
var fs = require('fs');
var path = require('path');
var semver = require('semver');

var MANIFEST_PATH = path.join(__dirname, '..', 'manifest.json');
var manifest = require(MANIFEST_PATH);

var args = process.argv.slice(2);
manifest.version = semver.inc(manifest.version, args[0]);

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
