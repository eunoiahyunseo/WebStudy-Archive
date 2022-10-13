// // @ts-check

// const posts = [
//   {
//     id: 'my_first_post',
//     title: 'My first post',
//     content: 'Hello!',
//   },
//   {
//     id: 'my_second_post',
//     title: 'my second_post',
//     content: 'hello too',
//   },
// ]

// const result = posts.map((post) => {
//   const returnObj = {}
//   const { id, title } = post
//   returnObj.id = id
//   returnObj.title = title
//   return returnObj
// })

// const callback = async () => ({
//   statusCode: 200,
//   body: 'hello',
// })

// const callback_2 = async () => {
//   const obj = {}
//   obj.name = 'hyunseo'
//   return obj
// }

// async function main() {
//   const call = await callback()
//   console.log(typeof call)
// }

// async function main_2() {
//   const call = await callback_2()
//   console.log(typeof call)
// }

// callback().then((value) => {
//   console.log(value)
// })

// callback_2().then((value) => {
//   console.log(value)
// })

// /* eslint-disable-next-line no-console */
// console.log('Hello world')

// const routes = require('./src/api')

// console.log(routes)

// const post = {
//   id: 1,
//   age: 15,
// }
// const content = {
//   post,
// }
// /* eslint-disable-next-line no-console */
// console.log(content)

// console.log(JSON.stringify(content))

// async function main() {}

// const main = function () {
//   return new promises((resolve, reject) => {
//     setTimeout(param => {
//       if (param) resolve('goog')
//       else reject('no')
//     })
//   })
// }

// const main2 = async () => {
//   const post = {}
//   post.age = 15
//   post.name = 'hyunseo'
//   /* eslint-disable-next-line no-console */
//   console.log(post)
//   return post
// }

// const main3 = async () => {
//   const post = {}
//   post.age = 17
//   post.name = 'egoing'
//   /* eslint-disable-next-line no-console */
//   console.log(post)
//   return post
// }

// const main4 = async () => {
//   await main2()
//   const hello = await new Promise(resolve => {
//     setTimeout(() => {
//       /* eslint-disable-next-line no-console */
//       console.log('hello')
//       resolve('hello')
//     }, 5000)
//   })

//   /* eslint-disable-next-line no-console */
//   console.log(hello)

//   const hello2 = await new Promise(resolve => {
//     setTimeout(() => {
//       /* eslint-disable-next-line no-console */
//       console.log('hello')
//       resolve('hello')
//     }, 5000)
//   })

//   /* eslint-disable-next-line no-console */
//   console.log(hello2)

//   await main3()
// }

// main4()

// const { animals } = require('./src/animal')

// console.log(animals)

// CommonJS : require
// ECMAScript : import, export

// const animalsA = require('./src/node_modules/animal.js')
// const animalsB = require('./src/node_modules/animal.js')
// const animalsC = require('./src/node_modules/animal.js')

// console.log(animalsA === animalsB)
// console.log(animalsA === animalsC)

/* eslint-disable */
// const animals = require('animal')
// console.log(animals)

// CommonJS: require
// - node standard library에 있는 모듈은 절대경로를 가져온다.
// - 이 프로젝트 내의 다른 파일은 상대경로를 지정줘야 한다.
// - 절대경로를 지정하면 module.paths의 경로들을 순서대로 검사하여 해당 모듈이 있는지 검사 하고 첫 번째 것을 가져온다.

const { paths } = module
console.log(paths)

const animals = require('animal')
console.log(animals)
