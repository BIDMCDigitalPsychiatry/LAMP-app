var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var anchorDate = new Date();
anchorDate.setHours(0, 0, 0, 0); // midnight

var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);

var endDate = new Date();

function updateTableFromStatisticsCollection(statisticsCollection) {
	$.tableView.data = null;
	statisticsCollection.statistics.forEach(function(statistics) {
		var quantity, stepCount;

		quantity = statistics.getSumQuantity();

		stepCount =
				quantity.valueForUnit(TiHealthkit.createUnit('count'));

		$.tableView.appendRow({
			title: Utils.formatDate(statistics.startDate) + ' ' + stepCount
		});
	});

	// Alternative method using enumeration:
	//	
	// statisticsCollection.enumerateStatistics({
		// startDate: startDate,
		// endDate: endDate,
		// enumerator: function(statistics) {
			// var quantity, stepCount;
			// quantity = statistics.getSumQuantity();
			// if (quantity) {
				// stepCount =
						// quantity.valueForUnit(TiHealthkit.createUnit('count'));
			// } else {
				// stepCount = 'None';
			// }
			// $.tableView.appendRow({
				// title: Utils.formatDate(statistics.startDate) + ' ' + stepCount
			// });
			// return false;
		// } 
	// });
	
	Utils.log('The following sources contributed to these statistics:');
	statisticsCollection.sources.forEach(function(source) {
		Utils.log(source.bundleIdentifier);
	});
}

function onInitialResults(e) {
	if (e.errorCode !== undefined) {
		Utils.showError(e);
	} else {
		updateTableFromStatisticsCollection(e.statisticsCollection);
	}
}

function onStatisticsUpdate(e) {
	if (e.errorCode !== undefined) {
		Utils.showError(e);
	} else {
		var updatedStatistics;
		
		if (e.statistics) {
			Utils.log('Received updated statistics for day ' +
						Utils.formatDate(e.statistics.startDate));
			
			updatedStatistics =
						e.statisticsCollection.getStatisticsForDate(
							e.statistics.startDate);
			Utils.log('Updated value: ' +
							updatedStatistics
								.getSumQuantity()
								.valueForUnit(TiHealthkit.createUnit('count')));
		}
		updateTableFromStatisticsCollection(e.statisticsCollection);
	}	
}

var query = TiHealthkit.createStatisticsCollectionQuery({
	type: TiHealthkit.OBJECT_TYPE_STEP_COUNT,
	filter: TiHealthkit.createFilterForSamples({
		startDate: startDate,
		endDate: endDate
	}),
	options: TiHealthkit.STATISTICS_OPTION_CUMULATIVE_SUM,
	anchorDate: anchorDate,
	interval: 3600*24, // 24 hours
	onInitialResults: onInitialResults,
	onStatisticsUpdate: onStatisticsUpdate
});

Utils.log('Statistics collection query anchor date: ' + query.anchorDate);
Utils.log('Statistics collection query interval: ' + query.interval + ' secs');
Utils.log('Statistics collection query is for cummulative sum: ' +
			(query.options === TiHealthkit.STATISTICS_OPTION_CUMULATIVE_SUM));
TiHealthkit.executeQuery(query);

function onWindowClose() {
	TiHealthkit.stopQuery(query);
}