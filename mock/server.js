// 使用 Mock
var Mock = require('mockjs')
// var data = Mock.mock({
//     // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
//     'list|1-10': [{
//         // 属性 id 是一个自增数，起始值为 1，每次增 1
//         'id|+4': 1
//     }],
//     'name|5-8': 'test',
//     name: {
//         first: '@FIRST',
//         middle: '@FIRST',
//         last: '@LAST',
//         full: '@first @middle @last'
//     }
// })

// Mock.mock( rurl, rtype, template )
Mock.mock(/\.json/, 'get', {
    type: 'get'
})
Mock.mock(/\.json/, 'post', {
    type: 'post'
})
// 输出结果