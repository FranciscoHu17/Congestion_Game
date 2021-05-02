import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import CanvasNode from "../Wolfie2D/Nodes/CanvasNode";
import GameNode from "../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../Wolfie2D/Scene/Scene";
import Timer from "../Wolfie2D/Timing/Timer";
import Color from "../Wolfie2D/Utils/Color";
import Packet from "./Projectiles/Packet";
import Projectile from "./Projectiles/Projectile";

export default class ProjectileManager{
    /** ProjectileManager Singleton */
    private static instance: ProjectileManager; 

    /** Array of all the projectiles */
    private projectiles: Array<Projectile>; 

    /** Array of all the active projectiles */
    private activeProjectiles: Array<Projectile> 

    /** Padding of the start position of projectile */
    private startPositon: Vec2 = new Vec2(128*.5,0)

    /** Number of active basic attacks */
    private basicShots: number = 0

    /** Max number of active basic attacks */
    readonly SHOTS_PER_ROUND = 3;


    /* ######################################## SINGLETON ########################################*/
    /**
     * Returns the current instance of this class or a new instance if none exist
     * @returns The projectile manager
     */
    static getInstance(): ProjectileManager {
        if(!this.instance){
            this.instance = new ProjectileManager();
        }

        return this.instance;
    }

    constructor(){
        this.projectiles = []
        this.activeProjectiles = []
        this.startPositon = new Vec2(128*.5,0)
        this.basicShots = 0
    }

    /**
     * Adds Packet as a projectile
     * @param options Packet option {owner: Gamenode, key: string, speed: number, max_dist: number, size: Vec2}
     */
    addPacket(options: Record<string, any>): Projectile{
        let packet = new Packet()
        packet.initialize(options)
        this.projectiles.push(packet)

        return packet
    }

    /**
     * Adds Player basic attack projectiles, all of Packet type
     * @param scene The scene to add the projectiles to
     */
    addPlayerProjectiles(scene: Scene){
        for(let i = 0; i < this.SHOTS_PER_ROUND; i++){
            //let projectile = scene.add.animatedSprite("basic","primary")
            let size = new Vec2(32,12)
            let projectile = <Rect>scene.add.graphic(GraphicType.RECT, "primary", {position: this.startPositon, size: size})
            projectile.color = Color.GREEN
            this.addPacket({owner: projectile, key: "basic", speed: 128*7, max_dist: 128*7, size: size, target: "enemy"})
        }
    }
    /**
     * Fire a projectile
     * 
     * @param shooter The node that is firing the projectile 
     * @param key   The type of projectile to fire 
     * @param direction The direction to fire the projectile at
     * @param damage    The damage the projectile will deal
     * @returns 
     */
    fireProjectileByKey(shooter: GameNode, key: string, direction: Vec2, damage: number): Projectile{
        for(let projectile of this.projectiles){
            if(projectile.key == key && !projectile.active){
                projectile.owner.position = shooter.position.clone().add(this.startPositon.mult((<Sprite>shooter).direction))
                projectile.velocity.set(direction.x*projectile.SPEED, direction.y*projectile.SPEED)             
                projectile.owner.rotation = Math.atan(-1*direction.y/direction.x)
                projectile.damage = damage
                projectile.setActivity(true)
                this.activeProjectiles.push(projectile)

                if(projectile.key == 'basic'){
                    this.basicShots++
                }

                return projectile;
            }
        }

        return null
    }

    fireSpecificProjectile(shooter: GameNode, projectile: Projectile, direction: Vec2, damage: number): Projectile{
        if(projectile && !projectile.active){
            projectile.owner.position = shooter.position.clone().add(this.startPositon.mult((<Sprite>shooter).direction))
            projectile.velocity.set(direction.x*projectile.SPEED, direction.y*projectile.SPEED)             
            projectile.owner.rotation = Math.atan(-1*direction.y/direction.x)
            projectile.damage = damage
            projectile.setActivity(true)
            this.activeProjectiles.push(projectile)

            return projectile;
        }
        return null
    }

    /**
     * Finds the projectile and deactivate it so that it can be reused
     * 
     * @param projectile The projectile's owner to deactivate
     * @returns The list of projectiles that were deactivated
     */
    deactivateProjectile(projectile: GameNode): Projectile[]{
        for(let i = 0; i < this.activeProjectiles.length; i++){
            let activeProjectile = this.activeProjectiles[i]
            if(activeProjectile.owner == projectile){
                activeProjectile.setActivity(false)

                if(activeProjectile.key == 'basic'){
                    this.basicShots--
                }
                return this.activeProjectiles.splice(i,1)
            }
        }

        return null;
    }

    /**
     * Update movements of active projectiles
     * @param deltaT    Amount of time that has passed
     */
    update(deltaT: number){
        for(let projectile of this.activeProjectiles){
            projectile.update(deltaT)
        }
    }

    /**
     * Gets the array of projectiles 
     * @returns Array of projectiles
     */
    getProjectiles(): Array<Projectile>{
        return this.projectiles
    }

    /**
     * Gets the array of active projectiles 
     * @returns Array of active projectiles
     */
    getActiveProjectiles(): Array<Projectile>{
        return this.activeProjectiles
    }

    /**
     * Gets the number of active basic shots
     * @returns Number of active basic shots
     */
    getNumBasicShots(): number{
        return this.basicShots
    }
}