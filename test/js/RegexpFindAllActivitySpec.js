/*global RegexpFindAllActivity: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpFindAllActivity", function () {

    /**
     * {RegexpFindAllActivity}
     */
    var regexpFindAllActivity;

    describe("defaults", function () {

        beforeEach(function () {
            regexpFindAllActivity = new RegexpFindAllActivity('fo{1,2}bar');
        });

        it("should have default values", function () {
            expect(regexpFindAllActivity.displayName).toEqual('Find all matches');
            expect(regexpFindAllActivity.typeName).toEqual('RegexpFindAllActivity');
            expect(regexpFindAllActivity.searchString).toEqual('fo{1,2}bar');
            expect(regexpFindAllActivity.searchFlagGlobal).toEqual(true);
            expect(regexpFindAllActivity.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpFindAllActivity.searchFlagMultiline).toEqual(true);
            expect(regexpFindAllActivity.matchesCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {
            it("should return empty string if input is empty", function () {
                regexpFindAllActivity = new RegexpFindAllActivity('\\d+');
                expect(regexpFindAllActivity.processText('')).toEqual('');
                expect(regexpFindAllActivity.matchesCount).toEqual(0);
            });

            it("should return input text when regexp is empty", function () {
                regexpFindAllActivity = new RegexpFindAllActivity('');
                expect(regexpFindAllActivity.processText('Lorem ipsum dolor sit amet')).toEqual('Lorem ipsum dolor sit amet');
                expect(regexpFindAllActivity.matchesCount).toEqual(0);
            });

        });

        describe("normal matching", function () {

            it("should return found matches, each in new line", function () {
                regexpFindAllActivity = new RegexpFindAllActivity('\\d+');
                expect(regexpFindAllActivity.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('2\n542\n534\n2333');
                expect(regexpFindAllActivity.matchesCount).toEqual(4);
            });

            it("should return empty string when no matches are found", function () {
                regexpFindAllActivity = new RegexpFindAllActivity('\\d+');
                expect(regexpFindAllActivity.processText('Lorem ipsum dolor sit amet')).toEqual('');
                expect(regexpFindAllActivity.matchesCount).toEqual(0);
            });
        });

        describe("flags", function () {

            it("should return just first match when global flag is off", function () {
                regexpFindAllActivity = new RegexpFindAllActivity('\\d+');
                regexpFindAllActivity.searchFlagGlobal = false;
                expect(regexpFindAllActivity.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('2');
                expect(regexpFindAllActivity.matchesCount).toEqual(1);
            });

            it("should return all matches when global flag is on", function () {
                regexpFindAllActivity = new RegexpFindAllActivity('\\d+');
                regexpFindAllActivity.searchFlagGlobal = true;
                expect(regexpFindAllActivity.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('2\n542\n534\n2333');
                expect(regexpFindAllActivity.matchesCount).toEqual(4);
            });

            it("should return just case matched items when case insensivite flag is off", function () {
                regexpFindAllActivity = new RegexpFindAllActivity('lorem');
                regexpFindAllActivity.searchFlagCaseInsensitive = false;
                expect(regexpFindAllActivity.processText('Lorem LOREM LoReM loreM lorem')).toEqual('lorem');
                expect(regexpFindAllActivity.matchesCount).toEqual(1);
            });

            it("should return all matched items when case insensivite flag is on", function () {
                regexpFindAllActivity = new RegexpFindAllActivity('lorem');
                regexpFindAllActivity.searchFlagCaseInsensitive = true;
                expect(regexpFindAllActivity.processText('Lorem LOREM LoReM loreM lorem')).toEqual('Lorem\nLOREM\nLoReM\nloreM\nlorem');
                expect(regexpFindAllActivity.matchesCount).toEqual(5);
            });
        });


        describe("errors", function () {
            it("invalid regexp sets up validation errors and throws exception", function () {
                try {
                    regexpFindAllActivity = new RegexpFindAllActivity('foo[');
                    regexpFindAllActivity.processText('Lorem ipsum dolor sit amet foo[');
                    expect(true).toEqual(false);
                } catch (e) {
                    expect(regexpFindAllActivity.regexpIsValid).toEqual(false);
                    expect(regexpFindAllActivity.regexpValidationMessage.length).toBeGreaterThan(0);
                    expect(regexpFindAllActivity.matchesCount).toEqual(0);
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
                regexpFindAllActivity.initializeFromObject(sourceObject);

                expect(regexpFindAllActivity.searchString).toEqual('[a-z]');
                expect(regexpFindAllActivity.searchFlagCaseInsensitive).toEqual(true);
                expect(regexpFindAllActivity.isEnabled).toEqual(true);
            });

        });

        describe("getExportObject()", function () {

            beforeEach(function () {
                regexpFindAllActivity.searchString = 'foo';
                regexpFindAllActivity.searchFlagCaseInsensitive = true;
                regexpFindAllActivity.isEnabled = true;
            });

            it("extractPropertiesToObject exports empty object if no properties are specified", function () {
                var exportedObject = regexpFindAllActivity.getExportObject();
                expect(exportedObject).toEqual({
                    typeName: 'RegexpFindAllActivity',
                    searchString: 'foo',
                    searchFlagCaseInsensitive: true,
                    isEnabled: true
                });
            });
        });
    });

});