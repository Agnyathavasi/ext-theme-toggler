function applyDarkMode() {
  // Apply filter to entire body
  document.body.style.filter = "invert(1) hue-rotate(180deg)";

  const style = document.createElement("style");
  style.textContent = `
  body.dark-mode-exempt {
    filter: none !important;
  }
  
  .dark-mode-exempt, 
  .dark-mode-exempt * {
    filter: none !important;
  }
  
  img, video, canvas, iframe, svg {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;
  document.head.appendChild(style);
}

function removeDarkMode() {
  // Remove all filters
  document.body.style.filter = "";

  const mediaElements = document.querySelectorAll(
    "img, video, canvas, iframe, svg"
  );
  mediaElements.forEach((el) => {
    el.style.filter = "";
  });
}

function checkAndApplyDarkMode() {
  const key = location.hostname;
  chrome.storage.local.get([key], (result) => {
    const enabled = result[key];
    if (enabled) applyDarkMode();
    else removeDarkMode();
  });
}

// Run once on load
checkAndApplyDarkMode();

// Detect SPA route changes
const pushState = history.pushState;
history.pushState = function () {
  pushState.apply(history, arguments);
  setTimeout(checkAndApplyDarkMode, 200);
};

const replaceState = history.replaceState;
history.replaceState = function () {
  replaceState.apply(history, arguments);
  setTimeout(checkAndApplyDarkMode, 200);
};

// Listen to back/forward
window.addEventListener("popstate", () => {
  setTimeout(checkAndApplyDarkMode, 200);
});

new MutationObserver(checkAndApplyDarkMode).observe(document.body, {
  childList: true,
  subtree: true,
});
