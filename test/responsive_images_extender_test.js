'use strict';

var grunt = require('grunt');

exports.responsive_images_extender = {
  setUp: function(done) {
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    test.equal(actual, expected, 'Should describe what the default behavior is.');

    test.done();
  },
  retina: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/retina');
    var expected = grunt.file.read('test/expected/retina');
    test.equal(actual, expected, 'Should describe what the retina behavior is.');

    test.done();
  },
  use_sizes: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/use_sizes');
    var expected = grunt.file.read('test/expected/use_sizes');
    test.equal(actual, expected, 'Should describe what the sizes attribute behavior is.');

    test.done();
  },
  all: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/all');
    var expected = grunt.file.read('test/expected/all');
    test.equal(actual, expected, 'Should describe what the complete behavior is.');

    test.done();
  }
};
