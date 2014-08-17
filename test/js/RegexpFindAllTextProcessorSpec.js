/*global RegexpFindAllTextProcessor: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpFindAllTextProcessor", function () {

    /**
     * {RegexpFindAllTextProcessor}
     */
    var regexpFindAllTextProcessor;

    describe("defaults", function () {

        beforeEach(function () {
            regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('fo{1,2}bar');
        });

        it("should have default values", function () {
            expect(regexpFindAllTextProcessor.displayName).toEqual('Find all matches');
            expect(regexpFindAllTextProcessor.typeName).toEqual('RegexpFindAllTextProcessor');
            expect(regexpFindAllTextProcessor.searchString).toEqual('fo{1,2}bar');
            expect(regexpFindAllTextProcessor.searchFlagGlobal).toEqual(true);
            expect(regexpFindAllTextProcessor.searchFlagCaseInsensitive).toEqual(false);
            expect(regexpFindAllTextProcessor.searchFlagMultiline).toEqual(true);
            expect(regexpFindAllTextProcessor.matchesCount).toEqual(0);
        });
    });

    describe("processText", function () {

        describe("empty values", function () {
            it("should return empty string if input is empty", function () {
                regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('\\d+');
                expect(regexpFindAllTextProcessor.processText('')).toEqual('');
                expect(regexpFindAllTextProcessor.matchesCount).toEqual(0);
            });

            it("should return input text when regexp is empty", function () {
                regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('');
                expect(regexpFindAllTextProcessor.processText('Lorem ipsum dolor sit amet')).toEqual('Lorem ipsum dolor sit amet');
                expect(regexpFindAllTextProcessor.matchesCount).toEqual(0);
            });

        });

        describe("normal matching", function () {

            it("should return found matches, each in new line", function () {
                regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('\\d+');
                expect(regexpFindAllTextProcessor.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('2\n542\n534\n2333');
                expect(regexpFindAllTextProcessor.matchesCount).toEqual(4);
            });

            it("should return empty string when no matches are found", function () {
                regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('\\d+');
                expect(regexpFindAllTextProcessor.processText('Lorem ipsum dolor sit amet')).toEqual('');
                expect(regexpFindAllTextProcessor.matchesCount).toEqual(0);
            });
        });

        describe("flags", function () {

            it("should return just first match when global flag is off", function () {
                regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('\\d+');
                regexpFindAllTextProcessor.searchFlagGlobal = false;
                expect(regexpFindAllTextProcessor.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('2');
                expect(regexpFindAllTextProcessor.matchesCount).toEqual(1);
            });

            it("should return all matches when global flag is on", function () {
                regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('\\d+');
                regexpFindAllTextProcessor.searchFlagGlobal = true;
                expect(regexpFindAllTextProcessor.processText('Lor2em ips542um 534 dolor s2333id amet')).toEqual('2\n542\n534\n2333');
                expect(regexpFindAllTextProcessor.matchesCount).toEqual(4);
            });

            it("should return just case matched items when case insensivite flag is off", function () {
                regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('lorem');
                regexpFindAllTextProcessor.searchFlagCaseInsensitive = false;
                expect(regexpFindAllTextProcessor.processText('Lorem LOREM LoReM loreM lorem')).toEqual('lorem');
                expect(regexpFindAllTextProcessor.matchesCount).toEqual(1);
            });

            it("should return all matched items when case insensivite flag is on", function () {
                regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('lorem');
                regexpFindAllTextProcessor.searchFlagCaseInsensitive = true;
                expect(regexpFindAllTextProcessor.processText('Lorem LOREM LoReM loreM lorem')).toEqual('Lorem\nLOREM\nLoReM\nloreM\nlorem');
                expect(regexpFindAllTextProcessor.matchesCount).toEqual(5);
            });
        });


        describe("errors", function () {
            it("invalid regexp sets up validation errors and throws exception", function () {
                try {
                    regexpFindAllTextProcessor = new RegexpFindAllTextProcessor('foo[');
                    regexpFindAllTextProcessor.processText('Lorem ipsum dolor sit amet foo[');
                    expect(true).toEqual(false);
                } catch (e) {
                    expect(regexpFindAllTextProcessor.regexpIsValid).toEqual(false);
                    expect(regexpFindAllTextProcessor.regexpValidationMessage.length).toBeGreaterThan(0);
                    expect(regexpFindAllTextProcessor.matchesCount).toEqual(0);
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
                regexpFindAllTextProcessor.initializeFromObject(sourceObject);

                expect(regexpFindAllTextProcessor.searchString).toEqual('[a-z]');
                expect(regexpFindAllTextProcessor.searchFlagCaseInsensitive).toEqual(true);
                expect(regexpFindAllTextProcessor.isEnabled).toEqual(true);
                expect(regexpFindAllTextProcessor.description).toEqual('foobar');
            });

        });

        describe("getExportObject()", function () {

            beforeEach(function () {
                regexpFindAllTextProcessor.searchString = 'foo';
                regexpFindAllTextProcessor.searchFlagCaseInsensitive = true;
                regexpFindAllTextProcessor.isEnabled = true;
                regexpFindAllTextProcessor.description = 'foobar';
            });

            it("extractPropertiesToObject exports empty object if no properties are specified", function () {
                var exportedObject = regexpFindAllTextProcessor.getExportObject();
                expect(exportedObject).toEqual({
                    typeName: 'RegexpFindAllTextProcessor',
                    searchString: 'foo',
                    searchFlagCaseInsensitive: true,
                    isEnabled: true,
                    description: 'foobar'
                });
            });
        });
    });

});