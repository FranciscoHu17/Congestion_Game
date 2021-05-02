import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Game from "../../Wolfie2D/Loop/Game";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default abstract class Projectile{
    owner: GameNode
    key: string
    velocity: Vec2
    size: Vec2
    start: Vec2
    active: boolean
    damage: number
    SPEED: number
    MAX_DIST: number
    
    /**
     * Initialize a Projectile
     * @param options   Projectile options
     */
    abstract initialize(options: Record<string, any>): void;

    /**
     * Set the activity of this Projectile
     * @param active    Whether or not this Projectile is active
     */
    abstract setActivity(active: boolean): void;

    /**
     * Update the movement of this Projectile
     * @param deltaT    Amount of time that has passed
     */
    abstract update(deltaT: number): void;

    
}