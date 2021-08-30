var path = require('path');
var fileoperations = require('../fileoperations.js');
var DependencyInstaller = require('./DependencyInstaller.js').DependencyInstaller;
var inherit = require('../../packagelockmodel/dependency/inherit.js').inherit;

function LocalFileDependencyInstaller(dependency, placebo) {
    DependencyInstaller.call(this, dependency, placebo);
}

/* LocalFileDependencyInstaller inherits from DependencyInstaller */
inherit(DependencyInstaller, LocalFileDependencyInstaller);

LocalFileDependencyInstaller.prototype.installDependency = function() {
    var tarball = this.placebo.findByIntegrityHash(this.dependency.integrity);
    this.absolutePath = path.resolve(tarball); // We must memorize the absolute path to pass it as metadata to the package.json
    console.log("Install local file dependency: " + this.dependency.dependencyName + " from: "+ tarball);
    fileoperations.unpackFile(tarball, this.dependency.dependencyName);
};

LocalFileDependencyInstaller.prototype.adjustDependencyPackageJSON = function(packageObj) {
    packageObj._from = this.dependency.version;
    packageObj._integrity = this.dependency.integrity;
    packageObj._resolved = this.absolutePath;
};

exports.LocalFileDependencyInstaller = LocalFileDependencyInstaller;
