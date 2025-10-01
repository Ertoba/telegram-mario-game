/**
 * BootScene - Initial scene for loading assets and initializing audio
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Initialize audio manager
        this.audioManager = new AudioManager(this);

        // Store audio manager globally for other scenes
        this.registry.set('audioManager', this.audioManager);

        // Proceed to menu
        this.scene.start('MenuScene');
    }
}
