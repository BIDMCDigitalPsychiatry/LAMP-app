// Parameters of controller:
//	navWin: The navigation controller window.
//	title: Title of the window.
//	value: Original value of the time picker.
//	callback: Function to call with user selected date/time.

var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

$.title.text = controllerParams.title;

if (controllerParams.value !== undefined) {
	$.picker.value = controllerParams.value;
}

var value = $.picker.value;

function onPickerChange(e) {
	$.saveButton.enabled = true;
	value = e.value;
}

function onCancelClick() {
	$.win.close();
}

function onSaveClick() {
	controllerParams.callback(value);
	$.win.close();
}