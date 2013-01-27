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

//		connect: {
//			test: {
//				port: 9999
//			}
//		},

		jasmine: {
			src: "chrome/content/**/*.js",
			options: {
//				host: "http://127.0.0.1:9999/",
				specs: "specs/**/*_spec.js",
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {
					requireConfig: {
						baseUrl: "./",
						map: {
							"*": {
								"firecompass": "chrome/content",
								"firebug/lib/lib" : "FBL-MOCK",
								"firebug/lib/trace" : "FBTRACE-MOCK"
							}
						}

					}
				},
				helpers: [
					"node_modules/requirejs/require.js",
					"specs/mocks/*.js"
				]
			}

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
					"window": true, // when mocking Components
					Components: true,
					// In mocks and specs
					console: true,
					require: true,
					// Jasmine
					describe: true,
					expect: true,
					it: true,
					xit: true
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
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.registerTask('default', ['jshint', 'copy']);
	grunt.registerTask('dist', ['default', 'compress']);

};
