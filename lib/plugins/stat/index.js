/**
 * @fileOverview Stat plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */
/*global console: true*/

var Stat = require(__dirname + '/stat.js');

var drainStats = function (selectors, collectionName, type) {
    var stat = [],
        routes,
        methods,
        names,
        selectorRegExp;

    // Check selectors cache
    for (var selectorKey in selectors) {
        routes = selectors[selectorKey][collectionName].routes;
        selectorRegExp = selectors[selectorKey].selector;
        selectorKey = selectorKey.substr(1);
        methods = [];

        // For each http method
        for (var method in routes) {
            names = [];
            if (routes.hasOwnProperty(method)) {
                for (var i = 0, routesCount = routes[method].length; i < routesCount; i++) {
                    // Check own handlers
                    if (routes[method][i].selector === selectorRegExp) {
                        names.push(routes[method][i].callback.name || '<anonymous>');
                    }
                }

                if (names.length) {
                    if (names.length > 4) {
                        names.splice(4, names.length, '...more ' + (names.length - 4));
                    }
                    if (type === 'console') {
                        methods.push('\033[32m' + method + '\033[39m ' + names.join(', '));
                    } else {
                        methods.push(method + ' (' + names.join(', ') + ')');
                    }
                }
            }
        }
        if (methods.length) {
            stat.push([selectorKey, methods]);
        }
    }

    return stat;
};

var stat = function (type) {
    var stat = Stat.getStatStruct(this.server),
        stats,
        selectors = this._selector.cache;

    type = type || 'console';

    stats = drainStats(selectors, 'routesCollection', type);
    if (stats.length) {
        stat.push('Routs');
        stat = stat.concat(stats);
    }
    stats = drainStats(selectors, 'hooksCollection', type);
    if (stats.length) {
        stat.push('Hooks');
        stat = stat.concat(stats);
    }

    if (type === 'console') {
        console.log(Stat.renderConsole(stat));
    } else {
        return Stat.renderHtml(stat);
    }
};

module.exports = function (Jet) {
    Jet.use("router");
    // Jet    - jet plugin
    Jet.stat = stat;
    // Jet.fn - jet view plugin
};