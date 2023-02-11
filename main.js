// TYPE JS HERE

function Validator(options) {
  const { formGroupSelector, errorSelector, formID, onSubmit } = options;
  const formElement = document.querySelector(formID);
  const rulesSelector = {}; // Lưu trữ các rule đường truyền vào thông qua đối số

  // Lấy ra parent element của input
  const getParentElement = (inputElement) => {
    const parentElement = inputElement.closest(formGroupSelector);

    return parentElement;
  };

  // Hàm xử lý validate
  function validate(inputElement, rule) {
    const parentElement = getParentElement(inputElement);
    const errorElement = parentElement.querySelector(errorSelector);
    const value = inputElement.value;

    let error = "";
    const rules = rulesSelector[rule.selector];

    for (let i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          const inputChecked = formElement.querySelector(
            `${rule.selector}:checked`
          );
          error = rules[i](!!inputChecked);

          break;
        default:
          error = rules[i](value, formElement);
      }

      if (error) break;
    }

    if (error) {
      errorElement.textContent = error;
      parentElement.classList.add("invalid");
    } else {
      errorElement.textContent = "";
      parentElement.classList.remove("invalid");
    }

    return error;
  }

  // Hàm xử lý xoá lỗi
  function clearError(inputElement) {
    const parentElement = getParentElement(inputElement);
    const errorElement = parentElement.querySelector(errorSelector);

    errorElement.textContent = "";
    parentElement.classList.remove("invalid");
  }

  // Thực hiện lưu các rule
  function saveRules(rule) {
    if (Array.isArray(rulesSelector[rule.selector])) {
      rulesSelector[rule.selector].push(rule.test);
    } else {
      rulesSelector[rule.selector] = [rule.test];
    }
  }

  if (formElement) {
    options.rules.forEach(function (rule) {
      saveRules(rule);

      const inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach((inputElement) => {
        //  Event khi người dùng blur
        inputElement.onblur = function (e) {
          validate(e.target, rule);
        };

        //  Event khi người dùng change input => clear message lỗi đi
        inputElement.oninput = function (e) {
          clearError(e.target);
        };
      });
    });

    //  Event khi người dùng bấm submit
    formElement.onsubmit = function (e) {
      e.preventDefault();
      let isValid = true;
      const inputs = formElement.querySelectorAll("[name]");
      options.rules.forEach(function (rule) {
        const input = formElement.querySelector(rule.selector);
        const error = validate(input, rule);
        if (error) isValid = false;
      });

      if (isValid) {
        const data = Array.from(inputs).reduce((values, input) => {
          switch (input.type) {
            case "radio": {
              if (input.matches(":checked")) {
                values[input.name] = input.value;
              }

              return values;
            }

            case "checkbox": {
              if (!Array.isArray(values[input.name])) {
                values[input.name] = [];
              }
              if (input.matches(":checked")) {
                values[input.name].push(input.value);
              }
              break;
            }

            default:
              values[input.name] = input.value;
              break;
          }

          return values;
        }, {});
        onSubmit(data);
      }
    };
  }
}

// Định nghĩa các rules
// Nếu trong trường hợp có lỗi => return lỗi
// Ngược lại không lỗi => return undefined
Validator.isRequired = function (selector, message = "This field is required") {
  return {
    selector,
    test: function (value) {
      if (value === true) return undefined;

      const valueUpdated = value || "";

      return valueUpdated.trim() ? undefined : message;
    },
  };
};

Validator.isEmail = function (
  selector,
  message = "This field must be an email!"
) {
  return {
    selector,
    test: function (value) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      return regexEmail.test(value) ? undefined : message;
    },
  };
};

Validator.isMin = function (selector, min, message = "This field is required") {
  return {
    selector,
    test: function (value) {
      return value.trim().length >= min ? undefined : message;
    },
  };
};

Validator.isConfirmed = function (
  selector,
  refSelector,
  message = "Value do not match."
) {
  return {
    selector,
    test: function (value, formElement) {
      const refValue = formElement.querySelector(refSelector).value;

      return value === refValue ? undefined : message;
    },
  };
};
