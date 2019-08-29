// let object = {CONSOLE_MENU_CACHE: '55555'}
let object = {}

let _cache = object.MENU_CACHE || (object.MENU_CACHE = Promise.resolve({
    count: (() => {
        return console.log("init"), 1
    })()
}), object.MENU_CACHE);
_cache.then(item => {
    console.log("0", item)
})
_cache.then(item => {
    let _item = JSON.parse(JSON.stringify(item))
    console.log("-2", _item)
    _item.count++;
    console.log("2-", _item)
})
_cache.then(item => {
    console.log("-1", item)
    item.count++;
    console.log("1-", item)
})

