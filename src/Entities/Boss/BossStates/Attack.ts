import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Timer from "../../../Wolfie2D/Timing/Timer";
import BossAI, { BossStates } from "../BossController";
import Absorb from "./Absorb";
import BossState from "./BossState";
import OnGround from "./OnGround";

export default class Attack extends OnGround {
    owner: AnimatedSprite

    // The current known position of the player
    playerPos: Vec2;

    // The last known position of the player
    lastPlayerPos: Vec2;

    // The return object for this state
    retObj: Record<string, any>;


    onEnter(options: Record<string, any>): void {
        console.log("attack")
        this.owner.animation.play("Ability 1", true)
        
        this.lastPlayerPos = this.parent.getPlayerPosition();
        this.parent.velocity.x = 1
        // Reset the return object
        this.retObj = {};
    }

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        super.update(deltaT)

        if(this.parent.pollTimer.isStopped()){
            // Restart the timer
            this.parent.pollTimer.start();

            this.playerPos = this.parent.getPlayerPosition();

            if(this.playerPos !== null){
                // If we see a new player position, update the last position
                this.lastPlayerPos = this.playerPos;
                this.owner.direction.x = (this.playerPos.x - this.owner.position.x) > 0 ? 1 : -1
                this.owner.direction.y = 0  
                this.parent.velocity.x = this.parent.owner.direction.x * this.parent.speed*.7 * 3;
            }
        }
        
        if(this.playerPos !== null){
            // Player is visible, restart the exitTimer
            this.parent.exitTimer.start();
            let basic_attack = this.parent.basic_attack
            
            if(basic_attack && this.parent.basicAttackTimer.isStopped()){
                // Fire at the player
                let pad = (this.parent.player.position.x - this.parent.owner.position.x) > 0  ? -3*128: 3*128
                let pos = this.playerPos.clone()
                pos.x +=pad
                let dir = pos.sub(this.owner.position).normalize();
                //console.log(dir.x)
                //console.log(dir.y)
                this.parent.fireBasicAttacks(this.owner, dir, this.parent.key)
                //this.owner.animation.queue("Idle", true)
            }
            else if(this.parent.absorbTimer.isStopped()){
                this.finished(BossStates.ABSORB)
            }
            else if(this.parent.endLagTimer.isStopped()){
                this.parent.useAbility(this.owner.direction)
            }
            
        }
        
        if(this.parent.exitTimer.isStopped()){
            // We haven't seen the player in a while, go check out where we last saw them, if possible
            if(this.lastPlayerPos !== null){
                this.retObj = {target: this.lastPlayerPos}
                this.finished(BossStates.IDLE);
            } else {
                this.finished(BossStates.WALK);
            }
        }

        
        this.owner.move(this.parent.velocity.scaled(deltaT));
    }

    onExit(): Record<string, any> {
        console.log("disengage")
        return this.retObj;
    }

}