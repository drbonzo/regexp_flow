function RegexpActivity() {
    this.typeName = '';
    this.displayName = '';
    this.isEnabled = true;

    this.regexpIsValid = true;
    this.regexpValidationMessage = '';
}

/**
 * Builds regular expression from string + flags
 *
 * @param {string} regularExpressionString
 * @param {bool|null} flagCaseInsensitive
 * @param {bool|null} flagGlobal if null - then it means FALSE
 * @param {bool|null} flagMultiline
 * @returns {RegExp}
 */
RegexpActivity.prototype.buildRegExp = function (regularExpressionString, flagCaseInsensitive, flagGlobal, flagMultiline) {

    var flags = [];
    if (flagGlobal) {
        flags.push('g');
    }

    if (flagCaseInsensitive) {
        flags.push('i');
    }

    if (flagMultiline) {
        flags.push('m');
    }

    return new RegExp(regularExpressionString, flags.join(''));
};

/**
 * @param {string} inputText
 * @return {Array|string[]}
 */
RegexpActivity.prototype.splitTextIntoLines = function (inputText) {
    // regexp without ?: will mess this split
    return inputText.split(/(?:\r\n|\n|\r)/);
};

/**
 * @param {string} inputText
 * @return {string}
 */
RegexpActivity.prototype.processText = function (inputText) {
    throw new Error("Please implement me!");
};

/**
 * Initializes object from generic data object - copies specific fields between objects
 * @param {Object} dataObject
 */
RegexpActivity.prototype.initializeFromObject = function (dataObject) {
    throw new Error("Please implement me!");
};

/**
 * Returns object to be serialized during export operation
 * @return {Object}
 */
RegexpActivity.prototype.getExportObject = function () { // FIXME rename to something like serializableObject
    throw new Error("Please implement me!");
};

/**
 * @param {Object} dataObject
 * @param {Array|string[]} propertyNames
 */
RegexpActivity.prototype.copyPropertiesFrom = function (dataObject, propertyNames) {
    for (var p in propertyNames) {
        var propertyName = propertyNames[p];
        this[propertyName] = dataObject[propertyName];
    }
};

/**
 * Builds new object, by copying some properties of this object.
 *
 * @param {Array|string[]} propertyNames
 * @return {Object}
 */
RegexpActivity.prototype.extractPropertiesToObject = function (propertyNames) {
    var retval = {};

    propertyNames.push('typeName'); // always added

    for (var p in propertyNames) {
        var propertyName = propertyNames[p];
        retval[propertyName] = this[propertyName];
    }

    return retval;
};

RegexpActivity.prototype.resetRegExpValidation = function () {
    this.regexpIsValid = true;
    this.regexpValidationMessage = '';
};

RegexpActivity.prototype.setupValidationFromError = function (error) {
    this.regexpIsValid = false;
    this.regexpValidationMessage = error.toString();
};

