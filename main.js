const postApi = "http://localhost:3000/courses";

fetch(postApi)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log({ data });
  });
