import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import LayerHelper from "./LayerHelper";
import LevelSelect from "./LevelSelect";

export default class SplashScreen extends Scene{
    protected titleShadow: Layer
    protected controlsShadow: Layer
    protected helpShadow: Layer
    protected mainMenu: Layer
    protected controls: Layer
    protected help1: Layer
    protected help2: Layer
    protected help3: Layer
    protected help4: Layer

    loadScene(): void {
        this.load.image("main_menu","assets/sprites/main_menu.png") 
    }
    
    startScene(): void {
        this.initLayers()
        this.viewport.setFocus(this.viewport.getHalfSize())
        console.log("adding this here for a commit check, please delete this if there are no troubles")

        // UI
        this.addUI()

        // Subscribe to events
        this.receiver.subscribe("menu")
        this.receiver.subscribe("start")
        this.receiver.subscribe("controls")
        this.receiver.subscribe("help1")
        this.receiver.subscribe("help2")
        this.receiver.subscribe("help3")
        this.receiver.subscribe("help4")
        this.receiver.subscribe("level1")
        this.receiver.subscribe("level2")
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "start"){
                this.sceneManager.changeToScene(LevelSelect);
            }
            else if(event.type === "level1" || event.type === "level2"){
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
            else{
                this.setLayerVisibility(event.type)
            }
        }
    }

    setLayerVisibility(layer: string): void {
        // Checks which layer should be invisible
        let mm = (layer != "menu") ? true : false
        let ctrls = (layer != "controls") ? true : false
        let hlp1 = (layer != "help1") ? true : false
        let hlp2 = (layer != "help2") ? true : false
        let hlp3 = (layer != "help3") ? true : false
        let hlp4 = (layer != "help4") ? true : false

        // Layers visibility set
        this.mainMenu.setHidden(mm);
        this.controls.setHidden(ctrls)
        this.help1.setHidden(hlp1);
        this.help2.setHidden(hlp2);
        this.help3.setHidden(hlp3);
        this.help4.setHidden(hlp4)

        // Shadow layers visibility set
        this.titleShadow.setHidden(mm)
        this.controlsShadow.setHidden(ctrls)
        this.helpShadow.setHidden(hlp1 && hlp2 && hlp3 && hlp4)
        
    }

    initLayers(): void {
        this.addLayer("bg", 0);
        this.titleShadow = this.addLayer("titleShadow", 100)
        this.controlsShadow = this.addLayer("controlsShadow", 100)
        this.helpShadow = this.addLayer("helpShadow", 100)
        this.mainMenu = this.addLayer("mainMenu", 200)
        this.controls = this.addLayer("controls", 200)
        this.help1 = this.addLayer("help1", 200)
        this.help2 = this.addLayer("help2", 200)
        this.help3 = this.addLayer("help3", 200)
        this.help4 = this.addLayer("help4", 200)

        this.setLayerVisibility("menu")
        
        LayerHelper.controlsLayer(this, "menu")
        LayerHelper.helpLayer(this, "menu")
    }

    addUI(): void {
        // Colors
        let purple = Color.fromStringHex("cb16ec")
        let darkblue = Color.fromStringHex("2d0d94")
        let cyan = Color.fromStringHex("00cbd4") 

        // Background Image
        let bg = this.add.sprite("main_menu", "bg");
        bg.position.set(bg.size.x/2,bg.size.y/2);
        

        // Shadow label
        let shadowLabel = <Label>this.add.uiElement(UIElementType.LABEL,"titleShadow", {position: new Vec2(bg.size.x/2-8, bg.size.y/4+9), text: "Congestion"})
        shadowLabel.textColor = darkblue
        shadowLabel.font = "PositiveSystem" 
        shadowLabel.fontSize = 125

        // Title label
        let titleLabel = <Label>this.add.uiElement(UIElementType.LABEL,"mainMenu", {position: new Vec2(bg.size.x/2, bg.size.y/4), text: "Congestion"})
        titleLabel.textColor = purple
        titleLabel.font = "PositiveSystem" 
        titleLabel.fontSize = 125

        // Start button
        let startBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(bg.size.x/2, bg.size.y/2), text: "START"});
        startBtn.backgroundColor = purple;
        startBtn.borderColor = cyan;
        startBtn.borderWidth = 3
        startBtn.textColor = Color.BLACK;
        startBtn.size = new Vec2(250,80)
        startBtn.font = "Consola"
        startBtn.fontSize = 50
        startBtn.onClickEventId = "start"

        // Controls button
        let controlsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(bg.size.x/2, bg.size.y/2 + 125), text: "CONTROLS"});
        controlsBtn.backgroundColor = purple;
        controlsBtn.borderColor = cyan;
        controlsBtn.borderWidth = 3
        controlsBtn.textColor = Color.BLACK;
        controlsBtn.size = new Vec2(250,80)
        controlsBtn.font = "Consola"
        controlsBtn.fontSize = 50
        controlsBtn.onClickEventId = "controls"

        // Help button
        let helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(bg.size.x/2, bg.size.y/2 + 250), text: "HELP"});
        helpBtn.backgroundColor = purple;
        helpBtn.borderColor = cyan;
        helpBtn.borderWidth = 3
        helpBtn.textColor = Color.BLACK;
        helpBtn.size = new Vec2(250,80)
        helpBtn.font = "Consola"
        helpBtn.fontSize = 50
        helpBtn.onClickEventId = "help1"
    }

}