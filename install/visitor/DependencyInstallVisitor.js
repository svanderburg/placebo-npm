const RegistryDependencyInstaller = require('../installer/RegistryDependencyInstaller.js').RegistryDependencyInstaller;
const DirectoryDependencyInstaller = require('../installer/DirectoryDependencyInstaller.js').DirectoryDependencyInstaller;
const GitDependencyInstaller = require('../installer/GitDependencyInstaller.js').GitDependencyInstaller;
const HTTPDependencyInstaller = require('../installer/HTTPDependencyInstaller.js').HTTPDependencyInstaller;
const LocalFileDependencyInstaller = require('../installer/LocalFileDependencyInstaller.js').LocalFileDependencyInstaller;

class DependencyInstallVisitor {
    constructor(placebo) {
        this.placebo = placebo;
    }

    async visitRegistryDependency(dependency) {
        new RegistryDependencyInstaller(dependency, this.placebo).install();
    }

    async visitDirectoryDependency(dependency) {
        new DirectoryDependencyInstaller(dependency, this.placebo).install();
    }

    async visitGitDependency(dependency) {
        new GitDependencyInstaller(dependency, this.placebo).install();
    }

    async visitHTTPDependency(dependency) {
        new HTTPDependencyInstaller(dependency, this.placebo).install();
    }

    async visitLocalFileDependency(dependency) {
        new LocalFileDependencyInstaller(dependency, this.placebo).install();
    }
}

exports.DependencyInstallVisitor = DependencyInstallVisitor;
