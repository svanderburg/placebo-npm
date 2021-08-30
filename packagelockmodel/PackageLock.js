var fs = require('fs');
var path = require('path');
var slasp = require('slasp');
var Dependency = require('./dependency/Dependency.js').Dependency;
var util = require('./util.js');

function PackageLock(packageLockJSON) {
    this.lockObj = JSON.parse(fs.readFileSync(packageLockJSON));

    if(!this.lockObj.lockfileVersion) {
        throw new Exception("The lockfile version cannot be detected!");
    }

    if(!this.lockObj.lockfileVersion > 2) {
        throw new Exception("Lockfile version: " + this.lockObj.lockfileVersion + " is unsupported!");
    }
}

function dependencyShouldBeInstalled(config, production) {
    return !config.bundled && (!config.dev || (!production && config.dev));
}

PackageLock.prototype.visitDependencies = function(dependencies, production, dependencyVisitor, childDependenciesVisitor, callback) {
    var self = this;

    if(util.isObject(dependencies)) {
        slasp.sequence([
            function(callback) {
                // Install the direct dependencies of the package

                slasp.fromEach(function(callback) {
                    callback(null, dependencies);
                }, function(dependencyName, callback) {
                    var config = dependencies[dependencyName];

                    if(dependencyShouldBeInstalled(config, production)) {
                        var dependency = Dependency.createDependencyFromConfig(dependencyName, config);
                        dependency.accept(dependencyVisitor, callback);
                    } else {
                        callback();
                    }
                }, callback);
            },

            function(callback) {
                // Install transitive dependencies

                slasp.fromEach(function(callback) {
                    callback(null, dependencies);
                }, function(dependencyName, callback) {
                    var config = dependencies[dependencyName];

                    if(dependencyShouldBeInstalled(config, production)) {
                        childDependenciesVisitor.openChildDependencies(dependencyName);

                        slasp.sequence([
                             function(callback) {
                                  self.visitDependencies(config.dependencies, false, dependencyVisitor, childDependenciesVisitor, callback); // According to the spec, we must always install transitive development dependencies
                             },

                             function(callback) {
                                  childDependenciesVisitor.leaveChildDependencies(dependencyName);
                                  callback();
                             }
                         ], callback);
                    } else {
                        callback();
                    }
                }, callback);
            }
        ], callback);
    } else {
        callback();
    }
};

PackageLock.prototype.visitAllDependencies = function(production, dependencyVisitor, childDependenciesVisitor, callback) {
    this.visitDependencies(this.lockObj.dependencies, production, dependencyVisitor, childDependenciesVisitor, callback);
};

exports.PackageLock = PackageLock;
