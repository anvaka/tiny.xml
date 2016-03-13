# tiny.xml

Tiny in-browser xml parser. 2.6KB minified or **1.6KB** minified and gzipped.

This module is not supposed to work from node.js. If you want node.js version
[try something else](https://anvaka.github.io/npmrank/online/#tag=xml).

# usage

``` js
// If you are using a bundler like browserify/webpack. Otherwise it should
// be available on the window itself
var tinyxml = require('tiny.xml')

var xmlString = '<?xml version="1.0" ?>' +
 '<items xmlns="http://foo.com">' +
 ' <item>Foo</item>' +
 ' <item color="green">Bar</item>' +
 '</items>'

var parser = tinyxml(xmlString)
var nodes = parser.selectNodes('item')
console.log(nodes.length === 2, 'it found two nodes')

// Nodes are actual browser elements: https://developer.mozilla.org/en-US/docs/Web/API/Element
var firstNode = nodes[0]
console.log(firstNode instanceof Element, 'It is instance of Element')

// Since we are using standard browser API, powerful Element interface is supported:
var root = parser.selectNodes('items')[0]

var all = root.querySelectorAll('item')
console.log(all.length === 2, 'matches all item elements')

var greenNode = root.querySelector('item[color="green"]')
console.log(greenNode.textContent === 'Bar', 'picks only one green node')
```

# install

Either grab it from npm:

```
npm install tiny.xml
```

Or use pre-build version from CDN:

``` html
<!-- Unminified 3.3KB -->
<script src="https://cdn.rawgit.com/anvaka/tiny.xml/master/dist/tinyxml.js"></script>

<!-- minified 2.6KB -->
<script src="https://cdn.rawgit.com/anvaka/tiny.xml/master/dist/tinyxml.min.js"></script>
```

If you are using browser version the library will be exposed under `tinyxml` name.

# license

MIT
