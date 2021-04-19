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

export default class UsingAbility extends PlayerState{
	owner: AnimatedSprite;
    

	constructor(parent: StateMachine, owner: GameNode){
		super(parent, owner)
	}

	onEnter(options: Record<string, any>): void {
        this.parent.direction.x = this.parent.initialDirX
    }

	handleInput(event: GameEvent): void {
        if(event.type == Game_Events.ABILITYFINISHED){
			this.finished(PlayerStates.IDLE)
		}
    }

	update(deltaT: number): void {
        super.update(deltaT)
        let dir = this.getInputDirection();

		this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x; //TODO: do we want to change this?
        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
        this.parent.direction.x = this.parent.initialDirX
		return {};
	}
}