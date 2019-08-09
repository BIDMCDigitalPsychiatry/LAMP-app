// Parameters of controller:
//	navWin: The navigation controller window.
var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');
var BackgroundQueries = require('background_queries');

var anchor;
var rows = [];
var unit = TiHealthkit.createUnit('count/min');

function onTableViewClick(e) {
	// The check marks are simply a visual aid for you to mark the old
	// entries. When a new entry is added to the data store, a new row
	// (without check mark) will be added to the table.
	rows[e.index].hasCheck = true;
}

function createSampleRow(sample) {
	var row, view, deleteButton, text;
	
	row = Ti.UI.createTableViewRow();
	view = Ti.UI.createView({ height: 40 });
	text = sample.quantity.valueForUnit(unit) + '/min';
	Utils.log('Adding row for ' + text);
	view.add(Ti.UI.createLabel({
		text: text,
		top: 0,
		left: 20,
		font: {
			fontSize: 14,
			fontWeight: 'bold'
		}
	}));
	
	view.add(Ti.UI.createLabel({
		text: Utils.formatDateTime(sample.startDate),
		bottom: 0,
		left: 20,
		font: {
			fontSize: 12,
			fontWeight: 'normal'
		}
	}));
	
	row.add(view);
	
	return row;
}

function updateTableWithSamples(samples) {
	rows = [];
	samples.forEach(function(sample) {
		rows.push(createSampleRow(sample));
	});
	$.tableView.data = rows;
}

function heartRateCallback(e) {
	if (e.errorCode !== undefined) {
		Utils.showError(e);
		return;
	}

	updateTableWithSamples(e.samples);
}

BackgroundQueries.setHeartRateCallback(heartRateCallback);

function onWindowClose() {
	BackgroundQueries.setHeartRateCallback(null);
}

var TOGGLE_DELIVERY_ON_TITLE = 'Turn On Background Delivery';
var TOGGLE_DELIVERY_OFF_TITLE = 'Turn Off Background Delivery';

if (Ti.App.Properties.getBool('BACKGROUND_DELIVERY_ENABLED')) {
	$.toggleDeliveryButton.title = TOGGLE_DELIVERY_OFF_TITLE;
} else {
	$.toggleDeliveryButton.title = TOGGLE_DELIVERY_ON_TITLE;
}

function onToggleDeliveryButtonClick(e) {
	if (e.source.title === TOGGLE_DELIVERY_ON_TITLE) {
		TiHealthkit.enableBackgroundDelivery({
			type: TiHealthkit.OBJECT_TYPE_HEART_RATE,
			frequency: TiHealthkit.UPDATE_FREQUENCY_IMMEDIATE,
			onCompletion: function(ee) {
				if (ee.success) {
					e.source.title = TOGGLE_DELIVERY_OFF_TITLE;
					Ti.App.Properties.setBool('BACKGROUND_DELIVERY_ENABLED', true);
				} else {
					Utils.showError(e);
				}
			}
		});
	} else {
		TiHealthkit.disableBackgroundDelivery({
			type: TiHealthkit.OBJECT_TYPE_HEART_RATE,
			onCompletion: function(ee) {
				if (ee.success) {
					e.source.title = TOGGLE_DELIVERY_ON_TITLE;
					Ti.App.Properties.setBool('BACKGROUND_DELIVERY_ENABLED', false);
				} else {
					Utils.showError(e);
				}
			}
		});
	}
}

var TOGGLE_QUERY_ON_TITLE = 'Start Query';
var TOGGLE_QUERY_OFF_TITLE = 'Stop Query';

if (BackgroundQueries.isHeartRateQueryRunning()) {
	$.toggleQueryButton.title = TOGGLE_QUERY_OFF_TITLE;
	updateTableWithSamples(BackgroundQueries.getHeartRateSamples());
} else {
	$.toggleQueryButton.title = TOGGLE_QUERY_ON_TITLE;
}

function onToggleQueryButtonClick(e) {
	if (e.source.title === TOGGLE_QUERY_ON_TITLE) {
		BackgroundQueries.startHeartRateObserverQuery();
		e.source.title = TOGGLE_QUERY_OFF_TITLE;
	} else {
		BackgroundQueries.stopHeartRateObserverQuery();
		e.source.title = TOGGLE_QUERY_ON_TITLE;
	}
}