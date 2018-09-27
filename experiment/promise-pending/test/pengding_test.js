const request = require(`../httpService/requestFactory`);
let $http = request();
/**
 * 实际组件内调用
 */
let _wmsRequest = $http({
    url: 'http://127.0.0.1:3000/user', resolved: function (data) {
        console.log('Resolved :', data);
    }, rejected: function (error) {
        console.log('Rejected :', error);
    }, service: ''
});
let query = function (url) {
    _wmsRequest.post(url);
};
let index = 0;

let Interval = setInterval(() => {
    query();
    if (index === 50) {
        _wmsRequest.cancel('取消请求');
    }
    if (index === 70) {
        clearInterval(Interval);
    }
    index++;
}, 100);
