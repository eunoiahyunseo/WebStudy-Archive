const path = require("path");
console.log(path.join(__dirname, "/hyunseo"));
console.log(path.resolve(__dirname, "hyunseo"));

console.log(path.normalize("//hyunseo//html"));

const arr = [];
if (arr) {
  console.log("doing");
}
