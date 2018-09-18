const {getInstance} = require('./logger')
const axios = require('axios');

let isObject = function (value) {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function')
};
let now = function () {
    return new Date().getTime();
};
/**
 * 函数防抖
 * @param func
 * @param wait
 * @param options
 * @returns {function(): *}
 */
let debounce = function (func, wait, options) {
    let args,
        maxTimeoutId,
        result,
        stamp,
        thisArg,
        timeoutId,
        trailingCall,
        lastCalled = 0,
        maxWait = false,
        trailing = true;

    if (typeof func !== 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = wait < 0 ? 0 : (+wait || 0);
    if (options === true) {
        let leading = true;
        trailing = false;
    } else if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && Math.max(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function cancel() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        maxTimeoutId = timeoutId = trailingCall = undefined;
    }

    function complete(isCalled, id) {
        if (id) {
            clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
                args = thisArg = undefined;
            }
        }
    }

    function delayed() {
        let remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
            complete(trailingCall, maxTimeoutId);
        } else {
            timeoutId = setTimeout(delayed, remaining);
        }
    }

    function maxDelayed() {
        complete(trailing, timeoutId);
    }

    function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);
        let leadingCall, isCalled;
        if (maxWait === false) {
            leadingCall = leading && !timeoutId;
        } else {
            if (!maxTimeoutId && !leading) {
                lastCalled = stamp;
            }
            let remaining = maxWait - (stamp - lastCalled);
            isCalled = remaining <= 0 || remaining > maxWait;

            if (isCalled) {
                if (maxTimeoutId) {
                    maxTimeoutId = clearTimeout(maxTimeoutId);
                }
                lastCalled = stamp;
                result = func.apply(thisArg, args);
            }
            else if (!maxTimeoutId) {
                maxTimeoutId = setTimeout(maxDelayed, remaining);
            }
        }
        if (isCalled && timeoutId) {
            timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
            timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
            isCalled = true;
            result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
        }
        return result;
    }

    debounced.cancel = cancel;
    return debounced;
};

module.exports = {
    /**
     * 默认请求出错的处理
     * @param err
     */
    defaultOnError: function (err) {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误';
                    break;
                case 401:
                    err.message = '未授权，请登录';
                    break;
                case 403:
                    err.message = '拒绝访问';
                    break;
                case 404:
                    err.message = `请求地址出错: ${err.response.config.url}`;
                    break;
                case 408:
                    err.message = '请求超时';
                    break;
                case 500:
                    err.message = '服务器内部错误';
                    break;
                case 501:
                    err.message = '服务未实现';
                    break;
                case 502:
                    err.message = '网关错误';
                    break;
                case 503:
                    err.message = '服务不可用';
                    break;
                case 504:
                    err.message = '网关超时';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持';
                    break;
                default:
                    err.message = '连接出错';
            }
        }
        return err.message;
    },
    /**
     * 默认消息提醒方法
     */
    defaultMessage: getInstance(),
    /**
     * 默认OnResponse返回处理
     * @param msg
     */
    defaultOnResponse: function (msg) {
        console.log('default ---onResponse:', msg);
    },
    /**
     * 循环传参对象，删除空字段
     * 移除值为‘’的数据
     * @param handleParam 新对象
     * @param param 原对象
     */
    LoopParam: function (handleParam, param) {
        if (!coerceBoolean(param)) {
            return;
        }
        let keys = Object.keys(param);
        if (keys.length === 0) {
            return;
        }
        for (let i of keys) {
            if (Object.prototype.toString.call(param[i]) === '[object Object]') {
                handleParam[i] = {};
                loopParam(handleParam[i], param[i]);
            } else if (Object.prototype.toString.call(param[i]) === '[object Array]') {
                handleParam[i] = [];
                loopParam(handleParam[i], param[i]);
            } else if (param[i] !== '') {
                handleParam[i] = param[i];
            }
        }
    },
    /**
     * 函数节流
     * @param func
     * @param wait
     * @param options
     * @returns {function(): *}
     */
    throttle: function (func, wait, options) {
        let leading = true,
            trailing = true;

        if (typeof func !== 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (options === false) {
            leading = false;
        } else if (isObject(options)) {
            leading = 'leading' in options ? !!options.leading : leading;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {'leading': leading, 'maxWait': +wait, 'trailing': trailing});
    },
    /**
     * 函数防抖
     */
    debounce: debounce,
    creatAxios: function ({timeout}) {
        const newAxios = axios.create({timeout});
        // const axiosCase = axios.create({
        //   // baseURL: '/djwmsservice' // api的base_url
        //   // timeout: 5000, // request timeout
        // });
        /**
         * 设置请求拦截器，将值为零的参数去除
         */
        newAxios.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            let key;
            switch (config.method) {
                case 'get':
                    key = 'params';
                    break;
                case 'post':
                    key = 'data';
                    break;
            }
            if (key) {
                let handleParam = Object.prototype.toString.call(config[key]) === '[object Array]' ? [] : {};
                this.LoopParam(handleParam, config[key]);
                config[key] = handleParam;
            }
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });
        return newAxios;
    }
};
