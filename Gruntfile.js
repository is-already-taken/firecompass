/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		test: {
			files: ['test/**/*.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint test'
		},

		jshint: {
			all: ['grunt.js', 'chrome/**/*.js', 'defaults/**/*.js', 'specs/**/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				esnext: true,	// To recognize e.g. const
				globals: {
					// Defined by Firebug
					Firebug: true,
					define: true,
					// Debined by Firefox
					pref: true,
					Components: true,
					// In mocks and specs
					console: true,
					require: true,
					// Jasmine
					describe: true,
					expect: true,
					it: true
				}
			}
		},

		compress: {
			zip: {
				options: {
					mode: "zip"
				},
				files: {
					"dist/<%= pkg.xpiName || pkg.name %>-v<%= pkg.version %>.xpi": [
						"chrome/**/*.js",
						"defaults/**/*.js",
						"skin/**/*.js",
						"install.rdf",
						"LICENSE.MIT",
						"chrome.manifest",
						"readme.md"
					]
				}
			}
		},

		copy: {
			// replace placeholders
			install: {
				options: {
					processContent: grunt.template.process
				},

				files: {
					'install.rdf': 'install.rdf.tpl'
				}
			}
		}
	
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['jshint', 'copy']);
	grunt.registerTask('dist', ['default', 'compress']);

};
