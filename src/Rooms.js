function inRange (x, min, max) {
	return (x >= min) && (x <= max);
}

function collides(a, b) {
	const ax1 = a.x - a.width/2;
	const ax2 = a.x + a.width/2;
	const ay1 = a.y - a.height/2;
	const ay2 = a.y + a.height/2;

	const bx1 = b.x - b.width/2;
	const bx2 = b.x + b.width/2;
	const by1 = b.y - b.height/2;
	const by2 = b.y + b.height/2;

	const xOverlap = inRange(ax1, bx1, bx2) ||
	                 inRange(bx1, ax1, ax2);
	const yOverlap = inRange(ay1, by1, by2) ||
	                 inRange(by1, ay1, ay2);
	return xOverlap && yOverlap;
}

function touching(a, b) { 
	const xgoal = a.width/2 + b.width/2;
	const ygoal = a.height/2 + b.height/2;
	const xdist = Math.abs(a.x - b.x);
	const ydist = Math.abs(a.y - b.y);

	return (xdist == xgoal-1 && ydist >= ygoal) ||
	       (ydist == ygoal-1 && xdist >= xgoal);
}

export default class Rooms {
	constructor(options={}) {
		this.game = options.game;
		this.numRooms = options.numRooms || 150;
		this.minWidth = options.minWidth || 4;
		this.maxWidth = options.maxWidth || 8;
		this.minHeight = options.minHeight || 4;
		this.maxHeight = options.maxHeight || 8;
		this.radius = Math.ceil(Math.sqrt(Math.pow(this.maxWidth, 2) + Math.pow(this.maxHeight, 2))) * 6;
	  this.size = this.radius * 3;
		this.rooms = [];
		this.shouldUpdate = false;
		this.grid = [];
		this.grid.length = this.size * this.size;

		for (let i=0; i<this.numRooms; i++) {
			this.makeRoom();
		}
	}

	makeRoom() {
		const id = this.rooms.length;
		const width = Math.randomInt(this.minWidth, this.maxWidth) * 2;
		const height = Math.randomInt(this.minHeight, this.maxHeight) * 2;
		const xmin = Math.ceil(width / 2);
		const xmax = Math.ceil((this.radius) - (width / 2));
		const ymin = Math.ceil(height / 2);
		const ymax = Math.ceil((this.radius) - (height / 2));

		const offset = Math.floor(this.size/2 - this.radius/2);

		this.rooms.push({
			id: id,
			x: offset + Math.randomInt(xmin, xmax),
			y: offset + Math.randomInt(ymin, ymax),
			width: width,
			height: height,
			locked: false 		
		});
	}

	renderRoom(room) {
		const xscale = this.xscale;
		const yscale = this.yscale;
		const gfx = this.game.gfx;
		const w = room.width;
		const h = room.height;
		const fill = room.locked ? 0x66CC66 : 0xCC6666;
		gfx.lineStyle(fill);
		gfx.beginFill(fill);
		gfx.drawRect(
			(room.x - w/2) * xscale, 
			(room.y - h/2) * yscale, 
			w * xscale, 
			h * yscale
		);
		gfx.endFill();

	}

	render() {
		this.xscale = this.game.width / this.size;
		this.yscale = this.game.height / this.size;
	
		this.rooms
			.filter((room) => {return !room.locked})
			.forEach((room) => this.renderRoom(room));

		this.rooms
			.filter((room) => {return room.locked})
			.forEach((room) => this.renderRoom(room));
	}

	clearGrid() {
		for (let i=0; i<this.grid.length; i++) {
			this.grid[i] = true;
		}
	}

	setGridCell(x, y, z) {
		this.grid[y * this.size + x] = z;
	}

	getGridCell(x, y) {
		return this.grid[y * this.size + x];
	}

	fillGrid(exclude = -1) {
		this.clearGrid();
		for (let i=0; i<this.rooms.length; i++) {
			if (exclude == i) { continue; }
			const room = this.rooms[i];
			for (let x=-room.width/2; x<room.width/2; x++) {
				for (let y=-room.height/2; y<room.height/2; y++) {
					this.setGridCell(room.x + x, room.y + y, false);
				}
			}
		}
	}

	sampleGrid(room) {
		const sample = [];
		for (let x=-room.width/2-1; x<room.width/2+1; x++) {
			for (let y=-room.height/2-1; y<room.height/2+1; y++) {
				sample.push(this.grid[(room.y + y) * this.size + room.x + x]);
			}
		}
		return sample;
	}

	separate1(room) {
		const isColliding = () => {
			const sample = this.sampleGrid(room);
			for (let i=0; i<sample.length; i++) {
				if (!sample[i]) {
					return true; 
				}
			}
			return false;
		}

		const center = this.size/2;
		const xdir = room.x < center ? 1 : -1;
		const ydir = room.y < center ? 1 : - 1;

		this.fillGrid(room.id);

		const moveX = Math.random() >= 0.5

		while(isColliding()) {
			if (moveX) {
				room.x += xdir;
			} else {
				room.y += ydir;
			}
		} 
	}
	
	separate() {
		for (let i=0; i<this.rooms.length; i++) {
			const room = this.rooms[i];
			if (room.locked) {
				continue;
			}
			else {
				this.separate1(room);
				room.locked = true;
				return;
			}
		}
	}

	update() {
		if (!this.shouldUpdate) { return; }
		this.shouldUpdate = false;
		this.separate();
	}

}