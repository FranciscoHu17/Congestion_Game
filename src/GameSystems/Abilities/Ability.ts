import { Game_Events } from "../../Enums/GameEvents";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../Wolfie2D/Timing/Timer";
// import { hw3_Events } from "../../hw3_constants";
import BattleManager from "../BattleManager";
import BattlerAI from "../BattlerAI";
import AbilityType from "./AbilityType";

export default class Ability {
    /** The type of this weapon */
    type: AbilityType;

    sprite: Sprite;

    /** A list of assets this weapon needs to be animated */
    assets: Array<any>;

    /** An event emitter to hook into the EventQueue */
    emitter: Emitter

    /** The battle manager */
    battleManager: BattleManager;

    /** The cooldown timer for this weapon's use */
    cooldownTimer: Timer;

    constructor(sprite: Sprite, type: AbilityType, battleManager: BattleManager){
        // Set the weapon type
        this.type = type;

        // Keep a reference to the sprite of that uses this ability
        this.sprite = sprite;

        // Create an event emitter
        this.emitter = new Emitter();

        // Save a reference to the battler manager
        this.battleManager = battleManager;

        // Create the cooldown timer
        this.cooldownTimer = new Timer(type.cooldown);
    }

    // @override
    /**
     * Uses this weapon in the specified direction.
     * This only works if the cooldown timer has ended
     */
    use(user: GameNode, userType: string, direction: Vec2): boolean {
        // If the cooldown timer is still running, we can't use the weapon
        if(!this.cooldownTimer.isStopped()){
            return false;
        }

        this.type.intializeOwner(user)

        // Rely on the weapon type to create any necessary assets
        this.assets = this.type.createRequiredAssets(this.sprite.getScene(), this.sprite);

        // Do a type specific weapon animation
        this.type.doAnimation(user, direction, ...this.assets);

        // Apply damage
        if(this.type.damage > 0)
            this.battleManager.handleInteraction(userType, this);

        // Send out an event to alert enemies
        //TODO: do i need to get rid of position and volume?
        this.emitter.fireEvent(Game_Events.ABILITYUSED, {position: user.position.clone(), volume: this.type.useVolume});
    
        // Reset the cooldown timer
        this.cooldownTimer.start();

        return true;
    }

    continueUse(position: Vec2,direction: Vec2,userType:string){
        if(!this.cooldownTimer.isStopped()){
            let hitbox = this.assets[0]
            hitbox.position.x = position.x +128*2*direction.x;
            hitbox.position.y = position.y

            if(this.type.damage > 0)
                this.battleManager.handleInteraction(userType, this);
        }
    }

    /**
     * A check for whether or not this weapon hit a node
     */
    interact(ai: BattlerAI): boolean {
        return this.type.interact(ai, ...this.assets);
    }
}