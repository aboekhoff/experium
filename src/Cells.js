function scaleColor(color, amount) {
	return color.map((n1) => {
		let n2 = n1 * amount;
		if ((amount < 1 && n2 > n1) || n2 < 0) {
			n2 = 0;
		} 
		else if ((amount > 1 && n2 < n1) || n2 > 255) {
			n2 = 255;
		}

		return n2;
	});
}

function colorToHex(color) {
	return (color[0] << 16) | 
	       (color[1] << 8)  |
	       (color[2]);  
}

export default class Cells {
	constructor(options = {}) {
		this.cells = [];
		this.repulsions = [];
		this.game = options.game;
		this.numCells = options.numCells || 50;
		this.baseColor = options.baseColor || [200, 100, 100];
		this.repulseColor = options.repulseColor || this.baseColor;
		this.minRadius = options.minRadius || 10;
		this.maxRadius = options.maxRadius || 60;

		for (let i=0; i<this.numCells; i++) {
			this.makeCell(
				Math.randomInt(this.game.width),
				Math.randomInt(this.game.height),
				Math.randomInt(this.minRadius, this.maxRadius)
			);
		}

	}	

	makeCell(x, y, radius) {
		const scale = Math.normalize(radius, this.minRadius, this.maxRadius);
		// const color = this.baseColor;
		const color = scaleColor(this.baseColor, (1-(scale * 0.7)));

		this.cells.push({
			id: this.cells.length,
			x: x,
			y: y,
			vx: Math.random(),
			vy: Math.random(),
			radius: radius,
			color: color
		});
	}

	render() {
		const ctx = this.game.screen.ctx;
		this.repulsions.forEach((repulsion) => {
			const [c1, c2] = repulsion;
			const d = Math.distance(c1.x, c1.y, c2.x, c2.y);
			const color = scaleColor(this.repulseColor, 0.4 + 1/(d/10));
			ctx.strokeStyle = '#' + colorToHex(color).toString(16);
			ctx.beginPath();
			ctx.moveTo(c1.x, c1.y);
			ctx.lineTo(c2.x, c2.y);
			ctx.stroke();
			ctx.closePath();
		})

		this.cells.forEach((cell) => {
			let speed = Math.abs(cell.vx) + Math.abs(cell.vy);
			if (speed == 0) { speed = 1; }
			const color = '#' + colorToHex(scaleColor(cell.color, 1 + speed * 0.3)).toString(16);
			ctx.strokeStyle = 0;
			this.game.screen.circle(cell.x, cell.y, cell.radius, color);
		});

	}

	update() {
		this.applySeparationBehavior();
		this.updatePositions();
	}

	applySeparationBehavior() {
		this.repulsions.length = 0;

		for (let i=0; i<this.cells.length; i++) {
			const c1 = this.cells[i];
			for (let j=i+1; j<this.cells.length; j++) {
				const c2 = this.cells[j];

				const dr = Math.abs(c1.radius - c2.radius);
				const dist = Math.distance(c1.x, c1.y, c2.x, c2.y);
				const threshold = (c1.radius + c2.radius) * 4;
				const thresholdCrossed = dist < threshold;

				if (!thresholdCrossed) {
					continue;
				}

				const angle = Math.atan2(c1.x - c2.x, c1.y - c2.y);
				const coefficient = thresholdCrossed ? 1 : 1;
			
				if (thresholdCrossed) {
					this.repulsions.push([c1, c2]);
				}

				const dc = coefficient * dr * 0.0002;

				const dx1 = Math.cos(angle) * dc * (c2.radius/2);
				const dy1 = Math.sin(angle) * dc * (c2.radius/2);

				const dx2 = Math.cos(Math.PI + angle) * dc * (c1.radius/2);
				const dy2 = Math.sin(Math.PI + angle) * dc * (c1.radius/2);

				c1.vx += dx1;
				c1.vy += dy1;
				c2.vx -= dx2;
				c2.vy -= dy2;
			}
		}

	}

	updatePositions() {
		for (let i=0; i<this.cells.length; i++) {
			const c = this.cells[i];

			c.x += c.vx;
			c.y += c.vy;

			if (c.x < 0) {
				c.x = 0;
				c.vx *= -1;
			}

			else if (c.x > this.game.width) {
				c.x = this.game.width;
				c.vx *= -1;
			}

			if (c.y < 0) {
				c.y = 0;
				c.vy *= -1;
			}

			else if (c.y > this.game.height) {
				c.y = this.game.height;
				c.vy *= -1;
			}
		}

	}
}