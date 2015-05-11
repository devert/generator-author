'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var mockery = require('mockery');

describe('generator:app', function () {
  before(function () {
    mockery.enable({warnOnUnregistered: false});
    mockery.registerMock('github', function () {
      return {
        user: {
          getFrom: function (data, cb) {
            cb(null, JSON.stringify({
              name: 'Tyrion Lannister',
              email: 'imp@casterlyrock.com',
              htmlUrl: 'https://github.com/imp'
            }));
          }
        }
      };
    });

    mockery.registerMock('superb', function () {
      return 'cat\'s meow';
    });

    mockery.registerMock('npm-name', function (name, fn) {
      fn(null, true);
    });
  });

  after(function () {
    mockery.disable();
  });

  describe('defaults', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          githubUser: 'imp',
          generatorName: 'temp',
          pkgName: false
        })
        .on('end', done);
    });

    it('creates files', function () {
      var expected = [
        '.yo-rc.json',
        '.gitignore',
        '.gitattributes',
        '.eslintrc',
        'generators/app/index.js',
        'generators/app/templates/_package.json',
        'generators/app/templates/_travis.json',
        'generators/app/templates/editorconfig',
        'generators/app/templates/eslintrc',
        'generators/app/templates/gitattributes',
        'generators/app/templates/gitignore',
        'generators/app/templates/README.md',
        'generators/app/templates/test-app.js'
      ];

      assert.file(expected);
    });

    it('fills package.json with correct information', function () {
      assert.fileContent('package.json', /"name": "generator-temp"/);
    });

    it('updates package.json file array', function () {
      var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      assert.equal(pkg.files[0], 'generators');
    });

    it('sets up travis.CI config', function () {
      assert.fileContent(
        '.travis.yml',
        /node_js/
      );
    });

    it('escapes possible apostrophes from superb in index.js', function () {
      assert.fileContent('generators/app/index.js', /Welcome to the cat\\'s meow/);
    });
  });

  describe('--flat', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({
          flat: true
        })
        .withPrompts({
          githubUser: 'imp',
          generatorName: 'temp',
          pkgName: false
        })
        .on('end', done);
    });

    it('creates flat files structure', function () {
      assert.file([
        'app/index.js',
        'app/templates/_package.json',
        'app/templates/eslintrc',
        'app/templates/editorconfig'
      ]);
    });

    it('updates package.json file array', function () {
      var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      assert.equal(pkg.files[0], 'app');
    });
  });
});