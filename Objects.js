'use strict';

class Bullet {
    constructor(angle, x, y, speed, index) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.index = index;
        this.timer = 0;
    }

    bulletMain() {
        drawImage(ctx, bullet, this.x, this.y, this.angle, 0.1);
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        if(this.x < -10 || this.x > 510 || this.y < -10 || this.y > 510){
            this.destroy();
        }

        if(this.timer <= 0) {
            allParticles.push(new Particles(getCenterX(this.x, bullet, 0.1), getCenterY(this.y, bullet, 0.1), 0.1, allParticles.length, particles));
            this.timer = 1;
        }

        this.timer -= 0.5;
    }

    destroy() {
        bullets.splice(this.index, 1);
        bulletDestroyed(this.index);
    }

    changeIndex() {
        this.index -= 1;
    }
}

class Particles {
    constructor(x, y, scale, index, img, angle = 0, speed = 0, spawnTimer = 0.8) {
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.spawnTimer = spawnTimer;
        this.index = index;
        this.img = img;
        this.speed = speed;
        this.angle = angle;
    }

    particlesMain() {
        if(this.spawnTimer < 0) drawImage(ctx, this.img, this.x, this.y, 0, this.scale);
        else this.spawnTimer -= 0.2;
        this.scale -= 0.002;

        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        
        if(this.scale <= 0){
            allParticles.splice(this.index, 1);
            particleDestroyed(this.index);
        }
    }

    changeIndex() {
        this.index -= 1;
    }
}

class Enemy {
    constructor(x, y, speed, index){
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.speed = speed;
        this.index = index;
    }

    enemyMain() {
        this.angle = calculateAngle(this.x, this.y, xPos, yPos, false) + toRadians(90);
        drawImage(ctx, player, this.x, this.y, this.angle, 0.4);
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        this.detectCollision();
    }

    detectCollision() {
        for(let i = 0; i < bullets.length; ++i){
            const centerX = getCenterX(this.x, player, 0.4);
            const centerY = getCenterY(this.y, player, 0.4);
            if(Math.sqrt(Math.pow(bullets[i].x - centerX, 2) + Math.pow(bullets[i].y - centerY, 2)) < 20){
                explosion(centerX, centerY, 10, 0.5, 15);
                enemies.splice(this.index, 1);
                enemyDestroyed(this.index);
                bullets[i].destroy();
            }
        }
    }

    changeIndex() {
        this.index -= 1;
    }
}