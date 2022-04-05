const fileoperations = require('../fileoperations.js');
const DependencyInstaller = require('./DependencyInstaller.js').DependencyInstaller;

class HTTPDependencyInstaller extends DependencyInstaller {
    constructor(dependency, placebo) {
        super(dependency, placebo);
    }

    installDependency() {
        const tarball = this.placebo.findByIntegrityHash(this.dependency.integrity);
        console.log("Install HTTP dependency: " + this.dependency.dependencyName + " from: " + tarball);
        fileoperations.unpackFile(tarball, this.dependency.dependencyName);
    }

    adjustDependencyPackageJSON(packageObj) {
        packageObj._from = this.dependency.dependencyName + "@" + this.dependency.version;
        packageObj._integrity = this.dependency.integrity;
        packageObj._resolved = this.dependency.version;
    }
}

exports.HTTPDependencyInstaller = HTTPDependencyInstaller;
