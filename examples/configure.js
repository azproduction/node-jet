// Conf Example

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

require('../lib/jet.js').$

.conf.fromJSON('./configure/config.json')
.conf('localConfig', true)

// dumps all config http://localhost/
.get(function ($) {

    $.send(JSON.stringify($.conf()));

})

// dumps config by name http://localhost/conf/:name
.get(function conf_Name($) {

    $.send('' + $.conf($.PATH.name));

})

// listen and print stat
.listen().stat();