const DEFAULT_CONFIG = require('../default');
const { mergeOptions } = require('../utils');

class OnFulfilled {
  constructor(config) {
    this._option = mergeOptions(DEFAULT_CONFIG, config);
  }

  /**
   *
   *
   * @param {*} res
   * @returns
   * @memberof OnFulfilled
   */
  _onFulfilled(res) {
    let { onResponse, onError, requestCall } = this._option;
    let _message = {
      type: undefined,
      msg: undefined,
      callBackData: undefined
    };
    if (res._isResolved) {
      let { result, callBackData } = requestCall(res.value);
      if (result) {
        _message = {
          type: 'info',
          msg: onResponse(res.value) || undefined,
          callBackData: callBackData
        };
      } else {
        _message = {
          type: 'error',
          msg: callBackData,
          callBackData: callBackData
        };
      }
    } else if (res._isRejected) {
      let _value = res.value;
      if (!_value.hasOwnProperty('response')) {
        console.error('Request canceled:' + _value.message);
      } else {
        let _msg = onError(_value);
        _message = {
          type: 'error',
          msg: _msg,
          callBackData: _msg
        };
      }
    }
    return _message;
  }
  call({ resolved, rejected, url }) {
    let { onMessage } = this._option;
    if (!(typeof resolved === 'function' && typeof rejected === 'function')) {
      return new Error('error in constructor of callFn');
    }
    let _onFulfilled = this._onFulfilled.bind(this);

    // let count = 0;
    return function (res) {
      let message = _onFulfilled(res);
      switch (message.type) {
        case 'error':
          onMessage.error(message.msg);
          rejected(message.callBackData);
          break;
        case 'info':
          onMessage.info(message.msg);
          resolved(message.callBackData);
          break;
      }
    };
  }
}

module.exports = OnFulfilled;
