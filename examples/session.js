// Session example

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var jet = require('../lib/jet.js'),
    // Create jet server with required plugins
    // Creates session with provider `local`
    // @see lib/plugins/session/provider/local/index.js
    // All session functions are asynchronous
    $ = jet('router', 'cookie', {'session': 'local'}, 'stat');

// Add session
// http://localhost/add/:name/:value
$.get(function add_Name_Value($) {

    // add session
    $.session($.PATH.name, $.PATH.value, function (err) {
        $.send(!err ? 'Session added ' + $.PATH.name + '=' + $.PATH.value : 'Error');
    });

})

// Get session
// http://localhost/get/:name/
.get(function get_Name($) {

    // get session if exists
    $.session($.PATH.name, function (err, value) {
        $.send(value ? 'Session ' + $.PATH.name + '=' + value : 'Nothing');
    });

})

// Remove session
// http://localhost/remove/:name
.get(function remove_Name($) {

    // remove session if exists
    $.session($.PATH.name, false, function (err, result) {
        $.send(result ? 'Session ' + $.PATH.name + ' deleted' : 'Nothing');
    });

})

.listen() // Listen 0.0.0.0:80 by dafault
.stat();  // Prints statistics: Server, OS, Routes, Node.js