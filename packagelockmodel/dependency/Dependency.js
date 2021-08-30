function Dependency(dependencyName, config) {
    this.dependencyName = dependencyName;
    this.version = config.version;
}

Dependency.createDependencyFromConfig = function(dependencyName, config) {
    // Load modules here to break from cyclic dependency problem
    var RegistryDependency = require('./RegistryDependency.js').RegistryDependency;
    var GitDependency = require('./GitDependency.js').GitDependency;
    var HTTPDependency = require('./HTTPDependency.js').HTTPDependency;
    var DirectoryDependency = require('./DirectoryDependency.js').DirectoryDependency;
    var LocalFileDependency = require('./LocalFileDependency.js').LocalFileDependency;

    // Determine what dependency to construct from the version property
    if(RegistryDependency.check(config)) {
        return new RegistryDependency(dependencyName, config);
    } else if(GitDependency.check(config)) {
        return new GitDependency(dependencyName, config);
    } else if(HTTPDependency.check(config)) {
        return new HTTPDependency(dependencyName, config);
    } else if(LocalFileDependency.check(config)) {
        return new LocalFileDependency(dependencyName, config);
    } else if(DirectoryDependency.check(config)) {
        return new DirectoryDependency(dependencyName, config);
    } else {
        throw new Error("Cannot infer dependency from: " + config.version + " version specifier!");
    }
};

Dependency.prototype.accept = function(visitor, callback) {
    return new Error("Dependency::accept is abstract");
};

exports.Dependency = Dependency;
