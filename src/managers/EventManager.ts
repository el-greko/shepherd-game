import { EventEmitter } from 'pixi.js';


export default class EventManager extends EventEmitter{
  private static _instance: EventManager;


  static get instance() { return this._instance ?? (this._instance = new EventManager()); }

  waitEvent(event: string): Promise<void> {
    return new Promise((resolve) => {
      this.once(event, () => {
        resolve();
      });
    });
  }


}
