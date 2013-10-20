'use strict';

function RegexpFlow() {
    /**
     * @type {Array|RegexpActivity[]}
     */
    this.activities = [];
    // FIXME metody do modyfikacji tego?
}

RegexpFlow.prototype.removeAllActivities = function () {
    this.activities.length = 0;
};
