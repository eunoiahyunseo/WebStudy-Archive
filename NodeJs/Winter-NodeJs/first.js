/* 노드가 실글 스드는 말은 들어봤을 겁니다.
    하지만 실글 스레드 동작하지는 않습니다.
    그저 우리가 제어할 수 있는 스레드가 하나일 뿐이다.
*/

// Node Server는 크기는 작지만 작은 데이터를 실시간으로 주고받는데 적합하다.

/* worker_threads */

// const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

// if (isMainThread) {
//   const worker = new Worker(__filename);
//   worker.on("message", (message) => console.log("from worker", message));
//   worker.on("exit", () => console.log("worker exit"));
//   worker.postMessage("ping");
// } else {
//   // worker_thread
//   parentPort.on("message", (value) => {
//     console.log("from parent", value);
//     parentPort.postMessage("pong");
//     parentPort.close();
//   });
// }

// const addWorkerThread = (set, data) => {
//   const addWorkder = new Worker(__filename, {
//     workerData: { start: data },
//   });
//   //   setTimeout(() => {
//   //     console.log("checkout");
//   //   }, 3000);
//   set.add(addWorkder);
// };

// if (isMainThread) {
//   // MainThread
//   const threads = new Set();
//   addWorkerThread(threads, 1);

//   addWorkerThread(threads, 2);
//   for (let worker of threads) {
//     worker.on("message", (message) => console.log("from worker", message));
//     worker.on("exit", () => {
//       threads.delete(worker);
//       if (threads.size === 0) {
//         console.log("job done");
//       }
//     });
//   }
// } else {
//   const data = workerData;
//   parentPort.postMessage(data.start + 100);
// }

/* child_process */

// const spawn = require("child_process").spawn;

// const process = spawn("python", ["test.py"], { shell: true });

// process.stdout.on("data", (data) => {
//   console.log(data.toString());
// });

// process.stderr.on("data", (data) => {
//   console.error(data.toString());
// });

/* file outputinput */

// const fs = require("fs").promises;

// const fs = require("fs");

// const defaultFunction = (index) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile("./readme.txt", (err, data) => {
//       if (err) {
//         throw err;
//       }
//       console.log(`doing ${index}`);
//       setTimeout(() => {
//         resolve(`${index} ${data.toString()}`);
//       }, 3000);
//     });
//   });
// };
// // const test = () => {
// //   return new Promise((resolve, reject) => {
// //     return "hello";
// //   });
// // };

// const readFile = async (count) => {
//   i = count;
//   const PromiseArray = [];
//   for (j = 0; j < i; j++) {
//     PromiseArray.push(defaultFunction(j));
//   }
//   return await Promise.all(PromiseArray).then((result) => result.join("\n"));
// };

// readFile(3).then(console.log);

/* file Stream */

const fs = require("fs");
const zlib = require("zlib");

const readStream = fs.createReadStream("readme.txt");
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream("writeme.txt.gz");

readStream.pipe(zlibStream).pipe(writeStream);
