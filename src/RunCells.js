import Cells from './Cells';
import './Math';

export default class RunCells {

	create() {
		// this.game.gfx = this.game.add.graphics(0, 0);
		this.game.screen = this.game.add.bitmapData(this.game.width, this.game.height);
		this.game.add.sprite(0, 0, this.game.screen);
		this.game.cells = new Cells({
			game: this.game,
			numCells: 200,
			minRadius: 2,
			maxRadius: 4,
			baseColor: [180, 30, 30],
			repulseColor: [160, 160, 255]
		});

	}

	render() {
		// this.game.gfx.clear();
		this.game.screen.clear();
		this.game.cells.render();
		this.game.screen.render();
	}

	update() {
		this.game.cells.update();
	}

}