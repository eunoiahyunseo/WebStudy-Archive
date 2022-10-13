const promise = "lodash";

// const returnPromise = () => {
//   return promise.then((value) => {
//     const { default: _ } = value;
//     const stringData = _.join(["Hello", "World!"], " ");
//     // console.log(stringData);
//     return stringData;
//   });
// };

(() => {
  const module = await import(promise);
  const { default: _ } = module;
  const stringData = _.join(["Hello", "World!"], " ");
  return stringData;
})().then((value) => console.log(value));
