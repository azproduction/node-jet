/**
 * @fileOverview Overridden basic http objects
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var http = require('http'),
    utils = require(__dirname + '/utils/utils.js'),
    BodyParser = utils.BodyParser,
    parseCookie = utils.parseCookie,
    parseUrl = require('url').parse;

// Shorthand
var fn = http.ServerResponse.prototype;

// Main charset
fn.CHARSET = 'utf8';

/**
 * Mergers request and requestBody into ServerResponse
 *
 * @param {ServerRequest} request
 * @param {String}        requestBody
 */
fn.embedRequest = function (request, requestBody) {
    var url = parseUrl(request.url, true);

    this.connection = request.connection;
    this.url = url;

    this.HEADERS = request.headers;
    this.METHOD = request.method;
    this.GET = url.query;
    this.POST = requestBody ? BodyParser.parse(request.headers['content-type'] || '', requestBody) : {};
    this.PATH = {};

    var cookie = request.headers.cookie;
    this.COOKIE = cookie ? parseCookie(cookie) : {};

    this.setHeader('Content-Type', 'text/html; charset=utf-8');
};

/**
 * Sends data and closes connection
 *
 * @param {Number|String} data
 */
fn.send = function (data) {
    if (typeof data === "number" && !isNaN(data)) {
        this.statusCode = data;
        data = http.STATUS_CODES[data] || '';
    }
    data = String(data);
    this.setHeader('Content-Length', Buffer.byteLength(data, fn.CHARSET));

    // Execute action beforeEnd
    this.emit('beforeEnd');

    this.end(data, fn.CHARSET);
};

/**
 * Sends escaped string and closes connection
 *
 * @param {String} data
 */
fn.text = function (data) {
    return this.send(utils.escape(data));
};

/**
 * Sends string and closes connection
 *
 * @param {String} data
 */
fn.html = function (data) {
    return this.send(String(data));
};

/**
 * Sends JSON and closes connection
 *
 * @param {String} data
 */
fn.json = function (data) {
    if (typeof data === "object") {
        this.send(JSON.stringify(data));
    } else {
        this.send(data);
    }
};

/**
 * Redirects to location
 *
 * @param {String} location
 */
fn.redirect = function (location) {
    this.writeHead(301, {'Location': location});

    // Execute action beforeEnd
    this.emit('beforeEnd');

    this.end();
};

module.exports = http;