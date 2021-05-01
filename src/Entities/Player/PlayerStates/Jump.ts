import GameLevel from "../../../Scenes/Levels/GameLevel";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
//import { HW4_Events } from "../../hw4_enums";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";

export default class Jump extends InAir {
	owner: AnimatedSprite;
	retObj: Record<string,any>;
	prevDirX: number;

	onEnter(options: Record<string, any>): void {
		this.prevDirX = (<Sprite>this.parent.owner).direction.x;
		this.owner.animation.play("Jump", false); //TODO: change the animation name
		//TODO2: Add jump sound effect here.
		//this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		if(this.owner.direction.x == 0){
			this.owner.direction.x = this.prevDirX
		}

		if(Input.isPressed("tahoe") && this.owner.imageId !== "tahoe" && this.parent.switchTimer.isStopped()){
			this.retObj = {player: "tahoe"}
			this.finished(PlayerStates.SWITCHING)
		}
		else if(Input.isPressed("reno") && this.owner.imageId !== "reno" && this.parent.switchTimer.isStopped()){
			this.retObj = {player: "reno"}
			this.finished(PlayerStates.SWITCHING)
		}
		else if(Input.isPressed("flow") && this.owner.imageId !== "flow" && this.parent.switchTimer.isStopped()){
			this.retObj = {player: "flow"}
			this.finished(PlayerStates.SWITCHING)
		}

// <<<<<<< HEAD
// // 		// If we're falling, go to the fall state
// // 		// if(this.parent.velocity.y >= 0){
// // 		// 	this.finished(PlayerStates.FALL);
// // 		// }
// // =======
// // 		// // If we're falling, go to the fall state
// // 		// if(this.parent.velocity.y >= 0){
// // 		// 	this.finished(PlayerStates.FALL);
// // 		// }
// >>>>>>> qiting_branch
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return this.retObj;
	}
}