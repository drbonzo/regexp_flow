$(document).ready(function () {

    $(window).resize(function () {
        var wh = $(window).height() - 110;
        $('.flowPanelContents').height(wh);
        $('.inputPanel textarea').height(parseInt(wh * 0.45));
    });

    $(window).resize();
});

var regexpFlow = angular.module('RegexpFlowApplication', []);

regexpFlow.controller('MainController', function ($scope, $timeout) {
    $scope.input = {
        text: ''
    };

    $scope.output = {
        text: ''
    };

    $scope.exportPanelVisible = false;
    $scope.exportData = '';

    $scope.showHelp = false;

    /**
     * @type {RegexpFlow}
     */
    $scope.flow = new RegexpFlow();

    var processInputTextHandler = function () {

        var inputText = $scope.input.text || '';
        var outputText = inputText;

        /**
         * @type {RegexpActivity}
         */
        var activity;

        for (var a in $scope.flow.activities) {
            activity = $scope.flow.activities[a];

            if (activity.isEnabled) {
                outputText = activity.processText(inputText);
                inputText = outputText;
            }
        }

        $scope.output.text = outputText;
    };

    $scope.$watch('flow.activities', processInputTextHandler, true);

    $scope.$watch('input', processInputTextHandler, true);

    /**
     * @param {RegexpActivity} activityToRemove
     */
    $scope.removeActivity = function (activityToRemove) {

        var activities = $scope.flow.activities;
        var indexToRemove = -1;
        for (var a in activities) {
            if (activities[a] == activityToRemove) {
                indexToRemove = a;
                break;
            }
        }

        if (indexToRemove >= 0) {
            activities.splice(indexToRemove, 1); // remove item at that index
        }
    };

    /**
     * @param {RegexpActivity} activity
     */
    $scope.toggleEnabledFlag = function (activity) {
        activity.isEnabled = !activity.isEnabled;
    };

    /**
     * @param {RegexpActivity|null} selectedActivity
     */
    $scope.addNewReplaceActivity = function (selectedActivity) {
        var newActivity = new RegexpReplaceActivity('^', '');
        $scope.addActivity(newActivity, selectedActivity);
    };

    /**
     * @param {RegexpActivity|null} selectedActivity
     */
    $scope.addNewFindAllActivity = function (selectedActivity) {
        var newActivity = new RegexpFindAllActivity('\\b.+?\\b');
        $scope.addActivity(newActivity, selectedActivity);
    };

    /**
     * @param {RegexpActivity|null} selectedActivity
     */
    $scope.addNewMatchLineActivity = function (selectedActivity) {
        var newActivity = new RegexpMatchLineActivity(''); // will match all lines
        $scope.addActivity(newActivity, selectedActivity);
    };

    /**
     * @param {RegexpActivity|null} selectedActivity
     */
    $scope.addNewMatchInLineActivity = function (selectedActivity) {
        var newActivity = new RegexpMatchInLineActivity('^.*$'); // will match whole line
        $scope.addActivity(newActivity, selectedActivity);
    };

    /**
     * @param {RegexpActivity} newActivity
     * @param {RegexpActivity|null} selectedActivity if null - new RegexpActivity will be added at the end, else it will be added after selectedActivity
     */
    $scope.addActivity = function (newActivity, selectedActivity) {

        var activities = $scope.flow.activities;
        var shouldAddAfterOtherActivity = !!selectedActivity;
        var newActivityIndex;
        if (shouldAddAfterOtherActivity) {
            var index = -1;
            for (var a in activities) {
                if (activities[a] == selectedActivity) {
                    index = parseInt(a); // for () returns indices as strings - wtf
                    break;
                }
            }

            if (index >= 0) {
                // insert newActivity after selectedActivity
                activities.splice(index, 1, selectedActivity, newActivity);
                newActivityIndex = index + 1;
            }
            else {
                activities.push(newActivity);
                newActivityIndex = activities.length - 1;
            }
        }
        else {
            activities.push(newActivity);
            newActivityIndex = activities.length - 1;
        }

        $timeout(function () {
            // focus on first input of new Activity form
            $('.activity_' + newActivityIndex + ' input:first').focus().select();
        }, 0);
    };

    $scope.chainHasNoActivities = function () {
        return ($scope.flow.activities.length == 0);
    };

    $scope.exportFlowToJSON = function () {
        $scope.exportPanelVisible = true;

        var exportDataObject = {};
        exportDataObject.activities = [];

        for (var a in $scope.flow.activities) {
            var activity = $scope.flow.activities[a];
            exportDataObject.activities.push(activity);
        }

        $scope.exportData = angular.toJson(exportDataObject);

        $timeout(function () {
            $('.exportPanel textarea:first').focus().select();
        }, 0);
    };

    $scope.createSampleFlow = function () {
        $scope.input.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
            "Cras ut pharetra ipsum, in interdum risus.\n" +
            "Donec ante mauris, pellentesque condimentum felis sed, dictum pulvinar elit.\n" +
            "Sed nulla metus, sagittis eu elit vel, adipdsdsdiscing interdum risus.\n" +
            "Mauris vitae ligula massa.\n" +
            "Integer in blandit arcu.\n" +
            "\n" +
            "Aliquam laoreet justo a lorem pellentesque scelerisque.\n" +
            "Curabitur varius et odio ut condimentum.\n" +
            "Etiam cursus nunc et porttitor cursus.\n" +
            "Nulla blandit hendrerit metus, a auctor magna ullamcorper non.\n" +
            "Cras vitae metus tortor.\n" +
            "Proin venenatis eros et sem consectetur vehicula.\n" +
            "Donec commodo sit amet metus a scelerisque.\n" +
            "Sed vitae dapibus lorem.\n" +
            "Vestibulum sed varius nisl.\n" +
            "\n" +
            "Curabitur id lobortis dui.Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse egestas ultrices eros et cursus.\n" +
            "In quam erat, fermentum in volutpat eu, ornare eget enim.\n" +
            "Vivamus eu pharetra sem.\n" +
            "Mauris id congue urna.\n" +
            "Proin leo augue, pretium eu pulvinar sit amet, placerat eget sapien.\n" +
            "Phasellus porta nunc euismod ultricies dignissim.\n" +
            "Mauris luctus bibendum vehicula.\n" +
            "In hac habitasse platea dictumst.\n" +
            "Curabitur posuere ac felis non interdum.\n" +
            "Phasellus laoreet id purus id semper." +
            '';

        $scope.flow.removeAllActivities();
        var activities = $scope.flow.activities;
        {
            activities.push(new RegexpMatchLineActivity('or'));

            var t2 = new RegexpMatchLineActivity('lorem');
            t2.searchFlagCaseInsensitive = true;
            activities.push(t2);

            var t3 = new RegexpReplaceActivity('^(.+?)\\s(\\w+)', '$1 ***$2***');
            t3.searchFlagCaseInsensitive = true;
            t3.searchFlagMultiline = true;
            activities.push(t3);
        }
    };
});


function RegexpFlow() {
    /**
     * @type {Array|RegexpActivity[]}
     */
    this.activities = [];
}

RegexpFlow.prototype.removeAllActivities = function () {
    this.activities.length = 0;
};

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


RegexpActivity.prototype.resetRegExpValidation = function () {
    this.regexpIsValid = true;
    this.regexpValidationMessage = '';
};

RegexpActivity.prototype.setupValidationFromError = function (error) {
    this.regexpIsValid = false;
    this.regexpValidationMessage = error.toString();
};


/**
 * @param {string} searchString
 * @param {string} replaceString
 * @constructor
 */
function RegexpReplaceActivity(searchString, replaceString) {

    this.displayName = 'Replace in text';
    this.typeName = 'RegexpReplaceActivity';

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

RegexpReplaceActivity.prototype = new RegexpActivity();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpReplaceActivity.prototype.processText = function (inputText) {

    try {

        this.resetRegExpValidation();
        this.replacementsCount = 0;

        if (!this.searchString) {
            return inputText; // dont change anything when there is no regular expression
        }

        var searchRegexp = this.buildRegExp(this.searchString, this.searchFlagCaseInsensitive, this.searchFlagGlobal, this.searchFlagMultiline);
        var matches = inputText.match(searchRegexp);
        this.replacementsCount = ( matches ? matches.length : 0 ); // matches is null when no match is found

        var replacement = this.replaceString;

        // replace \n with newline character (same with \t - tab character)
        // but dont replace \\n (nor \\t)
        replacement = replacement.replace(/(\\)?(\\[nt])/, function (group1, group2) {
            // if (\\)? group has been found then we have two values: group1 and group2 - then dont change anything, as we got \\n
            // if this group has NOT been found - then group2 is undefined - we can replace \n with newline character

            if (group2) {
                // return unchanged string, as it found \\n
                return group1 + group2;
            }
            else {
                // replace just \n with newline character
                if (group1 == '\\n') {
                    return "\n";
                }
                else {
                    return "\t";
                }
            }
        });

        return inputText.replace(searchRegexp, replacement);
    }
    catch (e) {
        this.setupValidationFromError(e);

        return '';
    }
};

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

/**
 * @param {string} searchString
 * @constructor
 */
function RegexpMatchLineActivity(searchString) {

    this.displayName = 'Match lines';
    this.typeName = 'RegexpMatchLineActivity';

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

RegexpMatchLineActivity.prototype = new RegexpActivity();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpMatchLineActivity.prototype.processText = function (inputText) {

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
        var matchedLines = [];

        var searchRegexp = this.buildRegExp(this.searchString, this.searchFlagCaseInsensitive, null, null);

        for (var l in lines) {
            line = lines[l];

            if (this.flagInvertMatch) {
                if (!line.match(searchRegexp)) {
                    matchedLines.push(line);
                }
            }
            else {
                if (line.match(searchRegexp)) {
                    matchedLines.push(line);
                }
            }
        }

        this.linesMatchedCount = matchedLines.length;

        return matchedLines.join("\n");
    }
    catch (e) {
        this.setupValidationFromError(e);

        return '';
    }
};


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
