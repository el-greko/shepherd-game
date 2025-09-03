import {Container, Graphics, Point} from 'pixi.js';
import EventManager from '../managers/EventManager';
import WorldObjectFactory, {WorldObjectType} from "../managers/WorldObjectFactory";
import StageManager, {LAYERS} from "../managers/StageManager";
import IObject from "../world/IObject";

export default class BaseState {

  public name: string;

  private _stateGameObjects: IObject[] = [];

  protected _stateContainer!: Container;
  constructor(name: string, layerNumber: number) {
    this.name = name;
    this._stateContainer = StageManager.instance.getLayer(layerNumber);
  }

  public onEnter(): void {
  }

  public async onExecute(): Promise<void> {
  }

  public onComplete(): void {
  }

  public update(delta: number): void {
    for (let i = 0; i < this._stateGameObjects.length; i++) {
      this._stateGameObjects[i].update(delta);
    }
  }

  protected createGameObject(type: WorldObjectType, position: Point, parent?: Container): IObject {
    const obj = WorldObjectFactory.instance.create({type, position});
    if (obj) this.addGameObject(obj, parent);
    return obj;
  }

  protected addGameObject(obj: IObject, parent?: Container): void {
    if (parent) {
      parent.addChild(obj.skin);
    } else {
      this._stateContainer.addChild(obj.skin);
    }
    this._stateGameObjects.push(obj);
  }

  protected cleanupGameObjects(): void {
    while (this._stateGameObjects.length) {
      this.removeGameObject(this._stateGameObjects[0]);
    }
  }

  protected removeGameObject(obj: IObject): void {
    obj.destroy();
    const i = this._stateGameObjects.indexOf(obj);
    if (i > -1) this._stateGameObjects.splice(i, 1);
  }

  protected get container(): Container {
    return this._stateContainer;
  }

  protected createBackground(color:number = 0x006400) {
    return new Graphics()
        .beginFill(color)
        .drawRect(0, 0, window.innerWidth, window.innerHeight)
        .endFill();
  }

}
