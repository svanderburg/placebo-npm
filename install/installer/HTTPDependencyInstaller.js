var fileoperations = require('../fileoperations.js');
var DependencyInstaller = require('./DependencyInstaller.js').DependencyInstaller;
var inherit = require('../../packagelockmodel/dependency/inherit.js').inherit;

function HTTPDependencyInstaller(dependency, placebo) {
    DependencyInstaller.call(this, dependency, placebo);
}

/* HTTPDependencyInstaller inherits from DependencyInstaller */
inherit(DependencyInstaller, HTTPDependencyInstaller);

HTTPDependencyInstaller.prototype.installDependency = function() {
    var tarball = this.placebo.findByIntegrityHash(this.dependency.integrity);
    console.log("Install HTTP dependency: " + this.dependency.dependencyName + " from: " + tarball);
    fileoperations.unpackFile(tarball, this.dependency.dependencyName);
};

HTTPDependencyInstaller.prototype.adjustDependencyPackageJSON = function(packageObj) {
    packageObj._from = this.dependency.dependencyName + "@" + this.dependency.version;
    packageObj._integrity = this.dependency.integrity;
    packageObj._resolved = this.dependency.version;
};

exports.HTTPDependencyInstaller = HTTPDependencyInstaller;
