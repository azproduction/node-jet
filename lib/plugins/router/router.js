/**
 * @fileOverview Jet Router
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

/**
 * Router
 *
 * @borrows Array
 * @constructor
 */
function Router() {
    Array.apply(this, arguments);
}

Router.prototype.__proto__ = Array.prototype;

// Prevent console.log error
Router.prototype.toString = function () {
    return Object.prototype.toString.call(this);
};

/**
 * Searches for route
 *
 * @see routeObject format - Collection#add
 * @param   {String}           urlPathName
 * @param   {Boolean}          isAll
 * @returns {Object|undefined} routeObject
 */
Router.prototype.find = function (urlPathName, isAll) {
    var results = [],
        result;

    for (var i = 0, c = this.length, route; i < c; i += 1) {
        route = this[i];
        var execResult = route.selector.exec(urlPathName);
        if (execResult) {
            result = {
                callback: route.callback
            };
            // Router is greed - check the keys
            if (route.keys) {
                execResult.shift();
                result.path = {};
                // check all keys
                for (var j = 0, b = route.keys.length, key, value; j < b; j += 1) {
                    key = route.keys[j];
                    value = execResult[j];
                    // no required key - skip this item
                    if (!value && !key.optional) {
                        result = null;
                        break;
                    }
                    // fill with keys
                    result.path[key.name] = decodeURIComponent(value);
                }
            }

            if (result) {
                if (isAll) {
                    results.push(result);
                } else {
                    return result;
                }
            }
        }
    }
    if (isAll) {
        return results;
    }
};

Router.prototype.findAll = function (urlPathName) {
    return this.find(urlPathName, true);
};

module.exports = Router;