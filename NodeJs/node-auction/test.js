const t = Date.now();
const seconds = ("0" + Math.floor((t / 1000) % 60)).slice(-2);
console.log(seconds);

console.log(new Date());
