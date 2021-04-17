import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Input from "../../Wolfie2D/Input/Input";
import BasicAttack from "./PlayerStates/BasicAttack";
//import { HW4_Events } from "../hw4_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Walk from "./PlayerStates/Walk";
import Switching from "./PlayerStates/Switching";
import GameLevel from "../../Scenes/Levels/GameLevel";
import PlayerState from "./PlayerStates/PlayerState";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
//import Duck from "./PlayerStates/Duck";
//We proooobably won't need the other states as classes since they are animations that only needs to
//play once and no other checks are needed on them....


export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {//TODO: Do we have to change all the animation names to lower case?
    IDLE = "idle",
    WALK = "walk",
	//DUCKIN = "duck in",
    //DUCKOUT = "duck out",
	JUMP = "jump",
    // DAMAGED = "damaged",
    // DEATH = "death",
    SWITCHING = "switch",
    // SWITCHINGIN = "switching in",
    // SWITCHINGOUT = "switching out",
    BASICATTACK = "basic attack",
    // ABILITYQ = "ability 1",
    // ABILITYEIN = "ability 2 in",
    // ABILITYEOUT = "ability 2 out",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode; //have to design a way to switch the owner.
    //playerID: number = 3; //1=Tahoe, 2=Reno, 3=Flow. Starts with flow by default(?)
    protected states: Array<PlayerState>
    protected viewport: Viewport
    players: Array<AnimatedSprite>
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 128*4;
    MAX_SPEED: number = 10000; // francisco-CHANGED THIS TEMPORARILY
    tilemap: OrthogonalTilemap;

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.players = options.players
        this.viewport = options.viewport
    }

    //TODO: changes the owner of the controller
    switchOwner(newOwner: string){
        let centerX = this.owner.position.x
        let bottomBound = this.owner.collisionShape.bottom

        for(let i = 0; i< 3; i++){
            if(this.players[i].imageId === newOwner){
                this.owner = this.players[i]
                

                this.owner.position.x = centerX
                this.owner.position.y = bottomBound - this.owner.collisionShape.halfSize.y - this.owner.colliderOffset.y

                this.players[i].enablePhysics()
                this.players[i].visible = true

                this.updateStateOwners()
                this.viewport.follow(this.owner)
                //GameLevel.gameLevelViewport.follow(this.owner)
            }
            else{
                this.players[i].disablePhysics()
                this.players[i].visible = false
            }
        }
    }

    updateStateOwners(): void{
        for(let i=0; i < this.states.length; i++){
            this.states[i].owner = this.owner
        }
    }

    initializePlatformer(): void {
        this.speed = 5000;
        this.states = []

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
        this.states.push(idle)

		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
        this.states.push(walk)

		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        this.states.push(jump)

        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        this.states.push(fall)

        let basicAttack = new BasicAttack(this, this.owner);
        this.addState(PlayerStates.BASICATTACK, basicAttack);
        this.states.push(basicAttack)

        let switching = new Switching(this, this.owner)
        this.addState(PlayerStates.SWITCHING, switching)
        this.states.push(switching)

        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    update(deltaT: number): void {
		super.update(deltaT);

		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        } else if(this.currentState instanceof BasicAttack){
            Debug.log("playerstate", "Player State: BasicAttack");
        }
	}
}