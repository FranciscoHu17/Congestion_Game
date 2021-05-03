
import PlayerController from "../../Entities/Player/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import AbilityType from "../Abilities/AbilityType";
import BattlerAI from "../BattlerAI";

export default class Freeze extends AbilityType {
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
        hitbox.position.x = hitbox.position.x + (128*1.5 * direction.x);
        hitbox.position.y = hitbox.position.y - 128*0
        //TODO: where the hitbox starts and ends if it collides with a wall. change the size!!
        //line.start = start;
        // line.end = end;
        hitbox.tweens.play("fade");
    }

    createRequiredAssets(scene: Scene, user: Sprite): [Rect] {
        let line = <Rect>scene.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(user.position.clone().x, 
            user.position.clone().y), size: new Vec2 (128*1.5,128*3)});
        line.color = Color.YELLOW;
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

    interact(ai: BattlerAI, hitbox: Rect): boolean {
        //return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
        let overlap = ai.owner.collisionShape.getBoundingRect().overlaps(hitbox.boundary)
        
        if(overlap && (<PlayerController>ai).freezeTimer.isStopped()){
            let frozen = (<PlayerController>ai);
            frozen.owner.freeze();
            frozen.freezeTimer.start()
        }
        
        return overlap
    }
}