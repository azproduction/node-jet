/**
 * app plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var fs = require('fs'),
    Trait = require(__dirname + '/lib/Trait.js'),
    Controller = require(__dirname + '/lib/Controller.js');

var App = function (jet, options) {
    options = options || {};
    options.path = options.path || {};
    this.jet = jet;

    this.routes = options.routes || {};

    this.path = {};
    this.path.models = options.path.models || './models/';
    this.path.controllers = options.path.controllers || './controllers/';
    this.path.traits = options.path.traits || './controllers/traits/';
    this.path.views = options.path.views || './views/';
    this.path.helpers = options.path.helpers || './views/helpers/';

    this.views = {};
    this.models = {};
    this.controllers = {};
    this.traits = {};
    this.helpers = {};

    // Note: keep call order!
    this._initHelpers();
    this._initTraits();
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
    _methodsExpression: /^(?:get|post|put|del|delete|rest|crud)/i,
    _validJavaScriptName: /^[a-zA-Z_$][a-zA-Z_$0-9]*$/i,

    _extractName: function (string) {
        string = string.split('/');
        string = (string.length < 1 ? string : string.pop.split('.'))[0];
        // Extract name without Model or Controller suffix
        string = string.replace(/(Controller|Model|Helper|Trait)$/, '');
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    _extractMethodAndAction: function (string) {
        var method = string.match(this._methodsExpression),
            action,
            indexFrom;

        method = method[0].toLowerCase();
        action = string.replace(this._methodsExpression, '');

        // get post put delete rest crud actions
        if (action === '') {
            return ['get', method];
        }

        // action can be valid js name or path
        // method is already extracted
        if (action.match(this._validJavaScriptName)) {
            // 1. valid name
            // Smth     - GET /smth
            // PewPew  - POST /pewpew
            // _Abc_def - GET /:abc/def
            // Abc_Def  - GET /abc/:def
            // _Abc_Def - GET /:abs/:def
            // _abc_def - GET /abs/def
            // Abc_def  - GET /abs/def

            // Handles: _Abc_def

            // fix multislashes
            action = action.replace(/_+/g, '_');

            var actionParts = action.split('_');

            // case _Abc or _abc
            if (actionParts[0] === '') {
                if (actionParts[1].charAt(0) === actionParts[1].charAt(0).toUpperCase()) {
                    actionParts[1] = ':' + actionParts[1];
                }
                indexFrom = 2;
            } else {
                // case Abc or abc
                indexFrom = 1;
            }

            for (var i = indexFrom, c = actionParts.length; i < c; i++) {
                if (actionParts[i].charAt(0) === actionParts[i].charAt(0).toUpperCase()) {
                    actionParts[i] = ':' + actionParts[i];
                }
            }

            action = actionParts.join('/').toLowerCase();
        } else {
            // 2. path
            // " /smth/pewpew" // leading space
            // "/smth/pewpew"
            // " /smth/:pewpew?"
            // etc
            // trim lead space
            action = action.replace(/^\s+/g, '');
        }

        // trim lead slashes
        action = action.replace(/^\/+/, '');

        if (method === 'delete') {
            method = 'del';
        }
        if (!method) {
            method = 'get';
        }
        return [method, action];
    },


    _initControllers: function () {
        try {
            var controllers = fs.readdirSync(this.path.controllers);
        } catch (e) {
            return;
        }

        for (var i = 0, c = controllers.length; i < c; i += 1) {
            this.addController(controllers[i]);
        }
    },

    _initTraits: function () {
        try {
            var traits = fs.readdirSync(this.path.traits);
        } catch (e) {
            return;
        }

        for (var i = 0, c = traits.length; i < c; i += 1) {
            this.addTrait(traits[i]);
        }
    },

    _initHelpers: function () {
        try {
            var helpers = fs.readdirSync(this.path.helpers);
        } catch (e) {
            return;
        }

        for (var i = 0, c = helpers.length; i < c; i += 1) {
            this.addHelper(helpers[i]);
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
        try {
            var models = fs.readdirSync(this.path.models);
        } catch (e) {
            return;
        }

        for (var i = 0, c = models.length; i < c; i += 1) {
            this.addModel(models[i]);
        }
    },

    _initSession: function (sessionOptions) {
        this.jet.use({"session": sessionOptions});
    },

    _prepareController: function (object) {
        if (object.constructor !== Object) {
            return object;
        }
        var traits = object.$traits,
            extraTraits = [];

        if (traits) {
            if (typeof traits === "string") {
                traits = traits.replace(/ /g, '').split(',');
            }
            for (var i = 0, c = traits.length; i < c; i++) {
                extraTraits.push(this.traits[traits[i]]);
            }
        }
        return new Controller(object, extraTraits);
    },

    _getMethodAndSelector: function (controllerName, actionName, controllerLevelRoutes) {
        var methodAndAction = this._extractMethodAndAction(actionName),
            selector,

        // 1. High-prior Routers: Controller level routes
            controllerRoute = controllerLevelRoutes[actionName];

        // 2. Mid-prior Routers: Global routes
        if (controllerRoute === "undefined" && this.routes[controllerName]) {
            controllerRoute = this.routes[controllerName][actionName];
        }

        if (typeof controllerRoute !== "undefined") {
            // Handles: regexps, null /pew?pew/i null
            if (controllerRoute instanceof RegExp || typeof controllerRoute === "number" || controllerRoute === null) {
                return ['get', controllerRoute];
            }

            // Handles: ['get', '/pewpew'] or
            //          ['get', /pew?pew/i]
            if (typeof controllerRoute === "object" && controllerRoute.length === 2) {
                controllerRoute[0] = controllerRoute[0].toLowerCase();
                return controllerRoute;
            }

            // Handles: 'GET /pewpew' or 'post /pewpew'
            controllerRoute = controllerRoute.replace(/\s+/g, ' ').split(' ');

            // Handles: '/pewpew'
            if (controllerRoute.length === 1) {
                controllerRoute.unshift('get');
            }
            controllerRoute[0] = controllerRoute[0].toLowerCase();
            return controllerRoute;
        }

        // 3. Low-prior Routers: Controller action-name-based
        if (controllerName === 'index') {
            // IndexController index action
            // METHOD /
            if (methodAndAction[1] === 'index') {
                selector = '/';
            } else {
                // IndexController other action
                // METHOD /action or
                // METHOD /action/suffix
                selector = '/' + methodAndAction[1];
            }
        } else if (methodAndAction[1] === 'index') {
            // index action: METHOD /controller
            selector = '/' + controllerName;
        } else {
            // other action: METHOD /controller/action or
            //               METHOD /controller/action/suffix
            selector = '/' + controllerName + '/' + methodAndAction[1];
        }

        return [methodAndAction[0], selector];
    },

    _mapController: function (name, object) {
        var controllerLevelRoutes = object.$routes || {},
            handler;

        // create /controller/action routes
        for (var action in object) {
            if (object.hasOwnProperty(action)) {
                handler = object[action];

                // ignore non functions and partials/privates
                if (action.charAt(0) !== '$' && action.charAt(0) !== '_' && typeof handler === "function") {
                    var methodAndSelector = this._getMethodAndSelector(name, action, controllerLevelRoutes);

                    // skip masked method
                    if (methodAndSelector[1] !== null) {
                        this.jet[methodAndSelector[0]](methodAndSelector[1], function ($) {
                            return object[action]($);
                        });
                    }
                }
            }
        }
    },

    addController: function (pathOrName, controller) {
        var name = this._extractName(pathOrName).toLowerCase(),
            object;

        // Handle: "path/to/controller.js"
        if (typeof controller === "undefined") {
            object = require(pathOrName);
        } else {
            // Handle: "name", {}
            object = controller;
        }
        object = this._prepareController(object);
        this.controllers[name] = object;
        this._mapController(name, object);
    },

    _prepareTrait: function (object) {
        if (object.constructor !== Object) {
            return object;
        }
        return new Trait(object, this.traits);
    },

    addTrait: function (pathOrName, trait) {
        var name = this._extractName(pathOrName).toLowerCase(),
            object;

        // Handle: "path/to/trait.js"
        if (typeof trait === "undefined") {
            object = require(pathOrName);
        } else {
            // Handle: "name", {}
            object = trait;
        }
        object = this._prepareTrait(object);
        this.traits[name] = object;
    },


    addHelper: function (pathOrName, helper) {
        var name = this._extractName(pathOrName).toLowerCase(),
            object;

        // Handle: "path/to/helper.js"
        if (typeof helper === "undefined") {
            object = require(pathOrName);
        } else {
            // Handle: "name", {}
            object = helper;
        }

        if (typeof object === "function") {
            this.traits[name] = object;
        } else {
            for (var helperName in object) {
                if (!this.traits[helperName] && object.hasOwnProperty(helperName)) {
                    this.traits[helperName] = object[helperName];
                }
            }
        }
    },


    addModel: function (pathOrName, model) {
        var name = this._extractName(pathOrName),
            object;

        // Handle: "path/to/model.js"
        if (typeof model === "undefined") {
            object = require(pathOrName);
        } else {
            // Handle: "name", {}
            object = model;
        }

        this.models[name] = object;
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