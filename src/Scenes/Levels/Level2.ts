import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AudioManager, { AudioChannelType } from "../../Wolfie2D/Sound/AudioManager";
import GameLevel from "./GameLevel";

export default class Level2 extends GameLevel{

    /**
     * TODO
     * 
     * Load resources
     */
    loadScene(): void {
        this.load.image("background", "assets/sprites/stage.png");
        this.load.image("player_info", "assets/sprites/playerInfo.png");
        this.load.image("tahoe_info", "assets/sprites/tahoe_info.png");
        this.load.image("reno_info", "assets/sprites/reno_info.png");
        this.load.image("flow_info", "assets/sprites/flow_info.png");
        this.load.image("ingame_menu", "assets/sprites/ingame_menu.png");
        this.load.tilemap("maplevel2", "assets/tilemaps/level2.json");
        
        // Player
        this.load.spritesheet("player1", "assets/spritesheets/player/tahoe.json");
        this.load.spritesheet("player2", "assets/spritesheets/player/reno.json");
        this.load.spritesheet("player3", "assets/spritesheets/player/flow.json");
        this.load.spritesheet("generator", "assets/spritesheets/objects/generator.json");

        // Enemy
        this.load.spritesheet("enemy", "assets/spritesheets/enemy/enemy.json");
        this.load.spritesheet("camera", "assets/spritesheets/enemy/camera.json");
        this.load.spritesheet("circuit", "assets/spritesheets/enemy/circuit.json");
        this.load.spritesheet("router", "assets/spritesheets/enemy/router.json");
        this.load.object("enemyData", "assets/spawns/level2_enemies.json");

        this.load.spritesheet("generator", "assets/spritesheets/objects/generator.json");
        this.load.audio("level2", "assets/music/level2.mp3");

        this.load.audio("basicAttack", "assets/sounds/basicAttack.wav");
        this.load.audio("enemyAttack", "assets/sounds/enemyAttack.wav");
        this.load.audio("enemyDamaged", "assets/sounds/enemyDamaged.wav");
        this.load.audio("enemyDeath", "assets/sounds/enemyDeath.wav");
        this.load.audio("flowE", "assets/sounds/flowE.wav");
        this.load.audio("flowQ", "assets/sounds/flowQ.wav");
        this.load.audio("jump", "assets/sounds/jump.wav");
        this.load.audio("playerDamaged", "assets/sounds/playerDamaged.wav");
        this.load.audio("playerDeath", "assets/sounds/playerDeath.wav");
        this.load.audio("renoE", "assets/sounds/renoE.wav");
        this.load.audio("renoQ", "assets/sounds/renoQ.wav");
        this.load.audio("tahoeE", "assets/sounds/tahoeE.wav");
        this.load.audio("tahoeQ", "assets/sounds/tahoeQ.wav");
        this.load.audio("switchIn", "assets/sounds/switchIn.wav");
        this.load.audio("switchOut", "assets/sounds/switchOut.wav");
        
    }

    /**
     * TODO
     * 
     * Keep resources
     */
    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level2"});
        this.load.keepSpritesheet("player1");
        this.load.keepSpritesheet("player2");
        this.load.keepSpritesheet("player3");
    }

    /**
     * TODO
     * 
     * Start the Scene
     */

    startScene(): void {
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "level2", loop: true, holdReference: true});
        AudioManager.setVolume(AudioChannelType.MUSIC, .30)
        /** ^ TURN THIS BACK ON AFTER WE ARE DONE */
        this.currentLevelIndex = 2;

        // Add a background layer and set the background image on it
        this.addParallaxLayer("bg", new Vec2(0.25, 0), -100);
        let bg = this.add.sprite("background", "bg");
        bg.position.set(bg.size.x*2,bg.size.y);
        bg.scale.x = 5;
        bg.scale.y = 2
        
        // Add the level 2 tilemap
        this.add.tilemap("maplevel2", new Vec2(1, 1));

        this.viewport.setBounds(0, 0, 1000*128, 1000*128);

        this.playerSpawn = new Vec2(2*128, 4*128);

        // Generic GameLevel Scene setup
        super.startScene() 

        //this.addLevelEnd(new Vec2(112, 6), new Vec2(2, 2));
        this.addLevelEnd(new Vec2(78, 23), new Vec2(2*128,2*128)) /** USE THIS FOR NOW */
        //this.addLevelEnd(new Vec2(10, 29), new Vec2(2*256,2*256))

        // only one level for now
        //this.nextLevel = Level2;

        // Add enemies of various types
        // The coordinates are the positions in Tiled BUT ADD 0.5 TO X AND 0.5 TO Y
        this.initializeEnemies("enemyData")
    }

    /**
     * Update the Scene
     * @param deltaT 
     */
    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
        // If player falls into a pit, kill them off and reset their position
        if(this.currPlayer.position.y > 32*128){
            this.respawnPlayer();
        }
    }
}