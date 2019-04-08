var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

function onTableViewClick(e) {
	var nextWin, filter, startDate, endDate;
	
	// See object_details.js for an example usage of
	// createFilterForObjects({ workout: <TiHealthkitWorkoutProxy>)

	// See quantity_samples.js for an example usage of
	// createFilterForObjects({ sources: <array of Ti.HealthkitSourc objects>)

	switch (e.row.title) {
		case 'UUID Filter':
			nextWin = Alloy.createController('uuid_filter', {
				navWin: controllerParams.navWin
			}).getView();
			break;
		case 'Metadata Filter':
			filter = TiHealthkit.createFilterForObjects({
				metadata: {
					key: 'CustomMetadataKey',
					allowedValues: [ 'Custom Weight Metadata Value' ]
				}
			});

			nextWin = Alloy.createController(
				'query_objects',
				{
					navWin: controllerParams.navWin,
					title: 'Objects by Metadata',
					type: TiHealthkit.OBJECT_TYPE_BODY_MASS,
					filter: filter
				}
			).getView();

			break;
		case 'No Correlation Filter':
			// NOTE: This example uses dietary sugar objects to demonstrate
			// no-correlation queries. Dietary sugar objects are usually
			// added as part of a food correlations.
			//
			// Comment out the following 'saveObjects' invocation if you wish
			// to create a sugar object without correlation. 
			// TiHealthkit.saveObjects({
				// objects: [TiHealthkit.createQuantitySample({
				// type: TiHealthkit.OBJECT_TYPE_DIETARY_SUGAR,
				// quantity: TiHealthkit.createQuantity(666, TiHealthkit.createUnit('g')),
				// startDate: new Date(),
				// endDate: new Date()
			// })]});

			filter = TiHealthkit.createFilterForObjectsWithNoCorrelation();

			nextWin = Alloy.createController(
				'query_objects',
				{
					navWin: controllerParams.navWin,
					title: 'No Correlation',
					type: TiHealthkit.OBJECT_TYPE_DIETARY_SUGAR,
					filter: filter
				}
			).getView();

			break;
		case 'Sample Filter':
			// Will display workouts that started within the last month.
			startDate = new Date();
			endDate = new Date(startDate);
			startDate.setMonth(startDate.getMonth()-1);
			
			filter = TiHealthkit.createFilterForSamples({
				startDate: startDate,
				endDate: endDate,
				options: TiHealthkit.QUERY_OPTION_STRICT_START_DATE
			});

			nextWin = Alloy.createController(
				'workouts',
				{
					navWin: controllerParams.navWin,
					filter: filter
				}
			).getView();
			
			break;
		case 'Category Sample Filter':
			filter = TiHealthkit.createFilterForCategorySamples({
				operator: TiHealthkit.FILTER_OPERATOR_EQUAL_TO,
				value: TiHealthkit.CATEGORY_VALUE_SLEEP_ANALYSIS_IN_BED
			});

			nextWin = Alloy.createController(
				'sleep_analysis',
				{
					navWin: controllerParams.navWin,
					filter: filter
				}
			).getView();

			
			break;
		case 'Workout Filters':
			nextWin = Alloy.createController(
				'workout_filters',
				{
					navWin: controllerParams.navWin
				}
			).getView();

			break;
		default:
			alert('Not yet implemented!');
			return;
	}
	controllerParams.navWin.openWindow(nextWin);
}