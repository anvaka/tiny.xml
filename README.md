# tiny.xml

Tiny in-browser xml parser. This module is not supposed to work from node.js
If you want node.js version [try something else](https://anvaka.github.io/npmrank/online/#tag=xml)

# usage

``` js
var xmlString = '<?xml version="1.0" ?>' +
 '<items xmlns="http://foo.com">' +
 ' <item>Foo</item>' +
 ' <item color="green">Bar</item>' +
 '</items>'

var parser = require('tiny.xml')(xmlString)
var nodes = parser.selectNodes('item')
assert(nodes.length === 2, 'it found two nodes')

// Nodes are actual browser elements: https://developer.mozilla.org/en-US/docs/Web/API/Element
var firstNode = nodes[0]
assert(firstNode instanceof Element)

// Since we are using standard browser API, powerful Element interface is supported:
var root = parser.selectNodes('items')[0]

var all = root.querySelectorAll('item')
assert(all.length === 2, 'matches all item elements')

var greenNode = root.querySelector('item[color="green"]')
assert(greenNode.length === 1, 'picks only one green node')
```

# license

MIT
