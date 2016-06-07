'use strict';
const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');


let LOGGER;

/**
 * Creates/returns singletone logger instance.
 * @param {String} name - name of logger
 * @param {String} level - log level
 * @returns {*} Logger instance
 */
const logger = (name, level) => {
    if (LOGGER) return LOGGER;

    const prettyStdOut = new PrettyStream({
        mode: 'short'
    });
    prettyStdOut.pipe(process.stdout);
    return LOGGER = bunyan.createLogger({
        name: name || 'NAMELESS',
        streams: [{
            level: level || 'info',
            type: 'raw',
            stream: prettyStdOut
        }]
    });

};

module.exports = logger;