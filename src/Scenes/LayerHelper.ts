import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";

export default class LayerHelper{
    // Adds uiElements to the controls layer in the main Scene where exit is the event that will lead back to the main Scene
    static controlsLayer(mainScene: Scene, exit: string){ 
        let size = new Vec2(mainScene.getViewport().getHalfSize().x*2, mainScene.getViewport().getHalfSize().y*2)
        const controlsHeader = <Label>mainScene.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(size.x/2,size.y/8), text: "Controls"});
        controlsHeader.textColor = Color.WHITE
        controlsHeader.font = "PositiveSystem" 
        controlsHeader.fontSize = 125
    }

    // Adds uiElements to the help layer in the main Scene where exit is the event that will lead back to the main Scene
    static helpLayer(mainScene: Scene, exit: string){ 
        let size = new Vec2(mainScene.getViewport().getHalfSize().x*2, mainScene.getViewport().getHalfSize().y*2)
        const helpHeader = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(size.x/2,size.y/8), text: "Help"});
        helpHeader.textColor = Color.WHITE
        helpHeader.font = "PositiveSystem" 
        helpHeader.fontSize = 125
    }

    
}