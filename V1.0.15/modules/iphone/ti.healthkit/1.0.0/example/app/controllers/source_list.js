var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var rows = [];
controllerParams.sources.forEach(function(source) {
	var row, parent;
	
	row = Ti.UI.createTableViewRow();
	
	parent = Ti.UI.createView({
		layout: 'vertical',
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL
	});
	parent.add(Ti.UI.createLabel({
		text: source.name,
		left: 10,
		font: {
			fontSize: 18,
			fontWeight: 'bold'
		}
	}));
	parent.add(Ti.UI.createLabel({
		text: source.bundleIdentifier,
		left: 10,
		font: {
			fontSize: 14
		}
	}));
	
	row.add(parent);
	rows.push(row);
});


$.tableView.data = rows;