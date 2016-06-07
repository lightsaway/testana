'use strict';
const xml2json = require('xml2json');
const fs = require('fs');
const initial = require('./initial-data').getInitialCollection;

const parse = (string) =>{
    return xml2json.toJson(string);
};

const formStackTrace = (test, type) => {
    return test.classname + "." + test.name + " : " + test[type].type + "\n" + test[type]["$t"];
};

module.exports  = (pathes) =>{

    if(!pathes || !Array.isArray(pathes)) throw new Error("Array of pathes must be supplied");

    var metrics = pathes.reduce((metrics, path) => {
        var contents = fs.readFileSync(path).toString();
        var suite = JSON.parse(parse(contents)).testsuite;

        var failedTests = suite.testcase.filter( t => t.failure);
        var errorTests = suite.testcase.filter( t => t.error);

        metrics.failedCounter += parseInt(suite.failures);
        metrics.errorsCounter += parseInt(suite.errors);
        metrics.totalCounter += parseInt(suite.tests);
        metrics.time += parseFloat(suite.time);
        metrics.tests = metrics.tests.concat(suite.testcase);

        //Flattening errored structure
        metrics.erroredTests = metrics.erroredTests.concat(errorTests.map(
            t => t.classname + "." + t.name));
        metrics.erroredStackTraces = metrics.erroredStackTraces.concat(errorTests.map(
                t => formStackTrace(t, "error")));

        //Flattening failed structure
        metrics.failedTests.concat(failedTests.map(t => t.classname + "." + t.name));
        metrics.failureStackTraces = metrics.failureStackTraces.concat(failedTests.map(
            t =>  t.classname + "." + t.name + " : " + t.failure.type + "\n" + t.failure["$t"]
        ));

        metrics.passedCounter = metrics.totalCounter - metrics.failedCounter - metrics.errorsCounter;

        return metrics;
    },
        initial()
    );

    return metrics;
};