module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					sourcemap: 'none'
				},
				files: [{
					expand: true,
					cwd: 'src/sass',
					src: ['**/*.scss'],
					dest: 'build/css',
					ext: '.css'
			}]
			}
		},
		postcss: { 
			options: {
				map: false,
			},
			dist: {
				src: 'build/css/*.css',
			}
		},
		uglify: { 
			build: {
				src: ['src/js/*.js'],
				dest: 'js/script.min.js'
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'build/css',
					src: ['*.css', '!*.min.css'],
					dest: 'css',
					ext: '.min.css'
				}]
			}
		},
		watch: { // Compile everything into one task with Watch Plugin
			css: {
				files: 'src/**/*.scss',
				tasks: ['sass', 'postcss', 'cssmin']
			},
			js: {
				files: 'src/**/*.js',
				tasks: ['uglify']
			}
		}

	});
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Register Grunt tasks
	// grunt.registerTask('default', ['sass','postcss','cssmin','uglify']);
	grunt.registerTask('default', ['watch']);
}
