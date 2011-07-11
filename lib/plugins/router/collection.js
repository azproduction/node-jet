/**
 * @fileOverview Jet Routers Collection
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var Router = require(__dirname + '/router.js');

/**
 * @constructor
 */
function Collection() {
    this.routes = {};
}

/**
 * Adds route
 *
 * @see utils.js normalize for routeObject.keys format
 *
 * @param {String}   httpMethod  POST PUT DELETE GET etc
 * @param {Object}   routeObject
 * @param {Function} routeObject.callback
 * @param {RegExp}   routeObject.selector
 * @param {Object}   [routeObject.keys]
 */
Collection.prototype.add = function (httpMethod, routeObject) {
    if (typeof httpMethod !== "string") {
        throw new Error("httpMethod must be a String " + httpMethod + '(' + (typeof httpMethod) + ") given");
    }

    if (typeof routeObject !== "object") {
        throw new Error("routeObject must be a Object " + routeObject + '(' + (typeof routeObject) + ") given");
    }

    if (!this.routes[httpMethod]) {
        this.routes[httpMethod] = new Router();
    }

    if (routeObject.keys) { // If Greed - push to end
        this.routes[httpMethod].push(routeObject);
    } else { // Normal push to front
        this.routes[httpMethod].unshift(routeObject);
    }
};

/**
 * @param {String} httpMethod
 * @param {String} urlPathName
 *
 * @returns {Object|undefined}
 */
Collection.prototype.find = function (httpMethod, urlPathName) {
    if (this.routes[httpMethod]) {
        return this.routes[httpMethod].find(urlPathName);
    }
};

module.exports = Collection;