const { fetchFile, toBlobURL } = FFmpegUtil;
const { FFmpeg } = FFmpegWASM;
let ffmpeg = null;

const transcode = async (videoUrl) => {
  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    })
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    try {
      console.log('Starting to load FFmpeg...');
      // Add debugging logs for the URLs being passed to toBlobURL
      const coreURL = 'lib/ffmpeg-core.js';
      const wasmURL = 'lib/ffmpeg-core.wasm';
      console.log('Core URL:', coreURL);
      console.log('WASM URL:', wasmURL);

      // toBlobURL is used to bypass CORS issue, urls with the same domain can be used directly.
      await ffmpeg.load({
        coreURL: await toBlobURL(coreURL, 'text/javascript'),
        wasmURL: await toBlobURL(wasmURL, 'application/wasm'),
      });

      console.log('FFmpeg loaded successfully.');
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
    }
  }

  await ffmpeg.writeFile('input.mp4', await fetchFile(videoUrl));
  await ffmpeg.exec(['-i', 'input.mp4', 'output.mp4']);
  const data = await ffmpeg.readFile('output.mp4');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
  a.download = fileName;
  a.click();
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "processVideo" && message.videoUrl) {
    const videoUrl = message.videoUrl;
    console.log(videoUrl);
    transcode(videoUrl);
    sendResponse({ status: "Processing video..." });
  }
  return true; // Ensures sendResponse works asynchronously
});
