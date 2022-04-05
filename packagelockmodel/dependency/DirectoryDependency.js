const Dependency = require('./Dependency.js').Dependency;

class DirectoryDependency extends Dependency {
    constructor(dependencyName, config) {
        super(dependencyName, config);
    }

    static check(config) {
        return config.version.startsWith("file:") && !config.integrity;
    }

    async accept(visitor) {
        return visitor.visitDirectoryDependency(this);
    }
}

exports.DirectoryDependency = DirectoryDependency;
