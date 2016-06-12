# grunt-responsive-images-extender

> Extend HTML image tags with srcset and sizes attributes to leverage native responsive images.

## Getting Started
This plugin requires Grunt `~0.4.0`

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

This plugin uses [Cheerio](https://github.com/cheeriojs/cheerio) to traverse/modify the DOM and [image-size](https://github.com/netroy/image-size) to read the image sizes straight from the image files. You **don't have to configure** the `srcset` or `srcsetRetina` option anymore, since they get built automatically based on the present image files.

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

* **options.separator**<br>
  *Type:* `String`<br>
  *Default:* `'-'`<br>

  The separator used for naming your resized images.

* **options.baseDir**<br>
  *Type:* `String`<br>
  *Default:* `''`<br>

  The base directory of the site you are serving. This enables Grunt to access your image files when you use absolute paths to reference them in your HTML code. Ignore this option if you are using relative paths only.

* **options.sizes**<br>
  *Type:* `Array`<br>
  *Default:* none<br>

  An array of objects containing the selectors (standard CSS selectors, like `.some-class`, `#an-id` or `img[src^="http://"]`) and their respective size tableau. An example could look like this:

  ```js
  sizes: [{
    selector: '#post-header',
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
    selector: '.hero img',
    sizeList: [{
      cond: 'max-width: 20em',
      size: '80vw'
    },{
      cond: 'default',
      size: '90vw'
    }]
  }]
  ```

  If you want to set a default size value, make sure to set the condition to `default` and add the object at the end of the array. Otherwise the default value renders the following media conditions obsolete, since the browser walks through the list specified in `sizes` and looks for the first matching one.

  This array is optional and without specifying one the browser assumes the size `100vw` for all images.

  You can use the placeholder `%size%` which gets replaced by the actual width of the current image (this can come in handy to specify a maximum width with a breakpoint, e.g. `(min-width: 400px) 400px`).

* **options.ignore**<br>
  *Type:* `Array`<br>
  *Default:* `[]`<br>

  An array of standard CSS selectors of image tags you want to ignore.

* **options.srcsetAttributeName**<br>
  *Type:* `String`<br>
  *Default:* `'srcset'`<br>

  Overwrite the name of the `srcset` attribute with something else, for example some lazy loaders require `data-srcset`.

* **options.srcAttribute**<br>
  *Type:* `String`<br>
  *Default:* none<br>

  Set the `src` attribute to:

  - `'none'`: Delete the `src` attribute which is necessary to avoid duplicate downloads when you are using a polyfill. *Please note that this is not valid HTML, though.*
  - `'smallest'`: Set the `src` fallback to the smallest image.
  - Do not use this option to leave `src` untouched.

### Usage Examples

#### Default Options

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

into this (the image sizes are arbitrarily chosen and read directly from the files):

```html
<img alt="A simple image" src="simple.jpg"
     srcset="simple-small.jpg 320w,
             simple-medium.jpg 640w,
             simple-large.jpg 1024w,
             simple.jpg 2000w"
     title="A simple image">
```

#### Custom Options
Use the options to refine your tasks, e.g. to add a `sizes` attribute, a different separator, or a different `src` value. `<img>` tags with a `width` attribute automatically trigger the use of `x` descriptors.

```js
grunt.initConfig({
  responsive_images_extender: {
    complete: {
      options: {
        separator: '@',
        baseDir: 'build',
        srcAttribute: 'smallest',
        sizes: [{
          selector: '.article-img',
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
<img alt="A simple image" src="simple.jpg" class="article-img">

<img src="simple.jpg" width="200">
```

into this:

```html
<img alt="A simple image" src="simple@200.jpg" class=".article-img"
     srcset="simple@200.jpg 200w,
             simple@400.jpg 400w,
             simple@800.jpg 800w,
             simple.jpg 1600w"
     sizes="(max-width: 30em) 100vw,
            (max-width: 50em) 50vw,
            calc(33vw - 100px)">

<img src="simple@200.jpg" width="200"
     srcset="simple@200.jpg 1x,
             simple@400.jpg 2x,
             simple@800.jpg 4x,
             simple.jpg 8x">
```

#### Ignoring images
Sometimes you want to exclude certain images from the algorithm. You can achieve this with the `ignore` option:

```js
grunt.initConfig({
  responsive_images_extender: {
    ignoring: {
      options: {
        ignore: ['.icons', '#logo', 'figure img']
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

Please see this task's [Gruntfile](https://github.com/smaxtastic/grunt-responsive-images-extender/blob/master/Gruntfile.js) for more usage examples.

## Related Work

* **grunt-responsive-images**

  Use this [task](https://github.com/andismith/grunt-responsive-images/) to generate images with different sizes.

* **grunt-responsive-images-converter**

  This [task](https://github.com/miller/grunt-responsive-images-converter/) can be used to convert images in markdown files into a `<picture>` tag. Unfortunately, it is limited to markdown files. Also, read [here](http://blog.cloudfour.com/dont-use-picture-most-of-the-time/) why `<picture>` is not the smartest thing in most cases.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

*2.0.1*
* Switched to POSIX-compatible paths (thanks to [sprrw](https://github.com/sprrw))

*2.0.0*

* `srcset` is built automatically based on the image sizes read directly from the files. `x` descriptors are triggered for images with `width` attribute.
* Removed `srcset` and `srcsetRetina` option.
* Added the `srcAttribute` option to delete `src` for polyfills or set the smallest image as a fallback.
* Added the `srcsetAttributeName` option to use for example `data-srcset` for lazy loaders.
* Added the `%size%` placeholder to use the image size inside the `sizes` rules

*1.0.0*

* The `sizes` option allows users to specify multiple sizes for different selectors, for example for hero images, article images or icons.
* Added the `ignore` option.

*0.1.0*

* Initial commit and first version
