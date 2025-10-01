/**
 * Enemy Class
 * Simple patrolling enemy
 */
class Enemy {
    constructor(scene, x, y, minX, maxX, speed) {
        this.scene = scene;
        this.minX = minX;
        this.maxX = maxX;
        this.baseSpeed = speed;

        // Create enemy sprite
        this.sprite = scene.physics.add.sprite(x, y, null);
        this.sprite.setSize(30, 30);
        this.sprite.setDisplaySize(30, 30);

        // Draw enemy
        this.createEnemyGraphics();

        this.sprite.setVelocityX(this.baseSpeed);
        this.sprite.body.setAllowGravity(true);
    }

    createEnemyGraphics() {
        const graphics = this.scene.add.graphics();

        // Body
        graphics.fillStyle(0x8B0000);
        graphics.fillRect(0, 0, 30, 30);

        // Eyes
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(5, 8, 8, 8);
        graphics.fillRect(17, 8, 8, 8);

        graphics.fillStyle(0x000000);
        graphics.fillRect(8, 11, 3, 3);
        graphics.fillRect(20, 11, 3, 3);

        graphics.generateTexture('enemy', 30, 30);
        graphics.destroy();

        this.sprite.setTexture('enemy');
    }

    update() {
        // Patrol between minX and maxX
        if (this.sprite.x <= this.minX || this.sprite.x >= this.maxX) {
            this.sprite.setVelocityX(-this.sprite.body.velocity.x);
        }

        // Flip sprite based on direction
        this.sprite.setFlipX(this.sprite.body.velocity.x < 0);
    }

    defeat() {
        // Play defeat animation and remove
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 200,
            onComplete: () => {
                this.sprite.destroy();
            }
        });
    }

    destroy() {
        this.sprite.destroy();
    }
}
