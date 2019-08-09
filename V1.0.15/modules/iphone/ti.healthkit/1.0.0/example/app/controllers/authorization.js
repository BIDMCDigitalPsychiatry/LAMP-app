var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

function createTypeAuthRow(objectType) {
	var self, parent, label, shareSwitch, readSwitch, authStatus;
	
	authStatus = TiHealthkit.getAuthorizationStatusForType(objectType.type);

	self = Ti.UI.createTableViewRow({
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	label = Ti.UI.createLabel({
		text: objectType.name,
		left: 10, width: '60%'
	});
	
	shareSwitch = Ti.UI.createSwitch({
		left: '60%',
		value: authStatus === TiHealthkit.AUTH_STATUS_SHARING_AUTHORIZED,
		enabled: authStatus !== TiHealthkit.AUTH_STATUS_SHARING_AUTHORIZED
	});
	readSwitch = Ti.UI.createSwitch({
		right: 5
	});
	
	switch (objectType.type) {
		case TiHealthkit.OBJECT_TYPE_NIKE_FUEL:
		case TiHealthkit.OBJECT_TYPE_BIOLOGICAL_SEX:
		case TiHealthkit.OBJECT_TYPE_BLOOD_TYPE:
		case TiHealthkit.OBJECT_TYPE_DATE_OF_BIRTH:
			// NOTE: These object types cannot be shared, only read.
			shareSwitch.enabled = false;
			break;
		case TiHealthkit.OBJECT_TYPE_CORRELATION_BLOOD_PRESSURE:
		case TiHealthkit.OBJECT_TYPE_CORRELATION_FOOD:
			// NOTE: Correlation types themselves don't need authorization.
			shareSwitch.enabled = false;
			readSwitch.enabled = false;
			break;
	}
	shareSwitch.addEventListener('change', function() {
		objectType.shareRequested = shareSwitch.value;
	});
	
	readSwitch.addEventListener('change', function() {
		objectType.readRequested = readSwitch.value;
	});
		
	parent = Ti.UI.createView({
		height: 40
	});
	parent.add(label);
	parent.add(shareSwitch);
	parent.add(readSwitch);
	self.add(parent);
	return self;
}

function updateTable() {
	var rows = [];

	$.tableView.data = [];
	
	Utils.OBJECT_TYPES.forEach(function(type) {
		rows.push(createTypeAuthRow(type));
	});
	
	$.tableView.data = rows;
}

function onRequestAuthClick() {
	var typesToShare = [], typesToRead = [];
	
	Utils.OBJECT_TYPES.forEach(function(objectType) {
		if (objectType.shareRequested) {
			typesToShare.push(objectType.type);
			Utils.log('Share authorization requested for ' + objectType.name);
		}
		if (objectType.readRequested) {
			typesToRead.push(objectType.type);
			Utils.log('Read authorization requested for ' + objectType.name);
		}
	});
	
	if (typesToShare.length === 0 && typesToRead.length === 0) {
		return;
	}
	
	TiHealthkit.requestAuthorization({
		typesToRead: typesToRead,
		typesToShare: typesToShare,
		onCompletion: function(e) {
			if (e.success) {
				updateTable();
			} else {
				alert('User cancelled prompt!');
			}
		}
	});
}

updateTable();
