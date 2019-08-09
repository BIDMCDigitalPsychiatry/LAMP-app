// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var vNumber = 1;

/**
 * function for screen open
 */
$.scratchTestScreen.addEventListener("open", function(e) {
	try {

		var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
		vNumber = versionsInfo.ScratchImage;

		setTimeout(function() {
			$.innerImageView.backgroundImage = "/images/scratchImage/" + vNumber + ".png";

		}, 2000);
	} catch(ex) {
		commonFunctions.handleException("scratchTestScreen", "open", ex);
	}

});
$.closeWindowEvent = function(e) {
	try {

		Ti.App.removeEventListener('RefreshImage', RefreshImage);
	} catch(ex) {
		commonFunctions.handleException("ScratchTest", "closeWindowEvent", ex);
	}
};
Ti.App.addEventListener('RefreshImage', RefreshImage);
function RefreshImage() {
	var versionsInfo = Ti.App.Properties.getObject('GameVersionNumber');
	vNumber = versionsInfo.ScratchImage;

	$.innerImageView.backgroundImage = "/images/scratchImage/" + vNumber + ".png";
}

