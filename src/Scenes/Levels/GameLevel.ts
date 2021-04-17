import PlayerController from "../../Entities/Player/PlayerController";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";

export default class GameLevel extends Scene{
    // Each level will have player sprites, spawn coords, respawn timer
    protected players: Array<AnimatedSprite>;
    protected currPlayer: AnimatedSprite;
    protected playerSpawn: Vec2;               
    protected respawnTimer: Timer;

    //Labels for UI
    protected playerHealth: number = 100 * 2.55;
    protected playerHealthBar: Rect;
    protected bossHealth: number = 150;
    protected bossHealthBar: Rect;

    //GameLevel viewport
    protected static gameLevelViewport: Viewport

    //Layers
    protected primaryLayer: Layer
    protected primaryUI: Layer;
    protected bossUI: Layer;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    // Number of characters
    protected static readonly NUM_OF_CHARACTERS = 3;

    /**
     * TODO
     * 
     * Generic GameLevel Scene setup
     */
    startScene():void {
        // Game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayers();
        this.subscribeToEvents();
        this.addUI();


    }

    updateScene(deltaT: number){
        while(this.receiver.hasNextEvent()){
            let event= this.receiver.getNextEvent()
            console.log(event)
        }
    }

    /**
     * TODO
     * 
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.primaryUI = this.addUILayer("UI");
        this.bossUI = this.addUILayer("bossUI");

        // Add a layer for players and enemies
        this.primaryLayer = this.addLayer("primary", 0);

        // Set layer visibility
        this.bossUI.setHidden(true)
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        GameLevel.gameLevelViewport = this.viewport
        this.viewport.setZoomLevel(1);
    }

    /**
     * TODO
     * 
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        //add player information layer
        let healthBar = this.add.sprite("player_info", "UI");
        healthBar.position.set(healthBar.size.x/2, healthBar.size.y/2);

        this.playerHealthBar = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(256,42), size: new Vec2(this.playerHealth,18)});
        this.playerHealthBar.color = Color.GREEN;

        this.bossHealthBar = <Rect>this.add.graphic(GraphicType.RECT, "bossUI", {position: new Vec2(950,50), size: new Vec2(this.bossHealth*3,15)});
        this.bossHealthBar.color = Color.RED;
        
    }

    /**
     * TODO
     * 
     * Handles all subscriptions to events
     */
     protected subscribeToEvents(){
        this.receiver.subscribe([
            
        ]);
    }

    /**
     * TODO
     * 
     * MIGHT NEED TO CHANGE SOME VALUES
     */
    protected initPlayers(): void {
        this.players = []

        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        
        for(let i = 1; i < GameLevel.NUM_OF_CHARACTERS+1; i++){
            let player = this.add.animatedSprite("player"+i, "primary");     
            player.position.copy(this.playerSpawn);
            player.addPhysics(new AABB(Vec2.ZERO, new Vec2(64, 64)));

            // Add triggers on colliding with coins or coinBlocks
            player.setGroup("player");


            if(i != 1){
                player.visible = false
                player.disablePhysics()
            }

            // Set character collision boxes
            if(player.imageId === "tahoe")  {
                player.colliderOffset.set(-12,12)
                player.collisionShape.halfSize.x =32
            }
            else if(player.imageId === "reno"){
                player.collisionShape.halfSize.x =32
                player.collisionShape.halfSize.y =47

            }        
            else if(player.imageId == "flow"){
                player.scale.set(1.5,1.5)
                player.colliderOffset.set(0, 42);
                player.collisionShape.halfSize.x =90
                player.collisionShape.halfSize.y =54
            }
            

            this.players.push(player)
        }
        
        // Set current player to first player added
        this.currPlayer = this.players[0]

        
        this.currPlayer.addAI(PlayerController, {playerType: "platformer", tilemap: "maplevel1", players: this.players, viewport: this.viewport}); 

        // Follow only the current player
        this.viewport.follow(this.currPlayer);
        
    }

    /**
     * TODO
     * 
     * Adds an enemy into the game
     * @param spriteKey The key of the enemy sprite
     * @param tilePos The tilemap position to add the enemy to
     * @param aiOptions The options for the enemy AI
     */
     protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x*32, tilePos.y*32);
        enemy.scale.set(2, 2);
        enemy.addPhysics();
        //enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemy");
        //enemy.setTrigger("player", HW4_Events.PLAYER_HIT_ENEMY, null)
    }

    /**
     * TODO
     * 
     * Initializes the level end area
     */
    protected addLevelEnd(startingTile: Vec2, size: Vec2){

    }


    /**
     * TODO
     * 
     * Collisions with the Player and Enemy
     * @param player 
     * @param enemy 
     */
    protected handlePlayerEnemyCollision(player: AnimatedSprite, enemy: AnimatedSprite) {   

    }

    /**
     * TODO
     * 
     * Increments player health
     * @param amt The amount to add to the player life
     */
    protected incPlayerhealth(amt: number): void {
        this.playerHealth += amt;
        //this.healthLabel.text = "Health: " + GameLevel.health;
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        this.currPlayer.position.copy(this.playerSpawn);
    }
    
}