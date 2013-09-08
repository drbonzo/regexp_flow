/**
 * @param {string} searchString
 * @constructor
 */
function RegexpFindAllActivity(searchString) {

    this.displayName = 'Find all matches';
    this.typeName = 'RegexpFindAllActivity';

    /**
     * @type {string}
     */
    this.searchString = searchString;

    /**
     * Always true
     *
     * @type {boolean}
     */
    this.searchFlagGlobal = true;

    /**
     * @type {boolean}
     */
    this.searchFlagCaseInsensitive = false;

    /**
     * Always true
     * @type {boolean}
     */
    this.searchFlagMultiline = true;

    /**
     * @type {number}
     */
    this.matchesCount = 0;
}

RegexpFindAllActivity.prototype = new RegexpActivity();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpFindAllActivity.prototype.processText = function (inputText) {

    try {

        this.resetRegExpValidation();
        this.matchesCount = 0;

        if (!this.searchString) {
            return inputText; // dont change anything when there is no regular expression
        }

        var searchRegexp = this.buildRegExp(this.searchString, this.searchFlagCaseInsensitive, this.searchFlagGlobal, this.searchFlagMultiline);
        // as this regexp is always with /g flag - then it returns only whole matches (no groups)
        // 'lorem ipsum dolor sid amet' - so searching for (\w\w)(\w{3}) in this text will return array with five letter words, no matter whether we use groups or not
        var matches = inputText.match(searchRegexp);
        if (matches) {
            this.matchesCount = matches.length;
            return matches.join("\n");
        }
        else {
            this.matchesCount = 0;
            return '';
        }
    }
    catch (e) {
        this.setupValidationFromError(e);

        return '';
    }
};

RegexpFindAllActivity.prototype.initializeFromObject = function (dataObject) {
    this.copyPropertiesFrom(dataObject, this.getSerializablePropertyNames());
};

RegexpFindAllActivity.prototype.getExportObject = function () {
    return this.extractPropertiesToObject(this.getSerializablePropertyNames());
};

/**
 * @returns {Array|string[]}
 */
RegexpFindAllActivity.prototype.getSerializablePropertyNames = function () {
    return ['searchString', 'searchFlagCaseInsensitive'];
};