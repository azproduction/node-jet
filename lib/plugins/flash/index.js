/**
 * Flash redirect plugin
 */

var utils = require(__dirname + '/../../utils/utils.js'),
    fs = require('fs');

/**
 *
 * @param {String|Object}    messageOrOptions
 * @param {Object|undefined} optionsOrUndefined
 */
var flash = function (messageOrOptions, optionsOrUndefined) {
    var options,
        template,
        self = this;

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

    if (flash.cache[options.template]) {
        template = flash.cache[options.template];
        this.send(template(options));
    } else {
        fs.readFile(options.template, function (err, templateContent) {
            if (err) throw err;
            template = utils.template(templateContent);
            flash.cache[options.template] = template;
            self.send(template(options));
        });
    }
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
    // Jet    - jet plugin
    Jet.fn.flash = flash;
};