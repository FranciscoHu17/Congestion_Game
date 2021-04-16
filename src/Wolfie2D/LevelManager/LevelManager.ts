import Scene from "../Scene/Scene";

export default class LevelManager{
    private static instance: LevelManager;
    private levels: Array<{name: string, level:typeof Scene, finished: boolean}>;
    private locked: Array<boolean>;

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

    initLevels(levels: Array<{name: string, level:typeof Scene, finished: boolean}>): void {
        this.levels = levels
        this.locked = (levels.length == 0) ? []:[false]
        for(let i = 1; i < levels.length; i++){
            this.locked.push(!levels[i].finished)
        }
    }

    getLevels(): Array<{name: string, level:typeof Scene, finished: boolean}>{
        return this.levels
    }

    getLocked(): Array<boolean>{
        return this.locked
    }

    findLevel(name: string): typeof Scene{
        let level = null
        for(let i = 0; i < this.levels.length; i++){
            if(this.levels[i].name === name){
                level= this.levels[i].level
            }
        }
        return level
    }

    finishLevel(index: number): void {
        this.levels[index].finished = true
        this.locked[index] = false
        
        if(index+1 < this.locked.length){
            this.locked[index+1] = false
        }
    }
}