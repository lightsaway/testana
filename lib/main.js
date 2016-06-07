'use strict';
const Elastic = require('./utils/elastic.js');
const logger = require('./utils/logger');
const argv = require('minimist')(process.argv.slice(2));
const finder = require('./utils/pathmatcher');

/* istanbul ignore next */
const decorateMetrics = (argv, metrics) => {
    return metrics;
};

/* istanbul ignore next */
const main = () => {
    const logLevel = argv.logLevel || 'info';
    const collectorType = argv.collectorType || 'junit';
    const buildName = argv.buildName || 'build-foo';
    const buildNR = parseInt(argv.buildNR || '1');
    const elasticURL = argv.elasticURL || 'http://192.168.99.100:9200'; //DEFAULT DOCKER INSTANCE ON MAC
    const type = argv.type || 'unit-tests';

    const matcher = (argv.matcher || '**/**/TEST*.xml').split(',');
    const collector = require('./collectors/' + collectorType);

    const log = logger('ELASTIC TEST METRICS', logLevel);
    log.info("current matching patterns : " + matcher);
    const files = finder.find(matcher);

    if(files.length < 0 ) return;

    log.info('Collecting ' + collectorType + " reports");

    const metrics = decorateMetrics(argv, collector(files));

    metrics.branch = argv.branch || 'master';
    metrics.tags =  argv.tags ? argv.tags.split(',') : [];
    metrics.buildNR = buildNR;
    metrics.type = argv.type || 'unit-tests';
    metrics.status = (metrics.errorsCounter > 0 || metrics.failedCounter > 0) ? 'FAILED' : 'PASSED';
    metrics.timestamp = new Date().getMilliseconds();

    const elastic = new Elastic(elasticURL);

    log.info("Sending metrics to elastic search");
    elastic.push(buildName, type, buildNR , metrics )
    .then((response) => {
        log.info(response.status);
        log.info(response.statusText);
    });
};

module.exports = main;

main();