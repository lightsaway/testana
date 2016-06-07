'use strict';
const assert = require('assert');
const fetchMock = require('fetch-mock');
const fetch = require('node-fetch');
const mockery = require('mockery');
fetchMock.useNonGlobalFetch(fetch);

const buildUrl = (url , component, type, build) =>{
    return url + '/' + component + '/' + type + '/' + build
};

describe('elastic wrapper', function(){

    const elasticUrl = 'http://elastic.com';
    const build = 1;
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

    afterEach('Disabling mockery',() => {
        mockery.disable();
        mockery.deregisterMock('fetch');
        fetchMock.restore();
    });


    it('should throw exception on not defined URI', function(){
        let Elastic = require('../lib/utils/elastic');
        assert.throws( () => new Elastic(), Error );
    });

    it('should make a PUT request', function (done) {

        fetchMock.mock( buildUrl (elasticUrl, component , type , build),'PUT', 200);

        const mocklastic = require('../lib/utils/elastic');
        let elastic = new mocklastic(elasticUrl);

        elastic.push(component, type , build).then(() => {
            assert.equal(fetchMock.called(buildUrl (elasticUrl, component , type , build)), true);
            done();
        });
    });

    it('should make a DELETE request', function (done) {

        fetchMock.mock( buildUrl (elasticUrl, component , type , build),'DELETE', 200);

        const mocklastic = require('../lib/utils/elastic');
        let elastic = new mocklastic(elasticUrl);

        elastic.delete(component, type , build).then(() => {
            assert.equal(fetchMock.called(buildUrl (elasticUrl, component , type , build)), true);
            done();
        });
    });

});