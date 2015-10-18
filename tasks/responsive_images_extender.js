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
    var numOfFiles = this.files.length,
        options = this.options(DEFAULT_OPTIONS),
        processedImages = 0;

    var parseAndExtendImg = function(content, filepath) {
      var $ = cheerio.load(content, {
        decodeEntities: false
      }),
      images = $('img:not(' + options.ignore.join(', ') + ')');

      images.each(function() {
        var noramlizeImagePath = function(src) {
          var pathPrefix;

          if (path.isAbsolute(src)) {
            pathPrefix = options.baseDir;
          }
          else {
            pathPrefix = path.dirname(filepath);
          }

          return path.parse(path.join(pathPrefix, src));
        };

        var findRelatedImages = function(location) {
          var files = fs.readdirSync(location.dir), re = new RegExp(location.name + '(' + options.separator + '[^' + options.separator + ']*)?' + location.ext + '$');

          return files.filter(function(filename) {
            return re.test(filename);
          });
        };

        var buildSrcMap = function(imageNames) {
          var srcMap = {};
          imageNames.forEach(function(imageName) {
            srcMap[imageName] = sizeOf(path.join(imageLoc.dir, imageName)).width;
          });
          return srcMap;
        };

        var buildSrcset = function(srcMap) {
          var srcset = [];

          for (var img in srcMap) {
            srcset.push(path.join(path.dirname(imageSrc), img) + ' ' + srcMap[img] + 'w');
          }

          return srcset.join(', ');
        };

        var buildSrcsetRetina = function(srcMap, width) {
          var srcset = [];

          for (var img in srcMap) {
            srcset.push(path.join(path.dirname(imageSrc), img) + ' ' + Math.round(srcMap[img] / width * 100) / 100 + 'x');
          }

          return srcset.join(', ');
        };

        var buildSizes = function(optionList) {
          var attributeList = [];
          optionList.forEach(function(o) {
            attributeList.push(
              o.cond === 'default' ? o.size : '(' + o.cond + ') ' + o.size
            );
          });
          return attributeList.join(', ');
        };

        var setSrcAttribute = function() {
          switch (options.srcAttribute) {
            case 'none':
              image.attr('src', null);
              break;
            case 'smallest':
              var smallestImage = Object.keys(srcMap).map(function(k) {
                return [k, srcMap[k]];
              }).reduce(function(a, b) {
                return b[1] < a[1] ? b : a;
              });
              image.attr('src', path.join(path.dirname(imageSrc), smallestImage[0]));
              break;
            default:
          }
        };

        var image, imageWidth, imageSrc, imageLoc, allImageNames, srcMap;

        image = $(this);
        imageWidth = image.attr('width');
        imageSrc = image.attr('src');
        imageLoc = noramlizeImagePath(imageSrc);
        allImageNames = findRelatedImages(imageLoc);

        switch (allImageNames.length) {
          case 0:
            grunt.verbose.error('No file found for ' + imageSrc.cyan);
            return;
          case 1:
            grunt.verbose.error('Only one file found for ' + imageSrc.cyan);
            return;
          default:
        }

        grunt.verbose.ok('Found ' + allImageNames.length.toString().cyan + ' files for ' + imageSrc.cyan + ': ' + allImageNames);

        var useSizes = 'sizes' in options,
            isNonResponsive = image.attr('width') !== undefined,
            hasSrcset = image.attr(options.srcsetAttributeName) !== undefined,
            hasSizes = image.attr('sizes') !== undefined;

        if ((isNonResponsive && hasSrcset) ||
            (!isNonResponsive && hasSrcset && hasSizes) ||
            (hasSrcset && !useSizes)) {
          return;
        }

        srcMap = buildSrcMap(allImageNames);

        if (isNonResponsive && imageWidth > 0) {
          image.attr(options.srcsetAttributeName, buildSrcsetRetina(srcMap, imageWidth));
          if (options.srcsetAttributeName !== 'srcset') { image.attr('srcset', null); }
          setSrcAttribute();
        }
        else {
          if (!hasSrcset) {
            image.attr(options.srcsetAttributeName, buildSrcset(srcMap));
            if (options.srcsetAttributeName !== 'srcset') { image.attr('srcset', null); }
            setSrcAttribute();
          }

          if (!hasSizes && useSizes) {
            options.sizes.some(function (s) {
              if (image.is(s.selector)) {
                image.attr('sizes', buildSizes(s.sizeList));
                setSrcAttribute();
                return true;
              }
            });
          }
        }
      });

      return {content: $.html(), count: images.length};
    };

    this.files.forEach(function(f) {
      if (f.src.length === 0) {
        grunt.log.error('No files to process!');
        return;
      }
      var content = grunt.file.read(f.src);
      var result = parseAndExtendImg(content, f.src.toString());

      grunt.file.write(f.dest, result.content);
      processedImages += result.count;
    });

    grunt.log.ok('Processed ' + processedImages.toString().cyan + ' <img> ' + grunt.util.pluralize(processedImages, 'tag/tags'));
  });

};
