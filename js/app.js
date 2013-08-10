var regexpFlow = angular.module('RegexpFlowApplication', []);

regexpFlow.controller('MainController', function ($scope) {
    $scope.input = {
        text: ''
    };

    $scope.output = {
        text: ''
    };

    /**
     * @type {RegexpFlowChain}
     */
    $scope.flowChain = new RegexpFlowChain();

    $scope.$watch('input', function (newInput) {

        var inputText;
        var outputText;

        /**
         * @type {RegexpFlowReplacementTransition|RegexpFlowMatchLineTransition|RegexpFlowMatchInLineTransition}
         */
        var transition;

        inputText = newInput.text;
        outputText = inputText; // in case there are not transitions

        for (var t in $scope.flowChain.transitions) {
            transition = $scope.flowChain.transitions[t];

            outputText = transition.processText(inputText);
            inputText = outputText;
        }

        $scope.output.text = outputText;
    }, true);

    // FIXME remove this
    (function initializeStuff(inputObject, flowChain) {
        inputObject.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
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
            "Phasellus laoreet id purus id semper.";

        flowChain.transitions.push(new RegexpFlowMatchLineTransition(/(sed)/i));
        flowChain.transitions.push(new RegexpFlowReplacementTransition(/(sed)/ig, '<b style="padding: 0 5px; background-color: yellow">$1</b>'));

    }($scope.input, $scope.flowChain));
});


function RegexpFlowChain() {
    /**
     * @type {Array|RegexpFlowReplacementTransition[]|RegexpFlowMatchLineTransition[]|RegexpFlowMatchInLineTransition[]}
     */
    this.transitions = [];
}

/**
 * @param {RegExp} searchRegexp
 * @param replaceString
 * @constructor
 */
function RegexpFlowReplacementTransition(searchRegexp, replaceString) {
    /**
     * @type {RegExp}
     */
    this.searchRegexp = searchRegexp;

    /**
     * @type {string}
     */
    this.replaceString = replaceString;
}

/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpFlowReplacementTransition.prototype.processText = function (inputText) {
    return inputText.replace(this.searchRegexp, this.replaceString);
};


/**
 * @param {RegExp} searchRegexp
 * @constructor
 */
function RegexpFlowMatchLineTransition(searchRegexp) {

    /**
     * @type {RegExp}
     */
    this.searchRegexp = searchRegexp;
}


/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpFlowMatchLineTransition.prototype.processText = function (inputText) {
    var lines = inputText.split(/(\r\n|\n|\r)/);

    var line;
    var matchedLines = [];

    for (var l in lines) {
        line = lines[l];
        if (line.match(this.searchRegexp)) {
            matchedLines.push(line);
        }
    }

    return matchedLines.join("\n");
};


/**
 * @param {RegExp} searchRegexp
 * @param {string} replaceString
 * @constructor
 */
function RegexpFlowMatchInLineTransition(searchRegexp, replaceString) {

    /**
     * @type {RegExp}
     */
    this.searchRegexp = searchRegexp;
}


/**
 * @param {string} inputText
 * @returns {string}
 */
RegexpFlowMatchInLineTransition.prototype.processText = function (inputText) {
//    return inputText.replace(this.searchRegexp, this.replaceString);
};
