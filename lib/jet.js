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

var Jet2 = function () {
    var self = function () {
       return Jet2.prototype._call.apply(self, arguments);
   };
   self.__proto__ = Jet2.prototype;
   return Jet2.prototype._init.apply(self, arguments);
};

Jet2.prototype = {
    constructor: Jet2,
    __proto__: Function.prototype,

    // Private methods

    _call: function () {
        // plugin extension point @event function (jet);
        this.emit('call', this);
        return this;
    },

    _init: function () {
        this.server = http.createServer();
        this._plugins = {};
        this.use.apply(this, arguments);

        // plugin extension point @event function (jet);
        this.emit('init', this);
        return this;
    },

    _plugin: function (data) {
        var plugins = [];

        switch (typeof data) {

            // // Handle: $(function pluginName(Jet){}) or $(function(Jet){})
            case "function":
                plugins.push({
                    func: data,
                    name: data.name || '<anonymous>'
                });
                break;

            // Handle: $('name')
            // name: function (Jet) {}
            case "string":
                plugins.push({
                    func: require(__dirname + '/plugins/' + data + '/index.js'),
                    name: data
                });
                break;

            // Handle: $({"name": optionsObject})
            // name: function (Jet, optionsObject) {}
            case "object":
                // Scan Object
                for (var index in data) {
                    plugins.push({
                        func: require(__dirname + '/plugins/' + index + '/index.js'),
                        name: index,
                        options: data[index]
                    });
                }
                break;
        }

        for (var i = 0, c = plugins.length, plugin, name, options; i < c; i++) {
            plugin = plugins[i];
            name = plugin.name;
            options = plugin.options || {};

            // Don't override plugin if exists
            if (!this._plugins[name]) {
                this._plugins[name] = options;
                plugin.func(this, options);

                // plugin extension point @event function (pluginName, pluginOptions, jet);
                this.emit('plugin', name, options, this);

                // plugin extension point @event function (pluginOptions, jet);
                this.emit('plugin:' + name, options, this);
            }
        }

        return this;
    },

    // Public methods

    /**
     * Includes one or more plugins in combined styles
     *
     * @example
     *    // One Style
     *    Jet('*') // includes all plugins in `plugins/` dir
     *    Jet('name1', 'name2', ...rest) // includes `name1`, `name2` plugins
     *    Jet(function name(Jet){ ... }) // includes function as plugin `name` used as plugins name
     *    Jet({"name": {"options":"options"}}) // includes plugin `name` with options
     *
     *    // Mixed style
     *    Jet("name1", {"name2": {"options":"options"}}, function name3(){ ... }, ...rest)
     *
     *    // As method
     *    Jet().use("name1", {"name2": {"options":"options"}}, function name3(){ ... }, ...rest)
     */
    use: function (all /* or list of plugins */) {
        var plugins = arguments;

        if (all === '*' || all === true) {
            plugins = fs.readdirSync(__dirname + '/plugins/');
        } else if (typeof all === "object") {
            plugins = all;
        }

        for (var i = 0, c = plugins.length, plugin; i < c; i += 1) {
            this._plugin(plugins[i]);
        }
        return this;
    },

    // Modified Remapped methods

    listen: function (a, b, c) {
        if (!arguments.length) {
            this.server.listen(80);
        } else {
            this.server.listen(a, b, c);
        }

        // plugin extension point @event function (jet);
        this.emit('listen', this);
        return this;
    },

    close: function () {
        this.server.close();

        // plugin extension point @event function (jet);
        this.emit('close', this);
        return this;
    },

    // 1:1 Remapped methods

    addListener:        function(event, listener)   {this.server.addListener(event, listener); return this},
    on:                 function(event, listener)   {this.server.on(event, listener); return this},
    once:               function(event, listener)   {this.server.once(event, listener); return this},
    removeListener:     function(event, listener)   {this.server.removeListener(event, listener); return this},
    removeAllListeners: function(event)             {this.server.removeAllListeners(event); return this},
    setMaxListeners:    function(n)                 {this.server.setMaxListeners(n); return this},
    listeners:          function(event)             {this.server.listeners(event); return this},
    emit:               function(event, args)       {this.server.emit.apply(this.server, arguments); return this}
};

// jQuery plugin style
Jet2.fn = http.ServerResponse.prototype;

// Shortcut
Jet2.__defineGetter__('$', function () {
    return Jet2('*');
});


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