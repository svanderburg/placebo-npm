var fs = require('fs');
var util = require('../packagelockmodel/util.js');

function Placebo(placeboJSON) {
    this.placeboObj = JSON.parse(fs.readFileSync(placeboJSON));
}

Placebo.prototype.findByIntegrityHash = function(hash) {
    if(util.isObject(this.placeboObj.integrityHashToFile)
        && this.placeboObj.integrityHashToFile[hash]) {
        return this.placeboObj.integrityHashToFile[hash];
    } else {
        throw new Error("No replacement file found for dependency with hash: " + hash);
    }
};

Placebo.prototype.findByVersion = function(version) {
    if(util.isObject(this.placeboObj.versionToFile)
        && this.placeboObj.versionToFile[version]) {
        return this.placeboObj.versionToFile[version];
    } else {
        throw new Error("No replacement file found for dependency with version: " + version);
    }
};

Placebo.prototype.findDirectoryCopyLink = function(version) {
    if(util.isObject(this.placeboObj.versionToDirectoryCopyLink)
        && this.placeboObj.versionToDirectoryCopyLink[version]) {
        return this.placeboObj.versionToDirectoryCopyLink[version];
    } else {
        throw new Error("No replacement directory found for dependency with version: " + version);
    }
};

exports.Placebo = Placebo;
