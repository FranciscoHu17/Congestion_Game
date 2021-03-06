import { Game_Events } from "../../../Enums/GameEvents";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";

export default class OnGround extends PlayerState {
	onEnter(options: Record<string, any>): void {}

	handleInput(event: GameEvent){
		if(event.type == Game_Events.PLAYER_DYING){
			this.finished(PlayerStates.DYING)
		}
		if(event.type == Game_Events.RENO_ABILITY2){
			this.finished(PlayerStates.RENOE)
		}
		if(event.type == Game_Events.FLOW_ABILITY1){
			this.finished(PlayerStates.FLOWQ)
		}
	}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);
		

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).direction.x = direction.x;
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

		//TODO: we would have to add Duck here if we wish to implement it.
		if(Input.isJustPressed("jump")){ //TODO: might have to change input name
			console.log("jump")
			this.finished("jump");
			this.parent.velocity.y = -128*8;
			// if(this.parent.velocity.x !== 0){
			// 	// this.owner.tweens.play("flip");
			// }
		}
		else if(Input.isJustPressed("duck")){
			//Enter duck state
		} 
		else if(!this.owner.onGround){
			this.finished("fall");
		}

	}

	onExit(): Record<string, any> {
		return {};
	}
}