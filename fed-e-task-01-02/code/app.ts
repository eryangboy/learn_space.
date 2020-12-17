/*
 * @Author: your name
 * @Date: 2020-12-01 22:17:36
 * @LastEditTime: 2020-12-09 20:58:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /learn_space/fed-e-task-01-02/code/app.ts
 */

class Animal {
  protected eat(): void {
    console.log("eat")
  }
}

/**
 * @description: 
 * @param {*}
 * @return {*}
 */

class Dog extends Animal {
  run() {
    console.log('run')
  }
}

const dog = new Dog()

dog.eat()
dog.run()