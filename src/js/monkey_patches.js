'use strict';

/*jslint eqeq: true*/

Array.prototype.removeItem = function (itemToRemove) {

    var index;
    for (index in this) {
        if (this.hasOwnProperty(index) && this[index] == itemToRemove) {
            this.splice(index, 1); // remove item at that index
            return;
        }
    }
};
