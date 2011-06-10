var $ = require('../lib/jet.js').jet;

$.mix({
    ololo: "ololo"
});

$.GET.mix({pewpew: "pewpew"});

$('/:action?')
.get(function ($, GET) {
    var result = JSON.stringify(GET.pewpew) + JSON.stringify($.ololo);

    $.res.writeHead(200, {
        'X-Powered-By': 'Express',
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': result.length
    });
    $.res.end(result, 'utf-8');
});

$.listen(80);