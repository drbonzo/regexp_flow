/* global RegexpMatchLineActivity */
describe("RegexpMatchLineActivity", function () {

    /**
     * {RegexpMatchLineActivity}
     */
    var regexpMatchLineActivity;

    describe("defaults", function () {

        beforeEach(function () {
            regexpMatchLineActivity = new RegexpMatchLineActivity('fo{1,2}bar');
        });

        it("should have default values", function () {
            expect(regexpMatchLineActivity.displayName).toEqual('Match lines');
            expect(regexpMatchLineActivity.typeName).toEqual('RegexpMatchLineActivity');
            expect(regexpMatchLineActivity.searchString).toEqual('fo{1,2}bar');
            expect(regexpMatchLineActivity.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpMatchLineActivity.totalLinesCount).toEqual(0);
            expect(regexpMatchLineActivity.linesMatchedCount).toEqual(0);
            expect(regexpMatchLineActivity.flagInvertMatch).toEqual(false);
        });
    });

    describe("processText", function () {

        it("should return empty string if input is empty", function () {
            regexpMatchLineActivity = new RegexpMatchLineActivity('\\d+');
            expect(regexpMatchLineActivity.processText('')).toEqual('');
            expect(regexpMatchLineActivity.totalLinesCount).toEqual(1);
            expect(regexpMatchLineActivity.linesMatchedCount).toEqual(0);
        });

        it("should return input text when regexp is empty", function () {
            regexpMatchLineActivity = new RegexpMatchLineActivity('');
            expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\nipsum\ndolor');
            expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
            expect(regexpMatchLineActivity.linesMatchedCount).toEqual(3);
        });

        // FLAGS

        describe('flags', function () {

            it("should return just lines that match regexp when flagInvertMatch is off", function () {
                regexpMatchLineActivity = new RegexpMatchLineActivity('o');
                regexpMatchLineActivity.flagInvertMatch = false;
                expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\ndolor');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(2);
            });

            it("should return empty string when no line matches regexp and flagInvertMatch is off", function () {
                regexpMatchLineActivity = new RegexpMatchLineActivity('xxx');
                regexpMatchLineActivity.flagInvertMatch = false;
                expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(0);
            });

            it("should return every line when every line matches regexp and flagInvertMatch is off", function () {
                regexpMatchLineActivity = new RegexpMatchLineActivity('[a-z]');
                regexpMatchLineActivity.flagInvertMatch = false;
                expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\nipsum\ndolor');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(3);
            });

            it("should return just lines that do not match regexp when flagInvertMatch is on", function () {
                regexpMatchLineActivity = new RegexpMatchLineActivity('o');
                regexpMatchLineActivity.flagInvertMatch = true;
                expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('ipsum');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(1);
            });

            it("should return empty string when all lines match regexp and flagInvertMatch is on", function () {
                regexpMatchLineActivity = new RegexpMatchLineActivity('[a-z]');
                regexpMatchLineActivity.flagInvertMatch = true;
                expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(0);
            });

            it("should return every line when no line matches regexp and flagInvertMatch is on", function () {
                regexpMatchLineActivity = new RegexpMatchLineActivity('xxx');
                regexpMatchLineActivity.flagInvertMatch = true;
                expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\nipsum\ndolor');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(3);
            });


            it("should return just lines that match regexp with same case when searchFlagCaseInsensitive is off", function () {
                regexpMatchLineActivity = new RegexpMatchLineActivity('L');
                regexpMatchLineActivity.flagInvertMatch = false;
                regexpMatchLineActivity.searchFlagCaseInsensitive = false;
                expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('Lorem');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(1);
            });

            it("should return just lines that match regexp with any case when searchFlagCaseInsensitive is off", function () {
                regexpMatchLineActivity = new RegexpMatchLineActivity('L');
                regexpMatchLineActivity.flagInvertMatch = false;
                regexpMatchLineActivity.searchFlagCaseInsensitive = true;
                expect(regexpMatchLineActivity.processText('Lorem\nipsum\ndolor')).toEqual('Lorem\ndolor');
                expect(regexpMatchLineActivity.totalLinesCount).toEqual(3);
                expect(regexpMatchLineActivity.linesMatchedCount).toEqual(2);
            });
        });

        it("invalid regexp sets up validation errors and throws exception", function () {
            try {
                regexpMatchLineActivity = new RegexpMatchLineActivity('foo[');
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

    // FIXME initializeFromObject
    // FIXME getExportObject
});