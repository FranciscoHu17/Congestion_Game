import { Game_Events } from "../../../Enums/GameEvents";
import BattleManager from "../../../GameSystems/BattleManager";
import GameLevel from "../../../Scenes/Levels/GameLevel";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
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
        let limit = 128*7
		let enemies = BattleManager.getInstance().getEnemies()
        

        if (enemies.length > 0){
            let dist = enemies[0].owner.position.distanceTo(this.owner.position) < limit ? enemies[0].owner.position.distanceTo(this.owner.position) : limit
            let closest = dist < limit ? enemies[0] : null
            
            for(let i = 1; i < enemies.length; i++){
                let curr_dist = enemies[i].owner.position.distanceTo(this.owner.position)
                if (curr_dist < dist){
                    closest = enemies[i]
                    dist = curr_dist
                }
            }

            if(closest != null && closest.health > 0){
                let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("bottom").getItems()[0];
                let teleport = closest.owner.position.clone()
                teleport.x += 128*3/4 * -1*(<Sprite>closest.owner).direction.x
                let behind = walls.getTileAtWorldPosition(teleport)

                if(behind == 0){
                    this.owner.position = teleport;
                }
                else{
                    console.log("cant teleport because of the walls behind the enemy!")
                }

            }
            else{
                console.log("no enemies found")
            }
        }
        

		this.owner.animation.play("Ability 2 Finish", false);
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