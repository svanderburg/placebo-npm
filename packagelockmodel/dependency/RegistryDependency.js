var inherit = require('./inherit.js').inherit;
var Dependency = require('./Dependency.js').Dependency;

function RegistryDependency(dependencyName, config) {
    Dependency.call(this, dependencyName, config);
    this.integrity = config.integrity;
    this.resolved = config.resolved;
}

/* RegistryDependency inherits from Dependency */
inherit(Dependency, RegistryDependency);

RegistryDependency.check = function(config) {
    return config.version.match(/^[0-9]+\.[0-9]+\.[0-9]+$/);
};

RegistryDependency.prototype.accept = function(visitor, callback) {
    visitor.visitRegistryDependency(this, callback);
};

exports.RegistryDependency = RegistryDependency;
