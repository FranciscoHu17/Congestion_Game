import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../Wolfie2D/Nodes/Graphics/Line";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import Input from "../../../Wolfie2D/Input/Input";
import GameLevel from "../../../Scenes/Levels/GameLevel";
import PlayerState from "./PlayerState";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { Game_Events } from "../../../Enums/GameEvents";

export default class BasicAttack extends PlayerState {

    // Attacking
    private lookDirection: Vec2;

    /** The key for this sprite image */
    spriteKey: string;

    /** How much damage this weapon does */
    damage: number;

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
		this.parent.speed = this.parent.MIN_SPEED;
		this.owner.animation.play("Basic Attack", false);
        this.lookDirection = this.owner.position.dirTo(Input.getGlobalMousePosition());
        this.doAnimation(this.owner, this.lookDirection, this.createRequiredAssets(this.owner.getScene()));
	}

    handleInput(event: GameEvent){
		if(event.type == Game_Events.PLAYER_DYING){
			this.finished(PlayerStates.DYING)
		}
	}

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    doAnimation(shooter: GameNode, direction: Vec2, line: Line): void {
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

        line.start = start;
        line.end = end;
        line.tweens.play("fade");
    }

    createRequiredAssets(scene: Scene): Line {
        let line = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line.color = Color.GREEN;

        if(this.owner.imageId == "tahoe"){
            this.attackDuration = 1800;
            this.startDelay = 500;
        }
        else if(this.owner.imageId == "reno"){
            this.attackDuration = 1700;
            this.startDelay = 200;
        }
        else if(this.owner.imageId == "flow"){
            this.attackDuration = 1700;
            this.startDelay = 350;
        }
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

    hits(node: GameNode, line: Line): boolean {
        return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
    }

    update(deltaT: number): void {
		super.update(deltaT);
        if(!this.owner.animation.isPlaying("Basic Attack")){
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