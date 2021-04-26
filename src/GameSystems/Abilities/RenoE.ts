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
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import BattlerAI from "../BattlerAI";
import AbilityType from "./AbilityType";

export default class RenoE extends AbilityType {
    startDelay: any | number;
    attackDuration: any | number;
    owner: GameNode

    // color: Color;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        // this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    intializeOwner(node: GameNode): void{
        this.owner = node
    }

    doAnimation(shooter: GameNode, direction: Vec2, hitbox: Rect): void {
        (<AnimatedSprite>shooter).animation.play("Ability 2", false, Game_Events.RENO_ABILITY2);
    }

    createRequiredAssets(scene: Scene, user: Sprite): [Rect] {
        return [null];
    }

    interact(ai: BattlerAI, hitbox: Rect): boolean {
        //return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
        //return node.collisionShape.getBoundingRect().overlaps(hitbox.boundary);
        return false;
    }
}