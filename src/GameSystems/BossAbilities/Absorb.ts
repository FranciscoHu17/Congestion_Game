
import PlayerController from "../../Entities/Player/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Game_Events } from "../../Enums/GameEvents";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import AbilityType from "../Abilities/AbilityType";
import BattlerAI from "../BattlerAI";

export default class Absorb extends AbilityType {
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
        //(<AnimatedSprite>shooter).animation.play("Absorb", false);
    }

    createRequiredAssets(scene: Scene, user: Sprite): [Rect] {
        return [null];
    }

    interact(ai: BattlerAI, hitbox: Rect): boolean {
        return false;
    }
}