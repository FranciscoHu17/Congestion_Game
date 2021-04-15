import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import LevelManager from "../Wolfie2D/LevelManager/LevelManager";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import LayerHelper from "./LayerHelper";

export default class LevelSelect extends Scene{
    loadScene(): void {
        this.load.image("level_select","assets/sprites/level_select.png")
    }
    
    startScene(): void {
        this.initLayers()

        // Colors
        let purple = Color.fromStringHex("cb16ec")
        let darkblue = Color.fromStringHex("2d0d94")
        let cyan = Color.fromStringHex("00cbd4") 

        // Background image
        let bg = this.add.sprite("level_select", "bg");
        bg.position.set(bg.size.x/2,bg.size.y/2);

        // Header
        LayerHelper.addHeader(this, new Vec2(bg.size.x/2-8,bg.size.y/8+9), darkblue, "titleShadow", "Level Select")
        LayerHelper.addHeader(this, new Vec2(bg.size.x/2,bg.size.y/8), purple, "levelSelect", "Level Select")


        //LayerHelper.addButtons(this, bg.size, purple, cyan, "levelSelect", "prevlevelSelect", "levelSelect2", "menu", "Exit")

    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "start"){
                
            }
        }
    }

    initLayers(): void {
        this.addLayer("bg", 0);
        this.addLayer("titleShadow", 100)
        this.addLayer("levelSelect", 200)
    }
}