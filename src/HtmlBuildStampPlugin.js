/**
 * Webpack plugin to add a commit SHA and build timestamp to a HTML file.
 *
 * @license MIT.
 */

// import { validate } from 'schema-utils';
const { validate } = require('schema-utils');
const fs = require('fs').promises;
const gitInfo = require('./gitInfo.js');

const schema = {
  type: 'object',
  properties: {
    inputFile: {
      type: 'string'
    },
    outputFile: {
      type: 'string'
    }
  },
  additionalProperties: false
};

class HtmlBuildStampPlugin {
  get buildRegex () { return /(<meta name="wpb.build" content=")\w*(">)/; }

  get commitRegex () { return /(<meta name="wpb.commit" content=")\w*(">)/; }

  get isoDateTime () { return new Date().toISOString(); }

  get gitCommitSha () { return gitInfo.describe(); }

  get _legacyGithubCommitSha () {
    return process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 8) : '[local]';
  }

  constructor (options = {}) {
    validate(schema, options, {
      name: 'HtmlBuildStampPlugin',
      baseDataPath: 'options'
    });
    this._options = options;
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply (compiler) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync(
      'HtmlBuildStampPlugin',
      async (compilation, callback) => {
        console.log('HtmlBuildStampPlugin:', this._options);

        const { inputFile, outputFile } = this._options;

        await this.processHtmlFile(inputFile, outputFile);

        callback();
      }
    );
  } // End of 'apply()'

  async processHtmlFile (inputFilePath, outputFilePath) {
    const HTML = await fs.readFile(inputFilePath, 'utf8');

    console.assert(this.buildRegex.test(HTML), 'buildRegex - No match.');
    console.assert(this.commitRegex.test(HTML), 'commitRegex - No match.');

    const INTER = HTML.replace(this.buildRegex, (match, p1, p2) => {
      return `${p1}${this.isoDateTime}${p2}`;
    });

    const OUTPUT = INTER.replace(this.commitRegex, (match, p1, p2) => {
      return `${p1}${this.gitCommitSha}${p2}`;
    });

    await fs.writeFile(outputFilePath, OUTPUT);
  }
}

module.exports = HtmlBuildStampPlugin;
