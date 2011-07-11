/**
 * @fileOverview Cookie plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var utils = require(__dirname + '/../../utils/utils.js');

var initCookie = function (self) {
    if (!self._setCookie) {
        self._setCookie = [];

        // Create cookie before end
        self.once('beforeEnd', function () {
            self.setHeader('Set-Cookie', utils.serializeCookie(self._setCookie));
        });
    }
};

var cookieDispatcher = function (keyOrValue, value, options) {
    initCookie(this);

    // Handle $.cookie(); - Nope
    if (arguments.length === 0) {
        return;
    }

    if (arguments.length === 1) {
        // Handle $.cookie('name'); - Get Cookie
        if (typeof keyOrValue === "string") {
            return this._setCookie[keyOrValue] ||
                   this.COOKIE[keyOrValue];
        }
    }

    // Handle $.cookie('name', false); - Delete Cookie
    if (typeof keyOrValue === "string" && value === false) {
        options = options || {};
        options.expires = new Date(0);
        this._setCookie[keyOrValue] = {
            value: '',
            options: options
        };
        return this;
    }

    // Handle $.cookie('name', 'value', {expires: new Date(1e13), httpOnly: false}); - Set Cookie
    options = options || {};
    if ('maxAge' in options) {
        options.expires = options.maxAge;
    }
    this._setCookie[keyOrValue] = {
        value: value,
        options: options
    };
    return this;
};

var setCookie = function (key, value, options) {
    initCookie(this);

    // Handle $.cookie('name', 'value', {expires: new Date(1e13), httpOnly: false}); - Set Cookie
    options = options || {};
    if ('maxAge' in options) {
        options.expires = options.maxAge;
    }
    this._setCookie[key] = {
        value: value,
        options: options
    };
    return this;
};

var getCookie = function (key) {
    initCookie(this);

    // Handle $.cookie('name'); - Get Cookie
    return this._setCookie[key] ||
           this.COOKIE[key];
};

var removeCookie = function (key, options) {
    initCookie(this);

    // Handle $.cookie('name', false); - Delete Cookie
    options = options || {};
    options.expires = new Date(0);
    this._setCookie[key] = {
        value: '',
        options: options
    };
    return this;
};


module.exports = function (Jet) {
    // Jet    - jet plugin
    Jet.fn.cookie = cookieDispatcher;

    Jet.fn.setCookie = setCookie;
    Jet.fn.addCookie = setCookie;

    Jet.fn.getCookie = getCookie;

    Jet.fn.removeCookie = removeCookie;
    Jet.fn.deleteCookie = removeCookie;
    // Jet.fn - jet view plugin
};
