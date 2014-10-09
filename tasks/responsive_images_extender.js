/*
 * grunt-responsive-images-extender
 * https://github.com/smaxtastic/grunt-responsive-images-extender
 *
 * Copyright (c) 2014 Stephan Max
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var DEFAULT_OPTIONS = {
    useSizes: false,
    sizes: [{
      cond: 'max-width: 30em',
      size: '100vw'
    },{
      cond: 'max-width: 50em',
      size: '50vw'
    },{
      cond: 'default',
      size: 'calc(33vw - 100px)'
    }],
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
    var numOfFiles = this.files.length;
    var options = this.options(DEFAULT_OPTIONS);
    var processedImgs = 0;
    
    function buildAttributeList(optionList, buildAttribute) {
      var attributeList = [];
      optionList.forEach(function(o) {
        attributeList.push(buildAttribute(o));
      });
      return attributeList.join(', ');
    }
    
    function parseAndExtendImg(content, options) {
      var numberOfMatches = 0;
      var findImg = /(<img[^>]+src=")(.+)(\.[^"]+)("[^>]*>)/gi;
      
      content = content.replace(findImg, function(match, front, filePath, fileExt, remainder) {
        
        var sources, sizes;
        
        function buildReplacement(srcset, sizes) {
          var replacement = front + filePath + fileExt;
          
          if (typeof srcset !== 'undefined') {
            replacement += '" srcset="' + srcset;
          }
      
          if (typeof sizes !== 'undefined') {
            replacement += '" sizes="' + sizes;
          }
        
          return replacement + remainder;
        }
        
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
        
        var retinaReady = 'srcsetRetina' in options;
        var isNonResponsive = match.indexOf('width') !== -1;
        var hasSrcset = match.indexOf('srcset') !== -1;
        var hasSizes = match.indexOf('sizes') !== -1;
        
        // Don't process <img> tags unnecessarily
        if ((isNonResponsive && hasSrcset) ||
            (isNonResponsive && !hasSrcset && !retinaReady) ||
            (!isNonResponsive && hasSrcset && hasSizes) ||
            (hasSrcset && !options.useSizes)) {
          return match;
        }
        
        if (isNonResponsive) {
          sources = buildAttributeList(options.srcsetRetina, buildSrc);
          grunt.log.verbose.ok(
            'Detected width attribute for ' + filePath + fileExt +
            ' (not responsive, but retina-ready)'
          );
        }
        else {
          if (!hasSrcset) {
            sources = buildAttributeList(options.srcset, buildSrc);
            grunt.log.verbose.ok(
              'Extend ' + filePath + fileExt + ' with srcset attribute'
            );
          }
        
          if (!hasSizes && options.useSizes) {
            sizes = buildAttributeList(options.sizes, buildSize);
            grunt.log.verbose.ok(
              'Extend ' + filePath + fileExt + ' with sizes attribute'
            );
          }
        }
        
        numberOfMatches++;
        
        return buildReplacement(sources, sizes);
      });
      
      return {content: content, count: numberOfMatches};
    }
    
    grunt.log.writeln(
      'Found ' +
      numOfFiles.toString().cyan + ' ' +
      grunt.util.pluralize(numOfFiles, 'file/files')
    );
    
    this.files.forEach(function(f) {
      var content = grunt.file.read(f.src);
      var result = parseAndExtendImg(content, options);
      
      grunt.file.write(f.dest, result.content);
      
      processedImgs += result.count;
    });
    
    grunt.log.writeln(
      'Processed ' +
      processedImgs.toString().cyan +
      ' <img> ' +
      grunt.util.pluralize(processedImgs, 'tag/tags')
    );
  });

};
