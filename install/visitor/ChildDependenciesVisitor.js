const path = require('path');

function checkScopedDependency(dependencyName) {
    return (dependencyName.indexOf('@') > -1);
}

class ChildDependenciesVisitor {
    openChildDependencies(dependencyName) {
        process.chdir(path.join("node_modules", dependencyName));
    }

    leaveChildDependencies(dependencyName) {
        process.chdir(path.join("..", ".."));

        if(checkScopedDependency(dependencyName)) {
             process.chdir("..");
        }
    }
}

exports.ChildDependenciesVisitor = ChildDependenciesVisitor;
