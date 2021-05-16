import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import AudioManager, { AudioChannelType } from "../../Wolfie2D/Sound/AudioManager";
import Color from "../../Wolfie2D/Utils/Color";
import GameLevel from "./GameLevel";

export default class Tutorial extends GameLevel{
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
        this.load.tilemap("mapleveltutorial", "assets/tilemaps/tutorial.json");

        // Player Sprites
        
        this.load.spritesheet("player1", "assets/spritesheets/player/tahoe.json");
        this.load.spritesheet("player2", "assets/spritesheets/player/reno.json");
        this.load.spritesheet("player3", "assets/spritesheets/player/flow.json");
        this.load.spritesheet("generator", "assets/spritesheets/objects/generator.json");

        // Enemy Sprites
        this.load.spritesheet("enemy", "assets/spritesheets/enemy/enemy.json");
        this.load.spritesheet("camera", "assets/spritesheets/enemy/camera.json");
        this.load.spritesheet("circuit", "assets/spritesheets/enemy/circuit.json");
        this.load.spritesheet("router", "assets/spritesheets/enemy/router.json");

        this.load.spritesheet("generator", "assets/spritesheets/objects/generator.json");

        this.load.object("enemyData", "assets/spawns/tutorial_enemies.json");

        this.load.audio("tutorial", "assets/music/tutorial.mp3");

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
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "tutorial"});
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
        //this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "tutorial", loop: true, holdReference: true});
        //AudioManager.setVolume(AudioChannelType.MUSIC, .30)
        /** ^ TURN THIS BACK ON AFTER WE ARE DONE */
        this.currentLevelIndex = 0;



        // Add a background layer and set the background image on it
        this.addParallaxLayer("bg", new Vec2(0.25, 0), -100);
        let bg = this.add.sprite("background", "bg");
        bg.position.set(bg.size.x*2,bg.size.y);
        bg.scale.x = 5;
        bg.scale.y = 2
        
        
        // Add the level 1 tilemap
        this.add.tilemap("mapleveltutorial", new Vec2(1, 1));
        

        this.viewport.setBounds(0, 0, 1000*128, 1000*128);

        this.playerSpawn = new Vec2(5*128, 55*128);

        // Generic GameLevel Scene setup
        super.startScene() 

        this.addTutorialText()

        //this.addLevelEnd(new Vec2(112, 6), new Vec2(2, 2));
        this.addLevelEnd(new Vec2(61, 58), new Vec2(2*128,2*128)) /** USE THIS FOR NOW */
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
        if(this.currPlayer.position.y > 64*128){
            this.respawnPlayer();
        }
    }

    addTutorialText(): void{
        let tutorial = this.addLayer("Tutorial", 100)

        let text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*1.5, 128*57.5),
                   text: "Welcome to the LFP, where all of us tries our best to get rid of congestion"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*2.5, 128*57.75),
            text: "to allow our data to traverse throughout the world smoothly"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*8.30, 128*54.3),
            text: "W/Space - Jump"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*8.30, 128*54.5),
            text: "A - Left"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*8.30, 128*54.7),
            text: "D - Right"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*13.3, 128*55.4),
            text: "Careful, congestion ahead! Use left"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*14.25, 128*55.6),
            text: "click to attack"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*16.1, 128*52.7),
            text: "Or use Tahoe's Q to "})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*16.1, 128*52.9),
            text: "push or pull it off "})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*16.4, 128*53.1),
            text: "the platform "})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*25.7, 128*54.5),
            text: "Let's now switch to Flow by pressing 3."})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*25.5, 128*54.7),
            text: "Using Flow's E, you can create a checkpoint"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;
        
        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*30.15, 128*51.2),
            text: "Flow's Q"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*30.1, 128*51.4),
            text: "teleports"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*30.2, 128*51.6),
            text: "through"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*30.3, 128*51.8),
            text: "walls"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*34.5, 128*54.5),
            text: "Press 2 to switch to Reno to use Q"})
        text.setHAlign("Left")
        text.textColor = Color.WHITE
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*34.5, 128*54.7),
            text: "in the air to shoot multiple packets"})
        text.setHAlign("Left")
        text.textColor = Color.WHITE
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*46.5, 128*54.5),
            text: "Press E to teleport behind the enemy"})
        text.setHAlign("Left")
        text.textColor = Color.WHITE
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*53.3, 128*54.6),
            text: "You're near the end of this level! "})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;

        text = <Label>this.add.uiElement(UIElementType.LABEL, "Tutorial", {position: new Vec2(128*53.2, 128*54.8),
            text: "Hop off to the right of this platform"})
        text.setHAlign("Left")
        text.textColor = Color.BLACK
        text.font = "Consola"
        text.size.set(128*2,128*2)
        text.fontSize= 22;
    }
}