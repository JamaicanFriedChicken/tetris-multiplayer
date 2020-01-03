myTheme = new sound("slow_tetris_soundtrack.mp3");
mySound = new sound("tetris_soundeffect.mp3");
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        mySound.play();
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

// Checks for collision between blocks, players, walls etc.
function collide(arena, player) {
    const matrix = player.matrix;
    const offset = player.position;
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < matrix[y].length; ++x) {
            if (
                matrix[y][x] !== 0 &&
                (arena[y + offset.y] && arena[y + offset.y][x + offset.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

// Matrix for actually storing blocks when they get stuck
// on another block.
function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

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

// Draws matrix.
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colours[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Draws matrix as a block.
function draw() {
    // clears canvas before drawing a new block.
    context.fillStyle = "#000"; // black
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.position);
}

// Copies all the matrix values of the player to the arena
// at the correct positions.
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.position.y][x + player.position.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.position.y++;
    // While dropping, if collide then it means it's touching ground, another block.
    if (collide(arena, player)) {
        player.position.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
        // // resets tetris block after it touches ground.
        // player.position.y = 0;
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.position.x += offset;
    if (collide(arena, player)) {
        player.position.x -= offset;
    }
}

function playerReset() {
    const pieces = "ILJOTSZ";
    // The | 0 means floored in javascript i.e. rounding down to the number.
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.position.y = 0;
    player.position.x =
        ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(direction) {
    const position = player.position.x;
    let offset = 1;
    rotate(player.matrix, direction);
    while (collide(arena, player)) {
        player.position.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -direction);
            player.position.x = position;
            return;
        }
    }
}

function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            // Switching values inside the matrix to rotate matrix
            // e.g. [a, b] = [b, a]
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }

    if (direction > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

// In charge of setting the music for the game.
function sound(src) {
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

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000; // unit: ms

function update(time = 0) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

const colours = [
    null,
    "#FF0D72",
    "#0DC2FF",
    "#0DFF72",
    "#F538FF",
    "#FF8E0D",
    "#FFE138",
    "#3877FF"
];

function updateScore() {
    document.getElementById("score").innerText = player.score;
}

// Listens if a key on the keyboard is pressed.
document.addEventListener("keydown", event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

const arena = createMatrix(12, 20);

const player = {
    position: { x: 0, y: 0 },
    matrix: null,
    score: 0
};

myTheme.play();
playerReset();
updateScore();
update();
