export default class Vector2 {
    constructor(public x: number = 0, public y: number = 0) {}

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    setFrom(v: Vector2): this {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add(v: Vector2): this {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v: Vector2): this {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mulScalar(s: number): this {
        this.x *= s;
        this.y *= s;
        return this;
    }

    divScalar(s: number): this {
        if (s !== 0) {
            this.x /= s;
            this.y /= s;
        }
        return this;
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSq(): number {
        return this.x * this.x + this.y * this.y;
    }

    normalize(): this {
        const len = this.length();
        if (len > 0) this.divScalar(len);
        return this;
    }

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vector2): number {
        return this.x * v.y - this.y * v.x;
    }

    distanceTo(v: Vector2): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceToSq(v: Vector2): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    rotate(angle: number): this {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const { x, y } = this;
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    }

    lerp(v: Vector2, t: number): this {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    }

    static fromAngle(angle: number, length: number = 1): Vector2 {
        return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
    }

    setLength(len: number): this {
        this.normalize();
        this.mulScalar(len);
        return this;
    }
}