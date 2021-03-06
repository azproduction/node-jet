/**
 * @fileOverview Cookie plugin
 *
 * depends: cookie
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var ProviderInterface = require(__dirname + '/providerInterFace.js');

function sessionInit(providerName, options) {
    var ProviderConstructor = require(__dirname + '/provider/' + providerName + '/index.js');
    return new ProviderConstructor(options);
}

function session(key, valueOrCallback, callback) {
    var userId = this.cookie(this._session.SESSION_ID.toLowerCase()),
        self = this;

    if (!userId) {
        userId = Math.random() * 1e13;
        this.cookie(this._session.SESSION_ID, userId, {path: '/'});
    }

    this._session.isValidUserId(userId, function (err, isValid) {
        if (!isValid) {
            if (typeof callback === "function") {
                callback('User session id is invalid');
            }
            return;
        }

        // Handle $.session(false, callback) - clear session
        if (key === false) {
            self._session.clear(userId, key, callback);
            return;
        }

        // Handle $.session('name', callback) - get session
        if (typeof valueOrCallback === "function") {
            self._session.getItem(userId, key, valueOrCallback);
            return;
        }

        // Handle $.session('name', false, callback) - clear session item
        if (valueOrCallback === false) {
            self._session.removeItem(userId, key, callback);
            return;
        }

        // Handle $.session('name', 'value', callback) - set session item
        self._session.setItem(userId, key, valueOrCallback, callback);
    });

    return this;
}

module.exports = function (Jet, options) {
    // Jet    - jet plugin
    if (!Jet.fn.cookie) {
        throw new Error('Plugin session requires cookie plugin: $.use("cookie", "session")');
    }

    Jet.fn.session = session;
    if  (typeof options === "object") {
        Jet.fn._session = sessionInit(options.name || "local", options);
    } else {
        Jet.fn._session = sessionInit(options || "local", {});
    }
    // Jet.fn - jet view plugin
};