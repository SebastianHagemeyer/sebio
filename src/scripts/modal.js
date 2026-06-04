// Shared accessible image-lightbox modal.
// Used by any page that includes the modal partial (#modal / #modalImg) and
// triggers it via onclick="openModal(this)" on a thumbnail <img>.
(function () {
  let lastFocused = null;

  function getModal() {
    return document.getElementById("modal");
  }

  function onKeydown(e) {
    const modal = getModal();
    if (!modal) return;
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "Tab") {
      // Single focusable control (the close button) — trap focus on it.
      const closeBtn = modal.querySelector(".close");
      if (closeBtn) {
        e.preventDefault();
        closeBtn.focus();
      }
    }
  }

  function openModal(img) {
    const modal = getModal();
    const modalImg = document.getElementById("modalImg");
    if (!modal || !modalImg) return;
    lastFocused = document.activeElement;
    modalImg.src = img.src;
    modalImg.alt = img.alt || "Enlarged view";
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    const closeBtn = modal.querySelector(".close");
    if (closeBtn) closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    const modal = getModal();
    if (!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // Exposed for the inline onclick handlers in the markup.
  window.openModal = openModal;
  window.closeModal = closeModal;
})();
