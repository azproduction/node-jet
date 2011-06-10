var express = require('express');

var app = express.createServer();

var default_get = {pewpew: "pewpew"};
var base = {
    ololo: "ololo"
};

app.get('/:action?', function(req, res){
    res.send(JSON.stringify(req.params.pewpew || default_get.pewpew) + JSON.stringify(base.ololo));
});

app.listen(80);