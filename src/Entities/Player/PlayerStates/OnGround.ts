import { Game_Events } from "../../../Enums/GameEvents";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";
import { PlayerStates } from "../PlayerController";

export default class OnGround extends PlayerState {
	onEnter(options: Record<string, any>): void {}

	handleInput(event: GameEvent){
		if(event.type == Game_Events.PLAYER_DYING){
			this.finished(PlayerStates.DYING)
		}
	}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

		if(Input.isJustPressed("ability1")){
            this.finished(PlayerStates.ABILITYQ);
        }else if(Input.isJustPressed("ability2")){

        }

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

		//TODO: we would have to add Duck here if we wish to implement it.
		if(Input.isJustPressed("jump")){ //TODO: might have to change input name
			this.finished("jump");
			this.parent.velocity.y = -128*8;
			// if(this.parent.velocity.x !== 0){
			// 	// this.owner.tweens.play("flip");
			// }
		} else if(!this.owner.onGround){
			this.finished("fall");
		}
	}

	onExit(): Record<string, any> {
		return {};
	}
}