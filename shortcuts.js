class Settings {
  playbackRate = localStorage.getItem("playbackRate") || 2.0;

  setVideoPlaybackRate(rate) {
    const video = document.querySelector("video");
    console.log({ video, rate });
    if (rate || rate === 0 || rate !== this.playbackRate) {
      this.playbackRate = rate;
      localStorage.setItem("playbackRate", rate);
    }
    if (video) {
      video.playbackRate = this.playbackRate;
    }
  }
}

export const settingsClient = new Settings();