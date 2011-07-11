/**
 * @fileOverview Template Engine Interface interface
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var fs = require('fs');

/**
 * EngineInterface
 *
 * @constructor
 *
 * @param {Object} options template options
 */
var EngineInterface = function (options) {
    options = options || {};
    this.cache = {};
    if (options.path) {
        this.path = fs.realpathSync(options.path) + '/';
    }
    if (typeof options.helpers === "object") {
        this.helpers = options.helpers;
    }
};

/**
 * Renders template
 *
 * @param {String}   templateOrPath
 * @param {Object}   templateData
 */
EngineInterface.prototype.render = function (templateOrPath, templateData) {
    // Add helpers
    if (this.helpers) {
        // @todo make it faster
        templateData.__proto__ = this.helpers;
    }
    return this.createTemplate(templateOrPath)(templateData);
};

/**
 * Checks if template match this engine
 *
 * @param {Boolean} templatePath
 */
EngineInterface.prototype.isMatchTemplate = function (templatePath) {
    var extension = String(templatePath).split('.');
    return extension.length === 1 ? true : extension.pop() === this.EXTENSION;
};

/**
 * Resolve name
 *
 * @param {Boolean} templatePath
 */
EngineInterface.prototype.resolveName = function (templatePathOrName) {
    var paths = [templatePathOrName],
        path;

    if (this.path) {
        paths.push(this.path + templatePathOrName);
        paths.push(this.path + templatePathOrName + '.' + this.EXTENSION);
    }

    for (var i = 0, c = paths.length; i < c; i++) {
        try {
            path = fs.realpathSync(paths[i]);
            break;
        } catch (e) {}
    }

    if (path) {
        var stat = fs.statSync(path);
        if (stat.isFile()) {
            return path;
        } else {
            throw ('Template "' + templatePathOrName + '" must be a file');
        }
    }
};

/**
 * Creates template
 *
 * @param {String} templateOrPath
 */
EngineInterface.prototype.createTemplate = function (templateOrPath) {
    var template,
        templateConstructor = this.getTemplateConstructor();

    if (this.cache[templateOrPath]) {
        template = this.cache[templateOrPath];
    } else {
        var realName = this.resolveName(templateOrPath);
        if (realName) {
            var content = fs.readFileSync(realName);
            template = templateConstructor(content);

            // Add in-memory cache
            this.cache[templateOrPath] = template;
        } else {
            template = templateConstructor(templateOrPath);
            // Don't cache
        }
    }

    return template;
};

/**
 * Gets template constructor
 */
EngineInterface.prototype.getTemplateConstructor = function () {
    return function () {};
};

/**
 * Template extension
 */
EngineInterface.prototype.EXTENSION = 'simple';

module.exports = EngineInterface;