'use strict';
const Pending = require(`../pending`);
const OnFulfilled = require('./unit/onFulfilled');
const createAxios = require('./unit/axiosFactory');

let DEFAULT_CONFIG = {
  url: 'empty',
  param: {},
  service: '/djwmsservice/',
  resolved: function(data) {
    console.log('Resolved :', data);
  },
  rejected: function(response) {
    console.log('Rejected :', response);
  }
};

let RequestFactory = function(onFulfilledConfig) {
  let requestConfig = Object.assign(DEFAULT_CONFIG, {
    service: onFulfilledConfig.service || ''
  });

  let _onFulfilled = new OnFulfilled(onFulfilledConfig);
  // onFulfilledConfig
  let _axios = createAxios();

  let Wrapped = function(postConfig, axiosConfig, method) {
    postConfig = Object.assign(requestConfig, postConfig);
    let { url, param, resolved, rejected, service } = postConfig;
    let realUrl = service + url;

    let wrapped = new Pending({
      autoReset: 'fulfilled'
    });
    wrapped.onFulfilled = _onFulfilled.call({
      url: realUrl,
      resolved,
      rejected
    });
    let createPromise = function() {
      return wrapped.call(function() {
        if (method === 'post') {
          return _axios[method](realUrl, param, axiosConfig);
        } else {
          return _axios[method](realUrl, axiosConfig);
        }
      });
    };
    return {
      toPromise: createPromise
    };
  };
  return {
    post: function(postConfig = {}, axiosConfig = {}) {
      return Wrapped(postConfig, axiosConfig, 'post');
    },
    get: function(postConfig = {}, axiosConfig = {}) {
      return Wrapped(postConfig, axiosConfig, 'get');
    }
    /**
     * 暂时没有好的解决方案
     */
    // all: function () {
    //
    // }
  };
};
/**
 * 配置统一_axios
 * @returns {Promise<any>}
 */
// let createRequest = function (config) {
//     return new RequestFactory(config)
// };

module.exports = function(config) {
  return RequestFactory(config);
};
