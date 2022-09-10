import config from "./config.json" assert { type: "json" };
import SFX from "./SFX.js";
let audioObjects = [];
let initialised = false;
let width = window.innerWidth;
let userPosition = 0;

config.tracks.forEach((track, index) => {
    audioObjects.push(new SFX(track, index));
    let trackContainer = document.createElement("div");
    trackContainer.style = `
        position: absolute;
        width: ${width * 0.95}px;
        height: 48px;
        left: 10px;
        top: ${index * 42 + 21}px;
        background-color: var(--clr-white);
        border-radius: 5px;`;
    let cue = document.createElement("h3");
    cue.style = `
        position: absolute;
        width: ${width * 0.37}px;
        height: 36px;
        left: 10px;
        top: ${6}px;
        background-color: var(--clr-white);
        border: solid 2px var(--clr-black);
        border-radius: 5px;
        align-text: center;
        font-size: 24px;
        color: var(--clr-accent);`;
    cue.innerText = track.cue;
    cue.id = "cue" + index;
    trackContainer.appendChild(cue);
    
    let title = document.createElement("div");
    title.style = `
        position: absolute;
        width: ${width * 0.37}px;
        height: 36px;
        left: ${width * 0.37 + 20}px;
        top: ${6}px;
        background-color: var(--clr-white);
        border: solid 2px var(--clr-black);
        border-radius: 5px;
        align-text: center;
        text-style: bold;
        font-size: 24px;
        color: var(--clr-accent);`;

    title.innerText = track.name;
    title.id = "title" + index;
    trackContainer.appendChild(title);
    let canvas = document.createElement("canvas");
    canvas.addEventListener('click', () => {
        console.log(audioObjects[index])
        audioObjects[index].play();
    })
    canvas.style = `
    position: absolute;
    width: ${width * 0.37}px;
    height: 36px;
    left: ${width * 0.37 + 20}px;
    top: ${6}px;

    border-radius: 5px;

`;

    canvas.id = "canvas" + index;
    trackContainer.appendChild(canvas);

    for (let i = 0; i < config.controls.length; i++) {
        let button = document.createElement("i");
        // button.innerText = config.controls[i].symbol;
        button.style = `
        position: absolute;
        width: ${36}px;
        height: 36px;
        left: ${width * 0.74 + 40 * i + 30}px;
        top: ${6}px;
        background-color: var(--clr-white);
        color:var(--black);
        border: solid 2px var(--clr-black);
        font-style: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        font-size: 24px;`;
        switch (config.controls[i].callback) {
            case "play":
                button.classList = 'fas fa-play'
                break;
            case "stop":
                    button.classList = 'fas fa-stop'
                break;
            case "pause":

                button.classList = 'fas fa-pause'
                break;
            case "fade":
                button.innerText = config.controls[i].symbol;
                break;
        }
        button.addEventListener("click", () => {
            switch (config.controls[i].callback) {
                case "play":
                    audioObjects[index].play();
                    break;
                case "stop":
                    audioObjects[index].stop();
                    break;
                case "pause":
                    audioObjects[index].pause();
                    break;
                case "fade":
                    audioObjects[index].fade(
                        parseInt(button.innerText.charAt(1)) * 1000
                    );
                    break;
            }
        });

        trackContainer.appendChild(button);
    }

    document.querySelector("body").appendChild(trackContainer);
});
let lastTime = 0;
const tick = (timeStamp) => {
    let dt = timeStamp - lastTime;
    // console.log(dt)
    lastTime = timeStamp;
    if(!initialised) {
        let loaded = 0;
        for(let i = 0; i < audioObjects.length; i++) {
            if(audioObjects[i].isLoaded) {
                document.getElementById('title' + i).style.color = "var(--clr-black)"
                loaded++
            }
        }
        if(loaded === audioObjects.length) {
            initialised = true;
            window.addEventListener('keydown', (e) => {
                let canvas = document.getElementById("canvas" + (userPosition))
                switch(e.key) {
                    case "ArrowUp":
                        userPosition--;
                        if(userPosition< 0) userPosition =0;

                        canvas.style.backgroundColor = "rgba(0,0,0,0)"
                        break;
                    case "ArrowDown":
                        userPosition++;
                        if(userPosition >= audioObjects.length) userPosition = audioObjects.length;

                        canvas.style.backgroundColor = "rgba(0,0,0,0)"
                        break;
                    case " ":
                        audioObjects[userPosition].play();
                        break;
                }
            })
        }
    }
    for (let i = 0; i < audioObjects.length; i++) {
        audioObjects[i].update(dt);
        let canvas = document.getElementById("canvas" + (userPosition))
        canvas.style.backgroundColor = "rgba(0,255,0,0.25)"
    }
    window.requestAnimationFrame(tick);
};
window.requestAnimationFrame(tick);
