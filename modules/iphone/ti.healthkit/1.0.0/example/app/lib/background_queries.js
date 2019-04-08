var TiHealthkit = require('ti.healthkit');
var Utils = require('utils');

var heartRateObserverQuery = null;
var heartRateCallback;
var heartRateAnchor;
var heartRateSamples = [];

function setHeartRateCallback(callback) {
	heartRateCallback = callback;
}
exports.setHeartRateCallback = setHeartRateCallback;

function retrieveHeartRateSamples(completionToken) {
	TiHealthkit.executeQuery(TiHealthkit.createAnchoredObjectQuery({
		type: TiHealthkit.OBJECT_TYPE_HEART_RATE,
		// Anchor will be undefined the first time around, which means all
		// the entries up to that point will be returned.
		anchor: heartRateAnchor,
		onCompletion: function(e) {
			Utils.log('Retrieved ' + e.results.length + ' new entries.');
			
			if (e.results.length === 0 && heartRateAnchor !== undefined) {
				// No new entry -- this means the update is due to a
				// deletion. We'll have to query all the entries again
				// by resetting the anchor. 
				heartRateAnchor = undefined;
				heartRateSamples = [];
				retrieveHeartRateSamples();
			} else {
				heartRateAnchor = e.anchor;
				e.results.forEach(function(sample) {
					heartRateSamples.unshift(sample);
				});
				if (heartRateCallback) {
					heartRateCallback({
						success: true,
						samples: heartRateSamples
					});
				}
			}
			
			if (completionToken !== undefined) {
				TiHealthkit.callObserverQueryCompletionHandler(completionToken);
			}
		}
	}));
}

function startHeartRateObserverQuery() {
	if (heartRateObserverQuery) {
		Utils.log('Heart rate observer query is already running.');
		return;
	}
	
	heartRateObserverQuery = TiHealthkit.createObserverQuery({
	type: TiHealthkit.OBJECT_TYPE_HEART_RATE,
	onUpdate: function(e) {
		// The onUpdate callback will fire immediately after executing the
		// observerQuery if there are matching entries in the data store.
		// After that, the callback will be called every time a matching
		// entry is added or deleted, until the query is finally stopped.

		Utils.log('Received observer query update.');
		
		if (e.errorCode !== undefined) {
			if (heartRateCallback) {
				heartRateCallback(e);
			}
			if (e.completionToken !== undefined) {
				TiHealthkit.callObserverQueryCompletionHandler(e.completionToken);
			}
		} else {
			retrieveHeartRateSamples(e.completionToken);
		}
	}});
	
	TiHealthkit.executeQuery(heartRateObserverQuery);
}
exports.startHeartRateObserverQuery = startHeartRateObserverQuery;

function getHeartRateSamples() {
	return heartRateSamples;
}
exports.getHeartRateSamples = getHeartRateSamples;

function stopHeartRateObserverQuery() {
	if (!heartRateObserverQuery) {
		Utils.log('Heart rate observer query is not running.');
		return;
	}

	TiHealthkit.stopQuery(heartRateObserverQuery);
	heartRateObserverQuery = null;
}
exports.stopHeartRateObserverQuery = stopHeartRateObserverQuery;

function isHeartRateQueryRunning() {
	return heartRateObserverQuery !== null;
}
exports.isHeartRateQueryRunning = isHeartRateQueryRunning;
