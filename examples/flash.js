// Flash example
var Jet = require('../lib/jet.js');

// Create jet server with required plugins
// or we just can use .$
Jet('flash', 'stat')

// we can skip '/'
// and type just .get(function () { ... })
.get('/', function ($) {

    // Redirect directly
    $.redirect('/redirect');

})

// Redirects from any action to /redirect
// http://localhost/:action
.get(function Action($) {

    // Redirect via flash page
    // By default we are using /lib/plugins/flash/index.simple template
    $.flash('Redirect from ' + $.PATH.action + ' to /redirect', {
        location: '/redirect'
    });

})

// http://localhost/redirect
.get(function redirect($) {

    $.send('Flash end page');

})


.listen() // Listen 0.0.0.0:80 by dafault
.stat();  // Prints statistics: Server, OS, Routes, Node.js