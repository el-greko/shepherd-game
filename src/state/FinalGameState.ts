import BaseState from './BaseState';
import {Text, TextStyle} from "pixi.js";
import gsap from "gsap";

export default class FinalGameState extends BaseState {
  public static NAME: string = 'FinalGameState';

  private finalScore: number = 0;
  private titleText!: Text;
  private subtitleText!: Text;
  private scoreText!: Text;


  public setScore(score: number): void {
    this.finalScore = score;
  }

  public onEnter(): void {
    super.onEnter();
    console.log('FinalGameState: onEnter');


    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 72,
      fontWeight: 'bold',
      fill: '#FFD700',
      stroke: { color: '#000000', width: 6 },
      align: 'center',
    });

    const subtitleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fill: '#ffffff',
      stroke: { color: '#000000', width: 4 },
      align: 'center',
    });

    this.titleText = new Text('CONGRATULATIONS', titleStyle);
    this.subtitleText = new Text('SHEEPS CAUGHT', subtitleStyle);
    this.scoreText = new Text(this.finalScore.toString(), titleStyle);

    this.titleText.anchor.set(0.5);
    this.titleText.x = window.innerWidth / 2;
    this.titleText.y = window.innerHeight / 3;

    this.subtitleText.anchor.set(0.5);
    this.subtitleText.x = window.innerWidth / 2;
    this.subtitleText.y = this.titleText.y + 100;

    this.scoreText.anchor.set(0.5);
    this.scoreText.x = window.innerWidth / 2;
    this.scoreText.y = this.subtitleText.y + 80;

    this.container.addChild(this.titleText, this.subtitleText, this.scoreText);
  }

  public async onExecute(): Promise<void> {
    void super.onExecute();
    await gsap.delayedCall(5, () => undefined);
  }

  public onComplete(): void {
    super.onComplete();


    this.container.removeChild(this.titleText, this.subtitleText, this.scoreText);
    this.titleText.destroy();
    this.subtitleText.destroy();
    this.scoreText.destroy();
  }
}