// Parameters of controller:
//	navWin: The navigation controller window.

var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var sleepAnalysisEntries;

function onAddClick() {
	controllerParams.navWin.openWindow(
		Alloy.createController('add_sleep_analysis', {
				navWin: controllerParams.navWin
		}).getView());
}

function onTableViewClick(e) {
	controllerParams.navWin.openWindow(
				Alloy.createController(
					'object_details',
					{
						navWin: controllerParams.navWin,
						object: sleepAnalysisEntries[e.index]
					}
				).getView());	
}

function createRow(entry) {
	var row, view, tag, value, dateString;

	row = Ti.UI.createTableViewRow();
	
	
	view = Ti.UI.createView({ height: 40 });
	view.add(Ti.UI.createLabel({
		text: Utils.sleepAnalysisNameForValue(entry.value),
		top: 0, 
		left: 20,
		font: {
			fontSize: 14,
			fontWeight: 'bold'
		}
	}));
	
	dateString = Utils.formatDateTime(entry.startDate) + ' - ' +
				Utils.formatDateTime(entry.endDate);
	view.add(Ti.UI.createLabel({
		text: dateString,
		bottom: 0,
		left: 20,
		font: {
			fontSize: 12,
			fontWeight: 'normal'
		}
	}));
	
	tag = Ti.UI.createLabel({
		right: 10,
		top: 5,
		borderRadius: 5,
		font: {
			fontSize: 12,
			fontWeight: 'normal'
		},
		color: 'white'
	});
	
	if (entry.source.bundleIdentifier === TiHealthkit.defaultSource.bundleIdentifier) {
		tag.text = ' owned ';
		tag.backgroundColor = 'green';
	} else {
		tag.text = ' ' + entry.source.name + ' ';
		tag.backgroundColor = 'red';
	}
	view.add(tag);
	row.add(view);
	
	return row;
}

function refreshTable() {
	var rows = [];
	sleepAnalysisEntries.forEach(function(entry) {
		rows.push(createRow(entry));
	});
	
	$.tableView.data = rows;
}

var queryError = false;

function onWindowFocus() {
	if (queryError) {
		return;
	}
	TiHealthkit.executeQuery(TiHealthkit.createSampleQuery({
				type: TiHealthkit.OBJECT_TYPE_SLEEP_ANALYSIS,
				filter: controllerParams.filter,
				onCompletion: function(e) {
					if (e.errorCode !== undefined) {
						Utils.showError(e);
						queryError = true;
						return;
					}

					sleepAnalysisEntries = e.results;
					Utils.log('Found ' +
								sleepAnalysisEntries.length +
								' sleep analysis entries');
					refreshTable();
				}
			}));
}