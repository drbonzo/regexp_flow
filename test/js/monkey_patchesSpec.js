/*global describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("Array", function () {

    var anArray;

    beforeEach(function () {
        anArray = ['A', 'B', 'C', 'D'];
    });

    it("can remove item by its value", function () {
        expect(anArray.length).toEqual(4);

        anArray.removeItem('B');
        expect(anArray.length).toEqual(3);
        expect(anArray).toEqual(['A', 'C', 'D']);
    });

    it("removing nonexisting item does not change array contents", function () {
        expect(anArray.length).toEqual(4);
        anArray.removeItem('DoesNotExist');

        expect(anArray.length).toEqual(4);
        expect(anArray).toEqual(['A', 'B', 'C', 'D']);
    });
});