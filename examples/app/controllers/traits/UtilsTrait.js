/**
 * Created by JetBrains WebStorm.
 * User: azproduction
 * Date: 12.07.11
 * Time: 17:20
 * To change this template use File | Settings | File Templates.
 */

var UtilsTrait = {
    // add sub traits
    $traits: 'mixins', // or 'name1,name2' or ['name1','name2']

    // public method can be accessed from
    // controller as own method
    _privateMethod: function () {

    },

    // will be mapped as controllers action
    // /<controller>/common
    common: function ($) {

    },

    // will be mapped as controllers action
    // /<controller>/pew/pew
    pew_pew: function ($) {

    }
};

module.exports = UtilsTrait;