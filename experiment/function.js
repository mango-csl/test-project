let {sysLog} = require('./unit/methods');
let functionLog = function () {
    sysLog('function', arguments);
};

let obj = {
    firstName:'first',
    lastName:'last'
};
const subject = (function () {
    let Subject = function (msg) {
        console.log('msg = ', msg);
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

    Object.defineProperties(obj, {
        name: {
            get() {
                console.log('demo_test subject');
                return this.firstName + this.lastName;
            }
        }
    });
    return function (msg) {
        return new Subject(msg);
    };
})();

let sub1 = new subject('sub1');
let sub2 = new subject('sub2');
// sub1.listen('demo_test', () => {
//     console.log('demo_test -----------------');
// });
// sub2.trigger('demo_test');
// sub2.hasListen('demo_test');
// sub1.trigger('demo_test');
sysLog(obj.name);


// An Immediately Invoked Function Expressions (IIFE) is a function that is called directly after the function is loaded into the browser’s compiler.
// The way to identify an IIFE is by locating the extra left and right parenthesis at the end of the function’s declaration.
// Error (https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)
/*
​function foo() {
    console.log('Hello Foo');
}();
*/

// (function foo() {
//     console.log("Hello Foo");
// }());
//
// (function food() {
//     console.log("Hello Food");
// })();

// let name = 'window';
//
// let IIFE_fn = (function (name) {
//     return function error() {
//         console.log('IIFE_fn ----- name', name);
//     }
// })(name);
//
// IIFE_fn();
