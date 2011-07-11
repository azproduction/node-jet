/**
 * Flash redirect plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var utils = require(__dirname + '/../../utils/utils.js'),
    fs = require('fs');

/**
 *
 * @param {String|Object}    messageOrOptions
 * @param {Object|undefined} optionsOrUndefined
 */
var flash = function (messageOrOptions, optionsOrUndefined) {
    var options;

    if (typeof messageOrOptions === "object") {
        options = messageOrOptions;
    } else {
        options = optionsOrUndefined || {};
        options.message = messageOrOptions;
    }

    options.message = options.message  || flash.MESSAGE;
    options.timeout = options.timeout || flash.TIMEOUT;
    options.location = options.location || flash.LOCATION;
    options.template = options.template || flash.TEMPLATE;

    this.simple(options.template, options);
};

flash.cache = {};
flash.LOCATION = '/';
flash.TIMEOUT = 2;
flash.MESSAGE = 'Redirect';
flash.TEMPLATE = __dirname + '/index.simple';

module.exports = function (Jet) {
    if (!Jet.bind) {
        throw new Error('Plugin flash requires router plugin: $.use("router", "flash")');
    }
    if (!Jet.fn.simple) {
        Jet.use("template:simple");
    }
    // Jet    - jet plugin
    Jet.fn.flash = flash;
};