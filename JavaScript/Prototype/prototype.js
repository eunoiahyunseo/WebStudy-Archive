// function Person(name) {
//   this.name = name || "혁준";
//   this.gender = "male";
// }

// Person.prototype.getName = function () {
//   return this.name;
// };

// Person.prototype.gender = "male";

// function Korean(name) {
//   this.name = name;
// }

// Korean.prototype = Person.prototype;

// const kor1 = new Korean("hyunseo");
// console.log(kor1.getName()); // hyunseo
// console.log(kor1.name); // hyunseo
// console.log(kor1.gender);

var person = {
  type: "인간",
  getType: function () {
    return this.type;
  },
  getName: function () {
    return this.name;
  },
};

var joon = Object.create(person, {
  foo: {
    writeable: true,
    configureable: true,
    value: "hello",
  },
  good: {
    configureable: false,
    get: function () {
      return 10;
    },
    set: function (value) {
      console.log(`good ${value}`);
    },
  },
});
joon.name = "혁준";

console.log(joon.getType());
console.log(joon.getName());
console.log(joon.good);
