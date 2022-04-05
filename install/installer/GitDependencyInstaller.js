const fileoperations = require('../fileoperations.js');
const DependencyInstaller = require('./DependencyInstaller.js').DependencyInstaller;

class GitDependencyInstaller extends DependencyInstaller {
    constructor(dependency, placebo) {
        super(dependency, placebo);
    }

    installDependency() {
        const directory = this.placebo.findByVersion(this.dependency.version);
        console.log("Install Git dependency: " + this.dependency.dependencyName + " with copy from: " + directory);
        fileoperations.copyDirectory(directory, this.dependency.dependencyName);
    }

    adjustDependencyPackageJSON(packageObj) {
        packageObj._from = this.dependency.from;
        packageObj._integrity = "";
        packageObj._resolved = this.dependency.version;
    }
}

exports.GitDependencyInstaller = GitDependencyInstaller;
