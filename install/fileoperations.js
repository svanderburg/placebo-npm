var child_process = require('child_process');
var fs = require('fs');
var path = require('path');

function ensureDir(dir) {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

exports.ensureDir = ensureDir;

exports.copyDirectory = function(fileName, dependencyName) {
    ensureDir("node_modules");
    var targetDir = path.join("node_modules", dependencyName);
    child_process.execFileSync("cp", ["-av", fileName, targetDir]);
    child_process.execFileSync("chmod", ["-Rv", "u+w", targetDir]);
};

exports.unpackFile = function(fileName, dependencyName) {
    var destinationDir = path.join("node_modules", dependencyName);
    ensureDir(destinationDir);
    child_process.execFileSync("tar", [ "--warning=no-unknown-keyword", "--delay-directory-restore", "--strip-components=1", "-C", destinationDir, "-xf", fileName ]);
};
