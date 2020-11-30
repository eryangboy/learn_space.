// Promise 是一个类，需要传递一个执行器，它有两个参数，一个是resolve，一个是reject，执行器自动执行
// 有三种状态，等待 pending，成功 fulfilled，失败 rejected
// resolve用来改变成功的状态，reject用来改变失败的状态，状态确定成功后不可以再更改
// pending => fulfilled , pending => rejected
// then用来判断状态，如果成功，调用成功后的函数，如果失败，调用失败后的函数
// then可以反复多次调用，如果是同步，可以依次执行。如果是异步，需要把返回的回调函数保存起来，再依次执行
// then可以链式调用并且返回上个函数的返回值，那么就需要返回一个promise对象
// 如果then返回了自己，则报错
// 异常处理
// then方法参数变为可选

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(actuator) {
    try {
      actuator(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }

    // 为什么变量定义在这里不可以改变？？
    // this.state = PENDING;
    // this.value = undefined;
    // this.reason = undefined;
  }

  // 状态
  state = PENDING;
  // 成功后的值
  value = undefined;
  // 失败后的原因
  reason = undefined;
  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = (value) => {
    // 状态改变后就不再执行
    if (this.state != PENDING) return;
    // 改变成功后的状态
    this.state = FULFILLED;
    // 保存成功后的值
    this.value = value;
    // 判断成功回调是否存在，如果存在直接调用
    // this.successCallback && this.successCallback(this.value);
    while (this.successCallback.length !== 0) this.successCallback.shift()();
  };

  reject = (reason) => {
    // 状态改变后就不再执行
    if (this.state != PENDING) return;
    // 改变失败后的状态
    this.state = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // 判断失败回调是否存在，如果存在直接调用
    // this.failCallback && this.failCallback(this.reason);
    while (this.failCallback.length !== 0) this.failCallback.shift()();
  };

  then = (successCallback, failCallback) => {
    // then方法的参数变为可选
    successCallback = successCallback ? successCallback : (value) => value;
    failCallback = failCallback ? failCallback : (reason) => reason;

    let promise2 = new MyPromise((resolve, reject) => {
      // 立即执行
      if (this.state === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value); // 成功回调的返回值
            // 判断x是普通值还是promise对象
            // 如果是值，直接返回resolve(x)
            // 如果是promise对象，查看promise对象返回的结果
            // 如果是成功，调用resolve，如果是失败，调用reject

            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason); // 成功回调的返回值
            // 判断x是普通值还是promise对象
            // 如果是值，直接返回resolve(x)
            // 如果是promise对象，查看promise对象返回的结果
            // 如果是成功，调用resolve，如果是失败，调用reject

            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else {
        // 等待状态
        // 将成功回调和失败回调保存起来
        // 处理异步
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value); // 成功回调的返回值
              // 判断x是普通值还是promise对象
              // 如果是值，直接返回resolve(x)
              // 如果是promise对象，查看promise对象返回的结果
              // 如果是成功，调用resolve，如果是失败，调用reject

              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason); // 成功回调的返回值
              // 判断x是普通值还是promise对象
              // 如果是值，直接返回resolve(x)
              // 如果是promise对象，查看promise对象返回的结果
              // 如果是成功，调用resolve，如果是失败，调用reject

              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  };

  // 无论成功失败，都会执行
  // 接受一个回调参数
  // 链式调用then方法
  finally = (callback) => {
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  };

  catch = (failCallback) => {
    return this.then(undefined, failCallback);
  };

  // 解决异步并发问题
  // 静态方法
  // 参数是一个数组
  // 按顺序输出
  // 返回一个promise对象
  // 如果是普通值，直接返回普通值
  // 如果是promise对象，先执行promise，再返回值
  static all(array) {
    let result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        result[key] = value;
        index++;
        if (index === array.length) {
          //保证每一项都执行完
          resolve(result);
        }
      }
      for (let i = 0; i < array.length; i++) {
        let current = array[i];
        if (current instanceof MyPromise) {
          // promise对象
          current.then(
            (value) => {
              addData(i, value);
            },
            (reason) => {
              reject(reason);
            }
          );
        } else {
          // 普通值
          addData(i, current);
        }
      }
    });
  }

  // 静态方法
  // 返回一个promise对象
  // 接受一个普通值或者是promise对象
  // 如果是普通值，创建一个promise对象，并返回
  // 如果是promise对象，直接返回
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve) => {
      resolve(value);
    });
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new Error("error"));
  }
  if (x instanceof MyPromise) {
    // promise对象
    x.then(resolve, reject);
  } else {
    // 普通值
    resolve(x);
  }
}

module.exports = MyPromise;
