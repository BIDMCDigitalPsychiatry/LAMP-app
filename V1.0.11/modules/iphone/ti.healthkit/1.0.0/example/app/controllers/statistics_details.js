// Parameters of controller:
//	navWin: The navigation controller window.
//	statistics: The Ti.Healthkit.Statistics to be displayed.
//	separatedBySource: Boolean; true if the statistics are separated by source.
var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var statistics = controllerParams.statistics;

function addOutputLine(str) {
	$.textArea.value = $.textArea.value + '\n' + str;
}

addOutputLine('Start date: ' + Utils.formatDateTime(statistics.startDate));
addOutputLine('End date: ' + Utils.formatDateTime(statistics.endDate));
addOutputLine('Sample type: ' + Utils.objectNameForType(statistics.quantityType));

TiHealthkit.preferredUnitsForQuantityTypes({
	types: [ statistics.quantityType ],
	onCompletion: function(e) {
		var unit, items;
		
		function printItem(item, source) {				
			var quantity;
			
			if (source) {
				quantity = item.getter(source);
			} else {
				quantity = item.getter();
			}
			
			if (quantity !== undefined) {
				addOutputLine(
						item.name + ': ' +
								quantity.valueForUnit(unit) +
								unit.toString());
			} else {
				addOutputLine(item.name + ' is undefined.');
			}
		}
		
		if (e.errorCode !== undefined) {
			Utils.showError(e);
		} else {
			unit = e.preferredUnits[statistics.quantityType];
			
			items = [
				{
					name: 'Max',
					getter: statistics.getMaximumQuantity
				},
				{
					name: 'Min',
					getter: statistics.getMinimumQuantity
				},
				{
					name: 'Average',
					getter: statistics.getAverageQuantity
				},
				{
					name: 'Sum',
					getter: statistics.getSumQuantity
				}
			];
			
			if (controllerParams.separatedBySource) {
				statistics.sources.forEach(function(source) {
					addOutputLine('\nSource: ' + source.name);
					items.forEach(function(item) {
						printItem(item, source);
					});
				});
			} else {
				items.forEach(function(item) {
					printItem(item);
				});
			}
		}
	}
});