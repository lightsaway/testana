'use strict';
const assert = require('assert');
const collector = require('../lib/collectors/junit');
const initial = require('../lib/collectors/initial-data').getInitialCollection;
const path = require("path");

describe('collecting junit test results', function(){
    it('should return object on empty pathes', function(){
        let result = collector([]);
        assert((typeof result) === 'object');
    });

    it('should return initial collection on empty pathes', function(){
        let result = collector([]);
        assert.deepEqual(result, initial())
    });

    it('should return initial collection on empty pathes', function(){
        let file = './data/junit-results/black-box/random/TEST-passing-tests.xml';
        let filePath = path.resolve(__dirname, file);
        let result = collector([filePath]);
        assert.equal(result.passedCounter, 8 ,'should have 8 passing tests');
        assert.equal(result.time, 0.209, 'should have correct time');
        assert.equal(result.totalCounter, 8, 'should have correct total Counter');
        assert(Array.isArray(result.tests), 'should be array');
        assert.equal(result.tests.length, 8);
    });

    it('should throw exception on not defined pathes', function(){
        assert.throws( () => collector(), Error );
    });

    it('should throw exception on object pathes', function(){
        assert.throws( () => collector({}), Error );
    });

    it('should collect failed tests', function () {
        let file = './data/junit-results/black-box/random/Test-com.product.failing.xml';
        let filePath = path.resolve(__dirname, file);
        let result = collector([filePath]);
        assert.equal(result.failureStackTraces.length, 1 ,'should have 1 stacktrace');
        assert.equal(result.failedTests.length, 1 ,'should have 1 failed test');
        assert(result.failureStackTraces[0].startsWith(result.failedTests[0]) === true);
    })


    it('should collect errored tests', function () {
        let file = './data/junit-results/black-box/service-a/TEST-serviceA.JsonValidatorTest.xml';
        let filePath = path.resolve(__dirname, file);
        let result = collector([filePath]);
        assert.equal(result.erroredStackTraces.length, 1 ,'should have 1 stacktrace');
        assert.equal(result.erroredTests.length, 1 ,'should have 1 failed test');
        assert(result.erroredStackTraces[0].startsWith(result.erroredTests[0]) === true);
    })

});