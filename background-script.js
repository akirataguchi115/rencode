"use strict";

function onError(error) {
  console.error(`Error: ${error}`);
}

browser.contextMenus.create({
  id: "encode-video",
  title: "Encode to H.264 and save",
  contexts: ["video"],
});

function sendMessageToTabs(tabs) {
  for (const tab of tabs) {
    browser.tabs
      .sendMessage(tab.id, { greeting: "Hi from background script" })
      .then((response) => {
        console.log("Message from the content script:");
        console.log(response.response);
      })
      .catch(onError);
  }
}

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "encode-video") {
    console.log("Sending encode request:", info.srcUrl);
    sendMessageToTabs()
  }
});
