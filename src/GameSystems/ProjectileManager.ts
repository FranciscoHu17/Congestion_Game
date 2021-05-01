import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import CanvasNode from "../Wolfie2D/Nodes/CanvasNode";
import GameNode from "../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import Packet from "./Projectiles/Packet";
import Projectile from "./Projectiles/Projectile";

export default class ProjectileManager{
    private static instance: ProjectileManager;

    private projectiles: Array<Projectile>;

    private activeProjectiles: Array<Projectile>

    private startPositon: Vec2 = new Vec2(128*.5,0)

    protected readonly SHOTS_PER_ROUND = 3;

    /* ######################################## SINGLETON ########################################*/
    /**
     * Returns the current instance of this class or a new instance if none exist
     * @returns The level Manager
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
    }

    addPacket(options: Record<string, any>){
        let packet = new Packet()
        packet.initialize(options)
        this.projectiles.push(packet)
    }

    addPlayerProjectiles(scene: Scene){
        for(let i = 0; i < this.SHOTS_PER_ROUND; i++){
            //let projectile = scene.add.animatedSprite("basic","primary")
            let size = new Vec2(32,12)
            let projectile = <Rect>scene.add.graphic(GraphicType.RECT, "primary", {position: this.startPositon, size: size})
            projectile.color = Color.GREEN
            this.addPacket({owner: projectile, spriteKey: "basic", speed: 128*5, size: size})
        }
    }

    fireProjectile(shooter: GameNode, key: string, direction: Vec2): Projectile{
        for(let projectile of this.projectiles){
            if(projectile.spriteKey == key && !projectile.active){
                projectile.owner.position = shooter.position.clone().add(this.startPositon)
                projectile.velocity.set(direction.x*projectile.SPEED, direction.y*projectile.SPEED) 
                projectile.setActivity(true)
                projectile.owner.rotation = Math.atan(-1*direction.y/direction.x)
                this.activeProjectiles.push(projectile)
                return projectile;
            }
        }

        return null
    }

    deactivateProjectile(projectile: GameNode): Projectile[]{
        for(let i = 0; i < this.activeProjectiles.length; i++){
            let activeProjectile = this.activeProjectiles[i]
            if(activeProjectile.owner == projectile){
                activeProjectile.setActivity(false)
                return this.activeProjectiles.splice(i,1)
            }
        }

        return null;
    }

    update(deltaT: number){
        for(let projectile of this.activeProjectiles){
            projectile.update(deltaT)
        }
    }

    getProjectiles(): Array<Projectile>{
        return this.projectiles
    }

    getActiveProjectiles(): Array<Projectile>{
        return this.activeProjectiles
    }
}