'use strict';

function RegexpFlow() {
    /**
     * @type {Array|TextProcessor[]}
     */
    this.activities = [];
    // FIXME metody do modyfikacji tego?

    /**
     * @type {string}
     */
    this.description = '';
}

RegexpFlow.prototype.removeAllActivities = function () {
    this.activities.length = 0;
};
