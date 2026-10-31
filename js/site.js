(() => {
  "use strict";

  const copyButtons = document.querySelectorAll("[data-copy-value]");
  const status = document.querySelector(".copy-status");

  const announce = (message) => {
    if (!status) {
      return;
    }

    status.textContent = "";
    window.requestAnimationFrame(() => {
      status.textContent = message;
    });
  };

  const copyWithFallback = (value) => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");
    textarea.remove();

    return copied;
  };

  const selectContactText = (button) => {
    const contactLink = button
      .closest(".contact-method")
      ?.querySelector("[data-contact-text]");

    if (!contactLink) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(contactLink);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copyValue;

      if (!value) {
        return;
      }

      const isPhone = /^[+\d]+$/.test(value);
      const successMessage = isPhone ? "已复制电话号码" : "已复制邮箱地址";
      let copied = false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          copied = true;
        } else {
          copied = copyWithFallback(value);
        }
      } catch {
        copied = copyWithFallback(value);
      }

      if (copied) {
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "已复制");
        announce(successMessage);

        window.setTimeout(() => {
          button.classList.remove("is-copied");
          button.setAttribute(
            "aria-label",
            isPhone ? "复制电话号码" : "复制邮箱地址",
          );
        }, 2400);
      } else {
        selectContactText(button);
        announce("无法自动复制，请手动复制已选中的内容");
      }
    });
  });
})();
