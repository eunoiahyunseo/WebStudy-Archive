// (async () => {
//   const module = await import("lodash");
//   const { default: _ } = module;

//   const element = document.createElement("div");
//   element.innerHTML = _.join(["Hello", "webpack"], " ");

//   document.appendChild(element);
// })();

(async () => {
  const element = document.createElement("div");
  element.innerHTML = "Hello world!";
  document.body.appendChild(element);
})();
