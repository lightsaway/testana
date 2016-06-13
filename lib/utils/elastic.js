'use strict';
const fetch = require('node-fetch');
const DEFAULT_TIMEOUT = 1000 * 60 * 40;
const ERROR_MSG = 'Elastic url needs to be provided';
const log = require('./logger');

const LOG_NAME = 'ELASTIC';
/**
 * SIMPLE ELASTIC HTTP WRAPPER
 */
class Elastic {

    constructor(URI) {
        if (!URI) throw new Error(ERROR_MSG);
        this.URI = URI;
        this.log = log(LOG_NAME);
    }

    push(component, type, build, metrics) {
        this.log.debug('PUT to %s/%s/%s/%s', this.URI, component, type, build);
        this.log.debug(metrics);
        return fetch(
            `${this.URI}/${component}/${type}/${build}`,
            {
                method: 'PUT',
                timeout: DEFAULT_TIMEOUT,
                body: JSON.stringify(metrics)
            });
    }

    delete(component, type, build) {
        this.log.debug('DELETE to %s, %s , %s , %s', this.URI, component, type, build);
        return fetch(
            `${this.URI}/${component}/${type}/${build}`,
            {
                method: 'DELETE',
                timeout: DEFAULT_TIMEOUT
            });
    }
}

module.exports = Elastic;