import Game from "./Wolfie2D/Loop/Game";
import default_scene from "./default_scene";
import SplashScreen from "./Scenes/SplashScreen";
import Level1 from "./Scenes/Levels/Level1";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1280, y: 720},          // The size of the game
        clearColor: {r: 0, g: 0, b: 0},   // The color the game clears to
        levels: [
            {name: "level1", level: Level1, finished: false},     // Levels
            {name: "level2", level: Level1, finished: false},
            {name: "level3", level: Level1, finished: false},
            {name: "level4", level: Level1, finished: false},
            {name: "level5", level: Level1, finished: false},
            {name: "level6", level: Level1, finished: false}    
        ],
        inputs: [
            {name: "jump", keys: ["w","space"]},
            {name: "left", keys: ["a"]},
            {name: "duck", keys: ["s"]},
            {name: "right", keys: ["d"]},
            {name: "ability1", keys: ["q"]},
            {name: "ability2", keys: ["e"]},
            {name: "switch1", keys: ["1"]},
            {name: "switch2", keys: ["2"]},
            {name: "switch3", keys: ["3"]},
            {name: "pause", keys: ["esc"]},
        ]
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(SplashScreen, {});
})();

function runTests(){};