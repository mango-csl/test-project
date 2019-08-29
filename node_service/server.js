'use strict';
var express = require('express');
var app = express();
var fs = require('fs');
//设置跨域访问
app.all('*', function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

var error_index = true;
app.post('/user', function (req, res) {
    setTimeout(() => {
        console.log('visited /user');
        if (error_index) {
            // res.end(data);
            res.status(200).send({
                msg: '操作成功',
                code: 800000,
                data: {
                    name: 'sam',
                    age: 11
                },
                success: true
            });
            error_index = !error_index;
        } else {
            res.status(200).send({
                msg: '操作失败',
                code: 403,
                data: {
                    name: 'sam',
                    age: 11
                },
                success: false
            });
            error_index = !error_index;
        }
    }, 1000);
    // res.end(data);
});

app.post('/test', function (req, res) {
    // setTimeout(() => {
    console.log('visited /test');
    res.status(200).send({
        msg: '操作成功',
        code: 800000,
        data: {
            name: 'sam',
            age: 11
        },
        success: true
    });
    // }, 1000);
    // res.end(data);
});
app.get('/getTest', function (req, res) {
    let data = 'server data';
    setTimeout(() => {
        console.log(data);
        res.end(data);
    }, 1000);
    // res.end(data);
});



const port = 3999;

var server = app.listen(port, function () {
    console.log('应用实例，访问地址为 http://%s:%s', '127.0.0.1', port);
});
