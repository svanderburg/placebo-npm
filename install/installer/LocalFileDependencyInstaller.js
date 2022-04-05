const path = require('path');
const fileoperations = require('../fileoperations.js');
const DependencyInstaller = require('./DependencyInstaller.js').DependencyInstaller;

class LocalFileDependencyInstaller extends DependencyInstaller {
    constructor(dependency, placebo) {
        super(dependency, placebo);
    }

    installDependency() {
        const tarball = this.placebo.findByIntegrityHash(this.dependency.integrity);
        this.absolutePath = path.resolve(tarball); // We must memorize the absolute path to pass it as metadata to the package.json
        console.log("Install local file dependency: " + this.dependency.dependencyName + " from: "+ tarball);
        fileoperations.unpackFile(tarball, this.dependency.dependencyName);
    }

    adjustDependencyPackageJSON(packageObj) {
        packageObj._from = this.dependency.version;
        packageObj._integrity = this.dependency.integrity;
        packageObj._resolved = this.absolutePath;
    }
}

exports.LocalFileDependencyInstaller = LocalFileDependencyInstaller;
