
import BaseState from "../state/BaseState";
import StartGameState from "../state/StartGameState";
import GameRoundState from "../state/GameRoundState";
import FinalGameState from "../state/FinalGameState";
import {LAYERS} from "./StageManager";

export default class StateManager {
  private static _instance: StateManager;
  private states: { [key: string]: BaseState } = {};
  public currentStateName: string | null = null;

  private isInit: boolean = false;
  private isRunning: boolean = false;
  private isProcessing: boolean = false;

  private readonly STATES_LOOP: string[] = [
    StartGameState.NAME,
    GameRoundState.NAME,
    FinalGameState.NAME,
  ];

  constructor() {}

  static get instance(): StateManager {
    return this._instance ?? (this._instance = new StateManager());
  }

  public init(): void {
    if (this.isInit) return;

    this.states[StartGameState.NAME] = new StartGameState(StartGameState.NAME, LAYERS.START_CONTAINER);
    this.states[GameRoundState.NAME] = new GameRoundState(GameRoundState.NAME, LAYERS.GAME_CONTAINER);
    this.states[FinalGameState.NAME] = new FinalGameState(FinalGameState.NAME, LAYERS.FINAL_CONTAINER);

    this.isInit = true;
  }

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;

    this.runNextState();
  }

  public stop(): void {
    if (!this.isRunning) {
      console.warn("StateManager is not running.");
      return;
    }
    this.isRunning = false;
  }

  private runNextState(): void {
    if (!this.isRunning) {
      return;
    }

    const currentIndex = this.currentStateName ? this.STATES_LOOP.indexOf(this.currentStateName) : -1;
    const nextStateName = (currentIndex === -1 || currentIndex + 1 >= this.STATES_LOOP.length)
        ? this.STATES_LOOP[0]
        : this.STATES_LOOP[currentIndex + 1];

    this.processState(nextStateName).catch(error => {
      console.error(`Error during state transition to ${nextStateName}. Stopping the cycle.`, error);
      this.stop();
    });
  }


  private async processState(stateName: string): Promise<void> {
    if (this.isProcessing) return;
    if (!this.states[stateName]) {
      throw new Error(`State with name "${stateName}" not found.`);
    }

    this.isProcessing = true;
    this.currentStateName = stateName;

    try {
      const state = this.states[this.currentStateName];

      state.onEnter();
      await state.onExecute();
      state.onComplete();

    } catch (error) {

      console.error(`An error occurred in state ${this.currentStateName}:`, error);
      throw error;
    } finally {
      this.isProcessing = false;
    }

    this.runNextState();
  }

  public getState(name: string): BaseState | null {
    return this.states[name];
  }

  public update(deltaTime: number): void {
    if (this.isRunning && this.currentStateName) {
      this.states[this.currentStateName].update(deltaTime);
    }
  }
}