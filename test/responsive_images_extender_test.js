'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.responsive_images_extender = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },
  retina: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/retina');
    var expected = grunt.file.read('test/expected/retina');
    test.equal(actual, expected, 'should describe what the retina behavior is.');

    test.done();
  },
  use_sizes: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/use_sizes');
    var expected = grunt.file.read('test/expected/use_sizes');
    test.equal(actual, expected, 'should describe what the sizes attribute behavior is.');

    test.done();
  },
  all: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/all');
    var expected = grunt.file.read('test/expected/all');
    test.equal(actual, expected, 'should describe what the complete behavior is.');

    test.done();
  }
};
