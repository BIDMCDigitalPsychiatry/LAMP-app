var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

function onAddBloodPressureButtonClick(e) {
	var timestamp, mmHg, correlation, systolic, diastolic;
	
	timestamp = new Date();
	mmHg = TiHealthkit.createUnit('mmHg');
	
	systolic = TiHealthkit.createQuantitySample({
		type: TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC,
		quantity: TiHealthkit.createQuantity(parseFloat($.systolicInput.value, 10), mmHg),
		startDate: timestamp,
		endDate: timestamp
	});
	diastolic = TiHealthkit.createQuantitySample({
		type: TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC,
		quantity: TiHealthkit.createQuantity(parseFloat($.diastolicInput.value, 10), mmHg),
		startDate: timestamp,
		endDate: timestamp
	});
	correlation = TiHealthkit.createCorrelation({
		type: TiHealthkit.OBJECT_TYPE_CORRELATION_BLOOD_PRESSURE,
		startDate: timestamp,
		endDate: timestamp,
		objects: [ systolic, diastolic ]
	});
	
	TiHealthkit.saveObjects({
		objects: [ correlation ],
		onCompletion: function(e) {
			if (e.success) {
				$.win.close();
			} else {
				Utils.showError(e);
			}
		}
	});
}

function onAddFoodButtonClick(e) {
	var timestamp, g, correlation, sugar, protein, fat, metadata;

	timestamp = new Date();
	g = TiHealthkit.createUnit('g'); // Creates a gram unit
	
	metadata = {};
	// It is recommended that food entries have the name of the food
	// among their metadata.
	metadata[TiHealthkit.METADATA_KEY_FOOD_TYPE] = $.foodName.value;

	sugar = TiHealthkit.createQuantitySample({
		type: TiHealthkit.OBJECT_TYPE_DIETARY_SUGAR,
		quantity: TiHealthkit.createQuantity(parseFloat($.sugarInput.value, 10), g),
		startDate: timestamp,
		endDate: timestamp
	});
	
	protein = TiHealthkit.createQuantitySample({
		type: TiHealthkit.OBJECT_TYPE_DIETARY_PROTEIN,
		quantity: TiHealthkit.createQuantity(parseFloat($.proteinInput.value, 10), g),
		startDate: timestamp,
		endDate: timestamp
	});
	
	fat = TiHealthkit.createQuantitySample({
		type: TiHealthkit.OBJECT_TYPE_DIETARY_FAT_TOTAL,
		quantity: TiHealthkit.createQuantity(parseFloat($.fatInput.value, 10), g),
		startDate: timestamp,
		endDate: timestamp
	});
	
	correlation = TiHealthkit.createCorrelation({
		type: TiHealthkit.OBJECT_TYPE_CORRELATION_FOOD,
		startDate: timestamp,
		endDate: timestamp,
		objects: [ sugar, protein, fat ],
		metadata: metadata
	});
	
	TiHealthkit.saveObjects({
		objects: [ correlation ],
		onCompletion: function(e) {
			if (e.success) {
				$.win.close();
			} else {
				Utils.showError(e);
			}
		}
	});
}