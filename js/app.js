$(document).ready(function () {

    $(window).resize(function () {
        var columnHeaderHeight = 52;
        var navbarHeight = 35;

        var baseHeight = $(window).height() - navbarHeight;

        var panelHeight = parseInt(baseHeight * 0.49);
        $('.inputOutputColumn .row').height(panelHeight + 'px');
        $('.inputOutputColumn .row textarea').height((panelHeight - columnHeaderHeight) + 'px');

        $('.flowColumnContents').height(parseInt(baseHeight - columnHeaderHeight) * 0.98);
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
    $scope.importPanelVisible = false;
    $scope.importData = '';

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
        // show export panel
        // hide import panel
        $scope.exportPanelVisible = true;
        $scope.importPanelVisible = false;

        var exportDataObject = {};
        exportDataObject.activities = [];

        for (var a in $scope.flow.activities) {
            var activity = $scope.flow.activities[a];
            exportDataObject.activities.push(activity.getExportObject());
        }

        exportDataObject.inputText = $scope.input.text;

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

        if ($scope.importData == '' || !$scope.importData) {
            return;
        }

        var flowObject = angular.fromJson($scope.importData);


        var activityData;
        var activityType;
        var activity;
        var activityConstructors = {
            'RegexpReplaceActivity': RegexpReplaceActivity,
            'RegexpFindAllActivity': RegexpFindAllActivity,
            'RegexpMatchLineActivity': RegexpMatchLineActivity,
            'RegexpMatchInLineActivity': RegexpMatchInLineActivity
        };

        for (var a in flowObject.activities) {
            activityData = flowObject.activities[a];
            activityType = activityData.typeName;

            if (activityType in activityConstructors) {
                // build Activity by activity type name
                activity = new activityConstructors[activityType]('', ''); // pass empty strings
                // fill it with data
                activity.initializeFromObject(activityData);
                // add to Flow
                $scope.flow.activities.push(activity);
            }
        }

        if (!!flowObject.inputText) {
            // ovewrite input text only when it is given (not empty)
            $scope.input.text = flowObject.inputText;
        }
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
