/**
 * Webpack plugin to add a commit SHA and build timestamp to a HTML file.
 *
 * @license MIT.
 */

// import { validate } from 'schema-utils';
const { validate } = require('schema-utils');
const fs = require('fs').promises;

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

/* const COMMIT_SHA = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 8) : '[local]';
const BUILD_REGEX = /(<meta name="anf.build" content=")\w*(">)/;
const COMMIT_REGEX = /(<meta name="anf.commit" content=")\w*(">)/;
*/

class HtmlBuildStampPlugin {
  get buildRegex () { return /(<meta name="wpb.build" content=")\w*(">)/; }

  get commitRegex () { return /(<meta name="wpb.commit" content=")\w*(">)/; }

  get githubCommitSha () {
    return process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 8) : '[local]';
  }

  constructor (options = {}) {
    const RES = validate(schema, options, {
      name: 'HtmlBuildStampPlugin',
      baseDataPath: 'options',
    });
    this._options = options;
    // console.log('BuildStampHtmlPlugin. OPT:', RES, this._options);
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync(
      'HtmlBuildStampPlugin',
      async (compilation, callback) => {
        console.log('HtmlBuildStampPlugin:', this._options);

        const { inputFile, outputFile } = this._options;

        await this.processHtmlFile(inputFile, outputFile)

        /* console.log(
          'Here’s the `compilation` object which represents a single build of assets:',
          compilation
        ); */

        // Manipulate the build using the plugin API provided by webpack
        // compilation.addModule(/* ... */);

        callback();
      }
    );
  } // End of 'apply()'

  async processHtmlFile (inputFilePath, outputFilePath) {
    const HTML = await fs.readFile(inputFilePath, 'utf8');

    console.assert(this.buildRegex.test(HTML), 'buildRegex - Not found.');
    console.assert(this.commitRegex.test(HTML), 'commitRegex - Not found.');

    const INTER = HTML.replace(this.buildRegex, (match, p1, p2) => {
      return `${p1}${new Date().toISOString()}${p2}`;
    });

    const OUTPUT = INTER.replace(this.commitRegex, (match, p1, p2) => {
      return `${p1}${this.githubCommitSha}${p2}`;
    });

    await fs.writeFile(outputFilePath, OUTPUT);
  }
}

module.exports = HtmlBuildStampPlugin;
