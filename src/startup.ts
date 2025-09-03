import { Application } from 'pixi.js';
import StateManager from './managers/StateManager';
import EventManager from './managers/EventManager';
import WorldObjectFactory from './managers/WorldObjectFactory';
import StageManager from "./managers/StageManager";

export default class Startup {
  private static _instance: Startup | null = null;
  private _initialized = false;

  private app!: Application;

  private constructor() {}

  static getInstance(): Startup {
    if (!this._instance) this._instance = new Startup();
    return this._instance;
  }

  async run() {
    if (this._initialized) return;
    this._initialized = true;

    this.app = new Application();
    await this.app.init({ resizeTo: window, background: '#223322', antialias: true });
    document.getElementById('app')?.appendChild(this.app.canvas);

    //@ts-ignore
    globalThis.__PIXI_APP__ = this.app;

    StageManager.instance.init(this.app.stage);
    StateManager.instance.init();
    StateManager.instance.start();


    this.app.ticker.add((ticker) => {

      const dt = ticker.deltaMS / 1000;
      StateManager.instance.update(dt);
    });
  }
}
