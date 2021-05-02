import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
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

		(<Sprite>this.owner).invertX = MathUtils.sign((<Sprite>this.owner).direction.x) < 0;

        if(!this.owner.onGround){
            this.finished(EnemyStates.FALL)
        }
	}

	onExit(): Record<string, any> {
		return {};
	}
}