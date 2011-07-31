// Router hooks return value example
// Hooks can:
// 1. "patch" JetView
// 2. prevent action - validate action arguments, checks auth etc
// 3. Log requests
// ...

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var jet = require('../lib/jet.js');

// Create jet server with required plugins
// or we just can use .$
jet('router', 'stat')

// Hooks all
// Returns secret if passed and stops request
.hook('GET', /.*/, function ($) {
    // returns secret if passed
    if ($.GET.secret) {
        return "HOOKED! Secret is " + $.GET.secret;
    }
})

// Hooks /
// returns 403 if secret not passed
.hook('GET', '/', function ($) {
    if (!$.GET.secret) {
        return false; // same as return 403;
    } else {
        // skip all other hooks
        return true;
    }
})

// Hook as logger. Declare last to log all requests
.hook('GET', /.*/, function ($) {
    console.log('New request! ' + new Date());
})

// we can skip '/'
// and type just .get(function () { ... })
.get('/', function ($) {
    $.send("Pass!");
})
        
// http://localhost/Message
.get(function Message($) {
    // if message will be undefined request will never ends!
    return $.PATH.message || 'undefined';
})

.listen() // Listen 0.0.0.0:80 by dafault
.stat();  // Prints statistics: Server, OS, Routes, Node.js