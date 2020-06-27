declare var window: any;

import "./styles/main.scss";

import Vue from "vue";

Vue.config.productionTip = false;
Vue.config.devtools = false;

import { sessionManager, Pattern, PatternStep } from "core/session-manager";
import { soundManager } from "core/sound-manager";
import { fileManager } from "core/file-manager";

import * as TweenJS from "@tweenjs/tween.js/dist/tween.cjs";
import { remote, shell } from "electron";
import { randomFromArray } from "utils/utils";

window.sessionManager = sessionManager;
window.soundManager = soundManager;
window.fileManager = fileManager;

function defaultConfig() {
    return {
        mode: "manual",
        modeOptions: ["manual", "pattern", "random"],
        pattern: "2000,10\n1000,10\n500,5\n1000,5\n350,10\n2000,10",
        patternOptions: [
            { text: "Preset 1", value: "2000,10\n1000,10\n500,5\n1000,5\n350,10\n2000,10"},
            { text: "Preset 2", value: "5000,20\n4000,15\n3000,10\n2000,5\n1000,5\n500,5\n400,5\n300,5\n200,5\n150,5"},
        ],
        easing: "Cubic.Out",
        easingOptions: [
            { text: "Linear", value: "Linear.None"},
            { text: "Quadratic.In", value: "Quadratic.In"},
            { text: "Quadratic.Out", value: "Quadratic.Out"},
            { text: "Quadratic.InOut", value: "Quadratic.InOut"},
            { text: "Cubic.In", value: "Cubic.In"},
            { text: "Cubic.Out", value: "Cubic.Out"},
            { text: "Cubic.InOut", value: "Cubic.InOut"},
            { text: "Quartic.In", value: "Quartic.In"},
            { text: "Quartic.Out", value: "Quartic.Out"},
            { text: "Quartic.InOut", value: "Quartic.InOut"},
            { text: "Quintic.In", value: "Quintic.In"},
            { text: "Quintic.Out", value: "Quintic.Out"},
            { text: "Quintic.InOut", value: "Quintic.InOut"},
            { text: "Sinusoidal.In", value: "Sinusoidal.In"},
            { text: "Sinusoidal.Out", value: "Sinusoidal.Out"},
            { text: "Sinusoidal.InOut", value: "Sinusoidal.InOut"},
            { text: "Exponential.In", value: "Exponential.In"},
            { text: "Exponential.Out", value: "Exponential.Out"},
            { text: "Exponential.InOut", value: "Exponential.InOut"},
            { text: "Circular.In", value: "Circular.In"},
            { text: "Circular.Out", value: "Circular.Out"},
            { text: "Circular.InOut", value: "Circular.InOut"},
            { text: "Elastic.In", value: "Elastic.In"},
            { text: "Elastic.Out", value: "Elastic.Out"},
            { text: "Elastic.InOut", value: "Elastic.InOut"},
            { text: "Back.In", value: "Back.In"},
            { text: "Back.Out", value: "Back.Out"},
            { text: "Back.InOut", value: "Back.InOut"},
            { text: "Bounce.In", value: "Bounce.In"},
            { text: "Bounce.Out", value: "Bounce.Out"},
            { text: "Bounce.InOut", value: "Bounce.InOut"}
        ],
        tickSound: "boop",
        backgroundSound: "none",
        startTickRate: 5000,
        finishTickRate: 200,
        speedUpEvery: 1000,
        speedUpBy: 100,
        tickRate: 5000,
        totalDuration: 60,
        files: [] as string[],
        finalFile: "",
        shuffle: true,
        mute: true,
        pitch: false,
        randomizeVideoTime: true,
        sync: true,
        imagePath: "",
        videoPath: "",
        videoType: ""
    }
}

export type Config = ReturnType<typeof defaultConfig>;

const app = window.app = new Vue({
    el: "#app",
    data: defaultConfig(),
    computed: {
        currentPattern: function() : Pattern{
            return this.pattern.split("\n").map(str => {
                const vals = str.split(",").map(x => parseFloat(x));
                const patternStep: PatternStep = {tickRate: vals[0], duration: vals[1]};
                return patternStep;
            });
        },
        tickRateRounded: function() : string {
            return this.tickRate.toFixed(0);
        }
    },
    methods: {
        filesPicked: function (event: Event) {
            const fileList = (event.target as HTMLInputElement).files!;
            const files = Array.from(fileList);
            this.files = this.files.concat(files.map((file: any) => file.path).filter(path => path.match(/\.mp4|\.webm|\.mkv|\.jpg|\.png|\.gif/)));
        },
        finalFilePicked: function (event: Event) {
            const fileList = (event.target as HTMLInputElement).files!;
            const files = Array.from(fileList);
            this.finalFile = files.map((file: any) => file.path)[0];
        },
        clearFiles: function (event: Event) {
            this.files = [];
            sessionManager.stop(false);
        },
        clearFinalFile: function (event: Event) {
            this.finalFile = "";
        },
        toggleControls: function(){
            document.getElementById("configControls")!.classList.toggle("hidden");
        },
        toggleMute: function(){
            const video = this.$refs.videoRef as HTMLVideoElement;
            video.muted = this.mute;
        },
        resetConfig: function () {
            Object.assign(this.$data, defaultConfig());
        },
        getFile: function () {
            return fileManager.currentFile ?? "";
        },
        openFile: function(){
            if (fileManager.currentFile){
                shell.showItemInFolder(fileManager.currentFile);
            }
        },
        deleteFile: function(){
            if (fileManager.currentFile){
                shell.moveItemToTrash(fileManager.currentFile);
            }
        },
        manualRandomize: function (){
            this.startTickRate = Math.floor(Math.random() * 10000 + 500);
            this.finishTickRate = Math.floor(Math.random() * 500 + 150);
            this.totalDuration = Math.floor(Math.random() * 250) + 10;
            this.easing = randomFromArray(this.easingOptions.map(option => option.value));
        },
        patternRandomize: function (){
            
        }
    },
    updated: function () {
        this.$nextTick(function () {
            store(this.$data);
        });

        document.querySelectorAll("textarea").forEach(textarea => {
            textarea.style.height = "auto"
            textarea.style.height = textarea.scrollHeight + 2 + "px";
        });
    },
    mounted: function () {
        this.$nextTick(function () {
            const serialisedStorage = localStorage.getItem("store");

            if (serialisedStorage === null) {
                return;
            }

            Object.assign(this.$data, load(serialisedStorage));

            sessionManager.setup(this);
            fileManager.setup(this, this.$refs.imageRef as HTMLImageElement, this.$refs.videoRef as HTMLVideoElement);
            soundManager.setup(this, [
                { key: "boop", sounds: ["boop"]},
                { key: "clap", sounds: ["clap"]},
                { key: "fap", sounds: ["fap1", "fap2", "fap3", "fap4", "fap5", "fap6"]},
                { key: "finish", sounds: ["splat", "sploosh"]},
                { key: "squishing", sounds: ["squishing"]},
                { key: "deepthroat", sounds: ["deepthroat"]},
            ]);
        });
    }
});

interface StoredObject {
    key: string;
    type: string;
    data: any;
}

function store(config: any) {
    const storage: StoredObject[] = [];

    for (const key in config) {
        const data = config[key];

        if (key.match(/tickRate|imagePath|videoPath/)){
            continue;
        }

        storage.push({
            key: key,
            type: typeof data,
            data: Array.isArray(data) ? JSON.stringify(data) : data
        });
    }

    localStorage.setItem("store", JSON.stringify(storage));
}

function load(serialisedStorage: string) : object {
    const storage = JSON.parse(serialisedStorage) as StoredObject[];
    const config: {[key:string]: any} = {};

    for (const obj of storage){
        if (obj.type === "number"){
            config[obj.key] = parseInt(obj.data);
        } else if (obj.type === "object" || obj.type === "boolean"){
            config[obj.key] = JSON.parse(obj.data);
        } else {
            config[obj.key] = obj.data;
        }
    }

    return config;
}

function tweenLoop(time?: number) {
    requestAnimationFrame(tweenLoop);
    TweenJS.update(time);
}
requestAnimationFrame(tweenLoop);