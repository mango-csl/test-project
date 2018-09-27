'use strict';

const Pending = require(`../../experiment/promise-pending/pending`);

const noop = () => {
};

describe('pending', function () {
    beforeEach(function () {
        this.pending = new Pending();
    });

    describe('isPending', function () {
        // it('should be false until call', function () {
        //   assert.notOk(this.pending.isPending);
        // });
        //
        // it('should be true after call', function () {
        //   this.pending.call();
        //   assert.ok(this.pending.isPending);
        // });
        //
        // it('should be false after resolve', function () {
        //   this.pending.call();
        //   this.pending.resolve('foo');
        //   assert.notOk(this.pending.isPending);
        // });
        //
        // it('should be false after reject', function () {
        //   this.pending.call().catch(noop);
        //   this.pending.reject('foo');
        //   assert.notOk(this.pending.isPending);
        // });

        it('should be same Promise after call again', function () {
            let count = 0;
            let request = this.pending.call(setTimeout(noop, 10));
            let query = function () {
                request.then(() => {
                    count++;
                });
            };
            query();
            setTimeout(() => query(), 5);
            return assert.eventually.equal(count, 1);
        });
    });
});
