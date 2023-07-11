// Listen for requests to trigger the 'k' key press
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.triggerKey) {
    triggerKeyPress();
  }
});

// Trigger the 'k' key press on all active nbk.io tabs
function triggerKeyPress() {
  chrome.tabs.query({ url: 'https://nbk.io/*' }, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.executeScript(tab.id, { code: 'window.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));' });
    });
  });
}
