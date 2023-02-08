const icons = {
  info: "fa-circle-info",
  success: "fa-circle-check",
  warning: "fa-triangle-exclamation",
};

const btnSuccess = document.querySelector(".btn.btn--success");
const btnWarning = document.querySelector(".btn.btn--warning");

// Toast message
function pushToastMessage({
  type = "info",
  title,
  description,
  duration = 3000,
}) {
  const toasts = document.getElementById("toasts");

  const toast = document.createElement("div");
  const timerId = setTimeout(() => {
    toasts.removeChild(toast);
  }, duration);

  toast.onclick = (e) => {
    const closeBtn = e.target.closest(".toast__close");
    if (closeBtn) {
      toasts.removeChild(toast);
      clearTimeout(timerId);
    }
  };

  toast.classList.add("toast", `toast--${type}`);
  const timeDuration = (duration / 1000).toFixed(2);
  toast.style.animation = `slideInLeft ease 0.3s, fadeOut linear ${timeDuration}s 0.3s forwards`;

  toast.innerHTML = `
        <div class="toast__border"></div>
        <div class="toast__icon">
            <i class="fa-solid ${icons[type]}"></i>
        </div>
        <div class="toast__info">
            <div class="toast__heading">
                ${title}
            </div>
            <div class="toast__description">
                ${description}
            </div>
        </div>
        <div class="toast__close">
            <i class="fa-solid fa-xmark"></i>
        </div>
  `;

  toasts.appendChild(toast);
}

btnWarning.onclick = function () {
  pushToastMessage({
    type: "success",
    title: "Success",
    description: "Đăng ký tài khoản thành công!",
    duration: 5000,
  });
};

btnSuccess.onclick = function () {
  pushToastMessage({
    type: "warning",
    title: "Warning",
    description: "Cẩn thận với thông tin này!",
    duration: 3000,
  });
};
