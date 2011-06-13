Jet
===

    var $ = Jet();
    
    // jQeury-style plugins
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

Example
-------

See examples basic.js

`node basic.js`

Licence
-------

(The MIT License)

Copyright (c) 2011 azproduction <azazel.private@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.