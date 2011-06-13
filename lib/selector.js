/**
 * @fileOverview Jet Selector
 *
 * @see jet.js example for details
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

var normalize = require(__dirname + '/utils/utils.js').normalize,
    Collection = require(__dirname + '/router/collection.js');

/**
 * Routes selector
 *
 * @constructor
 * 
 * @param {String|RegExp} selector
 * @param {Collection}    routes
 */
var Selector = function (selector, routesCollection) {
    if (!(selector instanceof RegExp || typeof selector === "string")) {
        throw new Error ("selector must be a RegExp or String " + selector + '(' + (typeof selector) + ") given");
    }

    if (!(routesCollection instanceof Collection)) {
        throw new Error ("routesCollection must be a Collection " + routesCollection + '(' + (typeof routesCollection) + ") given");
    }
    
    var key = '#' + selector;
    var cache = Selector.cache[key];

    if (cache) {
        return cache;
    }

    this.routesCollection = routesCollection;
    this.keys = [];
    this.selector = normalize(selector, this.keys, false);

    Selector.cache[key] = this;
};

// Selectors cache
Selector.cache = {};

/**
 * Bind method
 * 
 * @param {String}   method
 * @param {Function} callback
 *
 * @returns {Selector}
 */
Selector.prototype.bind = function (method, callback) {
    if (typeof method !== "string") {
        throw new Error ("method must be a String " + method + '(' + (typeof method) + ") given");
    }
    
    if (typeof callback !== "function") {
        throw new Error ("callback must be a Function " + callback + '(' + (typeof callback) + ") given");
    }

    var route = {
        callback: callback,
        selector: this.selector
    };

    if (this.keys.length) {
        route.keys = this.keys;
    }

    this.routesCollection.add(method.toUpperCase(), route);
    return this;
};

// Shorthand methods

Selector.prototype.get = function (callback) {
    return this.bind('GET', callback);
};

Selector.prototype.post = function (callback) {
    return this.bind('POST', callback);
};

Selector.prototype.put = function (callback) {
    return this.bind('PUT', callback);
};

Selector.prototype.del = function (callback) {
    return this.bind('DELETE', callback);
};

Selector.prototype.crud = function (callback) {
    this.bind('POST', callback);
    this.bind('GET', callback);
    this.bind('PUT', callback);
    this.bind('DELETE', callback);
    return this;
};

// Alias
Selector.prototype.rest = Selector.prototype.crud;

module.exports = Selector;