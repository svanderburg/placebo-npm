var path = require('path');

function checkScopedDependency(dependencyName) {
    return (dependencyName.indexOf('@') > -1);
}

function ChildDependenciesVisitor() {
}

ChildDependenciesVisitor.prototype.openChildDependencies = function(dependencyName) {
    process.chdir(path.join("node_modules", dependencyName));
};

ChildDependenciesVisitor.prototype.leaveChildDependencies = function(dependencyName) {
    process.chdir(path.join("..", ".."));

    if(checkScopedDependency(dependencyName)) {
         process.chdir("..");
    }
};

exports.ChildDependenciesVisitor = ChildDependenciesVisitor;
