// Type definitions for tween.js r12
// Project: https://github.com/sole/tween.js/
// Definitions by: sunetos <https://github.com/sunetos>, jzarnikov <https://github.com/jzarnikov>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace TWEEN {
    export let REVISION: string;
    export function getAll(): Tween[];
    export function removeAll(object: any): void;
    export function add(tween: Tween): void;
    export function remove(tween: Tween): void;
    export function update(time?: number): boolean;

    export class Tween {
        constructor(object?: any);
        public getOnComplete(): (object?: any) => void;
        public to(properties: any, duration: number): Tween;
        public start(time?: number): Tween;
        public stop(): Tween;
        public delay(amount: number): Tween;
        public easing(easing: (k: number) => number): Tween;
        public interpolation(interpolation: (v: number[], k: number) => number): Tween;
        public chain(...tweens: Tween[]): Tween;
        public onStart(callback: (object?: any) => void): Tween;
        public onStop(callback: (object?: any) => void): Tween;
        public onUpdate(callback: (object?: any) => void): Tween;
        public onComplete(callback: (object?: any) => void): Tween;
        public onLoop(callback: (object?: any) => void): Tween;
        public update(time: number): boolean;
        public repeat(times: number): Tween;
        public yoyo(enable: boolean): Tween;

    }
    export let Easing: TweenEasing;
    export let Interpolation: TweenInterpolation;
}

interface TweenEasing {
    Linear: {
        None(k: number): number;
    };
    Quadratic: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Cubic: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Quartic: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Quintic: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Sinusoidal: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Exponential: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Circular: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Elastic: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Back: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
    Bounce: {
        In(k: number): number;
        Out(k: number): number;
        InOut(k: number): number;
    };
}

interface TweenInterpolation {
    Utils: {
        Linear(p0: number, p1: number, t: number): number;
        Bernstein(n: number, i: number): number;
        Factorial(n: number): number;
    };

    Linear(v: number[], k: number): number;
    Bezier(v: number[], k: number): number;
    CatmullRom(v: number[], k: number): number;
}

declare module "@tweenjs/tween.js/dist/tween.cjs" {
    export = TWEEN;
}
