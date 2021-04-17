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
	owner: AnimatedSprite;
	switchingTimer: Timer;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent, owner)

		this.switchingTimer = new Timer(1000)
	}

	onEnter(options: Record<string, any>): void {
		//this.owner.animation.play("Switch Out", false);
		//GameLevel.changePlayer(options.player)
		this.parent.switchOwner(options.player)

		
		this.owner.animation.play("Switch In", false)
		
		
		this.switchingTimer.start()
		

	}

	handleInput(event: GameEvent): void {
		
	}

	update(deltaT: number): void {
		super.update(deltaT);
		if(this.switchingTimer.isStopped()){
			this.finished(PlayerStates.IDLE)
			return;
		}

	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}