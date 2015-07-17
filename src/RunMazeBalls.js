import Level from './Level';
import MazeBalls from './MazeBalls';

const layout = 
`
****************************************************
*                                             *    *
*                                             *    *
*                     ****************        *    *
*                     *              *             *
******    ******                     *             *
*              *                     *        *    *
*              *      *              *        *    *
*              *      *   ************        *    *
*              *      *                       *    *
*                     *                       *    *
*                     *                       *    *
*    ***********      *                       *    *
*              *      ******************      *    *
*              *                                   *
*              *                                   *
*              *                                   *
*              *                                   *
*    ******    *                                   *
*              *      ********    *************    *
*              *      *                       *    *
*              *      *                       *    *
*                     *                       *    *
****************************************************
`;

export default class RunMazeBalls {
	create() {
		this.game.gfx = this.game.add.graphics(0, 0);
		this.game.level = new Level({
			game: this.game,
			layout: layout
		});

		this.game.mazeBalls = new MazeBalls({
			game: this.game,
			numBalls: 60
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
		this.game.level.render();
		this.game.mazeBalls.render();
	}

	update() {
		this.game.level.update();
		this.game.mazeBalls.update();
	}

	onKeyDown(event) {
		console.log('keyDown', event);
		switch(event.keycode) {
			case Phaser.Keyboard.SPACE:
		}
	}

	onKeyUp(event) {
		console.log('keyUp', event);
	}

	onKeyPress(event) {
		console.log('keyPress', event);
	}
}