import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";

export default class LayerHelper{
    /**
     * Adds uiElements to the controls layer in the main Scene
     * @param mainScene The scene that contains the controls layer
     * @param exit The event that is triggered in order to exit the help layer
     */
    static controlsLayer(mainScene: Scene, exit: string){ 
        let size = new Vec2(mainScene.getViewport().getHalfSize().x*2, mainScene.getViewport().getHalfSize().y*2)

        // Colors
        let purple = Color.fromStringHex("cb16ec")
        let darkblue = Color.fromStringHex("2d0d94")
        let cyan = Color.fromStringHex("0afcf5")  

        // Shadow label
        let shadowLabel = <Label>mainScene.add.uiElement(UIElementType.LABEL,"controlsShadow", {position: new Vec2(size.x/2-8,size.y/8+9), text: "Controls"})
        shadowLabel.textColor = darkblue
        shadowLabel.font = "PositiveSystem" 
        shadowLabel.fontSize = 125

        // Controls Header
        let controlsHeader = <Label>mainScene.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(size.x/2,size.y/8), text: "Controls"});
        controlsHeader.textColor = purple
        controlsHeader.font = "PositiveSystem" 
        controlsHeader.fontSize = 125
    }

    /**
     * Adds uiElements to the help layer in the main Scene
     * @param mainScene The scene that contains the help layer
     * @param exit The event that is triggered in order to exit the help layer
     */
    static helpLayer(mainScene: Scene, exit: string){ 
        let size = new Vec2(mainScene.getViewport().getHalfSize().x*2, mainScene.getViewport().getHalfSize().y*2)
        
        // Colors
        let purple = Color.fromStringHex("cb16ec")
        let darkblue = Color.fromStringHex("2d0d94")
        let cyan = Color.fromStringHex("0afcf5") 
        let green = Color.fromStringHex("0afc42")

        // Shadow label
        let shadowLabel = <Label>mainScene.add.uiElement(UIElementType.LABEL,"helpShadow", {position: new Vec2(size.x/2-8,size.y/8+9), text: "Help"})
        shadowLabel.textColor = darkblue
        shadowLabel.font = "PositiveSystem" 
        shadowLabel.fontSize = 125

        /*
        ##############################################################################################################################################
                                                                    HELP1 SCREEN
        ##############################################################################################################################################
        */

        // Header
        let helpHeader = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help1", {position: new Vec2(size.x/2,size.y/8), text: "Help"});
        helpHeader.textColor = purple
        helpHeader.font = "PositiveSystem" 
        helpHeader.fontSize = 125

        // Subtitle
        let subHeader = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help1", {position: new Vec2(size.x/2,size.y/8 +115), text: "Backstory"});
        subHeader.textColor = cyan
        subHeader.font = "Consola"
        subHeader.fontSize = 40

        // Back Story
        let backstoryText = " \t\t\tIn the year 2099, a new transportation layer protocol \n" + 
                            " for the Internet had been designed called LFP. It’s a \n" +
                            " superior alternative to other protocols and rapidly became  \n" +
                            " part of mainstream use in web applications. However, an evil \n" +
                            " organization was able to exploit a flaw and is slowing the \n" +
                            " flow of data by congesting core routers. Computer network \n"+
                            " researchers all around the world devised a set of three AI\n" +
                            " programs, named Tahoe, Reno, and Flow, that would locate \n" +
                            " the core routers and destroy the cause of the congestion to \n"+
                            " allow data to flow quickly again."
        this.addParagraphLabel(mainScene, new Vec2(size.x/2,size.y/8 +200), "help1", backstoryText)

        // Outline around the backstory
        let bodyOutline = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help1", {position: new Vec2(size.x/2,size.y/2+65), text: ""});
        bodyOutline.size = new Vec2(1020,306)
        bodyOutline.borderRadius = 0
        bodyOutline.borderWidth = 5
        bodyOutline.borderColor = purple

        // Next Help
        let nextHelpBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, "help1", {position: new Vec2(19*size.x/20, size.y/2 + 60), text: ">"});
        nextHelpBtn.padding = new Vec2(10,40)
        nextHelpBtn.borderWidth = 4
        nextHelpBtn.borderColor = purple
        nextHelpBtn.backgroundColor = Color.BLACK
        nextHelpBtn.textColor = cyan
        nextHelpBtn.onClickEventId = "help2"

        // Exit Button
        let exitBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, "help1", {position: new Vec2(60,50), text: "Exit"});
        exitBtn.padding = new Vec2(10,10)
        exitBtn.borderWidth = 4
        exitBtn.borderColor = purple
        exitBtn.backgroundColor = Color.BLACK
        exitBtn.textColor = cyan
        exitBtn.onClickEventId = "menu"

        /*
        ##############################################################################################################################################
                                                                    HELP2 SCREEN
        ##############################################################################################################################################
        */

        // Header
        helpHeader = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2,size.y/8), text: "Help"});
        helpHeader.textColor = purple
        helpHeader.font = "PositiveSystem" 
        helpHeader.fontSize = 125

        // Subtitle
        subHeader = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2,size.y/8 +115), text: "Character Info"});
        subHeader.textColor = cyan
        subHeader.font = "Consola"
        subHeader.fontSize = 40

        //#####################################################        TAHOE        ##################################################################

        // Character Name
        let characterName = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2-5,size.y/2-70), text: " Tahoe - Crowd Control"});
        characterName.textColor = green
        characterName.backgroundColor = Color.BLACK
        characterName.font = "Consola"
        characterName.fontSize = 35
        characterName.size = new Vec2(1020,40)
        characterName.setHAlign("left")

        // Abilities
        let abilityText = " Ability 1: push enemies away\n" +
                          " Ability 2: bring enemies closer"
        this.addParagraphLabel(mainScene, new Vec2(size.x/2,size.y/2-37), "help2", abilityText)

        // Passive Ability
        let passive = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2,size.y/2+25), text: " Passive: Enemies hit move 20% slower"});
        passive.textColor = purple
        passive.backgroundColor = Color.BLACK
        passive.font = "Consola"
        passive.fontSize = 30
        passive.size = new Vec2(1020,35)
        passive.setHAlign("left")
        
        // Outline around character info
        bodyOutline = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2,size.y/2 - 25), text: ""});
        bodyOutline.size = new Vec2(1020,135)
        bodyOutline.borderRadius = 0
        bodyOutline.borderWidth = 5
        bodyOutline.borderColor = purple

        //#####################################################        RENO        ##################################################################

        // Character Name
        characterName = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2-4,size.y/2 + 90), text: " Reno - Damage Dealer"});
        characterName.textColor = green
        characterName.borderRadius = 0
        characterName.backgroundColor = Color.BLACK
        characterName.font = "Consola"
        characterName.fontSize = 35
        characterName.size = new Vec2(1020,40)
        characterName.setHAlign("left")

        // Abilities
        abilityText = " Ability 1: throw SYN packets at various angles\n" +
                      " Ability 2: get behind enemy"
        this.addParagraphLabel(mainScene, new Vec2(size.x/2,size.y/2+123), "help2", abilityText)

        // Passive Ability
        passive = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2,size.y/2+185), text: " Passive: Enemies hit move 20% slower"});
        passive.textColor = purple
        passive.backgroundColor = Color.BLACK
        passive.font = "Consola"
        passive.fontSize = 30
        passive.size = new Vec2(1020,35)
        passive.setHAlign("left")

        // Outline around character info
        bodyOutline = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2,size.y/2 + 135), text: ""});
        bodyOutline.size = new Vec2(1020,135)
        bodyOutline.borderRadius = 0
        bodyOutline.borderWidth = 5
        bodyOutline.borderColor = purple

        // Previous Help
        let prevHelpBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, "help2", {position: new Vec2(1*size.x/20, size.y/2 + 60), text: "<"});
        prevHelpBtn.padding = new Vec2(10,40)
        prevHelpBtn.borderWidth = 4
        prevHelpBtn.borderColor = purple
        prevHelpBtn.backgroundColor = Color.BLACK
        prevHelpBtn.textColor = cyan
        prevHelpBtn.onClickEventId = "help1"

        // Next Help
        nextHelpBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, "help2", {position: new Vec2(19*size.x/20, size.y/2 + 60), text: ">"});
        nextHelpBtn.padding = new Vec2(10,40)
        nextHelpBtn.borderWidth = 4
        nextHelpBtn.borderColor = purple
        nextHelpBtn.backgroundColor = Color.BLACK
        nextHelpBtn.textColor = cyan
        nextHelpBtn.onClickEventId = "help3"

        // Exit Button
        exitBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, "help2", {position: new Vec2(60,50), text: "Exit"});
        exitBtn.padding = new Vec2(10,10)
        exitBtn.borderWidth = 4
        exitBtn.borderColor = purple
        exitBtn.backgroundColor = Color.BLACK
        exitBtn.textColor = cyan
        exitBtn.onClickEventId = "menu"

        /*
        ##############################################################################################################################################
                                                                    HELP3 SCREEN
        ##############################################################################################################################################
        */















        /*
        ##############################################################################################################################################
                                                                    HELP4 SCREEN
        ##############################################################################################################################################
        */
        
    }

    static addParagraphLabel(mainScene: Scene, position: Vec2, layer: string, paragraph: string): object{    
        let currPos = position
        let lines = paragraph.split("\n")
        let cyan = Color.fromStringHex("0afcf5")
        let line_size = new Vec2(1020,33)

        for(let i = 0; i < lines.length; i++){
            let line = <Label>mainScene.add.uiElement(UIElementType.LABEL, layer, {position: currPos, text: lines[i]});
            line.setHAlign("left")
            line.backgroundColor = Color.BLACK
            line.textColor = cyan
            line.font = "Consola"
            line.fontSize = 30
            line.borderRadius = 0
            line.size = line_size  
            
            currPos = currPos.clone().add(new Vec2(0,30))
        }
        return lines
    }

    
}