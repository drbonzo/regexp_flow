/*global RegexpMatchInLineTextProcessor: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpMatchInLineTextProcessor", function () {

    /**
     * {RegexpMatchInLineTextProcessor}
     */
    var regexpMatchInLineTextProcessor;

    describe("defaults", function () {

        beforeEach(function () {
            regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('fo{1,2}bar');
        });

        it("should have default values", function () {
            expect(regexpMatchInLineTextProcessor.displayName).toEqual('Match in line');
            expect(regexpMatchInLineTextProcessor.typeName).toEqual('RegexpMatchInLineTextProcessor');
            expect(regexpMatchInLineTextProcessor.searchString).toEqual('fo{1,2}bar');
            expect(regexpMatchInLineTextProcessor.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(0);
            expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {

            it("should return every single line if regexp is empty", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('');
                expect(regexpMatchInLineTextProcessor.processText('Lorem\nIpsum\nDolor')).toEqual('Lorem\nIpsum\nDolor');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(3);
            });

            it("should return empty text when input text and regexp are empty", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('');
                expect(regexpMatchInLineTextProcessor.processText('')).toEqual('');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(1);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(1);
            });

            it("should return empty text when regexp does not match empty input text", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('[a-z]+');
                expect(regexpMatchInLineTextProcessor.processText('')).toEqual('');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(1);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(0);
            });

            it("should return empty text when regexp does not match empty input text", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('[a-z]+');
                expect(regexpMatchInLineTextProcessor.processText('123\n123\n123')).toEqual('');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(0);
            });
        });

        describe("normal processing", function () {
            it("should matched text from each line, each match in separate line", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('\\d+');
                expect(regexpMatchInLineTextProcessor.processText('Lorem123ipsum\ndolor456sit\namet789lorem\nipsum dolor sit amet')).toEqual('123\n456\n789');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(4);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(3);
            });

            it("when not using grouping - whole match is being returned in each line", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('\\d+\\.\\d+');
                expect(regexpMatchInLineTextProcessor.processText('Foo: 12.95\nBar: 9.99\nLorem: 19.95')).toEqual('12.95\n9.99\n19.95');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(3);
            });

            it("when using grouping - match form group 1 is being returned in each line", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('(\\d+)\\.\\d+');
                expect(regexpMatchInLineTextProcessor.processText('Foo: 12.95\nBar: 9.99\nLorem: 19.95')).toEqual('12\n9\n19');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(3);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(3);
            });
        });

        describe('flags', function () {
            it("should return just lines that match regexp with same case when searchFlagCaseInsensitive is off", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('^[A-Z]+');
                regexpMatchInLineTextProcessor.searchFlagCaseInsensitive = false;
                expect(regexpMatchInLineTextProcessor.processText('LOREM\nipsum\nDOLOR\nsit\nAMET')).toEqual('LOREM\nDOLOR\nAMET');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(5);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(3);
            });

            it("should return just lines that match regexp with any case when searchFlagCaseInsensitive is off", function () {
                regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('^[A-Z]+');
                regexpMatchInLineTextProcessor.searchFlagCaseInsensitive = true;
                expect(regexpMatchInLineTextProcessor.processText('LOREM\nipsum\nDOLOR\nsit\nAMET')).toEqual('LOREM\nipsum\nDOLOR\nsit\nAMET');
                expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(5);
                expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(5);
            });
        });

        describe('errors', function () {
            it("invalid regexp sets up validation errors and throws exception", function () {
                try {
                    regexpMatchInLineTextProcessor = new RegexpMatchInLineTextProcessor('foo[');
                    regexpMatchInLineTextProcessor.processText('Lorem ipsum\ndolor sit amet foo[');
                    expect(true).toEqual(false);
                } catch (e) {
                    expect(regexpMatchInLineTextProcessor.regexpIsValid).toEqual(false);
                    expect(regexpMatchInLineTextProcessor.regexpValidationMessage.length).toBeGreaterThan(0);
                    expect(regexpMatchInLineTextProcessor.totalLinesCount).toEqual(2);
                    expect(regexpMatchInLineTextProcessor.linesMatchedCount).toEqual(0);
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
                    isEnabled: true,
                    description: 'foobar'
                };
            });

            it("copyPropertiesFrom copies specified properties", function () {
                regexpMatchInLineTextProcessor.initializeFromObject(sourceObject);

                expect(regexpMatchInLineTextProcessor.searchString).toEqual('[a-z]');
                expect(regexpMatchInLineTextProcessor.searchFlagCaseInsensitive).toEqual(true);
                expect(regexpMatchInLineTextProcessor.isEnabled).toEqual(true);
                expect(regexpMatchInLineTextProcessor.description).toEqual('foobar');
            });

        });

        describe("getExportObject()", function () {

            beforeEach(function () {
                regexpMatchInLineTextProcessor.searchString = 'foo';
                regexpMatchInLineTextProcessor.searchFlagCaseInsensitive = true;
                regexpMatchInLineTextProcessor.isEnabled = true;
                regexpMatchInLineTextProcessor.description = 'foobar';
            });

            it("extractPropertiesToObject exports empty object if no properties are specified", function () {
                var exportedObject = regexpMatchInLineTextProcessor.getExportObject();
                expect(exportedObject).toEqual({
                    typeName: 'RegexpMatchInLineTextProcessor',
                    searchString: 'foo',
                    searchFlagCaseInsensitive: true,
                    isEnabled: true,
                    description: 'foobar'
                });
            });
        });
    });

});
