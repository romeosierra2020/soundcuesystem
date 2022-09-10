

export default class SFX {
    constructor(track, index) {

        this.audioObj = new Audio();
        this.id = index + 1;
        this.name = track.name;
        this.isLoaded = false;
        this.isFading = false;
        this.fadeStep = 0;
        this.audioObj.src = "./assets/" + track.file;
        this.startVolume = this.clamp(track.startVolume, 0, 1)
        this.audioObj.volume = this.startVolume;
        this.audioObj.addEventListener('canplaythrough', () => this.isLoaded = true)
    }
    clamp(value, min, max) {
        if(value < min) return min;
        if(value > max) return max;
        return value;
    }
    update(dt) {
        if(this.isFading) {
            if(this.audioObj.volume - this.fadeStep * dt >= 0) {

                this.audioObj.volume -= this.fadeStep * dt;
            } else {
                this.audioObj.volume = 0;
            }
        }
        if(this.isFading && this.audioObj.volume === 0) {
            this.audioObj.currentTime = 0;
            this.audioObj.pause();
            this.audioObj.volume = this.startVolume
            this.isFading = false
        }
        let canvas = document.getElementById('canvas' + (this.id-1))
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0,0, canvas.width, canvas.height)
        ctx.fillStyle = "rgba(255,0,0,0.25)"
        let position = this.audioObj.currentTime / this.audioObj.duration;
        let progress = position * canvas.width
        ctx.fillRect(0,0,progress,canvas.height)
    }
    play() {
        if (
            !this.audioObj.currentTime > 0 ||  this.audioObj.paused
        ) {
            this.audioObj.play();
        }

    }
    stop() {
        if(this.audioObj.currentTime > 0 ){

            this.audioObj.pause();
            this.audioObj.currentTime = 0;
        }
    }
    pause() {
        if(this.audioObj.currentTime > 0 ){

            this.audioObj.pause()
        }
    }
    fade(fadeDurationMS) {
        if(this.audioObj.currentTime > 0 ){

            this.isFading = true;
            this.fadeStep = this.audioObj.volume / fadeDurationMS;
        }
    }
}