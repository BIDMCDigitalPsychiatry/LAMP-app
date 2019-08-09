var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var workouts = [];

function onAddClick() {
	controllerParams.navWin.openWindow(
		Alloy.createController('add_workout', {
				navWin: controllerParams.navWin
		}).getView());
}

function onTableViewClick(e) {
	controllerParams.navWin.openWindow(
				Alloy.createController(
					'object_details',
					{
						navWin: controllerParams.navWin,
						object: workouts[e.index]
					}
				).getView());	
}

function createWorkoutRow(workout) {
	var row, view, tag, value, dateString;

	row = Ti.UI.createTableViewRow();
	
	
	view = Ti.UI.createView({ height: 40 });
	view.add(Ti.UI.createLabel({
		text: Utils.workoutActivityNameForType(workout.activityType),
		top: 0, 
		left: 20,
		font: {
			fontSize: 14,
			fontWeight: 'bold'
		}
	}));
	
	dateString = Utils.formatDateTime(workout.startDate) + ' - ' +
				Utils.formatDateTime(workout.endDate);
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
	
	if (workout.source.bundleIdentifier === TiHealthkit.defaultSource.bundleIdentifier) {
		tag.text = ' owned ';
		tag.backgroundColor = 'green';
	} else {
		tag.text = ' ' + workout.source.name + ' ';
		tag.backgroundColor = 'red';
	}
	view.add(tag);
	row.add(view);
	
	return row;
}

function refreshTable() {
	var rows = [];
	workouts.forEach(function(workout) {
		rows.push(createWorkoutRow(workout));
	});
	
	$.tableView.data = rows;
}

var queryError = false;

function onWindowFocus() {
	if (queryError) {
		return;
	}

	TiHealthkit.executeQuery(TiHealthkit.createSampleQuery({
				type: TiHealthkit.OBJECT_TYPE_WORKOUT,
				filter: controllerParams.filter,
				onCompletion: function(e) {
					if (e.errorCode !== undefined) {
						Utils.showError(e);
						queryError = true;
						return;
					}

					workouts = e.results;
					Utils.log('Found ' + workouts.length + ' workouts');
					refreshTable();
				}
			}));
}