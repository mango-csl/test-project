const request = require(`../httpService/requestFactory`);
// 配置请求
const $http = request({service: 'http://127.0.0.1:8081'});

const axios = require('axios');
var CancelToken = axios.CancelToken;
var source1 = CancelToken.source();
var source2 = CancelToken.source();
// this.$http.post('/upload', formData, config).then(function (response) {
//     if (response.status === 200) {
//         console.log(response.data);
//     }
// })
let wmspost = $http.post;
let wmsget = $http.get;
/**
 * 实际组件内调用
 */
let user_do = wmspost({
    url: '/user',
    param: {
        name: null,
        age: 11
    },
    resolved: function (data) {
        console.log('Resolved1 :', data);
    },
    rejected: function (error) {
        console.log('Rejected1 :', error);
    },
    service: 'http://127.0.0.1:3000'
}, {
    cancelToken: source1.token
}).toPromise;
let postQuery = function () {
    return user_do();
};
/**
 * 实际组件内调用
 */
let tests = wmspost({
    url: '/test',
    param: '',
    resolved: function (data) {
        console.log('Resolved2 :', data);
    },
    rejected: function (error) {
        console.log('Rejected2 :', error);
    },
    service: 'http://127.0.0.1:3000'
}, {
    cancelToken: source2.token
}).toPromise;
let postQuery2 = function () {
    return tests();
};
let getQuery = function () {
    return $http.wmsget({
        url: '/getTest',
        resolved: function (data) {
            console.log('Resolved :', data);
        },
        rejected: function (error) {
            console.log('Rejected :', error);
        },
        service: 'http://127.0.0.1:3000'
    }, {
        cancelToken: source1.token
    });
};
// Promise.all([postQuery(), getQuery()]).then(data => {
//     console.log('promise all :', data);
// });

let index = 0;
let Interval = setInterval(() => {
    // if (index < 31) {
        postQuery();
        postQuery2();
    // }
    // else {
    //     source1.cancel('中断请求');
    //     postQuery();
    //     postQuery2();
    // }
    console.log('index = ', index);
    index++;
    if (index > 50) {
        clearInterval(Interval);
    }
}, 100);
