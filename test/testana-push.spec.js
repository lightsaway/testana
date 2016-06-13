'use strict';
const assert = require('assert');

const fetchMock = require('fetch-mock');
const fetch = require('node-fetch');
fetchMock.useNonGlobalFetch(fetch);
const mockery = require('mockery');

describe('Testana http function', () => {
    const elasticUrl = 'http://elastic.com';
    const buildNr = 1;
    const component = 'foo';
    const type = 'performance';

    beforeEach('Enabling mockery', () => {
        mockery.enable({
            useCleanCache: true,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('node-fetch', fetchMock.fetchMock);
    });

    afterEach('Disabling mockery', () => {
        mockery.disable();
        mockery.deregisterMock('fetch');
        fetchMock.restore();
    });

    it('should push metrics', () => {
        const Testana = require('../lib/testana');
        let testana = new Testana({
            elasticUrl: elasticUrl,
            collector: "junit",
            buildNr: buildNr,
            component: component,
            type: type,
            meta: {
                bar: "foo", foo: "bar"
            }
        });
        testana.push().then(()=> {
            assert.equal(fetchMock.called(buildUrl(elasticUrl, component, type, buildNr)), true);
            done();
        })

    })

});