﻿import { JitsiClient } from "../../src/jitsihax-client-external-api.js";
import { P, Div, Button } from "../../src/html/tags.js";
import { style } from "../../src/html/attrs.js";
import { onClick } from "../../src/html/evts.js";

let hash = document.location.hash.length > 0
    ? parseFloat(document.location.hash.substring(1))
    : 1;

const client = new JitsiClient(),
    output = Div(
        style({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            color: "#0f0",
            pointerEvents: "none"
        })),
    spawn = Button(
        style({
            position: "absolute",
            top: 0,
            left: "calc(50% - 5em)",
            width: "10em"
        }),
        onClick(() => {
            const loc = new URL(document.location.href);
            ++hash;
            loc.hash = "#" + hash
            window.open(loc.href);
        }),
        "Spawn");

const allTests = [
    async () => {
        echoValue("Toggle audio");
        client.toggleAudio();
    },

    async () => {
        echoValue("Is audio muted?");
        let muted = await client.isAudioMutedAsync();
        echoValue("Audio is muted: " + muted);
    },

    async () => {
        echoValue("Set audio unmuted");
        await client.setAudioMutedAsync(false);
    },

    async () => {
        echoValue("Is audio muted?");
        let muted = await client.isAudioMutedAsync();
        echoValue("Audio is muted: " + muted);
    },

    async () => {
        echoValue("Toggle video");
        client.toggleVideo();
    },

    async () => {
        echoValue("Is video muted?");
        let muted = await client.isVideoMutedAsync();
        echoValue("Video is muted: " + muted);
    },

    async () => {
        echoValue("Set video muted");
        await client.setVideoMutedAsync(true);
    },

    async () => {
        echoValue("Is video muted?");
        let muted = await client.isVideoMutedAsync();
        echoValue("Video is muted: " + muted);
    }
];

async function setup() {

    const audioOutputDevices = await client.getAudioOutputDevices(),
        audioInputDevices = await client.getAudioInputDevices(),
        videoInputDevices = await client.getVideoInputDevices(),
        curAudioOut = await client.getCurrentAudioOutputDevice(),
        curAudioIn = await client.getCurrentAudioInputDevice(),
        curVideoIn = await client.getCurrentVideoInputDevice();

    echoValue(audioOutputDevices);
    echoValue(audioInputDevices);
    echoValue(videoInputDevices);
    echoValue(curAudioOut);
    echoValue(curAudioIn);
    echoValue(curVideoIn);
}

async function runTest() {
    const tests = allTests.slice();
    while (tests.length > 0) {
        echoValue(tests.length);
        await wait(1000);
        const test = tests.shift();
        await test();
    }
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");

    document.head.append(...doc.head.childNodes);

    document.body.append(
        ...doc.body.childNodes,
        client.element,
        output);

    if (hash === 1) {
        document.body.append(spawn);
    }

    document.body.removeChild(document.body.querySelector("#login"));


    client.addEventListener("moveTo", echoEvt);
    client.addEventListener("emote", echoEvt);
    client.addEventListener("userInitRequest", echoEvt);
    client.addEventListener("userInitResponse", echoEvt);
    client.addEventListener("audioMuteStatusChanged", echoEvt);
    client.addEventListener("videoMuteStatusChanged", echoEvt);
    client.addEventListener("videoConferenceJoined", echoEvt);
    client.addEventListener("videoConferenceLeft", echoEvt);
    client.addEventListener("participantJoined", echoEvt);
    client.addEventListener("participantLeft", echoEvt);
    client.addEventListener("avatarChanged", echoEvt);
    client.addEventListener("displayNameChange", echoEvt);
    client.addEventListener("audioActivity", echoEvt);

    client.addEventListener("videoConferenceJoined", setup);
    client.addEventListener("participantJoined", runTest);

    await client.joinAsync("TestRoom", "TestUser" + hash);
})();

function echoValue(value) {
    console.log(value);
    const label = P(value);
    output.appendChild(label);
    setTimeout(() => {
        output.removeChild(label);
    }, 5000);
}

function echoEvt(evt) {
    echoValue(evt.type);
}