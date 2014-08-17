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

    it("by default has no textProcessors", function () {
        expect(regexpFlow.textProcessors.length).toEqual(0);
    });

    it("we can add and remove all textProcessors", function () {
        regexpFlow.textProcessors.push({});
        regexpFlow.textProcessors.push({});
        expect(regexpFlow.textProcessors.length).toEqual(2);
        regexpFlow.removeAllTextProcessors();
        expect(regexpFlow.textProcessors.length).toEqual(0);
    });

    it ("has empty description", function() {
        expect(regexpFlow.description).toEqual("");
    });
});