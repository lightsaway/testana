'use strict';
const glob = require('glob-all').sync;

/**
 * Returns array of resolved pathes
 * @param {Array} patterns - array of patterns to find
 */
const find = (patterns) => {
    const log = require('./logger')();
    if(!patterns || patterns.length == 0 ) return [];
    const files = glob(patterns);
    log.debug("Matched files:");
    log.debug(files);
    log.info("Found " + files.length + " matching files");
    return files;
};

module.exports = { find : find };