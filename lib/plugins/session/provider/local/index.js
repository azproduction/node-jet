/**
 * @fileOverview Local Session provider
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var ProviderInterface = require(__dirname + '/../../providerInterface.js'),
    util = require("util");

/**
 * LocalStorage
 *
 * @constructor
 *
 * @param {Object} options storage options
 */
function LocalStorage(options) {
    this.storage = {};
}

util.inherits(LocalStorage, ProviderInterface);

module.exports = LocalStorage;
