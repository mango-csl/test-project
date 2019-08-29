let {sysLog} = require('./unit/methods');
let controlLog = function () {
    sysLog('controlLog', arguments);
};

// switch 的表达式和 case 的表达式是使用 === 严格相等运算符进行比较的：

switch (1 + 3) {
    case 2 + 2:
        controlLog('2 + 2 === 1 + 3 consoeyay()', 2 + 2 === 1 + 3);
        break;
    default:
        controlLog('neverhappens();');
}
let tem_fn = function () {
    return '123';
};
sysLog('fn1 === fn2', function () {
    return '123';
} === function () {
    return '123';
})
// const aNumber = Number(window.prompt("Type a number", ""));
