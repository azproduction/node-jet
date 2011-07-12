/**
 * Trait class
 */

function Trait(methods, allTraits) {
    allTraits = allTraits || [];
    this.traits = [methods];
    var extraTraits = methods.$traits;
    if (extraTraits) {
        if (typeof extraTraits === "string") {
            extraTraits = extraTraits.replace(/ /g, '').split(',');
        }
        for (var i = 0, c = extraTraits.length; i < c; i++) {
            this.use(allTraits[extraTraits[i]]);
        }
    }
}

Trait.prototype = {
    constructor: Trait,

    use: function (trait) {
        if (trait) {
            this.traits = this.traits.concat(trait.traits);
        }
        return this;
    },

    useBy: function (obj) {
        for (var i = 0, c = this.traits.length; i < c; i++) {
            var methods = this.traits[i];

            for (var prop in methods) {
                if (prop !== '$traits' && !obj[prop] && methods.hasOwnProperty(prop)) {
                    obj[prop] = methods[prop];
                }
            }
        }
    }
};

module.exports = Trait;
