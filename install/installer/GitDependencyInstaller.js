var fileoperations = require('../fileoperations.js');
var DependencyInstaller = require('./DependencyInstaller.js').DependencyInstaller;
var inherit = require('../../packagelockmodel/dependency/inherit.js').inherit;

function GitDependencyInstaller(dependency, placebo) {
    DependencyInstaller.call(this, dependency, placebo);
}

/* GitDependencyInstaller inherits from DependencyInstaller */
inherit(DependencyInstaller, GitDependencyInstaller);

GitDependencyInstaller.prototype.installDependency = function() {
    var directory = this.placebo.findByVersion(this.dependency.version);
    console.log("Install Git dependency: " + this.dependency.dependencyName + " with copy from: " + directory);
    fileoperations.copyDirectory(directory, this.dependency.dependencyName);
};

GitDependencyInstaller.prototype.adjustDependencyPackageJSON = function(packageObj) {
    packageObj._from = this.dependency.from;
    packageObj._integrity = "";
    packageObj._resolved = this.dependency.version;
};

exports.GitDependencyInstaller = GitDependencyInstaller;
