const Pending = require(`../pending`);
const {
    createAxios,
    defaultOnError,
    defaultOnResponse,
    defaultRequestCall,
    defaultMessage
} = require('../wrappedPromise/config');
const axios = require('axios');
var CancelToken = axios.CancelToken;

let SERVICE_PROXY = '/djwmsservice/';

/**
 * 构建统一回调处理模块
 * @param config
 * @returns {Function}
 */
let onFulfilledFactory = function ({onResponse, onError, message, requestCall} = {
    onResponse: defaultOnResponse,
    onError: defaultOnError,
    message: defaultMessage,
    requestCall: defaultRequestCall
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
                    if(_msg) message.info(_msg);
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
let RequestFactory = function ({url, param}, wrapped) {
    // cancel request,modify request status to reject
    let cancelAxios;
    let _axios = createAxios({
        cancelToken: new CancelToken(function (cancel) {
            cancelAxios = cancel;
        })
    });
    return {
        post: (function ({url, param}) {
            return function () {
                return wrapped.call(function () {
                    return _axios.post(url, param);
                }).catch((error) => {
                    // console.log(error.response.data);
                });
            }
        })({url, param}),
        get: (function ({url}) {
            return function () {
                return wrapped.call(function () {
                    return _axios.get(url);
                }).catch((error) => {
                    // console.log(error.response.data);
                });
            }
        })({url}),
        cancel: function (msg) {
            if (typeof cancelAxios === 'function') {
                return cancelAxios(msg);
            }
            return function () {
                console.log('cancel error');
            }
        }
    }
};
/**
 * 配置统一_axios
 * @returns {Promise<any>}
 */
let createRequest = function (onFulfilledConfig) {
    /**
     * 请求初始化
     * @type {Pending}
     */
    let wrapped = new Pending({
        autoReset: 'fulfilled'
    });
    let onFulfilled = new onFulfilledFactory(onFulfilledConfig);

    return function (config) {
        this.default = {
            service: SERVICE_PROXY,
            resolved: function (data) {
                console.log('url:', config.url, '--- Resolved :', data);
            },
            rejected: function (response) {
                console.log('url:', config.url, '--- Rejected :', response);
            },
        };
        config = Object.assign(this.default, config);
        config = Object.assign(config, {url: config.service + config.url});

        /**
         * 统一返回处理方法
         * @param res
         */
        wrapped.onFulfilled = onFulfilled(config);
        return new RequestFactory(config, wrapped)
    }
};

module.exports = function (config) {
    return createRequest(config);
};