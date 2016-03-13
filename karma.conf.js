// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'dist/tinyxml.js',
      'test/*.js'
    ]
  });
};
