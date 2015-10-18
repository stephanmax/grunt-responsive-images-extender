'use strict';

var grunt = require('grunt');

exports.responsive_images_extender = {
  setUp: function(done) {
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/default_options.html');
    var expected = grunt.file.read('test/expected/default_options.html');
    test.equal(actual, expected, 'Should describe what the default behavior is.');

    test.done();
  },
  retina: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/polyfill_lazyloading.html');
    var expected = grunt.file.read('test/expected/polyfill_lazyloading.html');
    test.equal(actual, expected, 'Should describe what the polyfill and lazyloading behavior is.');

    test.done();
  },
  use_sizes: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/use_sizes.html');
    var expected = grunt.file.read('test/expected/use_sizes.html');
    test.equal(actual, expected, 'Should describe what the sizes attribute behavior is.');

    test.done();
  },
  all: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/all.html');
    var expected = grunt.file.read('test/expected/all.html');
    test.equal(actual, expected, 'Should describe what the complete behavior is.');

    test.done();
  }
};
