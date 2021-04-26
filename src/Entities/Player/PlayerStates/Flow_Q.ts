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

export default class Flow_Q extends PlayerState {
    owner: AnimatedSprite;
	retObj: Record<string, any>;

    handleInput(event: GameEvent): void {
        if(event.type == Game_Events.PLAYER_DYING){
			this.finished(PlayerStates.DYING)
		}
    }

	onEnter(options: Record<string, any>): void {
		let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("bottom").getItems()[0];
        var direction = this.owner.direction
        if(direction.x!= 0){
            var teleportx = this.owner.position.x + ((128*4) * direction.x);
            var top = walls.getColRowAt(new Vec2(teleportx, this.owner.boundary.top-10));
            var middle = walls.getColRowAt(new Vec2(teleportx, this.owner.position.y));
            var bottom = walls.getColRowAt(new Vec2(teleportx, this.owner.boundary.bottom-10));

            if((!walls.isTileCollidable(top.x, top.y)) && (!walls.isTileCollidable(bottom.x, bottom.y)) 
                && (!walls.isTileCollidable(middle.x, middle.y))){  
                this.owner.position.copy(new Vec2(teleportx, this.owner.position.y));
            }else if((!walls.isTileCollidable(top.x, top.y -2)) && (!walls.isTileCollidable(bottom.x, bottom.y-2)) 
            && (!walls.isTileCollidable(middle.x, middle.y-2))){
                this.owner.position.copy(new Vec2(teleportx, this.owner.position.y - 256));
            }
            else{
                this.finished(PlayerStates.FALL)
            }
        }
		this.owner.animation.play("Ability 1 Finish", false);
		this.retObj = {};
	}

	update(deltaT: number): void {
		super.update(deltaT);
		
        if(!this.owner.animation.isPlaying("Ability 1 Finish")){
            this.finished(PlayerStates.IDLE);
        }
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return this.retObj;
	}
}