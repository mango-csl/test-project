const Pending = require(`../pending`);
const {
    createAxios,
    defaultOnError,
    defaultOnResponse,
    defaultRequestCall,
    defaultMessage
} = require('../wrappedPromise/config');

let SERVICE_PROXY = '/djwmsservice/';

let DEFAULT_CONFIG = {
    url: 'empty',
    param: {},
    service: '',
    resolved: function (data) {
        console.log('url:', config.url, '--- Resolved :', data);
    },
    rejected: function (response) {
        console.log('url:', config.url, '--- Rejected :', response);
    },
};

/**
 * 构建统一回调处理模块
 * @param config
 * @returns {Function}
 */
let onFulfilledFactory = function ({
                                       onResponse = defaultOnResponse,
                                       onError = defaultOnError,
                                       message = defaultMessage,
                                       requestCall = defaultRequestCall
                                   }) {
    let _onFulfilled = function ({resolved, rejected, url}) {
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
                    console.warn('Request canceled:', _value.message);
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
    return _onFulfilled
};
/**
 * RequestFactory
 * @param url --- service url
 * @param param --- service param
 * @param wrapped --- wrapped axios
 * @returns {{post: *, get: *, cancel: cancel}}
 * @constructor
 */
let RequestFactory = function (onFulfilledConfig) {
    let requestConfig = Object.assign(DEFAULT_CONFIG, {service: onFulfilledConfig.service || SERVICE_PROXY});
    /**
     * 请求初始化
     * @type {Pending}
     */
    let wrapped = new Pending({
        autoReset: 'fulfilled'
    });
    let onFulfilled = new onFulfilledFactory(onFulfilledConfig);

    let _axios = createAxios();

    return {
        post: function (postConfig = {}, axiosConfig = {}) {
            postConfig = Object.assign(requestConfig, postConfig);
            let {url, param, resolved, rejected, service} = postConfig;
            let realUrl = service + url;
            /**
             * 统一返回处理方法
             * @param res
             */
            wrapped.onFulfilled = onFulfilled({url: realUrl, resolved, rejected});

            return wrapped.call(function () {
                return _axios.post(realUrl, param, axiosConfig);
            }).catch((error) => {
                // console.log(error.response.data);
            });
        },
        get: function (getConfig = {}, axiosConfig = {}) {
            getConfig = Object.assign(requestConfig, getConfig);
            let {url, resolved, rejected, service} = getConfig;
            let realUrl = service + url;
            /**
             * 统一返回处理方法
             * @param res
             */
            wrapped.onFulfilled = onFulfilled({url: realUrl, resolved, rejected});

            return wrapped.call(function () {
                return _axios.get(realUrl, axiosConfig);
            }).catch((error) => {
                // console.log(error.response.data);
            });
        }
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