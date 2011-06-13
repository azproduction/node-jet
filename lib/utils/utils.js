/**
 * @fileOverview Utils
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

var qs = require('querystring');

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp} path
 * @param  {Array} keys
 * @param  {Boolean} sensitive
 * @return {RegExp}
 *
 * @author TJ Holowaychuk
 * @licence MIT
 */
function normalize(path, keys, sensitive) {
    if (path instanceof RegExp) return path;

    path = path
        .concat('/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
            keys.push({ name: key, optional: !! optional });
            slash = slash || '';
            return ''
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || '([^/]+?)') + ')'
                + (optional || '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.+)');

    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}

/**
 * Parse the given cookie string into an object.
 *
 * @param  {String}    str
 * @param  {undefined} [undefined=undefined]
 * @return {Object}
 *
 * @author TJ Holowaychuk
 * @licence MIT
 */
var parseCookie = function(str, undefined) {
    var obj = {},
        pairs = str.split(/[;,] */);

    for (var i = 0, c = pairs.length; i < c; i += 1) {
        var pair = pairs[i],
            eqlIndex = pair.indexOf('='),
            key = pair.substr(0, eqlIndex).trim().toLowerCase(),
            val = pair.substr(++eqlIndex, pair.length).trim();

        // Quoted values
        if (val[0] === '"') {
            val = val.slice(1, -1);
        }

        // Only assign once
        if (obj[key] === undefined) {
            obj[key] = decodeURIComponent(val.replace(/\+/g, ' '));
        }
    }
    return obj;
};

/**
 * Body parser
 */
var BodyParser = {
    parsers: {
        'application/x-www-form-urlencoded': qs.parse,
        'application/json': JSON.parse
    },
    parse: function (contentType, body) {
        var parser = this.parsers[contentType];
        try {
            return parser(body);
        } catch (e) {
            return {};
        }
    }
};

exports.normalize = normalize;
exports.parseCookie = parseCookie;
exports.BodyParser = BodyParser;