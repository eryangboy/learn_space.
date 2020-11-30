setTimeout(function () {
  var a = "hello";
  setTimeout(function () {
    var b = "lagou";
    setTimeout(function () {
      var c = "I ❤️ U";
      console.log(a + b + c);
    }, 10);
  }, 10);
}, 10);

const getString = (value) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, 10);
  });
};

getString("hello")
  .then((value) => {
    return getString(value + "lagou");
  })
  .then((value) => {
    return getString(value + "I ❤️ U");
  })
  .then((value) => {
    console.log(value);
  });
