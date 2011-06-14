// Light example
require('../lib/jet.js').$('/:action?').rest(function ($) {
    $.send($.METHOD + ': ' + $.PATH.action);
}).listen(); // That's all!
