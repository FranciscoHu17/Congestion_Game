import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Input from "../../Wolfie2D/Input/Input";

//import { HW4_Events } from "../hw4_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Walk from "./PlayerStates/Walk";
import Switching from "./PlayerStates/Switching";
import GameLevel from "../../Scenes/Levels/GameLevel";
import PlayerState from "./PlayerStates/PlayerState";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import { Game_Events } from "../../Enums/GameEvents";
import Timer from "../../Wolfie2D/Timing/Timer";
import Dying from "./PlayerStates/Dying";
import BattlerAI from "../../GameSystems/BattlerAI";
import Ability from "../../GameSystems/Abilities/Ability";
import AbilityType from "../../GameSystems/Abilities/AbilityType";
import BattleManager from "../../GameSystems/BattleManager";
import TahoeQ from "../../GameSystems/Abilities/TahoeQ";
import TahoeE from "../../GameSystems/Abilities/TahoeE";
import RenoQ from "../../GameSystems/Abilities/RenoQ";
import RenoE from "../../GameSystems/Abilities/RenoE";
import FlowQ from "../../GameSystems/Abilities/FlowQ";
import FlowE from "../../GameSystems/Abilities/FlowE";
import Reno_E from "./PlayerStates/Reno_E";
import Flow_Q from "./PlayerStates/Flow_Q";
import UsingAbility from "./PlayerStates/UsingAbility";
import ProjectileManager from "../../GameSystems/ProjectileManager";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import EnemyController from "../Enemy/EnemyController";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Color from "../../Wolfie2D/Utils/Color";

//import Duck from "./PlayerStates/Duck";
//We proooobably won't need the other states as classes since they are animations that only needs to
//play once and no other checks are needed on them....


export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {//TODO: Do we have to change all the animation names to lower case?
    IDLE = "idle",
    WALK = "walk",
	//DUCKIN = "duck in",
    //DUCKOUT = "duck out",
	JUMP = "jump",
    // DAMAGED = "damaged",
    DYING = "dying",
    // DEATH = "death",
    SWITCHING = "switch",
    // SWITCHINGIN = "switching in",
    // SWITCHINGOUT = "switching out",
    ABILITY = "ability",
    ABILITYQ = "ability 1",
    TAHOEQ = "tahoe q",
    TAHOEE = "tahoe e",
    RENOQ = "reno q",
    RENOE = "reno e",
    FLOWQ = "flow q",
    FLOWE = "flow e",
    // ABILITYEIN = "ability 2 in",
    // ABILITYEOUT = "ability 2 out",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI implements BattlerAI{
    owner: GameNode; //have to design a way to switch the owner.
    //playerID: number = 3; //1=Tahoe, 2=Reno, 3=Flow. Starts with flow by default(?)
    protected states: Array<PlayerState>
    protected viewport: Viewport
    switchTimer: Timer
    players: Array<AnimatedSprite>
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 128*4;
    MAX_SPEED: number = 10000; 
    tilemap: OrthogonalTilemap;
    battleManager: BattleManager;
    projectileManager: ProjectileManager
    

    abilities: Array<Ability> = [];
    currentAbility: Ability;
    abilitiesTimer: Timer;
    basicAttackTimer: Timer;
    basicAttackCooldown: Timer;
    freezeTimer: Timer;
    slowDownTimer: Timer;
    basicAttackCounter: number;
    health: number;//TODO: put in health and damage!!!!

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;
        this.switchTimer = new Timer(1500)
        this.abilitiesTimer = new Timer(1500)
        this.basicAttackTimer = new Timer(3000)
        this.basicAttackCooldown = new Timer(1000)
        this.freezeTimer = new Timer(2000, () =>{
            this.owner.unfreeze()
            this.velocity.x = 0
            this.velocity.y = 0
        })
        this.slowDownTimer = new Timer(5000, () => {
            this.MIN_SPEED = 128 * 4;
            this.MAX_SPEED = 10000;
        })


        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap("bottom") as OrthogonalTilemap;
        this.players = options.players
        this.viewport = options.viewport
        this.health = options.health ? options.health : 100
        this.basicAttackCounter = 0


        this.initializeAbilities();
        this.projectileManager = ProjectileManager.getInstance()



        this.receiver.subscribe(Game_Events.SWITCHING)
        this.receiver.subscribe(Game_Events.SWITCHING_END)
        this.receiver.subscribe(Game_Events.PLAYER_DYING)
        this.receiver.subscribe(Game_Events.PLAYER_DEATH)
        this.receiver.subscribe(Game_Events.RENO_ABILITY2)
        this.receiver.subscribe(Game_Events.FLOW_ABILITY1)
        this.receiver.subscribe(Game_Events.ABILITYFINISHED)
        this.receiver.subscribe(Game_Events.ENEMY_DIED)
    }

    //TODO: change all the stats later
    initializeAbilities(){
        this.battleManager = BattleManager.getInstance();

        let tahoeq = new TahoeQ();
        tahoeq.initialize({damage: 10, cooldown:1800, displayName: "TahoeQ", spriteKey: "tahoe", useVolume: 100});
        let tahoeQ = new Ability(this.players[0], tahoeq, this.battleManager);
        this.abilities.push(tahoeQ);

        let renoq = new RenoQ();
        renoq.initialize({damage: 100, cooldown:1000, displayName: "RenoQ", spriteKey: "reno", useVolume: 100});
        let renoQ = new Ability(this.players[1], renoq, this.battleManager);
        this.abilities.push(renoQ);

        let flowq = new FlowQ();
        flowq.initialize({damage: 0, cooldown:1800, displayName: "FlowQ", spriteKey: "flow", useVolume: 100});
        let flowQ = new Ability(this.players[2], flowq, this.battleManager);
        this.abilities.push(flowQ);

        let tahoee = new TahoeE();
        tahoee.initialize({damage: 10, cooldown:1800, displayName: "TahoeE", spriteKey: "tahoe", useVolume: 100});
        let tahoeE = new Ability(this.players[0], tahoee, this.battleManager);
        this.abilities.push(tahoeE);

        let renoe = new RenoE();
        renoe.initialize({damage: 0, cooldown: 800, displayName: "RenoE", spriteKey: "reno", useVolume: 100});
        let renoE = new Ability(this.players[1], renoe, this.battleManager);
        this.abilities.push(renoE);

        let flowe = new FlowE();
        flowe.initialize({damage: 0, cooldown:1800, displayName: "FlowE", spriteKey: "flow", useVolume: 100});
        let flowE = new Ability(this.players[2], flowe, this.battleManager);
        this.abilities.push(flowE);

        this.currentAbility = tahoeQ;
    }


    switchOwner(newOwner: string){
        let leftBound = this.owner.collisionShape.left;
        let rightBound = this.owner.collisionShape.right;
        let bottomBound = this.owner.collisionShape.bottom;

        for(let i = 0; i< 3; i++){
            if(this.players[i].imageId === newOwner){
                this.owner = this.players[i]

                this.owner.position.x = rightBound - this.owner.collisionShape.halfSize.x
                if(this.tilemap.getTileAtWorldPosition((<Sprite>this.owner).boundary.topLeft)){
                    this.owner.position.x = leftBound + this.owner.collisionShape.halfSize.x  
                }
                this.owner.position.y = bottomBound - this.owner.collisionShape.halfSize.y - this.owner.colliderOffset.y

                console.log()

                this.players[i].enablePhysics()
                this.players[i].visible = true

                this.updateStateOwners()
                this.viewport.follow(this.owner)
            }
            else{
                this.players[i].disablePhysics()
                this.players[i].visible = false
            }
        }

        let enemies = this.battleManager.getEnemies()
        for(let enemy of enemies){
            (<EnemyController>enemy).player = this.owner
        }
    }

    updateStateOwners(): void{
        for(let i=0; i < this.states.length; i++){
            this.states[i].owner = this.owner
        }
    }

    initializePlatformer(): void {
        this.speed = 5000;
        this.states = []

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
        this.states.push(idle)

		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
        this.states.push(walk)

		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        this.states.push(jump)

        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        this.states.push(fall)

        let switching = new Switching(this, this.owner)
        this.addState(PlayerStates.SWITCHING, switching)
        this.states.push(switching)

        let dying = new Dying(this, this.owner)
        this.addState(PlayerStates.DYING, dying)
        this.states.push(dying)

        let renoe = new Reno_E(this, this.owner);
        this.addState(PlayerStates.RENOE, renoe);
        this.states.push(renoe);

        let flowq = new Flow_Q(this, this.owner);
        this.addState(PlayerStates.FLOWQ, flowq);
        this.states.push(flowq);

        let using_ability = new UsingAbility(this, this.owner)
        this.addState(PlayerStates.ABILITY, using_ability)
        this.states.push(using_ability)

        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    damage(damage: number): void {
        if(this.owner.isCollidable === false){
            damage = 0;
        }
        this.health -= damage;
        console.log("player health:", this.health)
        if(this.health <= 0){
            this.owner.disablePhysics();
            this.MIN_SPEED = 128 * 4
            this.MAX_SPEED = 10000
            this.emitter.fireEvent(Game_Events.PLAYER_DYING);
        }
        else if(this.owner.isCollidable === false){
        }
        else{
            if(this.slowDownTimer.isStopped()){
                (<AnimatedSprite>this.owner).animation.play("Damaged", false, Game_Events.ABILITYFINISHED);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "playerDamaged", loop: false, holdReference: true});
            }
        }
        /*
        if(this.health <= 0){
            this.owner.setAIActive(false, {});
            this.owner.isCollidable = false;
            this.owner.visible = false;
            this.owner.disablePhysics()
        }*/
    }

    update(deltaT: number): void {
		super.update(deltaT);
        if(this.freezeTimer.isStopped()){
            //TODO: use a timer to make sure to only use one ability at a time
            if(Input.isJustPressed("ability1") && this.abilitiesTimer.isStopped() && !(this.currentState instanceof Switching) && !(this.currentState instanceof Dying)){
                var currentPlayer = (<AnimatedSprite>this.owner).imageId;
                if(currentPlayer == "tahoe"){
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "tahoeQ", loop: false, holdReference: true});
                    super.changeState(PlayerStates.ABILITY)
                    this.currentAbility = this.abilities[0]
                    this.abilities[0].use(this.owner, "player", (<Sprite>this.owner).direction);
                    this.abilitiesTimer.start(this.abilities[0].type.cooldown)
                }else if(currentPlayer == "reno"){
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "renoQ", loop: false, holdReference: true});
                    super.changeState(PlayerStates.ABILITY)
                    this.currentAbility = this.abilities[1]
                    this.abilities[1].use(this.owner, "player", (<Sprite>this.owner).direction);

                    this.abilitiesTimer.start(this.abilities[1].type.cooldown)
                }else if(currentPlayer == "flow"){
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "flowQ", loop: false, holdReference: true});
                    super.changeState(PlayerStates.ABILITY)
                    this.currentAbility = this.abilities[2]
                    this.abilities[2].use(this.owner, "player", (<Sprite>this.owner).direction);
                    this.abilitiesTimer.start(this.abilities[2].type.cooldown)
                }

            }else if(Input.isJustPressed("ability2") && this.abilitiesTimer.isStopped() && !(this.currentState instanceof Switching) && !(this.currentState instanceof Dying)){
                var currentPlayer = (<AnimatedSprite>this.owner).imageId;

                if(currentPlayer == "tahoe"){
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "tahoeE", loop: false, holdReference: true});
                    super.changeState(PlayerStates.ABILITY)
                    this.abilities[3].use(this.owner, "player", (<Sprite>this.owner).direction);
                    this.currentAbility = this.abilities[3]
                    this.abilitiesTimer.start(this.abilities[3].type.cooldown)
                }else if(currentPlayer == "reno"){
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "renoE", loop: false, holdReference: true});
                    super.changeState(PlayerStates.ABILITY)
                    this.abilities[4].use(this.owner, "player", (<Sprite>this.owner).direction);
                    this.currentAbility = this.abilities[4]
                    this.abilitiesTimer.start(this.abilities[4].type.cooldown)
                }else if(currentPlayer == "flow" && ((this.currentState instanceof Walk) || (this.currentState instanceof Idle))){
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "flowE", loop: false, holdReference: true});
                    super.changeState(PlayerStates.ABILITY)
                    this.currentAbility = this.abilities[5]
                    this.abilities[5].use(this.owner, "player", (<Sprite>this.owner).direction);
                    this.abilitiesTimer.start(this.abilities[5].type.cooldown)
                }
            }else if(Input.isMouseJustPressed() && this.basicAttackCooldown.isStopped() && this.abilitiesTimer.isStopped()
                    && !(this.currentState instanceof Switching) && !(this.currentState instanceof Dying) 
                    && this.players[0].frozen === false && this.players[1].frozen === false && this.players[2].frozen === false){
                if(this.projectileManager.getNumBasicShots() == 0){
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "basicAttack", loop: false, holdReference: true});
                    (<AnimatedSprite>this.owner).animation.play("Basic Attack", false);
                    if(this.currentState instanceof Walk){
                        (<AnimatedSprite>this.owner).animation.queue("Walk", true);
                    }
                    else{
                        (<AnimatedSprite>this.owner).animation.queue("Idle", true);
                    }
                }
                this.projectileManager.fireProjectileByKey(this.owner, "basic", this.owner.position.dirTo(Input.getGlobalMousePosition()), 20)
                if(this.projectileManager.getNumBasicShots() > 0){
                    this.basicAttackTimer.start()
                }
                if(!this.basicAttackTimer.isStopped()){
                    this.basicAttackCounter += 1
                    if(this.basicAttackCounter == this.projectileManager.SHOTS_PER_ROUND){
                        this.basicAttackCounter = 0
                        this.basicAttackCooldown.start()
                        console.log("cooldown start")
                    }
                }
            }

            if(Input.isJustPressed("pause")){
                this.emitter.fireEvent(Game_Events.GAME_PAUSED);
            }

            Debug.log("Direction", "Direction: "+ (<Sprite>this.owner).direction);
            Debug.log("velocity", "Velocity: "+ this.velocity);
            if(this.currentState instanceof Jump){
                Debug.log("playerstate", "Player State: Jump");
            } else if (this.currentState instanceof Walk){
                Debug.log("playerstate", "Player State: Walk");
            } else if (this.currentState instanceof Idle){
                Debug.log("playerstate", "Player State: Idle");
            } else if(this.currentState instanceof Fall){
                Debug.log("playerstate", "Player State: Fall");
            } 
        }
    }
}
