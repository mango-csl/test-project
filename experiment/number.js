// function sysLog() {
//     console.log('number ---- ', arguments);
// }
let {sysLog} = require('./unit/methods');
let numberLog = function () {
    sysLog('number', arguments);
};
//JavaScript 不区分整数值和浮点数值，所有数字在 JavaScript 中均用浮点数值表示，所以在进行数字运算的时候要特别注意
numberLog(0.1 + 0.2);//log : 0.30000000000000004

numberLog(parseInt("123", 10)); // 123
numberLog(parseInt("010", 8)); //10
// 如果调用时没有提供第二个参数（字符串所表示数字的基），2013 年以前的 JavaScript 实现会返回一个意外的结果：

numberLog(parseInt("010"));  //  8
numberLog(parseInt("0x10")); // 16
// 这是因为字符串以数字 0 开头，parseInt()函数会把这样的字符串视作八进制数字；同理，0x开头的字符串则视为十六进制数字。

// 如果给定的字符串不存在数值形式，函数会返回一个特殊的值 NaN（Not a Number 的缩写）：

numberLog('parseInt("hello", 10)', parseInt("hello", 10)); // NaN
