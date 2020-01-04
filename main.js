function createPiece(type) {
    if (type === "T") {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    } else if (type === "O") {
        return [
            [2, 2],
            [2, 2]
        ];
    } else if (type === "L") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ];
    } else if (type === "J") {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ];
    } else if (type === "I") {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ];
    } else if (type === "S") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ];
    } else if (type === "Z") {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ];
    }
}

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

myTheme = new Sound("slow_tetris_soundtrack.mp3");

const tetri = [];

// Selects all classes "player" and processes em as a single line function
const playerElements = document.querySelectorAll(".player");
[...playerElements].forEach(element => {
    const tetris = new Tetris(element);
    // myTheme.play();
    // stores each tetris user into an array
    tetri.push(tetris);
});

const keyListener = event => {
    [
        [65, 68, 81, 69, 83],
        [72, 75, 89, 73, 74]
    ].forEach((key, index) => {
        const player = tetri[index].player;
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
