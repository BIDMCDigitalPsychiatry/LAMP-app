// Parameters of controller:
//	navWin: The navigation controller window.
//	title: Title of the window.
//	type: String; one of the Ti.Healthkit.OBJECT_TYPE_* constants.
//	filter: A Ti.Healthkit.Filter object. Optional.

var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var objects;

$.win.title = controllerParams.title;

var preferredUnits; // will be set later by preferredUnitsForQuantityTypes

function onTableViewClick(e) {
	var nextWin, object, preferredUnit;
	
	object = objects[e.index];
	if (object.sampleType !== undefined) {
		preferredUnit = preferredUnits[object.sampleType];
	}
	
	nextWin = Alloy.createController(
					'object_details',
					{
						navWin: controllerParams.navWin,
						object: object,
						preferredUnit: preferredUnit
					}
				).getView();
	controllerParams.navWin.openWindow(nextWin);
}

function createQuantitySampleRow(quantitySample) {
	var row, view, value, unit, dateString;
	
	unit = preferredUnits[quantitySample.sampleType];
	
	row = Ti.UI.createTableViewRow();
	view = Ti.UI.createView({ height: 40, layout: 'vertical' });
	view.add(Ti.UI.createLabel({
		text: quantitySample.quantity.valueForUnit(unit) + ' ' + unit.toString(),
		left: 20,
		font: {
			fontSize: 14,
			fontWeight: 'bold'
		}
	}));
	
	dateString = Utils.formatDateTime(quantitySample.startDate);
	if (quantitySample.startDate.getTime() !== quantitySample.endDate.getTime()) {
		dateString += ' - ' + Utils.formatDateTime(quantitySample.endDate);
	}
	view.add(Ti.UI.createLabel({
		text: dateString,
		left: 20,
		font: {
			fontSize: 12,
			fontWeight: 'normal'
		}
	}));
	row.add(view);
	
	return row;
}

function refreshTable() {
	var types = [];
	
	objects.forEach(function(object) {
		var type;
		
		if (object.sampleType !== undefined) {
			type = object.sampleType;
		}
		
		if (types.indexOf(type) === -1) {
			types.push(type);
		}
	});
	
	if (types.length > 0) {
		TiHealthkit.preferredUnitsForQuantityTypes({
			types: types,
			onCompletion: function(e) {
				var rows = [];
				if (e.errorCode === undefined) {
					preferredUnits = e.preferredUnits;
					objects.forEach(function(object) {
						rows.push(createQuantitySampleRow(object));
					});
					$.tableView.data = rows;
				} else {
					Utils.showError(e);
				}
			}
		});
	}
}

function onWindowFocus() {
	var query = 
		TiHealthkit.createSampleQuery({
				type: controllerParams.type,
				filter: controllerParams.filter,
				onCompletion: function(e) {
					objects = e.results;
					Utils.log('Found ' + objects.length + ' objects');
					refreshTable();
				}
		});
	Utils.log('query.filter: ' + query.filter);
	Utils.log('query.sampleType: ' + Utils.objectNameForType(query.sampleType));
	TiHealthkit.executeQuery(query);
}