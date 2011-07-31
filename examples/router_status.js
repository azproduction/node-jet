// Handler status

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var jet = require('../lib/jet.js');

// Create jet server with required plugins
// or we just can use .$
jet('router', 'stat')

// status code handler 403
.status(403, function ($) {
    // it can return
    return "403: OhOh!";
})

// status code handler 404
.status(404, function ($) {
    // render or send
    $.send("<h1>404 &mdash; Not Found!</h1>");
})

// we can skip '/'
// and type just .get(function () { ... })
.get('/', function ($) {
    return 403;
})

// http://localhost/404
.get('/404', function ($) {
    return 404;
})

// http://localhost/Message
.get(function Message($) {
    return $.PATH.message;
})

.listen() // Listen 0.0.0.0:80 by dafault
.stat();  // Prints statistics: Server, OS, Routes, Node.js