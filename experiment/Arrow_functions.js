let {sysLog} = require('./unit/methods');
let arrow_fn = function () {
    sysLog('arrow_fn', arguments);
};

var adder = {
    base: 1,

    add: function (a) {
        var f = v => v + this.base;
        return f(a);
    },

    addThruCall: function (a) {
        // var f = v => v + this.base;
        var f = function (v) {
            return v + this.base;
        };
        var b = {
            base: 2
        };

        return f.call(b, a);
    }
};

arrow_fn('adder.add(1) = ' + adder.add(1));         // 输出 2
arrow_fn('adder.addThruCall(1) = ' + adder.addThruCall(1)); // 仍然输出 2（而不是3 ——译者注）

// 常规写法  定义变量时，不采用修饰符，会变成未全局变量
var greeting = function () {
    now = new Date();
    return arrow_fn("Good" + ((now.getHours() > 17) ? " evening." : " day."));
};
greeting();          //"Good day."
arrow_fn(now);    // Fri Dec 22 2017 10:01:00 GMT+0800 (中国标准时间)

// var greeting = () => {var now = new Date(); return ("Good" + ((now.getHours() > 17) ? " evening." : " day."));}
// greeting();          //"Good day."
// console.log(now);    // ReferenceError: now is not defined 标准的let作用域

// 参数括号内定义的变量是局部变量（默认参数）
// var greeting = (now=new Date()) => "Good" + (now.getHours() > 17 ? " evening." : " day.");
// greeting();          //"Good day."
// console.log(now);    // ReferenceError: now is not defined

// 对比：函数体内{}不使用var定义的变量是全局变量
// var greeting = () => {now = new Date(); return ("Good" + ((now.getHours() > 17) ? " evening." : " day."));}
// greeting();           //"Good day."
// console.log(now);     // Fri Dec 22 2017 10:01:00 GMT+0800 (中国标准时间)

// 对比：函数体内{} 用var定义的变量是局部变量
// var greeting = () => {var now = new Date(); return ("Good" + ((now.getHours() > 17) ? " evening." : " day."));}
// greeting(); //"Good day."
// console.log(now);    // ReferenceError: now is not defined