/*global RegexpUniqueActivity: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpUniqueActivity", function () {

    /**
     * {RegexpUniqueActivity}
     */
    var regexpUniqueActivity;

    describe("defaults", function () {

        beforeEach(function () {
            regexpUniqueActivity = new RegexpUniqueActivity();
            expect(regexpUniqueActivity.totalLinesCount).toEqual(0);
            expect(regexpUniqueActivity.linesMatchedCount).toEqual(0);
        });


        it("should have default values", function () {
            expect(regexpUniqueActivity.displayName).toEqual('Unique');
            expect(regexpUniqueActivity.typeName).toEqual('RegexpUniqueActivity');
            expect(regexpUniqueActivity.totalLinesCount).toEqual(0);
            expect(regexpUniqueActivity.linesMatchedCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {

            it("should return empty text when input text is empty", function () {
                expect(regexpUniqueActivity.processText('')).toEqual('');
                expect(regexpUniqueActivity.totalLinesCount).toEqual(0);
                expect(regexpUniqueActivity.linesMatchedCount).toEqual(0);
            });
        });

        describe("normal processing", function () {
            it("should return one line when input text has just one line", function () {
                regexpUniqueActivity = new RegexpUniqueActivity();
                expect(regexpUniqueActivity.processText('Lorem ipsum dolor sit amet')).toEqual('Lorem ipsum dolor sit amet');
                expect(regexpUniqueActivity.totalLinesCount).toEqual(1);
                expect(regexpUniqueActivity.linesMatchedCount).toEqual(1);
            });

            it("should return just unique values, in order of their first apearance", function () {
                regexpUniqueActivity = new RegexpUniqueActivity();
                expect(regexpUniqueActivity.processText('Lorem\nLorem\nIpsum\nDolor\nIpsum\nIpsum')).toEqual('Lorem\nIpsum\nDolor');
                expect(regexpUniqueActivity.totalLinesCount).toEqual(6);
                expect(regexpUniqueActivity.linesMatchedCount).toEqual(3);
            });

            it("should tread lines equal with case sensitivity", function () {
                regexpUniqueActivity = new RegexpUniqueActivity();
                expect(regexpUniqueActivity.processText('Lorem\nlorem\nLorem\nLOREM\nLOREM')).toEqual('Lorem\nlorem\nLOREM');
                expect(regexpUniqueActivity.totalLinesCount).toEqual(5);
                expect(regexpUniqueActivity.linesMatchedCount).toEqual(3);
            });

            it("should skip empty lines", function () {
                regexpUniqueActivity = new RegexpUniqueActivity();
                expect(regexpUniqueActivity.processText('Lorem\n\nlorem\n\nLorem\n\nLOREM')).toEqual('Lorem\nlorem\nLOREM');
                expect(regexpUniqueActivity.totalLinesCount).toEqual(7);
                expect(regexpUniqueActivity.linesMatchedCount).toEqual(3);
            });
        });
    });

    describe("import/export object", function () {

        describe("initializeFromObject()", function () {

            var sourceObject;

            beforeEach(function () {
                sourceObject = {
                    isEnabled: true
                };
            });

            it("copyPropertiesFrom copies specified properties", function () {
                regexpUniqueActivity.initializeFromObject(sourceObject);

                expect(regexpUniqueActivity.isEnabled).toEqual(true);
            });

        });

        describe("getExportObject()", function () {

            beforeEach(function () {
                regexpUniqueActivity.isEnabled = true;
            });

            it("extractPropertiesToObject exports empty object if no properties are specified", function () {
                var exportedObject = regexpUniqueActivity.getExportObject();
                expect(exportedObject).toEqual({
                    typeName: 'RegexpUniqueActivity',
                    isEnabled: true
                });
            });
        });
    });
});
