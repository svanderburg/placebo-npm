const fs = require('fs');
const util = require('../packagelockmodel/util.js');

class Placebo {
    constructor(placeboJSON) {
        this.placeboObj = JSON.parse(fs.readFileSync(placeboJSON));
    }

    findByIntegrityHash(hash) {
        if(util.isObject(this.placeboObj.integrityHashToFile)
            && this.placeboObj.integrityHashToFile[hash]) {
            return this.placeboObj.integrityHashToFile[hash];
        } else {
            throw new Error("No replacement file found for dependency with hash: " + hash);
        }
    }

    findByVersion(version) {
        if(util.isObject(this.placeboObj.versionToFile)
            && this.placeboObj.versionToFile[version]) {
            return this.placeboObj.versionToFile[version];
        } else {
            throw new Error("No replacement file found for dependency with version: " + version);
        }
    }

    findDirectoryCopyLink(version) {
        if(util.isObject(this.placeboObj.versionToDirectoryCopyLink)
            && this.placeboObj.versionToDirectoryCopyLink[version]) {
            return this.placeboObj.versionToDirectoryCopyLink[version];
        } else {
            throw new Error("No replacement directory found for dependency with version: " + version);
        }
    }
}

exports.Placebo = Placebo;
