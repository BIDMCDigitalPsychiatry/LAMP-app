var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var startDate, endDate, workoutEvents;

workoutEvents = [];

function onTimeTableClick(tableClick) {
	Alloy.createController('time_picker', {
			navWin: controllerParams.navWin,
			title: tableClick.index ? 'Pick End Date' : 'Pick Start Date',
			value: tableClick.index ? endDate : startDate,
			callback: function(value) {
				Utils.log('Picker value: ' + value);
				switch (tableClick.index) {
					case 0:
						startDate = value;
						$.startDateValue.text = Utils.formatDateTime(value);
						break;
					case 1:
						endDate = value;
						$.endDateValue.text = Utils.formatDateTime(value);
						break;
				}
				if (startDate !== undefined &&
					endDate !== undefined
				) {
					$.saveButton.enabled = true;
				}

			}
	}).getView().open();
}

function onAddEventButtonClick() {
	if (startDate === undefined || endDate === undefined) {
		alert('Please select start and end date first.');
		return;
	}
	
	if ($.durationInput.value !== '') {
		alert('Please remove duration if you wish to add events.');
		return;
	}
	
	Alloy.createController(
		'add_workout_event',
		{
			startDate: startDate,
			endDate: endDate,
			onSuccess: function(e) {
				var eventRows;
				
				$.durationParent.visible = false;
				workoutEvents.push(e.workoutEvent);
				
				eventRows = [];
				workoutEvents.forEach(function(event) {
					eventRows.push(Ti.UI.createTableViewRow({
						title: Utils.workoutEventToString(event)
					}));
				});
				
				$.eventTable.data = eventRows;
				$.eventTable.height = eventRows.length * 40;
			}
		}
	).getView().open();
}
function onSaveClick() {
	var params, workout;
	
	params = {
		type: Utils.WORKOUT_TYPES[$.typePicker.getSelectedRow(0).id].type,
		startDate: startDate,
		endDate: endDate
	};
	
	if ($.durationInput.value !== '') {
		params.duration = parseFloat($.durationInput.value, 10);
	} else {
		if (workoutEvents.length > 0) {
			params.workoutEvents = workoutEvents;
		}
	}

	if ($.energyInput.value !== '') {
		params.totalEnergyBurned = TiHealthkit.createQuantity(
									parseFloat($.energyInput.value, 10),
									TiHealthkit.createUnit('J'));
	}

	if ($.distanceInput.value !== '') {
		params.totalDistance = TiHealthkit.createQuantity(
									parseFloat($.distanceInput.value, 10),
									TiHealthkit.createUnit('m'));
	}

	try {
		workout = TiHealthkit.createWorkout(params);
		TiHealthkit.saveObjects({
			objects: [ workout ],
			onCompletion: function(e) {
				var samples = [];
				
				if (e.success) {
					Utils.log('Adding of workout succeeded.');
					if (params.totalEnergyBurned) {
						samples.push(TiHealthkit.createQuantitySample({
							type: TiHealthkit.OBJECT_TYPE_ACTIVE_ENERGY_BURNED,
							quantity: params.totalEnergyBurned,
							startDate: startDate,
							endDate: endDate
						}));
					}
					
					if (params.totalDistance) {
						samples.push(TiHealthkit.createQuantitySample({
							type: TiHealthkit.OBJECT_TYPE_DISTANCE_WALKING_RUNNING,
							quantity: params.totalDistance,
							startDate: startDate,
							endDate: endDate
						}));
					}
					
					if (samples.length > 0) {
						Utils.log('Will try to add ' + samples.length + ' sample(s) to workout.');
						TiHealthkit.addSamplesToWorkout({
							samples: samples,
							workout: workout,
							onCompletion: function(e) {
								if (e.success) {
									Utils.log('Adding of workout samples succeeded.');
									$.win.close();
								} else {
									Utils.log('Adding of workout samples failed.');
									Utils.showError(e);
								}
							}
						});
					} else {
						$.win.close();
					}
				} else {
					Utils.showError(e);
				}
			}
		});
	}
	catch(e) {
		Utils.showException(e);
	}
}

var rows = [];

Utils.WORKOUT_TYPES.forEach(function (workoutType, index) {
	rows.push(Ti.UI.createPickerRow({ title: workoutType.name, id: index }));
});

$.typePicker.add(rows);
