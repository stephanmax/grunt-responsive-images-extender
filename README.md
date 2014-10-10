# grunt-responsive-images-extender

> Extend HTML image tags with srcset and sizes attributes to leverage native responsive images.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-responsive-images-extender --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-responsive-images-extender');
```

## The "responsive_images_extender" task

### Overview

The responsive_images_extender task will scan your source files for HTML `<img>` tags and extend them with `srcset` and optional `sizes` attributes to leverage native responsive images as described in *Yoav Weiss*' [article](https://dev.opera.com/articles/native-responsive-images/).

It is therefore the perfect complement to the [responsive_images](https://github.com/andismith/grunt-responsive-images/) task that generates images with different resolutions. Used in combination you enable the browser to make an informed decision which image to download and render.

In your project's Gruntfile, add a section named `responsive_images_extender` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  responsive_images_extender: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

* **options.srcset**<br>
  *Type:* `Array`<br>
  *Default:* `[{suffix: '-small', value: '320w'}, {suffix: '-medium', value: '640w'}, {suffix: '-large', value: '1024w'}]`<br>

  An array of objects containing the suffixes and sizes of our source set. The default values match those of the [responsive_images](https://github.com/andismith/grunt-responsive-images/) task for smooth collaboration.

* **options.useSizes**<br>
  *Type:* `Boolean`<br>
  *Default:* `false`<br>

  Determines whether a `sizes` attribute is added. If set to `true`, the `options.sizes` array is used to build the attribute value.

* **options.sizes**<br>
  *Type:* `Array`<br>
  *Default:* `[{cond: 'max-width: 30em', size: '100vw'}, {cond: 'max-width: 50em', size: '50vw'}, {cond: 'default', size: 'calc(33vw - 100px)'}]`<br>

  An array of objects containing the conditions and sizes of our size tableau. The default values are adopted from said [article by Yoav Weiss](https://dev.opera.com/articles/native-responsive-images/).

  If you want to set a default size value, make sure to set the condition to `default` and add the object at the end of the array. Otherwise the default value renders the following media conditions obsolete, since the browser walks through the list specified in `sizes` and looks for the first matching one.

  This array is optional and only used when `options.useSizes` is set to `true`. Otherwise the browser assumes the size `100vw` for all images.

* **options.srcsetRetina**<br>
  *Type:* `Array`<br>
  *Default:* none<br>

  An array of objects containing the suffixes and sizes of our source set for non-responsive images (that is, images with an explicitly set `width` attribute in pixels). Use this array if you want to provide the browser images in different resolutions for use on high-DPR or retina devices.

### Usage Examples

#### Default Options
Using the default options will make the task search for HTML `<img>` tags that have no `width` or `srcset` attribute already.

```js
grunt.initConfig({
  responsive_images_extender: {
    target: {
      options: {},
      files: [{
        expand: true,
        src: ['**/*.{html,htm,php}'],
        cwd: 'src/',
        dest: 'build/'
      }]
    }
  }
});
```

This configuration will turn this HTML code

```html
<img alt="A simple image" src="simple.jpg" title="A simple image">
```

into this:

```html
<img alt="A simple image" src="simple.jpg"
     srcset="simple-small.jpg 320w,
             simple-medium.jpg 640w,
             simple-large.jpg 1024w"
     title="A simple image">
```

#### Custom Options
Use the options to refine your tasks, e.g. to add a `sizes` attribute or a set of sources for retina-ready fixed-width images.

```js
grunt.initConfig({
  responsive_images_extender: {
    complete: {
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
      files: [{
        expand: true,
        src: ['**/*.{html,htm,php}'],
        cwd: 'src/',
        dest: 'build/'
      }]
    }
  }
});
```

Above configuration would turn the following HTML chunk

```html
<img alt="A simple image" src="simple.jpg" title="A simple image">

<img src="non_responsive.png" width="150">
```

into this:

```html
<img alt="A simple image" src="simple.jpg"
     srcset="simple-200.jpg 200w,
             simple-400.jpg 400w,
             simple-800.jpg 800w"
     sizes="(max-width: 30em) 100vw,
            (max-width: 50em) 50vw,
            calc(33vw - 100px)"
     title="A simple image">

<img src="non_responsive.png"
     srcset="non_responsive_x1.5.png 1.5x,
             non_responsive_x2.png 2x"
     width="150">
```

Please see this task's [Gruntfile](https://github.com/smaxtastic/grunt-responsive-images-extender/blob/master/Gruntfile.js) for more usage examples.

## Related Work

* **grunt-responsive-images**
  
  Use this [task](https://github.com/andismith/grunt-responsive-images/) to generate images with different sizes.

* **grunt-responsive-images-converter**

  This [task](https://github.com/miller/grunt-responsive-images-converter/) can be used to convert images in markdown files into a `<picture>` tag. Unfortunately, it is limited to markdown files. Also, read [here](http://blog.cloudfour.com/dont-use-picture-most-of-the-time/) why `<picture>` is not the smartest thing in most cases.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

*0.1.0*

* Initial commit and first version