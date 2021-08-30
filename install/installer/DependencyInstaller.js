var fs = require('fs');
var path = require('path');

function DependencyInstaller(dependency, placebo) {
    this.dependency = dependency;
    this.placebo = placebo;
}

DependencyInstaller.prototype.installDependency = function() {
    throw new Error("DependencyInstaller::installDependency is abstract");
};

DependencyInstaller.prototype.adjustProjectPackageJSON = function(packageObj) {
};

DependencyInstaller.prototype.adjustDependencyPackageJSON = function(packageObj) {
};

DependencyInstaller.prototype.install = function() {
    this.installDependency();

    // Modify the project package.json
    var packageObj = JSON.parse(fs.readFileSync("package.json"));
    this.adjustProjectPackageJSON(packageObj);
    fs.writeFileSync("package.json", JSON.stringify(packageObj, null, 2));

    // Modify the dependency package.json
    var packageJSONPath = path.join("node_modules", this.dependency.dependencyName, "package.json");
    var packageObj = JSON.parse(fs.readFileSync(packageJSONPath));
    this.adjustDependencyPackageJSON(packageObj);
    fs.writeFileSync(packageJSONPath, JSON.stringify(packageObj, null, 2));
};

exports.DependencyInstaller = DependencyInstaller;
