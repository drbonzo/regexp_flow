'use strict';

function TextProcessorRunner() {
}

/**
 * @param {RegexpFlow} regexpFlow
 * @param {String} inputText
 * @returns {String}
 */
TextProcessorRunner.prototype.processString = function (regexpFlow, inputText) {

	var outputText,
		activity,
		a;

	outputText = inputText;

	for (a in regexpFlow.activities) {
		if (regexpFlow.activities.hasOwnProperty(a)) {

			/**
			 * @type {TextProcessor} activity
			 */
			activity = regexpFlow.activities[a];

			if (activity.isEnabled) {
				outputText = activity.processText(inputText);
				inputText = outputText;
			}
		}
	}

	return outputText;
};