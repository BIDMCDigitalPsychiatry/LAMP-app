var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

function onAddClick(e) {
	controllerParams.navWin.openWindow(
				Alloy.createController('add_quantity_sample').getView());
}

function onTableViewClick(e) {
	var title, type, filter, nextWin;
	
	switch (e.row.title) {
		case 'All Weight':
			title = 'All Body Weight';
			type = TiHealthkit.OBJECT_TYPE_BODY_MASS;
			break;
		case 'Weight Created By App':
			title = 'Weight Created By App';
			type = TiHealthkit.OBJECT_TYPE_BODY_MASS;
			filter = TiHealthkit.createFilterForObjects({
				sources: [ TiHealthkit.defaultSource ]
			});
			break;
		case 'All Height':
			title = 'All Height';
			type = TiHealthkit.OBJECT_TYPE_HEIGHT;
			break;
		case 'Height Created By App':
			title = 'Height Created By App';
			type = TiHealthkit.OBJECT_TYPE_HEIGHT;
			filter = TiHealthkit.createFilterForObjects({
				sources: [ TiHealthkit.defaultSource ]
			});
			break;
		case 'Workouts':
			title = 'Workouts';
			type = TiHealthkit.OBJECT_TYPE_WORKOUT;
			break;
	}
	nextWin = Alloy.createController(
				'query_objects',
				{
					navWin: controllerParams.navWin,
					title: title,
					type: type,
					filter: filter
				}
			).getView();
	controllerParams.navWin.openWindow(nextWin);
}