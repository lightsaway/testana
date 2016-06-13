#!/usr/bin/env node
'use strict';
const Testana = require('../lib/testana');
const meow = require('meow');

let DEFAULT_PATTERNS = ['**/**/TEST*.xml'],
    DEFAULT_ElASTIC_URL = 'http://192.168.99.100:9200',
    DEFAULT_LOG_LEVEL = 'info',
    DEFAULT_COLLECTOR = 'junit',
    DEFAULT_BRANCH = 'master',
    DEFAULT_BUILD = 'build-default',
    DEFAULT_BUILD_NR = 1,
    DEFAULT_TYPE = 'unit-tests',
    DEFAULT_TAGS = [];

/**
 * Extracts meta information to separate object
 * @param opts
 */
const extractMeta = (opts) => {
    const META_KEYS = ['component', 'buildNr', 'type', 'tags','branch'];
    const meta = {};
    META_KEYS.forEach(k => {
        meta[k] = opts[k]
    });
    return meta;
};

const cli = meow({
    description: 'Testana sends collected test results to elastic search',
    help: [
        'Usage: testana [options]',
        '',
        'Options:',
        '-h, --help                 output usage information',
        '-e, --elastic-url          address of elastic instance',
        '-l, --log-level            log level',
        '-p, --patterns             comma-separated patterns',
        '-t, --tags                 comma-separated tags',
        '-c, --collector            collector type (see avaliable collectors)',
        '-b, --branch               name of branch where build has happend',
        '-n, --build                name of component that has been built',
        '-nr, --build-nr            build number'
    ]
}, {
    alias: {
        h: 'help',
        l: 'log-level',
        p: 'patterns',
        t: 'tags',
        c: 'collectors',
        n: 'component',
        nr: 'buildNr',
        b:'branch',
        e: 'elastic-url',
        tp: 'type'
    },
    default: {
        elasticUrl: DEFAULT_ElASTIC_URL,
        logLevel: DEFAULT_LOG_LEVEL,
        patterns: DEFAULT_PATTERNS,
        collector: DEFAULT_COLLECTOR,
        component: DEFAULT_BUILD,
        buildNr: DEFAULT_BUILD_NR,
        type: DEFAULT_TYPE,
        branch: DEFAULT_BRANCH,
        tags: DEFAULT_TAGS
    }
});

if (cli.flags.patterns !== DEFAULT_PATTERNS) {
    cli.flags.patterns = cli.flags.patterns.split(',');
}

if (cli.flags.tags !== DEFAULT_TAGS) {
    cli.flags.tags = cli.flags.tags.split(',');
}

cli.flags.meta = extractMeta(cli.flags);

const testana = new Testana(cli.flags);

testana.push().then((response) => {
        const log = require('../lib/utils/logger')();
        log.info(response.status);
        log.info(response.statusText);
    }
);