const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const fileoperations = require('../fileoperations.js');
const DependencyInstaller = require('./DependencyInstaller.js').DependencyInstaller;

class DirectoryDependencyInstaller extends DependencyInstaller {
    constructor(dependency, placebo) {
        super(dependency, placebo);
    }

    installDependency() {
        const directory = this.placebo.findDirectoryCopyLink(this.dependency.version);
        const targetDir = path.join("placebo_node_dirs", this.dependency.dependencyName);

        console.log("Install directory dependency: "+ this.dependency.dependencyName + " by copying and symlinking to a placebo folder: " + directory);

        fileoperations.ensureDir("placebo_node_dirs");
        child_process.execFileSync("cp", ["-av", directory, targetDir]);
        child_process.execFileSync("chmod", ["-Rv", "u+w", targetDir]);

        fileoperations.ensureDir("node_modules");
        fs.symlinkSync(path.relative(path.join(process.cwd(), "node_modules"), targetDir), path.join("node_modules", this.dependency.dependencyName));
    }

    adjustProjectPackageJSON(packageObj) {
        if(packageObj.dependencies && packageObj.dependencies[this.dependency.dependencyName]) {
            packageObj.dependencies[this.dependency.dependencyName] = "./" + path.join("placebo_node_dirs", this.dependency.dependencyName);
        }

        if(packageObj.devDependencies && packageObj.devDependencies[this.dependency.dependencyName]) {
            packageObj.devDependencies[this.dependency.dependencyName] = "./" + path.join("placebo_node_dirs", this.dependency.dependencyName);
        }
    }
}

exports.DirectoryDependencyInstaller = DirectoryDependencyInstaller;
