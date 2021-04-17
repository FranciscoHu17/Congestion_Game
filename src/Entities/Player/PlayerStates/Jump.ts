import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
//import { HW4_Events } from "../../hw4_enums";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";

export default class Jump extends InAir {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("Jump", true); //TODO: change the animation name
		//TODO2: Add jump sound effect here.
		//this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
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
		return {};
	}
}