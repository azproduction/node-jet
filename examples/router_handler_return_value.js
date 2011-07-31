// Handler return value example

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var jet = require('../lib/jet.js');

// Create jet server with required plugins
// or we just can use .$
jet('router', 'stat')

// we can skip '/'
// and type just .get(function () { ... })
.get('/', function ($) {
    return JSON.stringify($.GET);
})

// http://localhost/404
.get(function StatusCode($) {
    return +$.PATH.statuscode;
})

// http://localhost/asis/Message
.get(function asis_Message($) {
    return $.PATH.message;
})

.listen() // Listen 0.0.0.0:80 by dafault
.stat();  // Prints statistics: Server, OS, Routes, Node.js