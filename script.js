var canvas;
var ctx;
var default_color;
var interval;
var game_map;
var minimap;
var minimap_ctx;
var player;
var minimap_back;

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.yaw = 0;
        this.pitch = 0;
    }

    move_player(value) {
        this.x += Math.cos(this.yaw) * value;
        this.y += Math.sin(this.yaw) * value;
    }

    draw_on_minimap() {
        minimap_ctx.fillStyle = "blue";
        minimap_ctx.fillRect(this.x / 200, this.y / 200, 7, 7);
        this.draw_view();
    }

    draw_view() {
        let x = this.x / 200 + 1.5;
        let y = this.y / 200 + 1.5;
        let distance = 50
        draw_line_minimap(x, y, x + Math.cos(this.yaw) * distance, y + Math.sin(this.yaw) * distance, "yellow");
    }

    rotate(yaw, pitch) {
        this.yaw += yaw;
        this.pitch += pitch;
    }
}

function test() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(110, 110);
    ctx.lineTo(140, 90);
    ctx.lineTo(90, 140);
    ctx.lineTo(100, 100);
    ctx.closePath();
    ctx.fill();
}

function castRay(x, y, angle) {
    let alive = true;
    let ray_range = 5;
    let distance = 0;
    while (true) {
        x += Math.cos(angle) * 3;
        y += Math.sin(angle) * 3;
        distance += 30;
    }
    return distance;
}

function clear_screen() {
    ctx.fillStyle = default_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    minimap_ctx.fillStyle = minimap_back;
    minimap_ctx.fillRect(0, 0, minimap.width, minimap.height);
}

function create_map() {
    let map = [];
    for (let index = 0; index < 32; index++) {
        let line = [];
        for (let index = 0; index < 24; index++) {
            line.push(0);
        }
        map.push(line);
    }
    return map;
}

function create_border(map) {
    for (let index = 0; index < 32; index++) {
        map[index][0] = 1;
        map[index][23] = 1;
    }
    for (let index = 0; index < 24; index++) {
        map[0][index] = 1;
        map[31][index] = 1;
    }
    return map;
}

function create_wall(map) {
    for (let x = 8; x < 24; x++) {
        map[x][11] = 1;
    }
    for (let y = 11; y < 17; y++) {
        map[24][y] = 1;
    }
    return map;
}

function draw_wall(x, y, size) {
    minimap_ctx.fillStyle = "black";
    minimap_ctx.fillRect(x * size, y * size, size, size);
}

function draw_minimap(map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] == 1) {
                draw_wall(y, x, 7);
            }
        }
    }
}

function draw_line(startX, startY, endX, endY, Color) {
    ctx.strokeStyle = Color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
}

function draw_line_minimap(startX, startY, endX, endY, Color) {
    minimap_ctx.strokeStyle = Color;
    minimap_ctx.beginPath();
    minimap_ctx.moveTo(startX, startY);
    minimap_ctx.lineTo(endX, endY);
    minimap_ctx.closePath();
    minimap_ctx.stroke()
}

function game_loop() {
    clear_screen();
    draw_minimap(game_map);
    player.draw_on_minimap();
    // test()
}

window.addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById("canvas");
    minimap = document.getElementById("minimap");
    ctx = canvas.getContext("2d");
    minimap_ctx = minimap.getContext("2d");
    default_color = "cyan"
    minimap_back = "white";
    game_map = create_map();
    game_map = create_border(game_map);
    game_map = create_wall(game_map);
    player = new Player(1000, 1000);
    interval = setInterval(game_loop, 1000/30);
});

window.addEventListener('keypress', key => {
    switch (key.code) {
        case "KeyW":
            player.move_player(500);
            break;
        case "KeyS":
            player.move_player(-500);
            break;
        case "KeyA":
            player.rotate(-2 * (Math.PI / 180), 0);
            break;
        case "KeyD":
            player.rotate(2 * (Math.PI / 180), 0);
            break;
    }
});
