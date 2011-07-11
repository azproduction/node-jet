/**
 * Basic router plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var Selector = require(__dirname + '/selector.js'),
    Collection = require(__dirname + '/collection.js'),
    utils = require(__dirname + '/../../utils/utils.js');

var shortSelectorDispatcher = function (method, args) {
    var selectorOrNamedCallback = args[0],
        callback = args[1],
        callbackName;

    // handles $(...).get(function Name(){ })
    if (typeof selectorOrNamedCallback === "function") {
        callback = selectorOrNamedCallback;
        callbackName = selectorOrNamedCallback.name;

        if (callbackName) {
            this._selector = new Selector(utils.createSelectorFromHandlerName(callbackName), this._routesCollection);
        }
    } else {
        // handles $(...).get('/path/', function (){ })
        this._selector = new Selector(selectorOrNamedCallback, this._routesCollection);
    }

    this._selector.bind(method, callback);
    return this;
};

var hookDispatcher = function (jet, args) {
    // Handles $(function Name(){ });
    if (typeof args[0] === "function") {
        this.rest(args[0]);
        return;
    }

    // Handles $('/:selector');
    this._selector = new Selector(args[0], this._routesCollection);
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

var methods = {
    processRequest: function ($, request, requestBody) {
        $.embedRequest(request, requestBody);

        var callback = this.responseNotFound,
            route = this._routesCollection.find($.METHOD, $.url.pathname);

        if (route) {
            callback = route.callback;
            $.PATH = route.path;
        }

        callback($);
    },

    responseNotFound: function ($) {
        $.send(404);
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
    }
};

module.exports = function (Jet) {
    Jet.on('request', handleRequest.bind(Jet));
    Jet.on('call', hookDispatcher.bind(Jet));

    Jet._routesCollection = new Collection();
    Jet._selector = new Selector('/', Jet._routesCollection);

    Jet.processRequest = methods.processRequest;
    Jet.responseNotFound = methods.responseNotFound;
    Jet.bind = methods.bind;
    Jet.get = methods.get;
    Jet.post = methods.post;
    Jet.put = methods.put;
    Jet.del = methods.del;
    Jet.crud = methods.crud;
    Jet.rest = methods.crud;
};