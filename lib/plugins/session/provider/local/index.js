/**
 * @fileOverview Local Session provider
 */

var SessionStorage = require(__dirname + '/../../session_storage.js'),
    util = require("util");

/**
 * LocalStorage
 *
 * @constructor
 *
 * @param {Object} options storage options
 */
function LocalStorage (options) {
    this.storage = {};
}

util.inherits(LocalStorage, SessionStorage);

module.exports = LocalStorage;
