import { Game_Events } from "../Enums/GameEvents";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
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
        let headerPos = new Vec2(size.x/2,size.y/8)
        let shadowPos = new Vec2(size.x/2-8,size.y/8+9)
        let line_size = new Vec2(400,40)

        // Colors
        let purple = Color.fromStringHex("cb16ec")
        let darkblue = Color.fromStringHex("2d0d94")
        let cyan = Color.fromStringHex("0afcf5")
        let green = Color.fromStringHex("0afc42")  

        // Header
        this.addHeader(mainScene, shadowPos, darkblue, "controlsShadow", "Controls")
        this.addHeader(mainScene, headerPos, purple, "controls", "Controls")

        this.addLabel(mainScene, new Vec2(size.x/4+75,size.y/4 + 48), line_size, green, "controls", "W/Space - Jump")
        this.addLabel(mainScene, new Vec2(size.x/4+75,size.y/4 + 88), line_size, green, "controls", "A - Move Left")
        this.addLabel(mainScene, new Vec2(size.x/4+75,size.y/4 + 128), line_size, green, "controls", "S - Duck")
        this.addLabel(mainScene, new Vec2(size.x/4+75,size.y/4 + 168), line_size, green, "controls", "D - Move Right")

        this.addLabel(mainScene, new Vec2(3*size.x/4-75,size.y/4 + 48), line_size, green, "controls", "Q - Ability 1")
        this.addLabel(mainScene, new Vec2(3*size.x/4-75,size.y/4 + 88), line_size, green, "controls", "E - Ability 2")
        this.addLabel(mainScene, new Vec2(3*size.x/4-75,size.y/4 + 128), line_size, green, "controls", "Left Click - Attack")
        this.addLabel(mainScene, new Vec2(3*size.x/4-75,size.y/4 + 168), line_size, green, "controls", "ESC - Pause")

        this.addLabel(mainScene, new Vec2(size.x/2,size.y/2+90), line_size, green, "controls", "1 - Switch to Tahoe")
        this.addLabel(mainScene, new Vec2(size.x/2,size.y/2+130), line_size, green, "controls", "2 - Switch to Reno")
        this.addLabel(mainScene, new Vec2(size.x/2,size.y/2+170), line_size, green, "controls", "3 - Switch to Flow")

        // Outline around controls
        let bodyOutline = <Label>mainScene.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(size.x/4+75,size.y/2-70), text: ""});
        bodyOutline.size = new Vec2(400,162)
        bodyOutline.borderRadius = 0
        bodyOutline.borderWidth = 5
        bodyOutline.borderColor = cyan

        // Outline around controls
        bodyOutline = <Label>mainScene.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(3*size.x/4-75,size.y/2-70), text: ""});
        bodyOutline.size = new Vec2(400,162)
        bodyOutline.borderRadius = 0
        bodyOutline.borderWidth = 5
        bodyOutline.borderColor = cyan

        // Outline around controls
        bodyOutline = <Label>mainScene.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(size.x/2,size.y/2+130), text: ""});
        bodyOutline.size = new Vec2(400,122)
        bodyOutline.borderRadius = 0
        bodyOutline.borderWidth = 5
        bodyOutline.borderColor = cyan

        // Exit Button
        this.addExitButton(mainScene, purple, cyan, "controls", exit, "Exit")
    }

    /**
     * Adds uiElements to the help layer in the main Scene
     * @param mainScene The scene that contains the help layer
     * @param exit The event that is triggered in order to exit the help layer
     */
    static helpLayer(mainScene: Scene, exit: string){ 
        let size = new Vec2(mainScene.getViewport().getHalfSize().x*2, mainScene.getViewport().getHalfSize().y*2)
        let headerPos = new Vec2(size.x/2,size.y/8)
        let shadowPos = new Vec2(size.x/2-8,size.y/8+9)
        let subHeaderPos = new Vec2(size.x/2,size.y/8 +115)
        
        
        // Colors
        let purple = Color.fromStringHex("cb16ec")
        let darkblue = Color.fromStringHex("2d0d94")
        let cyan = Color.fromStringHex("0afcf5") 
        let green = Color.fromStringHex("0afc42")

        // Shadow label
        this.addHeader(mainScene, shadowPos, darkblue, "helpShadow", "Help")

        /*
        ##############################################################################################################################################
                                                                    HELP1 SCREEN
        ##############################################################################################################################################
        */

        // Header
        this.addHeader(mainScene, headerPos, purple, "help1", "Help")

        // Subheader
        this.addSubHeader(mainScene, subHeaderPos, cyan, "help1", "Backstory")

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

        // Prev, Next, Exit Buttons
        this.addButtons(mainScene, size, purple, cyan, "help1", "help4", "help2", exit, "Exit")

        /*
        ##############################################################################################################################################
                                                                    HELP2 SCREEN
        ##############################################################################################################################################
        */

        // Header
        this.addHeader(mainScene, headerPos, purple, "help2", "Help")

        // Subheader
        this.addSubHeader(mainScene, subHeaderPos, cyan, "help2", "Character Info")

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
        let abilityText = " Ability 1: Push enemies away\n" +
                          " Ability 2: Bring enemies closer"
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
        abilityText = " Ability 1: Throw SYN packets at various angles\n" +
                      " Ability 2: Get behind enemy"
        this.addParagraphLabel(mainScene, new Vec2(size.x/2,size.y/2+123), "help2", abilityText)

        // Passive Ability
        passive = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help2", {position: new Vec2(size.x/2,size.y/2+185), text: " Passive: 2x damage when behind enemy"});
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

        // Prev, Next, Exit Buttons
        this.addButtons(mainScene, size, purple, cyan, "help2", "help1", "help3", exit, "Exit")

        /*
        ##############################################################################################################################################
                                                                    HELP3 SCREEN
        ##############################################################################################################################################
        */

        // Header
        this.addHeader(mainScene, headerPos, purple, "help3", "Help")

        // Subheader
        this.addSubHeader(mainScene, subHeaderPos, cyan, "help3", "Character Info (Continued)")

        //#####################################################        FLOW       ##################################################################

        // Character Name
        characterName = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help3", {position: new Vec2(size.x/2-5,size.y/2-70), text: " Flow - Mobility"});
        characterName.textColor = green
        characterName.borderRadius = 0
        characterName.backgroundColor = Color.BLACK
        characterName.font = "Consola"
        characterName.fontSize = 35
        characterName.size = new Vec2(1020,40)
        characterName.setHAlign("left")

        // Abilities
        abilityText = " Ability 1: Teleport in the direction that Flow is facing \n" +
                      " Ability 2: Creates a checkpoint in Flow's current position \n" 
        this.addParagraphLabel(mainScene, new Vec2(size.x/2,size.y/2-37), "help3", abilityText)

        // Passive Ability
        passive = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help3", {position: new Vec2(size.x/2,size.y/2+25), text: " Passive: 20% faster movement speed"});
        passive.textColor = purple
        passive.backgroundColor = Color.BLACK
        passive.font = "Consola"
        passive.fontSize = 30
        passive.size = new Vec2(1020,35)
        passive.setHAlign("left")

        // Outline around character info
        bodyOutline = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help3", {position: new Vec2(size.x/2,size.y/2 - 25), text: ""});
        bodyOutline.size = new Vec2(1020,135)
        bodyOutline.borderRadius = 0
        bodyOutline.borderWidth = 5
        bodyOutline.borderColor = purple

       /* // Ability 2 Explanation
        abilityText = " The direction and velocity of Ability 2 will be shown by an \n"+
                      " arrow near Flow. The arrow will follow the mouse cursor \n"+
                      " on the screen to show the trajectory of Flow’s jump when the \n"+
                      " key for the ability is held. When this key is let go, then \n"+
                      " Flow will be launched with a high velocity in that direction."
        this.addParagraphLabel(mainScene, new Vec2(size.x/2,size.y/2 + 90), "help3", abilityText)

        // Outline around character info
        bodyOutline = <Label>mainScene.add.uiElement(UIElementType.LABEL, "help3", {position: new Vec2(size.x/2,size.y/2 + 150), text: ""});
        bodyOutline.size = new Vec2(1020,158)
        bodyOutline.borderRadius = 0
        bodyOutline.borderWidth = 5
        bodyOutline.borderColor = purple */

        // Prev, Next, Exit Buttons
        this.addButtons(mainScene, size, purple, cyan, "help3", "help2", "help4", exit, "Exit")

        /*
        ##############################################################################################################################################
                                                                    HELP4 SCREEN
        ##############################################################################################################################################
        */

        // Header
        this.addHeader(mainScene, headerPos, purple, "help4", "Help")

        // Subheader
        this.addSubHeader(mainScene, subHeaderPos, cyan, "help4", "Cheats")

        this.addCheatButton(mainScene, new Vec2(size.x/4+40,size.y/2-70), purple, green, "help4", "Go to Level 1", "level1")
        this.addCheatButton(mainScene, new Vec2(size.x/4+40,size.y/2+20), purple, green, "help4", "Go to Level 2", "level2")
        this.addCheatButton(mainScene, new Vec2(size.x/4+40,size.y/2+110), purple, green, "help4", "Go to Level 3", "level3")

        this.addCheatButton(mainScene, new Vec2(size.x/2,size.y/2+200), purple, green, "help4", "Make Player Invincible", Game_Events.INVINCIBLE)

        // Prev, Next, Exit Buttons
        this.addButtons(mainScene, size, purple, cyan, "help4", "help3", "help1", exit, "Exit")
        
    }

    static addLabel(mainScene: Scene, position: Vec2, line_size: Vec2, color: Color, layer: string, text: string): void {
        let label = <Label>mainScene.add.uiElement(UIElementType.LABEL, layer, {position: position, text: text});        
        label.backgroundColor = Color.BLACK
        label.textColor = color
        label.font = "Consola"
        label.fontSize = 30
        label.size = line_size
        label.borderRadius = 0
    }

    static addParagraphLabel(mainScene: Scene, position: Vec2, layer: string, paragraph: string): void{    
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
    }

    
    static addHeader(mainScene: Scene, position: Vec2, color: Color, layer: string, text: string): void{
        let header = <Label>mainScene.add.uiElement(UIElementType.LABEL, layer, {position: position, text: text});
        header.textColor = color
        header.font = "PositiveSystem" 
        header.fontSize = 125
    }

    static addSubHeader(mainScene: Scene, position: Vec2, color: Color, layer: string, text: string) : void{
        let subHeader = <Label>mainScene.add.uiElement(UIElementType.LABEL, layer, {position: position, text: text});
        subHeader.textColor = color
        subHeader.font = "Consola"
        subHeader.fontSize = 40
    }

    static addButtons(mainScene: Scene, size: Vec2, bordColor: Color, textColor: Color, layer: string,  prev: string, next: string, exit: string, exitText: string): void{
        // Prev Help
        let prevHelpBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, layer, {position: new Vec2(1*size.x/20, size.y/2 + 60), text: "<"});
        prevHelpBtn.padding = new Vec2(10,40)
        prevHelpBtn.borderWidth = 4
        prevHelpBtn.borderColor = bordColor
        prevHelpBtn.backgroundColor = Color.BLACK
        prevHelpBtn.textColor = textColor
        prevHelpBtn.onClickEventId = prev

        // Next Help
        let nextHelpBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, layer, {position: new Vec2(19*size.x/20, size.y/2 + 60), text: ">"});
        nextHelpBtn.padding = new Vec2(10,40)
        nextHelpBtn.borderWidth = 4
        nextHelpBtn.borderColor = bordColor
        nextHelpBtn.backgroundColor = Color.BLACK
        nextHelpBtn.textColor = textColor
        nextHelpBtn.onClickEventId = next

        // Exit Button
        this.addExitButton(mainScene, bordColor, textColor, layer, exit, exitText)
    }

    static addExitButton(mainScene: Scene, bordColor: Color, textColor: Color, layer: string, exit: string, text: string): void{
        // Exit Button
        let exitBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, layer, {position: new Vec2(60,50), text: text});
        exitBtn.padding = new Vec2(10,10)
        exitBtn.borderWidth = 4
        exitBtn.borderColor = bordColor
        exitBtn.backgroundColor = Color.BLACK
        exitBtn.textColor = textColor
        exitBtn.font = "Consola"
        exitBtn.onClickEventId = exit
    }

    static addCheatButton(mainScene: Scene, position: Vec2, bordColor: Color, textColor: Color, layer: string, text: string, event: string): void {
        let cheatBtn = <Button>mainScene.add.uiElement(UIElementType.BUTTON, layer, {position: position, text: text});
        cheatBtn.padding = new Vec2(20,10)
        cheatBtn.borderWidth = 4
        cheatBtn.borderColor = bordColor
        cheatBtn.backgroundColor = Color.BLACK
        cheatBtn.textColor = textColor
        cheatBtn.font = "Consola"
        cheatBtn.onClickEventId = event
    }
    
}