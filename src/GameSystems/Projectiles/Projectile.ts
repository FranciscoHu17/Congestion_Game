import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Game from "../../Wolfie2D/Loop/Game";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default abstract class Projectile{
    owner: GameNode
    spriteKey: string
    velocity: Vec2
    size: Vec2
    active: boolean
    SPEED: number

    abstract initialize(options: Record<string, any>): void;

    abstract setActivity(active: boolean): void;

    abstract update(deltaT: number): void;

    
}