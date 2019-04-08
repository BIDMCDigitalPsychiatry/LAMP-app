var empty = {};
function mixin(target, source) {
	var name,
	    s,
	    i;
	for (name in source) {
		if (source.hasOwnProperty(name)) {
			s = source[name];
			if (!( name in target) || (target[name] !== s && (!( name in empty) || empty[name] !== s))) {
				target[name] = s;
			}
		}
	}
	return target;
}

function extend(obj, props) {
	if (!obj) {
		obj = {};
	}
	for (var i = 1,
	    l = arguments.length; i < l; i++) {
		mixin(obj, arguments[i]);
	}
	return obj;
}

var createLine = function(args) {
	var options = extend({
		x1 : 0,
		y1 : 0,
		x2 : 0,
		y2 : 0,
		width : 2,
		color : '#000',
		duration : 0,
	}, args || {});
	var length = function(options) {
		return Math.sqrt((options.x2 - options.x1) * (options.x2 - options.x1) + (options.y2 - options.y1) * (options.y2 - options.y1));
	};
	if (options.color == "green") {
		
	}
	var degrees = function(options) {

		var deg = Math.atan2(options.y2 - options.y1, options.x2 - options.x1) * 180.0 / Math.PI;

		
		return deg;
	};
	var line = Ti.UI.createView({
		width : length(options),
		height : options.width,
		backgroundColor : options.color,
		left : options.x1,
		top : options.y1,
		anchorPoint : {
			x : 0,
			y : 0
		},
		index : options.index,
		transform : Titanium.UI.create2DMatrix().rotate(degrees(options)),
		degrees : degrees(options)
	});

	

	line.update = function(changes) {
		var options = extend(options, changes || {});
		if (options.duration > 0) {
			var animation = Titanium.UI.createAnimation({
				duration : options.duration,
				width : length(options),
				height : options.width,
				left : options.x1,
				top : options.y1,
				backgroundColor : options.color,
				transform : Titanium.UI.create2DMatrix().rotate(degrees(options)),
				index : options.index
			});
			line.animate(animation);
		} else {
			line.updateLayout({
				duration : options.duration,
				width : length(options),
				height : options.width,
				left : options.x1,
				top : options.y1,
				backgroundColor : options.color,
				transform : Titanium.UI.create2DMatrix().rotate(degrees(options)),
				index : options.index
			});
		}

	};
	return line;
};
exports.createLine = createLine;
