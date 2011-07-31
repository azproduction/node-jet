/**
 * Basic router plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var Selector = require(__dirname + '/selector.js'),
    Collection = require(__dirname + '/collection.js'),
    utils = require(__dirname + '/../../utils/utils.js');

var handleJetCall = function (jet, args) {
    // Handles $(function Name(){ });
    if (typeof args[0] === "function") {
        this.rest(args[0]);
        return;
    }

    // Handles $('/:selector');
    this._selector = new Selector(args[0], this._routesCollection);
};

var handleRequest = function (req, res) {
    // utf8
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

function bindMethodHelperFactory(method) {
    return function (selectorOrNamedCallback, callback) {
        return this.bind(method, selectorOrNamedCallback, callback);
    }
}

var methods = {
    processRequest: function ($, request, requestBody) {
        $.embedRequest(request, requestBody);

        var callback = this.responseNotFound,
            hooks = this._hooksCollection.findAll($.METHOD, $.url.pathname),
            route = this._routesCollection.find($.METHOD, $.url.pathname);

        if (route) {
            callback = route.callback;
            $.PATH = route.path;
        }
        // Check all hooks
        if (hooks) {
            for (var i = 0, c = hooks.length, hookResult; i < c; i++) {
                hookResult = hooks[i].callback($);
                // Handle return false - default action will be called
                if (hookResult === false) {
                    this.responseNotFound($);
                    return;
                }

                // Handle return 403 or return "string"
                if (typeof hookResult !== "undefined") {
                    $.send(hookResult);
                    return;
                }
            }
        }

        var value = callback($);

        // Accept returns status codes or strings
        if (typeof value !== "undefined") {
            $.send(value);
        }
    },

    responseNotFound: function ($) {
        $.send(404);
    },

    bind: function (method, selectorOrNamedCallback, callback) {
        //shortSelectorDispatcher.call(this, method, [selectorOrNamedCallback, callback]);
        if (method === 'CRUD' || method === 'REST') {
            this.bind('GET', selectorOrNamedCallback, callback);
            this.bind('POST', selectorOrNamedCallback, callback);
            this.bind('PUT', selectorOrNamedCallback, callback);
            this.bind('DELETE', selectorOrNamedCallback, callback);
            return this;
        }
        var callbackName,
            selector;

        // handles $(...).get(function Name(){ })
        if (typeof selectorOrNamedCallback === "function") {
            callback = selectorOrNamedCallback;
            callbackName = selectorOrNamedCallback.name;

            if (this._baseSelector === this._selector && callbackName) {
                selector = new Selector(utils.createSelectorFromHandlerName(callbackName), this._routesCollection);
            }
        } else {
            // handles $(...).get('/path/', function (){ })
            selector = new Selector(selectorOrNamedCallback, this._routesCollection);
        }

        (selector || this._selector).bind(method, callback);
        return this;
    },

    // Shorthand methods
    get: bindMethodHelperFactory('GET'),
    post: bindMethodHelperFactory('POST'),
    put: bindMethodHelperFactory('PUT'),
    del: bindMethodHelperFactory('DELETE'),
    crud: bindMethodHelperFactory('CRUD'),
    rest: bindMethodHelperFactory('REST')
};

module.exports = function (Jet) {
    Jet.on('request', handleRequest.bind(Jet));
    Jet.on('call', handleJetCall.bind(Jet));

    Jet._routesCollection = new Collection();
    Jet._hooksCollection = new Collection();
    Jet._selector = new Selector('/', Jet._routesCollection, Jet._hooksCollection);
    Jet._baseSelector = Jet._selector;

    Jet.processRequest = methods.processRequest;
    Jet.responseNotFound = methods.responseNotFound;
    Jet.bind = methods.bind;
    Jet.get = methods.get;
    Jet.post = methods.post;
    Jet.put = methods.put;
    Jet.del = methods.del;
    Jet.crud = methods.crud;
    Jet.rest = methods.rest;
};