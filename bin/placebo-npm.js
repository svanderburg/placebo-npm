#!/usr/bin/env node

const optparse = require('optparse');
const install = require('../install/install.js');

/* Define command-line options */

const switches = [
    ['-h', '--help', 'Shows help sections'],
    ['-v', '--version', 'Shows version'],
    ['-l', '--lock FILE', 'Path to the package-lock.json file that pinpoints the variants of all dependencies (defaults to: package-lock.json)'],
    ['-p', '--placebo FILE', 'Path to the package-placebo.json file that maps package log dependency references to local files (defaults to: package-placebo.json)'],
    ['--production', 'Deploy in production mode, in which development dependencies on top level are not installed']
];

const parser = new optparse.OptionParser(switches);

/* Set some variables and their default values */

let help = false;
let version = false;

let packageLockFile = "package-lock.json";
let packagePlaceboFile = "package-placebo.json";
let production = false;

/* Define process rules for option parameters */

parser.on(function(arg, value) {
    process.stderr.write(arg + ": invalid option\n");
    process.exit(1);
});

parser.on('help', function(arg, value) {
    help = true;
});

parser.on('version', function(arg, value) {
    version = true;
});

parser.on('lock', function(arg, value) {
    packageLockFile = value;
});

parser.on('placebo', function(arg, value) {
    packagePlaceboFile = value;
});

parser.on('production', function(arg, value) {
    production = true;
});

/* Do the actual command-line parsing */

parser.parse(process.argv);

/* Display the help, if it has been requested */

if(help) {
    function displayTab(len, maxlen) {
        for(const i = 0; i < maxlen - len; i++) {
            process.stdout.write(" ");
        }
    }

    process.stdout.write("Usage: " + executable + " [OPTION]\n\n");

    process.stdout.write("Processes an NPM project's package-lock.json file to determine its required\n");
    process.stdout.write("dependencies and installs them from the locations specified in the\n");
    process.stdout.write("package-placebo.json file.\n\n");

    process.stdout.write("Options:\n");

    const maxlen = 30;

    for(const i = 0; i < switches.length; i++) {

        const currentSwitch = switches[i];

        process.stdout.write("  ");

        if(currentSwitch.length == 3) {
            process.stdout.write(currentSwitch[0] + ", "+currentSwitch[1]);
            displayTab(currentSwitch[0].length + 2 + currentSwitch[1].length, maxlen);
            process.stdout.write(currentSwitch[2]);
        } else {
            process.stdout.write(currentSwitch[0]);
            displayTab(currentSwitch[0].length, maxlen);
            process.stdout.write(currentSwitch[1]);
        }

        process.stdout.write("\n");
    }

    process.exit(0);
}

/* Display the version, if it has been requested */

if(version) {
    const version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"))).version;

    process.stdout.write("placebo-npm " + version + "\n");
    process.exit(0);
}

/* Execute the operations */

(async function() {
    try {
        await install.installDependenciesFromPlacebo(packagePlaceboFile, packageLockFile, production);
    } catch(err) {
        process.stderr.write(err.stack + "\n");
        process.exit(1);
    }
})();
