'use strict';

function RegexpFlow() {
    /**
     * @type {Array|RegexpActivity[]}
     */
    this.activities = [];
}

RegexpFlow.prototype.removeAllActivities = function () {
    this.activities.length = 0;
};
