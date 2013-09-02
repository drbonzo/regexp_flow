/**
 * @param {string} searchString
 * @constructor
 */
function RegexpMatchInLineActivity(searchString) {

    this.displayName = 'Match in line';
    this.typeName = 'RegexpMatchInLineActivity';

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

}

RegexpMatchInLineActivity.prototype = new RegexpActivity();

/**
 * Splits text into lines.
 * Processes each line
 * - if line matches regular expression - then the match is being returned
 *      - if groups were used in regular expression
 * - if line does not match regular expression - then that line is being ommited (not included in result)
 * @param {string} inputText
 * @returns {string}
 */
RegexpMatchInLineActivity.prototype.processText = function (inputText) {

    try {

        this.resetRegExpValidation();
        var lines = this.splitTextIntoLines(inputText);
        this.totalLinesCount = lines.length;
        this.linesMatchedCount = 0;

        if (!this.searchString) {
            this.linesMatchedCount = this.totalLinesCount;
            return inputText; // dont change anything when there is no regular expression
        }

        var line;
        var matchesInLines = [];

        var searchRegexp = this.buildRegExp(this.searchString, this.searchFlagCaseInsensitive, null, null);
        var match;
        var matchedText;
        for (var l in lines) {
            line = lines[l];
            match = line.match(searchRegexp);

            if (match) {
                matchedText = match[1] ? match[1] : match[0]; // when no groups were used - then $0 is used, else first group is used
                matchesInLines.push(matchedText);
            }
        }

        this.linesMatchedCount = matchesInLines.length;

        return matchesInLines.join("\n");
    }
    catch (e) {
        this.setupValidationFromError(e);
        return '';
    }
};

RegexpMatchInLineActivity.prototype.initializeFromObject = function (dataObject) {
    this.copyPropertiesFrom(dataObject, ['searchString', 'searchFlagCaseInsensitive']);
};
