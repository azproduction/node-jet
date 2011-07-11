// Template example

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var helpers = {
    date: function () {
        return new Date();
    },
    escape: function (html) {
        // Copy-paste utils.escape
        return String(html)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
},

template = {
    simple: {
        path: __dirname + '/template',
        helpers: helpers
    }
};


var jet = require('../lib/jet.js');

// Create jet server with required plugins
// or we just can use .$
jet('router', 'stat', {template: template})

// we can skip '/'
// and type just .get(function () { ... })
.get('/', function ($) {

    $.render('index', {message: "Hello World!"});

})

// http://localhost/:action
.get(function Action($) {

    $.render('helpers', {message: "<b>Hello World!</b>"});

})


.listen() // Listen 0.0.0.0:80 by dafault
.stat();  // Prints statistics: Server, OS, Routes, Node.js