var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

function onTableViewClick(e) {
	var query;
	
	if (TiHealthkit.isHealthDataAvailable === false) {
		// HealthKit is not available on iPad...
		alert('Health data is not available on this device!');
		return;
	}

	switch (e.row.title) {
		case 'Max Weight':
			query = TiHealthkit.createStatisticsQuery({
				type: TiHealthkit.OBJECT_TYPE_BODY_MASS,
				options: TiHealthkit.STATISTICS_OPTION_DISCRETE_MAX,
				onCompletion: function(e) {
					if (e.result) {
						controllerParams.navWin.openWindow(
							Alloy.createController(
								'statistics_details',
								{
									navWin: controllerParams.navWin,
									statistics: e.result
								}
							).getView());
					} else {
						alert('Did not find any weight data.');
					}
				}
			});
			break;
		case 'Max Weight by Source':
			/*jslint bitwise: true */
			query = TiHealthkit.createStatisticsQuery({
				type: TiHealthkit.OBJECT_TYPE_BODY_MASS,
				
				options: TiHealthkit.STATISTICS_OPTION_DISCRETE_MAX |
							TiHealthkit.STATISTICS_OPTION_SEPARATE_BY_SOURCE,
				onCompletion: function(e) {
					if (e.result) {
						controllerParams.navWin.openWindow(
							Alloy.createController(
								'statistics_details',
								{
									navWin: controllerParams.navWin,
									statistics: e.result,
									separatedBySource: true
								}
							).getView());
					} else {
						alert('Did not find any weight data.');
					}
				}
			});
			/*jslint bitwise: false */
			break;
		case 'Min Weight':
			query = TiHealthkit.createStatisticsQuery({
				type: TiHealthkit.OBJECT_TYPE_BODY_MASS,
				options: TiHealthkit.STATISTICS_OPTION_DISCRETE_MIN,
				onCompletion: function(e) {
					if (e.result) {
						controllerParams.navWin.openWindow(
							Alloy.createController(
								'statistics_details',
								{
									navWin: controllerParams.navWin,
									statistics: e.result
								}
							).getView());
					} else {
						alert('Did not find any weight data.');
					}
				}
			});
			break;
		case 'Average Weight':
			query = TiHealthkit.createStatisticsQuery({
				type: TiHealthkit.OBJECT_TYPE_BODY_MASS,
				options: TiHealthkit.STATISTICS_OPTION_DISCRETE_AVERAGE,
				onCompletion: function(e) {
					if (e.result) {
						controllerParams.navWin.openWindow(
							Alloy.createController(
								'statistics_details',
								{
									navWin: controllerParams.navWin,
									statistics: e.result
								}
							).getView());
					} else {
						alert('Did not find any weight data.');
					}
				}
			});
			break;
		case 'Total Calories Burned':
			query = TiHealthkit.createStatisticsQuery({
				type: TiHealthkit.OBJECT_TYPE_ACTIVE_ENERGY_BURNED,
				options: TiHealthkit.STATISTICS_OPTION_CUMULATIVE_SUM,
				onCompletion: function(e) {
					if (e.result) {
						controllerParams.navWin.openWindow(
							Alloy.createController(
								'statistics_details',
								{
									navWin: controllerParams.navWin,
									statistics: e.result
								}
							).getView());
					} else {
						alert('Did not find any exercise data.');
					}
				}
			});
			break;
	}
	
	if (query) {
		TiHealthkit.executeQuery(query);
	}
}