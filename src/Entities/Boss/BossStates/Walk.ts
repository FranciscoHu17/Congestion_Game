import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { BossStates } from "../BossController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	time: number;
	
	onEnter(): void {
		console.log("walk")
		if(this.parent.direction.isZero()){
			this.parent.direction = new Vec2(-1, 0);
			(<AnimatedSprite>this.owner).invertX = true;
		}

		(<AnimatedSprite>this.owner).animation.play("Walk", true);

		this.time = Date.now();
	}

	update(deltaT: number): void {
		super.update(deltaT);
		if(this.parent.getPlayerPosition() != null){
			this.parent.velocity.x = 0;
			this.finished(BossStates.ATTACK);
		} 
		this.parent.owner.direction.x = (this.parent.player.position.x - this.parent.owner.position.x) > 0  ? 1: -1
		this.parent.velocity.x = this.parent.owner.direction.x * this.parent.speed * 3;
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}