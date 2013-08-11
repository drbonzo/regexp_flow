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
     * @type {RegexpFlowChain}
     */
    $scope.flowChain = new RegexpFlowChain();

    var processInputTextHandler = function () {

        var inputText = $scope.input.text || '';
        var outputText = inputText;

        /**
         * @type {RegexpFlowTransition}
         */
        var transition;

        for (var t in $scope.flowChain.transitions) {
            transition = $scope.flowChain.transitions[t];

            outputText = transition.processText(inputText);
            inputText = outputText;
        }

        $scope.output.text = outputText;
    };

    $scope.$watch('flowChain.transitions', processInputTextHandler, true);

    $scope.$watch('input', processInputTextHandler, true);

    // FIXME remove this
    (function initializeStuff(inputObject, flowChain) {
        inputObject.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
            "Cras ut pharetra ipsum, in interdum risus.\n" +
            "Donec ante mauris, pellentesque condimentum felis sed, dictum pulvinar elit.\n" +
            "Sed nulla metus, sagittis eu elit vel, adipdsdsdiscing interdum risus.\n" +
            "Mauris vitae ligula massa.\n" +
            "Integer in blandit arcu.\n" +
            "\n" +
//            "Aliquam laoreet justo a lorem pellentesque scelerisque.\n" +
//            "Curabitur varius et odio ut condimentum.\n" +
//            "Etiam cursus nunc et porttitor cursus.\n" +
//            "Nulla blandit hendrerit metus, a auctor magna ullamcorper non.\n" +
//            "Cras vitae metus tortor.\n" +
//            "Proin venenatis eros et sem consectetur vehicula.\n" +
//            "Donec commodo sit amet metus a scelerisque.\n" +
//            "Sed vitae dapibus lorem.\n" +
//            "Vestibulum sed varius nisl.\n" +
//            "\n" +
//            "Curabitur id lobortis dui.Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse egestas ultrices eros et cursus.\n" +
//            "In quam erat, fermentum in volutpat eu, ornare eget enim.\n" +
//            "Vivamus eu pharetra sem.\n" +
//            "Mauris id congue urna.\n" +
//            "Proin leo augue, pretium eu pulvinar sit amet, placerat eget sapien.\n" +
//            "Phasellus porta nunc euismod ultricies dignissim.\n" +
//            "Mauris luctus bibendum vehicula.\n" +
//            "In hac habitasse platea dictumst.\n" +
//            "Curabitur posuere ac felis non interdum.\n" +
//            "Phasellus laoreet id purus id semper.";
            '';

//        flowChain.transitions.push(new RegexpFlowMatchLineTransition('sed'));
        flowChain.transitions.push(new RegexpFlowReplacementTransition('sed', '<b style="padding: 0 5px; background-color: yellow">$&</b>'));
//        var t2 = new RegexpFlowReplacementTransition('lorem', '<b style="padding: 0 5px; background-color: limegreen">$&</b>');
//        t2.searchFlagCaseInsensitive = true;
//        flowChain.transitions.push(t2);
//        flowChain.transitions.push(new RegexpFlowReplacementTransition('vel', '<b style="padding: 0 5px; background-color: red">$&</b>'));

    }($scope.input, $scope.flowChain));


    $scope.removeFlowTransition = function (flowTransition) {

        var transitions = $scope.flowChain.transitions;
        var indexToRemove = -1;
        for (var i in transitions) {
            if (transitions[i] == flowTransition) {
                indexToRemove = i;
                break;
            }
        }

        if (indexToRemove >= 0) {
            transitions.splice(indexToRemove, 1); // remove item at that index
        }
    };

    /**
     * @param {RegexpFlowTransition|null} previousFlowTransition
     */
    $scope.addReplaceTransition = function (previousFlowTransition) {
        var newTransition = new RegexpFlowReplacementTransition('^', '');
        $scope.addFlowTransition(newTransition, previousFlowTransition);
    };

    /**
     * @param {RegexpFlowTransition|null} previousFlowTransition
     */
    $scope.addMatchLineTransition = function (previousFlowTransition) {
        var newTransition = new RegexpFlowMatchLineTransition(''); // will match all lines
        $scope.addFlowTransition(newTransition, previousFlowTransition);
    };

    /**
     * @param {RegexpFlowTransition|null} previousFlowTransition
     */
    $scope.addMatchInLineTransition = function (previousFlowTransition) {
        var newTransition = new RegexpFlowMatchInLineTransition('^.+$'); // will match whole line
        $scope.addFlowTransition(newTransition, previousFlowTransition);
    };

    /**
     * @param {RegexpFlowTransition} newTransition
     * @param {RegexpFlowTransition|null} previousFlowTransition if null - new Transition will be added at the end, else it will be added after previousFlowTransition
     */
    $scope.addFlowTransition = function (newTransition, previousFlowTransition) {

        var transitions = $scope.flowChain.transitions;
        var shouldAddAfterOtherTransition = !!previousFlowTransition;
        if (shouldAddAfterOtherTransition) {
            var index = -1;
            for (var i in transitions) {
                if (transitions[i] == previousFlowTransition) {
                    index = i;
                    break;
                }
            }

            if (index >= 0) {
                // insert newTransition after previousFlowTransition
                transitions.splice(index, 1, previousFlowTransition, newTransition);
            }
        }
        else {
            newTransition.push(newTransition);
        }
    };
});


function RegexpFlowChain() {
    /**
     * @type {Array|RegexpFlowReplacementTransition[]|RegexpFlowMatchLineTransition[]|RegexpFlowMatchInLineTransition[]}
     */
    this.transitions = [];
}

function RegexpFlowTransition() {
    this.name = '';
    this.searchString = '';
    this.searchFlagGlobal = false;
    this.searchFlagCaseInsensitive = false;
    this.searchFlagMultiline = false;
}

RegexpFlowTransition.prototype.buildRegExp = function () {

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
 * @return {string}
 */
RegexpFlowTransition.prototype.processText = function (inputText) {
    throw new Error("Please implement me!");
};

/**
 * @param {string} searchString
 * @param replaceString
 * @constructor
 */
function RegexpFlowReplacementTransition(searchString, replaceString) {

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

RegexpFlowReplacementTransition.prototype = new RegexpFlowTransition();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpFlowReplacementTransition.prototype.processText = function (inputText) {

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
function RegexpFlowMatchLineTransition(searchString) {

    this.typeName = 'Match lines';

    /**
     * @type {string}
     */
    this.searchString = searchString;
}

RegexpFlowMatchLineTransition.prototype = new RegexpFlowTransition();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpFlowMatchLineTransition.prototype.processText = function (inputText) {

    if (!this.searchString) {
        return inputText; // dont change anything when there is no regular expression
    }

    var lines = inputText.split(/(?:\r\n|\n|\r)/); // ?: fixuje rozbijanie tekstu za bardzo // FIXME DRY
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
function RegexpFlowMatchInLineTransition(searchString) {

    this.typeName = 'Match in line';

    /**
     * @type {string}
     */
    this.searchString = searchString;
}

RegexpFlowMatchInLineTransition.prototype = new RegexpFlowTransition();

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpFlowMatchInLineTransition.prototype.processText = function (inputText) {

    if (!this.searchString) {
        return inputText; // dont change anything when there is no regular expression
    }
    var lines = inputText.split(/(?:\r\n|\n|\r)/); // FIXME DRY
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
