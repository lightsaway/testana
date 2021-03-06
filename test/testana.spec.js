'use strict';
const assert = require('assert');
let Testana = require('../lib/testana');

describe('Testana functionality', () => {

    it('fail if no elastic provided', () => {
        assert.throws(() => new Testana({}), Error);
    });

    it('fail if no collector provided', () => {
        assert.throws(() => new Testana({elasticUrl: "some"}), Error);
    });

    it('fail if wrong collector provided', () => {
        assert.throws(() => new Testana({elasticUrl: "some", collector: "wrong"}), Error);
    });

    it('fail if wrong collector provided', () => {
        assert.throws(() => new Testana({elasticUrl: "some", collector: "wrong"}), Error);
    });

    it('should decorate metrics with optional meta information', () => {
        let data = new Testana({
            elasticUrl: "some", collector: "junit", meta: {
                bar: "foo", foo: "bar"
            }
        }).getData();
        assert.equal(data.foo, "bar");
        assert.equal(data.bar, "foo");
    });

});