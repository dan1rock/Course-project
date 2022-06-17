'use strict';

const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

const background = new Image();
const player = new Image(); 
const bullet = new Image();
const particles = new Image();
const greyParticles = new Image();

background.src = 'Textures/Floor.png';
player.src = 'Textures/Character.png';
bullet.src = 'Textures/bullet.png';
particles.src = 'Textures/WhiteParticles.png';
greyParticles.src = 'Textures/GreyParticles.png';

const key = {
    up: false,
    down: false,
    left: false,
    right: false
}

const mousePos = {
    X: -1,
    Y: -1
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(event){
    if(event.code == 'KeyW') key.up = true;
    if(event.code == 'KeyS') key.down = true;
    if(event.code == 'KeyA') key.left = true;
    if(event.code == 'KeyD') key.right = true;
    if(event.code == 'KeyE') bullets.push(new Bullet(
        calculateAngle(xPos, yPos, mousePos.X, mousePos.Y) + toRadians(90), 
        getCenterX(xPos, player, 0.4), getCenterY(yPos, player, 0.4), 2, bullets.length)
        )
}

function keyUp(event){
    if(event.code == 'KeyW') key.up = false;
    if(event.code == 'KeyS') key.down = false;
    if(event.code == 'KeyA') key.left = false;
    if(event.code == 'KeyD') key.right = false;
}

const drawImage = (ctx, img, x, y, angle = 0, scale = 1) => {
    ctx.save();
    ctx.translate(x + img.width * scale / 2, y + img.height * scale / 2);
    ctx.rotate(angle);
    ctx.translate(- x - img.width * scale / 2, - y - img.height * scale / 2);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    ctx.restore();
}

document.onmousemove = function(event) {
    mousePos.X = event.pageX;
    mousePos.Y = event.pageY;
}

const bulletDestroyed = (index) => {
    for(let i = index; i < bullets.length; ++i) bullets[i].changeIndex();
}

const particleDestroyed = (index) => {
    for(let i = index; i < allParticles.length; ++i) allParticles[i].changeIndex();
}

const enemyDestroyed = (index) => {
    for(let i = index; i < enemies.length; ++i) enemies[i].changeIndex();
}

const calculateAngle = (x1, y1, x2, y2, cursor = true) => { 
    const centerX1 = getCenterX(x1, player, 0.4);
    const centerY1 = getCenterY(y1, player, 0.4);
    const centerX2 = cursor ? x2 : getCenterX(x2, player, 0.4);
    const centerY2 = cursor ? y2 : getCenterY(y2, player, 0.4);
    const pi = (centerY1-centerY2) >= 0 ? Math.PI : 0;
    return -Math.atan((centerX1 - centerX2) / (centerY1 - centerY2)) + pi;
}

const spawnEnemy = () => {
    const side = Math.floor(Math.random() * 4); 
    switch (side){
        case 0: 
            enemies.push(new Enemy(-50, Math.random() * 500, 0.2, enemies.length));
            break;
        case 1: 
            enemies.push(new Enemy(520, Math.random() * 500, 0.2, enemies.length));
            break;
        case 2: 
            enemies.push(new Enemy(Math.random() * 500, -50, 0.2, enemies.length));
            break;
        case 3: 
            enemies.push(new Enemy(Math.random() * 500, 520, 0.2, enemies.length));
            break;
    } 
}

const explosion = (x, y, radius, maxScale, particleCount) => {
    for(let i = 0; i < particleCount; ++i){
        const spawnX = x + Math.random() * radius * 2 - radius;
        const spawnY = y + Math.random() * radius * 2 - radius;
        allParticles.push(new Particles(
            spawnX, 
            spawnY, 
            Math.random() * (maxScale / 2) + maxScale / 2, 
            allParticles.length, 
            greyParticles, 
            calculateAngle(x, y, spawnX, spawnY, false) + toRadians(90), 
            Math.random() * 0.2, 0));
    }
}

const getCenterX = (x, img, scale) => { return x + img.width * scale / 2; }
const getCenterY = (y, img, scale) => { return y + img.height * scale / 2; }

const toRadians = (angle) => { return angle * (Math.PI/180) }

let xPos = 250;
let yPos = 250;
let playerSpeed = 0.5;
let bullets = [];
let allParticles = [];
let enemies = [];

const main = () => {
    for(let x = 0; x < 500; x += 100){
        for(let y = 0; y < 500; y += 100){
            ctx.drawImage(background, x, y, 100, 100);
        }
    }

    if(key.up == true) yPos -= playerSpeed;
    if(key.down == true) yPos += playerSpeed;
    if(key.left == true) xPos -= playerSpeed;
    if(key.right == true) xPos += playerSpeed;

    for(let i = 0; i < allParticles.length; ++i) allParticles[i].particlesMain();
    for(let i = 0; i < bullets.length; ++i) bullets[i].bulletMain();
    for(let i = 0; i < enemies.length; ++i) enemies[i].enemyMain();

    drawImage(ctx, player, xPos, yPos, calculateAngle(xPos, yPos, mousePos.X, mousePos.Y) + toRadians(90), 0.4);
}

setInterval(main, 7);
setInterval(spawnEnemy, 2000);