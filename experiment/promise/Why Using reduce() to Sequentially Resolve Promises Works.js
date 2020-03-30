// let userIDs = [1, 2, 3];
//
// function methodThatReturnsAPromise(nextID) {
//     return new Promise((resolve, reject) => {
//         resolve(nextID);
//     }).then(data => console.log(data));
// }

// userIDs.reduce((previousPromise, nextID) => {
//     return previousPromise.then(() => {
//         return methodThatReturnsAPromise(nextID);
//     });
// }, Promise.resolve());

// userIDs.reduce( async (previousPromise, nextID) => {
//     await previousPromise;
//     return methodThatReturnsAPromise(nextID);
// }, Promise.resolve());

function methodThatReturnsAPromise(nextID) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            console.log(`Resolve! ${new Date()}`);

            resolve();
        }, 1000);
    });
}

[1, 2, 3].reduce((accumulatorPromise, nextID) => {

    console.log(`Loop! ${new Date()}`);

    return accumulatorPromise.then(() => {
        return methodThatReturnsAPromise(nextID);
    });
}, Promise.resolve());

// function methodThatReturnsAPromise(id) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log(`Processing ${id}`);
//             resolve(id);
//         }, 1000);
//     });
// }
//
// let result = [1,2,3].reduce( (accumulatorPromise, nextID) => {
//     return accumulatorPromise.then(() => {
//         return methodThatReturnsAPromise(nextID);
//     });
// }, Promise.resolve());
//
// result.then(e => {
//     console.log(e,"Resolution is complete! Let's party.")
// });
