import BaseState from './BaseState';
import {Graphics, Point, Text, TextStyle,} from "pixi.js";
import EventManager from "../managers/EventManager";
import Yard from "../world/Yard";
import Shepherd, {SHEPHERD_MOVE_EVENT} from "../world/Shepherd";
import Sheep from "../world/Sheep";
import IObject from "../world/IObject";
import StateManager from "../managers/StateManager";
import FinalGameState from "./FinalGameState";

export default class GameRoundState extends BaseState {
    public static NAME: string = 'GameRoundState';
    private background!: Graphics;
    private readonly MAX_SHEEPS_ON_FIELD = 10;
    private readonly START_SHEEPS_ON_FIELD = 5;
    private readonly SHEEPS_SPAWN_INTERVAL = 5;
    private readonly SHEEPS_SPAWN_RANDOM_INTERVAL = 3;
    private sheepsCaught: number = 0;
    private sheepsBorn: number = 0;

    private yard!: Yard;
    private shepherd!: Shepherd;
    private sheeps: Sheep[] = [];
    private caughtSheeps: Sheep[] = [];
    private _timeToSheepSpawn: number = -1;

    private uiTextLabel!: Text;
    private uiTextCounter!: Text;

    public onEnter(): void {
        super.onEnter();
        this.container.interactive = true;
        this.container.on('pointerdown', this.onShephNewPosition.bind(this));
        this.background = this.createBackground(0x006400);
        this.container.addChild(this.background);
        this.yard = this.createYard(200, 200);
        this.addShepherd(window.innerWidth * 0.7, window.innerHeight * 0.8);
        for (let i = 0; i < this.START_SHEEPS_ON_FIELD; i++) {
            this.addSheepRandomPosition();
        }
        this.startSheepSpawnTimer();

        this.createUI();
        this.updateUICounter();
    }

    public async onExecute(): Promise<void> {
        void super.onExecute();
        await EventManager.instance.waitEvent('END_ROUND_EVENT');
    }

    public onComplete(): void {
        super.onComplete();
        this.cleanup();

    }

    private cleanup(): void {

        this.container.off('pointerdown', this.onShephNewPosition.bind(this));
        this.container.interactive = false;

        this.cleanupGameObjects();


        if (this.background) {
            this.container.removeChild(this.background);
            this.background.destroy();
        }
        if (this.uiTextLabel) {
            this.container.removeChild(this.uiTextLabel);
            this.uiTextLabel.destroy();
        }
        if (this.uiTextCounter) {
            this.container.removeChild(this.uiTextCounter);
            this.uiTextCounter.destroy();
        }


        this.sheeps = [];
        this.caughtSheeps = [];
        this.sheepsBorn = 0;
        this.sheepsCaught = 0;

    }

    update(delta: number): void {
        super.update(delta);
        this.checkShepherdSheepCollisions();
        this.checkSheepSpawnTimer(delta);
        this.checkSheepInYard();
    }

    startSheepSpawnTimer(): void {
        this._timeToSheepSpawn = Math.round(this.SHEEPS_SPAWN_INTERVAL + Math.random() * this.SHEEPS_SPAWN_RANDOM_INTERVAL);
    }

    private checkSheepSpawnTimer(delta: number): void {
        if( this.sheeps.length >= this.MAX_SHEEPS_ON_FIELD) {
            this.startSheepSpawnTimer();
            return;
        }
        if (this._timeToSheepSpawn >= 0) {
            this._timeToSheepSpawn -= delta;
            if (this._timeToSheepSpawn <= 0) {
                this.addSheepRandomPosition();
                this.startSheepSpawnTimer();
            }
        }
    }

    createYard(x: number, y: number): Yard {
        return this.createGameObject('Yard', new Point(x, y)) as Yard;
    }

    addSheepRandomPosition(): void {

        let x = 0;
        let y = 0;
        while ((x == 0 && y == 0) || this.isPosiitionInYard(x, y)) {
            x = 50 + Math.random() * (window.innerWidth - 100);
            y = 50 + Math.random() * (window.innerHeight - 100);

        }
        const newSheep = this.createGameObject('Sheep', new Point(x, y)) as Sheep;
        this.sheeps.push(newSheep);
        this.sheepsBorn++;
        this.updateUICounter();
    }

    private createUI(): void {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: {color: '#000000', width: 4},
        });

        this.uiTextLabel = new Text('SHEEPS:', style);
        this.uiTextLabel.x = 20;
        this.uiTextLabel.y = 20;

        this.uiTextCounter = new Text('', style);
        this.uiTextCounter.x = 150;
        this.uiTextCounter.y = 20;

        this.container.addChild(this.uiTextLabel, this.uiTextCounter);
    }

    private updateUICounter(): void {
        if (this.uiTextCounter) {
            this.uiTextCounter.text = `${this.sheepsCaught} / ${this.sheepsBorn}`;
        }
    }

    private checkSheepInYard(): void {

        for (const sheep of [...this.caughtSheeps]) {

            if (sheep.behaviour === 'chase' && this.isPosiitionInYard(sheep.position.x, sheep.position.y)) {


                this.sheepsCaught++;
                console.log(` SAVED!: ${this.sheepsCaught}`);

                sheep.destroy();
                this.removeGameObject(sheep);

                this.sheeps = this.sheeps.filter(s => s !== sheep);
                this.caughtSheeps = this.caughtSheeps.filter(s => s !== sheep);

                if (this.caughtSheeps.length > 0) {
                    const newLeader = this.caughtSheeps[0];
                    newLeader.setChaseTarget(this.shepherd);
                }
                this.updateUICounter();

                this.checkWinCondition();
            }
        }
    }

    private checkWinCondition(): void {
        if (this.sheepsCaught > 0 && this.sheepsCaught >= this.sheepsBorn) {
            const finalState = StateManager.instance.getState(FinalGameState.NAME) as FinalGameState;
            finalState.setScore(this.sheepsCaught);

            EventManager.instance.emit('END_ROUND_EVENT');
        }
    }

    private isPosiitionInYard(x: number, y: number): boolean {

        return Math.sqrt(Math.pow(x - this.yard.position.x, 2) + Math.pow(y - this.yard.position.y, 2)) < this.yard.skin.width / 2;
    }

    addShepherd(x: number, y: number): void {
        this.shepherd = this.createGameObject('Shepherd', new Point(x, y));
    }

    onShephNewPosition(e: MouseEvent): void {

        EventManager.instance.emit(SHEPHERD_MOVE_EVENT, {x: e.clientX, y: e.clientY});
    }

    private checkShepherdSheepCollisions(): void {
        for (const sheep of this.sheeps) {
            if (sheep.behaviour !== 'idle') {
                continue;
            }
            const dx = this.shepherd.position.x - sheep.position.x;
            const dy = this.shepherd.position.y - sheep.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.shepherd.caughtDistance) {
                let target: IObject;

                if (this.caughtSheeps.length === 0) {
                    target = this.shepherd;
                } else {
                    target = this.caughtSheeps[this.caughtSheeps.length - 1];
                }

                sheep.onCaught(target);
                this.caughtSheeps.push(sheep);
            }
        }
    }


}



