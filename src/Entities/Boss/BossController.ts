import { Game_Events } from "../../Enums/GameEvents";
import Ability from "../../GameSystems/Abilities/Ability";
import AbilityType from "../../GameSystems/Abilities/AbilityType";
import BattleManager from "../../GameSystems/BattleManager";
import BattlerAI from "../../GameSystems/BattlerAI";
import SlowDown from "../../GameSystems/BossAbilities/SlowDown";
import Absorb from "../../GameSystems/BossAbilities/Absorb";
import TripleAck from "../../GameSystems/BossAbilities/TripleAck";
import ProjectileManager from "../../GameSystems/ProjectileManager";
import Projectile from "../../GameSystems/Projectiles/Projectile";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import Attack from "./BossStates/Attack";
import Walk from "./BossStates/Walk";
//import Fall from "./BossStates/Fall";
import Idle from "./BossStates/Idle";


export default class BossController extends StateMachineAI implements BattlerAI {
    battleManager: BattleManager
    projectileManager: ProjectileManager

    /** The owner of this AI */
    owner: AnimatedSprite;

    /** The amount of health this entity has */
    health: number;
    maxHealth: number;

    direction: Vec2 = Vec2.ZERO;

    /** Current velocity */
    velocity: Vec2 = new Vec2(0,0)

    /** Movement speed */
    speed: number = 128*2;

    /** Friction */
    friction: number = 0;

    /** Projectile that belongs to this controller */
    basic_attack: Array<Projectile>;

    /** basic attack key of this enemy */
    key: string

    /** The weapon this AI has */
    ability: Ability;

    /** A reference to the player object */
    player: GameNode;

    /** Timers */
    exitTimer: Timer;
    pollTimer: Timer;
    basicAttackTimer: Timer;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.projectileManager = ProjectileManager.getInstance()
        this.battleManager = BattleManager.getInstance()
        
        this.owner = owner;
        let damage = options.damage?  options.damage : 1;
        this.health = options.health ? options.health : 30;//TODO: change this later??
        this.maxHealth = this.health;
        this.key = options.basic_attack ? options.basic_attack : null
        this.basic_attack = []
        let ability = options.ability ? options.ability : null;
        this.player = options.player ? options.player : null;


        this.exitTimer = new Timer(1000)
        this.pollTimer = new Timer(1000)
        this.basicAttackTimer = new Timer(1000)

        this.initializeStates()
        this.initializeBasicAttack(damage)
        this.initializeAbilities(ability)

        // Subscribe to events
        this.receiver.subscribe(Game_Events.ENEMY_DIED);

        // Initialize to the default state
        //this.initialize(EnemyStates.DEFAULT);

        this.getPlayerPosition();
    }

    getMaxHealth() :number{
        return this.maxHealth;
    }

    initializeStates(){
        let idle = new Idle(this, this.owner);
        this.addState(BossStates.IDLE, idle);

        let attack = new Attack(this, this.owner);
        this.addState(BossStates.ATTACK, attack);

        let walk = new Walk(this, this.owner);
        this.addState(BossStates.WALK, walk);

        /*let fall = new Fall(this, this.owner)
        this.addState(EnemyStates.FALL,fall)*/

        this.initialize(BossStates.IDLE)
    }

    initializeBasicAttack(damage: number){
        if(this.key == "enemy_basic"){
            let size = new Vec2(32,12)
            let projectile = <Rect>this.owner.getScene().add.graphic(GraphicType.RECT, "primary", {position: new Vec2, size: size})
            projectile.color = Color.CYAN
            let basic_attack = this.projectileManager.addPacket({owner: projectile, key: this.key, speed: 128*7,
                                max_dist: 128*6, size: size, target:"player"})
            basic_attack.damage = damage
            this.basic_attack.push(basic_attack)
        }
        else if(this.key == "enemy_around"){
            let size = new Vec2(32,12)
            for(let i = 0; i < 6; i++){
                let projectile = <Rect>this.owner.getScene().add.graphic(GraphicType.RECT, "primary", {position: new Vec2, size: size})
                projectile.color = Color.MAGENTA
                let basic_attack = this.projectileManager.addPacket({owner: projectile, key: this.key, speed: 128*7,
                                max_dist: 128*7, size: size, target:"player"})
                basic_attack.damage = damage
                this.basic_attack.push(basic_attack)
            }
        }
        else{
            this.basic_attack = null
        }
    }

    initializeAbilities(ability: string){
        if(ability == "slowDown"){
            let slowDown = new SlowDown()
            slowDown.initialize({damage: 40, cooldown:3000, displayName: "SlowDown", spriteKey: this.owner.imageId, useVolume: 100})
            this.ability = new Ability(this.owner, slowDown, this.battleManager)
        }
        if(ability == "absorb"){
            let absorb = new Absorb()
            absorb.initialize({damage: 40, cooldown:5000, displayName: "Absorb", spriteKey: this.owner.imageId, useVolume: 100})
            this.ability = new Ability(this.owner, absorb, this.battleManager)
        }
        if(ability == "tripleAck"){
            let tripleAck = new TripleAck()
            tripleAck.initialize({damage: 40, cooldown:5000, displayName: "TripleAck", spriteKey: this.owner.imageId, useVolume: 100})
            this.ability = new Ability(this.owner, tripleAck, this.battleManager)
        }
    }

    fireBasicAttacks(shooter: GameNode, dir: Vec2){
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "enemyAttack", loop: false, holdReference: true});
        if(this.key == "enemy_basic"){
            let basic_attack = this.basic_attack[0]
            this.projectileManager.fireSpecificProjectile(this.owner, basic_attack, dir, basic_attack.damage)
            this.basicAttackTimer.start(1000)
        }
        else if(this.key == "enemy_around"){
            let curr_dir = dir.set(1,0) 
            let curr_angle = Math.PI/2
            for(let basic_attack of this.basic_attack){
                let prevX = this.projectileManager.startPosition.x
                this.projectileManager.startPosition.x = 0
                this.projectileManager.fireSpecificProjectile(this.owner, basic_attack, curr_dir, basic_attack.damage)
                this.projectileManager.startPosition.x = prevX
                curr_angle += Math.PI/(this.basic_attack.length-1)
                curr_dir.x = Math.sin(curr_angle)
                curr_dir.y = Math.cos(curr_angle)
            }
            this.basicAttackTimer.start(2000)
        }
        
    }

    useAbility(direction: Vec2){
        this.ability.use(this.owner, "enemy", direction)
    }

    activate(options: Record<string, any>): void {
    }

    damage(damage: number): void {
        this.health -= damage;
        console.log("boss health:", this.health)
        
        if(this.health <= 0){
            this.owner.animation.play("Death", false, Game_Events.ENEMY_DIED);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "enemyDeath", loop: false, holdReference: true});
        }
        else
        {
            this.owner.animation.play("Taking Damage", false);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "enemyDamaged", loop: false, holdReference: true});
            if(this.currentState instanceof Attack){
                this.owner.animation.queue("Attack", true);
            }
            else{
                this.owner.animation.queue("Idle", true);
            }
        }
    }

    getPlayerPosition(): Vec2 {
        let pos = this.player.position;

        // Get the new player location
        let start = this.owner.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("bottom").getItems()[0];

        let minIndex = walls.getColRowAt(new Vec2(minX, minY));
        let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        let tileSize = walls.getTileSize();

        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)){
                        // We hit a wall, we can't see the player
                        return null;
                    }
                }
            }
        }

        return pos;
    }

    update(deltaT: number): void {
		super.update(deltaT);
	}
}

export enum BossStates {
    DEFAULT = "default",
    IDLE = "idle",
    ALERT = "alert",
    ATTACK = "attack",
    PREVIOUS = "previous",
    WALK = "walk"
    //FALL = "fall"
}