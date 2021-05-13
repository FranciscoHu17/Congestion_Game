import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { BossStates } from "../BossController";
import BossState from "./BossState";

export default class OnGround extends BossState {
	onEnter(options: Record<string, any>): void {}

	handleInput(event: GameEvent){}
	

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

		(<Sprite>this.owner).invertX = MathUtils.sign((<Sprite>this.owner).direction.x) < 0;

        /*if(!this.owner.onGround){
            this.finished(EnemyStates.FALL)
        }*/
	}

	onExit(): Record<string, any> {
		return {};
	}
}