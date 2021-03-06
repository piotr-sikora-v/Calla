﻿import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";
import { WebAudioNodePosition } from "./WebAudioNodePosition.js";

export class FullSpatializer extends BaseWebAudioSpatializer {

    constructor(userID, destination, audio, bufferSize) {
        const panner = destination.audioContext.createPanner(),
            position = new WebAudioNodePosition(panner);
        super(userID, destination, audio, position, bufferSize, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.refDistance = destination.minDistance;
        this.inNode.rolloffFactor = destination.rolloff;
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;
        this.wasMuted = false;

        Object.seal(this);
    }

    update() {
        super.update();

        if (this.inNode.refDistance !== this.destination.minDistance) {
            this.inNode.refDistance = this.destination.minDistance;
        }

        if (this.inNode.rolloffFactor !== this.destination.rolloff) {
            this.inNode.rolloffFactor = this.destination.rolloff;
        }

        const muted = this.volume <= 0;

        if (!!this.source && muted !== this.wasMuted) {
            this.wasMuted = muted;
            if (muted) {
                this.source.disconnect(this.inNode);
            }
            else {
                this.source.connect(this.inNode);
            }
        }
    }
}