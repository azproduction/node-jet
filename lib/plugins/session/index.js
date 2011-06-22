/**
 * @fileOverview Cookie plugin
 *
 * depends: cookie
 */

var SessionStorage = require(__dirname + '/session_storage.js');

function sessionInit(providerName, options) {
    var providerConstructor = require(__dirname + '/provider/' + providerName + '/index.js'),
        provider = new providerConstructor(options);

    if (!(provider instanceof SessionStorage)) {
        throw new Error('Bad provider "' + providerName + '" provider constructor must be an instanceof SessionStorage');
    }
    return provider;
}

function session (key, valueOrCallback, callback) {
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

module.exports = function (Jet) {
    // Jet    - jet plugin
    if (!Jet.fn.cookie) {
        throw new Error('Plugin session requires cookie plugin: $.use("cookie", "session")');
    }

    Jet.fn.session = session;
    Jet.sessionInit = function (providerName, options) {
        Jet.fn._session = sessionInit(providerName, options);
        return this;
    };
    // Jet.fn - jet view plugin
};