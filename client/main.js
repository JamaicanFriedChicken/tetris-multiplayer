// Youtube link for the tetris tutorial 2 player:
// https://www.youtube.com/watch?v=JJo5JpbuTTs&list=PLS8HfBXv9ZWW49tOAbvxmKy17gpsqWXaX&index=2

class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function() {
            this.sound.play();
        };
        this.stop = function() {
            this.sound.pause();
        };
    }
}

myTheme = new Sound("sound/slow_tetris_soundtrack.mp3");

const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();
localTetris.element.classList.add("local");
localTetris.run();

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect("ws://localhost:9000");

const keyListener = event => {
    [
        // ASCII number for keys
        [65, 68, 81, 69, 83], // a, d, q, e, s
        [72, 75, 89, 73, 74] // h, k, y, i, j
    ].forEach((key, index) => {
        const player = localTetris.player;
        if (event.type === "keydown") {
            if (event.keyCode === key[0]) {
                player.move(-1);
            } else if (event.keyCode === key[1]) {
                player.move(1);
            } else if (event.keyCode === key[2]) {
                player.rotate(-1);
            } else if (event.keyCode === key[3]) {
                player.rotate(1);
            }
        }

        if (event.keyCode === key[4]) {
            if (event.type === "keydown") {
                if (player.dropInterval !== player.DROP_FAST) {
                    player.drop();
                    player.dropInterval = player.DROP_FAST;
                }
            } else {
                player.dropInterval = player.DROP_SLOW;
            }
        }
    });
};

document.addEventListener("keydown", keyListener);
document.addEventListener("keyup", keyListener);
