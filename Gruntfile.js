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
      tests: ['test/tmp']
    },

    // Four example configurations to be run (and then tested)
    responsive_images_extender: {
      options: {
        baseDir: 'test'
      },
      default_options: {
        files: [{
          src: ['test/fixtures/testing.html'],
          dest: 'test/tmp/default_options.html'
        }]
      },
      use_sizes: {
        options: {
          sizes: [{
            selector: '.fig-hero img',
            sizeList: [{
              cond: 'max-width: 30em',
              size: '100vw'
            },{
              cond: 'max-width: 50em',
              size: '50vw'
            },{
              cond: 'default',
              size: 'calc(33vw - 100px)'
            }]
          },{
            selector: '[alt]',
            sizeList: [{
              cond: 'max-width: 20em',
              size: '80vw'
            },{
              cond: 'default',
              size: '90vw'
            }]
          }]
        },
        files: [{
          src: ['test/fixtures/testing.html'],
          dest: 'test/tmp/use_sizes.html'
        }]
      },
      polyfill_lazyloading: {
        options: {
          srcsetAttributeName: 'data-srcset',
          srcAttribute: 'none'
        },
        files: [{
          src: ['test/fixtures/testing.html'],
          dest: 'test/tmp/polyfill_lazyloading.html'
        }]
      },
      all: {
        options: {
          ignore: ['.ignore-me'],
          srcAttribute: 'smallest',
          sizes: [{
            selector: '.fig-hero img',
            sizeList: [{
              cond: 'max-width: 30em',
              size: '100vw'
            },{
              cond: 'max-width: 50em',
              size: '50vw'
            },{
              cond: 'default',
              size: 'calc(33vw - 100px)'
            }]
          }]
        },
        files: [{
          src: ['test/fixtures/testing.html'],
          dest: 'test/tmp/all.html'
        }]
      },
      multi_src: {
        files: [{
          src: ['test/fixtures/testing.html', 'test/fixtures/testing2.html'],
          dest: 'test/tmp/multi_src.html'
        }]
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
