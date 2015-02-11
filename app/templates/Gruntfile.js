

module.exports = function(grunt) {

  require('jit-grunt')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    '6to5': {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'dist'
        }]
      }
    },

    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['**/*.js'],
          ext: '.min.js',
          dest: 'dist'
        }]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: ['dist/**/*.*']
        }]
      }
    },

    watch: {
      hintAndTest: {
        files: '<%= jshint.all %>',
        tasks: ['newer:jshint:all', 'karma:unit']
      },
      hintOthers: {
        files: '<%= jshint.others %>',
        tasks: ['newer:jshint:all']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'src/**/*.js',
        'test/spec/**/*.js'
      ],
      others: [ '*.js' ]
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        logLevel: 'ERROR',
        autoWatch: false
      }
    }
  });

  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('build', ['clean:dist', '6to5:dist', 'uglify:dist']);

};