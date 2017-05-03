const assignIn = require('lodash.assignin');
const cloneDeep = require('lodash.clonedeep');
const fs = require('fs');
const merge = require('lodash.merge');
const path = require('path');
const pick = require('lodash.pick');
const semver = require('semver');
const shell = require('shelljs');
const tmp = require('tmp');

const manifestJSON = require('./manifest.json');
const packageJSON = require('./package.json');

shell.set('-e');

module.exports = class Tent {
  constructor(options) {
    this.options = options;

    this.runningDir = process.cwd();

    tmp.dir((err, tmpPath) => {
      if (err) throw err;

      this.tmpPath = tmpPath;

      // Copy extension files into temporary directory
      shell.exec(`cp -r ${__dirname}/. ${this.tmpPath}/`, {
        cwd: __dirname,
      });

      this.addCustomAPI();
      this.updateManifest();
      this.packageExtension();
    }, {
      unsafeCleanup: true,
    });
  }

  addCustomAPI() {
    if (this.options.apiFile) {
      // Copy custom API file into temporary directory to add to webpack pipeline
      console.log('\nAdding custom API...');
      shell.cp(
        path.join(this.runningDir, this.options.apiFile),
        path.join(__dirname, 'src/api.js')
      );

      const customPackagePath = path.join(this.runningDir, 'package.json');
      if (fs.existsSync(customPackagePath)) {
        // Add API requirements to base package.json
        const customPackage = require(customPackagePath);
        const newPackage = merge(
          packageJSON, pick(customPackage, ['dependencies']));
        fs.writeFileSync(
          path.join(this.tmpPath, 'package.json'),
          `${JSON.stringify(newPackage, null, 2)}\n`
        );
      }

      // Build extension with new API
      shell.exec('yarn && webpack && rm -rf node_modules/', {
        cwd: this.tmpPath,
      });
    }
  }

  updateManifest() {
    let newManifest = cloneDeep(manifestJSON);
    if (this.options.bumpVersion) {
      // Bump version if version level provided
      console.log('\nBumping version...');
      newManifest = assignIn({}, manifestJSON, {
        version: semver.inc(newManifest.version, this.options.bumpVersion),
      });
    }

    if (this.options.manifestOverrides) {
      console.log('\nOverriding manifest defaults...');
      newManifest = merge(newManifest, this.options.manifestOverrides || {});
    }

    fs.writeFileSync(
      path.join(this.tmpPath, 'manifest.json'),
      `${JSON.stringify(newManifest, null, 2)}\n`
    );
  }

  packageExtension() {
    console.log('\nZipping up extension...');
    const packagePath = path.join(
      this.runningDir,
      this.options.outputPath || 'package.zip');
    shell.exec(`zip -qr ${packagePath} .`, {
      cwd: this.tmpPath,
    });
  }
};
