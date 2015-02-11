var url = require('url');
var fs = require('fs');
var path = require('path');


/* jshint -W106 */
var proxy = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy ||
  process.env.HTTPS_PROXY || null;
/* jshint +W106 */


var githubOptions = {
  version: '3.0.0'
};

if (proxy) {
  var proxyUrl = url.parse(proxy);
  githubOptions.proxy = {
    host: proxyUrl.hostname,
    port: proxyUrl.port
  };
}

var GitHubApi = require('github');
var github = new GitHubApi(githubOptions);

if (process.env.GITHUB_TOKEN) {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_TOKEN
  });
}


//var emptyGithubRes = {
//  name: '',
//  email: '',
//  login: '',  // 登录名
//  html_url: '' // 主页 https://github.com/[login]
//};


var getGithubUserInfo = function (name, cb) {
  github.user.getFrom({
    user: name
  }, function(err, res) {
    if (err) {
      cb(err, res);
    } else {
      cb(err, JSON.parse(JSON.stringify(res)));
    }
  });
};


var walk = function(dir) {
  var ret = [];

  fs.readdirSync(dir).forEach(function(file) {
    file = dir + path.sep + file;
    var stat = fs.statSync(file);
    if (stat.isFile()) {
      ret.push(file);
    } else if (stat.isDirectory()) {
      ret = ret.concat(walk(file));
    }
  });

  return ret;
};



module.exports = {
  getGithubUserInfo: getGithubUserInfo,
  walk: walk,
  slug: function(str) {
    return str.replace(/[^\w]+(\w)?/g, function(m) {
      return m[1] ? m[1].toUpperCase() : '';
    })
  }
};