const {
    defaultOnError,
    defaultMessage,
    defaultOnResponse,
    throttle: _throttle
} = require('./config');

// let _throttle = function (fn) {
//     setTimeout(()=>{
//         fn();
//     },1000)
// }
/**
 * 自定义链式请求的构造函数
 * @constructor 私有
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
    const wrappedPromise = new Promise((resolve, reject) => {
        // status = 'pending';
        let callBack = function ({value, type}) {
            status = type;
            afterRequest();
            type === 'resolve' ? resolve(value) : reject(value);
        };
        promise.then(
            val => {
                let {type, value = val} = this;
                if (hasCanceled_) {
                    type = 'reject';
                    _value = {isCanceled: true};
                } else {
                    type = 'resolve'
                }
                callBack({type, value});
            },
            error => {
                let value = hasCanceled_ ? {isCanceled: true} : error;
                callBack({type: 'reject', value});
            }
        );
    });

    const throttlePromise = function () {
        if (requestControl.pengdingLinit) {
            if (status === 'pending') {
                return new Promise((resolve, reject) => {
                    resolve('请求拦截，在pending状态无法发送请求');
                });
            }
        }
        status = 'pending';
        return wrappedPromise
    };
    /**
     * 添加错误处理
     */
    new Foo(promise, {onResponse, onError});

    return {
        toPromise: throttlePromise,
        get status() {
            return status;
        },
        cancel() {
            hasCanceled_ = true;
        },
        throttle(time) {
            throttleTime = Number(time);
            if (!isThrottle) {
                isThrottle = true;
            }
            this.toPromise = _throttle(throttlePromise, throttleTime);
            return this;
        }
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
}