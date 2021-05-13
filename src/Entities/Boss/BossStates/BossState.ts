import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import BossController from "../BossController";

export default abstract class BossState extends State {
	owner: GameNode;
	gravity: number = 128*10;
	parent: BossController
    

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity*deltaT;

		
		if(this.owner.onWall){
			this.parent.velocity.x = 0
		}
	}
}