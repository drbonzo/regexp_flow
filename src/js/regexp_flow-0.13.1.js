'use strict';

/*jslint browser: true, eqeq: true*/
/*global $, angular,
 RegexpFlow,
 RegexpReplaceTextProcessor,
 RegexpFindAllTextProcessor,
 RegexpMatchLineTextProcessor,
 RegexpMatchInLineTextProcessor,
 RegexpUniqueTextProcessor,
 TextProcessorRunner
 */

/**
 * Docs
 *
 * .error() handlers receive object with 'message' property.
 *
 */

$(document).ready(function () {

    $(window).resize(function () {

        var columnHeaderHeight,
            navbarHeight,
            baseHeight,
            panelHeight;

        columnHeaderHeight = 52;
        navbarHeight = 35;

        baseHeight = $(window).height() - navbarHeight;

        panelHeight = parseInt(baseHeight * 0.49, 10);
        $('.inputOutputColumn .row').height(panelHeight + 'px');
        $('.inputOutputColumn .row textarea').height((panelHeight - columnHeaderHeight) + 'px');

        $('.flowColumnContents').height(parseInt(baseHeight - columnHeaderHeight, 10) * 0.98);
    });
});

var regexpFlow = angular.module('RegexpFlowApplication', ['ngRoute']);

regexpFlow.config(['$routeProvider', function ($routeProvider) {

    // Small hack:
    // We use just one view and we want the value of flowId param
    $routeProvider.
        // load flow by flow ID
        when('/flow/:flowId', {controller: 'MainController', templateUrl: 'mainView.html'}).
        // show empty flow
        when('/', {controller: 'MainController', templateUrl: 'mainView.html'}).
        // default
        otherwise({redirectTo: '/'});
}]);

/**
 * $routeParams has flowId which may be undefined
 */
regexpFlow.controller('MainController', ['$scope', '$timeout', '$http', '$routeParams', '$location', function ($scope, $timeout, $http, $routeParams, $location) {

    $scope.version = {name: 'RegexpFlow', version: '0.13.1'};

    $scope.infoPanelVisible = false;

    $scope.input = {
        text: ''
    };

    $scope.output = {
        text: ''
    };

    $scope.exportPanelVisible = false;
    $scope.exportData = '';
    $scope.importPanelVisible = false;
    $scope.importData = '';

    $scope.showHelp = false;

    /**
     * @type {RegexpFlow}
     */
    $scope.flow = new RegexpFlow();

	/**
	 * @type {TextProcessorRunner}
	 */
	$scope.textProcessorRunner = new TextProcessorRunner();

    /**
     * @type {Array|object[]}
     * { cssClass : string, message: string }
     */
    $scope.statusMessages = [];

	var processInputTextHandler = function () {
		var inputText = $scope.input.text || '';
		$scope.output.text = $scope.textProcessorRunner.processString($scope.flow, inputText);
	};

	$scope.$watch('flow.textProcessors', processInputTextHandler, true);

    $scope.$watch('input', processInputTextHandler, true);

    /**
     * @param {TextProcessor} textProcessorToRemove
     */
    $scope.removeTextProcessor = function (textProcessorToRemove) {
        $scope.flow.textProcessors.removeItem(textProcessorToRemove);
    };

    /**
     * @param {TextProcessor} textProcessor
     */
    $scope.toggleEnabledFlag = function (textProcessor) {
        textProcessor.isEnabled = !textProcessor.isEnabled;
    };

    /**
     * @param {TextProcessor} textProcessor
     * @param {Number} textProcessorIndex
     */
    $scope.toggleShowDescription = function (textProcessor, textProcessorIndex) {
        textProcessor.showDescription = !textProcessor.showDescription;

        $timeout(function () {
            // focus on first input of new TextProcessor form
            $('.textProcessor_' + textProcessorIndex + ' .textProcessorDescription input:first').focus().select();
        }, 0);

    };

    /**
     * @param {TextProcessor|null} selectedTextProcessor
     */
    $scope.addNewReplaceTextProcessor = function (selectedTextProcessor) {
        var newTextProcessor = new RegexpReplaceTextProcessor('^(.+?)$', '$1');
        $scope.addTextProcessor(newTextProcessor, selectedTextProcessor);
    };

    /**
     * @param {TextProcessor|null} selectedTextProcessor
     */
    $scope.addNewFindAllTextProcessor = function (selectedTextProcessor) {
        var newTextProcessor = new RegexpFindAllTextProcessor('\\b.+?\\b');
        $scope.addTextProcessor(newTextProcessor, selectedTextProcessor);
    };

    /**
     * @param {TextProcessor|null} selectedTextProcessor
     */
    $scope.addNewMatchLineTextProcessor = function (selectedTextProcessor) {
        var newTextProcessor = new RegexpMatchLineTextProcessor(''); // will match all lines
        $scope.addTextProcessor(newTextProcessor, selectedTextProcessor);
    };

    /**
     * @param {TextProcessor|null} selectedTextProcessor
     */
    $scope.addNewMatchInLineTextProcessor = function (selectedTextProcessor) {
        var newTextProcessor = new RegexpMatchInLineTextProcessor('^.*$'); // will match whole line
        $scope.addTextProcessor(newTextProcessor, selectedTextProcessor);
    };

    /**
     * @param {TextProcessor|null} selectedTextProcessor
     */
    $scope.addNewUniqueTextProcessor = function (selectedTextProcessor) {
        var newTextProcessor = new RegexpUniqueTextProcessor(''); // will match whole line
        $scope.addTextProcessor(newTextProcessor, selectedTextProcessor);
    };

    /**
     * @param {TextProcessor} newTextProcessor
     * @param {TextProcessor|null} selectedTextProcessor if null - new TextProcessor will be added at the end, else it will be added after selectedTextProcessor
     */
    $scope.addTextProcessor = function (newTextProcessor, selectedTextProcessor) {

        var textProcessors,
            shouldAddAfterOtherTextProcessor,
            newTextProcessorIndex,
            index,
            a;

        textProcessors = $scope.flow.textProcessors;
        shouldAddAfterOtherTextProcessor = !!selectedTextProcessor;
        if (shouldAddAfterOtherTextProcessor) {
            index = -1;
            for (a in textProcessors) {
                if (textProcessors.hasOwnProperty(a)) {
                    if (textProcessors[a] == selectedTextProcessor) {
                        index = parseInt(a, 10); // for () returns indices as strings - wtf
                        break;
                    }
                }
            }

            if (index >= 0) {
                // insert newTextProcessor after selectedTextProcessor
                textProcessors.splice(index, 1, selectedTextProcessor, newTextProcessor);
                newTextProcessorIndex = index + 1;
            } else {
                textProcessors.push(newTextProcessor);
                newTextProcessorIndex = textProcessors.length - 1;
            }
        } else {
            textProcessors.push(newTextProcessor);
            newTextProcessorIndex = textProcessors.length - 1;
        }

        $timeout(function () {
            // focus on first input of new TextProcessor form
            $('.textProcessor_' + newTextProcessorIndex + ' input:first').focus().select();
        }, 0);
    };

    $scope.chainHasNoTextProcessors = function () {
        return ($scope.flow.textProcessors.length === 0);
    };

    function getFlowExportObject() {
        var exportDataObject,
            a,
            textProcessor;

        exportDataObject = {};
        exportDataObject.textProcessors = [];

        for (a in $scope.flow.textProcessors) {
            if ($scope.flow.textProcessors.hasOwnProperty(a)) {
                textProcessor = $scope.flow.textProcessors[a];
                exportDataObject.textProcessors.push(textProcessor.getExportObject());
            }
        }

        exportDataObject.inputText = $scope.input.text;
        exportDataObject.description = $scope.flow.description;
        return exportDataObject;
    }

    $scope.exportFlowToJSON = function () {
        // show export panel
        // hide import panel
        $scope.exportPanelVisible = true;
        $scope.importPanelVisible = false;

        var exportDataObject = getFlowExportObject();

        $scope.exportData = angular.toJson(exportDataObject);

        $timeout(function () {
            $('.exportPanel textarea:first').focus().select();
        }, 0);
    };

    $scope.toggleImportPanel = function () {
        // toggle import panel
        // hide export panel
        // focus in textarea if showing import panel
        $scope.importPanelVisible = !$scope.importPanelVisible;
        $scope.exportPanelVisible = false;

        if ($scope.importPanelVisible) {

            $timeout(function () {
                $('.importPanel textarea:first').focus().select();
            }, 0);
        }
    };

    $scope.importFlowFromJSON = function () {

        $scope.flow.removeAllTextProcessors();

        if ($scope.importData === '' || !$scope.importData) {
            return;
        }

        try {
            var flowObject = angular.fromJson($scope.importData);
            $scope.doImportFlowFromObject(flowObject);
        } catch (e) {
            // In case of JSON errors - highlight the form with read color
            $('.importPanel textarea').effect('highlight', {color: 'red'});
        }
    };

    $scope.doImportFlowFromObject = function (flowObject) { // FIXME make local

        var textProcessorData,
            textProcessorType,
            textProcessor,
            textProcessorConstructors,
            a;

        textProcessorConstructors = {
            'RegexpReplaceTextProcessor': RegexpReplaceTextProcessor,
            'RegexpFindAllTextProcessor': RegexpFindAllTextProcessor,
            'RegexpMatchLineTextProcessor': RegexpMatchLineTextProcessor,
            'RegexpMatchInLineTextProcessor': RegexpMatchInLineTextProcessor,
            'RegexpUniqueTextProcessor': RegexpUniqueTextProcessor
        };

        for (a in flowObject.textProcessors) {
            if (flowObject.textProcessors.hasOwnProperty(a)) {
                textProcessorData = flowObject.textProcessors[a];
                textProcessorType = textProcessorData.typeName;

                if (textProcessorConstructors.hasOwnProperty(textProcessorType)) {
                    // build TextProcessor by textProcessor type name
                    textProcessor = new textProcessorConstructors[textProcessorType]('', ''); // pass empty strings
                    // fill it with data
                    textProcessor.initializeFromObject(textProcessorData);

                    // if textProcessor has description then show it initialy
                    if (!!textProcessor.description && textProcessor.description.length > 0) {
                        textProcessor.showDescription = true;
                    }
                    // add to Flow
                    $scope.flow.textProcessors.push(textProcessor);
                }
            }
        }

        if (!!flowObject.inputText) {
            // ovewrite input text only when it is given (not empty)
            $scope.input.text = flowObject.inputText;
        }

        $scope.flow.description = flowObject.description;
    };

    $scope.createSampleFlow = function () {
        $location.path('/flow/_example');
    };

    $scope.dismissStatusMessage = function (statusMessageToRemove) {
        $scope.statusMessages.removeItem(statusMessageToRemove);
    };

    $scope.saveFlow = function () {

        var exportDataObject = getFlowExportObject();

        $http.post('backend/index.php/flows', exportDataObject)
            .success(function (data, status, headers, config) {
                $location.path('/flow/' + data.id);
            }).error(function (data, status, headers, config) {
                $scope.statusMessages.push({cssClass: 'danger', message: data.message});
            });
    };

    function initializeFlow() {
        var flowIdIsGiven,
            flowId;
        //noinspection JSUnresolvedVariable
        flowIdIsGiven = !!$routeParams.flowId;

        if (flowIdIsGiven) {
            // Load saved flow from backend
            //noinspection JSUnresolvedVariable
            flowId = $routeParams.flowId;
            $http.get('backend/index.php/flow/' + flowId)
                .success(function (data, status, headers, config) {
                    $scope.flow.removeAllTextProcessors();
                    $scope.doImportFlowFromObject(data);
                }).error(function (data, status, headers, config) {
                    $scope.statusMessages.push({cssClass: 'danger', message: data.message});
                });
        }

        $(window).resize();

    }

    initializeFlow();
}]);
