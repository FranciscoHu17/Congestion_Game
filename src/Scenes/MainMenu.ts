import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import LayerHelper from "./LayerHelper";

export default class SplashScreen extends Scene{
    protected shadowLayer: Layer
    protected mainMenu: Layer
    protected controls: Layer
    protected help: Layer

    loadScene(): void {
        this.load.image("main_menu","assets/sprites/main_menu.png") 
    }
    
    startScene(): void {
        this.initLayers()

        // Colors
        let purple = Color.fromStringHex("cb16ec")
        let darkblue = Color.fromStringHex("2d0d94")
        let cyan = Color.fromStringHex("00cbd4") 

        let bg = this.add.sprite("main_menu", "bg");
        bg.position.set(bg.size.x/2,bg.size.y/2);

        // Shadow label
        let shadowLabel = <Label>this.add.uiElement(UIElementType.LABEL,"shadow", {position: new Vec2(bg.size.x/2-8, bg.size.y/4+9), text: "Congestion"})
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
        helpBtn.onClickEventId = "help"

        // Set viewport size
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        this.receiver.subscribe("menu")
        this.receiver.subscribe("start")
        this.receiver.subscribe("controls")
        this.receiver.subscribe("help")

    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "start"){
                //this.sceneManager.changeScene();
            }

            if(event.type === "controls"){
                this.shadowLayer.setHidden(true)
                this.mainMenu.setHidden(true);
                this.controls.setHidden(false);
                this.help.setHidden(true)
            }

            if(event.type === "help"){
                this.shadowLayer.setHidden(true)
                this.mainMenu.setHidden(true);
                this.controls.setHidden(true)
                this.help.setHidden(false); 
            }

            if(event.type === "menu"){
                this.shadowLayer.setHidden(false)
                this.mainMenu.setHidden(false);
                this.controls.setHidden(true)
                this.help.setHidden(true);
            }
        }
    }

    initLayers(): void {
        this.addLayer("bg", 0);
        this.shadowLayer = this.addLayer("shadow", 100)
        this.mainMenu = this.addLayer("mainMenu", 200)
        this.controls = this.addLayer("controls", 200)
        this.help = this.addLayer("help", 200)

        this.controls.setHidden(true)
        this.help.setHidden(true)
        
        LayerHelper.controlsLayer(this, "menu")
        LayerHelper.helpLayer(this, "menu")
    }

}