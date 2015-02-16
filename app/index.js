'use strict';
var yeoman = require('yeoman-generator');
var yoHelper = require('yo-helper');

module.exports = yeoman.generators.Base.extend({
  //initializing: function () {
  //  this.targetDir = this.destinationRoot();
  //  this.tplDir = this.sourceRoot();
  //  this.pkg = require('../package.json');
  //},

  prompting: {
    welcome: yoHelper.welcome(),

    askForModuleName: yoHelper.askForModuleName(function(data) {
      this.slugname = this.moduleName = data.moduleName;
    }),

    askForGithubUser: yoHelper.askForGithubUser(function(data) {
      this.githubUser = data;
    }),

    askForModuleInfo: function() {
      var done = this.async();

      var prompts = [{
        name: 'description',
        message: 'Description',
        default: 'The best module ever.'
      },{
        name: 'version',
        message: 'Version',
        default: '0.0.0'
      }, {
        name: 'license',
        message: 'License',
        default: 'MIT'
      }, {
        type: 'confirm',
        name: 'skipInstall',
        message: 'Do you need skip npm install?',
        default: false
      }];

      this.prompt(prompts, function(answers) {
        this.answers = answers;
        done();
      }.bind(this));
    }
  },

  configuring: function() {
    var cfg = {srcDir: 'src'};
    cfg.slugname = this.slugname;
    this.config.set(cfg);
  },

  writing: yoHelper.writing(),

  install: function () {
    var skip = this.answers['skipInstall'] || this.options['skip-install'];

    this.installDependencies({
      skipInstall: skip
    });
  }
});
