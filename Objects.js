"use strict";

class Bullet {
  constructor(angle, x, y, speed, index, isEnemy = false) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.index = index;
    this.timer = 0;
    this.isEnemy = isEnemy;
  }

  bulletMain() {
    drawImage(ctx, bullet, this.x, this.y, this.angle, 0.1);
    this.x += this.speed * Math.cos(this.angle) * hzCoef * timeCoef;
    this.y += this.speed * Math.sin(this.angle) * hzCoef * timeCoef;

    if (
      this.x < -10 ||
      this.x > canvas.width + 10 ||
      this.y < -10 ||
      this.y > canvas.height + 10
    ) {
      this.destroy();
    }

    if (this.timer <= 0) {
      allParticles.push(
        new Particles(
          getCenterX(this.x, bullet, 0.1),
          getCenterY(this.y, bullet, 0.1),
          0.1,
          allParticles.length,
          particles
        )
      );
      this.timer = 1;
    }

    this.timer -= 0.5 * hzCoef * timeCoef;
  }

  destroy() {
    explosion(
      getCenterX(this.x, bullet, 0.1),
      getCenterY(this.y, bullet, 0.1),
      3,
      0.1,
      5
    );
    bullets.splice(this.index, 1);
    objectDestroyed(this.index, bullets);
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
    if (this.spawnTimer < 0)
      drawImage(ctx, this.img, this.x, this.y, 0, this.scale);
    else this.spawnTimer -= 0.2 * hzCoef * timeCoef;
    this.scale -= 0.002 * hzCoef * timeCoef;

    this.x += this.speed * Math.cos(this.angle) * hzCoef * timeCoef;
    this.y += this.speed * Math.sin(this.angle) * hzCoef * timeCoef;

    if (this.scale <= 0) {
      allParticles.splice(this.index, 1);
      objectDestroyed(this.index, allParticles);
    }
  }
}

class Enemy {
  constructor(x, y, speed, index) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.speed = speed;
    this.index = index;
    this.shootDelay = Math.random() * 20 + 10;
    this.isSpawned = false;
    this.spawnerAngle = 0;
    this.scale = 0;
    this.spawnerScale = 0;
    this.interval;
  }

  enemyMain() {
    this.angle =
      calculateAngle(this.x, this.y, xPos, yPos, false) + toRadians(90);

    if (this.isSpawned) {
      if (playerIsAlive) {
        this.x += this.speed * Math.cos(this.angle) * hzCoef * timeCoef;
        this.y += this.speed * Math.sin(this.angle) * hzCoef * timeCoef;
        this.shootDelay -= 0.1 * hzCoef * timeCoef;

        if (this.shootDelay <= 0) {
          bullets.push(
            new Bullet(
              this.angle,
              getCenterX(this.x, player, 0.4),
              getCenterY(this.y, player, 0.4),
              1,
              bullets.length,
              true
            )
          );
          this.shootDelay = Math.random() * 20 + 10;
        }

        if (this.spawnerScale > 0) this.scaleDownSpawner();
      }
    } else this.renderSpawner();
    drawImage(ctx, player, this.x, this.y, this.angle, this.scale);

    this.detectCollision();
  }

  renderSpawner() {
    drawImage(
      ctx,
      spawner,
      this.x,
      this.y,
      this.spawnerAngle,
      this.spawnerScale,
      true
    );

    this.spawnerAngle += 0.1 * hzCoef * timeCoef;
    if (this.spawnerScale < 0.15)
      this.spawnerScale += 0.0015 * hzCoef * timeCoef;
    else this.scale += 0.005 * hzCoef * timeCoef;

    if (this.scale >= 0.4) this.isSpawned = true;
  }

  scaleDownSpawner() {
    drawImage(
      ctx,
      spawner,
      this.x,
      this.y,
      this.spawnerAngle,
      this.spawnerScale,
      true
    );

    this.spawnerAngle += 0.1 * hzCoef * timeCoef;
    if (this.spawnerScale > 0) this.spawnerScale -= 0.002 * hzCoef * timeCoef;
    else clearInterval(this.interval);
  }

  detectCollision() {
    for (let i = 0; i < bullets.length; ++i) {
      const centerX = getCenterX(this.x, player, 0.4);
      const centerY = getCenterY(this.y, player, 0.4);
      if (
        Math.sqrt(
          Math.pow(bullets[i].x - centerX, 2) +
            Math.pow(bullets[i].y - centerY, 2)
        ) < 20 &&
        !bullets[i].isEnemy
      ) {
        explosion(centerX, centerY, 10, 0.5, 15);
        enemies.splice(this.index, 1);
        objectDestroyed(this.index, enemies);
        bullets[i].destroy();

        if (enemyMaxSpawnTimer > 500) enemyMaxSpawnTimer -= 20;
      }
    }
  }
}
