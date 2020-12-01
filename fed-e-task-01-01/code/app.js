const MyPromise = require("./MyPromise");

let promise = new MyPromise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve("shibai");
  //   }, 2000);
  resolve(11);
});

function p1() {
  return new MyPromise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error(1));
    }, 2000);
  });
}
function p2() {
  return new MyPromise(function (resolve, reject) {
    // reject("失败");
    resolve("成功");
  });
}

promise
  .then(() => {
    console.log(111);
    return p1();
  })
  .catch((reason) => {
    console.log(reason);
  })
  .finally(() => {
    console.log("finally");
  });
