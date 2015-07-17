let game = new Phaser.Game(950, 600, Phaser.AUTO);

import Boot from './Boot'
import Preload from './Preload'
import Intro from './Intro'
import RunCells from './RunCells'
import RunRooms from './RunRooms'
import RunMazeBalls from './RunMazeBalls'

game.state.add('boot', Boot);
game.state.add('preload', Preload);
game.state.add('intro', Intro);
game.state.add('run-cells', RunCells);
game.state.add('run-rooms', RunRooms);
game.state.add('run-maze-balls', RunMazeBalls);
game.state.start('boot');
