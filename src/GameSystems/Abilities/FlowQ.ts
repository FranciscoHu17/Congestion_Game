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
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import AbilityType from "./AbilityType";

export default class FlowQ extends AbilityType {
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
        (<AnimatedSprite>shooter).animation.play("Ability 1", false, PlayerStates.IDLE);
        hitbox.position.x = hitbox.position.x + (256 * direction.x);

        let start = shooter.position.clone();
        let end = shooter.position.clone().add(direction.scaled(900));
        let delta = end.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, end.x);
        let maxX = Math.max(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxY = Math.max(start.y, end.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>shooter.getScene().getLayer("bottom").getItems()[0];

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