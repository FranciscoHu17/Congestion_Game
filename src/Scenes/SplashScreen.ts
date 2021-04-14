import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import MainMenu from "../Scenes/MainMenu";
import Timer from "../Wolfie2D/Timing/Timer";



export default class SplashScreen extends Scene{
    protected fadeTimer: Timer;
    protected startLabel: Label;

    loadScene(): void {
        this.load.image("splash_screen","assets/sprites/splash_screen.png")
        this.load.image("logo","assets/sprites/logo.png")
    }
    
    startScene(): void {
        this.initLayers()
        this.fadeTimer = new Timer(2000)

        // Background image
        let bg = this.add.sprite("splash_screen", "bg");
        bg.position.set(bg.size.x/2,bg.size.y/2);

        // Logo
        let logo = this.add.sprite("logo","splashScreen")
        logo.position.set(bg.size.x/2, bg.size.y/3)

        // Start label
        this.startLabel = <Label>this.add.uiElement(UIElementType.LABEL,"splashScreen", {position: new Vec2(bg.size.x/2, 2* bg.size.y/3 + 25), text: "Click anywhere to start"})
        this.startLabel.textColor = Color.WHITE
        this.startLabel.font = "Consola" 
        
        // Click anywhere
        const clickanywhere = this.add.uiElement(UIElementType.BUTTON, "splashScreen", {position: new Vec2(bg.size.x/2, bg.size.y/2), text:""})
        clickanywhere.size.set(bg.size.x, bg.size.y);
        clickanywhere.borderColor = Color.WHITE
        clickanywhere.backgroundColor = Color.TRANSPARENT
        clickanywhere.onClickEventId = "start"
        
        // Viewport sizing
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Subscribe to start event
        this.receiver.subscribe("start")
    }

    updateScene(){
        // startLabel fades in and out
        if(this.fadeTimer.isStopped()){
            this.fadeTimer.start()
        }
        else{
            const totalTime = this.fadeTimer.getTotalTime()
            const timeLeft = this.fadeTimer.getTimeLeft()
            const timePassed = totalTime - timeLeft
            this.startLabel.textColor.a =  (Math.abs(totalTime/2 - timePassed))/(totalTime/2)
        }

        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            // If screen has been clicked, changed to Main Menu
            if(event.type === "start"){
                this.sceneManager.changeToScene(MainMenu)
            }
        }
    }

    initLayers(): void {
        this.addLayer("bg", 0);
        this.addLayer("splashScreen", 100)
    }
}