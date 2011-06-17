/**
 * @fileOverview Stat plugin
 */
var Stat = require(__dirname + '/stat.js'),
    Selector = require(__dirname + '/../../selector.js');

var stat = function (type) {
    var stat = Stat.getStatStruct(this.httpServer),
        selectors = Selector.cache,
        routes,
        methods,
        names,
        selectorRegExp;

    type = type || 'console';

    stat.push('Routes');

    // Check selectors cache
    for (var selectorKey in selectors) {
        routes = selectors[selectorKey].routesCollection.routes;
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
                        methods.push('\033[32m' + method + '\033[39m ' + names.join(', '))
                    } else {
                        methods.push(method +' (' + names.join(', ') + ')')
                    }
                }
            }
        }
        stat.push([selectorKey, methods]);
    }

    if (type === 'console') {
        console.log(Stat.renderConsole(stat));
    } else {
        return Stat.renderHtml(stat);
    }
};

module.exports = function (Jet) {
    // Jet    - jet plugin
    Jet.stat = stat;
    // Jet.fn - jet view plugin
};