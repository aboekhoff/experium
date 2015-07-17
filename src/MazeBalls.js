export default class MazeBalls {

	constructor(options) {
		this.game = options.game;
		this.numBalls = options.numBalls || 10;
		this.balls = [];

		for (let i=0; i<this.numBalls; i++) {
			this.spawn();
		}

		console.log(this.balls);
	}

	spawn() {
		const level = this.game.level;
		for(;;) {
			const x = Math.randomInt(0, level.width);
			const y = Math.randomInt(0, level.height);
			if (level.getCell(x, y) != '*') {
				this.balls.push({
					id: this.balls.length,
					x: x + 0.5,
					y: y + 0.5,
					vx: Math.random(),
					vy: Math.random(),
					radius: 0.5
				});
				return;
			}
		}
	}

	render() {
		const gfx = this.game.gfx;
		const scaleX = this.game.width/this.game.level.width;
		const scaleY = this.game.height/this.game.level.height;

		const rect = (x, y, w, h) => {
			gfx.lineStyle(1, 0xFFFFFF, 1);
			gfx.beginFill(0x333399);
			gfx.drawRect(
				x * scaleX, 
				y * scaleY, 
				w * scaleX, 
				h * scaleY
			);
			gfx.endFill();
		}

		this.balls.forEach((ball) => {
			const x = ball.x;
			const y = ball.y;
			const r = ball.radius;

			gfx.lineStyle(1, 0xFFFFFF, 1);
			gfx.beginFill(0x339933);
			gfx.drawEllipse(
				x * scaleX, 
				y * scaleY, 
				r * scaleX, 
				r * scaleY
			);
			this.game.gfx.endFill();

			// rect(x, y, r, r);
			// rect(x, y-r, r, r);
			// rect(x-r, y, r, r);
			// rect(x-r, y-r, r, r);
		});	
	}

	update() {
		const speed = 0.2;
		const level = this.game.level;

		this.balls.forEach((ball) => {
			const x = ball.x;
			const y = ball.y;
			const r = ball.radius;

			const collides = (x, y) => {
				return level.getCell(x, y) == '*';
			}

			ball.x += ball.vx * speed;
			ball.y += ball.vy * speed;

			// check sides 

			if (collides(x + r, y-r/2) ||
				  collides(x + r, y+r/2)) {
				ball.vx *= -1;
				ball.x = Math.floor(x) + r - 0.001;		
			}

			else if (collides(x - r, y - r/2) ||
				       collides(x - r, y + r/2)) {
				ball.vx *= -1;
				ball.x = Math.floor(x) + r + 0.001;
			}

			if (collides(x - r/2, y + r) ||
				  collides(x + r/2, y + r)) {
				ball.vy *= -1;
				ball.y = Math.floor(y) + r - 0.001;
			} 
		  
		  else if (collides(x - r/2, y - r) ||
		  	       collides(x + r/2, y - r)) {
				ball.vy *= -1;
				ball.y = Math.floor(y) + r + 0.001;
			}
		})
	}

}