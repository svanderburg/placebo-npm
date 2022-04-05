const fs = require('fs');
const path = require('path');
const Dependency = require('./dependency/Dependency.js').Dependency;
const util = require('./util.js');

function dependencyShouldBeInstalled(config, production) {
    return !config.bundled && (!config.dev || (!production && config.dev));
}

class PackageLock {
    constructor(packageLockJSON) {
        this.lockObj = JSON.parse(fs.readFileSync(packageLockJSON));

        if(!this.lockObj.lockfileVersion) {
            throw new Exception("The lockfile version cannot be detected!");
        }

        if(!this.lockObj.lockfileVersion > 2) {
            throw new Exception("Lockfile version: " + this.lockObj.lockfileVersion + " is unsupported!");
        }
    }

    async visitDependencies(dependencies, production, dependencyVisitor, childDependenciesVisitor) {
        if(util.isObject(dependencies)) {
            // Install the direct dependencies of the package

            for(const dependencyName in dependencies) {
                const config = dependencies[dependencyName];

                if(dependencyShouldBeInstalled(config, production)) {
                    const dependency = Dependency.createDependencyFromConfig(dependencyName, config);
                    await dependency.accept(dependencyVisitor);
                }
            }

            // Install transitive dependencies

            for(const dependencyName in dependencies) {
                const config = dependencies[dependencyName];

                if(dependencyShouldBeInstalled(config, production)) {
                    childDependenciesVisitor.openChildDependencies(dependencyName);
                    await this.visitDependencies(config.dependencies, false, dependencyVisitor, childDependenciesVisitor); // According to the spec, we must always install transitive development dependencies
                    childDependenciesVisitor.leaveChildDependencies(dependencyName);
                }
            }
        }
    }

    async visitAllDependencies(production, dependencyVisitor, childDependenciesVisitor) {
        return this.visitDependencies(this.lockObj.dependencies, production, dependencyVisitor, childDependenciesVisitor);
    }
}

exports.PackageLock = PackageLock;
