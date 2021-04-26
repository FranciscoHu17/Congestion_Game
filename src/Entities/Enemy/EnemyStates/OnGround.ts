import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";

export default class OnGround extends EnemyState {
	onEnter(options: Record<string, any>): void {}

	handleInput(event: GameEvent){}
	

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

        if(!this.owner.onGround){
            this.finished(EnemyStates.FALL)
        }
	}

	onExit(): Record<string, any> {
		return {};
	}
}