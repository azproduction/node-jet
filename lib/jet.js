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
    fs = require('fs');

var Jet = function () {
    var self = function () {
       return Jet.prototype._call.apply(self, arguments);
   };
   self.__proto__ = Jet.prototype;
   return Jet.prototype._init.apply(self, arguments);
};

Jet.prototype = {
    constructor: Jet,
    fn: http.ServerResponse.prototype,

    __proto__: Function.prototype,

    // Private methods

    _call: function () {
        // plugin extension point @event function (jet, arguments);
        this.emit('call', this, arguments);
        return this;
    },

    _init: function () {
        this.server = http.createServer();
        this._plugins = {};
        this.use.apply(this, arguments);

        // plugin extension point @event function (jet, arguments);
        this.emit('init', this, arguments);
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
            // Handle: $('name:options')
            case "string":
                var parts = data.split(':');
                if (parts.length === 2) {
                    plugins.push({
                        func: require(__dirname + '/plugins/' + parts[0] + '/index.js'),
                        name: parts[0],
                        options: parts[1]
                    });
                }  else {
                    plugins.push({
                        func: require(__dirname + '/plugins/' + data + '/index.js'),
                        name: data
                    });
                }
                break;

            // Handle: $({"name": optionsObject})
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
            options = plugin.options;

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
Jet.fn = http.ServerResponse.prototype;

// Shortcut
Jet.__defineGetter__('$', function () {
    return Jet('*');
});

module.exports = Jet;