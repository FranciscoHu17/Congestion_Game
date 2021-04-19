import GameLevel from "../../../Scenes/Levels/GameLevel";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import PlayerState from "./PlayerState";

export default class AbilityQ extends PlayerState {
	owner: AnimatedSprite;
	retObj: Record<string, any>

	onEnter(options: Record<string, any>): void {
        if(this.owner.imageId == "tahoe"){
            this.finished(PlayerStates.TAHOEQ);
        }else if(this.owner.imageId == "reno"){
            this.finished(PlayerStates.RENOQ);
        }else if(this.owner.imageId == "flow"){
            this.finished(PlayerStates.FLOWQ);
        }
	}

    handleInput(event: GameEvent): void {
        //throw new Error("Method not implemented.");
    }

	update(deltaT: number): void {
		super.update(deltaT);
	}

	onExit(): Record<string, any> {
		return this.retObj;
	}
}