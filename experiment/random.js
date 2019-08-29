var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
random_base64 = function random_base64(length) {
    var str = "";
    for (var i = 0; i < length; ++i) {
        var rand = Math.floor(Math.random() * ALPHABET.length);
        str += ALPHABET.substring(rand, rand + 1);
    }
    return str;
}

function log_Base64(count) {
    for (let i = 0; i < count; i++) {
        console.log('random_base64(100) = ', random_base64(100))
    }
}

log_Base64(10)
// ---------------------
//     作者：woaimumuoyoyoy
// 来源：CSDN
// 原文：https://blog.csdn.net/woaimumuoyoyoy/article/details/80848240
//     版权声明：本文为博主原创文章，转载请附上博文链接！
