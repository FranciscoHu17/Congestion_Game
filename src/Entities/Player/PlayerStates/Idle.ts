import GameLevel from "../../../Scenes/Levels/GameLevel";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Idle extends OnGround {
	owner: AnimatedSprite;
	retObj: Record<string, any>

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
		this.owner.animation.play("Idle", true);//TODO: change the animation name
		this.retObj = {}
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(Input.isMouseJustPressed()){
            this.finished(PlayerStates.BASICATTACK)
        }
		else if(Input.isPressed("tahoe") && this.owner.imageId !== "tahoe"){
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
		
		let dir = this.getInputDirection();

		if(!dir.isZero() && dir.y === 0){
			this.finished(PlayerStates.WALK);
		}
		this.parent.velocity.x = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return this.retObj;
	}
}