import PlayerController from "../../Entities/Player/PlayerController";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { Game_Events } from "../../Enums/GameEvents";
import GameLoop from "../../Wolfie2D/Loop/GameLoop";
import LayerHelper from "../LayerHelper";
import MainMenu from "../MainMenu";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import LevelSelect from "../LevelSelect";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import EnemyController from "../../Entities/Enemy/EnemyController";
import BattleManager from "../../GameSystems/BattleManager";
import BattlerAI from "../../GameSystems/BattlerAI";
import ProjectileManager from "../../GameSystems/ProjectileManager";
import Projectile from "../../GameSystems/Projectiles/Projectile";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class GameLevel extends Scene{
    // Each level will have player sprites, spawn coords, respawn timer
    protected players: Array<AnimatedSprite>;
    protected enemies: Array<AnimatedSprite>;//TODO: add all the enemies into this array
    protected currPlayer: AnimatedSprite;
    protected playerSpawn: Vec2;
    protected playerMaxHealth: number = 100;//TODO: change this later?
    
    
    protected respawnTimer: Timer;
    protected levelEndTimer: Timer;

    //Labels for UI
    protected playerHealthBar: Rect;
    protected bossHealth: number = 150;
    protected bossHealthBar: Rect;
    protected tahoeIcons: Sprite;
    protected renoIcons: Sprite;
    protected flowIcons: Sprite;
    protected ingame_menu: Sprite;
    protected controlsButton: Button;
    protected helpButton: Button;
    protected mainMenuButton: Button;
    protected resumeButton: Button;

    //Level End
    protected levelEndArea: Rect
    protected levelEndLabel: Label

    //Layers
    protected primaryLayer: Layer
    protected primaryUI: Layer;
    protected bossUI: Layer;
    protected controls: Layer;
    protected help1: Layer;
    protected help2: Layer;
    protected help3: Layer;
    protected help4: Layer;
    protected controlsShadow: Layer;
    protected helpShadow: Layer;

    // Initial viewport position
    protected originalViewportPosX: number
    protected originalViewportPosY: number

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    // Number of characters
    protected static readonly NUM_OF_CHARACTERS = 3;

    // The battle manager for the scene
    protected battleManager: BattleManager;

    protected projectileManager: ProjectileManager

    /**
     * TODO
     * 
     * Generic GameLevel Scene setup
     */
    startScene():void {
        this.enemies = []
        // Create the battle manager
        this.battleManager = BattleManager.getInstance();
        this.projectileManager = ProjectileManager.getInstance()
        this.originalViewportPosX = this.viewport.getCenter().x
        this.originalViewportPosY = this.viewport.getCenter().y

        // Game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayers();
        this.subscribeToEvents();
        this.addUI();

        // Initialize the timers
        /*this.respawnTimer = new Timer(1000, () => {
                this.respawnPlayer();
                this.currPlayer.enablePhysics();
                
            }
        );*/
        this.levelEndTimer = new Timer(3000, () => {

        });

    }

    updateScene(deltaT: number){
        while(this.receiver.hasNextEvent()){
            let event= this.receiver.getNextEvent()
            
            switch(event.type){
                case Game_Events.SWITCH_TO_FLOW:
                    {
                        this.currPlayer = this.players[2];
                        this.renoIcons.visible = false;
                        this.tahoeIcons.visible = false;
                        this.flowIcons.visible = true;
                    }
                    break;
                case Game_Events.SWITCH_TO_RENO:
                    {
                        this.currPlayer = this.players[1];
                        this.renoIcons.visible = true;
                        this.tahoeIcons.visible = false;
                        this.flowIcons.visible = false;
                    }
                    break;
                case Game_Events.SWITCH_TO_TAHOE:
                    {
                        this.currPlayer = this.players[0];
                        this.renoIcons.visible = false;
                        this.tahoeIcons.visible = true;
                        this.flowIcons.visible = false;
                    }
                    break;
                case Game_Events.PROJECTILE_COLLISION:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        let projGroup = this.physicsManager.getGroupNumber("projectile")
                        
                        if(node.group == projGroup){
                            this.handleProjectileCollision(node, <AnimatedSprite>other)
                        }
                        else{
                            this.handleProjectileCollision(other, <AnimatedSprite>node)
                        }
                    }
                    break;
                case Game_Events.PLAYER_HIT_ENEMY:
                        {
                            let node = this.sceneGraph.getNode(event.data.get("node"));
                            let other = this.sceneGraph.getNode(event.data.get("other"));
    
                            if(node === this.currPlayer){
                                // Node is player, other is enemy
                                this.handlePlayerEnemyCollision(<AnimatedSprite>node, <AnimatedSprite>other);
                            } else {
                                // Other is player, node is enemy
                                this.handlePlayerEnemyCollision(<AnimatedSprite>other,<AnimatedSprite>node);
    
                            }
                        }
                        break;
                case Game_Events.ENEMY_DIED:
                    {
                        // An enemy finished its dying animation, destroy it
                        let node = this.sceneGraph.getNode(event.data.get("owner"));
                        node.destroy();
                    }
                break;
                
                case Game_Events.PLAYER_DEATH:
                    {
                       // this.respawnTimer.start();
                        //this.respawnTimer.reset();   
                        this.respawnPlayer();
                        this.currPlayer.enablePhysics();
                        
                    }
                    break;
                case Game_Events.GAME_PAUSED:
                    {
                        // Layers visibility set
                        this.controls.setHidden(true);
                        this.help1.setHidden(true);
                        this.help2.setHidden(true);
                        this.help3.setHidden(true);
                        this.help4.setHidden(true);

                        // Shadow layers visibility set
                        this.controlsShadow.setHidden(true);
                        this.helpShadow.setHidden(true);

                        this.currPlayer.disablePhysics();
                        this.currPlayer.freeze();
                        if(this.enemies != null){
                            for(var i = 0; i< this.enemies.length; i++){
                                this.enemies[i].disablePhysics();
                                this.enemies[i].freeze();
                            }
                        }
                        //In game menu pop up
                        this.showInGameMenu();
                    }
                    break;    
                case Game_Events.GAME_RESUMED:
                    {
                        this.hideInGameMenu();
                        this.currPlayer.enablePhysics();
                        this.currPlayer.unfreeze();
                        if(this.enemies != null){
                            for(var i = 0; i< this.enemies.length; i++){
                                this.enemies[i].enablePhysics();
                                this.enemies[i].unfreeze();
                            }
                        }
                    }
                    break;
                
                case Game_Events.PLAYER_ENTERED_LEVEL_END:
                    {
                        if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                            // The player has reached the end of the level
                            this.levelEndTimer.start();
                            this.levelEndLabel.visible = true
                            this.levelEndLabel.tweens.play("slideIn");
                        }
                    }   
                    break; 
                case Game_Events.LEVEL_END:
                    {
                        this.levelManager.finishLevel(0)
                        // Go to level select
                        this.viewport.follow(null)
                        this.sceneManager.changeToScene(LevelSelect);
                    }   
                    break; 
                case "menu":
                    {
                        this.viewport.follow(null)
                        this.sceneManager.changeToScene(MainMenu);
                    }
                    break;
                case "controls":
                    {
                        this.setMenuLayerVisibility(event.type);
                    }
                    break;
                case "help1":
                    {
                        this.setMenuLayerVisibility(event.type);
                    }
                    break;
                case "help2":
                    {
                        this.setMenuLayerVisibility(event.type);
                    }
                    break;
                case "help3":
                    {
                        this.setMenuLayerVisibility(event.type);
                    }
                    break;      
                case "help4":
                    {
                        this.setMenuLayerVisibility(event.type);
                    }
                    break;
                case Game_Events.PLAYER_DYING:
                    {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "playerDeath", loop: false, holdReference: true});
                    }
            }
        }
        // If player falls into a pit, kill them off and reset their position
        if(this.currPlayer.position.y > 32*128){
            this.respawnPlayer();
        }

        this.projectileManager.update(deltaT)
    }
    showInGameMenu(): void {
        this.ingame_menu.visible = true;
        this.controlsButton.visible = true;
        this.helpButton.visible = true;
        this.mainMenuButton.visible = true;
        this.resumeButton.visible = true;
    }

    hideInGameMenu(): void{
        this.ingame_menu.visible = false;
        this.controlsButton.visible = false;
        this.helpButton.visible = false;
        this.mainMenuButton.visible = false;
        this.resumeButton.visible = false;
    }

    setMenuLayerVisibility(layer: string): void {
        // Checks which layer should be invisible
        this.hideInGameMenu();
        let ctrls = (layer != "controls") ? true : false
        let hlp1 = (layer != "help1") ? true : false
        let hlp2 = (layer != "help2") ? true : false
        let hlp3 = (layer != "help3") ? true : false
        let hlp4 = (layer != "help4") ? true : false

        // Layers visibility set
        this.controls.setHidden(ctrls)
        this.help1.setHidden(hlp1);
        this.help2.setHidden(hlp2);
        this.help3.setHidden(hlp3);
        this.help4.setHidden(hlp4);

        // Shadow layers visibility set
        this.controlsShadow.setHidden(ctrls);
        this.helpShadow.setHidden(hlp1 && hlp2 && hlp3 && hlp4);
        
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
        this.controlsShadow = this.addUILayer("controlsShadow");
        this.helpShadow = this.addUILayer("helpShadow");
        this.controls = this.addUILayer("controls");
        this.help1 = this.addUILayer("help1");
        this.help2 = this.addUILayer("help2");
        this.help3 = this.addUILayer("help3");
        this.help4 = this.addUILayer("help4");
        
        LayerHelper.controlsLayer(this, Game_Events.GAME_PAUSED);
        LayerHelper.helpLayer(this, Game_Events.GAME_PAUSED);

        // Add a layer for players and enemies
        this.primaryLayer = this.addLayer("primary", 0);

        // Set layer visibility
        this.bossUI.setHidden(true);
        this.controlsShadow.setHidden(true);
        this.helpShadow.setHidden(true);
        this.controls.setHidden(true);
        this.help1.setHidden(true);
        this.help2.setHidden(true);
        this.help3.setHidden(true);
        this.help4.setHidden(true);

    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
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

        this.tahoeIcons = this.add.sprite("tahoe_info", "UI");
        this.tahoeIcons.position.set(this.tahoeIcons.size.x/2, this.tahoeIcons.size.y/2);
        this.renoIcons = this.add.sprite("reno_info", "UI");
        this.renoIcons.position.set(this.renoIcons.size.x/2, this.renoIcons.size.y/2);
        this.renoIcons.visible = false;
        this.flowIcons = this.add.sprite("flow_info", "UI");
        this.flowIcons.position.set(this.flowIcons.size.x/2, this.flowIcons.size.y/2);
        this.flowIcons.visible = false;

        this.playerHealthBar = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(258,42), size: new Vec2(this.battleManager.getPlayer().health*2.5,18)});
        this.playerHealthBar.color = Color.GREEN;
        console.log(this.battleManager.getPlayer().health)

        this.bossHealthBar = <Rect>this.add.graphic(GraphicType.RECT, "bossUI", {position: new Vec2(950,50), size: new Vec2(this.bossHealth*3,15)});
        this.bossHealthBar.color = Color.RED;
        
        this.ingame_menu = this.add.sprite("ingame_menu","UI");
        this.ingame_menu.position.set(this.ingame_menu.size.x/2,this.ingame_menu.size.y/2);
        this.ingame_menu.visible = false;

        this.controlsButton = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(650,299), text: "CONTROLS"});
        this.controlsButton.backgroundColor = Color.BLACK;
        this.controlsButton.textColor = Color.GREEN;
        this.controlsButton.size = new Vec2(160,20);
        this.controlsButton.font = "Consola";
        this.controlsButton.fontSize = 22;
        this.controlsButton.onClickEventId = "controls";
        this.controlsButton.visible = false;

        this.helpButton = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(650,345), text: "HELP"});
        this.helpButton.backgroundColor = Color.BLACK;
        this.helpButton.textColor = Color.GREEN;
        this.helpButton.size = new Vec2(160,20);
        this.helpButton.font = "Consola";
        this.helpButton.fontSize = 22;
        this.helpButton.onClickEventId = "help1";
        this.helpButton.visible = false;

        this.mainMenuButton = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(650,392), text: "MAIN MENU"});
        this.mainMenuButton.backgroundColor = Color.BLACK;
        this.mainMenuButton.textColor = Color.GREEN;
        this.mainMenuButton.size = new Vec2(160,20);
        this.mainMenuButton.font = "Consola";
        this.mainMenuButton.fontSize = 22;
        this.mainMenuButton.onClickEventId = "menu";
        this.mainMenuButton.visible = false;

        this.resumeButton = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(650,440), text: "RESUME"});
        this.resumeButton.backgroundColor = Color.BLACK;
        this.resumeButton.textColor = Color.GREEN;
        this.resumeButton.size = new Vec2(160,20);
        this.resumeButton.font = "Consola";
        this.resumeButton.fontSize = 22;
        this.resumeButton.onClickEventId = Game_Events.GAME_RESUMED;
        this.resumeButton.visible = false;

        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: this.ingame_menu.position, text: "Level Complete"});
        this.levelEndLabel.size.set(4000, 120);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.GREEN;
        this.levelEndLabel.fontSize = 96;
        this.levelEndLabel.font = "PositiveSystem";
        this.levelEndLabel.visible = false

        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 5000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -600,
                    end: 1700,
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            onEnd: Game_Events.LEVEL_END
        });
    }

    /**
     * TODO
     * 
     * Handles all subscriptions to events
     */
     protected subscribeToEvents(){
        this.receiver.subscribe([
            Game_Events.SWITCH_TO_FLOW,
            Game_Events.SWITCH_TO_RENO,
            Game_Events.SWITCH_TO_TAHOE,
            Game_Events.PROJECTILE_COLLISION,
            Game_Events.PLAYER_HIT_ENEMY,
            Game_Events.ENEMY_DIED,
            Game_Events.PLAYER_DEATH,
            Game_Events.GAME_PAUSED,
            Game_Events.PLAYER_ENTERED_LEVEL_END,
            Game_Events.LEVEL_END,
            "controls",
            "help1",
            "help2",
            "help3",
            "help4",
            "menu",
            Game_Events.GAME_RESUMED
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

            // Character specific traits
            if(player.imageId === "tahoe")  {
                player.colliderOffset.set(-12,10)
                player.collisionShape.halfSize.x =32
                player.collisionShape.halfSize.y =60
            }
            else if(player.imageId === "reno"){
                player.collisionShape.halfSize.x =32
                player.collisionShape.halfSize.y =47

            }        
            else if(player.imageId == "flow"){
                player.scale.set(1.5,1.5)
                player.colliderOffset.set(0, 42);
                player.collisionShape.halfSize.x =60
                player.collisionShape.halfSize.y =54
            }
            

            this.players.push(player)
        }
        
        // Set current player to first player added
        this.currPlayer = this.players[0]

        this.projectileManager.addPlayerProjectiles(this)

        this.currPlayer.addAI(PlayerController, {playerType: "platformer", tilemap: "maplevel1", players: this.players, viewport: this.viewport}); 
        this.battleManager.setPlayer(<BattlerAI>this.currPlayer._ai);

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
    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): AnimatedSprite {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x*128, tilePos.y*128);
        enemy.addPhysics();
        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemy");
        enemy.animation.play("Idle", true);
        enemy.setTrigger("player", Game_Events.PLAYER_HIT_ENEMY, null);
        enemy.collisionShape.halfSize.set(40,50)
        this.enemies.push(enemy);
        
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));
        
        return enemy
    }

    protected initializeEnemies(data: string){
        let enemyData = this.load.getObject(data)

        for(let i = 0; i < enemyData.numEnemies; i++){
            let enemy = enemyData.enemies[i]
            let position = new Vec2 (enemy.position[0], enemy.position[1])
            this.addEnemy(enemy.key, position,{basic_attack: enemy.basic_attack, ability: enemy.ability,
                          health: enemy.health, damage: enemy.damage, player: this.currPlayer})
        }
    }

    getBattleManager(): BattleManager{
        return this.battleManager;
    }
    /**
     * TODO
     * 
     * Initializes the level end area
     */
    protected addLevelEnd(startingTile: Vec2, size: Vec2){
        startingTile.scale(128,128)
        startingTile.y -= size.y/2

        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile, size: size});
        this.levelEndArea.addPhysics(undefined, undefined, false, true)
        this.levelEndArea.setTrigger("player", Game_Events.PLAYER_ENTERED_LEVEL_END, null)
        this.levelEndArea.color = Color.TRANSPARENT
    }


    /**
     * TODO
     * 
     * Collisions with the Player and Enemy
     * @param player 
     * @param enemy 
     */
    protected handlePlayerEnemyCollision(player: AnimatedSprite, enemy: AnimatedSprite) {   
        this.currPlayer.disablePhysics();
        //this.currPlayer.animation.play("Death", false, Game_Events.PLAYER_DEATH);
        this.emitter.fireEvent(Game_Events.PLAYER_DYING)
    }

    protected handleProjectileCollision(projectile: CanvasNode, node: AnimatedSprite) {   
        let deactivated =this.projectileManager.deactivateProjectile(projectile);
        let damage = deactivated[0].damage

        if((<PlayerController>this.players[0]._ai).owner == node){
            //player is taking damage
            (<PlayerController>this.players[0]._ai).damage(damage);
            var currentHealth = (<PlayerController>this.players[0]._ai).health;
            var xposition = (this.playerHealthBar.position.x - (damage*2.5/2));
            this.playerHealthBar.position = new Vec2((xposition), 42);
            this.playerHealthBar.size = new Vec2(currentHealth * 2.5, 18);
        }
        else{
            //enemy is taking damage(?)
            (<BattlerAI>node._ai).damage(damage)
        }
        
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        this.currPlayer.position.copy(this.playerSpawn);
        //resets health
        (<PlayerController>this.players[0]._ai).health = this.playerMaxHealth;
        this.playerHealthBar.size = new Vec2(this.battleManager.getPlayer().health*2.5,18);
        this.playerHealthBar.position = new Vec2(258,42);
        //respawns enemies
        for(var i = 0; i< this.enemies.length; i++){
            // this.owner.setAIActive(false, {});
            // this.owner.isCollidable = false;
            // this.owner.visible = false;
            // this.owner.disablePhysics()
            this.enemies[i].setAIActive(true, {});
            this.enemies[i].isCollidable = true;
            this.enemies[i].visible = true;
            this.enemies[i].enablePhysics();
        }
    }
    
}