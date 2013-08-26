/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
              '* RegexpFlow - dr_bonzo\n' +
              '*/\n',

    // Task configuration.
    clean: {
      dist: ['dist']
    },

    recess: {
      options: {
        compile: true
      },
      bootstrap: {
        src: ['css/app.less'],
        dest: 'css/app.css'
      },
    },

    watch: {
      recess: {
        files: 'css/*.less',
        tasks: ['recess']
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  grunt.registerTask('default', ['dist-css']);

};