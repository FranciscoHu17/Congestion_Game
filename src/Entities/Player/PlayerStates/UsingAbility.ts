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
    }

	handleInput(event: GameEvent): void {
        if(event.type == Game_Events.ABILITYFINISHED){
			this.finished(PlayerStates.FALL)
		}
		if(event.type == Game_Events.PLAYER_DYING){
			this.finished(PlayerStates.DYING)
		}
		if(event.type == Game_Events.RENO_ABILITY2){
			this.finished(PlayerStates.RENOE)
		}
		if(event.type == Game_Events.FLOW_ABILITY1){
			this.finished(PlayerStates.FLOWQ)
		}
    }

	update(deltaT: number): void {
        super.update(deltaT)
        let dir = this.getInputDirection();
		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}
		if(this.owner.onGround && Input.isJustPressed("jump")){ //TODO: might have to change input name
			this.parent.velocity.y = -128*8;
		}

		this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x; //TODO: do we want to change this?
        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		return {};
	}
}