'use strict';
const Elastic = require('./utils/elastic.js');
const logger = require('./utils/logger');
const filefinder = require('./utils/pathmatcher');

/**
 * Loads passed parser from collectors folder
 * @param parser - parser to load
 * @returns {*}
 */
const loadParser = (parser) => {
    let collector;
    try {
        collector = require('./collectors/' + parser);
    }
    catch (e) {
        throw new Error('Collector is not present %s', parser);
    }
    if (typeof collector != 'function') {
        throw new Error('Collector is not a function');
    }
    return collector;
};

/**
 *
 * @param meta
 * @param metrics
 * @returns {*}
 */
const decorateMetrics = (meta, metrics) => {
    if (meta) {
        Object.keys(meta).forEach(k => {
            metrics[k] = meta[k];
        });
        metrics.status = (metrics.totalCounter - metrics.passedCounter == 0 ) ? 'FAILED' : 'PASSED';
        metrics.status = (metrics.totalCounter == 0 ) ? 'SKIPPED' : metrics.status;
        metrics.collectedTimeStamp = new Date().getMilliseconds();
    }
    return metrics;
};

const clone = (object) => {
    return JSON.parse(JSON.stringify(object));
};

const LOG_NAME = 'TESTANA';

class Testana {
    constructor(opts) {
        this.opts = opts;
        this.logger = logger(LOG_NAME, opts.logLevel);
        this.elastic = new Elastic(opts.elasticUrl);
        this.files = filefinder.find(opts.patterns);

        let parser = loadParser(opts.collector);
        this.metrics = decorateMetrics(opts.meta, parser(this.files));
    }

    /**
     * Updates elastic indexes with parsed data
     */
    push() {
        return this.elastic.push(
            this.opts.component,
            this.opts.type,
            this.opts.buildNr,
            this.metrics
        );
    }

    /**
     * Gets data
     */
    getData() {
        return clone(this.metrics);
    }
}

module.exports = Testana;
