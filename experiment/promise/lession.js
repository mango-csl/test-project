const log = (str) => console.log(str);

// const array1 = [1, 2, 3, 4];
// const reducer = (accumulator, currentValue) => accumulator + currentValue;
//
// // 1 + 2 + 3 + 4
// log(array1.reduce(reducer));
// // expected output: 10
//
// // 5 + 1 + 2 + 3 + 4
// log(array1.reduce(reducer, 5));
// // expected output: 15
//
// var maxCallback = ( acc, cur ) => Math.max( acc.x, cur.x );
// var maxCallback2 = ( max, cur ) => Math.max( max, cur );
//
// // reduce() 没有初始值
// log([ { x: 22 }, { x: 42 } ].reduce( maxCallback )); // 42
// log([ { x: 22 }            ].reduce( maxCallback )); // { x: 22 }
// // log([                      ].reduce( maxCallback )); // TypeError
//
// // map/reduce; 这是更好的方案，即使传入空数组或更大数组也可正常执行
// [ { x: 22 }, { x: 42 } ].map( el => el.x )
//     .reduce( maxCallback2, -Infinity );

var initialValue = 0;
var sum = [{x: 1}, {x: 2}, {x: 3}].reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.x;
}, initialValue);

console.log(sum); // logs 6
