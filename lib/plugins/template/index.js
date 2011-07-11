/**
 * template plugin
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */

var utils = require(__dirname + '/../../utils/utils.js'),
    TemplateCollection = require(__dirname + '/templateCollection.js');

/**
 *
 * @param {String} template
 * @param {Object} [data]
 * @param {String} [engine]
 */
function render(template, data, engine) {
    var templateMaker = this._templateEngines.find(template, engine);
    this.send(templateMaker.render(template, data));
    return this;
}

function renderFactory(engine) {
    return function (template, data) {
        this.render(template, data, engine);
        return this;
    };
}

module.exports = function (Jet, options) {
    Jet.fn._templateEngines = new TemplateCollection(options);
    // Jet    - jet plugin
    Jet.fn.render = render;

    // Add helper methods

    // handle (Jet, ['name', 'name']) or (Jet, {'name': 'val', 'name': 'val'})
    if (typeof options === "object") {
        for (var engine in options) {
            Jet.fn[engine] = renderFactory(engine);
        }

    // handle (Jet, 'name')
    } else if (typeof options === "string") {
        Jet.fn[options] = renderFactory(options);
    }
};