import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { BossStates } from "../BossController";
import OnGround from "./OnGround";

export default class Absorb extends OnGround{
    owner:AnimatedSprite

	onEnter(): void {
		this.parent.velocity.x = 0.1
        this.parent.velocity.y = 0
		this.owner.animation.play("Ability 3", true);
        this.parent.absorbDuration.start()
        this.parent.damageFactor = 0.25
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}

	handleInput(event: GameEvent) {}
	

	update(deltaT: number): void {
		super.update(deltaT);

		this.owner.move(this.parent.velocity.scaled(deltaT));
        if(this.parent.absorbDuration.isStopped()){
            this.parent.damageFactor = 1
            this.finished(BossStates.IDLE)
            this.parent.absorbTimer.start()
        }
	}
}