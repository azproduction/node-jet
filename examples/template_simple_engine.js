// Template example

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var jet = require('../lib/jet.js');

// Create jet server with required plugins
// or we just can use .$
jet('router', {'template': 'simple'}, 'stat')

// can also use
// Jet('router', {'template': ['simple', 'ejs', 'jade']}, 'stat')
// Jet('router', {'template': {'simple': {'path': ''}}}, 'stat')
// Jet('router', {'template': {'simple': 'path'}}, 'stat')

// we can skip '/'
// and type just .get(function () { ... })
.get('/', function ($) {
    // Render by template engine name
    $.simple(__dirname + '/template/index.simple', {message: "Hello World!"});
})

// http://localhost/:action
.get(function Action($) {
    // Render by template engine name
    $.simple(__dirname + '/template/action.simple', $.PATH);
})


.listen() // Listen 0.0.0.0:80 by dafault
.stat();  // Prints statistics: Server, OS, Routes, Node.js