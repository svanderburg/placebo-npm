var fileoperations = require('../fileoperations.js');
var DependencyInstaller = require('./DependencyInstaller.js').DependencyInstaller;
var inherit = require('../../packagelockmodel/dependency/inherit.js').inherit;

function RegistryDependencyInstaller(dependency, placebo) {
    DependencyInstaller.call(this, dependency, placebo);
}

/* RegistryDependencyInstaller inherits from DependencyInstaller */
inherit(DependencyInstaller, RegistryDependencyInstaller);

RegistryDependencyInstaller.prototype.installDependency = function() {
    var tarball = this.placebo.findByIntegrityHash(this.dependency.integrity);
    console.log("Install NPM registry dependency: " + this.dependency.dependencyName + " from: " + tarball);
    fileoperations.unpackFile(tarball, this.dependency.dependencyName);
};

RegistryDependencyInstaller.prototype.adjustDependencyPackageJSON = function(packageObj) {
    packageObj._from = this.dependency.dependencyName + "@" + this.dependency.resolved;
    packageObj._integrity = this.dependency.integrity;
    packageObj._resolved = this.dependency.resolved;
};

exports.RegistryDependencyInstaller = RegistryDependencyInstaller;
