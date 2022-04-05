const Dependency = require('./Dependency.js').Dependency;

class LocalFileDependency extends Dependency {
    constructor(dependencyName, config) {
        super(dependencyName, config);
        this.integrity = config.integrity;
    }

    static check(config) {
        return config.version.startsWith("file:") && config.integrity;
    }

    async accept(visitor) {
        return visitor.visitLocalFileDependency(this);
    }
}

exports.LocalFileDependency = LocalFileDependency;
