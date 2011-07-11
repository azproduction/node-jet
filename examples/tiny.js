// Tiny Jet example

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

// selector from handler's name
// Action -> "/:action";
// action -> "/action";
// action_Action -> "/action/:action"
// if handler is <anonymous> - "/" is used
// etc...
//
// Listens POST PUT DELETE GET /:action
// same as $.rest(function Action($) {...})
// same as $('/:action').rest(function ($) {...})

require('../lib/jet.js').$(function Action($) {
    $.send($.METHOD + ': ' + $.PATH.action);
})
.listen() // Listen 0.0.0.0:80 by dafault
.stat();  // Prints statistics: Server, OS, Routes, Node.js

/*
require('jet').$('/:action').rest(function($){$.send($.METHOD+$.PATH.action)}).listen()
                                                                                      ^
                                                                                      87 bytes -- Hmm

require('jet').$.rest(function Action($){$.send($.METHOD+$.PATH.action)}).listen()
                                                                                 ^
                                                                                 82 bytes -- OK

require('jet').$(function Action($){$.send($.METHOD+$.PATH.action)}).listen()
                                                                            ^
                                                                            77 bytes -- Yeah!
*/