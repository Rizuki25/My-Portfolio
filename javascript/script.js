document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const copyButton = document.querySelector(".copy-email");

  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuButton?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  copyButton?.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      copyButton.textContent = "Email copied ✓";
      window.setTimeout(() => { copyButton.textContent = email; }, 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
});
