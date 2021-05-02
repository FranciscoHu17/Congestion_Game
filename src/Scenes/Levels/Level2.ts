import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
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
        
    }

    /**
     * TODO
     * 
     * Keep resources
     */
    unloadScene(){
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
        this.addLevelEnd(new Vec2(114, 25), new Vec2(2*256,2*256)) /** USE THIS FOR NOW */
        //this.addLevelEnd(new Vec2(10, 29), new Vec2(2*256,2*256))

        // only one level for now
        //this.nextLevel = Level2;

        // Add enemies of various types
        // The coordinates are the positions in Tiled BUT ADD 0.5 TO X AND 0.5 TO Y
        this.initializeEnemies("enemyData")
        console.log(this.enemies)
    }

    /**
     * Update the Scene
     * @param deltaT 
     */
    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}