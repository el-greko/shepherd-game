import {Container, Graphics, Point} from "pixi.js";
import Vector2 from "../utils/Vector2";
import IObject from "./IObject";

export type BehavioursType = 'idle' | 'patrol' | 'chase' | 'moveto';

export class WorldObject{

    protected _skin: Container | Graphics | null = null;

    protected _maxSpeed = 1;
    protected _rotationSpeed = Math.PI/90;
    protected _position: Point = new Point(0, 0);
    protected _rotation = 0;
    protected _velocity: Vector2 = new Vector2(0, 0);
    protected _behaviour: BehavioursType = 'idle';
    protected _targetDestination: Point | null = null;
    protected _chaseTarget: IObject | null = null;
    protected _currentSpeed = 0;

    constructor() {
       this.addSkin();

    }

    protected addSkin(skin: Container | Graphics | null = null) {
        if(skin) {
            this._skin = skin;
        }
    }

    setPosition(px: number, py: number) {
        this._position = new Point(px, py);
        this.skin.x = px;
        this.skin.y = py;
    }

    update(dt: number) {
        switch (this._behaviour) {
            case "idle":
                this._velocity.set(0, 0);
                break;
            case "patrol":

                this._rotation += this._rotationSpeed;
                this._velocity.rotate(this._rotation);
                break;
            case "chase":
                if (!this._chaseTarget) {
                    this._behaviour = 'idle';
                    break;
                }
                const dx_chase = this._chaseTarget.position.x - this._position.x;
                const dy_chase = this._chaseTarget.position.y - this._position.y;
                const distance_chase = Math.sqrt(dx_chase * dx_chase + dy_chase * dy_chase);
                if (distance_chase < 40) {
                    this.stop();
                    break;
                } else {
                    this.goForward(0.7);
                }

                const targetAngle_chase = Math.atan2(dy_chase, dx_chase);
                let deltaAngle_chase = targetAngle_chase - this._rotation;

                if (deltaAngle_chase > Math.PI) {
                    deltaAngle_chase -= 2 * Math.PI;
                } else if (deltaAngle_chase < -Math.PI) {
                    deltaAngle_chase += 2 * Math.PI;
                }

                if (Math.abs(deltaAngle_chase) > this._rotationSpeed) {
                    this._rotation += this._rotationSpeed * Math.sign(deltaAngle_chase);
                } else {
                    this._rotation = targetAngle_chase;
                }
                const currentSpeed_chase = this._velocity.length();
                this._velocity.set(currentSpeed_chase, 0).rotate(this._rotation);

                break;
            case "moveto":
                if (!this._targetDestination) {
                    this._behaviour = 'idle';
                    break;
                }

                const dx = this._targetDestination.x - this._position.x;
                const dy = this._targetDestination.y - this._position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 1) {
                    this._targetDestination = null;
                    this._behaviour = 'idle';
                    break;
                }

                const targetAngle = Math.atan2(dy, dx);
                let deltaAngle = targetAngle - this._rotation;

                if (deltaAngle > Math.PI) {
                    deltaAngle -= 2 * Math.PI;
                } else if (deltaAngle < -Math.PI) {
                    deltaAngle += 2 * Math.PI;
                }

                if (Math.abs(deltaAngle) > this._rotationSpeed) {
                    this._rotation += this._rotationSpeed * Math.sign(deltaAngle);
                } else {
                    this._rotation = targetAngle;
                }

                const currentSpeed = this._velocity.length();
                this._velocity.set(currentSpeed, 0).rotate(this._rotation);
                break;
        }


        this._position.x += this._velocity.x * dt;
        this._position.y += this._velocity.y * dt;

        this.updateSkinLocation();


    }

    protected updateSkinLocation() {
        if(this._skin) {
            this._skin.x = this._position.x;
            this._skin.y = this._position.y;
            this._skin.rotation = this._rotation;
        }
    }

    public destroy(): void {
        if (this._skin && this._skin.parent) {
            this._skin.parent.removeChild(this._skin);
            this._skin.destroy();
        }
    }

    public setChaseTarget(target: IObject): void {
        this._chaseTarget = target;
        this._behaviour = 'chase';
    }

    public goForward(speedIndex: number = 1): void {
        const speed = this._maxSpeed * speedIndex;

        this._velocity.set(speed, 0).rotate(this._rotation);
    }

    public stop(): void {
        this._velocity.set(0, 0);
    }

    set speedIndex(velocityIndex: number) {

        this._velocity.set(this._maxSpeed * velocityIndex,0).rotate(this._rotation);
        console.log('set speedIndex', velocityIndex, this._velocity.length());
    }

    get speed(): number {
        return this._velocity.length();
    }

    get skin(): Container | Graphics {
        if(!this._skin) {
            throw new Error('Skin not set');
        }
        return this._skin;
    }

    set skin(value: Container | Graphics) {
        this._skin = value;
        this.updateSkinLocation();
    }

    get behaviour(): BehavioursType {
        return this._behaviour;
    }

    get position(): Point {
        return this._position;
    }

}
