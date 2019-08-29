!function (t, e) {
  "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.djSubject = e() : t.djSubject = e()
}("undefined" != typeof self ? self : this, function () {
  return function (t) {
    var e = {};

    function i(r) {
      if (e[r]) return e[r].exports;
      var s = e[r] = {i: r, l: !1, exports: {}};
      return t[r].call(s.exports, s, s.exports, i), s.l = !0, s.exports
    }

    return i.m = t, i.c = e, i.d = function (t, e, r) {
      i.o(t, e) || Object.defineProperty(t, e, {configurable: !1, enumerable: !0, get: r})
    }, i.n = function (t) {
      var e = t && t.__esModule ? function () {
        return t.default
      } : function () {
        return t
      };
      return i.d(e, "a", e), e
    }, i.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e)
    }, i.p = "", i(i.s = 0)
  }([function (t, e, i) {
    t.exports = i(1)
  }, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.default = function () {
      this.list = {}, this.cacheTrigger = {}, this.listen = ((t, e) => {
        this.list[t] || (this.list[t] = []), this.cacheTrigger[t] && (e(...this.cacheTrigger[t]), this.cacheTrigger[t] = void 0), this.list[t].push(e)
      }), this.trigger = ((t, ...e) => {
        this.list[t] ? this.run(t, ...e) : this.cacheTrigger[t] = [...e]
      }), this.run = ((t, ...e) => {
        this.list[t].forEach(t => {
          t(...e)
        })
      }), this.remove = ((t, e) => {
        let i = this.list[t];
        if (!i) return !1;
        if (e) for (let t = i.length - 1; t >= 0; t--) {
          let r = i[t];
          r === e && i.splice(t, 1)
        } else i && (i.length = 0)
      }), this.hasListen = (t => !!(this.list[t] && this.list[t].length > 0)), this.getList = (() => this.list)
    }
  }])
});
//# sourceMappingURL=djSubject.common.browers.js.map
