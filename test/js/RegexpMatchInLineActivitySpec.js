/* global RegexpMatchInLineActivity */
describe("RegexpMatchInLineActivity", function () {

    /**
     * {RegexpMatchInLineActivity}
     */
    var regexpMatchLineActivity;

    describe("defaults", function () {

        beforeEach(function () {
            regexpMatchLineActivity = new RegexpMatchInLineActivity('fo{1,2}bar');
        });

        it("should have default values", function () {
            expect(regexpMatchLineActivity.displayName).toEqual('Match in line');
            expect(regexpMatchLineActivity.typeName).toEqual('RegexpMatchInLineActivity');
            expect(regexpMatchLineActivity.searchString).toEqual('fo{1,2}bar');
            expect(regexpMatchLineActivity.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpMatchLineActivity.totalLinesCount).toEqual(0);
            expect(regexpMatchLineActivity.linesMatchedCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {
            it("should return every single line if regexp is empty", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('');
                expect(regexpMatchLineActivity.processText('Lorem\nIpsum\nDolor')).toEqual('Lorem\nIpsum\nDolor');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(3);
            });

            it("should return empty text when input text and regexp are empty", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('');
                expect(regexpMatchLineActivity.processText('')).toEqual('');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(1);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(1);
            });

            it("should return empty text when regexp does not match empty input text", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('[a-z]+');
                expect(regexpMatchLineActivity.processText('')).toEqual('');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(1);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(0);
            });

            it("should return empty text when regexp does not match empty input text", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('[a-z]+');
                expect(regexpMatchLineActivity.processText('123\n123\n123')).toEqual('');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(0);
            });
        });

        describe("normal processing", function () {
            it("should matched text from each line, each match in separate line", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('\\d+');
                expect(regexpMatchLineActivity.processText('Lorem123ipsum\ndolor456sit\namet789lorem\nipsum dolor sit amet')).toEqual('123\n456\n789');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(4);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(3);
            });

            it("when not using grouping - whole match is being returned in each line", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('\\d+\\.\\d+');
                expect(regexpMatchLineActivity.processText('Foo: 12.95\nBar: 9.99\nLorem: 19.95')).toEqual('12.95\n9.99\n19.95');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(3);
            });

            it("when using grouping - match form group 1 is being returned in each line", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('(\\d+)\\.\\d+');
                expect(regexpMatchLineActivity.processText('Foo: 12.95\nBar: 9.99\nLorem: 19.95')).toEqual('12\n9\n19');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(3);
            });
        });

        describe('flags', function () {
            it("should return just lines that match regexp with same case when searchFlagCaseInsensitive is off", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('^[A-Z]+');
                regexpMatchLineActivity.searchFlagCaseInsensitive = false;
                expect(regexpMatchLineActivity.processText('LOREM\nipsum\nDOLOR\nsit\nAMET')).toEqual('LOREM\nDOLOR\nAMET');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(5);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(3);
            });

            it("should return just lines that match regexp with any case when searchFlagCaseInsensitive is off", function () {
                regexpMatchLineActivity = new RegexpMatchInLineActivity('^[A-Z]+');
                regexpMatchLineActivity.searchFlagCaseInsensitive = true;
                expect(regexpMatchLineActivity.processText('LOREM\nipsum\nDOLOR\nsit\nAMET')).toEqual('LOREM\nipsum\nDOLOR\nsit\nAMET');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(5);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(5);
            });
        });

        describe('errors', function () {
            it("invalid regexp sets up validation errors and throws exception", function () {
                try {
                    regexpMatchLineActivity = new RegexpMatchInLineActivity('foo[');
                    regexpMatchLineActivity.processText('Lorem ipsum\ndolor sit amet foo[');
                    expect(true).toEqual(false);
                }
                catch (e) {
                    expect(regexpMatchLineActivity.regexpIsValid).toEqual(false);
                    expect(regexpMatchLineActivity.regexpValidationMessage.length).toBeGreaterThan(0);
                    expect(regexpMatchLineActivity.totalLinesCount).toEqual(2);
                    expect(regexpMatchLineActivity.linesMatchedCount).toEqual(0);
                }
            });
        });
    });

    // FIXME initializeFromObject
    // FIXME getExportObject
});