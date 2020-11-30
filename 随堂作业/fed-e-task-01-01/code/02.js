const { result } = require("lodash");
const fp = require("lodash/fp");

const cars = [
  { name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true },
  {
    name: "Spyker C12 Zagato",
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false,
  },
  {
    name: "Jaguar XKR-S",
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false,
  },
  { name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false },
  {
    name: "Aston Martin One-77",
    horsepower: 750,
    dollar_value: 185000,
    in_stock: true,
  },
  {
    name: "Pagani Huayra",
    horsepower: 700,
    dollar_value: 130000,
    in_stock: false,
  },
];

// 练习1：使用组合函数 fp.flowRight() 重新实现下面这个函数

let isLastInStock = fp.flowRight(fp.prop("in_stock"), fp.last);
let result1 = isLastInStock(cars);
console.log("value-------->练习一", result1);

// 练习2：使用 fp.flowRight()、fp.prop() 和 fp.first() 获取第一个 car 的 name

let isFirstName = fp.flowRight(fp.prop("name"), fp.first);
let result2 = isFirstName(cars);
console.log("value-------->练习二", result2);

// 练习3：使用帮助函数 _average 重构 averageDollarValue，使用函数组合的方式实现

let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length;
};

let isDollarValue = (value) => value.dollar_value;
// let averageDollarValue = fp.flowRight(_average, fp.map(fp.prop('dollar_value')));
let averageDollarValue = fp.flowRight(_average, fp.map(isDollarValue));
let result3 = averageDollarValue(cars);
console.log("value-------->练习三", result3);

// 练习4：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连续的小写字符串，把数组中的 name 转换为这种形式，例如：sanitizeNames(["Hello World"]) => ["hello_world"]
let _underscore = fp.replace(/\W+/g, "_");
let isName = (value) => value.name;
let sanitizeNames = fp.map(fp.flowRight(_underscore, fp.lowerCase, isName));
let result4 = sanitizeNames(cars);
console.log("value-------->练习四", result4);
