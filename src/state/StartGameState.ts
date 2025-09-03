import BaseState from './BaseState';
import {Container, TextStyle, Text, Graphics} from "pixi.js";
import EventManager from "../managers/EventManager";

export default class StartGameState extends BaseState {
    public static NAME: string = 'StartGameState';
    private titleText!: Text;
    private subtitleText!: Text;
    private background!: Graphics;

    public onEnter(): void {
        super.onEnter();
        this.container.once('pointerdown', () => {
            EventManager.instance.emit('START_GAME_EVENT');
        });
        this.background = this.createBackground(0x006400);
        this.createTitleTexts(window.innerWidth, window.innerHeight);

        this.container.addChild(this.background);
        this.container.addChild(this.titleText, this.subtitleText);
        this.container.interactive = true;

    }

    public async onExecute(): Promise<void> {
        void super.onExecute();
        await EventManager.instance.waitEvent('START_GAME_EVENT');
    }

    public onComplete(): void {
        super.onComplete();
        this.container.removeChild(this.background);
        this.container.removeChild(this.titleText, this.subtitleText);
        this.container.interactive = false;
    }


    private createTitleTexts(screenWidth: number, screenHeight: number) {

        if(this.titleText && this.subtitleText) return;

        const titleStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 64,
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center',
        });

        const subtitleStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#dddddd',
            align: 'center',
        });

        this.titleText = new Text({text: 'SHEPHERD GAME', style: titleStyle});
        this.subtitleText = new Text({text: 'TAP TO START', style: subtitleStyle});

        this.titleText.anchor.set(0.5);
        this.titleText.x = screenWidth / 2;
        this.titleText.y = screenHeight / 3;

        this.subtitleText.anchor.set(0.5);
        this.subtitleText.x = screenWidth / 2;
        this.subtitleText.y = this.titleText.y + 80;


    }
}



