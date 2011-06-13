/**
 * @fileOverview Jet - main class - http server
 *
 * @example
 *     var $ = Jet();
 *
 *     // jQeury-style plugins
 *     $.fn.pewpew = function () { return "pewpew" };
 *     $.fn.crudRouter = new CrudRouter(); // Mock CRUD Router
 *
 *     $('/:action?').get(function ($) {
 *         $.send($.PATH.action + ' ' + JSON.stringify($.GET));
 *     });
 *
 *     // Uses plugin function pewpew
 *     $('/pewpew').get(function ($) {
 *         $.send($.pewpew());
 *     })
 *     // Then Binds to DELETE method
 *     .del(function ($) {
 *         $.send($.POST.id + ' deleted!');
 *     });
 *
 *     // Binds to 4 main methods GET POST PUT DELETE
 *     // Router '/:action' already exists - uses cache
 *     $('/:action').crud(function ($) {
 *         $.crudRouter.action($.PATH.action, $);
 *     });
 *
 *     // You can also use RegExp as selector
 *     $(/^\/read\/[0-9]{1,5}$/).get(function ($) {
 *         $.send('pass');
 *     });
 *
 *     $.listen(80); // same interface as http.Server#listen
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

var http = require(__dirname + '/http.js'),
    Collection = require(__dirname + '/router/collection.js'),
    Selector = require(__dirname + '/selector.js'),
    Stat = require(__dirname + '/utils/stat.js');

/**
 * Jet Factory
 *
 * @returns {Function}
 */
var Jet = function () {
    var hook = function (selector) {
        return new Selector(selector, hook.routesCollection);
    };

    hook.__proto__ = jetPrototype;
    hook.routesCollection = new Collection();
    hook.httpServer = http.createServer();
    hook.httpServer.on('request', handleRequest.bind(hook));
    
    return hook;
};

var handleRequest = function (req, res) {
    req.setEncoding(res.CHARSET);

    var self = this,
        body = '';

    if (req.method === 'GET' || req.method === 'HEAD') {
        this.processRequest(res, req, body);
        return;
    }

    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        self.processRequest(res, req, body);
    });
};

// @todo replace that weird block
var jetPrototype = {
    processRequest: function ($, request, requestBody) {
        $.embedRequest(request, requestBody);

        var callback = this.responseNotFound,
            route = this.routesCollection.find($.METHOD, $.url.pathname);

        if (route) {
            callback = route.callback;
            $.PATH = route.path;
        }
        
        callback($);
    },

    listen: function (port, host) {
        this.httpServer.listen(port, host);
    },

    responseNotFound: function ($) {
        $.send(404);
    },

    // jQuery plugin style
    fn: http.ServerResponse.prototype,

    // Print statistics
    stat: function () {
        var stat = Stat.getStatStruct(this.httpServer),
            selectors = Selector.cache,
            routes,
            methods,
            names,
            selectorRegExp;

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
                        methods.push('\033[32m' + method + '\033[39m ' + names.join(', '))
                    }
                }
            }
            stat.push([selectorKey, methods]);
        }

        return Stat.renderStat(stat);
    }
};

// jQuery plugin style
jetPrototype.jfn = jetPrototype;
Jet.fn = http.ServerResponse.prototype;
Jet.jfn = jetPrototype;

module.exports = Jet;

