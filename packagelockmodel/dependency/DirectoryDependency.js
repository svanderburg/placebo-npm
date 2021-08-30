var inherit = require('./inherit.js').inherit;
var Dependency = require('./Dependency.js').Dependency;

function DirectoryDependency(dependencyName, config) {
    Dependency.call(this, dependencyName, config);
}

/* DirectoryDependency inherits from Dependency */
inherit(Dependency, DirectoryDependency);

DirectoryDependency.check = function(config) {
    return config.version.startsWith("file:") && !config.integrity;
};

DirectoryDependency.prototype.accept = function(visitor, callback) {
    visitor.visitDirectoryDependency(this, callback);
};

exports.DirectoryDependency = DirectoryDependency;
