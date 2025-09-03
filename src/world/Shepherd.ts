import { WorldObject } from './WorldObject';
import EventManager from "../managers/EventManager";
import Vector2 from "../utils/Vector2";
import {Point} from "pixi.js";
export const SHEPHERD_MOVE_EVENT = 'SHEPHERD_MOVE_EVENT';
export default class Shepherd extends WorldObject {
  public readonly caughtDistance: number = 50;

  constructor(){
    super();
    this._maxSpeed = 200;
    this._rotationSpeed =  Math.PI*0.03;
    EventManager.instance.addListener(SHEPHERD_MOVE_EVENT, this.onSetDestination.bind(this));
  };

  private onSetDestination(destination: {x:number, y:number}):void{
   this._targetDestination = new Point(destination.x, destination.y);
    this._behaviour = 'moveto';
    this.goForward(0.7);
  }

  public update(delta: number): void {
    super.update(delta);
  }

  destroy() {
      super.destroy();
        EventManager.instance.removeListener(SHEPHERD_MOVE_EVENT, this.onSetDestination.bind(this));
  }

}



