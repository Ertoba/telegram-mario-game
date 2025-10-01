/**
 * Dragon Boss Class
 * Implements multi-phase boss with various attack patterns
 */
class Dragon {
    constructor(scene, x, y) {
        this.scene = scene;
        this.config = GameConfig.dragon;

        // Create dragon sprite
        this.sprite = scene.physics.add.sprite(x, y, null);
        this.sprite.setSize(this.config.width, this.config.height);
        this.sprite.setDisplaySize(this.config.width, this.config.height);
        this.sprite.body.setAllowGravity(false);
        this.sprite.body.setImmovable(true);

        // Draw dragon
        this.createDragonGraphics();

        // State
        this.hp = this.config.maxHP;
        this.maxHP = this.config.maxHP;
        this.currentPhase = 0;
        this.isDefeated = false;

        // Attack state
        this.attackTimers = {};
        this.lastAttackTime = {};
        this.isAttacking = false;
        this.weakPointVisible = false;
        this.weakPointTimer = 0;

        // Attack groups
        this.fireballs = scene.physics.add.group();
        this.flameTraps = [];

        // Weak point
        this.weakPoint = null;

        // Initialize attack timers
        this.resetAttackTimers();

        // Start weak point cycle
        this.scheduleWeakPoint();
    }

    createDragonGraphics() {
        const w = this.config.width;
        const h = this.config.height;
        const graphics = this.scene.add.graphics();

        // Body
        graphics.fillStyle(0x8B0000);
        graphics.fillRect(0, 0, w * 0.7, h * 0.6);

        // Head
        graphics.fillStyle(0xA52A2A);
        graphics.fillRect(w * 0.6, 0, w * 0.4, h * 0.4);

        // Eyes
        graphics.fillStyle(0xFFFF00);
        graphics.fillCircle(w * 0.75, h * 0.15, 8);
        graphics.fillCircle(w * 0.85, h * 0.15, 8);

        // Horns
        graphics.fillStyle(0x654321);
        graphics.fillTriangle(
            w * 0.72, h * 0.05,
            w * 0.75, -5,
            w * 0.78, h * 0.05
        );
        graphics.fillTriangle(
            w * 0.82, h * 0.05,
            w * 0.85, -5,
            w * 0.88, h * 0.05
        );

        // Wings
        graphics.fillStyle(0x5B0000);
        graphics.fillTriangle(
            w * 0.1, h * 0.2,
            -10, h * 0.3,
            w * 0.15, h * 0.5
        );
        graphics.fillTriangle(
            w * 0.2, h * 0.25,
            -5, h * 0.4,
            w * 0.25, h * 0.55
        );

        // Tail
        graphics.fillStyle(0x8B0000);
        graphics.fillRect(0, h * 0.5, w * 0.3, h * 0.15);

        graphics.generateTexture('dragon', w, h);
        graphics.destroy();

        this.sprite.setTexture('dragon');
    }

    resetAttackTimers() {
        const attacks = this.config.attacks;
        this.lastAttackTime = {
            fireballVolley: Date.now() - attacks.fireballVolley.cooldown,
            tailSwipe: Date.now() - attacks.tailSwipe.cooldown,
            roar: Date.now() - attacks.roar.cooldown,
            flameTrap: Date.now() - attacks.flameTrap.cooldown
        };
    }

    update(time, delta) {
        if (this.isDefeated) return;

        const dt = delta / 1000;

        // Update phase based on HP
        this.updatePhase();

        // Weak point timer
        if (this.weakPointVisible) {
            this.weakPointTimer -= dt;
            if (this.weakPointTimer <= 0) {
                this.hideWeakPoint();
            }
        }

        // Attack logic
        if (!this.isAttacking) {
            this.decideAttack(time);
        }

        // Update fireballs
        this.fireballs.children.entries.forEach(fireball => {
            if (fireball.x < -50 || fireball.x > this.scene.game.registry.get('gameWidth') + 50) {
                fireball.destroy();
            }
        });

        // Update flame traps
        this.flameTraps = this.flameTraps.filter(trap => {
            if (trap.active) {
                trap.timer -= dt;
                if (trap.timer <= 0) {
                    trap.sprite.destroy();
                    return false;
                }
            }
            return true;
        });

        // Idle animation
        this.sprite.y += Math.sin(time / 500) * 0.3;
    }

    updatePhase() {
        const hpPercent = this.hp / this.maxHP;
        const phases = this.config.phases;

        for (let i = phases.length - 1; i >= 0; i--) {
            if (hpPercent <= phases[i].threshold) {
                if (this.currentPhase !== i) {
                    this.currentPhase = i;
                    this.onPhaseChange(i);
                }
                break;
            }
        }
    }

    onPhaseChange(phase) {
        // Flash effect
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xff0000,
            duration: 200,
            yoyo: true,
            repeat: 3
        });

        if (this.scene.audioManager) {
            this.scene.audioManager.playRoar();
        }
    }

    decideAttack(time) {
        const attacks = this.config.attacks;
        const phaseMultiplier = this.config.phases[this.currentPhase].attackSpeedMultiplier;
        const availableAttacks = [];

        // Check which attacks are off cooldown
        if (time - this.lastAttackTime.fireballVolley > attacks.fireballVolley.cooldown / phaseMultiplier) {
            availableAttacks.push('fireballVolley');
        }
        if (time - this.lastAttackTime.tailSwipe > attacks.tailSwipe.cooldown / phaseMultiplier) {
            availableAttacks.push('tailSwipe');
        }
        if (time - this.lastAttackTime.roar > attacks.roar.cooldown / phaseMultiplier) {
            availableAttacks.push('roar');
        }
        if (this.currentPhase >= attacks.flameTrap.activatesAtPhase &&
            time - this.lastAttackTime.flameTrap > attacks.flameTrap.cooldown / phaseMultiplier) {
            availableAttacks.push('flameTrap');
        }

        // Choose random attack
        if (availableAttacks.length > 0) {
            const attack = Phaser.Utils.Array.GetRandom(availableAttacks);
            this.executeAttack(attack, time);
        }
    }

    executeAttack(attackName, time) {
        this.isAttacking = true;
        this.lastAttackTime[attackName] = time;

        switch (attackName) {
            case 'fireballVolley':
                this.attackFireballVolley();
                break;
            case 'tailSwipe':
                this.attackTailSwipe();
                break;
            case 'roar':
                this.attackRoar();
                break;
            case 'flameTrap':
                this.attackFlameTrap();
                break;
        }
    }

    attackFireballVolley() {
        const config = this.config.attacks.fireballVolley;

        // Telegraph
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xff6600,
            duration: config.telegraphTime,
            onComplete: () => {
                // Fire projectiles
                const playerX = this.scene.player.sprite.x;
                for (let i = 0; i < config.count; i++) {
                    this.scene.time.delayedCall(i * 300, () => {
                        this.fireProjectile(playerX);
                    });
                }

                this.sprite.clearTint();
                this.isAttacking = false;
            }
        });
    }

    fireProjectile(targetX) {
        if (this.isDefeated) return;

        const fireball = this.fireballs.create(this.sprite.x, this.sprite.y, null);

        // Create fireball texture
        if (!this.scene.textures.exists('fireball')) {
            const graphics = this.scene.add.graphics();
            graphics.fillStyle(0xFF4500);
            graphics.fillCircle(15, 15, 15);
            graphics.fillStyle(0xFFFF00);
            graphics.fillCircle(15, 15, 8);
            graphics.generateTexture('fireball', 30, 30);
            graphics.destroy();
        }

        fireball.setTexture('fireball');
        fireball.setSize(20, 20);

        // Aim at player's position
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, targetX, this.scene.player.sprite.y);
        const velocityX = Math.cos(angle) * this.config.attacks.fireballVolley.speed;
        const velocityY = Math.sin(angle) * this.config.attacks.fireballVolley.speed;

        fireball.setVelocity(velocityX, velocityY);
        fireball.body.setAllowGravity(false);

        if (this.scene.audioManager) {
            this.scene.audioManager.playFireball();
        }

        // Rotate fireball
        this.scene.tweens.add({
            targets: fireball,
            angle: 360,
            duration: 1000,
            repeat: -1
        });
    }

    attackTailSwipe() {
        const config = this.config.attacks.tailSwipe;

        // Tail swipe animation
        this.scene.tweens.add({
            targets: this.sprite,
            angle: -15,
            duration: config.duration / 2,
            yoyo: true,
            onComplete: () => {
                this.isAttacking = false;
            }
        });

        // Check if player is in range
        this.scene.time.delayedCall(config.duration / 2, () => {
            const distance = Phaser.Math.Distance.Between(
                this.sprite.x, this.sprite.y,
                this.scene.player.sprite.x, this.scene.player.sprite.y
            );

            if (distance < config.range) {
                this.scene.playerHitByBoss();
            }
        });
    }

    attackRoar() {
        const config = this.config.attacks.roar;

        if (this.scene.audioManager) {
            this.scene.audioManager.playRoar();
        }

        // Visual effect
        this.scene.cameras.main.shake(500, 0.01);

        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            onComplete: () => {
                this.isAttacking = false;
            }
        });

        // Push player back
        const pushDirection = this.scene.player.sprite.x < this.sprite.x ? -1 : 1;
        this.scene.player.push(pushDirection * config.pushbackForce, -200);
        this.scene.player.setInvincible(config.invulnerabilityFrames);
    }

    attackFlameTrap() {
        const config = this.config.attacks.flameTrap;
        const gameWidth = this.scene.game.registry.get('gameWidth');
        const gameHeight = this.scene.game.registry.get('gameHeight');

        for (let i = 0; i < config.count; i++) {
            const x = Phaser.Math.Between(gameWidth * 0.1, gameWidth * 0.9);
            const y = gameHeight - 80;

            const trap = this.scene.add.rectangle(x, y, 60, 40, 0xFF4500, 0.7);
            this.scene.physics.world.enable(trap);
            trap.body.setAllowGravity(false);

            this.flameTraps.push({
                sprite: trap,
                timer: config.duration / 1000,
                active: true
            });

            // Animate trap
            this.scene.tweens.add({
                targets: trap,
                alpha: 0.3,
                duration: 300,
                yoyo: true,
                repeat: -1
            });
        }

        this.isAttacking = false;
    }

    scheduleWeakPoint() {
        this.scene.time.delayedCall(this.config.weakPoint.showInterval, () => {
            if (!this.isDefeated) {
                this.showWeakPoint();
                this.scene.time.delayedCall(this.config.weakPoint.showDuration, () => {
                    this.scheduleWeakPoint();
                });
            }
        });
    }

    showWeakPoint() {
        if (this.weakPointVisible || this.isDefeated) return;

        this.weakPointVisible = true;
        this.weakPointTimer = this.config.weakPoint.showDuration / 1000;

        // Create weak point sprite
        if (!this.scene.textures.exists('weakpoint')) {
            const graphics = this.scene.add.graphics();
            graphics.fillStyle(0xFFFF00);
            graphics.fillCircle(15, 15, 15);
            graphics.fillStyle(0xFF0000);
            graphics.fillCircle(15, 15, 5);
            graphics.generateTexture('weakpoint', 30, 30);
            graphics.destroy();
        }

        this.weakPoint = this.scene.physics.add.sprite(
            this.sprite.x + 20,
            this.sprite.y - 20,
            'weakpoint'
        );
        this.weakPoint.body.setAllowGravity(false);
        this.weakPoint.setSize(25, 25);

        // Pulse animation
        this.scene.tweens.add({
            targets: this.weakPoint,
            scale: 1.3,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    hideWeakPoint() {
        if (this.weakPoint) {
            this.weakPoint.destroy();
            this.weakPoint = null;
        }
        this.weakPointVisible = false;
    }

    hitWeakPoint() {
        if (!this.weakPointVisible || this.isDefeated) return false;

        this.takeDamage(this.config.weakPoint.damagePerHit);
        this.hideWeakPoint();

        // Flash
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xffffff,
            duration: this.config.weakPoint.flashDuration,
            yoyo: true
        });

        if (this.scene.audioManager) {
            this.scene.audioManager.playBossHit();
        }

        return true;
    }

    takeDamage(amount) {
        this.hp -= amount;

        if (this.hp <= 0 && !this.isDefeated) {
            this.defeat();
        }
    }

    defeat() {
        this.isDefeated = true;
        this.hideWeakPoint();

        // Stop all attacks
        this.fireballs.clear(true, true);
        this.flameTraps.forEach(trap => trap.sprite.destroy());
        this.flameTraps = [];

        // Death animation
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            angle: 90,
            y: this.sprite.y + 100,
            duration: 2000,
            onComplete: () => {
                this.sprite.destroy();
                this.scene.bossDefeated();
            }
        });
    }

    getHPPercent() {
        return this.hp / this.maxHP;
    }

    destroy() {
        if (this.weakPoint) {
            this.weakPoint.destroy();
        }
        this.fireballs.clear(true, true);
        this.flameTraps.forEach(trap => trap.sprite.destroy());
        this.sprite.destroy();
    }
}
