/* global describe, it, tinyxml, expect */
describe('parser', function() {
  var xmlString = '<?xml version="1.0" ?>' +
  '<items xmlns="http://foo.com">' +
  ' <item>Foo</item>' +
  ' <item color="green">Bar</item>' +
  '</items>'

  it('should parse simple text', function () {
    var parser = tinyxml(xmlString);
    var nodes = parser.selectNodes('items');
    expect(nodes.length).toBe(1)


    var root = nodes[0]
    var all = root.querySelectorAll('item')
    expect(all.length).toBe(2)

    var greenNode = root.querySelector('item[color="green"]')
    expect(greenNode.textContent).toBe('Bar')
  })

  it('can use xpath to select nodes', function() {
    var parser = tinyxml(xmlString);
    var nodes = parser.selectNodes('*[@color="green"]')
    expect(nodes.length).toBe(1)
    var greenNode = nodes[0]
    expect(greenNode.textContent).toBe('Bar')
  })
})
