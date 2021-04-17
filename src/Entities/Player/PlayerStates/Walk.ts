import GameLevel from "../../../Scenes/Levels/GameLevel";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
//import { HW4_Events } from "../../hw4_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	owner: AnimatedSprite;
	retObj: Record<string, any>;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
		this.owner.animation.play("Walk", true);//TODO: change to the correct animation name later
		this.retObj = {}
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(Input.isMouseJustPressed()){
            this.finished(PlayerStates.BASICATTACK)
        }
		else if(Input.isPressed("tahoe") && GameLevel.getCurrPlayer() !== "tahoe"){
			this.retObj = {player: "tahoe"}
			this.finished(PlayerStates.SWITCHING)
		}
		else if(Input.isPressed("reno") && GameLevel.getCurrPlayer() !== "reno"){
			this.retObj = {player: "reno"}
			this.finished(PlayerStates.SWITCHING)
		}
		else if(Input.isPressed("flow") && GameLevel.getCurrPlayer() !== "flow"){
			this.retObj = {player: "flow"}
			this.finished(PlayerStates.SWITCHING)
		}
		
		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} 
		
		this.parent.velocity.x = dir.x * this.parent.speed
        //TODO: uncomment the line below and change this to the right event.
		//this.emitter.fireEvent(HW4_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
        
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return this.retObj;
	}
}