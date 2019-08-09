// Parameters of controller:
//	navWin: The navigation controller window.

var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var correlations;

function onTableViewClick(e) {
	controllerParams.navWin.openWindow(
				Alloy.createController(
					'object_details',
					{
						navWin: controllerParams.navWin,
						object: correlations[e.index]
					}
				).getView());	
}

function createRow(entry) {
	var row, view, tag, value;

	row = Ti.UI.createTableViewRow();
	
	view = Ti.UI.createView({ height: 40 });
	view.add(Ti.UI.createLabel({
		text: Utils.objectNameForType(entry.sampleType),
		top: 0, 
		left: 20,
		font: {
			fontSize: 14,
			fontWeight: 'bold'
		}
	}));
	
	view.add(Ti.UI.createLabel({
		text: Utils.formatDateTime(entry.startDate) +
				' (' + entry.objects.length + ' objects)',
		bottom: 0,
		left: 20,
		font: {
			fontSize: 12,
			fontWeight: 'normal'
		}
	}));
	
	tag = Ti.UI.createLabel({
		right: 10,
		top: 5,
		borderRadius: 5,
		font: {
			fontSize: 12,
			fontWeight: 'normal'
		},
		color: 'white'
	});
	
	if (entry.source.bundleIdentifier === TiHealthkit.defaultSource.bundleIdentifier) {
		tag.text = ' owned ';
		tag.backgroundColor = 'green';
	} else {
		tag.text = ' ' + entry.source.name + ' ';
		tag.backgroundColor = 'red';
	}
	view.add(tag);
	row.add(view);
	
	return row;
}

function refreshTable() {
	var rows = [];
	correlations.forEach(function(entry) {
		rows.push(createRow(entry));
	});
	
	$.tableView.data = rows;
}

function onWindowFocus() {
	var mmHg, sampleFilters, correlationQuery;
	
	mmHg = TiHealthkit.createUnit('mmHg');
	
	sampleFilters = {};
	sampleFilters[TiHealthkit.OBJECT_TYPE_BLOOD_PRESSURE_SYSTOLIC] =
			TiHealthkit.createFilterForQuantitySamples({
				operator: TiHealthkit.FILTER_OPERATOR_GREATER_THAN,
				quantity: TiHealthkit.createQuantity(120, mmHg)
			});

	correlationQuery = TiHealthkit.createCorrelationQuery({
			type: TiHealthkit.OBJECT_TYPE_CORRELATION_BLOOD_PRESSURE,
			sampleFilters: sampleFilters,
			onCompletion: function(e) {
				correlations = e.results;
				Utils.log('Found ' + e.results.length + ' blood pressure correlations');
				refreshTable();
			}
	});
	
	Utils.log('Correlation query type: ' + correlationQuery.correlationType);
	Object.keys(correlationQuery.sampleFilters).forEach(function(key) {
		Utils.log('Correlation query sample filter: ' 
					+ key + ' -> ' + correlationQuery.sampleFilters[key]);
	});
			
	TiHealthkit.executeQuery(correlationQuery);
}