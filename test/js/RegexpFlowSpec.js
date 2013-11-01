/*global RegexpFlow: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpFlow", function () {

    /**
     * {RegexpFlow}
     */
    var regexpFlow;

    beforeEach(function () {
        regexpFlow = new RegexpFlow();
    });

    it("by default has no activities", function () {
        expect(regexpFlow.activities.length).toEqual(0);
    });

    it("we can add and remove all activities", function () {
        regexpFlow.activities.push({});
        regexpFlow.activities.push({});
        expect(regexpFlow.activities.length).toEqual(2);
        regexpFlow.removeAllActivities();
        expect(regexpFlow.activities.length).toEqual(0);
    });
});