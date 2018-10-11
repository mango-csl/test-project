'use strict';
const { getInstance } = require('./logger');
module.exports = {
  /**
   * 默认请求出错的处理
   * @param err
   */
  onError: function (err) {
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
  requestCall: function (DataReceived) {
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
    };
  },
  /**
   * 默认消息提醒方法
   */
  onMessage: getInstance(),
  /**
   * 默认OnResponse返回处理
   * @param dataReceived
   */
  onResponse: function (dataReceived) {
    try {
      return dataReceived.data.msg;
    } catch (e) {
      return '';
    }
  }
};
