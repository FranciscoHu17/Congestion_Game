import { Game_Events } from "../../../Enums/GameEvents";
import GameLevel from "../../../Scenes/Levels/GameLevel";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
//import { HW4_Events } from "../../hw4_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import PlayerState from "./PlayerState";

export default class Reno_E extends PlayerState {
    owner: AnimatedSprite;
	retObj: Record<string, any>;

    handleInput(event: GameEvent): void {
        if(event.type == Game_Events.PLAYER_DYING){
			this.finished(PlayerStates.DYING)
		}
    }

	onEnter(options: Record<string, any>): void {
		let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("bottom").getItems()[0];
        var direction = this.getInputDirection();
        if(direction.x!= 0){
            var teleportx = this.owner.position.x + ((128+50) * direction.x);
            var top = walls.getColRowAt(new Vec2(teleportx, this.owner.boundary.top+30));
            var middle = walls.getColRowAt(new Vec2(teleportx, this.owner.position.y));
            var bottom = walls.getColRowAt(new Vec2(teleportx, this.owner.boundary.bottom-30));
            if((!walls.isTileCollidable(top.x, top.y)) && (!walls.isTileCollidable(bottom.x, bottom.y)) 
                && (!walls.isTileCollidable(middle.x, middle.y))){
                this.owner.position.copy(new Vec2(teleportx, this.owner.position.y));
            }
        }
		this.owner.animation.play("Ability 2 Finish", false, Game_Events.ABILITYFINISHED);
		this.retObj = {};
	}

	update(deltaT: number): void {
		super.update(deltaT);
		
        if(!this.owner.animation.isPlaying("Ability 2 Finish")){
            this.finished(PlayerStates.IDLE);
        }
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return this.retObj;
	}
}