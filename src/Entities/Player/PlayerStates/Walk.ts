import { Game_Events } from "../../../Enums/GameEvents";
import GameLevel from "../../../Scenes/Levels/GameLevel";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
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

		if(Input.isPressed("tahoe") && this.owner.imageId !== "tahoe"){
			this.retObj = {player: "tahoe"}
			this.finished(PlayerStates.SWITCHING)
		}
		else if(Input.isPressed("reno") && this.owner.imageId !== "reno"){
			this.retObj = {player: "reno"}
			this.finished(PlayerStates.SWITCHING)
		}
		else if(Input.isPressed("flow") && this.owner.imageId !== "flow"){
			this.retObj = {player: "flow"}
			this.finished(PlayerStates.SWITCHING)
		}
		
		if(Input.isJustPressed("invincible")){
			if(this.owner.isCollidable === true){
				for(let i = 0; i < this.parent.players.length; i++){
					this.parent.players[i].isCollidable = false;
				}
			}
			else{
				for(let i = 0; i < this.parent.players.length; i++){
					this.parent.players[i].isCollidable = true;
				}
			}
		}
		let dir = this.getInputDirection();
		this.owner.colliderOffset.x = (this.owner.colliderOffset.x<0) == (this.owner.direction.x>0) ? this.owner.colliderOffset.x : -1*this.owner.colliderOffset.x;

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} 
		else{
			this.owner.direction = dir
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