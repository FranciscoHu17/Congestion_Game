import { Game_Events } from "../../../Enums/GameEvents";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import OnGround from "./OnGround";


/**
 * The idle enemy state. Enemies don't do anything until the player comes near them. 
 */
export default class Idle extends OnGround{
    owner:AnimatedSprite

	onEnter(): void {
		this.parent.velocity = this.parent.velocity;
		this.owner.animation.play("Idle", true);
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}

	handleInput(event: GameEvent) {}
	

	update(deltaT: number): void {
		super.update(deltaT);

		this.owner.move(this.parent.velocity.scaled(deltaT));
        if(this.parent.getPlayerPosition() !== null){
            this.finished(EnemyStates.ATTACK)
        }
	}
}