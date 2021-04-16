import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";

export default class GameLevel extends Scene{
    protected players: Array<AnimatedSprite>;   // Array of Player Sprites
    protected playerSpawn: Vec2;                // Player's Spawn
    
    protected readonly NUM_OF_PLAYERS = 3;

    /**
     * Generic GameLevel Scene setup
     */
    startScene():void {
        this.initLayers();
        //this.initViewport();
        this.initPlayers();
        this.subscribeToEvents();
        this.addUI();
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer("UI");

        // Add a layer for players and enemies
        this.addLayer("primary", 0);
    }

    /**
     * MIGHT NEED TO CHANGE SOME VALUES
     */
    protected initPlayers(): void {
        for(let i = 1; i < this.NUM_OF_PLAYERS+1; i++){
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

        // Follow only the first player
        this.viewport.follow(this.players[0]);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([

        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
     
    }
}