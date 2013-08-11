$(document).ready(function () {

    $(window).resize(function () {
        var wh = $(window).height() - 110;
        $('.flowPanelContents').height(wh);
        $('.inputPanel textarea').height(parseInt(wh * 0.45));
    });

    $(window).resize();
});

var regexpFlow = angular.module('RegexpFlowApplication', []);

regexpFlow.controller('MainController', function ($scope) {
    $scope.input = {
        text: ''
    };

    $scope.output = {
        text: ''
    };

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

        for (var t in $scope.flow.activities) {
            activity = $scope.flow.activities[t];

            outputText = activity.processText(inputText);
            inputText = outputText;
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
        for (var i in activities) {
            if (activities[i] == activityToRemove) {
                indexToRemove = i;
                break;
            }
        }

        if (indexToRemove >= 0) {
            activities.splice(indexToRemove, 1); // remove item at that index
        }
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
        if (shouldAddAfterOtherActivity) {
            var index = -1;
            for (var i in activities) {
                if (activities[i] == selectedActivity) {
                    index = i;
                    break;
                }
            }

            if (index >= 0) {
                // insert newActivity after selectedActivity
                activities.splice(index, 1, selectedActivity, newActivity);
            }
        }
        else {
            activities.push(newActivity);
        }
    };

    $scope.chainHasNoActivities = function () {
        return ($scope.flow.activities.length == 0);
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

function RegexpActivity() {
    this.name = '';
    this.searchString = '';
    this.searchFlagGlobal = false;
    this.searchFlagCaseInsensitive = false;
    this.searchFlagMultiline = false;
}

RegexpActivity.prototype.buildRegExp = function () {

    var flags = [];
    if (this.searchFlagGlobal) {
        flags.push('g');
    }

    if (this.searchFlagCaseInsensitive) {
        flags.push('i');
    }

    if (this.searchFlagMultiline) {
        flags.push('m');
    }

    return new RegExp(this.searchString, flags.join(''));
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
 * @param {string} searchString
 * @param replaceString
 * @constructor
 */
function RegexpReplaceActivity(searchString, replaceString) {

    this.typeName = 'Replace in text';

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
}

RegexpReplaceActivity.prototype = new RegexpActivity();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpReplaceActivity.prototype.processText = function (inputText) {

    if (!this.searchString) {
        return inputText; // dont change anything when there is no regular expression
    }

    var searchRegexp = this.buildRegExp();
    return inputText.replace(searchRegexp, this.replaceString);
};


/**
 * @param {string} searchString
 * @constructor
 */
function RegexpMatchLineActivity(searchString) {

    this.typeName = 'Match lines';

    /**
     * @type {string}
     */
    this.searchString = searchString;
}

RegexpMatchLineActivity.prototype = new RegexpActivity();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpMatchLineActivity.prototype.processText = function (inputText) {

    if (!this.searchString) {
        return inputText; // dont change anything when there is no regular expression
    }

    var lines = this.splitTextIntoLines(inputText);
    var line;
    var matchedLines = [];

    var searchRegexp = this.buildRegExp();
    for (var l in lines) {
        line = lines[l];
        if (line.match(searchRegexp)) {
            matchedLines.push(line);
        }
    }

    return matchedLines.join("\n");
};


/**
 * @param {string} searchString
 * @constructor
 */
function RegexpMatchInLineActivity(searchString) {

    this.typeName = 'Match in line';

    /**
     * @type {string}
     */
    this.searchString = searchString;
}

RegexpMatchInLineActivity.prototype = new RegexpActivity();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpMatchInLineActivity.prototype.processText = function (inputText) {

    if (!this.searchString) {
        return inputText; // dont change anything when there is no regular expression
    }
    var lines = this.splitTextIntoLines(inputText);
    var line;
    var matchedInLines = [];

    var searchRegexp = this.buildRegExp();
    var match;
    for (var l in lines) {
        line = lines[l];
        // TODO can match global
        match = line.match(searchRegexp);

        if (match) {
            matchedInLines.push(match.join(''));
        }
    }

    return matchedInLines.join("\n");
};
