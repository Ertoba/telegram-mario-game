/**
 * Player Class
 * Handles player physics, movement, and jump mechanics with coyote time and jump buffering
 */
class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create player sprite
        this.sprite = scene.physics.add.sprite(x, y, null);
        this.sprite.setSize(GameConfig.player.width, GameConfig.player.height);
        this.sprite.setDisplaySize(GameConfig.player.width, GameConfig.player.height);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0);
        this.sprite.setMaxVelocity(GameConfig.physics.maxHorizontalSpeed, 2000);

        // Draw player appearance
        this.createPlayerGraphics();

        // Jump mechanics
        this.isGrounded = false;
        this.coyoteTimeCounter = 0;
        this.jumpBufferCounter = 0;
        this.jumpHoldTime = 0;
        this.isJumping = false;
        this.jumpPressed = false;

        // State
        this.direction = 1; // 1 = right, -1 = left
        this.isInvincible = false;
        this.invincibleTimer = 0;

        // Input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Touch input state (controlled by TouchControls)
        this.touchInput = {
            left: false,
            right: false,
            jump: false
        };
    }

    createPlayerGraphics() {
        const graphics = this.scene.add.graphics();

        // Body
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(8, 16, 16, 16);

        // Head
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(8, 8, 16, 8);

        // Cap
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(6, 4, 20, 6);

        // Legs
        graphics.fillStyle(0x0000FF);
        graphics.fillRect(10, 32, 6, 12);
        graphics.fillRect(18, 32, 6, 12);

        // Eyes
        graphics.fillStyle(0x000000);
        graphics.fillRect(18, 10, 3, 3);

        graphics.generateTexture('player', 32, 48);
        graphics.destroy();

        this.sprite.setTexture('player');
    }

    update(delta) {
        const dt = delta / 1000; // Convert to seconds

        // Check if grounded
        this.isGrounded = this.sprite.body.blocked.down || this.sprite.body.touching.down;

        // Update coyote time
        if (this.isGrounded) {
            this.coyoteTimeCounter = GameConfig.physics.coyoteTime;
        } else {
            this.coyoteTimeCounter -= dt;
        }

        // Update jump buffer
        if (this.jumpBufferCounter > 0) {
            this.jumpBufferCounter -= dt;
        }

        // Handle horizontal movement
        this.handleHorizontalMovement();

        // Handle jumping
        this.handleJump(dt);

        // Update invincibility
        if (this.isInvincible) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
                this.sprite.clearTint();
            } else {
                // Flash effect
                this.sprite.setTint(Math.floor(this.invincibleTimer * 10) % 2 === 0 ? 0xffffff : 0xff0000);
            }
        }

        // Flip sprite based on direction
        this.sprite.setFlipX(this.direction < 0);
    }

    handleHorizontalMovement() {
        const left = this.cursors.left.isDown || this.keys.A.isDown || this.touchInput.left;
        const right = this.cursors.right.isDown || this.keys.D.isDown || this.touchInput.right;

        if (left && !right) {
            this.sprite.setAccelerationX(-GameConfig.physics.horizontalAcceleration);
            this.direction = -1;
        } else if (right && !left) {
            this.sprite.setAccelerationX(GameConfig.physics.horizontalAcceleration);
            this.direction = 1;
        } else {
            this.sprite.setAccelerationX(0);
            // Apply drag
            const currentVelX = this.sprite.body.velocity.x;
            if (Math.abs(currentVelX) > 0) {
                const dragSign = currentVelX > 0 ? -1 : 1;
                const newVelX = currentVelX + dragSign * GameConfig.physics.horizontalDrag * (1/60);
                if (Math.sign(newVelX) !== Math.sign(currentVelX)) {
                    this.sprite.setVelocityX(0);
                } else {
                    this.sprite.setVelocityX(newVelX);
                }
            }
        }
    }

    handleJump(dt) {
        const jumpButton = this.cursors.up.isDown ||
                          this.cursors.space.isDown ||
                          this.keys.W.isDown ||
                          this.keys.SPACE.isDown ||
                          this.touchInput.jump;

        // Jump buffer
        if (jumpButton && !this.jumpPressed) {
            this.jumpBufferCounter = GameConfig.physics.jumpBufferTime;
        }

        this.jumpPressed = jumpButton;

        // Start jump (coyote time allows jump shortly after leaving platform)
        if (this.jumpBufferCounter > 0 && this.coyoteTimeCounter > 0 && !this.isJumping) {
            this.startJump();
        }

        // Variable height jump
        if (this.isJumping) {
            this.jumpHoldTime += dt;

            // If button released before threshold, cut jump short
            if (!jumpButton && this.jumpHoldTime < GameConfig.physics.variableJumpThreshold) {
                if (this.sprite.body.velocity.y < 0) {
                    this.sprite.setVelocityY(this.sprite.body.velocity.y * GameConfig.physics.shortJumpMultiplier);
                }
                this.isJumping = false;
            }

            // End jump when reaching peak or landing
            if (this.sprite.body.velocity.y >= 0 || this.isGrounded) {
                this.isJumping = false;
            }
        }
    }

    startJump() {
        this.sprite.setVelocityY(GameConfig.physics.jumpVelocity);
        this.isJumping = true;
        this.jumpHoldTime = 0;
        this.jumpBufferCounter = 0;
        this.coyoteTimeCounter = 0;

        // Play jump sound
        if (this.scene.audioManager) {
            this.scene.audioManager.playJump();
        }
    }

    bounceOnEnemy() {
        this.sprite.setVelocityY(GameConfig.player.enemyBounceVelocity);
        this.isJumping = false;
    }

    takeDamage() {
        if (this.isInvincible) return false;

        this.isInvincible = true;
        this.invincibleTimer = GameConfig.player.invincibilityTime;

        if (this.scene.audioManager) {
            this.scene.audioManager.playHit();
        }

        // Knockback
        this.sprite.setVelocity(-this.direction * 200, -300);

        return true;
    }

    setInvincible(duration) {
        this.isInvincible = true;
        this.invincibleTimer = duration;
    }

    push(forceX, forceY) {
        this.sprite.setVelocity(forceX, forceY);
    }

    reset(x, y) {
        this.sprite.setPosition(x, y);
        this.sprite.setVelocity(0, 0);
        this.sprite.setAcceleration(0, 0);
        this.isGrounded = false;
        this.isJumping = false;
        this.coyoteTimeCounter = 0;
        this.jumpBufferCounter = 0;
        this.jumpHoldTime = 0;
    }

    destroy() {
        this.sprite.destroy();
    }
}
