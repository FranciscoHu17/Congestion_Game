import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";

export default class Level1 extends GameLevel{

    /**
     * TODO
     * 
     * Load resources
     */
    loadScene(): void {
        this.load.image("background", "assets/sprites/stage.png");
        this.load.tilemap("level1", "assets/tilemaps/level1.json");
        this.load.spritesheet("tahoe", "assets/spritesheets/player/tahoe.json");
        this.load.spritesheet("reno", "assets/spritesheets/player/reno.json");
        this.load.spritesheet("flow", "assets/spritesheets/player/flow.json");
        this.load.spritesheet("generator", "assets/spritesheets/objects/generator.json");
        this.load.audio("level1", "assets/music/level 1.mp3");
    }

    /**
     * TODO
     * 
     * Keep resources
     */
    unloadScene(){

    }

    /**
     * TODO
     * 
     * Start the Scene
     */

    startScene(): void {
        // Add a background layer and set the background image on it
        // probably need to change position
        this.addParallaxLayer("bg", new Vec2(0.25, 0), -100);
        let bg = this.add.sprite("background", "bg");
        bg.position.set(bg.size.x/2,bg.size.y/2);

        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(0, 0));
        this.viewport.setBounds(0, 0, 32*128, 16*128);

        this.playerSpawn = new Vec2(6*128, 28*128);

        // Generic GameLevel Scene setup
        super.startScene() 

        // uhh might not be exact coordinates. On Tiled the top left is (112, 6)
        this.addLevelEnd(new Vec2(112, 6), new Vec2(2, 2));

        // only one level for now
        //this.nextLevel = Level2;

        // Add enemies of various types
        // i put the locations of where i want the enemies. The coordinates are the positions in Tiled
        /*for(let pos of [new Vec2(19, 26), new Vec2(33, 22), 
            new Vec2(65, 11), new Vec2(67, 11), new Vec2(65, 13), new Vec2(67, 13), new Vec2(65, 15), new Vec2(67, 15),
            new Vec2(70, 28)]){
            this.addEnemy("", pos, {});
        }*/
    }

    /**
     * Update the Scene
     * @param deltaT 
     */
    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}