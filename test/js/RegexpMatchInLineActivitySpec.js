/*global RegexpMatchInLineActivity: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpMatchInLineActivity", function () {

    /**
     * {RegexpMatchInLineActivity}
     */
    var regexpMatchInLineActivity;

    describe("defaults", function () {

        beforeEach(function () {
            regexpMatchInLineActivity = new RegexpMatchInLineActivity('fo{1,2}bar');
        });

        it("should have default values", function () {
            expect(regexpMatchInLineActivity.displayName).toEqual('Match in line');
            expect(regexpMatchInLineActivity.typeName).toEqual('RegexpMatchInLineActivity');
            expect(regexpMatchInLineActivity.searchString).toEqual('fo{1,2}bar');
            expect(regexpMatchInLineActivity.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpMatchInLineActivity.totalLinesCount).toEqual(0);
            expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {

            it("should return every single line if regexp is empty", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('');
                expect(regexpMatchInLineActivity.processText('Lorem\nIpsum\nDolor')).toEqual('Lorem\nIpsum\nDolor');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(3);
            });

            it("should return empty text when input text and regexp are empty", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('');
                expect(regexpMatchInLineActivity.processText('')).toEqual('');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(1);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(1);
            });

            it("should return empty text when regexp does not match empty input text", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('[a-z]+');
                expect(regexpMatchInLineActivity.processText('')).toEqual('');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(1);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(0);
            });

            it("should return empty text when regexp does not match empty input text", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('[a-z]+');
                expect(regexpMatchInLineActivity.processText('123\n123\n123')).toEqual('');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(0);
            });
        });

        describe("normal processing", function () {
            it("should matched text from each line, each match in separate line", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('\\d+');
                expect(regexpMatchInLineActivity.processText('Lorem123ipsum\ndolor456sit\namet789lorem\nipsum dolor sit amet')).toEqual('123\n456\n789');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(4);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(3);
            });

            it("when not using grouping - whole match is being returned in each line", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('\\d+\\.\\d+');
                expect(regexpMatchInLineActivity.processText('Foo: 12.95\nBar: 9.99\nLorem: 19.95')).toEqual('12.95\n9.99\n19.95');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(3);
            });

            it("when using grouping - match form group 1 is being returned in each line", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('(\\d+)\\.\\d+');
                expect(regexpMatchInLineActivity.processText('Foo: 12.95\nBar: 9.99\nLorem: 19.95')).toEqual('12\n9\n19');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(3);
            });
        });

        describe('flags', function () {
            it("should return just lines that match regexp with same case when searchFlagCaseInsensitive is off", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('^[A-Z]+');
                regexpMatchInLineActivity.searchFlagCaseInsensitive = false;
                expect(regexpMatchInLineActivity.processText('LOREM\nipsum\nDOLOR\nsit\nAMET')).toEqual('LOREM\nDOLOR\nAMET');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(5);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(3);
            });

            it("should return just lines that match regexp with any case when searchFlagCaseInsensitive is off", function () {
                regexpMatchInLineActivity = new RegexpMatchInLineActivity('^[A-Z]+');
                regexpMatchInLineActivity.searchFlagCaseInsensitive = true;
                expect(regexpMatchInLineActivity.processText('LOREM\nipsum\nDOLOR\nsit\nAMET')).toEqual('LOREM\nipsum\nDOLOR\nsit\nAMET');
                expect(regexpMatchInLineActivity.totalLinesCount).toEqual(5);
                expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(5);
            });
        });

        describe('errors', function () {
            it("invalid regexp sets up validation errors and throws exception", function () {
                try {
                    regexpMatchInLineActivity = new RegexpMatchInLineActivity('foo[');
                    regexpMatchInLineActivity.processText('Lorem ipsum\ndolor sit amet foo[');
                    expect(true).toEqual(false);
                } catch (e) {
                    expect(regexpMatchInLineActivity.regexpIsValid).toEqual(false);
                    expect(regexpMatchInLineActivity.regexpValidationMessage.length).toBeGreaterThan(0);
                    expect(regexpMatchInLineActivity.totalLinesCount).toEqual(2);
                    expect(regexpMatchInLineActivity.linesMatchedCount).toEqual(0);
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
                    isEnabled: true
                };
            });

            it("copyPropertiesFrom copies specified properties", function () {
                regexpMatchInLineActivity.initializeFromObject(sourceObject);

                expect(regexpMatchInLineActivity.searchString).toEqual('[a-z]');
                expect(regexpMatchInLineActivity.searchFlagCaseInsensitive).toEqual(true);
                expect(regexpMatchInLineActivity.isEnabled).toEqual(true);
            });

        });

        describe("getExportObject()", function () {

            beforeEach(function () {
                regexpMatchInLineActivity.searchString = 'foo';
                regexpMatchInLineActivity.searchFlagCaseInsensitive = true;
                regexpMatchInLineActivity.isEnabled = true;
            });

            it("extractPropertiesToObject exports empty object if no properties are specified", function () {
                var exportedObject = regexpMatchInLineActivity.getExportObject();
                expect(exportedObject).toEqual({
                    typeName: 'RegexpMatchInLineActivity',
                    searchString: 'foo',
                    searchFlagCaseInsensitive: true,
                    isEnabled: true
                });
            });
        });
    });

});
