document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("volumeSlider");
  const label = document.getElementById("volumeLabel");

  chrome.runtime.sendMessage({ type: "GET_VOLUME" }, (response) => {
    const volume = response.volume;
    slider.value = volume;
    label.textContent = `${Math.round(volume * 100)}%`;
  });

  slider.addEventListener("input", (event) => {
    const volume = parseFloat(event.target.value);
    label.textContent = `${Math.round(volume * 100)}%`;

    chrome.runtime.sendMessage({ type: "SET_VOLUME", volume }, (response) => {
      if (response.success) {
        console.log("Volume updated in storage.");
      }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "UPDATE_VOLUME", volume },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message to content script:", chrome.runtime.lastError.message);
            } else {
              console.log("Volume updated:", response?.success);
            }
          }
        );
      }
    });
  });
});