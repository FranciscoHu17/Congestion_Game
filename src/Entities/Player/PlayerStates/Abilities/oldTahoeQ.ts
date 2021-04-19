import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import Color from "../../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../../PlayerController";
import OnGround from "../OnGround";
import Input from "../../../../Wolfie2D/Input/Input";
import GameLevel from "../../../../Scenes/Levels/GameLevel";
import PlayerState from "../PlayerState";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Rect from "../../../../Wolfie2D/Nodes/Graphics/Rect";

export default class TahoeQ extends PlayerState {

    //TODO: fill in all the info here!
    // Attacking
    private lookDirection: Vec2;

    /** The key for this sprite image */
    spriteKey: string = "tahoe";

    /** How much damage this weapon does */
    damage: number = 100;

    /** Display name */
    displayName: string;

    /** The use cooldown of the weapon */
    cooldown: number;

    /** How loud it is to use this weapon */
    useVolume: number;

    /** How long the projectile animation will play */
    attackDuration: number;
    startDelay: number;

    owner: AnimatedSprite;

    onEnter(options: Record<string, any>): void {
        console.log("Activating Tahoe's Q..");
		this.parent.speed = this.parent.MIN_SPEED;
		this.owner.animation.play("Ability 1", false);
        this.lookDirection = this.owner.position.dirTo(Input.getGlobalMousePosition());
        this.doAnimation(this.owner, this.lookDirection, this.createRequiredAssets(this.owner.getScene()));
	}

    handleInput(event: GameEvent): void {}

    initialize(options: Record<string, any>): void {//TODO: might not need this...
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    doAnimation(shooter: GameNode, direction: Vec2, hitbox: Rect): void {
        console.log("Generating hitbox...");
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

        //TODO: where the hitbox starts and ends if it collides with a wall. change the size!!
        //line.start = start;
        // line.end = end;
        hitbox.tweens.play("fade");
    }

    createRequiredAssets(scene: Scene): Rect {
        console.log("creating hitbox...");
        //line is actually the hitbox
        let line = <Rect>scene.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(this.owner.position.clone().x+50, this.owner.position.clone().y), size: new Vec2 (50,128)});
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

        return line;
    }

    hits(node: GameNode, hitbox: Rect): boolean {
        //return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
        return node.collisionShape.getBoundingRect().overlaps(hitbox.boundary);
    }

    update(deltaT: number): void {
		super.update(deltaT);
        if(!this.owner.animation.isPlaying("Ability 1")){
            this.finished(PlayerStates.IDLE);
        }
        let dir = this.getInputDirection();
        this.parent.velocity.x = dir.x * this.parent.speed;

		this.owner.move(this.parent.velocity.scaled(deltaT));
        
	}

    onExit(): Record<string, any> {
        return {};
    }

}