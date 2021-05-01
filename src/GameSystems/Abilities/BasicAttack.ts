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
import BattlerAI from "../BattlerAI";
import AbilityType from "./AbilityType";

export default class BasicAttack extends AbilityType {
    startDelay: any | number;
    attackDuration: any | number;
    owner: GameNode

    // color: Color;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    intializeOwner(node: GameNode): void{
        this.owner = node
    }

    doAnimation(shooter: GameNode, direction: Vec2, hitbox: Rect): void {
        (<AnimatedSprite>shooter).animation.play("Basic Attack", false, Game_Events.ABILITYFINISHED);

        let start = shooter.position.clone();
        let end = shooter.position.clone().add(direction.scaled(900));
        let delta = end.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, end.x);
        let maxX = Math.max(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxY = Math.max(start.y, end.y);

        // Get the bottom layer tilemap
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

        hitbox.tweens.add("shot", {
            startDelay: 0,
            duration: 3000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: start.x,
                    end: end.x,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: TweenableProperties.posY,
                    start: start.y,
                    end: end.y,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        hitbox.tweens.play("shot");
    }

    createRequiredAssets(scene: Scene, user: Sprite): [Rect] {
        let rect = <Rect>scene.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(user.position.clone().x, 
            user.position.clone().y), size: new Vec2 (32,16)});
        rect.color = Color.GREEN;

        if((<AnimatedSprite>this.owner).imageId == "tahoe"){
            this.attackDuration = 1800;
            this.startDelay = 500;
        }
        else if((<AnimatedSprite>this.owner).imageId == "reno"){
            this.attackDuration = 1700;
            this.startDelay = 200;
        }
        else if((<AnimatedSprite>this.owner).imageId == "flow"){
            this.attackDuration = 1700;
            this.startDelay = 350;
        }

        return [rect];
    }

    interact(ai: BattlerAI, hitbox: Rect): boolean {
        let overlap = ai.owner.collisionShape.getBoundingRect().overlaps(hitbox.boundary)
        return overlap
    }
}