/**
 * @fileOverview Jet
 */

var http = require('http'),
    normalize = require(__dirname + '/utils.js').normalize,
    parse = require('url').parse;

var mix = function (source, dest) {
    source.__proto__ = dest.__proto__;
    return source;
};

var merge = function (source, object) {
    for (var index in object) {
        if (object.hasOwnProperty(index)) {
            source[index] = object[index];
        }
    }
    return source;
};

var mixFactory = function (object) {
    return function (keyOrObject, value) {
        var items = {};

        if (typeof keyOrObject === 'string') {
            items[keyOrObject] = value;
        } else {
            items = keyOrObject;
        }

        merge((object || this).__proto__, items);
    }
};

var RouteMapper = function (selector, routes) {
    this._routes = routes;
    this._keys = [];
    this._selector = normalize(selector, this._keys, false);
};

RouteMapper.prototype.get = function (callback) {
    if (!this._routes.GET) {
        this._routes.GET = [];
    }
    this._routes.GET.push({callback: callback, selector: this._selector, keys: this._keys});
    return this;
};

var onRequest = function (jet) {
    return function (req, res) {
        var url = parse(req.url, true);

        var routes = jet._routes[req.method];
        if (routes) {
            for (var i = 0, c = routes.length; i < c; i += 1) {
                var result = routes[i].selector.exec(url.pathname);
                if (result) {
                    routes[i].callback(mix({res: res}, jet._mixins), mix(url.query, jet.GET));
                    return;
                }
            }
        }

        res.statusCode = 404;
        res.end();
    }
};

var JetPrototype = {
    listen: function (port, host) {
        this._httpServer.listen(port, host);
    }
};

var JetConstructor = function () {

    var jet = function (selector) {
        return new RouteMapper(selector, jet._routes);
    };

    jet._routes = {};
    jet._mixins = {__proto__:{}};

    jet.__proto__ = JetPrototype;

    jet.mix = mixFactory(jet._mixins);
    jet.GET = {__proto__: {}, mix: mixFactory()};

    jet._httpServer = http.createServer();
    jet._httpServer.on('request', onRequest(jet));

    return jet;
};

JetConstructor.jet = JetConstructor();

module.exports = JetConstructor;

