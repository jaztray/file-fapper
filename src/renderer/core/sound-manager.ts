import { Howl } from "howler";
import { Config } from "main";

interface SoundPackConfig {
    key: string;
    sounds: string[];
}

class SoundManager {
    protected config!: Config;
    protected sounds: Map<string, Howl[]> = new Map();

    public setup(config: Config, soundPackConfigs: SoundPackConfig[]){
        for (const soundPackConfig of soundPackConfigs){
            const sounds = soundPackConfig.sounds.map(soundFile => new Howl({ src: [`../../sounds/${soundFile}.mp3`] }));
            this.sounds.set(soundPackConfig.key, sounds);
        }
    }

    public getSoundKeys(): string[]{
        return Array.from(this.sounds.keys());
    }

    public play(soundKey: string, rate = 1, loop = false){
        if (soundKey === "none") return;

        const sounds = this.sounds.get(soundKey)!;
        const sound = sounds[Math.floor(Math.random() * sounds.length)];

        sound.rate(rate);

        sound.loop(loop);

        sound.play();
    }

    public stop(soundKey: string){
        if (soundKey === "none") return;
        const sounds = this.sounds.get(soundKey);

        if (sounds === undefined) return;

        const sound = sounds[0];

        sound.stop();
    }
}

export const soundManager = new SoundManager();