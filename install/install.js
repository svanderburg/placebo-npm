const PackageLock = require('../packagelockmodel/PackageLock.js').PackageLock;
const Placebo = require('./Placebo.js').Placebo;
const DependencyInstallVisitor = require('./visitor/DependencyInstallVisitor.js').DependencyInstallVisitor;
const ChildDependenciesVisitor = require('./visitor/ChildDependenciesVisitor.js').ChildDependenciesVisitor;

exports.installDependenciesFromPlacebo = async function(packagePlaceboFile, packageLockFile, production) {
    const placebo = new Placebo(packagePlaceboFile);
    const packageLock = new PackageLock(packageLockFile);

    return packageLock.visitAllDependencies(production, new DependencyInstallVisitor(placebo), new ChildDependenciesVisitor());
};
