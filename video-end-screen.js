(() => {
  const scriptUrl = document.currentScript && document.currentScript.src;
  if (!scriptUrl) {
    throw new Error("The MDPhy video end screen script must be loaded directly.");
  }

  const logoUrl = new URL("./MDPhy Tech Healthcare Logo.png", scriptUrl).href;
  const style = document.createElement("style");
  style.textContent = `
    .mdphy-video-branding {
      position: fixed;
      z-index: 2147483647;
      display: none;
      place-items: center;
      overflow: hidden;
      background: rgba(5, 18, 28, 0.78);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      pointer-events: none;
    }
    .mdphy-video-branding.is-visible {
      display: grid;
      animation: mdphy-video-branding 6s ease both;
    }
    .mdphy-video-branding.is-visible img {
      animation: mdphy-video-logo 6s ease both;
    }
    .mdphy-video-branding img {
      width: min(58%, 340px);
      max-height: 82%;
      padding: 8px;
      object-fit: contain;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }
    @keyframes mdphy-video-branding {
      0% { opacity: 0; }
      12%, 84% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes mdphy-video-logo {
      0% { opacity: 0; transform: scale(0.86); }
      12%, 84% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.03); }
    }
    @media (prefers-reduced-motion: reduce) {
      .mdphy-video-branding.is-visible,
      .mdphy-video-branding.is-visible img {
        animation: none;
      }
    }
  `;
  document.head.append(style);

  const endScreen = document.createElement("div");
  endScreen.className = "mdphy-video-branding";
  endScreen.setAttribute("role", "status");
  endScreen.setAttribute("aria-label", "MDPhy Tech video end screen");

  const logo = document.createElement("img");
  logo.src = logoUrl;
  logo.alt = "MDPhy Tech Healthcare";
  endScreen.append(logo);
  document.body.append(endScreen);

  let activeVideo = null;
  let hideTimeout = null;

  const hideEndScreen = () => {
    window.clearTimeout(hideTimeout);
    hideTimeout = null;
    activeVideo = null;
    endScreen.classList.remove("is-visible");
  };

  const positionEndScreen = () => {
    if (!activeVideo) {
      return false;
    }

    const bounds = activeVideo.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) {
      hideEndScreen();
      return false;
    }

    endScreen.style.left = `${bounds.left}px`;
    endScreen.style.top = `${bounds.top}px`;
    endScreen.style.width = `${bounds.width}px`;
    endScreen.style.height = `${bounds.height}px`;
    return true;
  };

  document.addEventListener(
    "ended",
    (event) => {
      if (!(event.target instanceof HTMLVideoElement)) {
        return;
      }

      window.clearTimeout(hideTimeout);
      activeVideo = event.target;
      if (!positionEndScreen()) {
        return;
      }

      endScreen.classList.remove("is-visible");
      void endScreen.offsetWidth;
      endScreen.classList.add("is-visible");
      hideTimeout = window.setTimeout(hideEndScreen, 6000);
    },
    true,
  );

  document.addEventListener(
    "play",
    (event) => {
      if (event.target instanceof HTMLVideoElement && event.target === activeVideo) {
        hideEndScreen();
      }
    },
    true,
  );

  window.addEventListener("resize", positionEndScreen);
  window.addEventListener("scroll", positionEndScreen, true);
})();
