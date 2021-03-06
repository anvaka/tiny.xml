(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tinyxml = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
      var prefx = parts.length === 1 ? 'x' : parts[1];
      result[prefx] = attr.value;
    }
  }
  return result;
}

},{}]},{},[1])(1)
});