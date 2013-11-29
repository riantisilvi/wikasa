/**
 * Gruntfile for site wikasa
 * @author Rezki Bangsawan
 * @url https://github.com/rbangsawan/wikasa
 */

/**
 * [LIVERELOAD_PORT description]
 * @type {Number}
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  'use strict';

  /**
   * Dynamically load npm tasks.
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Initialize Grunt config object.
  grunt.initConfig({

    // Save NPM config file, so it can be read later from this Grunt.
    pkg: grunt.file.readJSON('package.json'),

    // Configurable paths and other variables. 
    config: {
      tstamp: '<%= grunt.template.today("ddmmyyyyhhMMss") %>',
      src: 'src',
      app: 'app',
      css: [
        '<%= config.src %>/scss/main.scss'
      ],
      js: [
        '<%= config.src %>/js/*.js'
      ]
    },

    /**
     * Project banner
     * Dynamically appended to CSS/JS files
     * Inherits text from package.json
     */
    tag: {
      banner: '/*!\n' +
        ' * <%= pkg.name %>\n' +
        ' * <%= pkg.url %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @version <%= pkg.version %>\n' +
        ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
        ' */\n'
    },


    /** ----------------------------------------------------------------- *\
     *  LiveReload related task.
     *    1. connect.
     ** ----------------------------------------------------------------- */


    /**
     * Connect port/livereload.
     * Start local server and inject livereload snippet.
     * @type  {Object}
     * @url   "https://github.com/gruntjs/grunt-contrib-connect"
     */
    connect: {
      options: {
        port: 9000,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, 'app')];
          }
        }
      }
    },


    /** ----------------------------------------------------------------- *\
     *  JS related task.
     *    1. jshint.
     *    2. concat.
     *    3. uglify.
     ** ----------------------------------------------------------------- */


    /**
     * JSHint.
     * Manage the options inside .jshintrc file.
     * @url   "https://github.com/gruntjs/grunt-contrib-jshint"
     */
    jshint: {
      files: ['src/js/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    /**
     * Concatenate JavaScript files.
     * Imports all .js files and appends project banner.
     * @url   "https://github.com/gruntjs/grunt-contrib-concat"
     */
    concat: {
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      },
      dev: {
        files: {
          '<%= config.app %>/js/main.min.js': '<%= config.js %>'
        }
      }
    },


    /**
     * Uglify (minify) JavaScript files
     * Compresses and minifies all JavaScript files into one
     * @url   "https://github.com/gruntjs/grunt-contrib-uglify"
     */
    uglify: {
      options: {
        banner: "<%= tag.banner %>"
      },
      dist: {
        files: {
          '<%= config.app %>/js/main.min.js': '<%= config.js %>'
        }
      }
    },


    /** ----------------------------------------------------------------- *\
     *  CSS related task.
     *    1. sass.
     *    2. csslint.
     ** ----------------------------------------------------------------- */


    /**
     * Compile Sass/Scss
     * @type  {Object}
     * @url   "https://github.com/gruntjs/grunt-contrib-sass"
     * @todo  "Better options maybe?"
     */
    sass: {
      dev: {
        options: {
          style: 'expanded',
          compass: true,
          // debugInfo: true,
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= config.app %>/css/main.css': '<%= config.css %>'
        }
      },
      dist: {
        options: {
          style: 'compressed',
          compass: true,
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= config.app %>/css/main.min.css': '<%= config.css %>'
        }
      }
    },


    /**
     * List CSS.
     * @type {Object}
     * @url "https://github.com/gruntjs/grunt-contrib-csslint"
     */
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      strict: {
        options: {},
        src: ['<% config.app %>/css/*.css']
      },
      lax: {
        options: {}
      }
    },


    /** ----------------------------------------------------------------- *\
     *  Local Server related task.
     *    1. open.
     *    2. watch.
     ** ----------------------------------------------------------------- */


    /**
     * Opens the web server in the browser
     * @type {Object}
     * @url   "https://github.com/jsoverson/grunt-open"
     */
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },


    /**
     * Runs tasks against changed watched files.
     * Watching development files and run concat/compile tasks.
     * Livereload the browser once complete.
     * @type {Object}
     * @url   "https://github.com/gruntjs/grunt-contrib-watch"
     */
    watch: {
      concat: {
        files: '<%= config.src %>/js/{,*/}*.js',
        tasks: ['concat:dev', 'jshint']
      },
      sass: {
        files: '<%= config.src %>/scss/{,**/}*.{scss,sass}',
        tasks: ['sass:dev']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= config.app %>/index.html',
          '<%= config.app %>/css/*.css',
          '<%= config.app %>/js/{,*/}*.js',
          '<%= config.app %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }

  });

  /** --------------------------------------------------------------------- *\
   *  Grunt Task.
   *  Default (Dev) grunt task, call by typing "grunt" on command line.
   ** --------------------------------------------------------------------- */
  grunt.registerTask('default', [
    'sass:dev',
    'csslint',
    // 'jshint',
    // 'concat:dev',
    'connect:livereload',
    'open',
    'watch'
  ]);

  /** --------------------------------------------------------------------- *\
   *  Grunt Task.
   *  Production grunt task, call by typing "grunt dist" on command line.
   ** --------------------------------------------------------------------- */
  grunt.registerTask('dist', []);

};
