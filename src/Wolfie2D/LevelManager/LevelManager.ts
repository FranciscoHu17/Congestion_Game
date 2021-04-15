import Scene from "../Scene/Scene";

export default class LevelManager{
    private static instance: LevelManager;
    private levels: Array<{name: string, level: Scene, finished: boolean}>;

    /* ######################################## SINGLETON ########################################*/
    /**
     * Returns the current instance of this class or a new instance if none exist
     * @returns The level Manager
     */
    static getInstance(): LevelManager {
        if(!this.instance){
            this.instance = new LevelManager();
        }

        return this.instance;
    }

    initLevels(levels: Array<{name: string, level: Scene, finished: boolean}>): void {
        this.levels = levels
    }

    getLevels(): Array<{name: string, level: Scene, finished: boolean}>{
        return this.levels
    }

    finishLevel(index: number): void {
        this.levels[index].finished = true
    }
}