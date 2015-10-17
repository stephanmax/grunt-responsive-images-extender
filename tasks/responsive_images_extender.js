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
    ignore: []
  };

  grunt.registerMultiTask('responsive_images_extender', 'Extend HTML image tags with srcset and sizes attributes to leverage native responsive images.', function() {
    var numOfFiles = this.files.length,
        options = this.options(DEFAULT_OPTIONS),
        processedImages = 0;

    var parseAndExtendImg = function(content, filepath) {
      var $ = cheerio.load(content),
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

        var buildSrcset = function(imageNames) {
          var srcset = [];
          imageNames.forEach(function(imageName) {
            srcset.push(path.join(path.dirname(imageSrc), imageName) + ' ' + sizeOf(path.join(imageLoc.dir, imageName)).width + 'w');
          });
          return srcset.join(', ');
        };

        var separatorPos, filePath, fileExt;
        var image = $(this), imageSrc = image.attr('src'), imageLoc = noramlizeImagePath(imageSrc), allImageNames = findRelatedImages(imageLoc), srcset = buildSrcset(allImageNames);

        image.attr('srcset', srcset);

      //   grunt.log.ok(JSON.stringify(srcMap));
      //
      //   function buildSrc(option) {
      //     return filePath + option.suffix + fileExt + ' ' + option.value;
      //   }
      //
      //   function buildSize(option) {
      //     if (option.cond === 'default') {
      //       return option.size;
      //     }
      //     else {
      //       return '(' + option.cond + ') ' + option.size;
      //     }
      //   }
      //
      //   var retinaReady = 'srcsetRetina' in options,
      //       useSizes = 'sizes' in options,
      //       isNonResponsive = image.attr('width') !== undefined,
      //       hasSrcset = image.attr('srcset') !== undefined,
      //       hasSizes = image.attr('sizes') !== undefined;
      //
      //   // Don't process <img> tags unnecessarily
      //   if ((isNonResponsive && hasSrcset) ||
      //       (isNonResponsive && !hasSrcset && !retinaReady) ||
      //       (!isNonResponsive && hasSrcset && hasSizes) ||
      //       (hasSrcset && !useSizes)) {
      //     return;
      //   }
      //
      //   if (imageSrc === undefined) {
      //     grunt.log.verbose.error('Found an image without a source: ' + $.html(image));
      //     return;
      //   }
      //   separatorPos = filePath.lastIndexOf('.');
      //   fileExt = filePath.slice(separatorPos);
      //   filePath = filePath.slice(0, separatorPos);
      //
      //   if (isNonResponsive) {
      //     image.attr('srcset', buildAttributeList(options.srcsetRetina, buildSrc));
      //     grunt.log.verbose.ok('Detected width attribute for ' + filePath + fileExt + ' (not responsive, but retina-ready)');
      //   }
      //   else {
      //     if (!hasSrcset) {
      //       image.attr('srcset', buildAttributeList(options.srcset, buildSrc));
      //       grunt.log.verbose.ok('Extend ' + filePath + fileExt + ' with srcset attribute');
      //     }
      //
      //     if (!hasSizes && useSizes) {
      //       options.sizes.some(function (s) {
      //         if (image.is(s.selector)) {
      //           image.attr('sizes', buildAttributeList(s.sizeList, buildSize));
      //           grunt.log.verbose.ok('Extend ' + filePath + fileExt + ' with sizes attribute (selector: ' + s.selector + ')');
      //           return true;
      //         }
      //       });
      //     }
      //   }
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
