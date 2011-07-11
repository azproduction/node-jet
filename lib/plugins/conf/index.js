/**
 * @fileOverview Configure plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var fs = require('fs');

var conf = function (name, value) {
    if (!name) {
        return this._conf;
    }
    if (arguments.length === 1) {
        return this._conf[name];
    } else {
        this._conf[name] = value;
        return this;
    }
};

var fromJSON = function (file) {
    var options = JSON.parse(fs.readFileSync(file));

    for (var name in options) {
        if (options.hasOwnProperty(name)) {
            this._conf[name] = options[name];
        }
    }
    return this;
};

module.exports = function (Jet) {
    // Jet    - jet plugin
    Jet._conf = {};
    Jet.conf = conf;
    Jet.conf.fromJSON = fromJSON.bind(Jet);
    Jet.fn.conf = conf.bind(Jet);
    // Jet.fn - jet view plugin
};