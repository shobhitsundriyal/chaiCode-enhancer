(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log({message, sender, sendResponse});
  })
})()


class Settings {
  constructor() {
    
    const playbackRate = chrome.storage.local.get("playbackRate").then((data) => {
      const numPlaybackRate = Number(data.playbackRate)
      this.playbackRate = numPlaybackRate ? numPlaybackRate : 2.0;
    });
    this.isPlaybackRateSet = false;
  }

  async updatePlaybackRate(newRate) {
    console.log('update pb rate')
    this.setVideoPlaybackRate(newRate);
    console.log('update pb rate')
  }

  async setVideoPlaybackRate(rate) {
    const video = document.querySelector("video");
    // console.log(video, this.isPlaybackRateSet, rate, this.playbackRate)
    if (rate && rate !== 0 && rate !== this.playbackRate) {
      this.playbackRate = rate;
      await chrome.storage.local.set({"playbackRate": rate});
      this.isPlaybackRateSet = false;
    }
    if (!this.isPlaybackRateSet && video) {
      console.log("Playback rate set to:", this.playbackRate, this);
      video.playbackRate = this.playbackRate;
      this.isPlaybackRateSet = true;
    }
  }
}

const settingsClient = new Settings();
console.log({settingsClient}, 'jabaa');

let userInteracted = false;

//functions
const toggleVideoFullscreen = () => {
  const video = document.querySelector("video");
  // native version raw
  // if (video) {
  //   if (document.fullscreenElement) {
  //     document.exitFullscreen();
  //   } else {
  //     video.requestFullscreen();
  //   }
  // }
  // custom version
  if (video) {
    if (document.fullscreenElement) {
      const exitFullSreenButton = document.querySelector('.player-fullscreen-exit');
      exitFullSreenButton.click();
      setTimeout(() => {
        document.fullscreenElement && exitFullSreenButton.click();
      }, 100);
    } else {
      const fullSreenButton = document.querySelector('.player-fullscreen');
      fullSreenButton.click();
      setTimeout(() => {
        !document.fullscreenElement && fullSreenButton.click();
      }, 100);
    }
  }
};
const toggleMute = () => {
  const video = document.querySelector("video");
  video.muted = (!video.muted)
}
const updatePlaybackRate = (e) => {
  e.preventDefault();
  console.log("Update playback rate:", e);
  // settingsClient.updatePlaybackRate(rate);
}

//events
document.addEventListener("click", () => {
  settingsClient.setVideoPlaybackRate();
});
document.addEventListener('keydown', (event) => {
  // Check for 'f' regardless of case, without modifier keys
  if (event.key.toLowerCase() === 'f' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    toggleVideoFullscreen();
  } 
})
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'm' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    toggleMute();
  } 
})
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 's' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    //apply default playback speed
    settingsClient.setVideoPlaybackRate();
  } 
})


// Start observing the entire document
const element = document.getElementById("__next");
console.log(element)
observer.observe(element, {
  childList: true,
  subtree: true
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("some mesg", {request})
  if (request.action === 'updatePlaybackRate') {
    settingsClient.setVideoPlaybackRate(Number(request.playbackRate))
    sendResponse({success: true});
    return true; // Required to use sendResponse asynchronously
  }
});
