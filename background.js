chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_VOLUME") {
    chrome.storage.sync.get(["volume"], (result) => {
      sendResponse({ volume: result.volume || 0.03 });
    });
    return true;
  }

  if (message.type === "SET_VOLUME") {
    chrome.storage.sync.set({ volume: message.volume }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.volume) {
    chrome.tabs.query({ url: "https://www.instagram.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: "UPDATE_VOLUME",
            volume: changes.volume.newValue,
          });
        }
      });
    });
  }
});