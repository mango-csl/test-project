const {HttpOnError, Message, creatAxios} = require('./config');

const {djcpsPromise} = require('./djpromise');

function HttpService(options) {
    /**
     * 请求配置
     * @type {{service: string, onError: HttpOnError}}
     */
    let config = {
        service: '/djwmsservice', //url前缀
        onError: HttpOnError,
        message: Message,
        axiosConfig: {
            timeout: 5000
        }
    };

    let initService = function (options) {
        config = Object.assign(config, options);
        // axios = creatAxios(config.axiosConfig);
        console.log('initService --- options : ', options);
    };
    initService(options);

    /**
     * 创建axios
     * @type {Promise<any>}
     */
    let axios = function (axiosConfig) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('---------------------查询返回数据------------------');
                console.log('postConfig = ', axiosConfig);
            }, 2000);
        });
    };
    return {
        wmsService: function (postConfig = {}) {
            return new djcpsPromise(axios('axiosConfig'), postConfig);
        }
    }
}

let wmsHttpService = HttpService('create');

let getData = wmsHttpService.wmsService({
    url:'testQuery',
    param:{
      name:'param1'
    },
    onResponse: (msg) => {
        console.log('customOnResponse -----  msg = ', msg);
    },
    onError: (error) => {
        console.log('customOnError -----  error = ', error);
    },
    requestControl: {
        pengdingLinit: true
    }
});

// getData.cancel();
let index = 0;
let count = 0;
// let query = getData.toPromise;
// let runQuery = function () {
//     return query().then((res) => {
//         console.log('getData.topromise():', res, '--index', index);
//         index++;
//     });
// };


function query(index) {
    getData.toPromise.then((res) => {
        console.log('getData.toPromise():', res, '--index = ', index);
    });
}

setInterval(() => {
    console.log('执行次数 = ', count);
    query(count);
    count++;
}, 1000);
