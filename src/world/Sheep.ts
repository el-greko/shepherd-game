import {WorldObject} from './WorldObject';
import IObject from "./IObject";

export default class Sheep extends WorldObject {
    constructor() {
        super();
        this._maxSpeed = 150;
        this._rotationSpeed = Math.PI * 0.03;
    };

    public onCaught(chaseTarget: IObject): void {
        this._chaseTarget = chaseTarget;
        this._behaviour = 'chase';
        this.goForward(0.7);
    }

    public update(delta: number): void {
        super.update(delta);
    }

    destroy() {
        super.destroy();
        this._chaseTarget = null;
    }


}



