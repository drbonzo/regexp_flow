/*global RegexpReplaceTextProcessor: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpReplaceTextProcessor", function () {

    /**
     * {RegexpReplaceTextProcessor}
     */
    var regexpReplaceTextProcessor;

    describe("defaults", function () {
        beforeEach(function () {
            regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', '--- $1 ---');
        });

        it("should have default values", function () {
            expect(regexpReplaceTextProcessor.displayName).toEqual('Replace in text');
            expect(regexpReplaceTextProcessor.typeName).toEqual('RegexpReplaceTextProcessor');
            expect(regexpReplaceTextProcessor.searchString).toEqual('\\d+');
            expect(regexpReplaceTextProcessor.replaceString).toEqual('--- $1 ---');
            expect(regexpReplaceTextProcessor.searchFlagGlobal).toEqual(true);
            expect(regexpReplaceTextProcessor.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpReplaceTextProcessor.searchFlagMultiline).toEqual(false);
            expect(regexpReplaceTextProcessor.replacementsCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {
            it("should return empty string if input is empty", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d', '[DIGIT]');
                expect(regexpReplaceTextProcessor.processText('')).toEqual('');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(0);
            });

            it("should return input text when regexp is empty", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('', '');
                expect(regexpReplaceTextProcessor.processText('Lorem ipsum dolor sit amet')).toEqual('Lorem ipsum dolor sit amet');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(0);
            });

            it("should return input string when nothing matches regexp", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', '--- $1 ---');
                expect(regexpReplaceTextProcessor.processText('Lorem ipsum dolor sit amet')).toEqual('Lorem ipsum dolor sit amet');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(0);
            });
        });

        describe("regular processing", function () {
            it("should replace matched text", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', '[DIGITS]');
                expect(regexpReplaceTextProcessor.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem [DIGITS] ipsum [DIGITS] dolor');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(2);
            });
        });

        describe("special characters", function () {
            it("newline character replacement works (user cannot type this)", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', '\n');
                expect(regexpReplaceTextProcessor.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem \n ipsum \n dolor');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(2);
            });

            // user enters string (two characters): \n
            // which would be entered in code as: '\\n'
            it("backslash+n also is replaced with newline", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', "\\n");
                expect(regexpReplaceTextProcessor.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem \n ipsum \n dolor');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(2);
            });

            it("tab character replacement works (user cannot type this)", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', '\t');
                expect(regexpReplaceTextProcessor.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem \t ipsum \t dolor');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(2);
            });

            it("backslash+n also is replaced with newline", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', "\\t");
                expect(regexpReplaceTextProcessor.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem \t ipsum \t dolor');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(2);
            });

            it("[FIX] multiple \\n or \\t can be in replacement string", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('(\\d)(\\d)(\\d)(\\d)', "$1\\n$2\\n$3\\n$4");
                expect(regexpReplaceTextProcessor.processText('1234')).toEqual('1\n2\n3\n4');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(1);
            });
        });

        describe("flags", function () {
            it("should replace just first match when global flag is off", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', '[DIGIT]');
                regexpReplaceTextProcessor.searchFlagGlobal = false;
                expect(regexpReplaceTextProcessor.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('Lor[DIGIT]em ips542um 534 dolor s2333id amet');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(1);
            });

            it("should replace all matches when global flag is on", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('\\d+', '[DIGIT]');
                regexpReplaceTextProcessor.searchFlagGlobal = true;
                expect(regexpReplaceTextProcessor.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('Lor[DIGIT]em ips[DIGIT]um [DIGIT] dolor s[DIGIT]id amet');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(4);
            });

            it("should replace just matches with same case when case insensitivity flag is off", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('[a-z]', '[LETTER]');
                regexpReplaceTextProcessor.searchFlagGlobal = true;
                regexpReplaceTextProcessor.searchFlagCaseInsensitive = false;
                expect(regexpReplaceTextProcessor.processText('12 ab 34 CD 56 eF 78 Gh 90')).toEqual('12 [LETTER][LETTER] 34 CD 56 [LETTER]F 78 G[LETTER] 90');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(4);
            });

            it("should replace all matches when case insensitivity flag is on", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('[a-z]', '[LETTER]');
                regexpReplaceTextProcessor.searchFlagGlobal = true;
                regexpReplaceTextProcessor.searchFlagCaseInsensitive = true;
                expect(regexpReplaceTextProcessor.processText('12 ab 34 CD 56 eF 78 Gh 90')).toEqual('12 [LETTER][LETTER] 34 [LETTER][LETTER] 56 [LETTER][LETTER] 78 [LETTER][LETTER] 90');
                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(8);
            });

            it("should replace in first line when multiline flag is off", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('^([a-zA-Z])', '[$1]');
                regexpReplaceTextProcessor.searchFlagGlobal = true;
                regexpReplaceTextProcessor.searchFlagMultiline = false;

                var inputText, expectedText;
                inputText = 'Lorem ipsum dolor sit amet\n' +
                    'consectetur adipiscing elit\n' +
                    'Nunc in felis tincidunt\n' +
                    'pretium mi et, bibendum nisi\n';
                expectedText = '[L]orem ipsum dolor sit amet\n' +
                    'consectetur adipiscing elit\n' +
                    'Nunc in felis tincidunt\n' +
                    'pretium mi et, bibendum nisi\n';
                expect(regexpReplaceTextProcessor.processText(inputText)).toEqual(expectedText);

                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(1);
            });

            it("should replace in each line when multiline flag is on", function () {
                regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('^([a-zA-Z])', '[$1]');
                regexpReplaceTextProcessor.searchFlagGlobal = true;
                regexpReplaceTextProcessor.searchFlagMultiline = true;

                var inputText, expectedText;
                inputText = 'Lorem ipsum dolor sit amet\n' +
                    'consectetur adipiscing elit\n' +
                    'Nunc in felis tincidunt\n' +
                    'pretium mi et, bibendum nisi\n';
                expectedText = '[L]orem ipsum dolor sit amet\n' +
                    '[c]onsectetur adipiscing elit\n' +
                    '[N]unc in felis tincidunt\n' +
                    '[p]retium mi et, bibendum nisi\n';
                expect(regexpReplaceTextProcessor.processText(inputText)).toEqual(expectedText);

                expect(regexpReplaceTextProcessor.replacementsCount).toEqual(4);
            });
        });


        describe("errors", function () {

            it("invalid regexp sets up validation errors and throws exception", function () {
                try {
                    regexpReplaceTextProcessor = new RegexpReplaceTextProcessor('foo[RegexpReplaceTextProcessorSpec.js', '--- $1 ---');
                    regexpReplaceTextProcessor.processText('Lorem ipsum dolor sit amet foo[');
                    expect(true).toEqual(false);
                } catch (e) {
                    expect(regexpReplaceTextProcessor.regexpIsValid).toEqual(false);
                    expect(regexpReplaceTextProcessor.regexpValidationMessage.length).toBeGreaterThan(1);
                    expect(regexpReplaceTextProcessor.replacementsCount).toEqual(0);
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
                    replaceString: '--$1--',
                    searchFlagGlobal: true,
                    searchFlagMultiline: true,
                    searchFlagCaseInsensitive: true,
                    isEnabled: true,
                    description: 'foobar'
                };
            });

            it("copyPropertiesFrom copies specified properties", function () {
                regexpReplaceTextProcessor.initializeFromObject(sourceObject);

                expect(regexpReplaceTextProcessor.searchString).toEqual('[a-z]');
                expect(regexpReplaceTextProcessor.replaceString).toEqual('--$1--');
                expect(regexpReplaceTextProcessor.searchFlagGlobal).toEqual(true);
                expect(regexpReplaceTextProcessor.searchFlagMultiline).toEqual(true);
                expect(regexpReplaceTextProcessor.searchFlagCaseInsensitive).toEqual(true);
                expect(regexpReplaceTextProcessor.isEnabled).toEqual(true);
                expect(regexpReplaceTextProcessor.description).toEqual('foobar');
            });
        });

        describe("getExportObject()", function () {

            beforeEach(function () {
                regexpReplaceTextProcessor.searchString = 'foo';
                regexpReplaceTextProcessor.replaceString = '--$1--';
                regexpReplaceTextProcessor.searchFlagGlobal = true;
                regexpReplaceTextProcessor.searchFlagMultiline = true;
                regexpReplaceTextProcessor.searchFlagCaseInsensitive = true;
                regexpReplaceTextProcessor.isEnabled = true;
                regexpReplaceTextProcessor.description = 'foobar';
            });

            it("extractPropertiesToObject exports empty object if no properties are specified", function () {
                var exportedObject = regexpReplaceTextProcessor.getExportObject();
                expect(exportedObject).toEqual({
                    typeName: 'RegexpReplaceTextProcessor',
                    searchString: 'foo',
                    replaceString: '--$1--',
                    searchFlagGlobal: true,
                    searchFlagMultiline: true,
                    searchFlagCaseInsensitive: true,
                    isEnabled: true,
                    description: 'foobar'
                });
            });
        });
    });
});
