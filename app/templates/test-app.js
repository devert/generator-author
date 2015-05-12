'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('<%= generatorName %>:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../<%= prefix %>app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on('end', done);
  });
});

describe('file creation', function () {
  it('should generate .editorconfig', function () {
    assert.file('.editorconfig');
  });
});

describe('directory creation', function () {
  it('should generate a test directory', function () {
    assert.file('test/');
  });
});
