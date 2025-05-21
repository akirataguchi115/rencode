"use strict";

// Create the context menu
browser.contextMenus.create({
  id: "convertToMP4",
  title: "Convert to MP4",
  contexts: ["video"]
});

// Handle context menu click
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertToMP4" && info.srcUrl) {
      // Open a small popup that will handle the video processing
      browser.browserAction.openPopup();

      // Send the video URL to the popup for processing
      browser.tabs.create({
          url: browser.runtime.getURL("empty.html")
      }, (newTab) => {
          browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
              if (tabId === newTab.id && changeInfo.status === "complete") {
                  // Send the video URL to the popup when it's ready
                  browser.tabs.sendMessage(tabId, { action: "processVideo", videoUrl: info.srcUrl });
                  browser.tabs.onUpdated.removeListener(listener);
              }
          });
      });
  }
});

// Listen for the download message from the popup
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "downloadVideo" && message.url) {
      console.log("Attempting to download:", message.url);

      // Trigger the download from the background script
      browser.downloads.download({
          url: message.url,
          filename: message.filename,
          saveAs: true
      });
  }
});
