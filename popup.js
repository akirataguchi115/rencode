"use strict";

const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
    corePath: browser.runtime.getURL("lib/ffmpeg-core.js"),
    log: true,
    mainName: 'main'
});

async function runFFmpeg(inputFileName, outputFileName, commandStr, videoUrl) {
    // If FFmpeg is already loaded, exit and reload it to ensure a fresh session
    if (ffmpeg.isLoaded()) {
        await ffmpeg.exit();
    }

    // Load FFmpeg.wasm
    await ffmpeg.load();

    // Command should start with "ffmpeg"
    const commandList = commandStr.split(' ');
    if (commandList.shift() !== 'ffmpeg') {
        alert('Please start with ffmpeg');
        return;
    }

    // Fetch the video directly from the URL as a Blob
    try {
        const response = await fetch(videoUrl);
        const videoBlob = await response.blob(); // This gives us the video file as a Blob

        console.log("Video fetched successfully:", videoBlob);

        // Write the input file to the FFmpeg virtual file system
        ffmpeg.FS('writeFile', inputFileName, new Uint8Array(await videoBlob.arrayBuffer()));

        // Run the conversion command
        await ffmpeg.run(...commandList);

        // Read the output file from the FFmpeg virtual file system
        const data = ffmpeg.FS('readFile', outputFileName);

        // Create a Blob from the output data buffer and prepare it for download
        const outputBlob = new Blob([data.buffer], { type: "video/mp4" });
        downloadFile(outputBlob, outputFileName);
    } catch (error) {
        console.error("Error fetching video:", error);
    }
}

function downloadFile(blob, fileName) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "processVideo" && message.videoUrl) {
        const videoUrl = message.videoUrl;

        // Extract the file name from the video URL
        const inputFileName = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);  // Extract file name from the URL
        const outputFileName = `output_copy_${inputFileName}`;

        // Construct the FFmpeg command to copy the video (no encoding, just copy the streams)
        const commandStr = `ffmpeg -i ${inputFileName} -c copy ${outputFileName}`;

        // Debugging: log the inputFileName to the console
        console.log("Input file name: ", inputFileName);

        // Run FFmpeg with the appropriate file and command
        runFFmpeg(inputFileName, outputFileName, commandStr, videoUrl);
        
        sendResponse({ status: "Processing video..." });
    }
    return true; // Ensures sendResponse works asynchronously
});
