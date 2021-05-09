import { PlayerStates } from "../../Entities/Player/PlayerController";
import { Game_Events } from "../../Enums/GameEvents";
import GameLevel from "../../Scenes/Levels/GameLevel";
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
import BattleManager from "../BattleManager";
import BattlerAI from "../BattlerAI";
import AbilityType from "./AbilityType";

export default class FlowE extends AbilityType {
    startDelay: any | number;
    attackDuration: any | number;
    owner: GameNode;
    checkpoint: AnimatedSprite;

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
        if(this.owner.onGround === true){
            (<AnimatedSprite>shooter).animation.play("Ability 2 In", false, Game_Events.ABILITYFINISHED);
        }
    }

    createRequiredAssets(scene: Scene, user: Sprite): [Rect] {
        let limit = 128*2;
		let enemies = BattleManager.getInstance().getEnemies();
        if (enemies.length > 0){
            let dist = enemies[0].owner.position.distanceTo(this.owner.position) < limit ? enemies[0].owner.position.distanceTo(this.owner.position) : limit
            let closest = dist < limit ? enemies[0] : null
            
            for(let i = 1; i < enemies.length; i++){
                let curr_dist = enemies[i].owner.position.distanceTo(this.owner.position)
                if (curr_dist < dist){
                    closest = enemies[i]
                    dist = curr_dist
                }
            }
            
            if(closest != null && closest.health > 0){
            }
            else{
                if(this.owner.onGround === true){
                    if(this.checkpoint != undefined){
                        this.checkpoint.destroy();
                    }
                    this.checkpoint = scene.add.animatedSprite("generator", "primary");
                    this.checkpoint.animation.play("Idle");
                    this.checkpoint.position.set(user.position.clone().x, user.position.clone().y);
            
                    let level = <GameLevel>scene;
                    level.setPlayerSpawn(new Vec2(user.position.clone().x, user.position.clone().y));
                }
            }
        }
        

        return [null];
    }

    interact(ai: BattlerAI, hitbox: Rect): boolean {
        return false;
    }
}