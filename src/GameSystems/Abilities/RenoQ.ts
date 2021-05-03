import EnemyController from "../../Entities/Enemy/EnemyController";
import { PlayerStates } from "../../Entities/Player/PlayerController";
import { Game_Events } from "../../Enums/GameEvents";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Game from "../../Wolfie2D/Loop/Game";
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
import ProjectileManager from "../ProjectileManager";
import Projectile from "../Projectiles/Projectile";
import AbilityType from "./AbilityType";

export default class RenoQ extends AbilityType {
    startDelay: any | number;
    attackDuration: any | number;
    packets: Array<Projectile>;
    owner: GameNode
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

    doAnimation(shooter: GameNode, direction: Vec2, packets: Array<Projectile>): void {
        console.log(this.packets);

        (<AnimatedSprite>shooter).animation.play("Ability 1", false, Game_Events.ABILITYFINISHED);//TODO: should I be firing an event instead of doing this?

        let curr_dir = direction.set(1,0) 
            let curr_angle = Math.PI/2
            for(let attack of this.packets){
                let prevX = this.projectileManager.startPosition.x
                this.projectileManager.startPosition.x = 0
                this.projectileManager.fireSpecificProjectile(this.owner, attack, curr_dir, attack.damage)
                this.projectileManager.startPosition.x = prevX
                curr_angle -= Math.PI/(this.packets.length-1)
                curr_dir.x = Math.sin(curr_angle)
                curr_dir.y = Math.cos(curr_angle)
            }
        // // Get the wall tilemap
        // let walls = <OrthogonalTilemap>shooter.getScene().getLayer("bottom").getItems()[0];

        // var angles = [4.0578905, 4.3196899, 4.5814893, 4.8432887, 5.1050881, 5.3668874];

        // for(var i=0; i<this.hitbox.length;i++){
        //     let start = shooter.position.clone();
        //     let end = shooter.position.clone().add(shooter._velocity.clone().setToAngle(angles[i]).scaled(900));
        //     let delta = end.clone().sub(start);

        //     // Iterate through the tilemap region until we find a collision
        //     let minX = Math.min(start.x, end.x);
        //     let maxX = Math.max(start.x, end.x);
        //     let minY = Math.min(start.y, end.y);
        //     let maxY = Math.max(start.y, end.y);

        //     let minIndex = walls.getColRowAt(new Vec2(minX, minY));
		//     let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        //     let tileSize = walls.getTileSize();

        //     for(let col = minIndex.x; col <= maxIndex.x; col++){
        //         for(let row = minIndex.y; row <= maxIndex.y; row++){
        //             if(walls.isTileCollidable(col, row)){
        //                 // Get the position of this tile
        //                 let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

        //                 // Create a collider for this tile
        //                 let collider = new AABB(tilePos, tileSize.scaled(1/2));

        //                 let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

        //                 if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
        //                     console.log("Found hit");
        //                     end = hit.pos;
        //                 }
        //             }
        //         }
        //     }

        //     //TODO: where the hitbox starts and ends if it collides with a wall. change the size!!
        //     this.hitbox[i].start = start;
        //     this.hitbox[i].end = end;
        //     this.hitbox[i].tweens.play("fade");
        // }

        

        
    }

    createRequiredAssets(scene: Scene, user: Sprite): Array<Projectile> {
        var reno_attack: Array<Projectile>=[];

        let size = new Vec2(32,12)
        for(let i = 0; i < 10; i++){
            let projectile = <Rect>this.owner.getScene().add.graphic(GraphicType.RECT, "primary", {position: new Vec2, size: size})
            projectile.color = Color.CYAN
            let basic_attack = this.projectileManager.addPacket({owner: projectile, key: "renoQ", speed: 128*7,
                            max_dist: 128*7, size: size, target:"enemy"})
            basic_attack.damage = 40
            reno_attack.push(basic_attack);
        }

        // let line = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        // line.color = Color.CYAN;
        // let line1 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        // line1.color = Color.CYAN;
        // let line2 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        // line2.color = Color.CYAN;
        // let line3 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        // line3.color = Color.CYAN;
        // let line4 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        // line4.color = Color.CYAN;
        // let line5 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        // line5.color = Color.CYAN;
        
        // let lineList: Array<Line> = [line, line1, line2, line3, line4, line5];

        // this.attackDuration = 1800;
        // this.startDelay = 500;

        // for(var i = 0; i< lineList.length;i++){
        //     lineList[i].tweens.add("fade", {
        //         startDelay: this.startDelay,
        //         duration: this.attackDuration,
        //         effects: [
        //             {
        //                 property: TweenableProperties.alpha,
        //                 start: 1,
        //                 end: 0,
        //                 ease: EaseFunctionType.OUT_SINE
        //             }
        //         ]
        //     });
        // }
        // this.hitbox = lineList;
        //return lineList;
        this.packets = reno_attack;
        return reno_attack;
    }

    interact(ai: BattlerAI, hitbox: Array<Projectile>): boolean {
        //return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
        var collide = false;
        var damage = 0;
        // console.log("ai collisionshape", ai.owner.collisionShape.getBoundingRect());
        // console.log("hitboxes", hitbox);
        // for(var i=0; i<hitbox.length; i++){
        //     //if(ai.owner.collisionShape.getBoundingRect().overlaps(hitbox[i].boundary)){
        //     if(ai.owner.collisionShape.getBoundingRect().intersectSegment(hitbox[i].start, hitbox[i].end.clone().sub(hitbox[i].start)) !== null){
        //         collide = true;
        //         damage += 15;
        //     }
        // }
        // if(collide){
        //     console.log("attack collided..", damage);
        // }
        // (<EnemyController>ai).damage(damage);
        return collide;
    }
}