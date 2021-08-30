var inherit = require('./inherit.js').inherit;
var Dependency = require('./Dependency.js').Dependency;

function HTTPDependency(directoryName, config) {
    Dependency.call(this, directoryName, config);
    this.integrity = config.integrity;
}

/* HTTPDependency inherits from Dependency */
inherit(Dependency, HTTPDependency);

HTTPDependency.check = function(config) {
    return config.version.startsWith("http:") || config.version.startsWith("https:");
};

HTTPDependency.prototype.accept = function(visitor, callback) {
    visitor.visitHTTPDependency(this, callback);
};

exports.HTTPDependency = HTTPDependency;
