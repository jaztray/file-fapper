import { Config } from "main";

class FileManager {
    public currentFile: string = "";

    protected config!: Config;
    protected image!: HTMLImageElement;
    protected video!: HTMLVideoElement;
    protected history: string[] = [];
    protected historyIndex: number = -1;

    public setup(config: Config, image: HTMLImageElement, video: HTMLVideoElement){
        this.config = config;
        this.image = image;
        this.video = video;
    }

    public setFile(path: string){
        if (path.match(/\.mp4|\.webm|\.mkv/)){
            this.setVideo(path);
        } else if (path.match(/\.jpg|\.png|\.gif/)) {
            this.setImage(path);
        }

        this.currentFile = path;
    }

    public nextFile(){
        if (this.historyIndex === this.history.length - 1){
            this.setRandomFile();
            this.historyIndex++;
        } else {
            this.historyIndex++;
            this.setFile(this.history[this.historyIndex]);
        }
    }

    public prevFile(){
        if (this.history.length > 0 && this.historyIndex > 0){
            this.historyIndex--;
            this.setFile(this.history[this.historyIndex]);
        }
    }

    protected setRandomFile(){
        const file = this.getRandomFile();

        if (file === null){
            return;
        }

        this.setFile(file);

        this.history.push(file);
    }

    protected setImage(path: string){
        this.image.hidden = false;
        this.video.hidden = true;
        this.video.pause();
        this.config.videoPath = "";

        this.config.imagePath = path;
    }

    protected setVideo(path: string){
        this.image.hidden = true;
        this.video.hidden = false;
        this.config.imagePath = "";

        this.video.src = path;
        this.video.muted = this.config.mute;

        if (this.config.randomizeVideoTime){
            const listener = () => {
                this.video.currentTime = Math.random() * this.video.duration;
                this.video.removeEventListener("loadedmetadata", listener);
            };
            this.video.addEventListener("loadedmetadata", listener);
        }

        this.video.play();
    }

    protected getRandomFile(): string | null{
        if (this.config.files.length === 0){
            return null;
        }

        return this.config.files[Math.floor(Math.random() * this.config.files.length)];
    }
}

export const fileManager = new FileManager();