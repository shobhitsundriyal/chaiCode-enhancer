// This runs every time the popup opens
document.addEventListener('DOMContentLoaded', async () => {
  // Get the input element
  const inputElement = document.querySelector('#playbackSpeedInput');
  const saveButton = document.getElementById('setPlaybackSpeedBtn');
  
  inputElement.value = (await chrome.storage.local.get("playbackRate")).playbackRate ?? 1.0
  saveButton.addEventListener('click', () => {
    const message = {
      action: 'updatePlaybackRate',
      playbackRate: inputElement.value
    };

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          console.log('Received response:', response);
        });
      }
    });
  })
    
  console.log('Popup opened!');
  
  inputElement.focus();
});