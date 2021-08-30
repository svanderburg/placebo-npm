var inherit = require('./inherit.js').inherit;
var Dependency = require('./Dependency.js').Dependency;

function LocalFileDependency(dependencyName, config) {
    Dependency.call(this, dependencyName, config);
    this.integrity = config.integrity;
}

/* LocalFileDependency inherits from Dependency */
inherit(Dependency, LocalFileDependency);

LocalFileDependency.check = function(config) {
    return config.version.startsWith("file:") && config.integrity;
};

LocalFileDependency.prototype.accept = function(visitor, callback) {
    visitor.visitLocalFileDependency(this, callback);
};

exports.LocalFileDependency = LocalFileDependency;
