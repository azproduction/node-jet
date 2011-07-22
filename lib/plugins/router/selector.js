/**
 * @fileOverview Jet Selector
 *
 * @see jet.js example for details
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var normalize = require(__dirname + '/../../utils/utils.js').normalize,
    Collection = require(__dirname + '/collection.js');

/**
 * Routes selector
 *
 * @constructor
 *
 * @param {String|RegExp} selector
 * @param {Collection}    routes
 */
var Selector = function (selector, routesCollection, hooksCollection) {
    if (!(selector instanceof RegExp || typeof selector === "string")) {
        throw new Error("selector must be a RegExp or String " + selector + '(' + (typeof selector) + ") given");
    }

//    if (!(routesCollection instanceof Collection)) {
//        throw new Error("routesCollection must be a Collection " + routesCollection + '(' + (typeof routesCollection) + ") given");
//    }
//
//    if (!(hooksCollection instanceof Collection)) {
//        throw new Error("hooksCollection must be a Collection " + hooksCollection + '(' + (typeof hooksCollection) + ") given");
//    }

    var key = '#' + selector;
    var cache = Selector.cache[key];

    if (cache) {
        return cache;
    }

    this.routesCollection = routesCollection;
    this.hooksCollection = hooksCollection;
    this.keys = [];
    this.selector = normalize(selector, this.keys, false);

    Selector.cache[key] = this;
};

// Selectors cache
Selector.cache = {};

function bindFactory (collectionName) {

    return function (method, callback) {
        if (typeof method !== "string") {
            throw new Error("method must be a String " + method + '(' + (typeof method) + ") given");
        }

        if (typeof callback !== "function") {
            throw new Error("callback must be a Function " + callback + '(' + (typeof callback) + ") given");
        }

        var route = {
            callback: callback,
            selector: this.selector
        };

        if (this.keys.length) {
            route.keys = this.keys;
        }

        this[collectionName].add(method.toUpperCase(), route);
        return this;
    }
}

/**
 * Bind method
 *
 * @param {String}   method
 * @param {Function} callback
 *
 * @returns {Selector}
 */
Selector.prototype.bind = bindFactory('routesCollection');

Selector.prototype.hook = bindFactory('hooksCollection');

Selector.prototype.cache = Selector.cache;

module.exports = Selector;