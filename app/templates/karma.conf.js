// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function(config) {


  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // 会默认加载所有 karma 开头的插件，不用指定
    //plugins: [
    //  'karma-coverage'
    //],

    // http://karma-runner.github.io/0.12/config/files.html
    files: [
      'src/**/*.js',
      'test/spec/**/*Spec.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9783,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/**/*.js': ['6to5', 'coverage']
    },
    '6to5Preprocessor': {
      options: {
        sourceMap: 'inline'
      }
    },

    coverageReporter: {
      dir: 'test/coverage/',
      reporters: [
        { type: 'lcov' },
        { type: 'text-summary' }
      ]
    },



    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
