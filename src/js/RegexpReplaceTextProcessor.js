'use strict';

/*jslint eqeq: true*/
/*global TextProcessor */

/**
 * @param {string} searchString
 * @param {string} replaceString
 * @constructor
 */
function RegexpReplaceTextProcessor(searchString, replaceString) {

    this.displayName = 'Replace in text';
    this.typeName = 'RegexpReplaceTextProcessor';

    /**
     * @type {string}
     */
    this.searchString = searchString;

    /**
     * @type {string}
     */
    this.replaceString = replaceString;

    /**
     * We almost always want to replace everything
     *
     * @type {boolean}
     */
    this.searchFlagGlobal = true;

    /**
     * @type {boolean}
     */
    this.searchFlagCaseInsensitive = false;

    /**
     * @type {boolean}
     */
    this.searchFlagMultiline = false;

    /**
     * @type {number}
     */
    this.replacementsCount = 0;
}

RegexpReplaceTextProcessor.prototype = new TextProcessor();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpReplaceTextProcessor.prototype.processText = function (inputText) {

    var searchRegexp,
        matches,
        replacement;
    try {

        this.resetRegExpValidation();
        this.replacementsCount = 0;

        if (!this.searchString) {
            return inputText; // dont change anything when there is no regular expression
        }

        searchRegexp = this.buildRegExp(this.searchString, this.searchFlagCaseInsensitive, this.searchFlagGlobal, this.searchFlagMultiline);
        matches = inputText.match(searchRegexp);
        this.replacementsCount = (matches ? matches.length : 0); // matches is null when no match is found

        replacement = this.replaceString;

        // replace \n with newline character (same with \t - tab character)
        // but dont replace \\n (nor \\t)
        replacement = replacement.replace(/(\\)?(\\[nt])/g, function (group1, group2) {
            // if (\\)? group has been found then we have two values: group1 and group2 - then dont change anything, as we got \\n
            // if this group has NOT been found - then group2 is undefined - we can replace \n with newline character

            if (group2) {
                // return unchanged string, as it found \\n
                return group1 + group2;
            }

            // replace just \n with newline character
            if (group1 == '\\n') {
                return "\n";
            }

            // if not \\n then it must be \\t
            return "\t";
        });

        return inputText.replace(searchRegexp, replacement);
    } catch (e) {
        throw this.setupValidationFromError(e);
    }
};

RegexpReplaceTextProcessor.prototype.initializeFromObject = function (dataObject) {
    this.copyPropertiesFrom(dataObject, this.getSerializablePropertyNames());
};

RegexpReplaceTextProcessor.prototype.getExportObject = function () {
    return this.extractPropertiesToObject(this.getSerializablePropertyNames());
};

/**
 * @returns {Array|string[]}
 */
RegexpReplaceTextProcessor.prototype.getSerializablePropertyNames = function () {
    return ['searchString', 'replaceString', 'searchFlagGlobal', 'searchFlagMultiline', 'searchFlagCaseInsensitive', 'isEnabled', 'description'];
};