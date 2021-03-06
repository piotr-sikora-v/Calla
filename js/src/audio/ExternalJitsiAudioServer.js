﻿import { AudioManager } from "./AudioManager.js";

const FRONT_END_SERVER = "https://www.calla.chat",
    ALLOW_LOCAL_HOST = true,
    APP_FINGERPRINT = "Calla",
    manager = new AudioManager();

let origin = null;

manager.addEventListener("audioActivity", (evt) => {
    txJitsiHax("audioActivity", {
        id: evt.id,
        isActive: evt.isActive
    });
});

function txJitsiHax(command, value) {
    if (origin !== null) {
        const evt = {
            hax: APP_FINGERPRINT,
            command,
            value
        }
        window.parent.postMessage(JSON.stringify(evt), origin);
    }
}

window.addEventListener("message", (msg) => {
    const isLocalHost = msg.origin.match(/^https?:\/\/localhost\b/);

    if (msg.origin === FRONT_END_SERVER
        || ALLOW_LOCAL_HOST && isLocalHost) {
        try {
            const evt = JSON.parse(msg.data),
                isJitsiHax = evt.hax === APP_FINGERPRINT;

            if (isJitsiHax && !!manager[evt.command]) {
                manager[evt.command](evt.value);
                if (evt.command === "setAudioProperties") {
                    origin = evt.value.origin;
                    console.log(origin);
                }
            }
        }
        catch (exp) {
            console.error(exp);
        }
    }
});
