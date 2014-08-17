/*global RegexpUniqueTextProcessor: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpUniqueTextProcessor", function () {

    /**
     * {RegexpUniqueTextProcessor}
     */
    var regexpUniqueTextProcessor;

    describe("defaults", function () {

        beforeEach(function () {
            regexpUniqueTextProcessor = new RegexpUniqueTextProcessor();
            expect(regexpUniqueTextProcessor.totalLinesCount).toEqual(0);
            expect(regexpUniqueTextProcessor.linesMatchedCount).toEqual(0);
        });


        it("should have default values", function () {
            expect(regexpUniqueTextProcessor.displayName).toEqual('Unique');
            expect(regexpUniqueTextProcessor.typeName).toEqual('RegexpUniqueTextProcessor');
            expect(regexpUniqueTextProcessor.totalLinesCount).toEqual(0);
            expect(regexpUniqueTextProcessor.linesMatchedCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {

            it("should return empty text when input text is empty", function () {
                expect(regexpUniqueTextProcessor.processText('')).toEqual('');
                expect(regexpUniqueTextProcessor.totalLinesCount).toEqual(0);
                expect(regexpUniqueTextProcessor.linesMatchedCount).toEqual(0);
            });
        });

        describe("normal processing", function () {
            it("should return one line when input text has just one line", function () {
                regexpUniqueTextProcessor = new RegexpUniqueTextProcessor();
                expect(regexpUniqueTextProcessor.processText('Lorem ipsum dolor sit amet')).toEqual('Lorem ipsum dolor sit amet');
                expect(regexpUniqueTextProcessor.totalLinesCount).toEqual(1);
                expect(regexpUniqueTextProcessor.linesMatchedCount).toEqual(1);
            });

            it("should return just unique values, in order of their first apearance", function () {
                regexpUniqueTextProcessor = new RegexpUniqueTextProcessor();
                expect(regexpUniqueTextProcessor.processText('Lorem\nLorem\nIpsum\nDolor\nIpsum\nIpsum')).toEqual('Lorem\nIpsum\nDolor');
                expect(regexpUniqueTextProcessor.totalLinesCount).toEqual(6);
                expect(regexpUniqueTextProcessor.linesMatchedCount).toEqual(3);
            });

            it("should tread lines equal with case sensitivity", function () {
                regexpUniqueTextProcessor = new RegexpUniqueTextProcessor();
                expect(regexpUniqueTextProcessor.processText('Lorem\nlorem\nLorem\nLOREM\nLOREM')).toEqual('Lorem\nlorem\nLOREM');
                expect(regexpUniqueTextProcessor.totalLinesCount).toEqual(5);
                expect(regexpUniqueTextProcessor.linesMatchedCount).toEqual(3);
            });

            it("should skip empty lines", function () {
                regexpUniqueTextProcessor = new RegexpUniqueTextProcessor();
                expect(regexpUniqueTextProcessor.processText('Lorem\n\nlorem\n\nLorem\n\nLOREM')).toEqual('Lorem\nlorem\nLOREM');
                expect(regexpUniqueTextProcessor.totalLinesCount).toEqual(7);
                expect(regexpUniqueTextProcessor.linesMatchedCount).toEqual(3);
            });
        });
    });

    describe("import/export object", function () {

        describe("initializeFromObject()", function () {

            var sourceObject;

            beforeEach(function () {
                sourceObject = {
                    isEnabled: true,
                    description: 'foobar'
                };
            });

            it("copyPropertiesFrom copies specified properties", function () {
                regexpUniqueTextProcessor.initializeFromObject(sourceObject);

                expect(regexpUniqueTextProcessor.isEnabled).toEqual(true);
                expect(regexpUniqueTextProcessor.description).toEqual('foobar');
            });

        });

        describe("getExportObject()", function () {

            beforeEach(function () {
                regexpUniqueTextProcessor.isEnabled = true;
                regexpUniqueTextProcessor.description = 'foobar';
            });

            it("extractPropertiesToObject exports empty object if no properties are specified", function () {
                var exportedObject = regexpUniqueTextProcessor.getExportObject();
                expect(exportedObject).toEqual({
                    typeName: 'RegexpUniqueTextProcessor',
                    isEnabled: true,
                    description: 'foobar'
                });
            });
        });
    });
});
