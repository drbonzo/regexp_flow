/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({

		// Metadata:
		pkg: grunt.file.readJSON('package.json'),
		banner: "/**\n" +
			" * RegexpFlow\n" +
			" * version: <%= pkg.version %>\n" +
			" * www: https://github.com/drbonzo/regexp_flow\n" +
			" * author: dr_bonzo\n" +
			"*/\n",


		// Task configuration:
		env: {
			options: {
				/* Shared Options Hash */
				//globalOption : 'foo'
			},
			dev: {
				NODE_ENV: 'DEVELOPMENT',
				distDir: 'dist-dev'
			},
			prod: {
				NODE_ENV: 'PRODUCTION',
				distDir: 'dist-prod'
			}
		},

		clean: {
			dev: {
				src: ['<%= env.dev.distDir %>']
			},
			prod: {
				src: ['<%= env.prod.distDir %>']
			}
		},

		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: ['src/js/*.js']
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/js/*.js']
			}
		},

		recess: {
			dev: {
				options: {
					compile: true,
					force: true
				},
				files: [
					{ src: 'src/css/app-<%= pkg.version %>.less', dest: '<%= env.dev.distDir %>/css/app-<%= pkg.version %>.css' }
				]
			},
			prod: {
				options: {
					compile: true,
					force: true
				},
				files: [
					{ src: ['src/css/app-<%= pkg.version %>.less' ], dest: '<%= env.prod.distDir %>/css/app-<%= pkg.version %>.css' }
				]
			},
			inline: {
				options: {
					compile: true,
					force: true
				},
				files: {
					'src/css/app.css': ['src/css/app.less']
				}
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dev: {
				// all JS files from src/ but without libs
				src: ['src/js/*.js'],
				dest: '<%= env.dev.distDir %>/js/<%= pkg.name %>-<%= pkg.version %>.js'
			},
			prod: {
				// all JS files from src/ but without libs
				src: ['src/js/*.js'],
				dest: '<%= env.prod.distDir %>/js/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				//  report only minification result, or report minification and gzip results. This is useful to see exactly how well Uglify is performing
				report: 'gzip',
				preserveComments: false,
				mangle: true
			},
			prod: {
				src: '<%= concat.prod.dest %>',
				dest: '<%= env.prod.distDir %>/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
			}
		},

		copy: {
			dev: {
				files: [
					// destination will be:
					// <%= env.dev.distDir %>/css/<%= src_expanded_paths %>
					{expand: true, cwd: 'src/css', src: ['bootstrap-*.css'], dest: '<%= env.dev.distDir %>/css/', filter: 'isFile'},
					{expand: true, cwd: 'src/css', src: ['*.css.map'], dest: '<%= env.dev.distDir %>/css/', filter: 'isFile'},
					{expand: true, cwd: 'src/js', src: ['lib/*.js'], dest: '<%= env.dev.distDir %>/js/', filter: 'isFile'},
					{expand: true, cwd: 'src/js', src: ['lib/*/*.js'], dest: '<%= env.dev.distDir %>/js/', filter: 'isFile'},
					{expand: true, cwd: 'src/fonts', src: ['*'], dest: '<%= env.dev.distDir %>/fonts/', filter: 'isFile'},
					{expand: true, cwd: 'src/backend', src: ['*'], dest: '<%= env.dev.distDir %>/backend/', filter: 'isFile'},
					{expand: true, cwd: 'src/', src: ['*.html'], dest: '<%= env.dev.distDir %>/', filter: 'isFile'},
					{expand: true, cwd: 'src/partials/', src: ['*.html'], dest: '<%= env.dev.distDir %>/partials', filter: 'isFile'},
					// dev only files:
					{expand: true, cwd: 'src/js', src: ['*.js'], dest: '<%= env.dev.distDir %>/js/', filter: 'isFile'}
				]
			},
			prod: {
				files: [
					// destination will be:
					// <%= env.prod.distDir %>/css/<%= src_expanded_paths %>
					{expand: true, cwd: 'src/css', src: ['bootstrap-*.css'], dest: '<%= env.prod.distDir %>/css/', filter: 'isFile'},
					{expand: true, cwd: 'src/css', src: ['*.css.map'], dest: '<%= env.prod.distDir %>/css/', filter: 'isFile'},
					{expand: true, cwd: 'src/js', src: ['lib/*.js'], dest: '<%= env.prod.distDir %>/js/', filter: 'isFile'},
					{expand: true, cwd: 'src/js', src: ['lib/*/*.js'], dest: '<%= env.prod.distDir %>/js/', filter: 'isFile'},
					{expand: true, cwd: 'src/fonts', src: ['*'], dest: '<%= env.prod.distDir %>/fonts/', filter: 'isFile'},
					{expand: true, cwd: 'src/backend', src: ['*'], dest: '<%= env.prod.distDir %>/backend/', filter: 'isFile'},
					{expand: true, cwd: 'src/', src: ['*.html'], dest: '<%= env.prod.distDir %>/', filter: 'isFile'},
					{expand: true, cwd: 'src/partials/', src: ['*.html'], dest: '<%= env.prod.distDir %>/partials', filter: 'isFile'}
				]
			}
		},

		preprocess: {
			options: {
				inline: true
			},

			dev: {
				options: {
					context: {
						development: true
					}
				},

				src: ['dist-dev/index.html']
			},

			prod: {
				options: {
					context: {
						development: false
					}
				},
				src: ['dist-prod/index.html']
			}
		},

		karma: {
			options: {
				configFile: 'karma.conf.js'
			},
			auto: {
				runnerPort: 9999,
				browsers: ['Chrome'],
				autoWatch: true // watches for changes and reruns karma. Do not mix with singleRun
			},
			full: {
				runnerPort: 9998, // so we can run autorefreshing karma on development
				singleRun: true, // run just one
				browsers: ['Chrome', 'Firefox', 'PhantomJS']
			}
		},

		watch: {
			recess: {
				files: 'src/css/*.less',
				tasks: ['recess:inline']
			}
		}
	});


	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-linter');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-recess');


	// CSS distribution task.
	grunt.registerTask('dist-prod', ['env:prod', 'karma:full', 'jshint', 'clean:prod', 'recess:prod', 'concat:prod', 'uglify:prod', 'copy:prod', 'preprocess:prod']);
	grunt.registerTask('dist-dev', ['env:dev', 'karma:full', 'jshint', 'clean:dev', 'recess:dev', 'concat:dev', /* 'uglify:dev', */ 'copy:dev', 'preprocess:dev']);
	grunt.registerTask('clean-all', ['clean:prod', 'clean:dev']);
	grunt.registerTask('dist-all', ['dist-prod', 'dist-dev'/*, 'dist-staging'*/]);
	grunt.registerTask('auto-refresh', ['watch:recess']); // registered task must have name different than 'watch'
	grunt.registerTask('default', ['jshint']);

	/*
	CSS: less files include themselves - so there is always just one CSS file.
	JS: development uses many uncompressed files, production concats them
	*/
};