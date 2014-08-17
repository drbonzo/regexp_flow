/*global RegexpMatchLineTextProcessor: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpMatchLineTextProcessor", function () {

    /**
     * {RegexpMatchLineTextProcessor}
     */
    var regexpMatchLineTextProcessor;

    describe("defaults", function () {

        beforeEach(function () {
            regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('fo{1,2}bar');
        });

        it("should have default values", function () {
            expect(regexpMatchLineTextProcessor.displayName).toEqual('Match lines');
            expect(regexpMatchLineTextProcessor.typeName).toEqual('RegexpMatchLineTextProcessor');
            expect(regexpMatchLineTextProcessor.searchString).toEqual('fo{1,2}bar');
            expect(regexpMatchLineTextProcessor.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(0);
            expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(0);
            expect(regexpMatchLineTextProcessor.flagInvertMatch).toEqual(false);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {
            it("should return empty string if input is empty", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('\\d+');
                expect(regexpMatchLineTextProcessor.processText('')).toEqual('');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(1);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(0);
            });

            it("should return input text when regexp is empty", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('');
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\nipsum\ndolor');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(3);
            });
        });

        describe('matching and flags', function () {

            it("should return just lines that match regexp when flagInvertMatch is off", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('o');
                regexpMatchLineTextProcessor.flagInvertMatch = false;
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\ndolor');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(2);
            });

            it("should return empty string when no line matches regexp and flagInvertMatch is off", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('xxx');
                regexpMatchLineTextProcessor.flagInvertMatch = false;
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(0);
            });

            it("should return every line when every line matches regexp and flagInvertMatch is off", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('[a-z]');
                regexpMatchLineTextProcessor.flagInvertMatch = false;
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\nipsum\ndolor');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(3);
            });

            it("should return just lines that do not match regexp when flagInvertMatch is on", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('o');
                regexpMatchLineTextProcessor.flagInvertMatch = true;
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('ipsum');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(1);
            });

            it("should return empty string when all lines match regexp and flagInvertMatch is on", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('[a-z]');
                regexpMatchLineTextProcessor.flagInvertMatch = true;
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(0);
            });

            it("should return every line when no line matches regexp and flagInvertMatch is on", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('xxx');
                regexpMatchLineTextProcessor.flagInvertMatch = true;
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\nipsum\ndolor');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(3);
            });


            it("should return just lines that match regexp with same case when searchFlagCaseInsensitive is off", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('L');
                regexpMatchLineTextProcessor.flagInvertMatch = false;
                regexpMatchLineTextProcessor.searchFlagCaseInsensitive = false;
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('Lorem');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(1);
            });

            it("should return just lines that match regexp with any case when searchFlagCaseInsensitive is off", function () {
                regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('L');
                regexpMatchLineTextProcessor.flagInvertMatch = false;
                regexpMatchLineTextProcessor.searchFlagCaseInsensitive = true;
                expect(regexpMatchLineTextProcessor.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\ndolor');
                expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(2);
            });
        });

        describe("errors", function () {
            it("invalid regexp sets up validation errors and throws exception", function () {
                try {
                    regexpMatchLineTextProcessor = new RegexpMatchLineTextProcessor('foo[');
                    regexpMatchLineTextProcessor.processText('Lorem ipsum\ndolor sit amet foo[');
                    expect(true).toEqual(false);
                } catch (e) {
                    expect(regexpMatchLineTextProcessor.regexpIsValid).toEqual(false);
                    expect(regexpMatchLineTextProcessor.regexpValidationMessage.length).toBeGreaterThan(0);
                    expect(regexpMatchLineTextProcessor.totalLinesCount).toEqual(2);
                    expect(regexpMatchLineTextProcessor.linesMatchedCount).toEqual(0);
                }
            });
        });
    });

    describe("import/export object", function () {

        describe("initializeFromObject()", function () {

            var sourceObject;

            beforeEach(function () {
                sourceObject = {
                    searchString: '[a-z]',
                    searchFlagCaseInsensitive: true,
                    flagInvertMatch : true,
                    isEnabled: true,
                    description: 'foobar'
                };
            });

            it("copyPropertiesFrom copies specified properties", function () {
                regexpMatchLineTextProcessor.initializeFromObject(sourceObject);

                expect(regexpMatchLineTextProcessor.searchString).toEqual('[a-z]');
                expect(regexpMatchLineTextProcessor.searchFlagCaseInsensitive).toEqual(true);
                expect(regexpMatchLineTextProcessor.flagInvertMatch).toEqual(true);
                expect(regexpMatchLineTextProcessor.isEnabled).toEqual(true);
                expect(regexpMatchLineTextProcessor.description).toEqual('foobar');
            });

        });

        describe("getExportObject()", function () {

            beforeEach(function () {
                regexpMatchLineTextProcessor.searchString = 'foo';
                regexpMatchLineTextProcessor.searchFlagCaseInsensitive = true;
                regexpMatchLineTextProcessor.flagInvertMatch = true;
                regexpMatchLineTextProcessor.isEnabled = true;
                regexpMatchLineTextProcessor.description = 'foobar';
            });

            it("extractPropertiesToObject exports empty object if no properties are specified", function () {
                var exportedObject = regexpMatchLineTextProcessor.getExportObject();
                expect(exportedObject).toEqual({
                    searchString: 'foo',
                    searchFlagCaseInsensitive: true,
                    flagInvertMatch: true,
                    isEnabled: true,
                    typeName: 'RegexpMatchLineTextProcessor',
                    description: 'foobar'
                });
            });
        });
    });

});