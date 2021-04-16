import StateMachineAI from "../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Debug from "../Wolfie2D/Debug/Debug";
import GameNode from "../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../Wolfie2D/Utils/EaseFunctions";
//import { HW4_Events } from "../hw4_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Walk from "./PlayerStates/Walk";
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
    // SWITCHINGIN = "switching in",
    // SWITCHINGOUT = "switching out",
    // BASICATTACK = "basic attack",
    // ABILITYQ = "ability 1",
    // ABILITYEIN = "ability 2 in",
    // ABILITYEOUT = "ability 2 out",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode; //have to design a way to switch the owner.
    //playerID: number = 3; //1=Tahoe, 2=Reno, 3=Flow. Starts with flow by default(?)
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        
    }

    //TODO: changes the owner of the controller
    // switchOwner(owner: GameNode, playerID: number){
    //     //TODO: what should I do after I change the owner?
    //     //position should be the same as the current owner
    //     //play the switch in and out animation
    //     //change player stats based on their passives..
    //     if(this.playerID != playerID){
    //         (<AnimatedSprite>this.owner).animation.play("Switching In",false);
    //         this.playerID = playerID;
    //         var oldOwner = this.owner;
    //         this.owner = owner;
    //         this.owner.positionX = oldOwner.positionX;
    //         this.owner.positionY = oldOwner.positionY;
    //         if(playerID == 1){
                
    //         }
    //         else if(playerID == 2){

    //         }
    //         else if(playerID == 3){

    //         }
    //     }
    // }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
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
        }
	}
}