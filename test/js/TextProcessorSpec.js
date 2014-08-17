/*global TextProcessor: false, describe:false, it:false, beforeEach:false, expect:false  */
'use strict';
describe("TextProcessor", function () {

    /**
     * {TextProcessor}
     */
    var textProcessor;

    beforeEach(function () {
        textProcessor = new TextProcessor();
    });

    describe("defaults", function () {
        it("showDescription is null", function () {
            expect(textProcessor.showDescription).toBeNull();
        });

        it("description is null", function () {
            expect(textProcessor.description).toBeNull();
        });
    });

    describe("buildingRegExp", function () {

        it("should build RegExp object with no flags when given all flags arguments to false", function () {
            var actual = textProcessor.buildRegExp('foobar', false, false, false);
            expect(actual).toEqual(/foobar/);
        });

        it("should build RegExp object with all flags when all flags are set to true", function () {
            var actual = textProcessor.buildRegExp('foobar', true, true, true);
            expect(actual).toEqual(/foobar/gim);
        });

    });

    describe("splitTextIntoLines", function () {

        it("should split text into lines by \\n character", function () {
            expect(textProcessor.splitTextIntoLines("foo\nbar")).toEqual(['foo', 'bar']);
        });

        it("should split text into lines by \\r\\n character", function () {
            expect(textProcessor.splitTextIntoLines("foo\r\nbar")).toEqual(['foo', 'bar']);
        });

        it("should treat \\n\\n as single separator", function () { // FIXME wtf? why split treats \n\n as single separator?
            expect(textProcessor.splitTextIntoLines("foo\n\nbar")).toEqual(['foo', '', 'bar']);
        });

        it("should treat \\n\\r as single separator", function () { // FIXME wtf? why split treats \n\n as single separator?
            expect(textProcessor.splitTextIntoLines("foo\n\rbar")).toEqual(['foo', '', 'bar']);
        });

        it("should split text into lines by \\n and \\r\\n character", function () {
            expect(textProcessor.splitTextIntoLines("Lorem\r\nipsum\ndolor sid amet")).toEqual(['Lorem', 'ipsum', 'dolor sid amet']);
        });
    });

    describe("abstract methods", function () {

        it("processText should throw exception as it is 'abstract' class", function () {
            expect(function () {
                textProcessor.processText('Lorem ipsum');
            }).toThrow();
        });

        it("initializeFromObject should throw exception as it is 'abstract' class", function () {
            expect(function () {
                textProcessor.initializeFromObject('{}');
            }).toThrow();
        });

        it("getExportObject should throw exception as it is 'abstract' class", function () {
            expect(function () {
                textProcessor.getExportObject('{}');
            }).toThrow();
        });
    });

    describe("regexp validation errors", function () {

        it("by default there are no validation errors", function () {
            expect(textProcessor.regexpIsValid).toEqual(true);
            expect(textProcessor.regexpValidationMessage).toEqual('');
        });

        it("we can set validation errors from exception", function () {
            var exception = {
                toString: function () {
                    return 'I am the message';
                }
            };

            expect(textProcessor.setupValidationFromError(exception)).toEqual(exception);
            expect(textProcessor.regexpIsValid).toEqual(false);
            expect(textProcessor.regexpValidationMessage).toEqual('I am the message');
        });

        it("we can reset validation errors", function () {
            textProcessor.regexpIsValid = false;
            textProcessor.regexpValidationMessage = 'foobar';

            expect(textProcessor.regexpIsValid).toEqual(false);
            expect(textProcessor.regexpValidationMessage).toEqual('foobar');

            textProcessor.resetRegExpValidation();

            expect(textProcessor.regexpIsValid).toEqual(true);
            expect(textProcessor.regexpValidationMessage).toEqual('');
        });

    });

    describe("copying properties between objects", function () {

        var sourceObject;

        beforeEach(function () {
            expect(textProcessor.foo).toBeUndefined();
            expect(textProcessor.bar).toBeUndefined();
            expect(textProcessor.lorem).toBeUndefined();
            expect(textProcessor.dolor).toBeUndefined();

            sourceObject = {
                foo: 123,
                bar: 'weee',
                lorem: 'ipsum',
                dolor: 'sid'
            };
        });

        it("copyPropertiesFrom copies specified properties", function () {
            textProcessor.copyPropertiesFrom(sourceObject, ['foo', 'lorem', 'doesNotExist']);

            expect(textProcessor.foo).toBeDefined();
            expect(textProcessor.bar).toBeUndefined(); // we havent specified 'bar'
            expect(textProcessor.lorem).toBeDefined();
            expect(textProcessor.dolor).toBeUndefined(); // sourceObject does not have 'doesNotExist'
        });

        it("copyPropertiesFrom copies only properties that exist in sourceObject", function () {
            textProcessor.copyPropertiesFrom(sourceObject, ['doesNotExist']);
            expect(textProcessor.doesNotExist).toBeUndefined();
        });
    });

    describe("extracting properties to object", function () {

        beforeEach(function () {
            textProcessor.foo = 'bar';
            textProcessor.lorem = 'ipsum';
        });

        it("extractPropertiesToObject exports empty object if no properties are specified", function () {
            var exportedObject = textProcessor.extractPropertiesToObject([]);
            expect(exportedObject).toEqual({typeName: ''});
        });

        it("extractPropertiesToObject exports only specified properties", function () {
            var exportedObject = textProcessor.extractPropertiesToObject(['foo']);
            expect(exportedObject).toEqual({typeName: '', foo: 'bar'});
        });

        it("extractPropertiesToObject exports only existing properties", function () {
            var exportedObject = textProcessor.extractPropertiesToObject(['foo', 'foobar']);
            expect(exportedObject).toEqual({typeName: '', foo: 'bar'});
        });
    });

    describe("shouldShowDescription()", function () {

        it("by default returns false", function () {
            expect(textProcessor.shouldShowDescription()).toEqual(false);
        });

        //

        it("should return true when showDescription is true and has description", function () {
            textProcessor.showDescription = true;
            textProcessor.description = 'some description';
            expect(textProcessor.showDescription).toEqual(true);
            expect(textProcessor.description.length).toBeGreaterThan(0);
            expect(textProcessor.shouldShowDescription()).toEqual(true);
        });

        it("should return true when showDescription is true and does not havedescription", function () {
            textProcessor.showDescription = true;
            expect(textProcessor.showDescription).toEqual(true);
            expect(textProcessor.description).toBeNull();
            expect(textProcessor.shouldShowDescription()).toEqual(true);
        });
    });

});
