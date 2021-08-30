var RegistryDependencyInstaller = require('../installer/RegistryDependencyInstaller.js').RegistryDependencyInstaller;
var DirectoryDependencyInstaller = require('../installer/DirectoryDependencyInstaller.js').DirectoryDependencyInstaller;
var GitDependencyInstaller = require('../installer/GitDependencyInstaller.js').GitDependencyInstaller;
var HTTPDependencyInstaller = require('../installer/HTTPDependencyInstaller.js').HTTPDependencyInstaller;
var LocalFileDependencyInstaller = require('../installer/LocalFileDependencyInstaller.js').LocalFileDependencyInstaller;

function DependencyInstallVisitor(placebo) {
    this.placebo = placebo;
}

DependencyInstallVisitor.prototype.visitRegistryDependency = function(dependency, callback) {
    new RegistryDependencyInstaller(dependency, this.placebo).install();
    callback();
};

DependencyInstallVisitor.prototype.visitDirectoryDependency = function(dependency, callback) {
    new DirectoryDependencyInstaller(dependency, this.placebo).install();
    callback();
};

DependencyInstallVisitor.prototype.visitGitDependency = function(dependency, callback) {
    new GitDependencyInstaller(dependency, this.placebo).install();
    callback();
};

DependencyInstallVisitor.prototype.visitHTTPDependency = function(dependency, callback) {
    new HTTPDependencyInstaller(dependency, this.placebo).install();
    callback();
};

DependencyInstallVisitor.prototype.visitLocalFileDependency = function(dependency, callback) {
    new LocalFileDependencyInstaller(dependency, this.placebo).install();
    callback();
};

exports.DependencyInstallVisitor = DependencyInstallVisitor;
