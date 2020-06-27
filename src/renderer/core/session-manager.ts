import { Config } from "main";
import { soundManager } from "./sound-manager";
import { fileManager } from "./file-manager";

import { remote } from "electron";
import * as TweenJS from "@tweenjs/tween.js/dist/tween.cjs";
import { Signal } from "signals";

enum State {
    STOPPED,
    PLAYING
}

export interface PatternStep {
    tickRate: number;
    duration: number;
}

export type Pattern = PatternStep[];

class SessionManager {
    public state: State = State.STOPPED;

    public onStart: Signal = new Signal();
    public onTick: Signal = new Signal();
    public onStop: Signal = new Signal();

    protected config!: Config;

    protected tickTimeoutId: number = 0;
    protected patternTimeoutId: number = 0;
    protected tween?: TweenJS.Tween;
    protected pattern: Pattern = [];
    protected patternIndex: number = 0;

    protected btnGo: HTMLButtonElement = document.getElementById("btnGo") as HTMLButtonElement;
    protected btnPrev: HTMLButtonElement = document.getElementById("btnPrev") as HTMLButtonElement;
    protected btnNext: HTMLButtonElement = document.getElementById("btnNext") as HTMLButtonElement;

    public setup(config: Config){
        this.config = config;

        this.btnGo.addEventListener("click", () => this.trigger());
        window.addEventListener("keydown", (evt: KeyboardEvent) => {
            switch(evt.code){
                case "Space": this.trigger(); return;
                case "ArrowLeft": fileManager.prevFile(); return;
                case "ArrowRight": fileManager.nextFile(); return;
            }
        });
    }

    protected trigger(){
        switch (this.state){
            case State.STOPPED: 
                this.start();
                return;
            case State.PLAYING:
                this.stop();
                return;
        }
    }

    public start(){
        if (this.config.files.length === 0){
            remote.dialog.showMessageBoxSync({
                type: 'warning',
                message: 'You must set some files first',
                title: "Warning"
            });
            return;
        }

        this.state = State.PLAYING;

        if (this.config.mode === "manual"){
            this.config.tickRate = this.config.startTickRate;

            const easing = (TweenJS.Easing as any)[this.config.easing.split(".")[0]][this.config.easing.split(".")[1]];

            this.tween =
                new TweenJS.Tween(this.config)
                .to({ tickRate: this.config.finishTickRate }, this.config.totalDuration * 1000)
                .easing(easing)
                .start();
            
        } else if (this.config.mode === "pattern"){
            this.pattern = (this.config as any).currentPattern;
            this.patternIndex = 0;
            this.nextPattern();
        } else if (this.config.mode === "random"){
            
        }

        this.tick();

        soundManager.play(this.config.backgroundSound, 1, true);

        this.onStart.dispatch();
    }

    public stop(playSound = true){
        this.state = State.STOPPED;

        window.clearTimeout(this.tickTimeoutId);
        window.clearTimeout(this.patternTimeoutId);

        this.tween?.stop();

        if (playSound){
            soundManager.play("finish");
        }

        if (this.config.finalFile){
            fileManager.setFile(this.config.finalFile);
        }

        soundManager.stop(this.config.backgroundSound);

        this.onStop.dispatch();
    }

    protected tick(){
        const pitch = this.config.pitch ? this.config.finishTickRate / this.config.tickRate * 2 : 1;
        soundManager.play(this.config.tickSound, pitch);

        if (this.config.sync){
            fileManager.nextFile();
        }

        this.onTick.dispatch();

        this.tickTimeoutId = window.setTimeout(() => {
            this.tick();
        }, this.config.tickRate);
    }

    protected nextPattern(){
        const step = this.pattern[this.patternIndex];
        this.config.tickRate = step.tickRate;

        this.patternTimeoutId = window.setTimeout(() => {
            this.patternIndex = this.patternIndex < this.pattern.length - 1 ? this.patternIndex + 1 : 0;
            this.nextPattern();
        }, step.duration * 1000);
    }
}

export const sessionManager = new SessionManager();