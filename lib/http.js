/**
 * @fileOverview Overridden basic http objects
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

var http = require('http'),
    utils = require(__dirname + '/utils/utils.js'),
    BodyParser = utils.BodyParser,
    parseCookie = utils.parseCookie,
    Action = require(__dirname + '/action.js'),
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

    var cookie = request.headers['cookie'];
    this.COOKIE = cookie ? parseCookie(cookie) : {};

    // List before End Actions
    this.action = new Action();

    this.setHeader('Content-Type', 'text/html; charset=utf-8');
};

/**
 * Sends data and closes connection
 *
 * @param {Number|String} data
 */
fn.send = function (data) {
    if (typeof data === "number") {
        this.statusCode = data;
        data = http.STATUS_CODES[data] || '';
    }
    this.setHeader('Content-Length', Buffer.byteLength(data, fn.CHARSET));

    // Execute action beforeEnd
    this.action.execute('beforeEnd');
    this.end(data, fn.CHARSET);
};

module.exports = http;