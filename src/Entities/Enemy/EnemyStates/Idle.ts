import { Game_Events } from "../../../Enums/GameEvents";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyState from "./EnemyState";


/**
 * The idle enemy state. Enemies don't do anything until the player comes near them. 
 */
export default class Idle extends EnemyState{
	onEnter(): void {
		this.parent.velocity = this.parent.velocity;
		(<AnimatedSprite>this.owner).animation.play("IDLE", true);
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}

	handleInput(event: GameEvent) {
		if(event.type === Game_Events.PLAYER_MOVE){
			let pos = event.data.get("position");
			if(this.owner.position.x - pos.x < (64*10)){

			}
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);
		
		this.parent.velocity.x = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}
}