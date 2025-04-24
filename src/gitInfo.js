/**
 * Utility functions to get various information from the local Git repository.
 *
 * @see https://github.com/justinlettau/preval-build-info/blob/main/scripts/build.js
 * @license MIT
 */

const { execSync } = require('child_process');

module.exports = {
  // Example output: "e46bd98daad352171a7d9e01b31a4a864340add5"
  hash: () => execTrim('git rev-parse HEAD'),

  // Example output: "e46bd98"
  hashShort: () => execTrim('git rev-parse --short HEAD'),

  // Example output: "0.8.0"
  tag: () => execTrim('git describe --always --tag --abbrev=0'),

  // Example output: "0.9.0-0-g383d13a"
  describe: () => execTrim('git describe --always --tag --long')
};

function execTrim (command) {
  return execSync(command).toString().trim();
}
