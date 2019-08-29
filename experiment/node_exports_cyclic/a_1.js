const b = require('./b');
console.log('b = ', b)//b =  { config: { path: 'undefinedb' } }
module.exports = {
    base: 'pathName',
    common: {
        commonPath: 'a' + b.config.path
    }
}
