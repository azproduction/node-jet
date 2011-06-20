/**
 * @fileOverview Action
 */

var Action = function () {
    this.actions = {};
};

Action.prototype._getPoint = function (pointName) {
    if (!this.actions[pointName]) {
        this.actions[pointName] = [];
    }

    return this.actions[pointName];
};

Action.prototype.add = function (pointName, actionCallback) {
    this._getPoint(pointName).push(actionCallback);
};

Action.prototype.execute = function (pointName) {
    var actions = this._getPoint(pointName);
    for (var i = 0, c = actions.length; i < c; i++) {
        actions[i]();
    }
};

module.exports = Action;