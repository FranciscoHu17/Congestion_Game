import OnGround from "./OnGround";
import { PlayerStates } from "./PlayerController";
import PlayerState from "./PlayerState";

export default class Idle extends OnGround {
	onEnter(): void {
		this.owner.speed = this.owner.MIN_SPEED;
	}

	update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(!dir.isZero() && dir.y === 0){
			if(this.input.isPressed("shift")){
				this.finished(PlayerStates.RUN);
			} else {
				this.finished(PlayerStates.WALK);
			}
		}
		
		this.owner.velocity.x = 0;

		this.owner.move(this.owner.velocity.scaled(deltaT));
	}
}