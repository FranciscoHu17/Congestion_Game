import GameNode from "../Wolfie2D/Nodes/GameNode";
import BattlerAI from "./BattlerAI";
import Ability from "./Abilities/Ability";

export default class BattleManager {
    private static instance: BattleManager;

    private player: BattlerAI;

    private enemies: Array<BattlerAI> = [];


    /* ######################################## SINGLETON ########################################*/
    /**
     * Returns the current instance of this class or a new instance if none exist
     * @returns The level Manager
     */
     static getInstance(): BattleManager {
        if(!this.instance){
            this.instance = new BattleManager();
        }

        return this.instance;
    }


    handleInteraction(attackerType: string, weapon: Ability){
        if(attackerType === "player"){
            // Check for collisions with enemies
            console.log(this.enemies)
            for(let enemy of this.enemies){
                if(weapon.interact(enemy)){
                    console.log(enemy)
                    enemy.damage(weapon.type.damage);
                }
            }
        } else {
            // Check for collision with player
            if(weapon.interact(this.player)){
                this.player.damage(weapon.type.damage);
            }
        }
    }

    setPlayer(player: BattlerAI): void {
        this.player = player;
    }

    getPlayer(): BattlerAI{
        return this.player;
    }

    setEnemies(enemies: Array<BattlerAI>): void {
        this.enemies = enemies;
    }

    getEnemies(): Array<BattlerAI>{
        return this.enemies;
    }
}