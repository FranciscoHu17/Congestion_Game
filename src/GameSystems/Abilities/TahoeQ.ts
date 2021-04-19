import { PlayerStates } from "../../Entities/Player/PlayerController";
import { Game_Events } from "../../Enums/GameEvents";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import AbilityType from "./AbilityType";

export default class TahoeQ extends AbilityType {
    startDelay: any | number;
    attackDuration: any | number;

    // color: Color;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        // this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    doAnimation(shooter: GameNode, direction: Vec2, hitbox: Rect): void {
        (<AnimatedSprite>shooter).animation.play("Ability 1", false, Game_Events.ABILITYFINISHED);
        hitbox.position.x = hitbox.position.x + (256 * direction.x);


        //TODO: where the hitbox starts and ends if it collides with a wall. change the size!!
        //line.start = start;
        // line.end = end;
        hitbox.tweens.play("fade");
    }

    createRequiredAssets(scene: Scene, user: Sprite): [Rect] {
        let line = <Rect>scene.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(user.position.clone().x, 
            user.position.clone().y), size: new Vec2 (384,128)});
        line.color = Color.GREEN;
        this.attackDuration = 1800;
        this.startDelay = 500;

        line.tweens.add("fade", {
            startDelay: this.startDelay,
            duration: this.attackDuration,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        return [line];
    }

    interact(node: GameNode, hitbox: Rect): boolean {
        //return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
        return node.collisionShape.getBoundingRect().overlaps(hitbox.boundary);
    }
}