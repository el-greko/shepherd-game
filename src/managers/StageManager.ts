import {Container} from "pixi.js";
import IObject from "../world/IObject";


export const LAYERS: { [key: string]: number }  = {
    START_CONTAINER: 0,
    GAME_CONTAINER: 1,
    FINAL_CONTAINER: 2,
}

export default class StageManager {

    private static _instance: StageManager;
    private layers: { [key: number]: Container<any> } = {};
    private _childs: IObject[] = [];
    private _rootContainer!: Container<any>;

    constructor() {


    }

    static get instance() { return this._instance ?? (this._instance = new StageManager()); }

    init(root: Container){
        if(this._rootContainer) return;
        this._rootContainer = root;
        for(let layer in LAYERS){

            let depth = LAYERS[layer];
            let layerContainer = new Container();
            layerContainer.name = layer;
            this._rootContainer.addChildAt(layerContainer, depth);
            this.layers[depth] = layerContainer;
        }
    }

    getLayer(depth:number){
        return  this.layers[depth];
    }

    addChild(child:any, layer:number, name:string = ''){
        this.layers[layer].addChild(child);
        child.name = name;
        this._childs.push(child);
    }

    removeChild(child:any, layer:number){
        this.layers[layer].removeChild(child);
    }



}

