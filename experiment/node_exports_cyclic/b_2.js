const a = require('./a');
console.log('a = ', a)//a =  {}
module.exports = {
    config: {
        path: a.base + 'b'
    }
}
