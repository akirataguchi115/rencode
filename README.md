ooh maybe migrate to typescript

this turns out to be pretty manual labor since wasm stuff can be very hard to get working and chadgpt has no idea / history on people getting it to work

https://i.ylilauta.org/15/0e/150e2dcac76c50d1.mp4

gifsane is a bad example cuz its a webapp rather than a browser extension

ok i have to use content script for ffmpeg since background script cannot do any heavy lifting

however i need background script for registering the contextmenu

immaculate i have almost managed to send a message from bg script to defined content script quick saving here

i dont think i still quite understand what the javascript first class citizen means. aren't all js variables first class citizens?

ok phew! next stop is to update ffmpeg.wasm to 12.x which has av1 decoder support. wild times!