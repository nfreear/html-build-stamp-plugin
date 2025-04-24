
[![NPM Version][npm-img]][npm]

# html-build-stamp-plugin

Webpack [plugin][] to add a [Git commit SHA][sha] and [build timestamp][iso] to a HTML file.

## Install

```sh
npm install --save-dev html-build-stamp-plugin
```

## Usage

[`webpack.config.js`][config]:
```js
const HtmlBuildStampPlugin = require('html-build-stamp-plugin');

module.exports = {
  // …

  plugins:   plugins: [
    new HtmlBuildStampPlugin({
      inputFile: path.resolve(__dirname, 'path', 'to', 'input.html'),
      outputFile: path.resolve(__dirname, 'path', 'to', 'output.html')
    })
  ]
}
```

`input.html`:
```html
<html>
  <head>
    <meta name="wpb.commit" content="Z">
    <meta name="wpb.build" content="Z">
    <!-- … -->
  </head>
</html>
```

Running Webpack results in `output.html`:
```html
<html>
  <head>
    <meta name="wpb.commit" content="e46bd98">
    <meta name="wpb.build" content="2025-03-26T20:03:00.000Z">
    <!-- … -->
  </head>
</html>
```

## License

* [MIT][]

[mit]: https://nfreear.mit-license.org/2025-
[npm]: https://www.npmjs.com/package/html-build-stamp-plugin
[npm-img]: https://img.shields.io/npm/v/html-build-stamp-plugin
[config]: https://webpack.js.org/configuration/
[plugin]: https://webpack.js.org/configuration/plugins/
[sha]: https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection.html#_single_revisions
[iso]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
