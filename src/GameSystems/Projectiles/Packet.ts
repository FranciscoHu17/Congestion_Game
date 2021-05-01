import { Game_Events } from "../../Enums/GameEvents"
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB"
import Vec2 from "../../Wolfie2D/DataTypes/Vec2"
import GameNode from "../../Wolfie2D/Nodes/GameNode"
import ProjectileManager from "../ProjectileManager"
import Projectile from "./Projectile"

export default class Packet extends Projectile{
    
    initialize(options: Record<string, any>): void{
        this.owner = options.owner
        this.spriteKey = options.spriteKey
        this.SPEED = options.speed
        this.size = options.size
        this.velocity = Vec2.ZERO;
        this.active = false

        
        this.owner.addPhysics(new AABB(Vec2.ZERO, this.size.scaled(.5,.5)))
        this.owner.isCollidable = false
        this.owner.setGroup("projectile")
        this.owner.setTrigger("enemy", Game_Events.PROJECTILE_COLLISION, null)
    }

    setActivity(active: boolean): void{
        this.active = active

        if(active){
            this.owner.enablePhysics()
            this.owner.unfreeze()
        }
        else{
            this.owner.disablePhysics()
            this.owner.freeze()
        }
    }

    update(deltaT: number){
        this.owner.move(this.velocity.scaled(deltaT))
        if(this.owner.isColliding){
            ProjectileManager.getInstance().deactivateProjectile(<GameNode>this.owner)
            console.log("collided with surface")
        }
    }
}