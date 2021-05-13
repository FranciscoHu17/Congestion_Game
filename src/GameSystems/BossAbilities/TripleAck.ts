
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
import ProjectileManager from "../ProjectileManager";
import Projectile from "../Projectiles/Projectile";

export default class TripleAck extends AbilityType {
    startDelay: any | number;
    attackDuration: any | number;
    owner: GameNode;
    packets: Array<Projectile>;
    projectileManager: ProjectileManager;


    // color: Color;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        // this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
        this.projectileManager = ProjectileManager.getInstance();
        
    }

    intializeOwner(node: GameNode): void{
        this.owner = node
    }

    doAnimation(shooter: GameNode, direction: Vec2, hitbox: Rect): void {
        //(<AnimatedSprite>shooter).animation.play("Triple Ack", false);
        let curr_dir = direction.set(1,0) 
        let curr_angle = Math.PI/2
        for(let attack of this.packets){
            let prevX = this.projectileManager.startPosition.x
            this.projectileManager.startPosition.x = 0
            this.projectileManager.fireSpecificProjectile(this.owner, attack, curr_dir, attack.damage)
            this.projectileManager.startPosition.x = prevX
            curr_angle += Math.PI/(this.packets.length-1)
            curr_dir.x = Math.sin(curr_angle)
            curr_dir.y = Math.cos(curr_angle)
        }

    }

    createRequiredAssets(scene: Scene, user: Sprite): Array<Projectile> {
        var tripleAckAttack: Array<Projectile>=[];
        let size = new Vec2(32,12)
        for(let i = 0; i < 10; i++){ // change this number to be the number of projectiles from absorb
            let projectile = <Rect>this.owner.getScene().add.graphic(GraphicType.RECT, "primary", {position: new Vec2, size: size})
            projectile.color = Color.CYAN
            let basic_attack = this.projectileManager.addPacket({owner: projectile, key: "tripleAck", speed: 128*7,
                            max_dist: 128*7, size: size, target:"player"})
            basic_attack.damage = 40
            tripleAckAttack.push(basic_attack);
        }
        this.packets = tripleAckAttack;
        return tripleAckAttack;
    }

    interact(ai: BattlerAI, hitbox: Rect): boolean {
        return false;
    }
}