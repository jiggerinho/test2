var isEnabled = false;
var tabIds = [];

chrome.browserAction.onClicked.addListener(function(tab) {
  isEnabled = !isEnabled;
  updateBrowserActionIcon();
  sendMessageToTabs();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.getEnabled) {
    sendResponse({ enabled: isEnabled });
  } else if (request.enable !== undefined) {
    isEnabled = request.enable;
    updateBrowserActionIcon();
    sendResponse();
  } else if (request.registerTab) {
    if (!tabIds.includes(sender.tab.id)) {
      tabIds.push(sender.tab.id);
    }
  } else if (request.unregisterTab) {
    var index = tabIds.indexOf(sender.tab.id);
    if (index !== -1) {
      tabIds.splice(index, 1);
    }
  } else if (request.triggerKey) {
    triggerKeyPress();
  }
});

function updateBrowserActionIcon() {
  var iconPath = isEnabled ? {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  } : {
    "16": "icon16-disabled.png",
    "48": "icon48-disabled.png",
    "128": "icon128-disabled.png"
  };

  chrome.browserAction.setIcon({ path: iconPath });
}

function sendMessageToTabs() {
  for (var i = 0; i < tabIds.length; i++) {
    var tabId = tabIds[i];
    chrome.tabs.sendMessage(tabId, { simulateKey: isEnabled });
  }
}

function triggerKeyPress() {
  chrome.tabs.query({ url: "https://nbk.io/*" }, function(tabs) {
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      chrome.tabs.sendMessage(tab.id, { triggerKey: true });
    }
  });
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
  var tabId = activeInfo.tabId;
  if (tabIds.includes(tabId)) {
    chrome.tabs.sendMessage(tabId, { simulateKey: isEnabled });
  }
});
