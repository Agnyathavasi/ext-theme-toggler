document.getElementById("toggle").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const key = new URL(tab.url).hostname;

  chrome.storage.local.get([key], (result) => {
    const enabled = result[key];
    const newState = !enabled;

    // Update storage
    chrome.storage.local.set({ [key]: newState }, () => {
      // Reload to apply all changes properly
      chrome.tabs.reload(tab.id);
    });
  });
});
