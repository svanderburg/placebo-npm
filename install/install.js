var PackageLock = require('../packagelockmodel/PackageLock.js').PackageLock;
var Placebo = require('./Placebo.js').Placebo;
var DependencyInstallVisitor = require('./visitor/DependencyInstallVisitor.js').DependencyInstallVisitor;
var ChildDependenciesVisitor = require('./visitor/ChildDependenciesVisitor.js').ChildDependenciesVisitor;

exports.installDependenciesFromPlacebo = function(packagePlaceboFile, packageLockFile, production, callback) {
    var placebo = new Placebo(packagePlaceboFile);
    var packageLock = new PackageLock(packageLockFile);

    packageLock.visitAllDependencies(production, new DependencyInstallVisitor(placebo), new ChildDependenciesVisitor(), callback);
};
