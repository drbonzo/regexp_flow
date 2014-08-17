'use strict';

/*global TextProcessor */

/**
 * @param {string} searchString
 * @constructor
 */
function RegexpMatchLineTextProcessor(searchString) {

    this.displayName = 'Match lines';
    this.typeName = 'RegexpMatchLineTextProcessor';

    /**
     * @type {string}
     */
    this.searchString = searchString;

    /**
     * @type {boolean}
     */
    this.searchFlagCaseInsensitive = false;

    /**
     * @type {number}
     */
    this.totalLinesCount = 0;

    /**
     * @type {number}
     */
    this.linesMatchedCount = 0;

    /**
     * If true - then we discard lines matching regexp
     * @type {boolean}
     */
    this.flagInvertMatch = false;
}

RegexpMatchLineTextProcessor.prototype = new TextProcessor();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpMatchLineTextProcessor.prototype.processText = function (inputText) {

    var line,
        lines,
        matchedLines,
        searchRegexp,
        l;
    try {

        this.resetRegExpValidation();
        lines = this.splitTextIntoLines(inputText);
        this.totalLinesCount = lines.length;
        this.linesMatchedCount = 0;

        if (!this.searchString) {
            this.linesMatchedCount = this.totalLinesCount;
            return inputText; // dont change anything when there is no regular expression
        }

        matchedLines = [];

        searchRegexp = this.buildRegExp(this.searchString, this.searchFlagCaseInsensitive, null, null);

        for (l in lines) {
            if (lines.hasOwnProperty(l)) {
                line = lines[l];

                if (this.flagInvertMatch) {
                    if (!line.match(searchRegexp)) {
                        matchedLines.push(line);
                    }
                } else {
                    if (line.match(searchRegexp)) {
                        matchedLines.push(line);
                    }
                }
            }
        }

        this.linesMatchedCount = matchedLines.length;

        return matchedLines.join("\n");
    } catch (e) {
        throw this.setupValidationFromError(e);
    }
};

RegexpMatchLineTextProcessor.prototype.initializeFromObject = function (dataObject) {
    this.copyPropertiesFrom(dataObject, this.getSerializablePropertyNames());
};

RegexpMatchLineTextProcessor.prototype.getExportObject = function () {
    return this.extractPropertiesToObject(this.getSerializablePropertyNames());
};

/**
 * @returns {Array|string[]}
 */
RegexpMatchLineTextProcessor.prototype.getSerializablePropertyNames = function () {
    return ['searchString', 'searchFlagCaseInsensitive', 'flagInvertMatch', 'isEnabled', 'description'];
};