'use strict';

/*jslint eqeq: true*/

Array.prototype.removeItem = function (itemToRemove) {

	var index = this.indexOf(itemToRemove);
	var itemFoundInArray = (index != -1);
	if (itemFoundInArray) {
		this.splice(index, 1); // remove item at that index
	}
};
