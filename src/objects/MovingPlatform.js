/**
 * MovingPlatform Class
 * Platform that moves horizontally or vertically
 */
class MovingPlatform {
    constructor(scene, startX, startY, endX, endY, width, height, speed) {
        this.scene = scene;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.speed = speed;

        // Create platform sprite
        this.sprite = scene.physics.add.sprite(startX, startY, null);
        this.sprite.setSize(width, height);
        this.sprite.setDisplaySize(width, height);
        this.sprite.body.setImmovable(true);
        this.sprite.body.setAllowGravity(false);

        // Draw platform
        this.createPlatformGraphics(width, height);

        // Set up movement tween
        this.tween = scene.tweens.add({
            targets: this.sprite,
            x: endX,
            y: endY,
            duration: Phaser.Math.Distance.Between(startX, startY, endX, endY) / speed * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }

    createPlatformGraphics(width, height) {
        const key = `platform_${width}_${height}`;

        if (!this.scene.textures.exists(key)) {
            const graphics = this.scene.add.graphics();
            graphics.fillStyle(0x228B22);
            graphics.fillRect(0, 0, width, height);

            // Add texture lines
            graphics.lineStyle(2, 0x1a6b1a);
            for (let i = 0; i < width; i += 20) {
                graphics.lineBetween(i, 0, i, height);
            }

            graphics.generateTexture(key, width, height);
            graphics.destroy();
        }

        this.sprite.setTexture(key);
    }

    update() {
        // Phaser tweens handle movement automatically
        // Update body velocity for proper player collision
        if (this.sprite.body.prev) {
            const dx = this.sprite.x - this.sprite.body.prev.x;
            const dy = this.sprite.y - this.sprite.body.prev.y;
            this.sprite.body.setVelocity(dx * 60, dy * 60);
        }
    }

    destroy() {
        if (this.tween) {
            this.tween.remove();
        }
        this.sprite.destroy();
    }
}
