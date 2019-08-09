// Parameters of controller:
//	navWin: The navigation controller window.
var arguments_to_satisfy_jslint = arguments;

var controllerParams = arguments_to_satisfy_jslint[0] || {};

var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var anchor;
var rows = [];
var unit = TiHealthkit.createUnit('%');

function onTableViewClick(e) {
	// The check marks are simply a visual aid for you to mark the old
	// entries. When a new entry is added to the data store, a new row
	// (without check mark) will be added to the table.
	rows[e.index].hasCheck = true;
}

function onAddClick() {
	var timestamp, quantity;
	
	timestamp = new Date();
	
	// For sake of simplicity, we generate a random number for the value
	// portion of the quantity. Since we are using percentage as the unit,
	// the value is expected to be between 0.0 and 1.0.
	quantity = TiHealthkit.createQuantity(Math.random(), unit);
	
	TiHealthkit.saveObjects({
		objects: [
			TiHealthkit.createQuantitySample({
				type: TiHealthkit.OBJECT_TYPE_BODY_FAT_PERCENTAGE,
				quantity: quantity,
				startDate: timestamp,
				endDate: timestamp
			})
		],
		onCompletion: function(e) {
			if (e.success === false) {
				Utils.showError(e);
			}
		}
	});
}

function deleteSample(sample) {
	TiHealthkit.deleteObject({
		object: sample,
		onCompletion: function(e) {
			if (e.success === false) {
				Utils.showError(e);
			} 
		}
	});
}

function createSampleRow(sample) {
	var row, view, deleteButton, text;
	
	row = Ti.UI.createTableViewRow();
	view = Ti.UI.createView({ height: 40 });
	text = (sample.quantity.valueForUnit(unit) * 100).toString().substr(0,4) + '%';
	Utils.log('Adding row for ' + text);
	view.add(Ti.UI.createLabel({
		text: text,
		top: 0,
		left: 20,
		font: {
			fontSize: 14,
			fontWeight: 'bold'
		}
	}));
	
	view.add(Ti.UI.createLabel({
		text: Utils.formatDateTime(sample.startDate),
		bottom: 0,
		left: 20,
		font: {
			fontSize: 12,
			fontWeight: 'normal'
		}
	}));
	
	deleteButton = Ti.UI.createButton({
		title: 'Delete',
		right: 60,
		width: 80
	});
	deleteButton.addEventListener('click', function(e) {
		deleteSample(sample);
		e.cancelBubble = true;
	});
	
	if (sample.source.bundleIdentifier ===
		TiHealthkit.defaultSource.bundleIdentifier
	) {
		view.add(deleteButton);
	}
	
	row.add(view);
	
	return row;
}

function retrieveSamples() {
	TiHealthkit.executeQuery(TiHealthkit.createAnchoredObjectQuery({
		type: TiHealthkit.OBJECT_TYPE_BODY_FAT_PERCENTAGE,
		// Anchor will be undefined the first time around, which means all
		// the entries up to that point will be returned.
		anchor: anchor,
		onCompletion: function(e) {
			Utils.log('Retrieved ' + e.results.length + ' new entries.');
			
			if (e.results.length === 0 && anchor !== undefined) {
				// No new entry -- this means the update is due to a
				// deletion. We'll have to query all the entries again
				// by resetting the anchor. 
				anchor = undefined;
				rows = [];
				retrieveSamples();
			} else {
				anchor = e.anchor;
				e.results.forEach(function(sample) {
					rows.unshift(createSampleRow(sample));
				});
				$.tableView.data = rows;
			}
		}
	}));
}

var observerQuery = TiHealthkit.createObserverQuery({
	type: TiHealthkit.OBJECT_TYPE_BODY_FAT_PERCENTAGE,
	onUpdate: function(e) {
		// The onUpdate callback will fire immediately after executing the
		// observerQuery if there are matching entries in the data store.
		// After that, the callback will be called every time a matching
		// entry is added or deleted, until the query is finally stopped.
		
		if (e.errorCode !== undefined) {
			Utils.showError(e);
			return;
		}
 
		Utils.log('Received observer query update.');
		retrieveSamples();
	}
});

TiHealthkit.executeQuery(observerQuery);

function onWindowClose() {
	TiHealthkit.stopQuery(observerQuery);
}
