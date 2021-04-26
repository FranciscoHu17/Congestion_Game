import Ability from "../../GameSystems/Abilities/Ability";
import AbilityType from "../../GameSystems/Abilities/AbilityType";
import BattlerAI from "../../GameSystems/BattlerAI";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Timer from "../../Wolfie2D/Timing/Timer";
import Attack from "./EnemyStates/Attack";
import Fall from "./EnemyStates/Fall";
import Idle from "./EnemyStates/Idle";


export default class EnemyController extends StateMachineAI implements BattlerAI {
    /** The owner of this AI */
    owner: AnimatedSprite;

    /** The amount of health this entity has */
    health: number;

    direction: Vec2 = Vec2.ZERO;

    /** Current velocity */
    velocity: Vec2 = new Vec2(0,0)

    /** Movement speed */
    speed: number = 128*2;

    /** Friction */
    friction: number = 0;

    /** The weapon this AI has */
    ability: Ability;

    /** A reference to the player object */
    player: GameNode;

    /** Timers */
    exitTimer: Timer;
    pollTimer: Timer;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;

        this.health = options.health;

        this.ability = options.ability;

        this.player = options.player;


        this.exitTimer = new Timer(1000)
        this.pollTimer = new Timer(1000)

        this.initializeStates()

        // Subscribe to events
        //this.receiver.subscribe(hw3_Events.SHOT_FIRED);
        console.log("Subscribed to event");

        // Initialize to the default state
        //this.initialize(EnemyStates.DEFAULT);

        this.getPlayerPosition();
    }

    initializeStates(){
        let idle = new Idle(this, this.owner);
        this.addState(EnemyStates.IDLE, idle);

        let attack = new Attack(this, this.owner)
        this.addState(EnemyStates.ATTACK, attack)

        let fall = new Fall(this, this.owner)
        this.addState(EnemyStates.FALL,fall)

        this.initialize(EnemyStates.IDLE)
    }

    activate(options: Record<string, any>): void {
    }

    damage(damage: number): void {
        console.log("Took damage");
        this.health -= damage;
        /*
        if(this.health <= 0){
            this.owner.setAIActive(false, {});
            this.owner.isCollidable = false;
            this.owner.visible = false;
            this.owner.disablePhysics()
        }*/
    }

    getPlayerPosition(): Vec2 {
        let pos = this.player.position;

        // Get the new player location
        let start = this.owner.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("bottom").getItems()[0];

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

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)){
                        // We hit a wall, we can't see the player
                        return null;
                    }
                }
            }
        }

        return pos;
    }

    update(deltaT: number): void {
		super.update(deltaT);
	}
}

export enum EnemyStates {
    DEFAULT = "default",
    IDLE = "idle",
    ALERT = "alert",
    ATTACK = "attack",
    PREVIOUS = "previous",
    FALL = "fall"
}