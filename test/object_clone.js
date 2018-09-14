Object.prototype.clone = function () {
    //原型指向保持一致
    var newobj = Object.create(Object.getPrototypeOf(this));
    //自身属性保持一样
    var propNames = Object.getOwnPropertyNames(this);
    propNames.forEach(function (item) {
        //保持每个属性的特性也一样
        var des = Object.getOwnPropertyDescriptor(this, item);
        Object.defineProperty(newobj, item, des);
    }, this);
    return newobj;
}

let obj = new Object({name: 'text',arr:['arr']});
let obj_clone = obj.clone();
obj.name = 'change';
console.log('obj =', obj, '-------obj_clone =', obj_clone);

let arr = ['name'];
let arr_clone = arr.clone();
arr.push('change');
arr_clone.push('clone');
arr_clone.shift();
console.log('arr =', arr, '-------arr_clone =', arr_clone,arr_clone.length);