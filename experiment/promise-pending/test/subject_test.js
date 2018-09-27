let subject = function (fn) {
    fn();
}
let subscribe = function (fn) {
    subject(fn);
    return subscribe;
}