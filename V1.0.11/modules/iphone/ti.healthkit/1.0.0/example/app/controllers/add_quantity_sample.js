var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

function setBodyWeight(params) {
	// params:
	//	value: A number representing the weight of the user.
	//	unit: A Ti.Healthkit.Unit object. Optional; defaults to pounds.
	
	var unit, quantity, bodyWeight, timestamp;
	
	timestamp = new Date();
	
	if (params.unit) {
		unit = params.unit;
	} else {
		unit = TiHealthkit.createUnit('lb');
	}
	
	quantity = TiHealthkit.createQuantity(params.value, unit);
	bodyWeight = TiHealthkit.createQuantitySample({
		type: TiHealthkit.OBJECT_TYPE_BODY_MASS,
		quantity: quantity,
		startDate: timestamp,
		endDate: timestamp,
		metadata: {
			'CustomMetadataKey' : 'Custom Weight Metadata Value',
			'DateMetaKey': new Date('2014-02-01')
		}

	});

	TiHealthkit.saveObjects({
		objects: [ bodyWeight ],
		onCompletion: function(e) {
			if (e.success) {
				alert('Saved body weight');
			} else {
				Utils.showError(e);
			}
		}
	});
}

function setHeight(params) {
	// params:
	//	value: A number representing the height of the user.
	//	unit: A Ti.Healthkit.Unit object. Optional; defaults to inches.
	
	var unit, quantity, height, timestamp;
	
	timestamp = new Date();
	
	if (params.unit) {
		unit = params.unit;
	} else {
		unit = TiHealthkit.createUnit('in');
	}
	
	quantity = TiHealthkit.createQuantity(params.value, unit);
	height = TiHealthkit.createQuantitySample({
		type: TiHealthkit.OBJECT_TYPE_HEIGHT,
		quantity: quantity,
		startDate: timestamp,
		endDate: timestamp,
		metadata: {
			'CustomMetadataKey' : 'Custom Height Metadata Value'
		}
	});

	TiHealthkit.saveObjects({
		objects: [ height ],
		onCompletion: function(e) {
			if (e.success) {
				alert('Saved height');
			} else {
				Utils.showError(e);
			}
		}
	});
}

function onInputButtonClick(e) {
	var valueWithUnit;
	Utils.log('Clicked ' + e.source.id);
	switch (e.source.id) {
		case 'bodyWeightSetButton':
			valueWithUnit = Utils.parseValueWithUnit($.bodyWeightInput.value);
			setBodyWeight(valueWithUnit);
			break;
		case 'heightSetButton':
			valueWithUnit = Utils.parseValueWithUnit($.heightInput.value);
			setHeight(valueWithUnit);
			break;
	}
}
