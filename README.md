ooh maybe migrate to typescript

this turns out to be pretty manual labor since wasm stuff can be very hard to get working and chadgpt has no idea / history on people getting it to work

https://i.ylilauta.org/15/0e/150e2dcac76c50d1.mp4

gifsane is a bad example cuz its a webapp rather than a browser extension

ok i have to use content script for ffmpeg since background script cannot do any heavy lifting

however i need background script for registering the contextmenu

immaculate i have almost managed to send a message from bg script to defined content script quick saving here

i dont think i still quite understand what the javascript first class citizen means. aren't all js variables first class citizens?

ok phew! next stop is to update ffmpeg.wasm to 12.x which has av1 decoder support. wild times!

ok this ffmpeg.wasm is 11.6

11.x uses import { createFFmpeg } from '@ffmpeg/ffmpeg'
12.x uses import { FFmpeg } from '@ffmpeg/ffmpeg'

but my 11.x does not even use the import way! it uses the const { createFFmpeg} = FFmpeg

iiiii think that the current way of initiating ffmpeg from the distributables is wrong
i need an example

line 28 transcode.html it DOES use a core

{
  "dependencies": {
    "@ffmpeg/core": "^0.12.10",
    "@ffmpeg/ffmpeg": "^0.12.15",
    "@ffmpeg/util": "^0.12.1"
  }
}

hahahahhaah great its called transcode, not re-encode you idiot

okok so one shouldnt maybe load .wasm inside <script>

debug from line 12

wow i would have never thought a buggy gpg implementation on windows would prevent me from commiting and saving my progress

do i even have to load the wasm

ok next ill do a mvp test if a simple index.html will load the index.js

is it possible that util 12.2 is non-umd and 12.1 is still umd
why did no one speak about this

next up try to mimic the usage example to avoid async problems

next up try to figure why doesn't ffmpeg load correctly

https://www.w3schools.com/html/html5_video.asp

July 26th 2023 12.x was released

try out first with 12.1 if 12.2 is accidentally non-umd

crop seems to load core.js and core.wasm so it seems both are needed in 0.12.10

right so i have gotten the original non .12 version from aniny21 browser extension repo

now i just gotta check how to format a given 0.11 version to the aniny21 version

test 11.0 from unpkg if it works on h.264

ok wtf which version does work with av1

ok huge news: 0.9 alpha 2 is the only version that supports av1 encoding so if that doesnt work none of this actuall works on my usecase

this is just a hunch but ffmpeg util might be only for .12 onwards

next try loading 0.9 alpha 2 in the current code example of my own

do it little by little so you can debug whats up and PRAY TO GOD its not the loading part

does .12.alpha-2 have av1 encoder

ok now the ffmpeg.wasm version is v0.11.6 and it works...unpkg only lists ffmpeg/ffmpeg 11.6 available but not for ffmpeg/core, which includes the .wasm WHAT THE FUCK

now i gotta refactor all the unnecessary stuff away so i can try to downgrade to 0.9-alpha.2 and after that upgrade to .12-alpha.2 if that would have faster av1 transcoding