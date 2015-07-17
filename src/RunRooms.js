import Rooms from './Rooms';

export default class RunRooms {

	create() {
		this.game.gfx = this.game.add.graphics(0, 0);
		this.game.rooms = new Rooms({
			game: this.game,
			numRooms: 50,
			minWidth: 2, 
			maxWidth: 8,
			minHeight: 2,
			maxHeight: 8
		});

		this.game.input.keyboard.addCallbacks(
			this,
			this.onKeyDown,
			this.onKeyUp,
			this.onKeyPress
		)

	}

	render() {
		this.game.gfx.clear();
		this.game.rooms.render();
	}

	update() {
		this.game.rooms.update();
	}

	onKeyDown(event) {
		console.log('keyDown', event);
		switch(event.keycode) {
			case Phaser.Keyboard.SPACE:
				this.game.rooms.shouldUpdate = true;
		}
	}

	onKeyUp(event) {
		console.log('keyUp', event);
	}

	onKeyPress(event) {
		console.log('keyPress', event);
	}

}