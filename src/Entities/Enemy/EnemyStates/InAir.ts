import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";


export default abstract class InAir extends EnemyState {
    handleInput(event: GameEvent){

	}

    update(deltaT: number): void {
        super.update(deltaT);


		this.owner.move(this.parent.velocity.scaled(deltaT));
	
        if(this.owner.onGround){
			this.finished(EnemyStates.IDLE)
		}
    }
}