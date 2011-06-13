var Jet = require('../lib/jet.js'),
    $ = Jet();

$.fn.pewpew = function(){
    return "pewpew";
};

function onGetAction ($) {
    var result = JSON.stringify($.GET) + JSON.stringify($.PATH) + $.pewpew();

    $.send(result);
}

$('/:action?').rest(onGetAction);

$('/stat').get(function ($) {
    $.send(200);
});

$.listen(80);

// Print statistics
console.log($.stat());