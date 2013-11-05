/*global RegexpActivity: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("RegexpActivity", function () {

    /**
     * {RegexpActivity}
     */
    var regexpActivity;

    beforeEach(function () {
        regexpActivity = new RegexpActivity();
    });

    describe("defaults", function () {
        it("showDescription is null", function () {
            expect(regexpActivity.showDescription).toBeNull();
        });

        it("description is empty string", function () {
            expect(regexpActivity.description).toEqual('');
        });
    });

    describe("buildingRegExp", function () {

        it("should build RegExp object with no flags when given all flags arguments to false", function () {
            var actual = regexpActivity.buildRegExp('foobar', false, false, false);
            expect(actual).toEqual(/foobar/);
        });

        it("should build RegExp object with all flags when all flags are set to true", function () {
            var actual = regexpActivity.buildRegExp('foobar', true, true, true);
            expect(actual).toEqual(/foobar/gim);
        });

    });

    describe("splitTextIntoLines", function () {

        it("should split text into lines by \\n character", function () {
            expect(regexpActivity.splitTextIntoLines("foo\nbar")).toEqual(['foo', 'bar']);
        });

        it("should split text into lines by \\r\\n character", function () {
            expect(regexpActivity.splitTextIntoLines("foo\r\nbar")).toEqual(['foo', 'bar']);
        });

        it("should treat \\n\\n as single separator", function () { // FIXME wtf? why split treats \n\n as single separator?
            expect(regexpActivity.splitTextIntoLines("foo\n\nbar")).toEqual(['foo', '', 'bar']);
        });

        it("should treat \\n\\r as single separator", function () { // FIXME wtf? why split treats \n\n as single separator?
            expect(regexpActivity.splitTextIntoLines("foo\n\rbar")).toEqual(['foo', '', 'bar']);
        });

        it("should split text into lines by \\n and \\r\\n character", function () {
            expect(regexpActivity.splitTextIntoLines("Lorem\r\nipsum\ndolor sid amet")).toEqual(['Lorem', 'ipsum', 'dolor sid amet']);
        });
    });

    describe("abstract methods", function () {

        it("processText should throw exception as it is 'abstract' class", function () {
            expect(function () {
                regexpActivity.processText('Lorem ipsum');
            }).toThrow();
        });

        it("initializeFromObject should throw exception as it is 'abstract' class", function () {
            expect(function () {
                regexpActivity.initializeFromObject('{}');
            }).toThrow();
        });

        it("getExportObject should throw exception as it is 'abstract' class", function () {
            expect(function () {
                regexpActivity.getExportObject('{}');
            }).toThrow();
        });
    });

    describe("regexp validation errors", function () {

        it("by default there are no validation errors", function () {
            expect(regexpActivity.regexpIsValid).toEqual(true);
            expect(regexpActivity.regexpValidationMessage).toEqual('');
        });

        it("we can set validation errors from exception", function () {
            var exception = {
                toString: function () {
                    return 'I am the message';
                }
            };

            expect(regexpActivity.setupValidationFromError(exception)).toEqual(exception);
            expect(regexpActivity.regexpIsValid).toEqual(false);
            expect(regexpActivity.regexpValidationMessage).toEqual('I am the message');
        });

        it("we can reset validation errors", function () {
            regexpActivity.regexpIsValid = false;
            regexpActivity.regexpValidationMessage = 'foobar';

            expect(regexpActivity.regexpIsValid).toEqual(false);
            expect(regexpActivity.regexpValidationMessage).toEqual('foobar');

            regexpActivity.resetRegExpValidation();

            expect(regexpActivity.regexpIsValid).toEqual(true);
            expect(regexpActivity.regexpValidationMessage).toEqual('');
        });

    });

    describe("copying properties between objects", function () {

        var sourceObject;

        beforeEach(function () {
            expect(regexpActivity.foo).toBeUndefined();
            expect(regexpActivity.bar).toBeUndefined();
            expect(regexpActivity.lorem).toBeUndefined();
            expect(regexpActivity.dolor).toBeUndefined();

            sourceObject = {
                foo: 123,
                bar: 'weee',
                lorem: 'ipsum',
                dolor: 'sid'
            };
        });

        it("copyPropertiesFrom copies specified properties", function () {
            regexpActivity.copyPropertiesFrom(sourceObject, ['foo', 'lorem', 'doesNotExist']);

            expect(regexpActivity.foo).toBeDefined();
            expect(regexpActivity.bar).toBeUndefined(); // we havent specified 'bar'
            expect(regexpActivity.lorem).toBeDefined();
            expect(regexpActivity.dolor).toBeUndefined(); // sourceObject does not have 'doesNotExist'
        });

        it("copyPropertiesFrom copies only properties that exist in sourceObject", function () {
            regexpActivity.copyPropertiesFrom(sourceObject, ['doesNotExist']);
            expect(regexpActivity.doesNotExist).toBeUndefined();
        });
    });

    describe("extracting properties to object", function () {

        beforeEach(function () {
            regexpActivity.foo = 'bar';
            regexpActivity.lorem = 'ipsum';
        });

        it("extractPropertiesToObject exports empty object if no properties are specified", function () {
            var exportedObject = regexpActivity.extractPropertiesToObject([]);
            expect(exportedObject).toEqual({typeName: ''});
        });

        it("extractPropertiesToObject exports only specified properties", function () {
            var exportedObject = regexpActivity.extractPropertiesToObject(['foo']);
            expect(exportedObject).toEqual({typeName: '', foo: 'bar'});
        });

        it("extractPropertiesToObject exports only existing properties", function () {
            var exportedObject = regexpActivity.extractPropertiesToObject(['foo', 'foobar']);
            expect(exportedObject).toEqual({typeName: '', foo: 'bar'});
        });
    });

    describe("shouldShowDescription()", function () {

        it("by default returns false", function () {
            expect(regexpActivity.shouldShowDescription()).toEqual(false);
        });

        it("should return false when showDescription is null and does not have description", function () {
            expect(regexpActivity.showDescription).toBeNull();
            expect(regexpActivity.description).toEqual('');
            expect(regexpActivity.shouldShowDescription()).toEqual(false);
        });

        it("should return true when showDescription is null and has description", function () {
            regexpActivity.description = "some description";
            expect(regexpActivity.showDescription).toBeNull();
            expect(regexpActivity.description.length).toBeGreaterThan(0);
            expect(regexpActivity.shouldShowDescription()).toEqual(true);
        });

        //

        it("should return false when showDescription is false and has description", function () {
            regexpActivity.showDescription = false;
            regexpActivity.description = "some description";
            expect(regexpActivity.showDescription).toEqual(false);
            expect(regexpActivity.description.length).toBeGreaterThan(0);
            expect(regexpActivity.shouldShowDescription()).toEqual(false);
        });

        it("should return false when showDescription is false and does not have description", function () {
            regexpActivity.showDescription = false;
            regexpActivity.description = '';
            expect(regexpActivity.showDescription).toEqual(false);
            expect(regexpActivity.description.length).toEqual(0);
            expect(regexpActivity.shouldShowDescription()).toEqual(false);
        });

        //

        it("should return true when showDescription is true and has description", function () {
            regexpActivity.showDescription = true;
            regexpActivity.description = 'some description';
            expect(regexpActivity.showDescription).toEqual(true);
            expect(regexpActivity.description.length).toBeGreaterThan(0);
            expect(regexpActivity.shouldShowDescription()).toEqual(true);
        });

        it("should return true when showDescription is true and does not havedescription", function () {
            regexpActivity.showDescription = true;
            regexpActivity.description = '';
            expect(regexpActivity.showDescription).toEqual(true);
            expect(regexpActivity.description.length).toEqual(0);
            expect(regexpActivity.shouldShowDescription()).toEqual(true);
        });
    });

});
