const courseApi = "http://localhost:3000/courses";
let courses = [];
let idCourseEdit = null;
const formCourse = document.forms["form-course"];
const titleForm = document.getElementById("title-form");
const btnForm = document.getElementById("btn-form");

function changeTitleForm() {
  const title = idCourseEdit ? "Edit course" : "Create course";
  const textBtn = idCourseEdit ? "Update" : "Create";

  titleForm.textContent = title;
  btnForm.textContent = textBtn;
}

const renderItemCourse = (item) => {
  const { name, image, id, description, coin } = item;

  return `
  <li class="course" data-course_id=${id}>
  <img class="course__img" src=${image} alt=${name}>
  <h3 class="course__name">${name}</h3>
  <p class="course__description">${description}</p>
  <div class="footer">
      <div class="course__price">${coin}$</div>
      <div class="controls">
          <button class="control__btn" onclick="editCourse(${id})">
              Edit
          </button>
          <button class="control__btn" onclick="handleDeleteCourse(${id})">
              Delete
          </button>
      </div>

  </div>

</li>
  `;
};

function handleDeleteCourse(idCourse) {
  console.log(idCourse);

  const URL = `${courseApi}/${idCourse}`;
  var requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };

  fetch(URL, requestOptions)
    .then((response) => {
      if (response.ok) {
        courses = courses.filter((item) => item.id !== idCourse);
        renderListCoures(courses);
      }
    })
    .catch((error) => alert("Error. Something went wrong!"));
}

function handleCreateCourse(item) {
  const { name, image, description, coin } = item;

  var raw = JSON.stringify({
    name,
    coin,
    description,
    image,
  });

  fetch(courseApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: raw,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      courses.unshift(data);
      renderListCoures(courses);
      resetValueInput();
    });
}

function editCourse(idCourse) {
  const course = courses.find((item) => item.id === idCourse);
  const inputs = formCourse;
  for (let input of inputs) {
    if (input.nodeName === "INPUT") {
      const { name } = input;
      input.value = course[name];
    }
  }
  idCourseEdit = idCourse;
  changeTitleForm();
}

function handleEditCourse(dataEdit) {
  const URL = `${courseApi}/${idCourseEdit}`;
  const index = courses.findIndex((item) => item.id === idCourseEdit);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(dataEdit);

  var requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      courses.splice(index, 1, result);
      renderListCoures(courses);
      idCourseEdit = null;
      resetValueInput();
      changeTitleForm();
    })
    .catch((error) => alert("Error. Something went wrong"));
}

function resetValueInput() {
  const inputs = formCourse;
  for (let input of inputs) {
    if (input.nodeName === "INPUT") {
      input.value = "";
    }
  }
}

const renderListCoures = (courses = []) => {
  const boxCourses = document.getElementById("product-list");

  const htmls = courses.map((item) => {
    return renderItemCourse(item);
  });

  const html = htmls.join("");
  boxCourses.innerHTML = html;
};

function startApp() {
  fetch(courseApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      courses = data;
      renderListCoures(data);
    });
}

// Event

// 1. Submit form

formCourse.onsubmit = function (e) {
  e.preventDefault();
  const inputs = e.target;
  const data = {};
  let isValid = true;
  for (let input of inputs) {
    if (input.nodeName === "INPUT") {
      const { name, value } = input;
      if (!value) {
        isValid = false;
        break;
      }

      data[name] = value;
    }
  }

  if (isValid) {
    if (idCourseEdit) {
      handleEditCourse(data);
      return;
    }
    handleCreateCourse(data);
  } else {
    alert("Vui long nhap day du thong tin");
  }
};

startApp();
