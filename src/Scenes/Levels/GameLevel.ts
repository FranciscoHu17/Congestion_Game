import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";

export default class GameLevel extends Scene{
    // Each level will have player sprites, spawn coords, respawn timer
    protected players: Array<AnimatedSprite>;
    protected currPlayer: AnimatedSprite;
    protected playerSpawn: Vec2;               
    protected respawnTimer: Timer;

    //Labels for UI
    protected static health: number = 100;
    protected healthLabel: Label;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    // Number of characters
    protected readonly NUM_OF_CHARACTERS = 3;

    /**
     * TODO
     * 
     * Generic GameLevel Scene setup
     */
    startScene():void {
        // Game level standard initializations
        this.initLayers();
        //this.initViewport();
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
        this.addUILayer("UI");

        // Add a layer for players and enemies
        this.addLayer("primary", 0);
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(2);
    }

    /**
     * TODO
     * 
     * Adds in any necessary UI to the game
     */
    protected addUI(){
     
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
        for(let i = 1; i < this.NUM_OF_CHARACTERS+1; i++){
            let player = this.add.animatedSprite("player"+i, "primary");
            
            if(!this.playerSpawn){
                console.warn("Player spawn was never set - setting spawn to (0, 0)");
                this.playerSpawn = Vec2.ZERO;
            }

            player.position.copy(this.playerSpawn);
            player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
            player.colliderOffset.set(0, 2);
            //player.addAI(PlayerController, {playerType: "platformer", tilemap: "Main"});

            // Add triggers on colliding with coins or coinBlocks
            player.setGroup("player");

            this.players.push(player)
        }

        // Set current player to first player added
        this.currPlayer = this.players[0]

        // Follow only the first player
        this.viewport.follow(this.players[0]);
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
        GameLevel.health += amt;
        //this.healthLabel.text = "Health: " + GameLevel.health;
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        this.currPlayer.position.copy(this.playerSpawn);
    }
    
}