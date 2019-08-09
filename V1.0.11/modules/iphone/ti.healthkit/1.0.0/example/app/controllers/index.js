var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');
var BackgroundQueries = require('background_queries');

function onTableViewClick(e) {
	var nextWin;
	
	if (TiHealthkit.isHealthDataAvailable === false) {
		// HealthKit is not available on iPad...
		alert('Health data is not available on this device!');
		return;
	}

	switch (e.row.title) {
		case 'Authorization':
			nextWin = Alloy.createController('authorization').getView();
			break;
		case 'Basics':
			nextWin = Alloy.createController('basics').getView();
			break;
		case 'Quantities and Units':
			nextWin = Alloy.createController('quantities_and_units', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Quantity Samples':
			nextWin = Alloy.createController('quantity_samples', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Workouts':
			nextWin = Alloy.createController('workouts', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Sleep Analysis':
			nextWin = Alloy.createController('sleep_analysis', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Correlations':
			nextWin = Alloy.createController('correlations', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Observer Queries':
			nextWin = Alloy.createController('observer_queries', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Correlation Queries':
			nextWin = Alloy.createController('correlation_queries', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Statistics':
			nextWin = Alloy.createController('statistics', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Filter Tests':
			nextWin = Alloy.createController('filter_tests', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Source Query':
			nextWin = Alloy.createController('source_query', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Statistics Collection Query':
			nextWin = Alloy.createController('statistics_collection_query', {
				navWin: $.navWin
			}).getView();
			break;
		case 'Background Delivery':
			nextWin = Alloy.createController('background_delivery', {
				navWin: $.navWin
			}).getView(); 
			break;
	}
	
	if (nextWin) {
		$.navWin.openWindow(nextWin);
	}
}

$.navWin.open();

// NOTE: If background delivery is enabled, the app may have been started
// due to an update in the HealthKit Store. This happens if the app is
// killed (as opposed to just put into the background), or the phone is
// rebooted after the app enabled background delivery.

if (Ti.App.Properties.getBool('BACKGROUND_DELIVERY_ENABLED')
	&& TiHealthkit.isAppInBackground())
{
	Utils.log('Started into background with background delivery enabled.');
	
	BackgroundQueries.setHeartRateCallback(function(e) {
		if (e.errorCode !== undefined) {
			Utils.log('Background delivery of heart rate data failed!');
			return;		
		}
		Utils.log('Background delivery of heart rate data succeeded!');
		
		var unit = TiHealthkit.createUnit('count/min');

		e.samples.forEach(function(sample, index) {
			Utils.log(index + '. ' + sample.quantity.valueForUnit(unit) + '/min');
		});
	});
	BackgroundQueries.startHeartRateObserverQuery();
	
	// NOTE: The app only has about 10 seconds to boot and complete the handling
	// of background data delivery. If time runs out, execution is suspended
	// until the next background data delivery.
}

function onUserPrefChanged(e) {
	Utils.log('Received userPreferencesChanged event!');
	TiHealthkit.removeEventListener('userPreferencesChanged', onUserPrefChanged);
}

TiHealthkit.addEventListener('userPreferencesChanged', onUserPrefChanged);
