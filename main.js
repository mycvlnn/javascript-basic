// Viết hàm sleep
const sleep = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

sleep(1000)
  .then(function () {
    console.log(1);
    return sleep(1000);
  })
  .then(function () {
    console.log(2);
    return sleep(1000);
  })
  .then(function () {
    console.log(3);
    return sleep(1000);
  })
  .then(function () {
    console.log(4);
    return sleep(1000);
  });
