'use strict';

/*jslint browser: true, eqeq: true*/
/*global $, angular,
 RegexpFlow,
 RegexpReplaceActivity,
 RegexpFindAllActivity,
 RegexpMatchLineActivity,
 RegexpMatchInLineActivity,
 RegexpUniqueActivity
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

    $scope.version = {name: 'RegexpFlow', version: '0.11.0'};

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
     * @type {Array|object[]}
     * { cssClass : string, message: string }
     */
    $scope.statusMessages = [];

    var processInputTextHandler = function () {

        var inputText,
            outputText,
            activity,
            a;

        /**
         * @type {RegexpActivity} activity
         */

        inputText = $scope.input.text || '';
        outputText = inputText;


        for (a in $scope.flow.activities) {
            if ($scope.flow.activities.hasOwnProperty(a)) {
                activity = $scope.flow.activities[a];

                if (activity.isEnabled) {
                    outputText = activity.processText(inputText);
                    inputText = outputText;
                }
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
        $scope.flow.activities.removeItem(activityToRemove);
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
        var newActivity = new RegexpReplaceActivity('^(.+?)$', '$1');
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
     * @param {RegexpActivity|null} selectedActivity
     */
    $scope.addNewUniqueActivity = function (selectedActivity) {
        var newActivity = new RegexpUniqueActivity(''); // will match whole line
        $scope.addActivity(newActivity, selectedActivity);
    };

    /**
     * @param {RegexpActivity} newActivity
     * @param {RegexpActivity|null} selectedActivity if null - new RegexpActivity will be added at the end, else it will be added after selectedActivity
     */
    $scope.addActivity = function (newActivity, selectedActivity) {

        var activities,
            shouldAddAfterOtherActivity,
            newActivityIndex,
            index,
            a;

        activities = $scope.flow.activities;
        shouldAddAfterOtherActivity = !!selectedActivity;
        if (shouldAddAfterOtherActivity) {
            index = -1;
            for (a in activities) {
                if (activities.hasOwnProperty(a)) {
                    if (activities[a] == selectedActivity) {
                        index = parseInt(a, 10); // for () returns indices as strings - wtf
                        break;
                    }
                }
            }

            if (index >= 0) {
                // insert newActivity after selectedActivity
                activities.splice(index, 1, selectedActivity, newActivity);
                newActivityIndex = index + 1;
            } else {
                activities.push(newActivity);
                newActivityIndex = activities.length - 1;
            }
        } else {
            activities.push(newActivity);
            newActivityIndex = activities.length - 1;
        }

        $timeout(function () {
            // focus on first input of new Activity form
            $('.activity_' + newActivityIndex + ' input:first').focus().select();
        }, 0);
    };

    $scope.chainHasNoActivities = function () {
        return ($scope.flow.activities.length === 0);
    };

    function getFlowExportObject() {
        var exportDataObject,
            a,
            activity;

        exportDataObject = {};
        exportDataObject.activities = [];

        for (a in $scope.flow.activities) {
            if ($scope.flow.activities.hasOwnProperty(a)) {
                activity = $scope.flow.activities[a];
                exportDataObject.activities.push(activity.getExportObject());
            }
        }

        exportDataObject.inputText = $scope.input.text;
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

        $scope.flow.removeAllActivities();

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

        var activityData,
            activityType,
            activity,
            activityConstructors,
            a;

        activityConstructors = {
            'RegexpReplaceActivity': RegexpReplaceActivity,
            'RegexpFindAllActivity': RegexpFindAllActivity,
            'RegexpMatchLineActivity': RegexpMatchLineActivity,
            'RegexpMatchInLineActivity': RegexpMatchInLineActivity,
            'RegexpUniqueActivity': RegexpUniqueActivity
        };

        for (a in flowObject.activities) {
            if (flowObject.activities.hasOwnProperty(a)) {
                activityData = flowObject.activities[a];
                activityType = activityData.typeName;

                if (activityConstructors.hasOwnProperty(activityType)) {
                    // build Activity by activity type name
                    activity = new activityConstructors[activityType]('', ''); // pass empty strings
                    // fill it with data
                    activity.initializeFromObject(activityData);
                    // add to Flow
                    $scope.flow.activities.push(activity);
                }
            }
        }

        if (!!flowObject.inputText) {
            // ovewrite input text only when it is given (not empty)
            $scope.input.text = flowObject.inputText;
        }
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
                    $scope.flow.removeAllActivities();
                    $scope.doImportFlowFromObject(data);
                }).error(function (data, status, headers, config) {
                    $scope.statusMessages.push({cssClass: 'danger', message: data.message});
                });
        }

        $(window).resize();

    }

    initializeFlow();
}]);
