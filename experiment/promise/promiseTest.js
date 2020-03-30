function log(mes) {
    console.log(mes)
}

function test(resolve, reject) {
    var timeOut = Math.random() * 2;
    log('set timeout to: ' + timeOut + ' seconds.');
    setTimeout(function () {
        log('call resolve()...');
        resolve('200 OK');
        // if (timeOut < 1) {
        //     log('call resolve()...');
        //     resolve('200 OK');
        // }
        // else {
        //     log('call reject()...');
        //     reject('timeout in ' + timeOut + ' seconds.');
        // }
    }, 10);
}

// .then(function (result) {
//     log('成功：' + result);
// })

const mene_cache = new Promise(test)

mene_cache.then((data)=>{
    Promise.reject('reject');
    log('data')

})
