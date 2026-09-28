/* =========================================
   NOVAFORCE ONLINE GAME
========================================= */

function openOnlineGame(url) {

    const player =
        document.getElementById("onlinePlayer");

    const frame =
        document.getElementById("onlineFrame");

    frame.src = url;

    player.style.display = "block";

    player.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


document
    .getElementById("closeOnlineGame")
    .addEventListener(
        "click",
        function() {

            const player =
                document.getElementById("onlinePlayer");

            const frame =
                document.getElementById("onlineFrame");

            frame.src = "";

            player.style.display = "none";

        }
    );


/* =========================================
   CYBER STRIKE
========================================= */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

let W = 0;
let H = 0;


function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    W = canvas.width = rect.width;

    H = canvas.height = rect.height;

}


resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* GAME VARIABLES */

let gameRunning = false;

let paused = false;

let score = 0;

let kills = 0;

let wave = 1;

let health = 100;

let ammo = 30;

let enemies = [];

let bullets = [];

let particles = [];

let keys = {};


let mouse = {

    x: W / 2,

    y: H / 2,

    down: false

};


const player = {

    x: 0,

    y: 0,

    radius: 18,

    speed: 4

};


/* INPUT */

window.addEventListener(
    "keydown",
    function(e) {

        keys[
            e.key.toLowerCase()
        ] = true;


        if(
            e.key.toLowerCase() === "r"
        ) {

            ammo = 30;

            updateHUD();

        }


        if(e.key === "Escape") {

            togglePause();

        }

    }
);


window.addEventListener(
    "keyup",
    function(e) {

        keys[
            e.key.toLowerCase()
        ] = false;

    }
);


canvas.addEventListener(
    "mousemove",
    function(e) {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            e.clientX - rect.left;

        mouse.y =
            e.clientY - rect.top;

    }
);


canvas.addEventListener(
    "mousedown",
    function() {

        mouse.down = true;

    }
);


window.addEventListener(
    "mouseup",
    function() {

        mouse.down = false;

    }
);


/* BUTTONS */

document
    .getElementById("startGame")
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById("restartGame")
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById("resumeGame")
    .addEventListener(
        "click",
        function() {

            paused = false;

            document
                .getElementById("pauseScreen")
                .style.display = "none";

        }
    );


document
    .getElementById("playNow")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById("play")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* START GAME */

function startGame() {

    score = 0;

    kills = 0;

    wave = 1;

    health = 100;

    ammo = 30;

    enemies = [];

    bullets = [];

    particles = [];


    player.x = W / 2;

    player.y = H / 2;


    gameRunning = true;

    paused = false;


    document
        .getElementById("gameStart")
        .style.display = "none";


    document
        .getElementById("gameOver")
        .style.display = "none";


    document
        .getElementById("pauseScreen")
        .style.display = "none";


    spawnWave();

    updateHUD();

}


/* PAUSE */

function togglePause() {

    if(!gameRunning) {

        return;

    }


    paused = !paused;


    document
        .getElementById("pauseScreen")
        .style.display =
        paused ? "flex" : "none";

}


/* SPAWN */

function spawnWave() {

    const amount =
        4 + wave * 2;


    for(
        let i = 0;
        i < amount;
        i++
    ) {

        const side =
            Math.floor(
                Math.random() * 4
            );


        let x;

        let y;


        if(side === 0) {

            x = -30;

            y =
                Math.random() * H;

        }


        if(side === 1) {

            x = W + 30;

            y =
                Math.random() * H;

        }


        if(side === 2) {

            x =
                Math.random() * W;

            y = -30;

        }


        if(side === 3) {

            x =
                Math.random() * W;

            y = H + 30;

        }


        enemies.push({

            x: x,

            y: y,

            radius: 16,

            speed:
                0.7 +
                Math.random() * .6 +
                wave * .04,

            hp: 2

        });

    }

}


/* SHOOT */

let lastShot = 0;


function shoot() {

    const now =
        performance.now();


    if(
        now - lastShot < 160 ||
        ammo <= 0
    ) {

        return;

    }


    lastShot = now;

    ammo--;


    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );


    bullets.push({

        x: player.x,

        y: player.y,

        vx:
            Math.cos(angle) * 11,

        vy:
            Math.sin(angle) * 11,

        life: 70

    });


    createParticles(
        player.x,
        player.y,
        5
    );


    updateHUD();

}


/* PARTICLES */

function createParticles(
    x,
    y,
    amount
) {

    for(
        let i = 0;
        i < amount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI * 2;


        const speed =
            Math.random() * 3;


        particles.push({

            x: x,

            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 25

        });

    }

}


/* UPDATE */

function update() {

    if(
        !gameRunning ||
        paused
    ) {

        return;

    }


    /* PLAYER */

    if(keys["w"])
        player.y -= player.speed;

    if(keys["s"])
        player.y += player.speed;

    if(keys["a"])
        player.x -= player.speed;

    if(keys["d"])
        player.x += player.speed;


    player.x =
        Math.max(
            25,
            Math.min(
                W - 25,
                player.x
            )
        );


    player.y =
        Math.max(
            25,
            Math.min(
                H - 25,
                player.y
            )
        );


    /* SHOOT */

    if(mouse.down) {

        shoot();

    }


    /* BULLETS */

    bullets.forEach(
        function(b) {

            b.x += b.vx;

            b.y += b.vy;

            b.life--;

        }
    );


    bullets =
        bullets.filter(
            function(b) {

                return (
                    b.life > 0 &&
                    b.x > -50 &&
                    b.x < W + 50 &&
                    b.y > -50 &&
                    b.y < H + 50
                );

            }
        );


    /* ENEMIES */

    enemies.forEach(
        function(enemy) {

            const angle =
                Math.atan2(
                    player.y - enemy.y,
                    player.x - enemy.x
                );


            enemy.x +=
                Math.cos(angle) *
                enemy.speed;


            enemy.y +=
                Math.sin(angle) *
                enemy.speed;


            const distance =
                Math.hypot(
                    player.x - enemy.x,
                    player.y - enemy.y
                );


            if(
                distance <
                player.radius +
                enemy.radius
            ) {

                health -= .4;


                if(health <= 0) {

                    health = 0;

                    gameOver();

                }

            }

        }
    );


    /* BULLET COLLISION */

    bullets.forEach(
        function(bullet) {

            enemies.forEach(
                function(enemy) {

                    const distance =
                        Math.hypot(
                            bullet.x - enemy.x,
                            bullet.y - enemy.y
                        );


                    if(
                        distance <
                        enemy.radius + 6
                    ) {

                        enemy.hp--;

                        bullet.life = 0;


                        createParticles(
                            enemy.x,
                            enemy.y,
                            10
                        );


                        if(enemy.hp <= 0) {

                            enemy.dead = true;

                            kills++;

                            score += 100;

                        }

                    }

                }
            );

        }
    );


    enemies =
        enemies.filter(
            function(enemy) {

                return !enemy.dead;

            }
        );


    /* NEXT WAVE */

    if(
        enemies.length === 0
    ) {

        wave++;

        spawnWave();

    }


    /* PARTICLES */

    particles.forEach(
        function(p) {

            p.x += p.vx;

            p.y += p.vy;

            p.life--;

        }
    );


    particles =
        particles.filter(
            function(p) {

                return p.life > 0;

            }
        );


    updateHUD();

}


/* DRAW */

function draw() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    /* GRID */

    ctx.strokeStyle =
        "rgba(0,247,255,.07)";

    ctx.lineWidth = 1;


    const grid = 45;


    for(
        let x = 0;
        x < W;
        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, H);

        ctx.stroke();

    }


    for(
        let y = 0;
        y < H;
        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(W, y);

        ctx.stroke();

    }


    /* BULLETS */

    bullets.forEach(
        function(b) {

            ctx.beginPath();

            ctx.arc(
                b.x,
                b.y,
                4,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#00f7ff";

            ctx.shadowBlur = 18;

            ctx.shadowColor =
                "#00f7ff";

            ctx.fill();

            ctx.shadowBlur = 0;

        }
    );


    /* ENEMIES */

    enemies.forEach(
        function(enemy) {

            ctx.beginPath();

            ctx.arc(
                enemy.x,
                enemy.y,
                enemy.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ff1744";

            ctx.shadowBlur = 22;

            ctx.shadowColor =
                "#ff1744";

            ctx.fill();

            ctx.shadowBlur = 0;


            ctx.beginPath();

            ctx.arc(
                enemy.x,
                enemy.y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "white";

            ctx.fill();

        }
    );


    /* PLAYER */

    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );


    ctx.save();


    ctx.translate(
        player.x,
        player.y
    );


    ctx.rotate(angle);


    ctx.beginPath();

    ctx.moveTo(26, 0);

    ctx.lineTo(-15, -15);

    ctx.lineTo(-9, 0);

    ctx.lineTo(-15, 15);

    ctx.closePath();


    ctx.fillStyle =
        "#00f7ff";

    ctx.shadowBlur = 25;

    ctx.shadowColor =
        "#00f7ff";

    ctx.fill();


    ctx.restore();


    ctx.shadowBlur = 0;


    /* PARTICLES */

    particles.forEach(
        function(p) {

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#00f7ff";

            ctx.fill();

        }
    );

}


/* HUD */

function updateHUD() {

    document
        .getElementById("score")
        .textContent = score;


    document
        .getElementById("kills")
        .textContent = kills;


    document
        .getElementById("wave")
        .textContent = wave;


    document
        .getElementById("ammo")
        .textContent = ammo;


    document
        .getElementById("healthFill")
        .style.width =
        health + "%";

}


/* GAME OVER */

function gameOver() {

    gameRunning = false;

    mouse.down = false;


    document
        .getElementById("finalScore")
        .textContent =
        "SCORE: " +
        score +
        " • KILLS: " +
        kills;


    document
        .getElementById("gameOver")
        .style.display = "flex";

}


/* MAIN LOOP */

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


gameLoop();


/* =========================================
   TIKTOK
========================================= */

function showTikTok() {

    alert(
        "TikTok: Shadow Soul"
    );

}


/* =========================================
   TOURNAMENT REGISTRATION
========================================= */

function joinTournament(name) {

    alert(
        name +
        " registration will open soon!"
    );

}