// Cookie Example

require('../lib/jet.js').$

// http://localhost/add/:name/:cookie
.get(function add_Name_Cookie($) {

    // set cookie if blank
    if (!$.COOKIE[$.PATH.name]) {
        $.setCookie($.PATH.name, $.PATH.cookie, {path: '/'});
        $.send('Add Cookie: ' + $.PATH.name + '=' + $.PATH.cookie);
    } else {
        $.send('nothing');
    }

})

// http://localhost/remove/:name/:cookie
.get(function remove_Name_Cookie($) {

    // remove cookie if exists
    if ($.COOKIE[$.PATH.name]) {
        $.removeCookie($.PATH.name, {path: '/'});
        $.send('Remove Cookie: ' + $.PATH.name + '=' + $.PATH.cookie);
    } else {
        $.send('nothing');
    }

})

// listen and print stat
.listen().stat();