import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import LevelManager from "../Wolfie2D/LevelManager/LevelManager";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import LayerHelper from "./LayerHelper";
import Level1 from "./Levels/Level1";
import MainMenu from "./MainMenu";

export default class LevelSelect extends Scene{
    protected levels: Array<{name: string, level:typeof Scene, finished: boolean}>;
    protected locked: Array<boolean>;
    protected readonly LEVELS_PER_LAYER = 3
    protected levelSelectLayers: Array<Layer>
    

    loadScene(): void {
        this.load.image("level_select","assets/sprites/level_select.png")
        this.load.image("lock","assets/sprites/lock.png")
        
    }
    
    startScene(): void {
        this.levels = this.levelManager.getLevels()
        this.locked = this.levelManager.getLocked()

        this.locked[1] = false // UNLOCKS LEVEL 2, DELETE THIS WHEN DONE
        
        this.levelSelectLayers = []
        this.initLayers()

        // UI
        this.addUI()

        this.receiver.subscribe("menu")

    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "menu"){
                
                this.sceneManager.changeToScene(MainMenu)
            }
            else if(event.type.includes("Select")){
                this.setLayerVisibility(event.type)
            }
            else{
                
                let level= this.levelManager.findLevel(event.type)

                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player","enemy"],
                        collisions:
                        [
                            [0, 1, 1],
                            [1, 0, 0],
                            [1, 0, 0]
                        ]
                    }
                }
                this.sceneManager.changeToScene(level, {}, sceneOptions)
            }
        }
    }

    setLayerVisibility(layer:string): void{
        for(let i = 0; i < this.levelSelectLayers.length; i++){
            if(this.levelSelectLayers[i].getName() === layer){
                this.levelSelectLayers[i].setHidden(false)
            }
            else{
                this.levelSelectLayers[i].setHidden(true)
            }
        }
    }

    initLayers(): void {
        this.addLayer("bg", 0);
        this.addLayer("titleShadow", 100)

        for(let i = 0; i < this.levels.length; i += this.LEVELS_PER_LAYER){
            let name  = "levelSelect" + (i/this.LEVELS_PER_LAYER + 1)
            let layer = this.addLayer(name, 200)
            this.levelSelectLayers.push(layer)
            
            if(i != 0)
                layer.setHidden(true)
        }
    }

    addUI(): void{
        // Colors
        let purple = Color.fromStringHex("cb16ec")
        let darkblue = Color.fromStringHex("2d0d94")
        let cyan = Color.fromStringHex("00cbd4") 

        // Background image
        let bg = this.add.sprite("level_select", "bg");
        bg.position.set(bg.size.x/2,bg.size.y/2);

        // Header
        LayerHelper.addHeader(this, new Vec2(bg.size.x/2-8,bg.size.y/8+9), darkblue, "titleShadow", "Level Select")

        // Go through every level
        for(let i = 0; i < this.levels.length; i++){
            let currLayer = Math.floor(i/this.LEVELS_PER_LAYER + 1)
            let layer  = "levelSelect" + currLayer

            // For each layer
            if(i%this.LEVELS_PER_LAYER==0){
                LayerHelper.addHeader(this, new Vec2(bg.size.x/2,bg.size.y/8), purple, layer, "Level Select")

                if(this.levels.length > this.LEVELS_PER_LAYER){
                    let maxLevel = (Math.floor((this.levels.length-1)/this.LEVELS_PER_LAYER) + 1)
                    let prevLevel = "levelSelect" 
                    prevLevel += (currLayer-1 < 1) ?  maxLevel : (currLayer-1)
                    let nextLevel = "levelSelect"
                    nextLevel += (currLayer+1 > maxLevel) ?  1 : (currLayer+1)

                    LayerHelper.addButtons(this, bg.size, purple, cyan, layer, prevLevel, nextLevel, "menu", "Exit")
                    this.receiver.subscribe(layer)
                }
                else{
                    LayerHelper.addExitButton(this, purple, cyan, layer, "menu", "Exit")
                }  

                

                let levelBtn = <Button>this.add.uiElement(UIElementType.BUTTON, layer, {position: new Vec2(bg.size.x/4,bg.size.y/2-10), text: ""+(i+1)});
                levelBtn.size = new Vec2(250,150)
                levelBtn.borderWidth = 4
                levelBtn.borderRadius = 0
                levelBtn.borderColor = purple
                levelBtn.backgroundColor = Color.BLACK
                levelBtn.textColor = cyan
                

                if(this.locked[i]){
                    let lock = this.add.sprite("lock",layer)
                    lock.position.set(bg.size.x/4,bg.size.y/2-10);
                    
                }
                else{
                    levelBtn.onClickEventId = this.levels[i].name
                }
            }
            else if(i%this.LEVELS_PER_LAYER==1){
                let levelBtn = <Button>this.add.uiElement(UIElementType.BUTTON, layer, {position: new Vec2(bg.size.x/2,3*bg.size.y/4+30), text: ""+(i+1)});
                levelBtn.size = new Vec2(250,150)
                levelBtn.borderWidth = 4
                levelBtn.borderColor = purple
                levelBtn.borderRadius = 0
                levelBtn.backgroundColor = Color.BLACK
                levelBtn.textColor = cyan

                if(this.locked[i]){
                    let lock = this.add.sprite("lock",layer)
                    lock.position.set(bg.size.x/2,3*bg.size.y/4+30);
                }
                else{
                    levelBtn.onClickEventId = this.levels[i].name
                }
            }
            else if(i%this.LEVELS_PER_LAYER==2){
                let levelBtn = <Button>this.add.uiElement(UIElementType.BUTTON, layer, {position: new Vec2(3*bg.size.x/4,bg.size.y/2-20), text: ""+(i+1)});
                levelBtn.size = new Vec2(250,150)
                levelBtn.borderWidth = 4
                levelBtn.borderColor = purple
                levelBtn.borderRadius = 0
                levelBtn.backgroundColor = Color.BLACK
                levelBtn.textColor = cyan

                if(this.locked[i]){
                    let lock = this.add.sprite("lock",layer)
                    lock.position.set(3*bg.size.x/4,bg.size.y/2-20);
                }
                else{
                    levelBtn.onClickEventId = this.levels[i].name
                }
            }

            this.receiver.subscribe(this.levels[i].name)
        }
    }

    
}