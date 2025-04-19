// nothing here is working, was trying out some things
chrome.webRequest.onCompleted.addListener(
  async (details) => {
    console.log("Network request completed:", details);
    // Filter for specific requests
    if (details.url.includes('learner/v17/courses')) {
      // Send to content script
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        console.log("Sending message to content script:", details);
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'NETWORK_REQUEST',
          url: details.url,
          status: details.statusCode
        });
      });
    }
  },
  {urls: ['*://api.learnyst.com/*']}
);

// Listen for external events
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "UPDATE_POPUP") {
    // Broadcast to all popups (if multiple are open)
    chrome.runtime.sendMessage({ 
      type: "UPDATE_INPUT", 
      value: request.value 
    });
  }
});