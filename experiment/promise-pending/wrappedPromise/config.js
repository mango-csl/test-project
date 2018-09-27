const {getInstance} = require('./logger')
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
module.exports = {
    /**
     * 默认请求出错的处理
     * @param err
     */
    defaultOnError: function (err) {
        try {
            let status = err.response.status;
            let map = {
                400: '请求错误',
                401: '未授权，请登录',
                403: '拒绝访问',
                404: `请求地址出错: ${err.response.config.url}`,
                408: '请求超时',
                500: '服务器内部错误',
                501: '服务未实现',
                502: '网关错误',
                503: '服务不可用',
                504: '网关超时',
                505: 'HTTP版本不受支持'
            };
            return map[status] || '连接出错';
        } catch (e) {
            return err;
        }
    },
    /**
     *
     */
    defaultRequestCall: function (DataReceived) {
        let callBackData, result;
        try {
            if (DataReceived.data.success) {
                callBackData = DataReceived.data.data;
                result = true;
            } else {
                callBackData = DataReceived.data.msg;
                result = false;
            }
        } catch (e) {
            callBackData = '-- 后端数据返回出错：' + e;
            result = false;
        }
        return {
            result: result,
            callBackData: callBackData
        }
    },
    /**
     * 默认消息提醒方法
     */
    defaultMessage: getInstance(),
    /**
     * 默认OnResponse返回处理
     * @param msg
     */
    defaultOnResponse: function (DataReceived) {
        try {
            return DataReceived.data.msg;
        } catch (e) {
            return '';
        }
    },
    /**
     * 循环传参对象，删除空字段
     * 移除值为‘’的数据
     * @param handleParam 新对象
     * @param param 原对象
     */
    LoopParam: LoopParam,
    createAxios: function (config) {
        this.default = {
            timeout: 3000
        };
        const newAxios = axios.create(Object.assign(this.default, config));
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
};
