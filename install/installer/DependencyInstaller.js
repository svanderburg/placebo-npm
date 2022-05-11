const fs = require('fs');
const path = require('path');

class DependencyInstaller {
    constructor(dependency, placebo) {
        this.dependency = dependency;
        this.placebo = placebo;
    }

    installDependency() {
        throw new Error("DependencyInstaller::installDependency is abstract");
    }

    adjustProjectPackageJSON(packageObj) {
    }

    adjustDependencyPackageJSON(packageObj) {
    }

    install() {
        this.installDependency();

        // Modify the project package.json
        let packageObj = JSON.parse(fs.readFileSync("package.json"));
        this.adjustProjectPackageJSON(packageObj);
        fs.writeFileSync("package.json", JSON.stringify(packageObj, null, 2));

        // Modify the dependency package.json
        const packageJSONPath = path.join("node_modules", this.dependency.dependencyName, "package.json");
        packageObj = JSON.parse(fs.readFileSync(packageJSONPath));
        this.adjustDependencyPackageJSON(packageObj);
        fs.writeFileSync(packageJSONPath, JSON.stringify(packageObj, null, 2));
    }
}

exports.DependencyInstaller = DependencyInstaller;
