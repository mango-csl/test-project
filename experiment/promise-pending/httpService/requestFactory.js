const Pending = require(`../pending`);
// const {
//     createAxios,
//     defaultOnError,
//     defaultOnResponse,
//     defaultRequestCall,
//     defaultMessage
// } = require('../wrappedPromise/config');

const createAxios = require('./unit/axiosFactory');
const {
    defaultOnError,
    defaultOnResponse,
    defaultRequestCall,
    defaultMessage
} = require('./unit/default');

let DEFAULT_CONFIG = {
    url: 'empty',
    param: {},
    service: '/djwmsservice/',
    resolved: function (data) {
        console.log('Resolved :', data);
    },
    rejected: function (response) {
        console.log('Rejected :', response);
    },
};

/**
 * 构建统一回调处理模块
 * @param onResponse
 * @param onError
 * @param message
 * @param requestCall
 * @returns {function({resolved?: *, rejected?: *, url?: *}): Function}
 */
let onFulfilledFactory = function ({
                                       onResponse,
                                       onError,
                                       message,
                                       requestCall,
                                   } = {
    onResponse: defaultOnResponse,
    onError: defaultOnError,
    message: defaultMessage,
    requestCall: defaultRequestCall
}) {
    return function ({resolved, rejected, url}) {
        let count = 0;
        return function (res) {
            if (res._isResolved) {
                if (typeof resolved === 'function') {
                    message.info('url:', url);
                    // resolved(res.value.data);
                } else {
                    message.error('error in Resolved callFn');
                }
                let {result, callBackData} = requestCall(res.value);
                if (result) {
                    let _msg = onResponse(res.value);
                    if (_msg) message.info(_msg);
                    resolved(callBackData);
                } else {
                    message.error(callBackData);
                    rejected(callBackData);
                }
            } else if (res._isRejected) {
                let _value = res.value;
                if (!_value.hasOwnProperty('response')) {
                    message.warn('Request canceled:', _value.message);
                } else if (typeof rejected === 'function') {
                    message.error('url:', url);
                    message.error(onError(_value));
                    rejected(_value);
                } else {
                    message.error('error in Rejected callFn');
                }
            }
            count++;
            console.log('count : ', count);
        }
    };
};
let RequestFactory = function (onFulfilledConfig) {
    let requestConfig = Object.assign(DEFAULT_CONFIG, {service: onFulfilledConfig.service || ''});

    let onFulfilled = new onFulfilledFactory();
    // onFulfilledConfig
    let _axios = createAxios();

    let Wrapped = function (postConfig, axiosConfig, method) {
        postConfig = Object.assign(requestConfig, postConfig);
        let {url, param, resolved, rejected, service} = postConfig;
        let realUrl = service + url;

        let wrapped = new Pending({
            autoReset: 'fulfilled'
        });
        wrapped.onFulfilled = onFulfilled({url: realUrl, resolved, rejected});
        let createPromise = function () {
            //To Do 完善封装 目前只有post方法
            return wrapped.call(function () {
                if (method === 'post') {
                    return _axios[method](realUrl, param, axiosConfig);
                } else {
                    return _axios[method](realUrl, axiosConfig);
                }
            });
        };
        return {
            toPromise: createPromise,
        };
    };
    return {
        post: function (postConfig = {}, axiosConfig = {}) {
            return Wrapped(postConfig, axiosConfig, 'post')
        },
        get: function (postConfig = {}, axiosConfig = {}) {
            return Wrapped(postConfig, axiosConfig, 'get')
        }
        /**
         * 暂时没有好的解决方案
         */
        // all: function () {
        //
        // }
    }
};
/**
 * 配置统一_axios
 * @returns {Promise<any>}
 */
// let createRequest = function (config) {
//     return new RequestFactory(config)
// };

module.exports = function (config) {
    return RequestFactory(config);
};