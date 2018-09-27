let promise = new Promise(resolve => {
    resolve('success');
});
promise.then
let subject = function (fn) {
    fn();
}
let wrappedPromise = function (fn) {
    subject(fn);
    return {
        subscribe: subscribe
    };
}


subscribe(() => {
    console.log('console');
}).subscribe(() => {
    console.log('console');
});