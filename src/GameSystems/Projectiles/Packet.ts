import { Game_Events } from "../../Enums/GameEvents"
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB"
import Vec2 from "../../Wolfie2D/DataTypes/Vec2"
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode"
import GameNode from "../../Wolfie2D/Nodes/GameNode"
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect"
import ProjectileManager from "../ProjectileManager"
import Projectile from "./Projectile"

export default class Packet extends Projectile{
    /**
     * Initialize the Packet type for Projectiles
     * @param options   Packet option {owner: Gamenode, key: string, speed: number, max_dist: number, size: Vec2, target: string}
     */
    initialize(options: Record<string, any>): void{
        this.owner = options.owner
        this.key = options.key
        this.target = options.target
        this.SPEED = options.speed
        this.MAX_DIST = options.max_dist
        this.size = options.size
        this.velocity = Vec2.ZERO;
        this.active = false
        this.start = Vec2.ZERO
        this.damage = 1

        
        this.owner.addPhysics(new AABB(Vec2.ZERO, this.size.scaled(.5,.5)))
        this.owner.isCollidable = false
        this.owner.setGroup("projectile")
        this.owner.setTrigger(options.target, Game_Events.PROJECTILE_COLLISION, null)
    }

    /**
     * Sets this Packet's activity
     * @param active    Whether this Packet is active or not
     */
    setActivity(active: boolean): void{
        this.active = active

        if(active){
            this.start = this.owner.position.clone();
            this.owner.enablePhysics();
            this.owner.unfreeze();
            (<CanvasNode>this.owner).visible = true
        }
        else{
            this.owner.disablePhysics();
            this.owner.freeze();
            (<CanvasNode>this.owner).visible = false
            
        }
    }

    /**
     * Update the movement of this Packet
     * @param deltaT    Amount of time that has passed
     */
    update(deltaT: number){
        this.owner.move(this.velocity.scaled(deltaT))
        if(this.owner.isColliding || this.start.distanceTo(this.owner.position) > this.MAX_DIST){
            ProjectileManager.getInstance().deactivateProjectile(<GameNode>this.owner)   
        }

    }
}