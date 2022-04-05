const Dependency = require('./Dependency.js').Dependency;

class GitDependency extends Dependency {
    constructor(dependencyName, config) {
        super(dependencyName, config);
        this.from = config.from;
    }

    static check(config) {
        return (config.version.startsWith("github:")
            || config.version.startsWith("git:")
            || config.version.startsWith("git+ssh:")
            || config.version.startsWith("git+http:")
            || config.version.startsWith("git+https:"));
    }

    async accept(visitor) {
        return visitor.visitGitDependency(this);
    }
}

exports.GitDependency = GitDependency;
