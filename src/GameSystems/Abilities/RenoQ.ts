import { PlayerStates } from "../../Entities/Player/PlayerController";
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
import AbilityType from "./AbilityType";

export default class RenoQ extends AbilityType {
    startDelay: any | number;
    attackDuration: any | number;
    hitbox: Array<Line>;

    // color: Color;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        // this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    doAnimation(shooter: GameNode, direction: Vec2, line: Line[]): void {
        console.log(this.hitbox);

        (<AnimatedSprite>shooter).animation.play("Ability 1", false, PlayerStates.JUMP);//TODO: should I be firing an event instead of doing this?

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>shooter.getScene().getLayer("bottom").getItems()[0];

        var angles = [4.0578905, 4.3196899, 4.5814893, 4.8432887, 5.1050881, 5.3668874];

        for(var i=0; i<this.hitbox.length;i++){
            let start = shooter.position.clone();
            let end = shooter.position.clone().add(shooter._velocity.clone().setToAngle(angles[i]).scaled(900));
            let delta = end.clone().sub(start);

            // Iterate through the tilemap region until we find a collision
            let minX = Math.min(start.x, end.x);
            let maxX = Math.max(start.x, end.x);
            let minY = Math.min(start.y, end.y);
            let maxY = Math.max(start.y, end.y);

            let minIndex = walls.getColRowAt(new Vec2(minX, minY));
		    let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

            let tileSize = walls.getTileSize();

            for(let col = minIndex.x; col <= maxIndex.x; col++){
                for(let row = minIndex.y; row <= maxIndex.y; row++){
                    if(walls.isTileCollidable(col, row)){
                        // Get the position of this tile
                        let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                        // Create a collider for this tile
                        let collider = new AABB(tilePos, tileSize.scaled(1/2));

                        let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                        if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
                            console.log("Found hit");
                            end = hit.pos;
                        }
                    }
                }
            }

            //TODO: where the hitbox starts and ends if it collides with a wall. change the size!!
            this.hitbox[i].start = start;
            this.hitbox[i].end = end;
            this.hitbox[i].tweens.play("fade");
        }

        

        
    }

    createRequiredAssets(scene: Scene, user: Sprite): Array<Line> {
        let line = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line.color = Color.CYAN;
        let line1 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line1.color = Color.CYAN;
        let line2 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line2.color = Color.CYAN;
        let line3 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line3.color = Color.CYAN;
        let line4 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line4.color = Color.CYAN;
        let line5 = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line5.color = Color.CYAN;
        
        let lineList: Array<Line> = [line, line1, line2, line3, line4, line5];

        this.attackDuration = 1800;
        this.startDelay = 500;

        for(var i = 0; i< lineList.length;i++){
            lineList[i].tweens.add("fade", {
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
        }
        this.hitbox = lineList;
        return lineList;
    }

    interact(node: GameNode, hitbox: Array<Line>): boolean {
        //return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
        var collide = false;
        for(var i=0; i<hitbox.length; i++){
            if(node.collisionShape.getBoundingRect().overlaps(hitbox[i].boundary)){
                collide = true;
            }
        }
        return collide;
    }
}