import { Game_Events } from "../../../Enums/GameEvents";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";

export default abstract class InAir extends PlayerState {
    handleInput(event: GameEvent){
		if(event.type == Game_Events.PLAYER_DYING){
			this.finished(PlayerStates.DYING)
		}
	}

    update(deltaT: number): void {
        super.update(deltaT);

        if(Input.isJustPressed("ability1")){
            this.finished(PlayerStates.ABILITYQ);
        }else if(Input.isJustPressed("ability2")){

        }

        let dir = this.getInputDirection();

		this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x; //TODO: do we want to change this?

		this.owner.move(this.parent.velocity.scaled(deltaT));

        if(this.owner.onGround){
			this.finished(PlayerStates.PREVIOUS);
		}
    }
}