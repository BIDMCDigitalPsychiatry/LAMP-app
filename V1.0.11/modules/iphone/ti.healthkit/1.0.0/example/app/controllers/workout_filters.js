var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var selectedOperator = Utils.FILTER_OPERATORS[0].type;
var selectedType = Utils.WORKOUT_TYPES[0].type;

function onSearchButtonClick(e) {
	var filter, nextWin, valueWithUnit;

	switch (e.source) {
		case $.durationButton:
			filter = TiHealthkit.createFilterForWorkouts({
				operator: selectedOperator,
				duration: parseFloat($.durationInput.value, 10)
			});
			break;
		case $.distanceButton:
			valueWithUnit = Utils.parseValueWithUnit($.distanceInput.value);
			if (valueWithUnit.unit === undefined) {
				valueWithUnit.unit = TiHealthkit.createUnit('ft');
			}
			filter = TiHealthkit.createFilterForWorkouts({
				operator: selectedOperator,
				distance: TiHealthkit.createQuantity(
								valueWithUnit.value, valueWithUnit.unit)
			});
			break;
		case $.energyButton:
			valueWithUnit = Utils.parseValueWithUnit($.energyInput.value);
			if (valueWithUnit.unit === undefined) {
				valueWithUnit.unit = TiHealthkit.createUnit('J');
			}
			filter = TiHealthkit.createFilterForWorkouts({
				operator: selectedOperator,
				energy: TiHealthkit.createQuantity(
								valueWithUnit.value, valueWithUnit.unit)
			});
			break;
		case $.typeButton:
			filter = TiHealthkit.createFilterForWorkouts({
				type: selectedType
			});
		
			break;
	}
	nextWin = Alloy.createController(
		'workouts',
		{
			navWin: controllerParams.navWin,
			filter: filter
		}
	).getView();
	controllerParams.navWin.openWindow(nextWin);
}

function onPickerChange(e) {
	if (e.source === $.operatorPicker) {
		selectedOperator = Utils.FILTER_OPERATORS[e.rowIndex].type;
	}
	if (e.source === $.typePicker) {
		selectedType = Utils.WORKOUT_TYPES[e.rowIndex].type;
	}
}

var pickerRows = [];

Utils.FILTER_OPERATORS.forEach(function(opDescriptor) {
	pickerRows.push(Ti.UI.createPickerRow({ title: opDescriptor.name }));
});
$.operatorPicker.add(pickerRows);

pickerRows = [];

Utils.WORKOUT_TYPES.forEach(function(typeDescriptor) {
	pickerRows.push(Ti.UI.createPickerRow({ title: typeDescriptor.name }));
});
$.typePicker.add(pickerRows);

