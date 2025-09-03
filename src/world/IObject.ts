import {Container, Graphics, Point} from "pixi.js";

export default interface IObject {
    update(delta: number): void;
    destroy(): void;
    get position(): Point;
    set position(value: Point);
    get skin(): Container | Graphics;

}