const fn = require("./fn");

// test("1은 1이야.", () => {
//   expect(1).toBe(1);
// });

// test("이름과 나이를 전달받아서 객체를 반환해줘", () => {
//   expect(fn.makeUser("Mike", 30)).toEqual({
//     name: "Mike",
//     age: 30,
//   });
// });

// test("이름과 나이를 전달받아서 객체를 반환해줘", () => {
//   expect(fn.makeUser("Mike", 30)).toStrictEqual({
//     name: "Mike",
//     age: 30,
//   });
// });

// test("test regex presentation", () => {
//   const RegEx = /(http(s)?:\/\/)(\w+\.*)/
//   const string = "d";
//   expect(string).toMatch(RegEx);
// });

// test("3초 후에 받아온 이름은 Mike", (done) => {
//   function callback(name) {
//     try {
//       expect(name).toBe("Mike");
//       done();
//     } catch (error) {
//       done();
//     }
//   }

//   fn.getName(callback);
// });

// test("3초 후에 받아온 이름은 30", async () => {
//   return fn.getAge().then((age) => {
//     expect(age).toBe(30);
//   });
// resolve 상황
//   return expect(fn.getAge()).resolves.toBe(30);
// reject 상황
// return expect(fn.getAge()).rejects.toBe(30);

//   const age = await fn.getAge();
//   expect(age).toBe(30);

//   await expect(fn.getAge()).resolves.toBe(30);
// });

// let user;

// beforeAll(async () => {
//   user = await fn.connectUserDb();
// });

// afterAll(async () => {
//   await fn.disconnectDb;
// });

// test("이름은 Mike", () => {
//   expect(user.name).toBe("Mike");
// });

// test("나이는 30", () => {
//   expect(user.age).toBe(30);
// });

// test("성별은 남성", () => {
//   expect(user.gender).toBe("male");
// });

// describe("Car 관련 작업", () => {
//   let car;

//   beforeAll(async () => {
//     car = await fn.connectCarDb();
//   });

//   afterAll(async () => {
//     await fn.disconnectCarDb;
//   });

//   test("이름은 z4", () => {
//     expect(car.name).toBe("z4");
//   });

//   test("브랜드는 bmw", () => {
//     expect(car.brand).toBe("bmw");
//   });

//   test("색상은 red", () => {
//     expect(car.color).toBe("red");
//   });
// });

// beforeAll(() => console.log("밖 beforeAll"));
// beforeEach(() => console.log("밖 beforeEach"));
// afterEach(() => console.log("밖 afterEach"));
// afterAll(() => console.log("밖 afterAll"));

// test("0 + 1 = 1", () => {
//   expect(fn.add(0, 1)).toBe(1);
// });

// describe("Car 작업 관련", () => {
//   beforeAll(() => console.log("안 beforeAll"));
//   beforeEach(() => console.log("안 beforeEach"));
//   afterEach(() => console.log("안 afterEach"));
//   afterAll(() => console.log("안 afterAll"));

//   test.only("0 + 1 = 1", () => {
//     expect(fn.add(0, 1)).toBe(1);
//   });
// });

// const mockFn = jest.fn();

// mockFn();
// mockFn(1);

// test("함수는 2번 호출됩니다.", () => {
//   expect(mockFn.mock.calls.length).toBe(2);
// });

// test("2번째로 호출된 함수에 전달된 첫번째 인수는 1 입니다.", () => {
//   expect(mockFn.mock.calls[1][0]).toBe(1);
// });

// const mockFn = jest.fn();

// function forEachAdd1(arr) {
//   arr.forEach((num) => {
//     mockFn(num + 1);
//   });
// }

// forEachAdd1([10, 20, 30]);

// test("함수 호출은 3번 됩니다", () => {
//   expect(mockFn.mock.calls[0][0]).toBe(11);
//   expect(mockFn.mock.calls[1][0]).toBe(21);
//   expect(mockFn.mock.calls[2][0]).toBe(31);
// });

// const mockFn = jest.fn((num) => num + 1);

// mockFn(10);
// mockFn(20);
// mockFn(30);

// console.log(mockFn.mock.results);
// test("10에서 1 증가한 값이 변화한다.", () => {
//   expect(mockFn.mock.results[0].value).toBe(11);
// });
// test("20에서 1 증가한 값이 변화한다.", () => {
//   expect(mockFn.mock.results[1].value).toBe(21);
// });
// test("30에서 1 증가한 값이 변화한다.", () => {
//   expect(mockFn.mock.results[2].value).toBe(31);
// });

// const mockFn = jest.fn();

// mockFn
//   .mockReturnValueOnce(true)
//   .mockReturnValueOnce(false)
//   .mockReturnValueOnce(true)
//   .mockReturnValueOnce(false)
//   .mockReturnValue(true);

// const result = [1, 2, 3, 4, 5].filter((num) => mockFn(num));

// test("홀수는 1, 3, 5", () => {
//   expect(result).toStrictEqual([1, 3, 5]);
// });

// const mockFn = jest.fn();

// mockFn.mockResolvedValue({ name: "Mike" });

// test("받아온 이름은 Mike.", async () => {
//   const res = await mockFn();
//   expect(res.name).toBe("Mike");
// });

// 실제 fn.createUser는 실행되지 않는다. -> 그저 mock 함수가 동작할 뿐이다.
// jest.mock("./fn");
// fn.createUser.mockReturnValue({ name: "Mike" });

// test("유저를 만든다", () => {
//   const user = fn.createUser("Mike");
//   expect(user.name).toBe("Mike");
// });

// Date.now = jest.fn(() => 4);

// console.log(Date.now());
// console.log(Date.now());

const data = jest.fn((number) => 4 + number);
data(6);
console.log(data.mock);

test("test", () => {
  expect(1 + 1).toBe(2);
});
