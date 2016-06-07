'use strict';
const INITIAL_COLLECTION = {
    tests: [],
    totalCounter: 0,
    errorsCounter: 0,
    failedCounter: 0,
    passedCounter: 0,
    erroredTests: [],
    erroredStackTraces: [],
    failureStackTraces: [],
    failedTests: [],
    time: 0
};

/**
 * Returns deep copy of initial collection
 */
module.exports.getInitialCollection = () => JSON.parse(JSON.stringify(INITIAL_COLLECTION));