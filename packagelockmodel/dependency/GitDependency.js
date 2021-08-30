var inherit = require('./inherit.js').inherit;
var Dependency = require('./Dependency.js').Dependency;

function GitDependency(dependencyName, config) {
    Dependency.call(this, dependencyName, config);
    this.from = config.from;
}

/* GitDependency inherits from Dependency */
inherit(Dependency, GitDependency);

GitDependency.check = function(config) {
    return (config.version.startsWith("github:")
        || config.version.startsWith("git:")
        || config.version.startsWith("git+ssh:")
        || config.version.startsWith("git+http:")
        || config.version.startsWith("git+https:"));
};

GitDependency.prototype.accept = function(visitor, callback) {
    visitor.visitGitDependency(this, callback);
};

exports.GitDependency = GitDependency;
