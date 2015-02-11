'use strict';
var yeoman = require('yeoman-generator'),
  npmName = require('npm-name'),
  path = require('path'),
  url = require('url'),
  chalk = require('chalk'),
  yosay = require('yosay'),
  mkdirpSync = require('mkdirp').sync,
  Helper = require('./helper');


module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.targetDir = this.destinationRoot();
    //this.targetDir = process.cwd();
    //this.tplDir = path.join(__dirname, 'templates');
    this.tplDir = this.sourceRoot();
    this.pkg = require('../package.json');
  },

  prompting: {
    askForBasic: function() {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the lovely ' + chalk.red('node-6to5') + ' generator!'
      ));
    },

    askForModuleName: function() {
      var done = this.async();
      this.prompt([{
        name: 'moduleName',
        message: 'Module Name:',
        default: path.basename(process.cwd())
      }, {
        type: 'confirm',
        name: 'moduleNameConfirm',
        message: 'The name above already exists on npm, choose another?',
        default: true,
        when: function(answers) {
          var done = this.async();
          npmName(Helper.slug(answers.moduleName), function (err, available) {
            if (available || err) {
              done(false);
              return ;
            }
            done(true);
          }.bind(this));
        }
      }], function(anwsers) {
        if (anwsers.moduleNameConfirm) {
          return this.prompting.askForModuleName.call(this);
        }
        this.slugname = Helper.slug(anwsers.moduleName);
        done();
      }.bind(this));
    },

    askForGithubUser: function() {
      var done = this.async();
      var githubUser = null;

      this.prompt([{
        name: 'githubUser',
        message: 'Your username on GitHub:',
        default: 'someuser'
      }, {
        type: 'confirm',
        name: 'githubUserConfirm',
        message: 'The name above not exists on github, choose another?',
        default: true,
        when: function(answers) {
          var done = this.async();
          Helper.getGithubUserInfo(answers.githubUser, function(err, data) {
            if (err) {
              done(true);
            } else {
              githubUser = data;
              done(false);
            }
          }.bind(this));
        }
      }], function(anwsers) {
        if (anwsers.githubUserConfirm) {
          return this.prompting.askForGithubUser.call(this);
        }

        if (!githubUser) {
          console.log(chalk.red('I need your github info to proceed'));
          process.exit();
        }
        this.githubUser = githubUser;
        done();
      }.bind(this));
    },

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

  writing: function() {
    var dirCreateMap = {};

    Helper.walk(this.tplDir).forEach(function(file) {
      file = file.replace(this.tplDir + path.sep, '');

      var dir = path.dirname(file);
      var base = path.basename(file);

      if (dir !== '.' && !dirCreateMap[dir]) {
        dirCreateMap[dir] = true;
        mkdirpSync(path.join(this.targetDir, dir));
      }

      var target = file.replace(/\._tpl$/, '');  // 去掉 ._tpl 的后缀

      if (target !== file) {
        this.template(file, target);
      } else {
        this.copy(file, file);
      }

    }.bind(this));
  },

  install: function () {
    var skip = this.answers['skipInstall'] || this.options['skip-install'];

    this.installDependencies({
      skipInstall: skip
    });
  }
});
