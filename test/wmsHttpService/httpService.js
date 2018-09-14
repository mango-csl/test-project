const {HttpOnError, Message, creatAxios} = require('./config');

const {djcpsPromise} = require('./djpromise');

function WmsHttpService(options) {
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
    let axios = function (postConfig) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('已创建的axios -- postConfig:' + postConfig);
            }, 1000);
        });
    };
    return {
        wmsService: function (postConfig = {}) {
            return djcpsPromise(axios(postConfig), postConfig);
        }
    }
}

let wmsHttpService = WmsHttpService('create');

let getData = wmsHttpService.wmsService({
    requestControl: {
        pengdingLinit: false
    }
});

// getData.cancel();
let index = 0;
let count = 0;
let query = getData.throttle(1000).toPromise;
setInterval(() => {
    console.log('执行次数 = ', count);
    query().then((res) => {
        console.log('getData.toPromise():', res, '--index = ', index);
        index++;
    });
    count++;
}, 500)

