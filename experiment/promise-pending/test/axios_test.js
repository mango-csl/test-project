const axios = require('axios');
var CancelToken = axios.CancelToken;
var source = CancelToken.source();

axios.post('http://127.0.0.1:3000/test', {}, {
    cancelToken: source.token
}).then((data) => {
    data;
}).catch(function (thrown) {
    if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
    } else {
        // 处理错误
    }
});
axios.get('http://127.0.0.1:3000/getTest', {
    cancelToken: source.token
}).then((data) => {
    data;
}).catch(function (thrown) {
    if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
    } else {
        // 处理错误
    }
});
// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');


