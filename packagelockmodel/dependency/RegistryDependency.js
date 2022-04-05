const semver = require('semver');
const Dependency = require('./Dependency.js').Dependency;

class RegistryDependency extends Dependency {
    constructor(dependencyName, config) {
        super(dependencyName, config);
        this.integrity = config.integrity;
        this.resolved = config.resolved;
    }

    static check(config) {
        const parsedVersionSpec = semver.validRange(config.version, true);
        return parsedVersionSpec !== null;
    }

    async accept(visitor) {
        return visitor.visitRegistryDependency(this);
    }
}

exports.RegistryDependency = RegistryDependency;
