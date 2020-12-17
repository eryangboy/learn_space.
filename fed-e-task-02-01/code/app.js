const obj = {};

Reflect.defineProperty(obj, "now", {
  value: 1,
  writable: true,
  enumerable: true,
  configurable: true,
});

console.log(Reflect.ownKeys(obj));
