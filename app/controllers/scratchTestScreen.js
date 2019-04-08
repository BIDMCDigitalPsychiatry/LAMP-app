// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * Declarations
 */
var args = $.args;
var vNumber = 1;

/**
 * Function for screen open
 */
$.scratchTestScreen.addEventListener("open", function(e) {
	try {

		var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
		vNumber = versionsInfo.ScratchImage;
		Ti.API.info('scratchTestScreen Open', vNumber);

		setTimeout(function() {
			$.innerImageView.backgroundImage = "/images/scratchImage/" + vNumber + ".png";
			Ti.API.info('$.innerImageView.backgroundImage scratchTestScreen = ' + $.innerImageView.backgroundImage);
		}, 2000);
	} catch(ex) {
		commonFunctions.handleException("scratchTestScreen", "open", ex);
	}

});

/**
 * closeWindowEvent event handler
 */
$.closeWindowEvent = function(e) {
	try {
		Ti.API.info('closeWindowEvent');
		Ti.App.removeEventListener('RefreshImage', RefreshImage);
	} catch(ex) {
		commonFunctions.handleException("ScratchTest", "closeWindowEvent", ex);
	}
};

/**
 * Image refresh event handler
 */
Ti.App.addEventListener('RefreshImage', RefreshImage);
function RefreshImage() {
	var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
	vNumber = versionsInfo.ScratchImage;
	Ti.API.info('RefreshImage', vNumber);
	$.innerImageView.backgroundImage = "/images/scratchImage/" + vNumber + ".png";
}

