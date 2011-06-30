/**
 * @fileOverview Template Engine Interface interface
 */

var fs = require('fs');

/**
 * EngineInterface
 *
 * @constructor
 *
 * @param {Object} options template options
 */
var EngineInterface = function (options) {
    this.cache = {};
};

/**
 * Renders template
 *
 * @param {String}   templateOrPath
 * @param {Object}   templateData
 */
EngineInterface.prototype.render = function (templateOrPath, templateData) {
    return this.createTemplate(templateOrPath)(templateData);
};

/**
 * Checks if template match this engine
 *
 * @param {Boolean} templatePath
 */
EngineInterface.prototype.isMatchTemplate = function (templatePath) {
    return String(templatePath).split('.').pop() === this.EXTENSION;
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
        var stat = fs.statSync(templateOrPath);
        if (stat.isFile()) {
            var content = fs.readFileSync(templateOrPath);
            template = templateConstructor(content);
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