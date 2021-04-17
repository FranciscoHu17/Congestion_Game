import { Game_Events } from "../../../Enums/GameEvents";
import GameLevel from "../../../Scenes/Levels/GameLevel";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { PlayerStates } from "../PlayerController";

import OnGround from "./OnGround";
import PlayerState from "./PlayerState";

export default class Switching extends PlayerState{
	protected newPlayer: string
	owner: AnimatedSprite;
	switching: boolean

	constructor(parent: StateMachine, owner: GameNode){
		super(parent, owner)

		this.switching = true
	}

	onEnter(options: Record<string, any>): void {
		this.newPlayer = options.player

		if (this.newPlayer !=null){
			this.owner.animation.play("Switch Out", false, Game_Events.SWITCHING)
			this.parent.switchTimer.start()
		}
		else{
			this.switching = false
		}
	}

	handleInput(event: GameEvent): void {
		if(event.type == Game_Events.SWITCHING){
			this.owner.animation.stop()
			this.parent.switchOwner(this.newPlayer)
			this.owner.animation.play("Switch In", false, Game_Events.SWITCHING_END)

		}
		else if(event.type == Game_Events.SWITCHING_END){
			this.switching = false
			this.owner.animation.stop();
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);
		if(!this.switching){
			this.switching = true
			this.finished(PlayerStates.IDLE)
			return;
		}

	}

	onExit(): Record<string, any> {
		return {};
	}
}