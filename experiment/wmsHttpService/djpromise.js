const {
    defaultOnError,
    defaultMessage,
    defaultOnResponse,
    // throttle: _throttle
} = require('./config');

/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  执行间隔，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“节流”函数
 */

function _throttle(fn, delay) {

    // 记录上次执行的时间
    let last;

    // 定时器
    let timer;

    // 默认间隔为 250ms
    delay || (delay = 250);

    // 返回的函数，每过 delay 毫秒就执行一次 fn 函数
    return function () {

        // 保存函数调用时的上下文和参数，传递给 fn
        let context = this;
        let args = arguments;

        let now = +new Date();

        // 如果距离上次执行 fn 函数的时间小于 delay，那么就放弃
        // 执行 fn，并重新计时
        if (last && now < last + delay) {
            clearTimeout(timer);

            // 保证在当前时间区间结束后，再执行一次 fn
            timer = setTimeout(function () {
                last = now;
                fn.apply(context, args)
            }, delay)

            // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
        } else {
            last = now;
            fn.apply(context, args)
        }
    }
}

/**
 * 自定义链式请求的构造函数
 * @param promise
 * @param onResponse
 * @param onError
 * @param afterRequest
 * @param requestControl
 * @returns {*}
 */
const makeCancelable = (promise, {
    onResponse, onError, afterRequest = () => {
    }, requestControl = {
        pengdingLinit: true
    }
} = {}) => {
    let hasCanceled_ = false, // 手动取消标识
        status = 'initial', // 请求
        isThrottle = false,// 手动取消标识
        throttleTime = 1000;

    const debouncePromise = (function () {
        if (requestControl.pengdingLinit) {
            if (status === 'pending') {
                return function () {
                    return new Promise((resolve, reject) => {
                        resolve('请求拦截，在pending状态无法发送请求');
                    });
                }
            }
        }
        status = 'pending';
        // return wrappedPromise;
        return function () {
            return new Promise((resolve, reject) => {
                // status = 'pending';
                let callBack = function ({value, type}) {
                    status = type;
                    afterRequest();
                    type === 'resolve' ? resolve(value) : reject(value);
                };
                promise.then(
                    val => {
                        let {type} = this;
                        if (hasCanceled_) {
                            type = 'reject';
                            _value = {isCanceled: true};
                        } else {
                            type = 'resolve'
                        }
                        callBack({type, val});
                    },
                    error => {
                        let value = hasCanceled_ ? {isCanceled: true} : error;
                        callBack({type: 'reject', value});
                    }
                );
            });
        };
    })();
    /**
     * 添加错误处理
     */
    new Foo(promise, {onResponse, onError});

    return {
        toPromise: new debouncePromise(),
        get status() {
            return status;
        },
        cancel() {
            hasCanceled_ = true;
        }
        // throttle(time) {
        //     throttleTime = Number(time);
        //     if (!isThrottle) {
        //         isThrottle = true;
        //     }
        //     this.toPromise = _throttle(debouncePromise, throttleTime);
        //     return this;
        // }
    };
};

// Class that should be able to be garbaged collected when promise is trashed.
class Foo {
    constructor(promise, {onResponse = defaultOnResponse, onError = defaultOnError, onMessage = defaultMessage}) {
        promise
            .then((res) => {
                onResponse(res);
                onMessage.log(' --- success --- ');
            })
            .catch(error => {
                if (error.isCanceled) {
                    console.info('取消promise');
                    return;
                }
                let errorMsg = onError(error);
                onMessage.error(errorMsg);
            });
    }
}

// let success = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('正确');
//     }, 1000);
// });
// let error = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('错误');
//     }, 1000);
// });
// let testService = makeCancelable(success, {
//         onResponse: function (msg) {
//             console.log('new Foo --:', msg);
//         }
//     }
// );
//
// testService.promise.then((res) => {
//     console.log('testService.promise.then --', res);
// }).catch((err) => {
//     console.log('testService.promise.catch --', err);
// });
//
//
// let testService2 = makeCancelable(error, {
//     onResponse: function (msg) {
//         console.log('new Foo --:', msg);
//     }
// });
// testService2.promise.then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });
// testService2.cancel();

// 函数节流测试
// let testFn = function () {
//     let fn = function () {
//         console.log('testThrottle');
//         return {
//             name: 'testFn'
//         }
//     };
//     return {
//         throttled: function () {
//             this.getName = _throttle(fn, 200);
//             return this;
//         },
//         getName: fn
//     }
// }
// let throttledFn = testFn().throttled().getName;
// let i = 0;
// setInterval(() => {
//     console.log(throttledFn().name,' 执行index = ', i);
//     // throttledFn().name;
//     i++;
// }, 50);

module.exports = {
    djcpsPromise: makeCancelable
};
