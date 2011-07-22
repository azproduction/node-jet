/**
 * Index Controller
 */

// 1. Own Routes:
// GET /ya/:hoo?              -> IndexController.yahoo
// GET,PUT,POST,DELETE /info  -> IndexController.restInfo
// GET /                      -> IndexController.index
// GET /bla/bla/:bla          -> IndexController.bla_bla_Bla
//
// 2. Routes from traits:
// GET /common                -> UtilsTrait.common
// GET /pew/pew               -> UtilsTrait.pew_pew
// GET /common/from/mixins    -> MixinsTrait.common_from_mixins
//
var IndexController = {
    // use traits
    $traits: 'utils', // or 'name1,name2' or ['name1','name2']

    // controller level routes
    // 1. Controller name based   [low]
    // 2. Global routes           [med]
    // 3. Controller level routes [high]
    $routes: {
        yahoo: "GET /ya/:hoo?", // method is optional default is GET
        maskedMethod: null // mask method
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

    // will be masked
    maskedMethod: function ($) {

    },

    // will be mapped as "GET /bla/bla/:bla" - index controller bla_bla_Bla action
    bla_bla_Bla: function ($) {

    }
};

module.exports = IndexController;
