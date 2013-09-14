'use strict';

Array.prototype.removeItem = function (itemToRemove) {

    var indexToRemove = -1,
        index;
    for (index in this) {
        if (this.hasOwnProperty(index) && this[index] == itemToRemove) {
            this.splice(indexToRemove, 1); // remove item at that index
            return;
        }
    }
};
