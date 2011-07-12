/**
 * Index Controller
 */

var IndexController = {
    // use traits
    $traits: 'utils', // or 'name1,name2' or ['name1','name2']

    // controller level routes
    // 1. Controller name based   [low]
    // 2. Global routes           [med]
    // 3. Controller level routes [high]
    $routes: {
        yahoo: "GET /ya/:hoo?" // method is optional default is GET
    },

    _privateMethod: function () {

    },

    // will be mapped as "/" - index controller index action
    index: function ($) {

    },

    // will be mapped as "/ya/:hoo?" because of $routes
    yahoo: function ($) {

    },

    // will be mapped as "GET,PUT,POST,DELETE /info" - index controller info action
    restInfo: function ($) {

    },

    // will be mapped as "GET /bla/bla/bla" - index controller bla_bla_bla action
    bla_bla_bla: function ($) {

    }
};

module.exports = IndexController;
