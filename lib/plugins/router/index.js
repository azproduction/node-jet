/**
 * Basic router plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var Selector = require(__dirname + '/selector.js'),
    Collection = require(__dirname + '/collection.js'),
    utils = require(__dirname + '/../../utils/utils.js');

var handleJetCall = function (jet, args) {
    // Handles $(function Name(){ });
    if (typeof args[0] === "function" && !(args[0] instanceof RegExp)) {
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

function bindOrHookFactory(action) {
    return function (method, selectorOrNamedCallback, callback) {
        //shortSelectorDispatcher.call(this, method, [selectorOrNamedCallback, callback]);
        if (method === 'CRUD' || method === 'REST') {
            this[action]('GET', selectorOrNamedCallback, callback);
            this[action]('POST', selectorOrNamedCallback, callback);
            this[action]('PUT', selectorOrNamedCallback, callback);
            this[action]('DELETE', selectorOrNamedCallback, callback);
            return this;
        }
        var callbackName,
            selector;

        // handles $(...).get(function Name(){ })
        if (typeof selectorOrNamedCallback === "function" && !(selectorOrNamedCallback instanceof RegExp)) {
            callback = selectorOrNamedCallback;
            callbackName = selectorOrNamedCallback.name;

            if (this._baseSelector === this._selector && callbackName) {
                selector = new Selector(utils.createSelectorFromHandlerName(callbackName), this._routesCollection, this._hooksCollection);
            }
        } else {
            // handles $(...).get('/path/', function (){ })
            selector = new Selector(selectorOrNamedCallback, this._routesCollection, this._hooksCollection);
        }

        if (selector) {
            selector[action](method, callback);
        } else {
            this._selector[action](method, callback);
        }
        return this;
    };
}

var methods = {
    processRequest: function ($, request, requestBody) {
        $.embedRequest(request, requestBody);

        var callback,
            hooks = this._hooksCollection.findAll($.METHOD, $.url.pathname),
            route = this._routesCollection.find($.METHOD, $.url.pathname),
            value;

        if (route) {
            callback = route.callback;
            $.PATH = route.path;
        }
        // Check all hooks
        if (hooks) {
            for (var i = 0, c = hooks.length, hookResult; i < c; i++) {
                hookResult = hooks[i].callback($);

                // @todo it may change
                // Handle return false - return default 403
                if (hookResult === false) {
                    this.status(403, $);
                    return;

                // Handle return true - skip all hooks
                } else if (hookResult === true) {
                    break;
                }

                // Handle return 403 404 ... or return "string"
                if (typeof hookResult !== "undefined") {
                    // Handle: handler returns number -> use status code handlers
                    if (typeof hookResult === "number" && !isNaN(hookResult)) {
                        this.status(hookResult, $);
                    } else {
                        // Handle: handler return not number nor undefined -> send as is
                        $.send(hookResult);
                    }
                    return;
                }
            }
        }

        if (callback) {
            value = callback($);

            // Accept returns status codes or strings
            if (typeof value !== "undefined") {
                // Handle: handler returns number -> use status code handlers
                if (typeof value === "number" && !isNaN(value)) {
                    this.status(value, $);
                } else {
                    // Handle: handler return not number nor undefined -> send as is
                    $.send(String(value));
                }
            }
        } else {
            // callback not found
            this.status(404, $);
        }
    },

    status: function (statusCode, callbackOrJetView) {
        // Handle status(404, function(){})
        if (typeof callbackOrJetView === "function" && !(callbackOrJetView instanceof RegExp)) {
            this._status[statusCode] = callbackOrJetView;
        } else {
            if (this._status[statusCode]) {
                var value = this._status[statusCode](callbackOrJetView, statusCode);
                // Accept returns status codes or strings
                if (typeof value !== "undefined") {
                    callbackOrJetView.send(value);
                }
            } else {
                callbackOrJetView.send(statusCode);
            }
        }
        return this;
    },

    bind: bindOrHookFactory('bind'),
    hook: bindOrHookFactory('hook'),

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
    Jet._status = {};

    Jet.processRequest = methods.processRequest;
    Jet.bind = methods.bind;
    Jet.hook = methods.hook;
    Jet.get = methods.get;
    Jet.post = methods.post;
    Jet.put = methods.put;
    Jet.del = methods.del;
    Jet.crud = methods.crud;
    Jet.rest = methods.rest;

    Jet.status = methods.status;
};