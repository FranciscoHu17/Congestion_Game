import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { BossStates } from "../BossController";
import OnGround from "./OnGround";

export default class Absorb extends OnGround{
    owner:AnimatedSprite;


	onEnter(): void {
		this.parent.velocity.x = 0.1
        this.parent.velocity.y = 0
		this.owner.animation.play("Ability 3", true);
        this.parent.absorbDuration.start()
        this.parent.damageFactor = .25
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
            this.owner.direction.x = (this.parent.player.position.x - this.owner.position.x) > 0 ? 1 : -1
            this.owner.direction.y = 0  
            if(this.parent.numTripleAcks > 0){
                if(this.parent.tripleAckTimer.isStopped()){
                    let pad = (this.parent.player.position.x - this.parent.owner.position.x) > 0  ? -3*128: 3*128
                    let pos = this.parent.player.position.clone()
                    pos.x +=pad
                    let dir = pos.sub(this.owner.position).normalize();
                    this.parent.fireBasicAttacks(this.owner, dir, "tripleack")
                    this.parent.numTripleAcks--;
                }
            }
            else{
                this.parent.damageFactor = 1
                this.finished(BossStates.IDLE)
                this.parent.absorbTimer.start()
            }
        }
	}
}