const request = require(`../httpService/requestFactory`);
$http = request({service: 'http://127.0.0.1:8081'});

const axios = require('axios');
var CancelToken = axios.CancelToken;
var source1 = CancelToken.source();
var source2 = CancelToken.source();
// this.$http.post('/upload', formData, config).then(function (response) {
//     if (response.status === 200) {
//         console.log(response.data);
//     }
// })
wmspost = $http.post;
/**
 * 实际组件内调用
 */
let user_do = wmspost({
    url: '/user',
    param: '',
    resolved: function (data) {
        console.log('Resolved1 :', data);
    },
    rejected: function (error) {
        console.log('Rejected1 :', error);
    },
    service: 'http://127.0.0.1:3000'
}, {
    cancelToken: source1.token
});
let postQuery = function () {
    return user_do();
};
/**
 * 实际组件内调用
 */
let tests = wmspost({
    url: '/tests',
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
});
let postQuery2 = function () {
    return tests();
};
let getQuery = function () {
    return $http.get({
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
    if (index < 31) {
        postQuery();
        postQuery2();
    } else {
        postQuery2();
    }
    index++;
}, 100);
