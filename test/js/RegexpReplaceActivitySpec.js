/*global RegexpReplaceActivity: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpReplaceActivity", function () {

    /**
     * {RegexpReplaceActivity}
     */
    var regexpReplaceActivity;

    describe("defaults", function () {
        beforeEach(function () {
            regexpReplaceActivity = new RegexpReplaceActivity('\\d+', '--- $1 ---');
        });

        it("should have default values", function () {
            expect(regexpReplaceActivity.displayName).toEqual('Replace in text');
            expect(regexpReplaceActivity.typeName).toEqual('RegexpReplaceActivity');
            expect(regexpReplaceActivity.searchString).toEqual('\\d+');
            expect(regexpReplaceActivity.replaceString).toEqual('--- $1 ---');
            expect(regexpReplaceActivity.searchFlagGlobal).toEqual(true);
            expect(regexpReplaceActivity.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpReplaceActivity.searchFlagMultiline).toEqual(false);
            expect(regexpReplaceActivity.replacementsCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {
            it("should return empty string if input is empty", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d', '[DIGIT]');
                expect(regexpReplaceActivity.processText('')).toEqual('');
                expect(regexpReplaceActivity.replacementsCount).toEqual(0);
            });

            it("should return input text when regexp is empty", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('', '');
                expect(regexpReplaceActivity.processText('Lorem ipsum dolor sit amet')).toEqual('Lorem ipsum dolor sit amet');
                expect(regexpReplaceActivity.replacementsCount).toEqual(0);
            });

            it("should return input string when nothing matches regexp", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d+', '--- $1 ---');
                expect(regexpReplaceActivity.processText('Lorem ipsum dolor sit amet')).toEqual('Lorem ipsum dolor sit amet');
                expect(regexpReplaceActivity.replacementsCount).toEqual(0);
            });
        });

        describe("regular processing", function () {
            it("should replace matched text", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d+', '[DIGITS]');
                expect(regexpReplaceActivity.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem [DIGITS] ipsum [DIGITS] dolor');
                expect(regexpReplaceActivity.replacementsCount).toEqual(2);
            });
        });

        describe("special characters", function () {
            it("newline character replacement works (user cannot type this)", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d+', '\n');
                expect(regexpReplaceActivity.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem \n ipsum \n dolor');
                expect(regexpReplaceActivity.replacementsCount).toEqual(2);
            });

            // user enters string (two characters): \n
            // which would be entered in code as: '\\n'
            it("backslash+n also is replaced with newline", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d+', "\\n");
                expect(regexpReplaceActivity.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem \n ipsum \n dolor');
                expect(regexpReplaceActivity.replacementsCount).toEqual(2);
            });

            it("tab character replacement works (user cannot type this)", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d+', '\t');
                expect(regexpReplaceActivity.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem \t ipsum \t dolor');
                expect(regexpReplaceActivity.replacementsCount).toEqual(2);
            });

            it("backslash+n also is replaced with newline", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d+', "\\t");
                expect(regexpReplaceActivity.processText('Lorem 123 ipsum 456 dolor')).toEqual('Lorem \t ipsum \t dolor');
                expect(regexpReplaceActivity.replacementsCount).toEqual(2);
            });

            it("[FIX] multiple \\n or \\t can be in replacement string", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('(\\d)(\\d)(\\d)(\\d)', "$1\\n$2\\n$3\\n$4");
                expect(regexpReplaceActivity.processText('1234')).toEqual('1\n2\n3\n4');
                expect(regexpReplaceActivity.replacementsCount).toEqual(1);
            });
        });

        describe("flags", function () {
            it("should replace just first match when global flag is off", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d+', '[DIGIT]');
                regexpReplaceActivity.searchFlagGlobal = false;
                expect(regexpReplaceActivity.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('Lor[DIGIT]em ips542um 534 dolor s2333id amet');
                expect(regexpReplaceActivity.replacementsCount).toEqual(1);
            });

            it("should replace all matches when global flag is on", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('\\d+', '[DIGIT]');
                regexpReplaceActivity.searchFlagGlobal = true;
                expect(regexpReplaceActivity.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('Lor[DIGIT]em ips[DIGIT]um [DIGIT] dolor s[DIGIT]id amet');
                expect(regexpReplaceActivity.replacementsCount).toEqual(4);
            });

            it("should replace just matches with same case when case insensitivity flag is off", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('[a-z]', '[LETTER]');
                regexpReplaceActivity.searchFlagGlobal = true;
                regexpReplaceActivity.searchFlagCaseInsensitive = false;
                expect(regexpReplaceActivity.processText('12 ab 34 CD 56 eF 78 Gh 90')).toEqual('12 [LETTER][LETTER] 34 CD 56 [LETTER]F 78 G[LETTER] 90');
                expect(regexpReplaceActivity.replacementsCount).toEqual(4);
            });

            it("should replace all matches when case insensitivity flag is on", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('[a-z]', '[LETTER]');
                regexpReplaceActivity.searchFlagGlobal = true;
                regexpReplaceActivity.searchFlagCaseInsensitive = true;
                expect(regexpReplaceActivity.processText('12 ab 34 CD 56 eF 78 Gh 90')).toEqual('12 [LETTER][LETTER] 34 [LETTER][LETTER] 56 [LETTER][LETTER] 78 [LETTER][LETTER] 90');
                expect(regexpReplaceActivity.replacementsCount).toEqual(8);
            });

            it("should replace in first line when multiline flag is off", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('^([a-zA-Z])', '[$1]');
                regexpReplaceActivity.searchFlagGlobal = true;
                regexpReplaceActivity.searchFlagMultiline = false;

                var inputText, expectedText;
                inputText = 'Lorem ipsum dolor sit amet\n' +
                    'consectetur adipiscing elit\n' +
                    'Nunc in felis tincidunt\n' +
                    'pretium mi et, bibendum nisi\n';
                expectedText = '[L]orem ipsum dolor sit amet\n' +
                    'consectetur adipiscing elit\n' +
                    'Nunc in felis tincidunt\n' +
                    'pretium mi et, bibendum nisi\n';
                expect(regexpReplaceActivity.processText(inputText)).toEqual(expectedText);

                expect(regexpReplaceActivity.replacementsCount).toEqual(1);
            });

            it("should replace in each line when multiline flag is on", function () {
                regexpReplaceActivity = new RegexpReplaceActivity('^([a-zA-Z])', '[$1]');
                regexpReplaceActivity.searchFlagGlobal = true;
                regexpReplaceActivity.searchFlagMultiline = true;

                var inputText, expectedText;
                inputText = 'Lorem ipsum dolor sit amet\n' +
                    'consectetur adipiscing elit\n' +
                    'Nunc in felis tincidunt\n' +
                    'pretium mi et, bibendum nisi\n';
                expectedText = '[L]orem ipsum dolor sit amet\n' +
                    '[c]onsectetur adipiscing elit\n' +
                    '[N]unc in felis tincidunt\n' +
                    '[p]retium mi et, bibendum nisi\n';
                expect(regexpReplaceActivity.processText(inputText)).toEqual(expectedText);

                expect(regexpReplaceActivity.replacementsCount).toEqual(4);
            });
        });


        describe("errors", function () {

            it("invalid regexp sets up validation errors and throws exception", function () {
                try {
                    regexpReplaceActivity = new RegexpReplaceActivity('foo[RegexpReplaceActivitySpec.js', '--- $1 ---');
                    regexpReplaceActivity.processText('Lorem ipsum dolor sit amet foo[');
                    expect(true).toEqual(false);
                } catch (e) {
                    expect(regexpReplaceActivity.regexpIsValid).toEqual(false);
                    expect(regexpReplaceActivity.regexpValidationMessage.length).toBeGreaterThan(1);
                    expect(regexpReplaceActivity.replacementsCount).toEqual(0);
                }
            });
        });

    });

    // FIXME initializeFromObject
    // FIXME getExportObject
});
