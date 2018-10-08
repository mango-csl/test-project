const axios = require('axios');

/**
 * judge boolean
 * @param value
 * @returns {boolean}
 */
function coerceBoolean(value) {
    return value !== null && value !== undefined && `${value}` !== 'false' && `${value}` !== 'NaN' && `${value}` !== '';
}

/**
 * deal params before request
 * @param handleParam
 * @param param
 * @constructor
 */
const LoopParam = function (handleParam, param) {
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
};
/**
 * defaultConfig
 * @type {{timeout: number}}
 */
const defaultConfig = {
    timeout: 3000
};

/**
 * creatAxios
 * @param config
 * @returns {*}
 */
function createAxios(config) {
    const newAxios = axios.create(Object.assign(defaultConfig, config));
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
            LoopParam(handleParam, config[key]);
            config[key] = handleParam;
        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });
    return newAxios;
}
module.exports = createAxios;