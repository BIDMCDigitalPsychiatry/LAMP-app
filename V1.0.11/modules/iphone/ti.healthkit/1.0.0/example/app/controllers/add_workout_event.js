var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var eventTime = controllerParams.startDate;

function onSaveClick() {
	if (eventTime.getTime() < controllerParams.startDate.getTime()) {
		alert('Event time must be after workout start date (' +
			Utils.formatDateTime(controllerParams.startDate) + ').' );
		return;
	}
	if (eventTime.getTime() > controllerParams.endDate.getTime()) {
		alert('Event time must be before workout end date (' +
			Utils.formatDateTime(controllerParams.endDate) + ').' );
		return;
	}

	controllerParams.onSuccess({
		workoutEvent: TiHealthkit.createWorkoutEvent({
			type: $.pauseRow.hasCheck ?
						TiHealthkit.WORKOUT_EVENT_TYPE_PAUSE :
						TiHealthkit.WORKOUT_EVENT_TYPE_RESUME,
			date: eventTime
		})
	});
	$.win.close();
}

function onTableClick(tableClick) {
	switch (tableClick.index) {
		case 0:
			$.pauseRow.hasCheck = true;
			$.resumeRow.hasCheck = false;
			break;
		case 1:
			$.pauseRow.hasCheck = false;
			$.resumeRow.hasCheck = true;
			break;
		case 2:
			Alloy.createController('time_picker', {
				navWin: controllerParams.navWin,
				title: 'Pick Event Time',
				value: eventTime,
				callback: function(value) {
					eventTime = value;
					$.eventTimeValue.text = Utils.formatDateTime(value);
					$.saveButton.enabled = true;
				}
		}).getView().open();
		break;
	}
}
