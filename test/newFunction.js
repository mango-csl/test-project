let obj = {};
const subject = (function () {
    let Subject = function () {
        let list = {};
        this.listen = function (key, fn) {
            if (!list[key]) {
                list[key] = [];
            }
            list[key].push(fn);
        };
        this.trigger = function () {
            let key = Array.prototype.shift.call(arguments);
            let fns = list[key];
            if (!fns || fns.length === 0) {
                return false;
            }
            for (let i = 0, len = fns.length; i < len; i++) {
                fns[i].apply(this, arguments);
            }
        };
        this.remove = function (key, fn) {
            let fns = list[key];
            if (!fns) {
                return false;
            }
            if (!fn) {
                fns && (fns.length = 0);
            } else {
                for (let i = fns.length - 1; i >= 0; i--) {
                    let _fn = fns[i];
                    if (_fn === fn) {
                        fns.splice(i, 1);
                    }
                }
            }
        };
        this.hasListen = (key) => {
            console.log('list[key]', list[key]);
        };

    };
    console.log('init_obj');
    Object.defineProperties(obj, {
        name: {
            get() {
                console.log('test');
                return 'test';
            }
        }
    })
    return function () {
        return new Subject();
    };
})();

let sub1 = new subject();
let sub2 = new subject();
sub1.listen('test', () => {
    console.log('test -----------------');
});
sub2.trigger('test');
sub2.hasListen('test');
sub1.trigger('test');
sub2.name;
sub1.name;