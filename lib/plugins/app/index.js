/**
 * app plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var fs = require('fs');

var App = function (jet, options) {
    options = options || {};
    options.path = options.path || {};
    this.jet = jet;
    this.path = {};
    this.path.models = options.path.models || './models/';
    this.path.controllers = options.path.controllers || './controllers/';
    this.path.views = options.path.views || './views/';

    this._initModels();
    this._initViews(options.template);
    this._initSession(options.session);
    this._initControllers();

    if (options.autorun) {
        this.run();
    }
};

App.prototype = {
    constructor: App,
    _methodsExpression: /^(?:get|post|put|delete|rest|crud)/i,
    _extractName: function (string) {
        string = string.split('/');
        string = (string.length < 1 ? string : string.pop.split('.'))[0];
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    _extractMethodAndAction: function (string) {
        var method = string.match(this._methodsExpression),
            action;

        if (!method) {
            return ['GET', string.toLowerCase()];
        }
        method = method[0].toUpperCase();
        action = string.replace(method, '')
                .replace(/_/g, '/')
                .replace(/\/\//g, '/')
                .toLowerCase();

        return [method, action];
    },
    _initControllers: function () {
        var controllers = fs.readdirSync(this.path.controllers);

        for (var i = 0, c = controllers.length; i < c; i += 1) {
            this.addController(controllers[i]);
        }
    },
    _initViews: function (templateEngine) {
        if (templateEngine) {
            // Init only one template engine
            this.jet.use({
                "template": {
                    name: templateEngine,
                    path: this.path.views
                }
            });
        } else {
            // Init all engines with same options
            this.jet.use({
                "template": {
                    "*": {
                        path: this.path.views
                    }
                }
            });
        }
    },
    _initModels: function () {
        var models = fs.readdirSync(this.path.models);

        for (var i = 0, c = models.length; i < c; i += 1) {
            this.addModel(models[i]);
        }
    },
    _initSession: function (sessionOptions) {
        this.jet.use({"session": sessionOptions});
    },
    addController: function (pathOrName, controller) {
        var name = this._extractName(pathOrName).toLowerCase(),
            object,
            methodAndAction,
            handler;

        // Handle: "path/to/controller.js"
        if (typeof controller === "undefined") {
            object = require(pathOrName);
        } else {
            // Handle: "name", {}
            object = controller;
        }

        // create /controller/action routes
        for (var action in object) {
            if (object.hasOwnProperty(action)) {
                handler = object[action];

                // ignore non functions and partials/privates
                if (action.charAt(0) !== '_' &&  typeof handler === "function") {
                    methodAndAction = this._extractMethodAndAction(action);
                    if (methodAndAction[1] === 'index') {
                        // index action: METHOD /controller
                        this.jet.bind(methodAndAction[0], '/' + name, handler);
                    } else {
                        // other action: METHOD /controller/action or
                        //               METHOD /controller/action/suffix
                        this.jet.bind(methodAndAction[0], '/' + name + '/' + methodAndAction[1], handler);
                    }
                }
            }
        }
    },
    addModel: function (pathOrName, model) {
        var name = this._extractName(pathOrName),
            object;

        // Handle: "path/to/controller.js"
        if (typeof model === "undefined") {
            object = require(pathOrName);
        } else {
            // Handle: "name", {}
            object = model;
        }

        if (!this.jet.fn[name]) {
            this.jet.fn[name] = object;
        }
    },
    listen: function () {
        this.jet.listen.apply(this.jet, arguments);
    }
};

App.prototype.run = App.prototype.listen;

module.exports = function (Jet, options) {
    options = options || {};
    options.path = options.path || {};

    Jet.use("router", "cookie", "flash");

    Jet.app = new App(Jet, options);
};