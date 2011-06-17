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
    utils = require(__dirname + '/utils/utils.js'),
    Collection = require(__dirname + '/router/collection.js'),
    Selector = require(__dirname + '/selector.js'),
    fs = require('fs');

/**
 * Jet Factory
 *
 * @returns {Function}
 */
var Jet = function (all /* plugin names or functions */) {
    var hook = function (selector) {
        return hookDispatcher.apply(hook, arguments);
    };

    hook.__proto__ = jetPrototype;
    hook.routesCollection = new Collection();
    hook.httpServer = http.createServer();
    hook.httpServer.on('request', handleRequest.bind(hook));
    // Apply modules
    jetPrototype.use.apply(hook, arguments);
    
    return hook;
};

var shortSelectorDispatcher = function (method, args) {
    var selectorOrNamedCallback = args[0],
        callback = args[1],
        selector,
        callbackName;

    // handles $(...).get(function Name(){ })
    if (typeof selectorOrNamedCallback === "function") {
        callback = selectorOrNamedCallback;
        callbackName = selectorOrNamedCallback.name;

        if (!callbackName) {
            selector = '/';
        } else {
            selector = utils.createSelectorFromHandlerName(callbackName);
        }
    } else {
        selector = selectorOrNamedCallback;
    }

    (new Selector(selector, this.routesCollection)).bind(method, callback);
    return this;
};

var hookDispatcher = function (selectorOrRestHandler) {
    // Handles $(function Name(){ });
    if (typeof selectorOrRestHandler === "function") {
        return this.rest(selectorOrRestHandler);
    }

    // Handles $('/:selector');
    return new Selector(selectorOrRestHandler, this.routesCollection);
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
        this.httpServer.listen(port || 80, host);
        return this;
    },

    responseNotFound: function ($) {
        $.send(404);
    },

    /**
     * Plugin loader
     */
    use: function (all /* plugin names or functions */) {
        var plugins = arguments;

        if (all === '*' || all === true) {
            plugins = fs.readdirSync(__dirname + '/plugins/');
        } else if (typeof all === "object") {
            plugins = all;
        }

        for (var i = 0, c = plugins.length, plugin; i < c; i += 1) {
            plugin = plugins[i];
            if (typeof plugin !== "function") {
                plugin = require(__dirname + '/plugins/' + plugin + '/index.js');
            }
            plugin(this);
        }
        return this;
    },

    bind: function (method, selectorOrNamedCallback, callback) {
        shortSelectorDispatcher.call(this, method, [selectorOrNamedCallback, callback]);
    },

    // Shorthand methods
    get: function () {
        shortSelectorDispatcher.call(this, 'GET', arguments);
        return this;
    },

    post: function () {
        shortSelectorDispatcher.call(this, 'POST', arguments);
        return this;
    },

    put: function () {
        shortSelectorDispatcher.call(this, 'PUT', arguments);
        return this;
    },

    del: function () {
        shortSelectorDispatcher.call(this, 'DELETE', arguments);
        return this;
    },

    crud: function () {
        shortSelectorDispatcher.call(this, 'GET', arguments);
        shortSelectorDispatcher.call(this, 'POST', arguments);
        shortSelectorDispatcher.call(this, 'PUT', arguments);
        shortSelectorDispatcher.call(this, 'DELETE', arguments);
        return this;
    },

    // jQuery plugin style
    fn: http.ServerResponse.prototype
};

// Alias
jetPrototype.rest = jetPrototype.crud;

// jQuery plugin style
Jet.fn = http.ServerResponse.prototype;

// Shortcut
Jet.__defineGetter__('$', function () {
    var $ = Jet('*');
    // That's bad ...
    Selector.prototype.listen = jetPrototype.listen.bind($);
    return $;
});

module.exports = Jet;

