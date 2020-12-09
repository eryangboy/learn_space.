
class Animal {
  protected eat(): void {
    console.log("eat")
  }
}

class Dog extends Animal {
  run() {
    console.log('run')
  }
}

const dog = new Dog()

dog.eat()
dog.run()