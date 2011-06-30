/**
 * @fileOverview Template Collection
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

var fs = require('fs');

/**
 * @constructor
 * @param {String|Array|Boolean|undefined} engines
 */
function TemplateCollection (engines) {
    this.engines = {};

    if (engines === '*' || engines === true || typeof engines === "undefined") {
        engines = fs.readdirSync(__dirname + '/engine/');
    }

    // Handle 'name' or {'name': 'value'}
    if (typeof engines === "string" || (typeof engines === "object" && !engines.length)) {
        this._engine(engines);
    } else { // Handle ['name', 'name']
        for (var i = 0, c = engines.length; i < c; i += 1) {
            this._engine(engines[i]);
        }
    }
}

/**
 * @param {String} template
 *
 * @returns {Object}
 */
TemplateCollection.prototype._engine = function (template) {
    var engines = [], i, c, engine, name, options;

    switch (typeof template) {

        case "string":
            engines.push({
                templateConstructor: require(__dirname + '/engine/' + template + '/index.js'),
                name: template
            });
            break;

        case "object":

            // Scan Object
            for (var index in template) {
                engines.push({
                    templateConstructor: require(__dirname + '/engine/' + index + '/index.js'),
                    name: index,
                    options: template[index]
                });
            }
            break;
    }

    for (i = 0, c = engines.length; i < c; i++) {
        engine = engines[i];
        name = engine.name;
        options = engine.options || {};

        // Don't override engine if exists
        if (!this.engines[name]) {
            this.engines[name] = new engine.templateConstructor(this, options);
        }
    }

    return this;
};

/**
 * @param {String} templatePath
 *
 * @returns {Object|undefined}
 */
TemplateCollection.prototype.find = function (templatePath, engine) {
    if (engine) {
        return this.engines[engine];
    }
    for (var templateName in this.engines) {
        if (this.engines[templateName].isMatchTemplate(templatePath)) {
            return this.engines[templateName];
        }
    }
};

module.exports = TemplateCollection;