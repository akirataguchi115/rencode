browser.contextMenus.create(
  {
    id: "log-selection",
    title: "Encode to H.264 and save",
    contexts: ["video"],
  });


  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "log-selection") {
      console.log('Video URL: ', info.srcUrl)
    }
});