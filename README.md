Jet
===

__Simple example__ - shortest ever REST server!

```javascript
require('jet').$(function Action($) {
    $.send($.METHOD + ': ' + $.PATH.action);
}).listen(); // That's all!
```

__More complex example__

```javascript
var $ = Jet('*'); // load all ('*') plugins

// jQeury-style plugins

// Add local plugins
$.fn.pewpew = function () { return "pewpew" };
$.fn.crudRouter = new CrudRouter(); // Mock CRUD Router

$('/:action?').get(function ($) {
    $.send($.PATH.action + ' ' + JSON.stringify($.GET));
});

// Uses plugin function pewpew
$('/pewpew').get(function ($) {
    $.send($.pewpew());
})
// Then Binds to DELETE method
.del(function ($) {
    $.send($.POST.id + ' deleted!');
});

// Binds to 4 main methods GET POST PUT DELETE
// Router '/:action' already exists - uses cache
$('/:action').crud(function ($) {
    $.crudRouter.action($.PATH.action, $);
});

// You can also use RegExp as selector
$(/^\/read\/[0-9]{1,5}$/).get(function ($) {
    $.send('pass');
});

$.listen(80); // same interface as http.Server#listen

// Print log info - see plugins stat for info
console.log($.stat(true));
```

Example
-------

See examples/ dir

Plugins
-------

All basic Jet plugins are located in `lib/plugins/`

 * `stat` - server, os, node statistics renderer (html and console views are supported)
 * `cookie` - cookie getter setter

__Its ease to include plugin___


```javascript
var Jet = require('../lib/jet.js'),
   $ = Jet('stat'); // stat plugin only

// $ = Jet('stat', 'cookie'); - for selected
// $ = Jet('*'); - for all plugins
$.stat();

// do stuff with plugins...
```

Plugin $.stat
-------------

`$.stat(type="console")` - prints server, os, node, routes statistics (`"html"` and `"console"` views are supported)
if type `"console"` stat prints all to STDOUT else returns as String

```bash
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
         ... more routes ...
```

Plugin $.cookie
---------------

Jet view methods:

 - `$.cookie(name, valueOrFalse, options)`
 - `$.addCookie(name, value, options)`
 - `$.setCookie(name, value, options)`
 - `$.removeCookie(name, options)`
 - `$.deleteCookie(name, options)`

see `examples/cookie.js` for more details

Plugin $.conf
-------------

Both jet view and jet methods:

 - `$.conf(name, value)` getter setter like jQuery attr
 - `$.conf.fromJSON(fileName)` load plain JSON file

see `examples/configure.js` for more details

Licence
-------

(The MIT License)

Copyright (c) 2011 azproduction <azazel.private@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.