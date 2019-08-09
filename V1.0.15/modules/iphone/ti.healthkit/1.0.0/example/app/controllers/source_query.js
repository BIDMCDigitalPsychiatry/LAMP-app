var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var selectedType = Utils.OBJECT_TYPES[0].type;

function onSearchClick() {
	TiHealthkit.executeQuery(TiHealthkit.createSourceQuery({
		type: selectedType,
		onCompletion: function(e) {
			var nextWin;
			
			if (e.errorCode === undefined) {
				nextWin = Alloy.createController(
					'source_list',
					{
						navWin: controllerParams.navWin,
						sources: e.results
					}
				).getView();
				controllerParams.navWin.openWindow(nextWin);

			} else {
				Utils.showError(e);
			}
		}
	}));
}

function onTypePickerChange(e) {
	selectedType = Utils.OBJECT_TYPES[e.rowIndex].type;
}

var pickerRows = [];
Utils.OBJECT_TYPES.forEach(function(typeDescriptor) {
	pickerRows.push(Ti.UI.createPickerRow({ title: typeDescriptor.name }));
});

$.typePicker.add(pickerRows);