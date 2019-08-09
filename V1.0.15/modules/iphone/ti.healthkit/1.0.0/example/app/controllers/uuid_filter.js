var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var selectedType = Utils.OBJECT_TYPES[0].type;

function onSearchClick() {
	var uuids, filter, nextWin;
	
	uuids = $.textArea.value.replace( / /g, '' ).split( '\n' );
	
	Utils.log('Found ' + uuids.length + ' UUIDs');
	
	filter = TiHealthkit.createFilterForObjects({
		uuids: uuids
	});

	nextWin = Alloy.createController(
				'query_objects',
				{
					navWin: controllerParams.navWin,
					title: 'Objects by UUID',
					type: selectedType,
					filter: filter
				}
			).getView();
	controllerParams.navWin.openWindow(nextWin);
}

function onTypePickerChange(e) {
	selectedType = Utils.OBJECT_TYPES[e.rowIndex].type;
}

var pickerRows = [];
Utils.OBJECT_TYPES.forEach(function(typeDescriptor) {
	pickerRows.push(Ti.UI.createPickerRow({ title: typeDescriptor.name }));
});

$.typePicker.add(pickerRows);