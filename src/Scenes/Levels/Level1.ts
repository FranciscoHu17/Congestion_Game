import GameLevel from "./GameLevel";

export default class Level1 extends GameLevel{

    /**
     * TODO
     * 
     * Load resources
     */
    loadScene(): void {

    }

    /**
     * TODO
     * 
     * Keep resources
     */
    unloadScene(){

    }

    /**
     * TODO
     * 
     * Start the Scene
     */

    startScene(): void {
        // Generic GameLevel Scene setup
        super.startScene() 
    }

    /**
     * Update the Scene
     * @param deltaT 
     */
    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}