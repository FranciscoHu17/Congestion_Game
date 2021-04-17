import GameLevel from "../../../Scenes/Levels/GameLevel";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
//import { HW4_Events } from "../../hw4_enums";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";

export default class Jump extends InAir {
	owner: AnimatedSprite;
	retObj: Record<string,any>;

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("Jump", false); //TODO: change the animation name
		//TODO2: Add jump sound effect here.
		//this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
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