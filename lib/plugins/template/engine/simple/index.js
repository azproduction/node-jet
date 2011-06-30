/**
 * @fileOverview Simple template renderer
 */

var EngineInterface = require(__dirname + '/../../engineInterface.js'),
    util = require('util'),
    utils = require(__dirname + '/../../../../utils/utils.js');

/**
 * EngineInterface
 *
 * @constructor
 *
 * @param {Object} options template options
 */
var SimpleTemplate = function (options) {
    EngineInterface.call(this, options);
};

util.inherits(SimpleTemplate, EngineInterface);

/**
 * Gets template constructor
 */
SimpleTemplate.prototype.getTemplateConstructor = function () {
    return utils.template;
};

/**
 * Template extension
 */
SimpleTemplate.prototype.EXTENSION = 'simple';

module.exports = SimpleTemplate;