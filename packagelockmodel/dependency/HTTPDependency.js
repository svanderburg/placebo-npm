const Dependency = require('./Dependency.js').Dependency;

class HTTPDependency extends Dependency {
    constructor(directoryName, config) {
        super(directoryName, config);
        this.integrity = config.integrity;
    }

    static check(config) {
        return config.version.startsWith("http:") || config.version.startsWith("https:");
    }

    async accept(visitor) {
        return visitor.visitHTTPDependency(this);
    }
}

exports.HTTPDependency = HTTPDependency;
