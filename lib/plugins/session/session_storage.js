/**
 * @fileOverview Session storage interface - Simplified DOM Storage
 */

/**
 * SessionStorage
 *
 * @constructor
 *
 * @param {Object} options storage options
 */
function SessionStorage (options) {
    this.storage = {};
}

/**
 * Sets storage item
 *
 * @param {String}   userId
 * @param {String}   key
 * @param {Mixed}    data
 * @param {Function} callback
 */
SessionStorage.prototype.setItem = function (userId, key, data, callback) {
    if (!this.storage['#' + userId]) {
        this.storage['#' + userId] = {};
    }
    this.storage['#' + userId]['#' + key] = data;
    if (typeof callback === "function") {
        callback(null);
    }
};

/**
 * Gets storage item
 *
 * @param {String}   userId
 * @param {String}   key
 * @param {Function} callback
 */
SessionStorage.prototype.getItem = function (userId, key, callback) {
    if (typeof callback === "function") {
        if (this.storage['#' + userId]) {
            callback(null, this.storage['#' + userId]['#' + key]);
        } else {
            callback(null);
        }
    }
};

/**
 * Removes storage item
 *
 * @param {String}   userId
 * @param {String}   key
 * @param {Function} callback
 */
SessionStorage.prototype.removeItem = function (userId, key, callback) {
    if (this.storage['#' + userId]) {
        var result = delete this.storage['#' + userId]['#' + key];
    }
    if (typeof callback === "function") {
        callback(null, result);
    }
};

/**
 * Clears storage
 *
 * @param {String}   userId
 * @param {Function} callback
 */
SessionStorage.prototype.clear = function (userId, callback) {
    if (this.storage['#' + userId]) {
        this.storage['#' + userId] = {};
    }
    if (typeof callback === "function") {
        callback(null);
    }
};

/**
 * Checks user id
 *
 * @param {String}   userId
 * @param {Function} callback
 */
SessionStorage.prototype.isValidUserId = function (userId, callback) {
    if (typeof callback === "function") {
        callback(null, true);
    }
};

SessionStorage.prototype.SESSION_ID = "SESSION_ID";

module.exports = SessionStorage;