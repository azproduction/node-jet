/**
 * Created by JetBrains WebStorm.
 * User: azproduction
 * Date: 12.07.11
 * Time: 17:24
 * To change this template use File | Settings | File Templates.
 */

/**
 * Creates two or third level controller
 *
 * @param methods
 * @param traits
 */
function Controller(methods, traits) {
    if (typeof traits === "string") {
        traits = [traits];
    }
    traits = traits || [];

    for (var method in methods) {
        if (methods.hasOwnProperty(method)) {
            this[method] = methods[method];
        }
    }

    for (var i = 0, c = traits.length; i < c; i++) {
        traits[i].useBy(this);
    }
}