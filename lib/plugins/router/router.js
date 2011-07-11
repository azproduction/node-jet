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
 * @returns {Object|undefined} routeObject
 */
Router.prototype.find = function (urlPathName) {
    for (var i = 0, c = this.length, route; i < c; i += 1) {
        route = this[i];
        var execResult = route.selector.exec(urlPathName);
        if (execResult) {
            var result = {
                callback: route.callback
            };

            if (route.keys) {
                execResult.shift();
                result.path = {};

                for (var j = 0, b = route.keys.length, key, value; j < b; j += 1) {
                    key = route.keys[j];
                    value = execResult[j];

                    if (!value && !key.optional) {
                        result = null;
                        break;
                    }

                    result.path[key.name] = decodeURIComponent(value);
                }
            }

            if (result) {
                return result;
            }
        }
    }
};

module.exports = Router;