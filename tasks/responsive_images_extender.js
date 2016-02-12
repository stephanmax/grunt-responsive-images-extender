/*
 * grunt-responsive-images-extender
 * https://github.com/smaxtastic/grunt-responsive-images-extender
 *
 * Copyright (c) 2014 Stephan Max
 * Licensed under the MIT license.
 *
 * Extend HTML image tags with srcset and sizes attributes to leverage native responsive images.
 *
 * @author Stephan Max (http://stephanmax.is)
 * @version 2.0.0
 */

module.exports = function(grunt) {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var cheerio = require('cheerio');
  var sizeOf = require('image-size');

  var DEFAULT_OPTIONS = {
    separator: '-',
    baseDir: '',
    ignore: [],
    srcsetAttributeName: 'srcset'
  };

  grunt.registerMultiTask('responsive_images_extender', 'Extend HTML image tags with srcset and sizes attributes to leverage native responsive images.', function() {
    var numOfFiles = this.files.length;
    var options = this.options(DEFAULT_OPTIONS);
    var imgCount = 0;

    var parseAndExtendImg = function(filepath) {
      var content = grunt.file.read(filepath);
      var $ = cheerio.load(content, {decodeEntities: false});
      var imgElems = $('img:not(' + options.ignore.join(', ') + ')');

      imgElems.each(function() {
        var normalizeImagePath = function(src) {
          var pathPrefix;

          if (path.isAbsolute(src)) {
            pathPrefix = options.baseDir;
          }
          else {
            pathPrefix = path.dirname(filepath);
          }

          return path.parse(path.join(pathPrefix, src));
        };

        var findMatchingImages = function(path) {
          var files = fs.readdirSync(path.dir);
          var imageMatch = new RegExp(path.name + '(' + options.separator + '[^' + options.separator + ']*)?' + path.ext + '$');

          return files.filter(function(filename) {
            return imageMatch.test(filename);
          });
        };

        var buildSrcMap = function(imageNames) {
          var srcMap = {};

          imageNames.forEach(function(imageName) {
            srcMap[imageName] = sizeOf(path.join(imagePath.dir, imageName)).width;
          });

          return srcMap;
        };

        var buildSrcset = function(srcMap, width) {
          var srcset = [];
          var candidate;

          for (var img in srcMap) {
            candidate = path.posix.join(path.dirname(imgSrc), img);
            if (width !== undefined) {
              candidate += ' ' + Math.round(srcMap[img] / width * 100) / 100 + 'x';
            }
            else {
              candidate += ' ' + srcMap[img] + 'w';
            }
            srcset.push(candidate);
          }

          if (options.srcsetAttributeName !== DEFAULT_OPTIONS.srcsetAttributeName) {
            imgElem.attr(DEFAULT_OPTIONS.srcsetAttributeName, null);
          }

          return srcset.join(', ');
        };

        var buildSizes = function(sizeList) {
          var sizes = [];

          sizeList.forEach(function(s) {
            var actualSize = srcMap[imagePath.name + imagePath.ext] + 'px';
            var cond = s.cond.replace('%size%', actualSize);
            var size = s.size.replace('%size%', actualSize);

            sizes.push(
              cond === 'default' ? size : '(' + cond + ') ' + size
            );
          });

          return sizes.join(', ');
        };

        var setSrcAttribute = function() {
          switch (options.srcAttribute) {
            case 'none':
              imgElem.attr('src', null);
              break;
            case 'smallest':
              var smallestImage = Object.keys(srcMap).map(function(k) {
                return [k, srcMap[k]];
              }).reduce(function(a, b) {
                return b[1] < a[1] ? b : a;
              });
              imgElem.attr('src', path.posix.join(path.dirname(imgSrc), smallestImage[0]));
              break;
            default:
          }
        };

        var imgElem = $(this);
        var imgWidth = imgElem.attr('width');
        var imgSrc = imgElem.attr('src');

        var useSizes = 'sizes' in options;
        var isResponsive = imgWidth === undefined;
        var hasSrcset = imgElem.attr(options.srcsetAttributeName) !== undefined;
        var hasSizes = imgElem.attr('sizes') !== undefined;

        var imagePath;
        var imageMatches;
        var srcMap;

        if (hasSrcset && (!isResponsive || (isResponsive && hasSizes) || !useSizes)) {
          return;
        }

        imagePath = normalizeImagePath(imgSrc);
        imageMatches = findMatchingImages(imagePath);

        switch (imageMatches.length) {
          case 0:
            grunt.verbose.error('Found no file for ' + imgSrc.cyan);
            return;
          case 1:
            grunt.verbose.error('Found only one file for ' + imgSrc.cyan);
            return;
          default:
            grunt.verbose.ok('Found ' + imageMatches.length.cyan + ' files for ' + imgSrc.cyan + ': ' + imageMatches);
        }

        srcMap = buildSrcMap(imageMatches);

        if (!isResponsive && imgWidth > 0) {
          imgElem.attr(options.srcsetAttributeName, buildSrcset(srcMap, imgWidth));
          setSrcAttribute();
        }
        else {
          if (!hasSrcset) {
            imgElem.attr(options.srcsetAttributeName, buildSrcset(srcMap));
            setSrcAttribute();
          }

          if (!hasSizes && useSizes) {
            options.sizes.some(function (s) {
              if (imgElem.is(s.selector)) {
                imgElem.attr('sizes', buildSizes(s.sizeList));
                setSrcAttribute();
                return true;
              }
            });
          }
        }
      });

      return {content: $.html(), count: imgElems.length};
    };

    this.files.forEach(function(f) {
      var result;

      if (f.src.length === 0) {
        grunt.log.error('No files to process!');
        return;
      }

      result = parseAndExtendImg(f.src);

      grunt.file.write(f.dest, result.content);
      imgCount += result.count;
    });

    grunt.log.ok('Processed ' + imgCount.toString().cyan + ' <img> ' + grunt.util.pluralize(imgCount, 'tag/tags'));
  });

};
