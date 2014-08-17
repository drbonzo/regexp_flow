'use strict';

function RegexpFlow() {
    /**
     * @type {Array|TextProcessor[]}
     */
    this.textProcessors = [];
    // FIXME metody do modyfikacji tego?

    /**
     * @type {string}
     */
    this.description = '';
}

RegexpFlow.prototype.removeAllActivities = function () {
    this.textProcessors.length = 0;
};
