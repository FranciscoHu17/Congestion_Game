import { Game_Events } from "../../../Enums/GameEvents";
import GameLevel from "../../../Scenes/Levels/GameLevel";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { PlayerStates } from "../PlayerController";

import OnGround from "./OnGround";
import PlayerState from "./PlayerState";

export default class Switching extends PlayerState{
	protected newPlayer: string
	owner: AnimatedSprite;
	switching: boolean

	constructor(parent: StateMachine, owner: GameNode){
		super(parent, owner)
		this.switching = false
	}

	onEnter(options: Record<string, any>): void {
		this.newPlayer = options.player
		if (this.newPlayer !=null){
			this.owner.animation.play("Switch Out", false, Game_Events.SWITCHING)
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "switchOut", loop: false, holdReference: true});
			if(this.newPlayer == "tahoe"){
				this.emitter.fireEvent(Game_Events.SWITCH_TO_TAHOE);
			}
			else if(this.newPlayer == "reno"){
				this.emitter.fireEvent(Game_Events.SWITCH_TO_RENO);
			}
			else if(this.newPlayer == "flow"){
				this.emitter.fireEvent(Game_Events.SWITCH_TO_FLOW);
			}
			this.parent.switchTimer.start()
			this.switching = true
		}
		else{
			this.switching = false
		}
	}

	handleInput(event: GameEvent): void {
		if(event.type == Game_Events.SWITCHING){
			this.owner.animation.stop();
			(<Sprite>this.owner).invertX = false;
			let prevDir = (<Sprite>this.owner).direction
			this.parent.switchOwner(this.newPlayer);
			(<Sprite>this.owner).direction = prevDir;
			(<Sprite>this.owner).invertX = MathUtils.sign(this.owner.direction.x) < 0;
			this.owner.animation.play("Switch In", false, Game_Events.SWITCHING_END)
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "switchIn", loop: false, holdReference: true});

		}
		else if(event.type == Game_Events.SWITCHING_END){
			this.switching = false
			this.owner.animation.stop();
		}
	}

	update(deltaT: number): void {
		if(!this.switching){
			this.switching = false

			this.finished(PlayerStates.IDLE);
			return;
		}

	}

	onExit(): Record<string, any> {
		return {};
	}
}