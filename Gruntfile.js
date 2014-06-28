'use strict';

var serverRootUri = 'http://127.0.0.1:8000';
var mochaPhantomJsTestRunner = serverRootUri + '/test/testrunner.html';

/* jshint -W106 */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
      	'index.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // run the mocha tests via Node.js
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    // remove all previous browserified builds
    clean: {
      dist: ['./browser/dist/**/*'],
      tests: ['./browser/test/browserified_tests.js'],
    },

    // browserify everything
    browserify: {
      // build the tests
      tests: {
        src: [ 'test/test.js' ],
        dest: 'test/browserified_tests.js',
        options: {
          bundleOptions : {
          	debug : true
          }
        }
      }
    },

    connect: {
      // Used for mocha-phantomjs tests
      server: {},

      // you can use this manually by doing
      // grunt connect:keepalive
      // to start a server for the example pages (browser/example/*.html) or to
      // run the tests manually in a browser
      keepalive: {
        options: {
          keepalive: true
        }
      }
    },

    // run the mocha tests in the browser via PhantomJS
    'mocha_phantomjs': {
      all: ['test/testrunner.html']
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['default']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask("test", ["jshint", "browserify", "mocha_phantomjs"]);

}
