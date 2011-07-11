// Light example

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

require('../lib/jet.js').$('/:action?').rest(function ($) {
    $.send($.METHOD + ': ' + $.PATH.action);
}).listen().stat(); // That's all!