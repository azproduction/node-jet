/**
 * User Controller
 */

// 1. Own Routes:
// GET  /user                  -> UserController.index
// GET  /user/add              -> UserController.add
// POST /user/add              -> UserController.postAdd
// GET  /user/del              -> UserController.del
// GET  /user/yoho/:ho?        -> UserController['GET /yoho/:ho?']
//
// 2. Routes from traits:
// GET /user/common                -> UtilsTrait.common
// GET /user/pew/pew               -> UtilsTrait.pew_pew
// GET /user/common/from/mixins    -> MixinsTrait.common_from_mixins
//
var UserController = {
    // use traits
    $traits: 'utils', // or 'name1,name2' or ['name1','name2']

    _privateMethod: function () {

    },

    // will be mapped as "GET /user" - user controller index action
    index: function ($) {

    },

    // will be mapped as "GET /user/add" - user controller add action
    add: function ($) {

    },

    // will be mapped as "POST /user/add" - user controller add action
    postAdd: function ($) {

    },

    // will be mapped as "GET /user/del" - user controller del action
    del: function ($) {

    },

    // will be mapped as "GET /user/yoho/:ho?"
    "GET /yoho/:ho?": function ($) {

    }
};

module.exports = UserController;