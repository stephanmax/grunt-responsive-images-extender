/*
 * grunt-responsive-images-extender
 * https://github.com/smaxtastic/grunt-responsive-images-extender
 *
 * Copyright (c) 2014 Stephan Max
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp']
    },

    // Four example configurations to be run (and then tested)
    responsive_images_extender: {
      default_options: {
        files: {
          'tmp/default_options': 'test/fixtures/testing'
        }
      },
      use_sizes: {
        options: {
          useSizes: true
        },
        files: {
          'tmp/use_sizes': 'test/fixtures/testing'
        }
      },
      retina: {
        options: {
          srcsetRetina: [{
            suffix: '_x1.5',
            value: '1.5x'
          },{
            suffix: '_x2',
            value: '2x'
          }]
        },
        files: {
          'tmp/retina': 'test/fixtures/testing'
        }
      },
      all: {
        options: {
          useSizes: true,
          srcset: [{
            suffix: '-200',
            value: '200w'
          },{
            suffix: '-400',
            value: '400w'
          },{
            suffix: '-800',
            value: '800w'
          }],
          srcsetRetina: [{
            suffix: '_x1.5',
            value: '1.5x'
          },{
            suffix: '_x2',
            value: '2x'
          }]
        },
        files: {
          'tmp/all': 'test/fixtures/testing'
        }
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'responsive_images_extender', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'test']);

};
