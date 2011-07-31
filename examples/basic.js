// Basic example

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var jet = require('../lib/jet.js'),
    $ = jet('*'); // true or '*' - loads all plugins
                  // list of names - array ['stat', 'pewpew'] or list 'stat', 'pewpew'

// Add local plugin
$.fn.pewpew = function () {
    return "pewpew";
};

// Function name (onGetAction) will be displayed in stats
function onGetAction($) {
    var result = JSON.stringify($.GET) + JSON.stringify($.PATH) + $.pewpew();

    $.send(result);
}

// binds to all GET POST PUT DELETE
$('/:action?').rest(onGetAction);

// binds to GET
// handler - <anonymous>
$('/stat').get(function ($view) {
    // Send statistics
    $view.send('<pre>' + $.stat('html') + '</pre>');
});

$.listen(80);

// Print statistics using stat plugin
// true - console view
$.stat();

// Displayed as:
/*
$ node basic.js
 Server
 - Interface:           0.0.0.0:80
 - Connections:         0
 - uid:                 37007
 - gid:                 10513
 - pid:                 5076
 - Platform:            cygwin
 Node
 - Version:             v0.4.5
 - Working directory:   /home/azproduction/node-jet/examples
 - Require paths:       /home/azproduction/.node_modules
                        /home/azproduction/.node_libraries
                        /usr/local/lib/node
 Memory
 - Resident Size:       200 Mb
 - Virtual Size:        12 Mb
 - V8 Heap used/total:  1/4 Mb
 OS
 - Host name:           azprod_nb_w7
 - Name and version:    CYGWIN_NT-6.1-WOW64 1.7.9(0.237/5/3)
 - Uptime:              2h 15m (8125.27)
 - Load avg:            ???
 - Memory free/total:   0/3957 Mb
 - CPU:                 4X Intel(R) Core(TM) i5 CPU M 540 @ 2.53GHz
 Routes
 - /:action?:           POST onGetAction
                        GET onGetAction
                        PUT onGetAction
                        DELETE onGetAction
 - /stat:               GET <anonymous>
*/