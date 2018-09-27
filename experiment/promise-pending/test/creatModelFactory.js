let creatModelFactory = function (type) {
    let Factory = function ({name, date}) {
        this.name = name;
        this.date = date;
        this.promise = new Promise(resolve => {
            resolve(date);
        });
        return function (fn) {
            return this.promise.then((data)=>{
                fn(data);
            })
        }.bind(this);
    };
    Factory.prototype.type = type;
    return function (config) {
        return new Factory(config);
    }
};
let modelFactory = new creatModelFactory('shoes');
let Tom_Factory = modelFactory({name: 'Tome', date: '2018'});
let Jack_Factory = modelFactory({name: 'Jack', date: '2017'});
let log = (data)=>{
    console.log(data);
}
setInterval(() => {
    Tom_Factory(log);
    Jack_Factory(log);
}, 1000);
