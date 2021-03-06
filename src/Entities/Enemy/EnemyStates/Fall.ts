import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import InAir from "./InAir";

export default class Fall extends InAir {
    owner: AnimatedSprite;
	retObj: Record<string, any>

	onEnter(options: Record<string, any>): void {
		//this.owner.animation.play("Fall", true);//TODO: add a fall animation and change the JSON files.
		this.retObj = options
	}

    onExit(): Record<string, any> {
		//this.owner.animation.stop();
        return this.retObj;
    }
}