import {WorldObject} from "../world/WorldObject";
import Shepherd from "../world/Shepherd";
import Sheep from "../world/Sheep";
import Yard from "../world/Yard";
import {Container, Graphics} from "pixi.js";

export type WOConfig = {
    type: WorldObjectType,
    position: { x: number, y: number },
}


export type WorldObjectType = 'Shepherd' | 'Sheep' | 'Yard';

export default class WorldObjectFactory {
    private static _instance: WorldObjectFactory | undefined;
    static get instance() {
        return this._instance ?? (this._instance = new WorldObjectFactory());
    }

    create(woConfig: WOConfig): WorldObject {
        let wObject: WorldObject;
        switch (woConfig.type) {
            case 'Shepherd':
                wObject = new Shepherd();
                break;
            case 'Sheep':
                wObject = new Sheep();
                break;
            case 'Yard':
                wObject = new Yard();
                break;
            default:
                throw new Error(`Unknown WorldObjectType: ${woConfig.type as any}`);
        }
        wObject.skin = this.addSkin(woConfig.type);
        wObject.setPosition(woConfig.position.x, woConfig.position.y);
        return wObject;
    }

    private addSkin(type: WorldObjectType) {
        let skin: Graphics;
        switch (type) {
            case 'Shepherd':

                skin = new Graphics()
                    .beginFill(0x0000FF)
                    .drawCircle(0, 0, 30)
                    .endFill();
                break;

            case 'Sheep':

                skin = new Graphics()
                    .beginFill(0xFFFFFF)
                    .drawCircle(0, 0, 20)
                    .endFill();
                break;

            case 'Yard':

                skin = new Graphics()
                    .beginFill(0xFFFF00)
                    .drawCircle(0, 0, 100)
                    .endFill();
                break;

            default:
                throw new Error(`Unknown WorldObjectType: ${type as any}`);
        }
        return skin;
    }
}
