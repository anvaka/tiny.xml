(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tinyxml = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* globals XPathResult ActiveXObject DOMParser*/
module.exports = parser;
parser.version = '1.0.0'

function parser(xml) {
  if (typeof document === 'undefined') {
    // Since we are using DOMParser/Microsoft.XMLDOM API, this will not work in node:
    throw new Error('tiny.xml supports only browser environment')
  }

  if (typeof document.evaluate === 'function') {
    // IE Has it's own special way...
    return nonIEParser(xml);
  } else {
    return ieParser(xml);
  }
}

function nonIEParser(xml) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(xml, 'text/xml');
  var nameSpaces = extractNodeNamespaces(doc.documentElement);

  return {
    selectNodes: function (name, startFrom, nsPrefix) {
      nsPrefix = nsPrefix || 'x';
      if (!nameSpaces[nsPrefix]) { return []; }

      var root = startFrom || doc;
      var xpathResult = doc.evaluate('.//' + nsPrefix + ':' + name, root, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var result = [];

      for (var i = 0; i < xpathResult.snapshotLength; i++) {
        result.push(xpathResult.snapshotItem(i));
      }

      return result;
    },

    getText: function (node) {
      return node && node.textContent;
    }
  };

  function nsResolver(prefix) {
    return nameSpaces[prefix] || null;
  }
}

function ieParser(xml) {
  var doc = new ActiveXObject('Microsoft.XMLDOM');
  doc.setProperty('SelectionLanguage', 'XPath');
  doc.loadXML(xml);
  var nameSpaces = extractNodeNamespaces(doc.documentElement);

  var ns = Object.keys(nameSpaces).map(function (x) { return 'xmlns:' + x + "='" + nameSpaces[x] + "'"; }).join(' ');
  doc.setProperty('SelectionNamespaces', ns);

  return {
    selectNodes: function(name, startFrom, nsPrefix) {
      nsPrefix = nsPrefix || 'x';
      if (!nameSpaces[nsPrefix]) { return []; }

      var ctx = startFrom || doc;
      var selectNodeResult = ctx.selectNodes('.//' + nsPrefix + ':' + name);
      var result = [];
      for (var i = 0; i < selectNodeResult.length; ++i) {
        result.push(selectNodeResult[i]);
      }
      return result;
    },

    getText: function (node) {
      return node && node.text;
    }
  };
}

function extractNodeNamespaces(node) {
  var result = {};
  for (var i = 0; i < node.attributes.length; ++i) {
    var attr = node.attributes[i];
    if (attr.name.match(/^xmlns/)) {
      var parts = attr.name.split(':');
      var prefix = parts.length === 1 ? 'x' : parts[1];
      result[prefix] = attr.value;
    }
  }
  return result;
}

},{}]},{},[1])(1)
});
