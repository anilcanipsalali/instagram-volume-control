function applyVolumeToVideos(volume) {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.volume = volume / 2;
    video._volumeControlled = true;
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_VOLUME") {
    const newVolume = message.volume;
    applyVolumeToVideos(newVolume);
    console.log("Volume updated to:", newVolume);
    sendResponse({ success: true });
  }
});

function initializeVolumeControl() {
  chrome.runtime.sendMessage({ type: "GET_VOLUME" }, (response) => {
    const volume = response.volume;
    applyVolumeToVideos(volume);
  });
}

window.addEventListener("load", initializeVolumeControl);