"use strict";
// const map = <T, P>(arr: T[], func: (arg: T) => P) => {
//   return arr.map(func);
// };
// const parsed = map(["1", "2", "3"], (n) => parseInt(n));
// console.log(parsed);
const longest = (a, b) => {
    if (a.length >= b.length) {
        return a;
    }
    else {
        return b;
    }
};
console.log(longest([1, 2], [1, 2, 3]));
console.log(longest("alice", "bob"));
