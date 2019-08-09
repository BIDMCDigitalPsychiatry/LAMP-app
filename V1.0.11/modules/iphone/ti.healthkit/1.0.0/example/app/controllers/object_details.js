// Parameters of controller:
//	navWin: The navigation controller window.
//	object: The Ti.Healthkit.Object to be displayed.
//	preferredUnit: A Ti.Healthkit.Unit object, the preferred unit for
//		displaying the quantity associated with this object. Optional; only
//		needed if the object has an associated quantity.
var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var BUTTON_TITLE_ADD_SAMPLE_TO_WORKOUT = 'Add Sample To Workout';

var obj = controllerParams.object;

function addOutputLine(str) {
	$.textArea.value = $.textArea.value + '\n' + str;
}

//
// Ti.Healthkit object properties
//

addOutputLine('UUID: ' + obj.UUID);

Object.keys(obj.metadata).forEach(function(key) {
	addOutputLine('Metadata ' + key + ': ' + obj.metadata[key]);
});

addOutputLine('Source boundle ID: ' + obj.source.bundleIdentifier);
addOutputLine('Source boundle name: ' + obj.source.name);

//
// Ti.Healthkit.Sample properties
//
if (obj.startDate !== undefined) {
	addOutputLine('Start date: ' + Utils.formatDateTime(obj.startDate));
}

if (obj.endDate !== undefined) {
	addOutputLine('End date: ' + Utils.formatDateTime(obj.endDate));
}

if (obj.sampleType !== undefined) {
	addOutputLine('Sample type: ' + Utils.objectNameForType(obj.sampleType));
}

//
// Ti.Healthkit.QuantitySample properties
//
if (obj.quantity !== undefined) {
	if (controllerParams.preferredUnit === undefined) {
		addOutputLine('Object has quantity; preferred unit was not defined.');
	} else {
		addOutputLine('Quantity: ' + obj.quantity.valueForUnit(controllerParams.preferredUnit) + ' ' + controllerParams.preferredUnit);
	}
}

if (obj.aggregationStyle !== undefined) {
	switch (obj.aggregationStyle) {
		case TiHealthkit.QUANTITY_AGGREGATION_STYLE_CUMULATIVE:
			addOutputLine('Aggregation style is cumulative.');
			break;
		case TiHealthkit.QUANTITY_AGGREGATION_STYLE_DISCRETE:
			addOutputLine('Aggregation style is discrete.');
			break;
	}
}

//
// Workout properties
//

if (obj.activityType !== undefined) {
	addOutputLine('Activity: ' + Utils.workoutActivityNameForType(obj.activityType));
}

if (obj.duration !== undefined) {
	addOutputLine('Duration: ' + obj.duration + ' secs');
} 

if (obj.totalDistance !== undefined) {
	addOutputLine('Total distance: ' + obj.totalDistance.valueForUnit(TiHealthkit.createUnit('m')) + ' meters');
}

if (obj.totalEnergyBurned !== undefined) {
	addOutputLine('Total energy burned: ' + obj.totalEnergyBurned.valueForUnit(TiHealthkit.createUnit('J')) + ' Joules');
}

if (obj.sampleType === TiHealthkit.OBJECT_TYPE_WORKOUT) {
	Utils.log('This is a workout object; will query for associated samples.');
	TiHealthkit.executeQuery(TiHealthkit.createSampleQuery({
		type: TiHealthkit.OBJECT_TYPE_DISTANCE_WALKING_RUNNING,
		filter: TiHealthkit.createFilterForObjects({
			workout: obj
		}),
		onCompletion: function(e) {
			Utils.log('Found ' + e.results.length + ' "distance walking/running" samples.');
			if (e.results.length === 0) {
				addOutputLine('This workout has no associated "distance walking/running" sample.');
			}
			e.results.forEach(function(sample) {
				addOutputLine('Distance walking/running sample: ' + sample.quantity.valueForUnit(TiHealthkit.createUnit('m')) + ' meters');
			});
		}
	}));
	TiHealthkit.executeQuery(TiHealthkit.createSampleQuery({
		type: TiHealthkit.OBJECT_TYPE_ACTIVE_ENERGY_BURNED,
		filter: TiHealthkit.createFilterForObjects({
			workout: obj
		}),
		onCompletion: function(e) {
			Utils.log('Found ' + e.results.length + ' "energy burned" samples.');
			if (e.results.length === 0) {
				addOutputLine('This workout has no associated "energy burned" sample.');
			}
			e.results.forEach(function(sample) {
				addOutputLine('Energy burned sample: ' + sample.quantity.valueForUnit(TiHealthkit.createUnit('J')) + ' Joules');
			});
		}
	}));
}

if (obj.workoutEvents !== undefined) {
	addOutputLine('Workout has ' + obj.workoutEvents.length + ' events.');
	obj.workoutEvents.forEach(function(event) {
		addOutputLine(Utils.workoutEventToString(event));
	});
}
//
// Sleep analysis
//

if (obj.sampleType === TiHealthkit.OBJECT_TYPE_SLEEP_ANALYSIS) {
	addOutputLine('Sleep analysis: ' +
								Utils.sleepAnalysisNameForValue(obj.value));
}


//
// Correlations
//

if (obj.objects !== undefined) {
	addOutputLine('Correlation contains ' + obj.objects.length + ' objects.');
	
	[
		{
			type: TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC,
			unit: TiHealthkit.createUnit('mmHg')
		},
		{
			type: TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_DIASTOLIC,
			unit: TiHealthkit.createUnit('mmHg')
		},
		{
			type: TiHealthkit.OBJECT_TYPE_DIETARY_SUGAR,
			unit: TiHealthkit.createUnit('g')
		},
		{
			type: TiHealthkit.OBJECT_TYPE_DIETARY_PROTEIN,
			unit: TiHealthkit.createUnit('g')
		},
		{
			type: TiHealthkit.OBJECT_TYPE_DIETARY_FAT_TOTAL,
			unit: TiHealthkit.createUnit('g')
		}
	].forEach(function(descriptor) {
		obj.objectsForType(descriptor.type).forEach(
			function(object) {
				addOutputLine(Utils.objectNameForType(descriptor.type) + ': ' +
				object.quantity.valueForUnit(descriptor.unit) + descriptor.unit);
		});
	});
}
function onDeleteClick(e) {
	TiHealthkit.deleteObject({
		object: controllerParams.object,
		onCompletion: function(e) {
			if (e.success) {
				$.win.close();
			} else {
				Utils.showError(e);
			}
		}
	});
}