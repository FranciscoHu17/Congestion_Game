import Scene from "../Wolfie2D/Scene/Scene";

export default class SplashScreen extends Scene{

    loadScene(): void {
        this.load.image("main_menu","assets/sprites/main_menu.png")
        
    }
    
    startScene(): void {
     
        this.initLayers()
        let bg = this.add.sprite("main_menu", "bg");
        bg.position.set(bg.size.x/2,bg.size.y/2);
        

        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

    }

    initLayers(): void {
        this.addLayer("bg", 0);
    }

}