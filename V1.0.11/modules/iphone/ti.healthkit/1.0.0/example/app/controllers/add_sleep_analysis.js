// Parameters of controller:
//	navWin: The navigation controller window.

var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var sleepAnalysisValue, startDate, endDate;

function onTableViewClick(e) {
	$.inBedRow.hasCheck = e.index === 0;
	$.asleepRow.hasCheck = e.index !== 0;
	
	if (e.index === 0) {
		sleepAnalysisValue = TiHealthkit.CATEGORY_VALUE_SLEEP_ANALYSIS_IN_BED;
	} else {
		sleepAnalysisValue = TiHealthkit.CATEGORY_VALUE_SLEEP_ANALYSIS_ASLEEP;
	}
	
	if (startDate !== undefined && endDate !== undefined) {
		$.saveButton.enabled = true;
	}
}

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
				if (sleepAnalysisValue !== undefined &&
					startDate !== undefined &&
					endDate !== undefined
				) {
					$.saveButton.enabled = true;
				}

			}
	}).getView().open();
}

function onSaveClick() {
	TiHealthkit.saveObjects({
		objects: [
			TiHealthkit.createCategorySample({
				type: TiHealthkit.OBJECT_TYPE_SLEEP_ANALYSIS,
				value: sleepAnalysisValue,
				startDate: startDate,
				endDate: endDate,
				metadata: {
					myMetadata: 'My Metadata Value'
				}
			})
		],
		onCompletion: function(e) {
			if (e.success) {
				$.win.close();
			} else {
				Utils.showError(e);
			}
		}
	});
}
