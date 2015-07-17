(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Boot = (function () {
	function Boot() {
		_classCallCheck(this, Boot);
	}

	_createClass(Boot, [{
		key: 'preload',
		value: function preload() {}
	}, {
		key: 'create',
		value: function create() {
			console.log('boot');
			this.game.state.start('preload');
		}
	}]);

	return Boot;
})();

exports['default'] = Boot;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function scaleColor(color, amount) {
	return color.map(function (n1) {
		var n2 = n1 * amount;
		if (amount < 1 && n2 > n1 || n2 < 0) {
			n2 = 0;
		} else if (amount > 1 && n2 < n1 || n2 > 255) {
			n2 = 255;
		}

		return n2;
	});
}

function colorToHex(color) {
	return color[0] << 16 | color[1] << 8 | color[2];
}

var Cells = (function () {
	function Cells() {
		var options = arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Cells);

		this.cells = [];
		this.repulsions = [];
		this.game = options.game;
		this.numCells = options.numCells || 50;
		this.baseColor = options.baseColor || [200, 100, 100];
		this.repulseColor = options.repulseColor || this.baseColor;
		this.minRadius = options.minRadius || 10;
		this.maxRadius = options.maxRadius || 60;

		for (var i = 0; i < this.numCells; i++) {
			this.makeCell(Math.randomInt(this.game.width), Math.randomInt(this.game.height), Math.randomInt(this.minRadius, this.maxRadius));
		}
	}

	_createClass(Cells, [{
		key: 'makeCell',
		value: function makeCell(x, y, radius) {
			var scale = Math.normalize(radius, this.minRadius, this.maxRadius);
			// const color = this.baseColor;
			var color = scaleColor(this.baseColor, 1 - scale * 0.7);

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
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var ctx = this.game.screen.ctx;
			this.repulsions.forEach(function (repulsion) {
				var _repulsion = _slicedToArray(repulsion, 2);

				var c1 = _repulsion[0];
				var c2 = _repulsion[1];

				var d = Math.distance(c1.x, c1.y, c2.x, c2.y);
				var color = scaleColor(_this.repulseColor, 0.4 + 1 / (d / 10));
				ctx.strokeStyle = '#' + colorToHex(color).toString(16);
				ctx.beginPath();
				ctx.moveTo(c1.x, c1.y);
				ctx.lineTo(c2.x, c2.y);
				ctx.stroke();
				ctx.closePath();
			});

			this.cells.forEach(function (cell) {
				var speed = Math.abs(cell.vx) + Math.abs(cell.vy);
				if (speed == 0) {
					speed = 1;
				}
				var color = '#' + colorToHex(scaleColor(cell.color, 1 + speed * 0.3)).toString(16);
				ctx.strokeStyle = 0;
				_this.game.screen.circle(cell.x, cell.y, cell.radius, color);
			});
		}
	}, {
		key: 'update',
		value: function update() {
			this.applySeparationBehavior();
			this.updatePositions();
		}
	}, {
		key: 'applySeparationBehavior',
		value: function applySeparationBehavior() {
			this.repulsions.length = 0;

			for (var i = 0; i < this.cells.length; i++) {
				var c1 = this.cells[i];
				for (var j = i + 1; j < this.cells.length; j++) {
					var c2 = this.cells[j];

					var dr = Math.abs(c1.radius - c2.radius);
					var dist = Math.distance(c1.x, c1.y, c2.x, c2.y);
					var threshold = (c1.radius + c2.radius) * 4;
					var thresholdCrossed = dist < threshold;

					if (!thresholdCrossed) {
						continue;
					}

					var angle = Math.atan2(c1.x - c2.x, c1.y - c2.y);
					var coefficient = thresholdCrossed ? 1 : 1;

					if (thresholdCrossed) {
						this.repulsions.push([c1, c2]);
					}

					var dc = coefficient * dr * 0.0002;

					var dx1 = Math.cos(angle) * dc * (c2.radius / 2);
					var dy1 = Math.sin(angle) * dc * (c2.radius / 2);

					var dx2 = Math.cos(Math.PI + angle) * dc * (c1.radius / 2);
					var dy2 = Math.sin(Math.PI + angle) * dc * (c1.radius / 2);

					c1.vx += dx1;
					c1.vy += dy1;
					c2.vx -= dx2;
					c2.vy -= dy2;
				}
			}
		}
	}, {
		key: 'updatePositions',
		value: function updatePositions() {
			for (var i = 0; i < this.cells.length; i++) {
				var c = this.cells[i];

				c.x += c.vx;
				c.y += c.vy;

				if (c.x < 0) {
					c.x = 0;
					c.vx *= -1;
				} else if (c.x > this.game.width) {
					c.x = this.game.width;
					c.vx *= -1;
				}

				if (c.y < 0) {
					c.y = 0;
					c.vy *= -1;
				} else if (c.y > this.game.height) {
					c.y = this.game.height;
					c.vy *= -1;
				}
			}
		}
	}]);

	return Cells;
})();

exports['default'] = Cells;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Intro = (function () {
	function Intro() {
		_classCallCheck(this, Intro);
	}

	_createClass(Intro, [{
		key: "preload",
		value: function preload() {}
	}, {
		key: "create",
		value: function create() {
			console.log("intro");
			var style = { font: "32px monospace", fill: "#fff" };
			this.game.add.text(230, 200, "Phaser ES6", style);
			this.game.state.start("run-maze-balls");
		}
	}]);

	return Intro;
})();

exports["default"] = Intro;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Level = (function () {
	function Level(options) {
		_classCallCheck(this, Level);

		this.game = options.game;
		this.layout = options.layout;
		this.grid = this.layout.trim().split('\n').map(function (s) {
			return Array.prototype.slice.call(s);
		});
		this.width = this.grid[0].length;
		this.height = this.grid.length;
	}

	_createClass(Level, [{
		key: 'getCell',
		value: function getCell(x, y) {
			var row = this.grid[Math.floor(y)];
			if (!row) {
				return undefined;
			}
			return row[Math.floor(x)];
		}
	}, {
		key: 'render',
		value: function render() {
			var gfx = this.game.gfx;
			var scaleX = this.game.width / this.grid[0].length;
			var scaleY = this.game.height / this.grid.length;

			this.grid.forEach(function (row, y) {
				row.forEach(function (cell, x) {
					if (cell === '*') {
						var fill = 10040115;
						gfx.lineStyle(null);
						gfx.beginFill(11154227);
						gfx.drawRect(x * scaleX, y * scaleY, 1 * scaleX, 1 * scaleY);
						gfx.endFill();
					}
				});
			});
		}
	}, {
		key: 'update',
		value: function update() {}
	}]);

	return Level;
})();

exports['default'] = Level;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Boot = require('./Boot');

var _Boot2 = _interopRequireDefault(_Boot);

var _Preload = require('./Preload');

var _Preload2 = _interopRequireDefault(_Preload);

var _Intro = require('./Intro');

var _Intro2 = _interopRequireDefault(_Intro);

var _RunCells = require('./RunCells');

var _RunCells2 = _interopRequireDefault(_RunCells);

var _RunRooms = require('./RunRooms');

var _RunRooms2 = _interopRequireDefault(_RunRooms);

var _RunMazeBalls = require('./RunMazeBalls');

var _RunMazeBalls2 = _interopRequireDefault(_RunMazeBalls);

var game = new Phaser.Game(950, 600, Phaser.AUTO);

game.state.add('boot', _Boot2['default']);
game.state.add('preload', _Preload2['default']);
game.state.add('intro', _Intro2['default']);
game.state.add('run-cells', _RunCells2['default']);
game.state.add('run-rooms', _RunRooms2['default']);
game.state.add('run-maze-balls', _RunMazeBalls2['default']);
game.state.start('boot');

},{"./Boot":1,"./Intro":3,"./Preload":8,"./RunCells":10,"./RunMazeBalls":11,"./RunRooms":12}],6:[function(require,module,exports){
"use strict";

Math.randomInt = function (min) {
	var max = arguments[1] === undefined ? null : arguments[1];

	if (max == null) {
		max = min;min = 0;
	}
	return Math.floor(Math.random() * (max - min) + min);
};

Math.distance = function (x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

Math.normalize = function (val, min, max) {
	return (val - min) / (max - min);
};

Math.compare = function (a, b) {
	return a < b ? -1 : b < a ? 1 : 0;
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MazeBalls = (function () {
	function MazeBalls(options) {
		_classCallCheck(this, MazeBalls);

		this.game = options.game;
		this.numBalls = options.numBalls || 10;
		this.balls = [];

		for (var i = 0; i < this.numBalls; i++) {
			this.spawn();
		}

		console.log(this.balls);
	}

	_createClass(MazeBalls, [{
		key: 'spawn',
		value: function spawn() {
			var level = this.game.level;
			for (;;) {
				var x = Math.randomInt(0, level.width);
				var y = Math.randomInt(0, level.height);
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
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var gfx = this.game.gfx;
			var scaleX = this.game.width / this.game.level.width;
			var scaleY = this.game.height / this.game.level.height;

			var rect = function rect(x, y, w, h) {
				gfx.lineStyle(1, 16777215, 1);
				gfx.beginFill(3355545);
				gfx.drawRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);
				gfx.endFill();
			};

			this.balls.forEach(function (ball) {
				var x = ball.x;
				var y = ball.y;
				var r = ball.radius;

				gfx.lineStyle(1, 16777215, 1);
				gfx.beginFill(3381555);
				gfx.drawEllipse(x * scaleX, y * scaleY, r * scaleX, r * scaleY);
				_this.game.gfx.endFill();

				// rect(x, y, r, r);
				// rect(x, y-r, r, r);
				// rect(x-r, y, r, r);
				// rect(x-r, y-r, r, r);
			});
		}
	}, {
		key: 'update',
		value: function update() {
			var speed = 0.2;
			var level = this.game.level;

			this.balls.forEach(function (ball) {
				var x = ball.x;
				var y = ball.y;
				var r = ball.radius;

				var collides = function collides(x, y) {
					return level.getCell(x, y) == '*';
				};

				ball.x += ball.vx * speed;
				ball.y += ball.vy * speed;

				// check sides

				if (collides(x + r, y - r / 2) || collides(x + r, y + r / 2)) {
					ball.vx *= -1;
					ball.x = Math.floor(x) + r - 0.001;
				} else if (collides(x - r, y - r / 2) || collides(x - r, y + r / 2)) {
					ball.vx *= -1;
					ball.x = Math.floor(x) + r + 0.001;
				}

				if (collides(x - r / 2, y + r) || collides(x + r / 2, y + r)) {
					ball.vy *= -1;
					ball.y = Math.floor(y) + r - 0.001;
				} else if (collides(x - r / 2, y - r) || collides(x + r / 2, y - r)) {
					ball.vy *= -1;
					ball.y = Math.floor(y) + r + 0.001;
				}
			});
		}
	}]);

	return MazeBalls;
})();

exports['default'] = MazeBalls;
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Preload = (function () {
	function Preload() {
		_classCallCheck(this, Preload);
	}

	_createClass(Preload, [{
		key: 'preload',
		value: function preload() {}
	}, {
		key: 'create',
		value: function create() {
			console.log('preload');
			this.game.state.start('intro');
		}
	}]);

	return Preload;
})();

exports['default'] = Preload;
module.exports = exports['default'];

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function inRange(x, min, max) {
	return x >= min && x <= max;
}

function collides(a, b) {
	var ax1 = a.x - a.width / 2;
	var ax2 = a.x + a.width / 2;
	var ay1 = a.y - a.height / 2;
	var ay2 = a.y + a.height / 2;

	var bx1 = b.x - b.width / 2;
	var bx2 = b.x + b.width / 2;
	var by1 = b.y - b.height / 2;
	var by2 = b.y + b.height / 2;

	var xOverlap = inRange(ax1, bx1, bx2) || inRange(bx1, ax1, ax2);
	var yOverlap = inRange(ay1, by1, by2) || inRange(by1, ay1, ay2);
	return xOverlap && yOverlap;
}

function touching(a, b) {
	var xgoal = a.width / 2 + b.width / 2;
	var ygoal = a.height / 2 + b.height / 2;
	var xdist = Math.abs(a.x - b.x);
	var ydist = Math.abs(a.y - b.y);

	return xdist == xgoal - 1 && ydist >= ygoal || ydist == ygoal - 1 && xdist >= xgoal;
}

var Rooms = (function () {
	function Rooms() {
		var options = arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Rooms);

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

		for (var i = 0; i < this.numRooms; i++) {
			this.makeRoom();
		}
	}

	_createClass(Rooms, [{
		key: "makeRoom",
		value: function makeRoom() {
			var id = this.rooms.length;
			var width = Math.randomInt(this.minWidth, this.maxWidth) * 2;
			var height = Math.randomInt(this.minHeight, this.maxHeight) * 2;
			var xmin = Math.ceil(width / 2);
			var xmax = Math.ceil(this.radius - width / 2);
			var ymin = Math.ceil(height / 2);
			var ymax = Math.ceil(this.radius - height / 2);

			var offset = Math.floor(this.size / 2 - this.radius / 2);

			this.rooms.push({
				id: id,
				x: offset + Math.randomInt(xmin, xmax),
				y: offset + Math.randomInt(ymin, ymax),
				width: width,
				height: height,
				locked: false
			});
		}
	}, {
		key: "renderRoom",
		value: function renderRoom(room) {
			var xscale = this.xscale;
			var yscale = this.yscale;
			var gfx = this.game.gfx;
			var w = room.width;
			var h = room.height;
			var fill = room.locked ? 6736998 : 13395558;
			gfx.lineStyle(fill);
			gfx.beginFill(fill);
			gfx.drawRect((room.x - w / 2) * xscale, (room.y - h / 2) * yscale, w * xscale, h * yscale);
			gfx.endFill();
		}
	}, {
		key: "render",
		value: function render() {
			var _this = this;

			this.xscale = this.game.width / this.size;
			this.yscale = this.game.height / this.size;

			this.rooms.filter(function (room) {
				return !room.locked;
			}).forEach(function (room) {
				return _this.renderRoom(room);
			});

			this.rooms.filter(function (room) {
				return room.locked;
			}).forEach(function (room) {
				return _this.renderRoom(room);
			});
		}
	}, {
		key: "clearGrid",
		value: function clearGrid() {
			for (var i = 0; i < this.grid.length; i++) {
				this.grid[i] = true;
			}
		}
	}, {
		key: "setGridCell",
		value: function setGridCell(x, y, z) {
			this.grid[y * this.size + x] = z;
		}
	}, {
		key: "getGridCell",
		value: function getGridCell(x, y) {
			return this.grid[y * this.size + x];
		}
	}, {
		key: "fillGrid",
		value: function fillGrid() {
			var exclude = arguments[0] === undefined ? -1 : arguments[0];

			this.clearGrid();
			for (var i = 0; i < this.rooms.length; i++) {
				if (exclude == i) {
					continue;
				}
				var room = this.rooms[i];
				for (var x = -room.width / 2; x < room.width / 2; x++) {
					for (var y = -room.height / 2; y < room.height / 2; y++) {
						this.setGridCell(room.x + x, room.y + y, false);
					}
				}
			}
		}
	}, {
		key: "sampleGrid",
		value: function sampleGrid(room) {
			var sample = [];
			for (var x = -room.width / 2 - 1; x < room.width / 2 + 1; x++) {
				for (var y = -room.height / 2 - 1; y < room.height / 2 + 1; y++) {
					sample.push(this.grid[(room.y + y) * this.size + room.x + x]);
				}
			}
			return sample;
		}
	}, {
		key: "separate1",
		value: function separate1(room) {
			var _this2 = this;

			var isColliding = function isColliding() {
				var sample = _this2.sampleGrid(room);
				for (var i = 0; i < sample.length; i++) {
					if (!sample[i]) {
						return true;
					}
				}
				return false;
			};

			var center = this.size / 2;
			var xdir = room.x < center ? 1 : -1;
			var ydir = room.y < center ? 1 : -1;

			this.fillGrid(room.id);

			var moveX = Math.random() >= 0.5;

			while (isColliding()) {
				if (moveX) {
					room.x += xdir;
				} else {
					room.y += ydir;
				}
			}
		}
	}, {
		key: "separate",
		value: function separate() {
			for (var i = 0; i < this.rooms.length; i++) {
				var room = this.rooms[i];
				if (room.locked) {
					continue;
				} else {
					this.separate1(room);
					room.locked = true;
					return;
				}
			}
		}
	}, {
		key: "update",
		value: function update() {
			if (!this.shouldUpdate) {
				return;
			}
			this.shouldUpdate = false;
			this.separate();
		}
	}]);

	return Rooms;
})();

exports["default"] = Rooms;
module.exports = exports["default"];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Cells = require('./Cells');

var _Cells2 = _interopRequireDefault(_Cells);

require('./Math');

var RunCells = (function () {
	function RunCells() {
		_classCallCheck(this, RunCells);
	}

	_createClass(RunCells, [{
		key: 'create',
		value: function create() {
			// this.game.gfx = this.game.add.graphics(0, 0);
			this.game.screen = this.game.add.bitmapData(this.game.width, this.game.height);
			this.game.add.sprite(0, 0, this.game.screen);
			this.game.cells = new _Cells2['default']({
				game: this.game,
				numCells: 200,
				minRadius: 2,
				maxRadius: 4,
				baseColor: [180, 30, 30],
				repulseColor: [160, 160, 255]
			});
		}
	}, {
		key: 'render',
		value: function render() {
			// this.game.gfx.clear();
			this.game.screen.clear();
			this.game.cells.render();
			this.game.screen.render();
		}
	}, {
		key: 'update',
		value: function update() {
			this.game.cells.update();
		}
	}]);

	return RunCells;
})();

exports['default'] = RunCells;
module.exports = exports['default'];

},{"./Cells":2,"./Math":6}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Level = require('./Level');

var _Level2 = _interopRequireDefault(_Level);

var _MazeBalls = require('./MazeBalls');

var _MazeBalls2 = _interopRequireDefault(_MazeBalls);

var layout = '\n****************************************************\n*                                             *    *\n*                                             *    *\n*                     ****************        *    *\n*                     *              *             *\n******    ******                     *             *\n*              *                     *        *    *\n*              *      *              *        *    *\n*              *      *   ************        *    *\n*              *      *                       *    *\n*                     *                       *    *\n*                     *                       *    *\n*    ***********      *                       *    *\n*              *      ******************      *    *\n*              *                                   *\n*              *                                   *\n*              *                                   *\n*              *                                   *\n*    ******    *                                   *\n*              *      ********    *************    *\n*              *      *                       *    *\n*              *      *                       *    *\n*                     *                       *    *\n****************************************************\n';

var RunMazeBalls = (function () {
	function RunMazeBalls() {
		_classCallCheck(this, RunMazeBalls);
	}

	_createClass(RunMazeBalls, [{
		key: 'create',
		value: function create() {
			this.game.gfx = this.game.add.graphics(0, 0);
			this.game.level = new _Level2['default']({
				game: this.game,
				layout: layout
			});

			this.game.mazeBalls = new _MazeBalls2['default']({
				game: this.game,
				numBalls: 60
			});

			this.game.input.keyboard.addCallbacks(this, this.onKeyDown, this.onKeyUp, this.onKeyPress);
		}
	}, {
		key: 'render',
		value: function render() {
			this.game.gfx.clear();
			this.game.level.render();
			this.game.mazeBalls.render();
		}
	}, {
		key: 'update',
		value: function update() {
			this.game.level.update();
			this.game.mazeBalls.update();
		}
	}, {
		key: 'onKeyDown',
		value: function onKeyDown(event) {
			console.log('keyDown', event);
			switch (event.keycode) {
				case Phaser.Keyboard.SPACE:
			}
		}
	}, {
		key: 'onKeyUp',
		value: function onKeyUp(event) {
			console.log('keyUp', event);
		}
	}, {
		key: 'onKeyPress',
		value: function onKeyPress(event) {
			console.log('keyPress', event);
		}
	}]);

	return RunMazeBalls;
})();

exports['default'] = RunMazeBalls;
module.exports = exports['default'];

},{"./Level":4,"./MazeBalls":7}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Rooms = require('./Rooms');

var _Rooms2 = _interopRequireDefault(_Rooms);

var RunRooms = (function () {
	function RunRooms() {
		_classCallCheck(this, RunRooms);
	}

	_createClass(RunRooms, [{
		key: 'create',
		value: function create() {
			this.game.gfx = this.game.add.graphics(0, 0);
			this.game.rooms = new _Rooms2['default']({
				game: this.game,
				numRooms: 50,
				minWidth: 2,
				maxWidth: 8,
				minHeight: 2,
				maxHeight: 8
			});

			this.game.input.keyboard.addCallbacks(this, this.onKeyDown, this.onKeyUp, this.onKeyPress);
		}
	}, {
		key: 'render',
		value: function render() {
			this.game.gfx.clear();
			this.game.rooms.render();
		}
	}, {
		key: 'update',
		value: function update() {
			this.game.rooms.update();
		}
	}, {
		key: 'onKeyDown',
		value: function onKeyDown(event) {
			console.log('keyDown', event);
			switch (event.keycode) {
				case Phaser.Keyboard.SPACE:
					this.game.rooms.shouldUpdate = true;
			}
		}
	}, {
		key: 'onKeyUp',
		value: function onKeyUp(event) {
			console.log('keyUp', event);
		}
	}, {
		key: 'onKeyPress',
		value: function onKeyPress(event) {
			console.log('keyPress', event);
		}
	}]);

	return RunRooms;
})();

exports['default'] = RunRooms;
module.exports = exports['default'];

},{"./Rooms":9}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5keS9Qcm9qZWN0cy9tb21lbnRpYS9zcmMvQm9vdC5qcyIsIi9Vc2Vycy9hbmR5L1Byb2plY3RzL21vbWVudGlhL3NyYy9DZWxscy5qcyIsIi9Vc2Vycy9hbmR5L1Byb2plY3RzL21vbWVudGlhL3NyYy9JbnRyby5qcyIsIi9Vc2Vycy9hbmR5L1Byb2plY3RzL21vbWVudGlhL3NyYy9MZXZlbC5qcyIsIi9Vc2Vycy9hbmR5L1Byb2plY3RzL21vbWVudGlhL3NyYy9NYWluLmpzIiwiL1VzZXJzL2FuZHkvUHJvamVjdHMvbW9tZW50aWEvc3JjL01hdGguanMiLCIvVXNlcnMvYW5keS9Qcm9qZWN0cy9tb21lbnRpYS9zcmMvTWF6ZUJhbGxzLmpzIiwiL1VzZXJzL2FuZHkvUHJvamVjdHMvbW9tZW50aWEvc3JjL1ByZWxvYWQuanMiLCIvVXNlcnMvYW5keS9Qcm9qZWN0cy9tb21lbnRpYS9zcmMvUm9vbXMuanMiLCIvVXNlcnMvYW5keS9Qcm9qZWN0cy9tb21lbnRpYS9zcmMvUnVuQ2VsbHMuanMiLCIvVXNlcnMvYW5keS9Qcm9qZWN0cy9tb21lbnRpYS9zcmMvUnVuTWF6ZUJhbGxzLmpzIiwiL1VzZXJzL2FuZHkvUHJvamVjdHMvbW9tZW50aWEvc3JjL1J1blJvb21zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQixJQUFJO1VBQUosSUFBSTt3QkFBSixJQUFJOzs7Y0FBSixJQUFJOztTQUNqQixtQkFBRyxFQUNUOzs7U0FFSyxrQkFBRztBQUNSLFVBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEIsT0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ2pDOzs7UUFQbUIsSUFBSTs7O3FCQUFKLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBekIsU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNsQyxRQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFFLEVBQUs7QUFDeEIsTUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztBQUNyQixNQUFJLEFBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDdEMsS0FBRSxHQUFHLENBQUMsQ0FBQztHQUNQLE1BQ0ksSUFBSSxBQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSyxFQUFFLEdBQUcsR0FBRyxFQUFFO0FBQzdDLEtBQUUsR0FBRyxHQUFHLENBQUM7R0FDVDs7QUFFRCxTQUFPLEVBQUUsQ0FBQztFQUNWLENBQUMsQ0FBQztDQUNIOztBQUVELFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRTtBQUMxQixRQUFPLEFBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxBQUFDLEdBQ2QsS0FBSyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUM7Q0FDbEI7O0lBRW9CLEtBQUs7QUFDZCxVQURTLEtBQUssR0FDQztNQUFkLE9BQU8sZ0NBQUcsRUFBRTs7d0JBREosS0FBSzs7QUFFeEIsTUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsTUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsTUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3pCLE1BQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7QUFDdkMsTUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0RCxNQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUMzRCxNQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO0FBQ3pDLE1BQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7O0FBRXpDLE9BQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLE9BQUksQ0FBQyxRQUFRLENBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQzlDLENBQUM7R0FDRjtFQUVEOztjQW5CbUIsS0FBSzs7U0FxQmpCLGtCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFO0FBQ3RCLE9BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVyRSxPQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDLEdBQUUsS0FBSyxHQUFHLEdBQUcsQUFBQyxDQUFFLENBQUM7O0FBRTVELE9BQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2YsTUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtBQUNyQixLQUFDLEVBQUUsQ0FBQztBQUNKLEtBQUMsRUFBRSxDQUFDO0FBQ0osTUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDakIsTUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDakIsVUFBTSxFQUFFLE1BQU07QUFDZCxTQUFLLEVBQUUsS0FBSztJQUNaLENBQUMsQ0FBQztHQUNIOzs7U0FFSyxrQkFBRzs7O0FBQ1IsT0FBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2pDLE9BQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsU0FBUyxFQUFLO29DQUNyQixTQUFTOztRQUFuQixFQUFFO1FBQUUsRUFBRTs7QUFDYixRQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBSyxZQUFZLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBRSxDQUFDLEdBQUMsRUFBRSxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzVELE9BQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkQsT0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLE9BQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsT0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixPQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDYixPQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEIsQ0FBQyxDQUFBOztBQUVGLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQzVCLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xELFFBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtBQUFFLFVBQUssR0FBRyxDQUFDLENBQUM7S0FBRTtBQUM5QixRQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckYsT0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsVUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUM7R0FFSDs7O1NBRUssa0JBQUc7QUFDUixPQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztBQUMvQixPQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7R0FDdkI7OztTQUVzQixtQ0FBRztBQUN6QixPQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRTNCLFFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxRQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFNBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekMsU0FBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFekIsU0FBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxTQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxTQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUM5QyxTQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRTFDLFNBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUN0QixlQUFTO01BQ1Q7O0FBRUQsU0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsU0FBTSxXQUFXLEdBQUcsZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFN0MsU0FBSSxnQkFBZ0IsRUFBRTtBQUNyQixVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQy9COztBQUVELFNBQU0sRUFBRSxHQUFHLFdBQVcsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDOztBQUVyQyxTQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDakQsU0FBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDOztBQUVqRCxTQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUMzRCxTQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQzs7QUFFM0QsT0FBRSxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUM7QUFDYixPQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQztBQUNiLE9BQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDO0FBQ2IsT0FBRSxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUM7S0FDYjtJQUNEO0dBRUQ7OztTQUVjLDJCQUFHO0FBQ2pCLFFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxRQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4QixLQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDWixLQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FBRVosUUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNaLE1BQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1IsTUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNYLE1BRUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQy9CLE1BQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNYOztBQUVELFFBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDWixNQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNSLE1BQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDWCxNQUVJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNoQyxNQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3ZCLE1BQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDWDtJQUNEO0dBRUQ7OztRQXZJbUIsS0FBSzs7O3FCQUFMLEtBQUs7Ozs7Ozs7Ozs7Ozs7O0lDcEJMLEtBQUs7VUFBTCxLQUFLO3dCQUFMLEtBQUs7OztjQUFMLEtBQUs7O1NBQ2xCLG1CQUFHLEVBQ1Q7OztTQUVLLGtCQUFHO0FBQ1IsVUFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQixPQUFJLEtBQUssR0FBRyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7QUFDcEQsT0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xELE9BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0dBQ3hDOzs7UUFUbUIsS0FBSzs7O3FCQUFMLEtBQUs7Ozs7Ozs7Ozs7Ozs7O0lDQUwsS0FBSztBQUNkLFVBRFMsS0FBSyxDQUNiLE9BQU8sRUFBRTt3QkFERCxLQUFLOztBQUV4QixNQUFJLENBQUMsSUFBSSxHQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDM0IsTUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FDckIsSUFBSSxFQUFFLENBQ04sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUNYLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBSztBQUFDLFVBQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQUMsQ0FBQyxDQUFDO0FBQ3JELE1BQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDakMsTUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztFQUMvQjs7Y0FWbUIsS0FBSzs7U0FZbEIsaUJBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNiLE9BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLE9BQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxXQUFPLFNBQVMsQ0FBQTtJQUFFO0FBQzlCLFVBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUMxQjs7O1NBRUssa0JBQUc7QUFDUixPQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUMxQixPQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNuRCxPQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFakQsT0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFLO0FBQzdCLE9BQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFLO0FBQ3hCLFNBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtBQUNqQixVQUFNLElBQUksR0FBRyxRQUFRLENBQUM7QUFDdEIsU0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixTQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hCLFNBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQzdELFNBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztNQUNkO0tBQ0QsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxDQUFBO0dBRUY7OztTQUVLLGtCQUFHLEVBQ1I7OztRQXRDbUIsS0FBSzs7O3FCQUFMLEtBQUs7Ozs7Ozs7O29CQ0VULFFBQVE7Ozs7dUJBQ0wsV0FBVzs7OztxQkFDYixTQUFTOzs7O3dCQUNOLFlBQVk7Ozs7d0JBQ1osWUFBWTs7Ozs0QkFDUixnQkFBZ0I7Ozs7QUFQekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQVNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLG9CQUFPLENBQUM7QUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyx1QkFBVSxDQUFDO0FBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8scUJBQVEsQ0FBQztBQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLHdCQUFXLENBQUM7QUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyx3QkFBVyxDQUFDO0FBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQiw0QkFBZSxDQUFDO0FBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7OztBQ2Z6QixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQUMsR0FBRyxFQUFpQjtLQUFmLEdBQUcsZ0NBQUcsSUFBSTs7QUFDaEMsS0FBSSxHQUFHLElBQUksSUFBSSxFQUFFO0FBQUUsS0FBRyxHQUFHLEdBQUcsQ0FBQyxBQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7RUFBQztBQUN2QyxRQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUEsQUFBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0NBQ3JELENBQUE7O0FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNuQyxRQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ3pDLENBQUE7O0FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFLO0FBQ25DLFFBQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBLElBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQSxBQUFDLENBQUM7Q0FDakMsQ0FBQTs7QUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUN4QixRQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ2xDLENBQUE7Ozs7Ozs7Ozs7Ozs7SUNmb0IsU0FBUztBQUVsQixVQUZTLFNBQVMsQ0FFakIsT0FBTyxFQUFFO3dCQUZELFNBQVM7O0FBRzVCLE1BQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN6QixNQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBQ3ZDLE1BQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVoQixPQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuQyxPQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDYjs7QUFFRCxTQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN4Qjs7Y0FabUIsU0FBUzs7U0FjeEIsaUJBQUc7QUFDUCxPQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUM5QixZQUFRO0FBQ1AsUUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pDLFFBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxRQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtBQUMvQixTQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUNmLFFBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07QUFDckIsT0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHO0FBQ1YsT0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHO0FBQ1YsUUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDakIsUUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDakIsWUFBTSxFQUFFLEdBQUc7TUFDWCxDQUFDLENBQUM7QUFDSCxZQUFPO0tBQ1A7SUFDRDtHQUNEOzs7U0FFSyxrQkFBRzs7O0FBQ1IsT0FBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDMUIsT0FBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3JELE9BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7QUFFdkQsT0FBTSxJQUFJLEdBQUcsU0FBUCxJQUFJLENBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQzVCLE9BQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QixPQUFHLENBQUMsU0FBUyxDQUFDLE9BQVEsQ0FBQyxDQUFDO0FBQ3hCLE9BQUcsQ0FBQyxRQUFRLENBQ1gsQ0FBQyxHQUFHLE1BQU0sRUFDVixDQUFDLEdBQUcsTUFBTSxFQUNWLENBQUMsR0FBRyxNQUFNLEVBQ1YsQ0FBQyxHQUFHLE1BQU0sQ0FDVixDQUFDO0FBQ0YsT0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQTs7QUFFRCxPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUM1QixRQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLFFBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakIsUUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFdEIsT0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLE9BQUcsQ0FBQyxTQUFTLENBQUMsT0FBUSxDQUFDLENBQUM7QUFDeEIsT0FBRyxDQUFDLFdBQVcsQ0FDZCxDQUFDLEdBQUcsTUFBTSxFQUNWLENBQUMsR0FBRyxNQUFNLEVBQ1YsQ0FBQyxHQUFHLE1BQU0sRUFDVixDQUFDLEdBQUcsTUFBTSxDQUNWLENBQUM7QUFDRixVQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7Ozs7OztJQU14QixDQUFDLENBQUM7R0FDSDs7O1NBRUssa0JBQUc7QUFDUixPQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDbEIsT0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7O0FBRTlCLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQzVCLFFBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakIsUUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqQixRQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUV0QixRQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQzFCLFlBQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0tBQ2xDLENBQUE7O0FBRUQsUUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztBQUMxQixRQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDOzs7O0FBSTFCLFFBQUksUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsSUFDdkIsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsRUFBRTtBQUMxQixTQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2QsU0FBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDbkMsTUFFSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQ3pCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDakMsU0FBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNkLFNBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ25DOztBQUVELFFBQUksUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFDekIsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUM1QixTQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2QsU0FBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDbkMsTUFFSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQ3pCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDbEMsU0FBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNkLFNBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ25DO0lBQ0QsQ0FBQyxDQUFBO0dBQ0Y7OztRQWxIbUIsU0FBUzs7O3FCQUFULFNBQVM7Ozs7Ozs7Ozs7Ozs7O0lDQVQsT0FBTztVQUFQLE9BQU87d0JBQVAsT0FBTzs7O2NBQVAsT0FBTzs7U0FDcEIsbUJBQUcsRUFFVDs7O1NBRUssa0JBQUc7QUFDUixVQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZCLE9BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUMvQjs7O1FBUm1CLE9BQU87OztxQkFBUCxPQUFPOzs7Ozs7Ozs7Ozs7OztBQ0E1QixTQUFTLE9BQU8sQ0FBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUM5QixRQUFPLEFBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBTSxDQUFDLElBQUksR0FBRyxBQUFDLENBQUM7Q0FDaEM7O0FBRUQsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN2QixLQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDO0FBQzVCLEtBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUM7QUFDNUIsS0FBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQztBQUM3QixLQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDOztBQUU3QixLQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDO0FBQzVCLEtBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUM7QUFDNUIsS0FBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQztBQUM3QixLQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDOztBQUU3QixLQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFDdEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEMsS0FBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQ3RCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLFFBQU8sUUFBUSxJQUFJLFFBQVEsQ0FBQztDQUM1Qjs7QUFFRCxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3ZCLEtBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDO0FBQ3BDLEtBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDO0FBQ3RDLEtBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsS0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFbEMsUUFBTyxBQUFDLEtBQUssSUFBSSxLQUFLLEdBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQ2xDLEtBQUssSUFBSSxLQUFLLEdBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxLQUFLLEFBQUMsQ0FBQztDQUM1Qzs7SUFFb0IsS0FBSztBQUNkLFVBRFMsS0FBSyxHQUNEO01BQVosT0FBTyxnQ0FBQyxFQUFFOzt3QkFERixLQUFLOztBQUV4QixNQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDekIsTUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQztBQUN4QyxNQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDO0FBQ3RDLE1BQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUM7QUFDdEMsTUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztBQUN4QyxNQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO0FBQ3hDLE1BQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRyxNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLE1BQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLE1BQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQzFCLE1BQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2YsTUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUV6QyxPQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuQyxPQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7R0FDaEI7RUFDRDs7Y0FsQm1CLEtBQUs7O1NBb0JqQixvQkFBRztBQUNWLE9BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzdCLE9BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9ELE9BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xFLE9BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLE9BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQyxJQUFJLENBQUMsTUFBTSxHQUFLLEtBQUssR0FBRyxDQUFDLEFBQUMsQ0FBQyxDQUFDO0FBQ3BELE9BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ25DLE9BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQyxJQUFJLENBQUMsTUFBTSxHQUFLLE1BQU0sR0FBRyxDQUFDLEFBQUMsQ0FBQyxDQUFDOztBQUVyRCxPQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZELE9BQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2YsTUFBRSxFQUFFLEVBQUU7QUFDTixLQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztBQUN0QyxLQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztBQUN0QyxTQUFLLEVBQUUsS0FBSztBQUNaLFVBQU0sRUFBRSxNQUFNO0FBQ2QsVUFBTSxFQUFFLEtBQUs7SUFDYixDQUFDLENBQUM7R0FDSDs7O1NBRVMsb0JBQUMsSUFBSSxFQUFFO0FBQ2hCLE9BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsT0FBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixPQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUMxQixPQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3JCLE9BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDdEIsT0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFRLEdBQUcsUUFBUSxDQUFDO0FBQy9DLE1BQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsTUFBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixNQUFHLENBQUMsUUFBUSxDQUNYLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEdBQUksTUFBTSxFQUN2QixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxHQUFJLE1BQU0sRUFDdkIsQ0FBQyxHQUFHLE1BQU0sRUFDVixDQUFDLEdBQUcsTUFBTSxDQUNWLENBQUM7QUFDRixNQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7R0FFZDs7O1NBRUssa0JBQUc7OztBQUNSLE9BQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUMxQyxPQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRTNDLE9BQUksQ0FBQyxLQUFLLENBQ1IsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQUMsV0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7SUFBQyxDQUFDLENBQ3ZDLE9BQU8sQ0FBQyxVQUFDLElBQUk7V0FBSyxNQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFBQSxDQUFDLENBQUM7O0FBRTNDLE9BQUksQ0FBQyxLQUFLLENBQ1IsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQUMsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQUMsQ0FBQyxDQUN0QyxPQUFPLENBQUMsVUFBQyxJQUFJO1dBQUssTUFBSyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQUEsQ0FBQyxDQUFDO0dBQzNDOzs7U0FFUSxxQkFBRztBQUNYLFFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0QyxRQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNwQjtHQUNEOzs7U0FFVSxxQkFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNwQixPQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNqQzs7O1NBRVUscUJBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNqQixVQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDcEM7OztTQUVPLG9CQUFlO09BQWQsT0FBTyxnQ0FBRyxDQUFDLENBQUM7O0FBQ3BCLE9BQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixRQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdkMsUUFBSSxPQUFPLElBQUksQ0FBQyxFQUFFO0FBQUUsY0FBUztLQUFFO0FBQy9CLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsU0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QyxVQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hELFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDaEQ7S0FDRDtJQUNEO0dBQ0Q7OztTQUVTLG9CQUFDLElBQUksRUFBRTtBQUNoQixPQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSyxJQUFJLENBQUMsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xELFNBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNwRCxXQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlEO0lBQ0Q7QUFDRCxVQUFPLE1BQU0sQ0FBQztHQUNkOzs7U0FFUSxtQkFBQyxJQUFJLEVBQUU7OztBQUNmLE9BQU0sV0FBVyxHQUFHLFNBQWQsV0FBVyxHQUFTO0FBQ3pCLFFBQU0sTUFBTSxHQUFHLE9BQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLFNBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLFNBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDZixhQUFPLElBQUksQ0FBQztNQUNaO0tBQ0Q7QUFDRCxXQUFPLEtBQUssQ0FBQztJQUNiLENBQUE7O0FBRUQsT0FBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBQyxDQUFDLENBQUM7QUFDM0IsT0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLE9BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBQzs7QUFFdkMsT0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRXZCLE9BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUE7O0FBRWxDLFVBQU0sV0FBVyxFQUFFLEVBQUU7QUFDcEIsUUFBSSxLQUFLLEVBQUU7QUFDVixTQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQztLQUNmLE1BQU07QUFDTixTQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQztLQUNmO0lBQ0Q7R0FDRDs7O1NBRU8sb0JBQUc7QUFDVixRQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdkMsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixRQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEIsY0FBUztLQUNULE1BQ0k7QUFDSixTQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JCLFNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFlBQU87S0FDUDtJQUNEO0dBQ0Q7OztTQUVLLGtCQUFHO0FBQ1IsT0FBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFBRSxXQUFPO0lBQUU7QUFDbkMsT0FBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDMUIsT0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQ2hCOzs7UUE1Sm1CLEtBQUs7OztxQkFBTCxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7O3FCQ2hDUixTQUFTOzs7O1FBQ3BCLFFBQVE7O0lBRU0sUUFBUTtVQUFSLFFBQVE7d0JBQVIsUUFBUTs7O2NBQVIsUUFBUTs7U0FFdEIsa0JBQUc7O0FBRVIsT0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0UsT0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxPQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyx1QkFBVTtBQUMzQixRQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixZQUFRLEVBQUUsR0FBRztBQUNiLGFBQVMsRUFBRSxDQUFDO0FBQ1osYUFBUyxFQUFFLENBQUM7QUFDWixhQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN4QixnQkFBWSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDN0IsQ0FBQyxDQUFDO0dBRUg7OztTQUVLLGtCQUFHOztBQUVSLE9BQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3pCLE9BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3pCLE9BQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQzFCOzs7U0FFSyxrQkFBRztBQUNSLE9BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ3pCOzs7UUExQm1CLFFBQVE7OztxQkFBUixRQUFROzs7Ozs7Ozs7Ozs7Ozs7O3FCQ0hYLFNBQVM7Ozs7eUJBQ0wsYUFBYTs7OztBQUVuQyxJQUFNLE1BQU0sdXhDQTBCWCxDQUFDOztJQUVtQixZQUFZO1VBQVosWUFBWTt3QkFBWixZQUFZOzs7Y0FBWixZQUFZOztTQUMxQixrQkFBRztBQUNSLE9BQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsT0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsdUJBQVU7QUFDM0IsUUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsVUFBTSxFQUFFLE1BQU07SUFDZCxDQUFDLENBQUM7O0FBRUgsT0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsMkJBQWM7QUFDbkMsUUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsWUFBUSxFQUFFLEVBQUU7SUFDWixDQUFDLENBQUM7O0FBRUgsT0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FDcEMsSUFBSSxFQUNKLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsVUFBVSxDQUNmLENBQUE7R0FFRDs7O1NBRUssa0JBQUc7QUFDUixPQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN0QixPQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN6QixPQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUM3Qjs7O1NBRUssa0JBQUc7QUFDUixPQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN6QixPQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUM3Qjs7O1NBRVEsbUJBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlCLFdBQU8sS0FBSyxDQUFDLE9BQU87QUFDbkIsU0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUMzQjtHQUNEOzs7U0FFTSxpQkFBQyxLQUFLLEVBQUU7QUFDZCxVQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztHQUM1Qjs7O1NBRVMsb0JBQUMsS0FBSyxFQUFFO0FBQ2pCLFVBQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQy9COzs7UUE5Q21CLFlBQVk7OztxQkFBWixZQUFZOzs7Ozs7Ozs7Ozs7Ozs7O3FCQy9CZixTQUFTOzs7O0lBRU4sUUFBUTtVQUFSLFFBQVE7d0JBQVIsUUFBUTs7O2NBQVIsUUFBUTs7U0FFdEIsa0JBQUc7QUFDUixPQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdDLE9BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLHVCQUFVO0FBQzNCLFFBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLFlBQVEsRUFBRSxFQUFFO0FBQ1osWUFBUSxFQUFFLENBQUM7QUFDWCxZQUFRLEVBQUUsQ0FBQztBQUNYLGFBQVMsRUFBRSxDQUFDO0FBQ1osYUFBUyxFQUFFLENBQUM7SUFDWixDQUFDLENBQUM7O0FBRUgsT0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FDcEMsSUFBSSxFQUNKLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsVUFBVSxDQUNmLENBQUE7R0FFRDs7O1NBRUssa0JBQUc7QUFDUixPQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN0QixPQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUN6Qjs7O1NBRUssa0JBQUc7QUFDUixPQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUN6Qjs7O1NBRVEsbUJBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlCLFdBQU8sS0FBSyxDQUFDLE9BQU87QUFDbkIsU0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUs7QUFDekIsU0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUFBLElBQ3JDO0dBQ0Q7OztTQUVNLGlCQUFDLEtBQUssRUFBRTtBQUNkLFVBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzVCOzs7U0FFUyxvQkFBQyxLQUFLLEVBQUU7QUFDakIsVUFBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDL0I7OztRQTdDbUIsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9vdCB7XG5cdHByZWxvYWQoKSB7XG5cdH1cblxuXHRjcmVhdGUoKSB7XG5cdFx0Y29uc29sZS5sb2coJ2Jvb3QnKTtcblx0XHR0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ3ByZWxvYWQnKTtcblx0fVxuXG59IiwiZnVuY3Rpb24gc2NhbGVDb2xvcihjb2xvciwgYW1vdW50KSB7XG5cdHJldHVybiBjb2xvci5tYXAoKG4xKSA9PiB7XG5cdFx0bGV0IG4yID0gbjEgKiBhbW91bnQ7XG5cdFx0aWYgKChhbW91bnQgPCAxICYmIG4yID4gbjEpIHx8IG4yIDwgMCkge1xuXHRcdFx0bjIgPSAwO1xuXHRcdH0gXG5cdFx0ZWxzZSBpZiAoKGFtb3VudCA+IDEgJiYgbjIgPCBuMSkgfHwgbjIgPiAyNTUpIHtcblx0XHRcdG4yID0gMjU1O1xuXHRcdH1cblxuXHRcdHJldHVybiBuMjtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGNvbG9yVG9IZXgoY29sb3IpIHtcblx0cmV0dXJuIChjb2xvclswXSA8PCAxNikgfCBcblx0ICAgICAgIChjb2xvclsxXSA8PCA4KSAgfFxuXHQgICAgICAgKGNvbG9yWzJdKTsgIFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDZWxscyB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdHRoaXMuY2VsbHMgPSBbXTtcblx0XHR0aGlzLnJlcHVsc2lvbnMgPSBbXTtcblx0XHR0aGlzLmdhbWUgPSBvcHRpb25zLmdhbWU7XG5cdFx0dGhpcy5udW1DZWxscyA9IG9wdGlvbnMubnVtQ2VsbHMgfHwgNTA7XG5cdFx0dGhpcy5iYXNlQ29sb3IgPSBvcHRpb25zLmJhc2VDb2xvciB8fCBbMjAwLCAxMDAsIDEwMF07XG5cdFx0dGhpcy5yZXB1bHNlQ29sb3IgPSBvcHRpb25zLnJlcHVsc2VDb2xvciB8fCB0aGlzLmJhc2VDb2xvcjtcblx0XHR0aGlzLm1pblJhZGl1cyA9IG9wdGlvbnMubWluUmFkaXVzIHx8IDEwO1xuXHRcdHRoaXMubWF4UmFkaXVzID0gb3B0aW9ucy5tYXhSYWRpdXMgfHwgNjA7XG5cblx0XHRmb3IgKGxldCBpPTA7IGk8dGhpcy5udW1DZWxsczsgaSsrKSB7XG5cdFx0XHR0aGlzLm1ha2VDZWxsKFxuXHRcdFx0XHRNYXRoLnJhbmRvbUludCh0aGlzLmdhbWUud2lkdGgpLFxuXHRcdFx0XHRNYXRoLnJhbmRvbUludCh0aGlzLmdhbWUuaGVpZ2h0KSxcblx0XHRcdFx0TWF0aC5yYW5kb21JbnQodGhpcy5taW5SYWRpdXMsIHRoaXMubWF4UmFkaXVzKVxuXHRcdFx0KTtcblx0XHR9XG5cblx0fVx0XG5cblx0bWFrZUNlbGwoeCwgeSwgcmFkaXVzKSB7XG5cdFx0Y29uc3Qgc2NhbGUgPSBNYXRoLm5vcm1hbGl6ZShyYWRpdXMsIHRoaXMubWluUmFkaXVzLCB0aGlzLm1heFJhZGl1cyk7XG5cdFx0Ly8gY29uc3QgY29sb3IgPSB0aGlzLmJhc2VDb2xvcjtcblx0XHRjb25zdCBjb2xvciA9IHNjYWxlQ29sb3IodGhpcy5iYXNlQ29sb3IsICgxLShzY2FsZSAqIDAuNykpKTtcblxuXHRcdHRoaXMuY2VsbHMucHVzaCh7XG5cdFx0XHRpZDogdGhpcy5jZWxscy5sZW5ndGgsXG5cdFx0XHR4OiB4LFxuXHRcdFx0eTogeSxcblx0XHRcdHZ4OiBNYXRoLnJhbmRvbSgpLFxuXHRcdFx0dnk6IE1hdGgucmFuZG9tKCksXG5cdFx0XHRyYWRpdXM6IHJhZGl1cyxcblx0XHRcdGNvbG9yOiBjb2xvclxuXHRcdH0pO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IGN0eCA9IHRoaXMuZ2FtZS5zY3JlZW4uY3R4O1xuXHRcdHRoaXMucmVwdWxzaW9ucy5mb3JFYWNoKChyZXB1bHNpb24pID0+IHtcblx0XHRcdGNvbnN0IFtjMSwgYzJdID0gcmVwdWxzaW9uO1xuXHRcdFx0Y29uc3QgZCA9IE1hdGguZGlzdGFuY2UoYzEueCwgYzEueSwgYzIueCwgYzIueSk7XG5cdFx0XHRjb25zdCBjb2xvciA9IHNjYWxlQ29sb3IodGhpcy5yZXB1bHNlQ29sb3IsIDAuNCArIDEvKGQvMTApKTtcblx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICcjJyArIGNvbG9yVG9IZXgoY29sb3IpLnRvU3RyaW5nKDE2KTtcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oYzEueCwgYzEueSk7XG5cdFx0XHRjdHgubGluZVRvKGMyLngsIGMyLnkpO1xuXHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdH0pXG5cblx0XHR0aGlzLmNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRcdGxldCBzcGVlZCA9IE1hdGguYWJzKGNlbGwudngpICsgTWF0aC5hYnMoY2VsbC52eSk7XG5cdFx0XHRpZiAoc3BlZWQgPT0gMCkgeyBzcGVlZCA9IDE7IH1cblx0XHRcdGNvbnN0IGNvbG9yID0gJyMnICsgY29sb3JUb0hleChzY2FsZUNvbG9yKGNlbGwuY29sb3IsIDEgKyBzcGVlZCAqIDAuMykpLnRvU3RyaW5nKDE2KTtcblx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IDA7XG5cdFx0XHR0aGlzLmdhbWUuc2NyZWVuLmNpcmNsZShjZWxsLngsIGNlbGwueSwgY2VsbC5yYWRpdXMsIGNvbG9yKTtcblx0XHR9KTtcblxuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdHRoaXMuYXBwbHlTZXBhcmF0aW9uQmVoYXZpb3IoKTtcblx0XHR0aGlzLnVwZGF0ZVBvc2l0aW9ucygpO1xuXHR9XG5cblx0YXBwbHlTZXBhcmF0aW9uQmVoYXZpb3IoKSB7XG5cdFx0dGhpcy5yZXB1bHNpb25zLmxlbmd0aCA9IDA7XG5cblx0XHRmb3IgKGxldCBpPTA7IGk8dGhpcy5jZWxscy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgYzEgPSB0aGlzLmNlbGxzW2ldO1xuXHRcdFx0Zm9yIChsZXQgaj1pKzE7IGo8dGhpcy5jZWxscy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRjb25zdCBjMiA9IHRoaXMuY2VsbHNbal07XG5cblx0XHRcdFx0Y29uc3QgZHIgPSBNYXRoLmFicyhjMS5yYWRpdXMgLSBjMi5yYWRpdXMpO1xuXHRcdFx0XHRjb25zdCBkaXN0ID0gTWF0aC5kaXN0YW5jZShjMS54LCBjMS55LCBjMi54LCBjMi55KTtcblx0XHRcdFx0Y29uc3QgdGhyZXNob2xkID0gKGMxLnJhZGl1cyArIGMyLnJhZGl1cykgKiA0O1xuXHRcdFx0XHRjb25zdCB0aHJlc2hvbGRDcm9zc2VkID0gZGlzdCA8IHRocmVzaG9sZDtcblxuXHRcdFx0XHRpZiAoIXRocmVzaG9sZENyb3NzZWQpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMihjMS54IC0gYzIueCwgYzEueSAtIGMyLnkpO1xuXHRcdFx0XHRjb25zdCBjb2VmZmljaWVudCA9IHRocmVzaG9sZENyb3NzZWQgPyAxIDogMTtcblx0XHRcdFxuXHRcdFx0XHRpZiAodGhyZXNob2xkQ3Jvc3NlZCkge1xuXHRcdFx0XHRcdHRoaXMucmVwdWxzaW9ucy5wdXNoKFtjMSwgYzJdKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGRjID0gY29lZmZpY2llbnQgKiBkciAqIDAuMDAwMjtcblxuXHRcdFx0XHRjb25zdCBkeDEgPSBNYXRoLmNvcyhhbmdsZSkgKiBkYyAqIChjMi5yYWRpdXMvMik7XG5cdFx0XHRcdGNvbnN0IGR5MSA9IE1hdGguc2luKGFuZ2xlKSAqIGRjICogKGMyLnJhZGl1cy8yKTtcblxuXHRcdFx0XHRjb25zdCBkeDIgPSBNYXRoLmNvcyhNYXRoLlBJICsgYW5nbGUpICogZGMgKiAoYzEucmFkaXVzLzIpO1xuXHRcdFx0XHRjb25zdCBkeTIgPSBNYXRoLnNpbihNYXRoLlBJICsgYW5nbGUpICogZGMgKiAoYzEucmFkaXVzLzIpO1xuXG5cdFx0XHRcdGMxLnZ4ICs9IGR4MTtcblx0XHRcdFx0YzEudnkgKz0gZHkxO1xuXHRcdFx0XHRjMi52eCAtPSBkeDI7XG5cdFx0XHRcdGMyLnZ5IC09IGR5Mjtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdHVwZGF0ZVBvc2l0aW9ucygpIHtcblx0XHRmb3IgKGxldCBpPTA7IGk8dGhpcy5jZWxscy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgYyA9IHRoaXMuY2VsbHNbaV07XG5cblx0XHRcdGMueCArPSBjLnZ4O1xuXHRcdFx0Yy55ICs9IGMudnk7XG5cblx0XHRcdGlmIChjLnggPCAwKSB7XG5cdFx0XHRcdGMueCA9IDA7XG5cdFx0XHRcdGMudnggKj0gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGVsc2UgaWYgKGMueCA+IHRoaXMuZ2FtZS53aWR0aCkge1xuXHRcdFx0XHRjLnggPSB0aGlzLmdhbWUud2lkdGg7XG5cdFx0XHRcdGMudnggKj0gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjLnkgPCAwKSB7XG5cdFx0XHRcdGMueSA9IDA7XG5cdFx0XHRcdGMudnkgKj0gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGVsc2UgaWYgKGMueSA+IHRoaXMuZ2FtZS5oZWlnaHQpIHtcblx0XHRcdFx0Yy55ID0gdGhpcy5nYW1lLmhlaWdodDtcblx0XHRcdFx0Yy52eSAqPSAtMTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEludHJvIHtcblx0cHJlbG9hZCgpIHtcblx0fVxuXG5cdGNyZWF0ZSgpIHtcblx0XHRjb25zb2xlLmxvZygnaW50cm8nKTtcblx0XHRsZXQgc3R5bGUgPSB7IGZvbnQ6IFwiMzJweCBtb25vc3BhY2VcIiwgZmlsbDogXCIjZmZmXCJ9O1xuXHRcdHRoaXMuZ2FtZS5hZGQudGV4dCgyMzAsIDIwMCwgJ1BoYXNlciBFUzYnLCBzdHlsZSk7XG5cdFx0dGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdydW4tbWF6ZS1iYWxscycpO1xuXHR9XG5cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMZXZlbCB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHR0aGlzLmdhbWUgICA9IG9wdGlvbnMuZ2FtZTtcblx0XHR0aGlzLmxheW91dCA9IG9wdGlvbnMubGF5b3V0O1xuXHRcdHRoaXMuZ3JpZCA9IHRoaXMubGF5b3V0XG5cdFx0XHQudHJpbSgpXG5cdFx0XHQuc3BsaXQoJ1xcbicpXG5cdFx0XHQubWFwKChzKSA9PiB7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHMpfSk7XG5cdFx0dGhpcy53aWR0aCA9IHRoaXMuZ3JpZFswXS5sZW5ndGg7XG5cdFx0dGhpcy5oZWlnaHQgPSB0aGlzLmdyaWQubGVuZ3RoO1xuXHR9XG5cblx0Z2V0Q2VsbCh4LCB5KSB7XG5cdFx0dmFyIHJvdyA9IHRoaXMuZ3JpZFtNYXRoLmZsb29yKHkpXTtcblx0XHRpZiAoIXJvdykgeyByZXR1cm4gdW5kZWZpbmVkIH1cblx0XHRyZXR1cm4gcm93W01hdGguZmxvb3IoeCldO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IGdmeCA9IHRoaXMuZ2FtZS5nZng7XG5cdFx0Y29uc3Qgc2NhbGVYID0gdGhpcy5nYW1lLndpZHRoL3RoaXMuZ3JpZFswXS5sZW5ndGg7XG5cdFx0Y29uc3Qgc2NhbGVZID0gdGhpcy5nYW1lLmhlaWdodC90aGlzLmdyaWQubGVuZ3RoO1xuXG5cdFx0dGhpcy5ncmlkLmZvckVhY2goKHJvdywgeSkgPT4ge1xuXHRcdFx0cm93LmZvckVhY2goKGNlbGwsIHgpID0+IHtcblx0XHRcdFx0aWYgKGNlbGwgPT09ICcqJykge1xuXHRcdFx0XHRcdGNvbnN0IGZpbGwgPSAweDk5MzMzMztcblx0XHRcdFx0XHRnZngubGluZVN0eWxlKG51bGwpO1xuXHRcdFx0XHRcdGdmeC5iZWdpbkZpbGwoMHhBQTMzMzMpO1xuXHRcdFx0XHRcdGdmeC5kcmF3UmVjdCh4ICogc2NhbGVYLCB5ICogc2NhbGVZLCAxICogc2NhbGVYLCAxICogc2NhbGVZKTtcblx0XHRcdFx0XHRnZnguZW5kRmlsbCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0pXG5cblx0fVxuXG5cdHVwZGF0ZSgpIHtcblx0fVxufSIsImxldCBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDk1MCwgNjAwLCBQaGFzZXIuQVVUTyk7XG5cbmltcG9ydCBCb290IGZyb20gJy4vQm9vdCdcbmltcG9ydCBQcmVsb2FkIGZyb20gJy4vUHJlbG9hZCdcbmltcG9ydCBJbnRybyBmcm9tICcuL0ludHJvJ1xuaW1wb3J0IFJ1bkNlbGxzIGZyb20gJy4vUnVuQ2VsbHMnXG5pbXBvcnQgUnVuUm9vbXMgZnJvbSAnLi9SdW5Sb29tcydcbmltcG9ydCBSdW5NYXplQmFsbHMgZnJvbSAnLi9SdW5NYXplQmFsbHMnXG5cbmdhbWUuc3RhdGUuYWRkKCdib290JywgQm9vdCk7XG5nYW1lLnN0YXRlLmFkZCgncHJlbG9hZCcsIFByZWxvYWQpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2ludHJvJywgSW50cm8pO1xuZ2FtZS5zdGF0ZS5hZGQoJ3J1bi1jZWxscycsIFJ1bkNlbGxzKTtcbmdhbWUuc3RhdGUuYWRkKCdydW4tcm9vbXMnLCBSdW5Sb29tcyk7XG5nYW1lLnN0YXRlLmFkZCgncnVuLW1hemUtYmFsbHMnLCBSdW5NYXplQmFsbHMpO1xuZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xuIiwiTWF0aC5yYW5kb21JbnQgPSAobWluLCBtYXggPSBudWxsKSA9PiB7XG5cdGlmIChtYXggPT0gbnVsbCkgeyBtYXggPSBtaW47IG1pbiA9IDA7fVxuXHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xufVxuXG5NYXRoLmRpc3RhbmNlID0gKHgxLCB5MSwgeDIsIHkyKSA9PiB7XG5cdHJldHVybiBNYXRoLmFicyh4MS14MikgKyBNYXRoLmFicyh5MS15Mik7XG59XG5cbk1hdGgubm9ybWFsaXplID0gKHZhbCwgbWluLCBtYXgpID0+IHtcblx0cmV0dXJuICh2YWwgLSBtaW4pIC8gKG1heCAtIG1pbik7XG59XG5cbk1hdGguY29tcGFyZSA9IChhLCBiKSA9PiB7XG5cdHJldHVybiBhIDwgYiA/IC0xIDogYiA8IGEgPyAxIDogMDtcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNYXplQmFsbHMge1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHR0aGlzLmdhbWUgPSBvcHRpb25zLmdhbWU7XG5cdFx0dGhpcy5udW1CYWxscyA9IG9wdGlvbnMubnVtQmFsbHMgfHwgMTA7XG5cdFx0dGhpcy5iYWxscyA9IFtdO1xuXG5cdFx0Zm9yIChsZXQgaT0wOyBpPHRoaXMubnVtQmFsbHM7IGkrKykge1xuXHRcdFx0dGhpcy5zcGF3bigpO1xuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuYmFsbHMpO1xuXHR9XG5cblx0c3Bhd24oKSB7XG5cdFx0Y29uc3QgbGV2ZWwgPSB0aGlzLmdhbWUubGV2ZWw7XG5cdFx0Zm9yKDs7KSB7XG5cdFx0XHRjb25zdCB4ID0gTWF0aC5yYW5kb21JbnQoMCwgbGV2ZWwud2lkdGgpO1xuXHRcdFx0Y29uc3QgeSA9IE1hdGgucmFuZG9tSW50KDAsIGxldmVsLmhlaWdodCk7XG5cdFx0XHRpZiAobGV2ZWwuZ2V0Q2VsbCh4LCB5KSAhPSAnKicpIHtcblx0XHRcdFx0dGhpcy5iYWxscy5wdXNoKHtcblx0XHRcdFx0XHRpZDogdGhpcy5iYWxscy5sZW5ndGgsXG5cdFx0XHRcdFx0eDogeCArIDAuNSxcblx0XHRcdFx0XHR5OiB5ICsgMC41LFxuXHRcdFx0XHRcdHZ4OiBNYXRoLnJhbmRvbSgpLFxuXHRcdFx0XHRcdHZ5OiBNYXRoLnJhbmRvbSgpLFxuXHRcdFx0XHRcdHJhZGl1czogMC41XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IGdmeCA9IHRoaXMuZ2FtZS5nZng7XG5cdFx0Y29uc3Qgc2NhbGVYID0gdGhpcy5nYW1lLndpZHRoL3RoaXMuZ2FtZS5sZXZlbC53aWR0aDtcblx0XHRjb25zdCBzY2FsZVkgPSB0aGlzLmdhbWUuaGVpZ2h0L3RoaXMuZ2FtZS5sZXZlbC5oZWlnaHQ7XG5cblx0XHRjb25zdCByZWN0ID0gKHgsIHksIHcsIGgpID0+IHtcblx0XHRcdGdmeC5saW5lU3R5bGUoMSwgMHhGRkZGRkYsIDEpO1xuXHRcdFx0Z2Z4LmJlZ2luRmlsbCgweDMzMzM5OSk7XG5cdFx0XHRnZnguZHJhd1JlY3QoXG5cdFx0XHRcdHggKiBzY2FsZVgsIFxuXHRcdFx0XHR5ICogc2NhbGVZLCBcblx0XHRcdFx0dyAqIHNjYWxlWCwgXG5cdFx0XHRcdGggKiBzY2FsZVlcblx0XHRcdCk7XG5cdFx0XHRnZnguZW5kRmlsbCgpO1xuXHRcdH1cblxuXHRcdHRoaXMuYmFsbHMuZm9yRWFjaCgoYmFsbCkgPT4ge1xuXHRcdFx0Y29uc3QgeCA9IGJhbGwueDtcblx0XHRcdGNvbnN0IHkgPSBiYWxsLnk7XG5cdFx0XHRjb25zdCByID0gYmFsbC5yYWRpdXM7XG5cblx0XHRcdGdmeC5saW5lU3R5bGUoMSwgMHhGRkZGRkYsIDEpO1xuXHRcdFx0Z2Z4LmJlZ2luRmlsbCgweDMzOTkzMyk7XG5cdFx0XHRnZnguZHJhd0VsbGlwc2UoXG5cdFx0XHRcdHggKiBzY2FsZVgsIFxuXHRcdFx0XHR5ICogc2NhbGVZLCBcblx0XHRcdFx0ciAqIHNjYWxlWCwgXG5cdFx0XHRcdHIgKiBzY2FsZVlcblx0XHRcdCk7XG5cdFx0XHR0aGlzLmdhbWUuZ2Z4LmVuZEZpbGwoKTtcblxuXHRcdFx0Ly8gcmVjdCh4LCB5LCByLCByKTtcblx0XHRcdC8vIHJlY3QoeCwgeS1yLCByLCByKTtcblx0XHRcdC8vIHJlY3QoeC1yLCB5LCByLCByKTtcblx0XHRcdC8vIHJlY3QoeC1yLCB5LXIsIHIsIHIpO1xuXHRcdH0pO1x0XG5cdH1cblxuXHR1cGRhdGUoKSB7XG5cdFx0Y29uc3Qgc3BlZWQgPSAwLjI7XG5cdFx0Y29uc3QgbGV2ZWwgPSB0aGlzLmdhbWUubGV2ZWw7XG5cblx0XHR0aGlzLmJhbGxzLmZvckVhY2goKGJhbGwpID0+IHtcblx0XHRcdGNvbnN0IHggPSBiYWxsLng7XG5cdFx0XHRjb25zdCB5ID0gYmFsbC55O1xuXHRcdFx0Y29uc3QgciA9IGJhbGwucmFkaXVzO1xuXG5cdFx0XHRjb25zdCBjb2xsaWRlcyA9ICh4LCB5KSA9PiB7XG5cdFx0XHRcdHJldHVybiBsZXZlbC5nZXRDZWxsKHgsIHkpID09ICcqJztcblx0XHRcdH1cblxuXHRcdFx0YmFsbC54ICs9IGJhbGwudnggKiBzcGVlZDtcblx0XHRcdGJhbGwueSArPSBiYWxsLnZ5ICogc3BlZWQ7XG5cblx0XHRcdC8vIGNoZWNrIHNpZGVzIFxuXG5cdFx0XHRpZiAoY29sbGlkZXMoeCArIHIsIHktci8yKSB8fFxuXHRcdFx0XHQgIGNvbGxpZGVzKHggKyByLCB5K3IvMikpIHtcblx0XHRcdFx0YmFsbC52eCAqPSAtMTtcblx0XHRcdFx0YmFsbC54ID0gTWF0aC5mbG9vcih4KSArIHIgLSAwLjAwMTtcdFx0XG5cdFx0XHR9XG5cblx0XHRcdGVsc2UgaWYgKGNvbGxpZGVzKHggLSByLCB5IC0gci8yKSB8fFxuXHRcdFx0XHQgICAgICAgY29sbGlkZXMoeCAtIHIsIHkgKyByLzIpKSB7XG5cdFx0XHRcdGJhbGwudnggKj0gLTE7XG5cdFx0XHRcdGJhbGwueCA9IE1hdGguZmxvb3IoeCkgKyByICsgMC4wMDE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xsaWRlcyh4IC0gci8yLCB5ICsgcikgfHxcblx0XHRcdFx0ICBjb2xsaWRlcyh4ICsgci8yLCB5ICsgcikpIHtcblx0XHRcdFx0YmFsbC52eSAqPSAtMTtcblx0XHRcdFx0YmFsbC55ID0gTWF0aC5mbG9vcih5KSArIHIgLSAwLjAwMTtcblx0XHRcdH0gXG5cdFx0ICBcblx0XHQgIGVsc2UgaWYgKGNvbGxpZGVzKHggLSByLzIsIHkgLSByKSB8fFxuXHRcdCAgXHQgICAgICAgY29sbGlkZXMoeCArIHIvMiwgeSAtIHIpKSB7XG5cdFx0XHRcdGJhbGwudnkgKj0gLTE7XG5cdFx0XHRcdGJhbGwueSA9IE1hdGguZmxvb3IoeSkgKyByICsgMC4wMDE7XG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlbG9hZCB7XG5cdHByZWxvYWQoKSB7XG5cblx0fVxuXG5cdGNyZWF0ZSgpIHtcblx0XHRjb25zb2xlLmxvZygncHJlbG9hZCcpO1xuXHRcdHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnaW50cm8nKTtcblx0fVxufSIsImZ1bmN0aW9uIGluUmFuZ2UgKHgsIG1pbiwgbWF4KSB7XG5cdHJldHVybiAoeCA+PSBtaW4pICYmICh4IDw9IG1heCk7XG59XG5cbmZ1bmN0aW9uIGNvbGxpZGVzKGEsIGIpIHtcblx0Y29uc3QgYXgxID0gYS54IC0gYS53aWR0aC8yO1xuXHRjb25zdCBheDIgPSBhLnggKyBhLndpZHRoLzI7XG5cdGNvbnN0IGF5MSA9IGEueSAtIGEuaGVpZ2h0LzI7XG5cdGNvbnN0IGF5MiA9IGEueSArIGEuaGVpZ2h0LzI7XG5cblx0Y29uc3QgYngxID0gYi54IC0gYi53aWR0aC8yO1xuXHRjb25zdCBieDIgPSBiLnggKyBiLndpZHRoLzI7XG5cdGNvbnN0IGJ5MSA9IGIueSAtIGIuaGVpZ2h0LzI7XG5cdGNvbnN0IGJ5MiA9IGIueSArIGIuaGVpZ2h0LzI7XG5cblx0Y29uc3QgeE92ZXJsYXAgPSBpblJhbmdlKGF4MSwgYngxLCBieDIpIHx8XG5cdCAgICAgICAgICAgICAgICAgaW5SYW5nZShieDEsIGF4MSwgYXgyKTtcblx0Y29uc3QgeU92ZXJsYXAgPSBpblJhbmdlKGF5MSwgYnkxLCBieTIpIHx8XG5cdCAgICAgICAgICAgICAgICAgaW5SYW5nZShieTEsIGF5MSwgYXkyKTtcblx0cmV0dXJuIHhPdmVybGFwICYmIHlPdmVybGFwO1xufVxuXG5mdW5jdGlvbiB0b3VjaGluZyhhLCBiKSB7IFxuXHRjb25zdCB4Z29hbCA9IGEud2lkdGgvMiArIGIud2lkdGgvMjtcblx0Y29uc3QgeWdvYWwgPSBhLmhlaWdodC8yICsgYi5oZWlnaHQvMjtcblx0Y29uc3QgeGRpc3QgPSBNYXRoLmFicyhhLnggLSBiLngpO1xuXHRjb25zdCB5ZGlzdCA9IE1hdGguYWJzKGEueSAtIGIueSk7XG5cblx0cmV0dXJuICh4ZGlzdCA9PSB4Z29hbC0xICYmIHlkaXN0ID49IHlnb2FsKSB8fFxuXHQgICAgICAgKHlkaXN0ID09IHlnb2FsLTEgJiYgeGRpc3QgPj0geGdvYWwpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb29tcyB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM9e30pIHtcblx0XHR0aGlzLmdhbWUgPSBvcHRpb25zLmdhbWU7XG5cdFx0dGhpcy5udW1Sb29tcyA9IG9wdGlvbnMubnVtUm9vbXMgfHwgMTUwO1xuXHRcdHRoaXMubWluV2lkdGggPSBvcHRpb25zLm1pbldpZHRoIHx8IDQ7XG5cdFx0dGhpcy5tYXhXaWR0aCA9IG9wdGlvbnMubWF4V2lkdGggfHwgODtcblx0XHR0aGlzLm1pbkhlaWdodCA9IG9wdGlvbnMubWluSGVpZ2h0IHx8IDQ7XG5cdFx0dGhpcy5tYXhIZWlnaHQgPSBvcHRpb25zLm1heEhlaWdodCB8fCA4O1xuXHRcdHRoaXMucmFkaXVzID0gTWF0aC5jZWlsKE1hdGguc3FydChNYXRoLnBvdyh0aGlzLm1heFdpZHRoLCAyKSArIE1hdGgucG93KHRoaXMubWF4SGVpZ2h0LCAyKSkpICogNjtcblx0ICB0aGlzLnNpemUgPSB0aGlzLnJhZGl1cyAqIDM7XG5cdFx0dGhpcy5yb29tcyA9IFtdO1xuXHRcdHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG5cdFx0dGhpcy5ncmlkID0gW107XG5cdFx0dGhpcy5ncmlkLmxlbmd0aCA9IHRoaXMuc2l6ZSAqIHRoaXMuc2l6ZTtcblxuXHRcdGZvciAobGV0IGk9MDsgaTx0aGlzLm51bVJvb21zOyBpKyspIHtcblx0XHRcdHRoaXMubWFrZVJvb20oKTtcblx0XHR9XG5cdH1cblxuXHRtYWtlUm9vbSgpIHtcblx0XHRjb25zdCBpZCA9IHRoaXMucm9vbXMubGVuZ3RoO1xuXHRcdGNvbnN0IHdpZHRoID0gTWF0aC5yYW5kb21JbnQodGhpcy5taW5XaWR0aCwgdGhpcy5tYXhXaWR0aCkgKiAyO1xuXHRcdGNvbnN0IGhlaWdodCA9IE1hdGgucmFuZG9tSW50KHRoaXMubWluSGVpZ2h0LCB0aGlzLm1heEhlaWdodCkgKiAyO1xuXHRcdGNvbnN0IHhtaW4gPSBNYXRoLmNlaWwod2lkdGggLyAyKTtcblx0XHRjb25zdCB4bWF4ID0gTWF0aC5jZWlsKCh0aGlzLnJhZGl1cykgLSAod2lkdGggLyAyKSk7XG5cdFx0Y29uc3QgeW1pbiA9IE1hdGguY2VpbChoZWlnaHQgLyAyKTtcblx0XHRjb25zdCB5bWF4ID0gTWF0aC5jZWlsKCh0aGlzLnJhZGl1cykgLSAoaGVpZ2h0IC8gMikpO1xuXG5cdFx0Y29uc3Qgb2Zmc2V0ID0gTWF0aC5mbG9vcih0aGlzLnNpemUvMiAtIHRoaXMucmFkaXVzLzIpO1xuXG5cdFx0dGhpcy5yb29tcy5wdXNoKHtcblx0XHRcdGlkOiBpZCxcblx0XHRcdHg6IG9mZnNldCArIE1hdGgucmFuZG9tSW50KHhtaW4sIHhtYXgpLFxuXHRcdFx0eTogb2Zmc2V0ICsgTWF0aC5yYW5kb21JbnQoeW1pbiwgeW1heCksXG5cdFx0XHR3aWR0aDogd2lkdGgsXG5cdFx0XHRoZWlnaHQ6IGhlaWdodCxcblx0XHRcdGxvY2tlZDogZmFsc2UgXHRcdFxuXHRcdH0pO1xuXHR9XG5cblx0cmVuZGVyUm9vbShyb29tKSB7XG5cdFx0Y29uc3QgeHNjYWxlID0gdGhpcy54c2NhbGU7XG5cdFx0Y29uc3QgeXNjYWxlID0gdGhpcy55c2NhbGU7XG5cdFx0Y29uc3QgZ2Z4ID0gdGhpcy5nYW1lLmdmeDtcblx0XHRjb25zdCB3ID0gcm9vbS53aWR0aDtcblx0XHRjb25zdCBoID0gcm9vbS5oZWlnaHQ7XG5cdFx0Y29uc3QgZmlsbCA9IHJvb20ubG9ja2VkID8gMHg2NkNDNjYgOiAweENDNjY2Njtcblx0XHRnZngubGluZVN0eWxlKGZpbGwpO1xuXHRcdGdmeC5iZWdpbkZpbGwoZmlsbCk7XG5cdFx0Z2Z4LmRyYXdSZWN0KFxuXHRcdFx0KHJvb20ueCAtIHcvMikgKiB4c2NhbGUsIFxuXHRcdFx0KHJvb20ueSAtIGgvMikgKiB5c2NhbGUsIFxuXHRcdFx0dyAqIHhzY2FsZSwgXG5cdFx0XHRoICogeXNjYWxlXG5cdFx0KTtcblx0XHRnZnguZW5kRmlsbCgpO1xuXG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0dGhpcy54c2NhbGUgPSB0aGlzLmdhbWUud2lkdGggLyB0aGlzLnNpemU7XG5cdFx0dGhpcy55c2NhbGUgPSB0aGlzLmdhbWUuaGVpZ2h0IC8gdGhpcy5zaXplO1xuXHRcblx0XHR0aGlzLnJvb21zXG5cdFx0XHQuZmlsdGVyKChyb29tKSA9PiB7cmV0dXJuICFyb29tLmxvY2tlZH0pXG5cdFx0XHQuZm9yRWFjaCgocm9vbSkgPT4gdGhpcy5yZW5kZXJSb29tKHJvb20pKTtcblxuXHRcdHRoaXMucm9vbXNcblx0XHRcdC5maWx0ZXIoKHJvb20pID0+IHtyZXR1cm4gcm9vbS5sb2NrZWR9KVxuXHRcdFx0LmZvckVhY2goKHJvb20pID0+IHRoaXMucmVuZGVyUm9vbShyb29tKSk7XG5cdH1cblxuXHRjbGVhckdyaWQoKSB7XG5cdFx0Zm9yIChsZXQgaT0wOyBpPHRoaXMuZ3JpZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0dGhpcy5ncmlkW2ldID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRzZXRHcmlkQ2VsbCh4LCB5LCB6KSB7XG5cdFx0dGhpcy5ncmlkW3kgKiB0aGlzLnNpemUgKyB4XSA9IHo7XG5cdH1cblxuXHRnZXRHcmlkQ2VsbCh4LCB5KSB7XG5cdFx0cmV0dXJuIHRoaXMuZ3JpZFt5ICogdGhpcy5zaXplICsgeF07XG5cdH1cblxuXHRmaWxsR3JpZChleGNsdWRlID0gLTEpIHtcblx0XHR0aGlzLmNsZWFyR3JpZCgpO1xuXHRcdGZvciAobGV0IGk9MDsgaTx0aGlzLnJvb21zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoZXhjbHVkZSA9PSBpKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRjb25zdCByb29tID0gdGhpcy5yb29tc1tpXTtcblx0XHRcdGZvciAobGV0IHg9LXJvb20ud2lkdGgvMjsgeDxyb29tLndpZHRoLzI7IHgrKykge1xuXHRcdFx0XHRmb3IgKGxldCB5PS1yb29tLmhlaWdodC8yOyB5PHJvb20uaGVpZ2h0LzI7IHkrKykge1xuXHRcdFx0XHRcdHRoaXMuc2V0R3JpZENlbGwocm9vbS54ICsgeCwgcm9vbS55ICsgeSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0c2FtcGxlR3JpZChyb29tKSB7XG5cdFx0Y29uc3Qgc2FtcGxlID0gW107XG5cdFx0Zm9yIChsZXQgeD0tcm9vbS53aWR0aC8yLTE7IHg8cm9vbS53aWR0aC8yKzE7IHgrKykge1xuXHRcdFx0Zm9yIChsZXQgeT0tcm9vbS5oZWlnaHQvMi0xOyB5PHJvb20uaGVpZ2h0LzIrMTsgeSsrKSB7XG5cdFx0XHRcdHNhbXBsZS5wdXNoKHRoaXMuZ3JpZFsocm9vbS55ICsgeSkgKiB0aGlzLnNpemUgKyByb29tLnggKyB4XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBzYW1wbGU7XG5cdH1cblxuXHRzZXBhcmF0ZTEocm9vbSkge1xuXHRcdGNvbnN0IGlzQ29sbGlkaW5nID0gKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc2FtcGxlID0gdGhpcy5zYW1wbGVHcmlkKHJvb20pO1xuXHRcdFx0Zm9yIChsZXQgaT0wOyBpPHNhbXBsZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoIXNhbXBsZVtpXSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlOyBcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNlbnRlciA9IHRoaXMuc2l6ZS8yO1xuXHRcdGNvbnN0IHhkaXIgPSByb29tLnggPCBjZW50ZXIgPyAxIDogLTE7XG5cdFx0Y29uc3QgeWRpciA9IHJvb20ueSA8IGNlbnRlciA/IDEgOiAtIDE7XG5cblx0XHR0aGlzLmZpbGxHcmlkKHJvb20uaWQpO1xuXG5cdFx0Y29uc3QgbW92ZVggPSBNYXRoLnJhbmRvbSgpID49IDAuNVxuXG5cdFx0d2hpbGUoaXNDb2xsaWRpbmcoKSkge1xuXHRcdFx0aWYgKG1vdmVYKSB7XG5cdFx0XHRcdHJvb20ueCArPSB4ZGlyO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cm9vbS55ICs9IHlkaXI7XG5cdFx0XHR9XG5cdFx0fSBcblx0fVxuXHRcblx0c2VwYXJhdGUoKSB7XG5cdFx0Zm9yIChsZXQgaT0wOyBpPHRoaXMucm9vbXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHJvb20gPSB0aGlzLnJvb21zW2ldO1xuXHRcdFx0aWYgKHJvb20ubG9ja2VkKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuc2VwYXJhdGUxKHJvb20pO1xuXHRcdFx0XHRyb29tLmxvY2tlZCA9IHRydWU7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHR1cGRhdGUoKSB7XG5cdFx0aWYgKCF0aGlzLnNob3VsZFVwZGF0ZSkgeyByZXR1cm47IH1cblx0XHR0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXHRcdHRoaXMuc2VwYXJhdGUoKTtcblx0fVxuXG59IiwiaW1wb3J0IENlbGxzIGZyb20gJy4vQ2VsbHMnO1xuaW1wb3J0ICcuL01hdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5DZWxscyB7XG5cblx0Y3JlYXRlKCkge1xuXHRcdC8vIHRoaXMuZ2FtZS5nZnggPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKDAsIDApO1xuXHRcdHRoaXMuZ2FtZS5zY3JlZW4gPSB0aGlzLmdhbWUuYWRkLmJpdG1hcERhdGEodGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KTtcblx0XHR0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmdhbWUuc2NyZWVuKTtcblx0XHR0aGlzLmdhbWUuY2VsbHMgPSBuZXcgQ2VsbHMoe1xuXHRcdFx0Z2FtZTogdGhpcy5nYW1lLFxuXHRcdFx0bnVtQ2VsbHM6IDIwMCxcblx0XHRcdG1pblJhZGl1czogMixcblx0XHRcdG1heFJhZGl1czogNCxcblx0XHRcdGJhc2VDb2xvcjogWzE4MCwgMzAsIDMwXSxcblx0XHRcdHJlcHVsc2VDb2xvcjogWzE2MCwgMTYwLCAyNTVdXG5cdFx0fSk7XG5cblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHQvLyB0aGlzLmdhbWUuZ2Z4LmNsZWFyKCk7XG5cdFx0dGhpcy5nYW1lLnNjcmVlbi5jbGVhcigpO1xuXHRcdHRoaXMuZ2FtZS5jZWxscy5yZW5kZXIoKTtcblx0XHR0aGlzLmdhbWUuc2NyZWVuLnJlbmRlcigpO1xuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdHRoaXMuZ2FtZS5jZWxscy51cGRhdGUoKTtcblx0fVxuXG59IiwiaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwnO1xuaW1wb3J0IE1hemVCYWxscyBmcm9tICcuL01hemVCYWxscyc7XG5cbmNvbnN0IGxheW91dCA9IFxuYFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKiogICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICAgICAgICogICAgICAgICAgICAgKlxuKioqKioqICAgICoqKioqKiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICAgICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICogICAgICAgICAgICAgICogICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICogICAqKioqKioqKioqKiogICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICogICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKiAgICAqKioqKioqKioqKiAgICAgICogICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICoqKioqKioqKioqKioqKioqKiAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuKiAgICAqKioqKiogICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICoqKioqKioqICAgICoqKioqKioqKioqKiogICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICogICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgKiAgICAgICogICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICogICAgKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUnVuTWF6ZUJhbGxzIHtcblx0Y3JlYXRlKCkge1xuXHRcdHRoaXMuZ2FtZS5nZnggPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKDAsIDApO1xuXHRcdHRoaXMuZ2FtZS5sZXZlbCA9IG5ldyBMZXZlbCh7XG5cdFx0XHRnYW1lOiB0aGlzLmdhbWUsXG5cdFx0XHRsYXlvdXQ6IGxheW91dFxuXHRcdH0pO1xuXG5cdFx0dGhpcy5nYW1lLm1hemVCYWxscyA9IG5ldyBNYXplQmFsbHMoe1xuXHRcdFx0Z2FtZTogdGhpcy5nYW1lLFxuXHRcdFx0bnVtQmFsbHM6IDYwXG5cdFx0fSk7XG5cblx0XHR0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkQ2FsbGJhY2tzKFxuXHRcdFx0dGhpcyxcblx0XHRcdHRoaXMub25LZXlEb3duLFxuXHRcdFx0dGhpcy5vbktleVVwLFxuXHRcdFx0dGhpcy5vbktleVByZXNzXG5cdFx0KVxuXG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0dGhpcy5nYW1lLmdmeC5jbGVhcigpO1xuXHRcdHRoaXMuZ2FtZS5sZXZlbC5yZW5kZXIoKTtcblx0XHR0aGlzLmdhbWUubWF6ZUJhbGxzLnJlbmRlcigpO1xuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdHRoaXMuZ2FtZS5sZXZlbC51cGRhdGUoKTtcblx0XHR0aGlzLmdhbWUubWF6ZUJhbGxzLnVwZGF0ZSgpO1xuXHR9XG5cblx0b25LZXlEb3duKGV2ZW50KSB7XG5cdFx0Y29uc29sZS5sb2coJ2tleURvd24nLCBldmVudCk7XG5cdFx0c3dpdGNoKGV2ZW50LmtleWNvZGUpIHtcblx0XHRcdGNhc2UgUGhhc2VyLktleWJvYXJkLlNQQUNFOlxuXHRcdH1cblx0fVxuXG5cdG9uS2V5VXAoZXZlbnQpIHtcblx0XHRjb25zb2xlLmxvZygna2V5VXAnLCBldmVudCk7XG5cdH1cblxuXHRvbktleVByZXNzKGV2ZW50KSB7XG5cdFx0Y29uc29sZS5sb2coJ2tleVByZXNzJywgZXZlbnQpO1xuXHR9XG59IiwiaW1wb3J0IFJvb21zIGZyb20gJy4vUm9vbXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5Sb29tcyB7XG5cblx0Y3JlYXRlKCkge1xuXHRcdHRoaXMuZ2FtZS5nZnggPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKDAsIDApO1xuXHRcdHRoaXMuZ2FtZS5yb29tcyA9IG5ldyBSb29tcyh7XG5cdFx0XHRnYW1lOiB0aGlzLmdhbWUsXG5cdFx0XHRudW1Sb29tczogNTAsXG5cdFx0XHRtaW5XaWR0aDogMiwgXG5cdFx0XHRtYXhXaWR0aDogOCxcblx0XHRcdG1pbkhlaWdodDogMixcblx0XHRcdG1heEhlaWdodDogOFxuXHRcdH0pO1xuXG5cdFx0dGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZENhbGxiYWNrcyhcblx0XHRcdHRoaXMsXG5cdFx0XHR0aGlzLm9uS2V5RG93bixcblx0XHRcdHRoaXMub25LZXlVcCxcblx0XHRcdHRoaXMub25LZXlQcmVzc1xuXHRcdClcblxuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHRoaXMuZ2FtZS5nZnguY2xlYXIoKTtcblx0XHR0aGlzLmdhbWUucm9vbXMucmVuZGVyKCk7XG5cdH1cblxuXHR1cGRhdGUoKSB7XG5cdFx0dGhpcy5nYW1lLnJvb21zLnVwZGF0ZSgpO1xuXHR9XG5cblx0b25LZXlEb3duKGV2ZW50KSB7XG5cdFx0Y29uc29sZS5sb2coJ2tleURvd24nLCBldmVudCk7XG5cdFx0c3dpdGNoKGV2ZW50LmtleWNvZGUpIHtcblx0XHRcdGNhc2UgUGhhc2VyLktleWJvYXJkLlNQQUNFOlxuXHRcdFx0XHR0aGlzLmdhbWUucm9vbXMuc2hvdWxkVXBkYXRlID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRvbktleVVwKGV2ZW50KSB7XG5cdFx0Y29uc29sZS5sb2coJ2tleVVwJywgZXZlbnQpO1xuXHR9XG5cblx0b25LZXlQcmVzcyhldmVudCkge1xuXHRcdGNvbnNvbGUubG9nKCdrZXlQcmVzcycsIGV2ZW50KTtcblx0fVxuXG59Il19
