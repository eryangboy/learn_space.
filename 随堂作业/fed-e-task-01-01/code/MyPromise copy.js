/*
   1.Promise是一个类，需要一个执行器，执行器是一个函数，有两个参数：一个是resolve，一个是reject，执行器自动执行
   2.有三种状态 pending：等待，fulfilled：成功，rejected：失败，一旦确定状态就不可以更改
   resolve： pending => fulfilled
   reject：pending => rejected
   3.then是用来改变状态的，succesCallback用来返回成功的值，failCallback用来返回失败后的原因
  


*/

const PENDING = "pending"; // 等待
const FULFILLED = "fulfilled"; // 成功
const REJECTED = "rejected"; // 失败

class MyPromise {
  constructor(actuator) {
    // 执行器
    actuator(this.resolve, this.reject);

    // 为什么变量定义在这里不可以改变？？
    // this.state = PENDING;
    // this.value = undefined;
    // this.reason = undefined;
  }

  state = PENDING; // promise的状态
  value = undefined; // 成功后的值
  reason = undefined; // 失败后的原因

  resolve = (value) => {
    if (this.state != PENDING) return;
    // pending => fulfilled
    // 状态改为成功
    this.state = FULFILLED;
    // 保存成功后的值
    this.value = value;
  };

  reject = (reason) => {
    if (this.state != PENDING) return;
    // pending => rejected
    // 状态改为失败
    this.state = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
  };

  then = (successCallback, failCallback) => {
    if (this.state === FULFILLED) {
      successCallback(this.value);
    } else if (this.state === REJECTED) {
      failCallback(this.reason);
    }
  };
}

module.exports = MyPromise;
