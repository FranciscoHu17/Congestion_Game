# Congestion_Game

The game can be played online at https://congestion.firebaseapp.com/

## About

The game is based off congestion at the transport layer in computer networking with some creative liberties. The backstory is as follows:

In the year 2099, a new transportation layer protocol for the Internet had been designed called LFP. It’s a superior alternative to other protocols and rapidly became part of mainstream use in web applications. However, an evil organization was able to exploit a flaw and is slowing the flow of data by congesting core routers. Computer network researchers all around the world devised a set of three AI programs that would locate the core routers and destroy the cause of the congestion. The three AI programs are our playable characters, Tahoe, Reno, and Flow.

The objecive of the game is to traverse throughout the levels and at the sixth level, you will fight the boss which is the cause of the congestion. Throughout the game you'll play as the three programs, whose names are Tahoe, Reno, and Flow who will have their own abilities/playstyles. You'll need to be careful during stages since the connection is unstable and you might fall through gaps. There will be three life crystals given at the beginning of each level so you’ll have three chances to reboot the AI programs if they are disconnected/destroyed along the way. Each enemy has their own set of abilities and you must dodge their attacks to land your own.

## Controls

W/SPACE - Jump     
A - Left      
D - Right       
1 - Switch to Tahoe       
2 - Switch to Reno          
3 - Switch to Flow       
Q - Ability 1      
E - Ability 2       
LEFT CLICK - Basic Attack      
ESC - Pause       

## Abilities

Tahoe (Crowd Control): 
- Ability 1 - Pushes enemies
- Ability 2 - Pulls enemies

Reno (Damage Dealer): 
- Ability 1 - Aerial attack that throws seven SYN packets towards the ground
- Ability 2 - Teleport behind the closest enemy

Flow (Utility): 
- Ability 1 - Teleport through walls and travel faster
- Ability 2 - Creates a checkpoint

## How to transpile and run

Start gulp by just running `gulp` in the console. Start the code by running `dist/main.js` with Web Server for Chrome or a similar product. Anytime you save, gulp should recompile the code automatically.

Setup follows [this helpful guide from TypeScript] (https://www.typescriptlang.org/docs/handbook/gulp.html) (Up through Watchify).
