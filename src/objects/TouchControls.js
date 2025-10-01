/**
 * TouchControls Class
 * Creates and manages touch buttons for mobile gameplay
 */
class TouchControls {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        const gameWidth = scene.game.registry.get('gameWidth');
        const gameHeight = scene.game.registry.get('gameHeight');

        const buttonSize = GameConfig.ui.buttonSize;
        const margin = GameConfig.ui.safeAreaMargin;

        // Create left button
        this.leftButton = this.createButton(
            margin + buttonSize / 2,
            gameHeight - margin - buttonSize / 2,
            buttonSize,
            '◄'
        );

        // Create right button
        this.rightButton = this.createButton(
            margin + buttonSize * 1.5 + 10,
            gameHeight - margin - buttonSize / 2,
            buttonSize,
            '►'
        );

        // Create jump button
        this.jumpButton = this.createButton(
            gameWidth - margin - buttonSize / 2,
            gameHeight - margin - buttonSize / 2,
            buttonSize,
            '▲'
        );

        this.setupButtonInteractions();
    }

    createButton(x, y, size, text) {
        // Circle background
        const circle = this.scene.add.circle(x, y, size / 2, 0xffffff);
        circle.setAlpha(GameConfig.ui.buttonOpacity);
        circle.setScrollFactor(0);
        circle.setDepth(1000);
        circle.setInteractive();

        // Border
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(3, 0xffffff, 1);
        graphics.strokeCircle(x, y, size / 2);
        graphics.setScrollFactor(0);
        graphics.setDepth(1000);

        // Text label
        const label = this.scene.add.text(x, y, text, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        label.setOrigin(0.5);
        label.setScrollFactor(0);
        label.setDepth(1001);

        return { circle, graphics, label, pressed: false };
    }

    setupButtonInteractions() {
        // Left button
        this.leftButton.circle.on('pointerdown', () => {
            this.leftButton.pressed = true;
            this.leftButton.circle.setAlpha(GameConfig.ui.buttonPressedOpacity);
            this.player.touchInput.left = true;
        });

        this.leftButton.circle.on('pointerup', () => {
            this.leftButton.pressed = false;
            this.leftButton.circle.setAlpha(GameConfig.ui.buttonOpacity);
            this.player.touchInput.left = false;
        });

        this.leftButton.circle.on('pointerout', () => {
            if (this.leftButton.pressed) {
                this.leftButton.pressed = false;
                this.leftButton.circle.setAlpha(GameConfig.ui.buttonOpacity);
                this.player.touchInput.left = false;
            }
        });

        // Right button
        this.rightButton.circle.on('pointerdown', () => {
            this.rightButton.pressed = true;
            this.rightButton.circle.setAlpha(GameConfig.ui.buttonPressedOpacity);
            this.player.touchInput.right = true;
        });

        this.rightButton.circle.on('pointerup', () => {
            this.rightButton.pressed = false;
            this.rightButton.circle.setAlpha(GameConfig.ui.buttonOpacity);
            this.player.touchInput.right = false;
        });

        this.rightButton.circle.on('pointerout', () => {
            if (this.rightButton.pressed) {
                this.rightButton.pressed = false;
                this.rightButton.circle.setAlpha(GameConfig.ui.buttonOpacity);
                this.player.touchInput.right = false;
            }
        });

        // Jump button
        this.jumpButton.circle.on('pointerdown', () => {
            this.jumpButton.pressed = true;
            this.jumpButton.circle.setAlpha(GameConfig.ui.buttonPressedOpacity);
            this.player.touchInput.jump = true;
        });

        this.jumpButton.circle.on('pointerup', () => {
            this.jumpButton.pressed = false;
            this.jumpButton.circle.setAlpha(GameConfig.ui.buttonOpacity);
            this.player.touchInput.jump = false;
        });

        this.jumpButton.circle.on('pointerout', () => {
            if (this.jumpButton.pressed) {
                this.jumpButton.pressed = false;
                this.jumpButton.circle.setAlpha(GameConfig.ui.buttonOpacity);
                this.player.touchInput.jump = false;
            }
        });
    }

    destroy() {
        [this.leftButton, this.rightButton, this.jumpButton].forEach(button => {
            button.circle.destroy();
            button.graphics.destroy();
            button.label.destroy();
        });
    }
}
