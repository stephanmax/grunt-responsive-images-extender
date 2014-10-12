/*
 * grunt-responsive-images-extender
 * https://github.com/smaxtastic/grunt-responsive-images-extender
 *
 * Copyright (c) 2014 Stephan Max
 * Licensed under the MIT license.
 * 
 * Extend HTML image tags with srcset and sizes attributes to leverage native responsive images.
 * 
 * @author Stephan Max (http://twitter.com/smaxtastic)
 * @version 0.1.0
 */

'use strict';

module.exports = function(grunt) {
  
  var cheerio = require('cheerio');

  var DEFAULT_OPTIONS = {
    ignore: [],
    srcset: [{
      suffix: '-small',
      value: '320w'
    },{
      suffix: '-medium',
      value: '640w'
    },{
      suffix: '-large',
      value: '1024w'
    }]
  };

  grunt.registerMultiTask('responsive_images_extender', 'Extend HTML image tags with srcset and sizes attributes to leverage native responsive images.', function() {
    var numOfFiles = this.files.length,
        options = this.options(DEFAULT_OPTIONS),
        processedImages = 0;
    
    function buildAttributeList(optionList, buildAttribute) {
      var attributeList = [];
      optionList.forEach(function(o) {
        attributeList.push(buildAttribute(o));
      });
      return attributeList.join(', ');
    }
    
    function parseAndExtendImg(content, options) {
      var $ = cheerio.load(content),
          images = $('img:not(' + options.ignore.join(', ') + ')');
      
      images.each(function() {
        var separatorPos, filePath, fileExt,
            image = $(this);
        
        function buildSrc(option) {
          return filePath + option.suffix + fileExt + ' ' + option.value;
        }
        
        function buildSize(option) {
          if (option.cond === 'default') {
            return option.size;
          }
          else {
            return '(' + option.cond + ') ' + option.size;
          }
        }
        
        var retinaReady = 'srcsetRetina' in options,
            useSizes = 'sizes' in options,
            isNonResponsive = image.attr('width') !== undefined,
            hasSrcset = image.attr('srcset') !== undefined,
            hasSizes = image.attr('sizes') !== undefined;
        
        // Don't process <img> tags unnecessarily
        if ((isNonResponsive && hasSrcset) ||
            (isNonResponsive && !hasSrcset && !retinaReady) ||
            (!isNonResponsive && hasSrcset && hasSizes) ||
            (hasSrcset && !useSizes)) {
          return;
        }
        
        filePath = image.attr('src');
        if (filePath === undefined) {
          grunt.log.verbose.error('Found an image without a source: ' + $.html(image));
          return;
        }
        separatorPos = filePath.lastIndexOf('.');
        fileExt = filePath.slice(separatorPos);
        filePath = filePath.slice(0, separatorPos);
        
        if (isNonResponsive) {
          image.attr('srcset', buildAttributeList(options.srcsetRetina, buildSrc));
          grunt.log.verbose.ok('Detected width attribute for ' + filePath + fileExt + ' (not responsive, but retina-ready)');
        }
        else {
          if (!hasSrcset) {
            image.attr('srcset', buildAttributeList(options.srcset, buildSrc));
            grunt.log.verbose.ok('Extend ' + filePath + fileExt + ' with srcset attribute');
          }
        
          if (!hasSizes && useSizes) {
            options.sizes.some(function (s) {
              if (image.is(s.selector)) {
                image.attr('sizes', buildAttributeList(s.sizeList, buildSize));
                grunt.log.verbose.ok('Extend ' + filePath + fileExt + ' with sizes attribute (selector: ' + s.selector + ')');
                return true;
              }
            });
          }
        }
      });
      
      return {content: $.html(), count: images.length};
    }
    
    grunt.log.writeln('Found ' + numOfFiles.toString().cyan + ' ' + grunt.util.pluralize(numOfFiles, 'file/files'));
    
    this.files.forEach(function(f) {
      var content = grunt.file.read(f.src);
      var result = parseAndExtendImg(content, options);
      
      grunt.file.write(f.dest, result.content);
      processedImages += result.count;
    });
    
    grunt.log.writeln('Processed ' + processedImages.toString().cyan + ' <img> ' + grunt.util.pluralize(processedImages, 'tag/tags'));
  });

};
