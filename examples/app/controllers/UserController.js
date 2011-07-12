/**
 * User Controller
 */

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

    // will be mapped as "POST /user/add" - user controller add action
    del: function ($) {

    }
};

module.exports = UserController;