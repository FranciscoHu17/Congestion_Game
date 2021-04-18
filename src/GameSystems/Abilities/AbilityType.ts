import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";

export default abstract class AbilityType {
    /** The key for this sprite image */
    spriteKey: string;

    /** How much damage this ability does */
    damage: number;

    /** Ability name */
    displayName: string;

    /** The use cooldown of the ability */
    cooldown: number;

    /** How loud it is to use this ability */
    useVolume: number;

    /**
     * Initializes this weapon type with data
     */
    abstract initialize(options: Record<string, any>): void;

    /**
     * The animation to do when this weapon is used
     */
    abstract doAnimation(...args: any): void;

    abstract createRequiredAssets(scene: Scene, user: Sprite): Array<any>;

    abstract interact(node: GameNode, ...args: any): boolean;
}