export default class Level {
	constructor(options) {
		this.game   = options.game;
		this.layout = options.layout;
		this.grid = this.layout
			.trim()
			.split('\n')
			.map((s) => {return Array.prototype.slice.call(s)});
		this.width = this.grid[0].length;
		this.height = this.grid.length;
	}

	getCell(x, y) {
		var row = this.grid[Math.floor(y)];
		if (!row) { return undefined }
		return row[Math.floor(x)];
	}

	render() {
		const gfx = this.game.gfx;
		const scaleX = this.game.width/this.grid[0].length;
		const scaleY = this.game.height/this.grid.length;

		this.grid.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell === '*') {
					const fill = 0x993333;
					gfx.lineStyle(null);
					gfx.beginFill(0xAA3333);
					gfx.drawRect(x * scaleX, y * scaleY, 1 * scaleX, 1 * scaleY);
					gfx.endFill();
				}
			})
		})

	}

	update() {
	}
}