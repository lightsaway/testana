'use strict';
const assert = require('assert');
const finder = require('../lib/utils/pathmatcher');

describe('finding files by patterns', function(){

    it('should return empty array', function(){
        let files = finder.find(['**/black-box/**/NOT_TEST-*.xml']);
        assert.equal(files.length, 0 );
    });

    it('should return empty array on empty matchers', function(){
        let files = finder.find([]);
        assert.equal(files.length, 0 );
    });

    it('should return correct array of matched pathes', function(){
        let files = finder.find(['**/black-box/**/TEST-*.xml']);
        assert.equal(files.length, 7 );
    });

    it('should return correct array of matched pathes', function(){

    });

});