const cloneDeep = require('lodash.clonedeep');
const fs = require('fs');
const merge = require('lodash.merge');
const path = require('path');
const shell = require('shelljs');
const tmp = require('tmp');

const manifestJSON = require('./manifest.json');
const packageJSON = require('./package.json');

shell.set('-e');

module.exports = class Tent {
  constructor(options) {
    this.options = options;

    tmp.dir((err, tmpPath) => {
      if (err) throw err;

      if (!this.options.output) {
        throw Error('You must provide an output path for the packaged extension.');
      }

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
      shell.cp(this.options.apiFile, path.join(this.tmpPath, 'src/api.js'));

      if (this.options.dependencies) {
        // Add API requirements to base package.json
        const newPackage = merge({}, packageJSON, {
          dependencies: this.options.dependencies,
        });
        fs.writeFileSync(
          path.join(this.tmpPath, 'package.json'),
          `${JSON.stringify(newPackage, null, 2)}\n`);
      }

      // Build extension with new API
      shell.exec('yarn && webpack && rm -rf node_modules/', {
        cwd: this.tmpPath,
      });
    }
  }

  updateManifest() {
    let newManifest = cloneDeep(manifestJSON);

    if (this.options.manifestOverrides) {
      console.log('\nOverriding manifest defaults...');
      newManifest = merge(newManifest, this.options.manifestOverrides || {});
    }

    fs.writeFileSync(
      path.join(this.tmpPath, 'manifest.json'),
      `${JSON.stringify(newManifest, null, 2)}\n`);
  }

  packageExtension() {
    console.log('\nZipping up extension...');
    shell.mkdir('-p', path.dirname(this.options.output));
    shell.exec(`zip -qr ${this.options.output} .`, {
      cwd: this.tmpPath,
    });
  }
};
