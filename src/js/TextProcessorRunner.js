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
		textProcessor,
		a;

	outputText = inputText;

	for (a in regexpFlow.textProcessors) {
		if (regexpFlow.textProcessors.hasOwnProperty(a)) {

			/**
			 * @type {TextProcessor} textProcessor
			 */
			textProcessor = regexpFlow.textProcessors[a];

			if (textProcessor.isEnabled) {
				outputText = textProcessor.processText(inputText);
				inputText = outputText;
			}
		}
	}

	return outputText;
};